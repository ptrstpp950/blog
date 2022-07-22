---
layout: post
title: Vagrant provisioning using shell - how to setup storm project
date: '2014-09-06 08:16:00'
tags:
- vagrant
- tutorial
- devops
- storm
---

###Provisioning in Vagrant
There is a lot of choices when you want to provision your virtual machine with vagrant:
1. Run scripts manually - completely **insane** idea
2. Run shell scripts inline or not
3. Use chef or puppet

The first one is good only for testing, trying, ..., but it is insane if you want to provision all machines like this.

The second one is looks quite optimistic, especially if you don't know what are tools from third point.

Today I will try to present how to setup [storm project](https://storm.incubator.apache.org/) on vagrant machine using only shell provisioning. To simplify the operation I will use tutorial from Hortonworks: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm.html
1000 words which describe my work looks like:
![setup storm with vagrant in bash](http://res.cloudinary.com/piotrstapp/image/upload/c_scale,w_600/v1410034157/vagrant_storm2_ha7xwb.png)

###Step .0. Choosing and preparing machine
First we need to create directory and init vagrant so let's do this:
```
mkdir storm-vagrant
cd  storm-vagrant
vagrant init
```
I will use centos box which I downloaded before (you can use URL instead of file). Why Centos you asked? Because in many companies the only allowed Linux is Red Hat. Centos is closed enough. So let's add the box:

```
 vagrant box add "centos-6.5" file:///c:/vagrantfiles/CentOS-6.4-i386-v20131103.box
```
In vagrant file we need to change our box name so 
`config.vm.box = "base"` becomes `config.vm.box = "centos-6.5"`
###Step .1. Configure network
We will need network access to guest machine. It can be done in two ways:
1. Using port forwarding
2. Setting IP adress for guest machine.

I will add code to enable private network in machine so vagrantfile will look like below.:
```
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "centos-6.5"
  config.vm.network "private_network", ip: "192.168.33.10"
```
**Caution:** In next code listings I will only append above lines.

Now we are ready to run:
```
vagrant up
```

After the above command is complete (don't worry about read color on console), let's explore our box. Run `vagrant ssh` and you are inside. Check what you want and logout from the machine.


###Step .2. Installing storm rpms.
According to [" Chapter 1. Getting Ready to Install"](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/rpm-chap1.html) we need to configure remote repositories. For Centos 6 the line is:
```
wget -nv http://public-repo-1.hortonworks.com/HDP/centos6/2.x/updates/2.1.5.0/hdp.repo -O /etc/yum.repos.d/hdp.repo 
```

So let's change our vagrant file to (first two lines already exist in our file):
```
  config.vm.box = "centos-6.5"
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.provision :shell, :inline  => "wget -nv http://public-repo-1.hortonworks.com/HDP/centos6/2.x/updates/2.1.5.0/hdp.repo -O /etc/yum.repos.d/hdp.repo"

```

According to [ Chapter 17.1 Install the Storm RPMs.](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm-1.html) we can install storm rpm with 
```
yum install storm
```
but above command will prompt as if we are sure to download storm + zookeeper (yes storm needs zookeeper to run). To avoid prompt just add `-y` to the command. So vagrant file will evolve to:
```
config.vm.box = "centos-6.5"
  config.vm.provision :shell, :inline  => "wget -nv http://public-repo-1.hortonworks.com/HDP/centos6/2.x/updates/2.1.5.0/hdp.repo -O /etc/yum.repos.d/hdp.repo"
  config.vm.provision :shell, :inline  => "yum -y install storm"
```

To call above provisioning we have to choices:
1. Run `vagrant destroy` and again `vagrant up` - if we do too much manual changes in previous steps
2. Or just `vagrant provision` to run only provisioning on running box

### Step .3. Running zookeeper
**Zookeeper? Why?** -you think now. Storm need zookeeper to comunicate between its nodes. The second line of last chapter: [5.  Validate the Installation](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm-5.html) is:
> You must start ZooKeeper before starting Storm.

First we need Java (for storm and zookeeper). I prefer Java 7 form Sun, so I just downloaded rpm form [official page](http://www.oracle.com/technetwork/java/javase/downloads/index.html) to vagrant folder. In recipe please add:
```
 config.vm.provision :shell, :inline  => '
	javarpm="$(ls /vagrant/ | grep "^jdk.*.rpm" | tail -1)"
	echo $javarpm
	rpm -Uvh /vagrant/$javarpm
	java -version'
```
Please notice that I have to change `"` into `'`. The second option will be escape `"` with `\"`

Then we need to create dirs as it is explain in [Chapter 5.2: Set Directories and Permissions](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/rpm-zookeeper-2.html). I created a file `directories.sh` with below content. It should be placed side-by-side to Vagrantfile:
```
#!/bin/sh

# Directory where ZooKeeper will store data. For example, /grid1/hadoop/zookeeper/data
export ZOOKEEPER_DATA_DIR="/grid1/hadoop/zookeeper/data";
# Directory to store the ZooKeeper configuration files.
export ZOOKEEPER_CONF_DIR="/etc/zookeeper/conf";
# Directory to store the ZooKeeper logs.
export ZOOKEEPER_LOG_DIR="/var/log/zookeeper";
# Directory to store the ZooKeeper process ID.
export ZOOKEEPER_PID_DIR="/var/run/zookeeper";
```
*Caution:* If you are on Windows host, remember to change line ending to Unix style to avoid `: command not found` printing on console during login to guest machine

And do provisioning below with all steps mention in zookeeper chapter (creating dirs, set zookeeper node id and start it). 
```
config.vm.provision :shell, :inline   => "
	yes | cp /vagrant/directories.sh /etc/profile.d/directories.sh
	chmod 755 /etc/profile.d/directories.sh"

config.vm.provision :shell, :inline  => "
	mkdir -p $ZOOKEEPER_LOG_DIR;
	chown -R $ZOOKEEPER_USER:$HADOOP_GROUP $ZOOKEEPER_LOG_DIR;
	chmod -R 755 $ZOOKEEPER_LOG_DIR;
	
	mkdir -p $ZOOKEEPER_PID_DIR;
	chown -R $ZOOKEEPER_USER:$HADOOP_GROUP $ZOOKEEPER_PID_DIR;
	chmod -R 755 $ZOOKEEPER_PID_DIR;
	
	mkdir -p $ZOOKEEPER_DATA_DIR;
	chmod -R 755 $ZOOKEEPER_DATA_DIR;
	chown -R $ZOOKEEPER_USER:$HADOOP_GROUP $ZOOKEEPER_DATA_DIR
	
	echo '1' >> $ZOOKEEPER_DATA_DIR/myid
	
	su - zookeeper -c 'source /etc/zookeeper/conf/zookeeper-env.sh ; export ZOOCFGDIR=/etc/zookeeper/conf;/usr/lib/zookeeper/bin/zkServer.sh start >> /var/log/zookeeper/zoo.out 2>&1'"
```
To check if ZooKeeper is running we need to login to our box and run:
```
ps aux | grep zookeeper
```
Is process does not exist just check:
```
cat /var/log/zookeeper/zoo.out
```


### Step .4. Configure Storm
After reading [17.2. Configure Storm](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm-3.html) a new file is needed: `storm.yaml`. Because everything will be on one machine I will set `ZOOKEEPER_SERVERS` and `NIMBUS_HOSTNAME` to `localhost`. Create a `storm.yaml` again side-by-side to vagrantfile with following content:
```
storm.zookeeper.servers:
    - localhost

nimbus.host: localhost

drpc.servers:
    - "localhost"

storm.local.dir: /tmp/storm/local

logviewer.port: 8081
```
and copy it into `/etc/storm/conf/storm.yaml`. The above file is located in shared `/vagrant` directory.

Both above modification in vagrantfile:
```
[...]
  config.vm.provision :shell, :inline  => "yum -y install storm"
  config.vm.provision :shell, :inline  => "
    mkdir -p  $STORM_LOCAL_DIR
    chown -R storm:storm $STORM_LOCAL_DIR
   chmod -R 755 $STORM_LOCAL_DIR
   
   cp -f /vagrant/storm.yaml /etc/storm/conf/storm.yaml"
```
**Attention:** I added `mkdir -p  $STORM_LOCAL_DIR` because this folder wasn't create on destination machine.

The last step is to add proper exports in `direstories.sh` file:
```
#storm local dir
export STORM_LOCAL_DIR="/tmp/storm/local";
```
To validate install we should login to guest and run:
```
sudo su - storm
storm nimbus
```
The expected output is something similar to:
```
/usr/bin/storm: line 2: /etc/default/hadoop: No such file or directory

Running: java -server -Dstorm.options= -Dstorm.home=/usr/lib/storm   [...snip...] backtype.storm.daemon.nimbus
```
Don't be afraid about first line. We won't need Hadoop at all, but Hortonworks installation files assume that we install it everywhere.


###Step .5.  Configure Process Controller 
The optional 3 chapter I omit because we don't need it now - we didn't secure zookeeper. What is interesting we didn't do anything about zookeeper - let's back to this later. Just believe me.

In chapter [4. Configure Process Controller](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm-4.html) there is a mention about tool called *supervisord*. If we check it using `yum search supervisord` we won't find it in enabled repositories. To install it we need EPEL repo with

```
cd /tmp
wget http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
sudo rpm -Uhv epel-release-6-8.noarch.rpm
```
and then run: `yum install -y supervisor`. Because `supervisor.conf` can contain password it is suggested to mark it with *600*


So in vagrant file we have to add above (remember with `-y` in yum command):
```
config.vm.provision :shell, :inline  => "
	cd /tmp  
	wget http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm  
	sudo rpm -Uhv epel-release-6-8.noarch.rpm  
	yum install -y supervisor
 	sudo chmod 600 /etc/supervisord.conf"
```

Let's run the machine (with `vagrant provision`), login to it and copy default conf file: `sudo cp /etc/supervisord.conf /vagrant`. In copied file we can append lines from  [4. Configure Process Controller](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/ch_rpm_storm-4.html). 

After this step we need to add copy back this file in provisioning:
```
config.vm.provision :shell, :inline  => "
	yes | cp /vagrant/supervisord.conf /etc/supervisord.conf
	/etc/init.d/supervisord restart"
```
**Remember**: `supervisord.conf`, `storm.yaml` and `vagrantfile` are integral parts of our recipe

### Step.6. Opening ports

The last part will be open ports for storm-ui, which is by default 8080. We should add line in `/etc/sysconfig/iptables` file and restart iptables. The file will look like (remember about UNIX line endings):

```
# Firewall configuration written by system-config-firewall
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```
And provisioning is:
```
  config.vm.provision :shell, :inline  => "
	yes | cp /vagrant/iptables /etc/sysconfig/iptables
	/etc/init.d/iptables restart"
```
Then run `vagrant provision` for the last time.

### Step.7. Check installation
At least we check if everything is working. Just open your favorite browser on http://192.168.33.10:8080/ and you should see Storm UI web page. If there is a connection error you can:
1. Wait a while - it need some time to start :)
2. Check logs in `/var/log/storm` and `/var/log/zookeeper`
3. Recreate your machine with running `vagrant destroy` and then `vagrant up`

That all. Next time I will show how to use better provisiong than shell, because as you probably notice shell provisionig works, but is quite *ugly* and has a lot of harcoded stuff.
