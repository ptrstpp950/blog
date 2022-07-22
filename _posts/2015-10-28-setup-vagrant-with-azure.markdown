---
layout: post
title: Setup vagrant with Azure - step by step guide
image: "/content/images/2015/10/vagrant_chilling.png"
date: '2015-10-28 12:12:31'
tags:
- vagrant
- tutorial
- azure
---

Setup Vagrant with Azure is not complicated, but require a lot of steps, especially if you never configure azure using command line  
##Prerequisites 
First of all we need some tools:

- Vagrant (https://www.vagrantup.com/downloads.html) (at least 1.7.2)
- NodeJS + NPM
- Git (for openssl.exe) or puttygen
- Azure account :)
- Powershell or other command line tool :)

##Setup Azure CLI
[Azure CLI](http://azure.microsoft.com/en-us/documentation/articles/command-line-tools/) will help us to create virtual machine in Azure. We will setup credentials and certificate, which we use in vagrant.
Installation is quite simple:

     npm install azure-cli -g

Then we have to run

    azure account download

Above command is completely insane, because it opens browser to download file from azure. So instead of it you can just download file from URL. The only reason to use above is that URL changes from time to time:)

Anyway save `publishsettings` to disk as `azure.publishsettings` and import it using:

    azure account import [PATH]\azure.publishsettings

After import I suggest you to delete above file, because it contains sensitive information.

In the end I suggest to remove account info, becaue all the date can be ease retrieve from `[HOME_DIR]\.azure\azureProfile.json`. The command is:

    azure account clear

Subscription id (guid) is also needed. To get it run:

    azure account list
and copy `Id` column calue

The next step is to find out, which Virtual Machine will we use. To find for example Windows 2012 R2 DataCenter we can run:

    azure vm image list | Select-String "Datacenter" | Select-String "2012"

We need to remember `data` id like: `a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-20150916-en.us-127GB.vhd`    

We will also need location, so let's run:

    azure vm location list

And choose one. In my case it will be `North Europe`

##Generate keys for Azure
Now we need to generate key pair for Azure. We will need `pem` file with public-private key pair and `cer` file to upload with public key. 
Generation can be done with `openssl.exe` (located in `C:\Program Files (x86)\Git\bin\openssl.exe`) or `puttygen.exe`. 
Command for openssl are straightforward, so I will use them. First set openssl config file as environment variable, than run generation (assuming that openssl.exe is in PATH):


    $env:OPENSSL_CONF="C:\Program Files (x86)\Git\ssl\openssl.cnf"
    
    openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $HOME/.ssh/azurevagrant.key -out $HOME/.ssh/azurevagrant.key
    
    openssl x509 -inform pem -in $HOME/.ssh/azurevagrant.key -outform der -out $HOME/.ssh/azurevagrant.cer
    
Now we need to upload  `azurevagrant.cer` to azure. Open in browser https://manage.windowsazure.com/#Workspaces/AdminTasks/ListManagementCertificates and click *Upload certificate* button. Select file from `$HOME/.ssh/azurevagrant.cer`

##Vagrant install azure plugin
It is simple command (unless you are not in the proxy environment):

    vagrant plugin install vagrant-azure

##Vagrant file
We are almost in the end. Now we need to create vagrant file like following:


	Vagrant.configure('2') do |config|
		config.vm.box = 'azure'
		config.vm.boot_timeout = 1200

		config.vm.provider :azure do |azure|

			#full path to pem file
			azure.mgmt_certificate = File.expand_path('~/.ssh/azurevagrant.key')
			azure.mgmt_endpoint = 'https://management.core.windows.net'
			
			##to get this run: azure account list
			azure.subscription_id = 'YOUR SUBSCRIPTION ID'
			
			azure.storage_acct_name = 'azurevagrant' # optional. A new one will be generated if not provided.

			##to get this run: azure vm image list | Select-String "Datacenter" | Select-String "2012"
			azure.vm_image    = 'a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-20150916-en.us-127GB.vhd'

			azure.vm_user = 'vagrant' # defaults to 'vagrant' if not provided
			azure.vm_password = 'vagrant123#@!' # min 8 characters. should contain a lower case letter, an uppercase letter, a number and a special character

			azure.vm_name = 'azurevagrant' # max 15 characters. contains letters, number and hyphens. can start with letters and can end with letters and numbers
			azure.cloud_service_name = 'azurevagrant' # same as vm_name. leave blank to auto-generate

			##to get this run: azure vm location list
			azure.vm_location = 'North Europe'
			
			azure.tcp_endpoints = '3389:53389' # opens the Remote Desktop internal port that listens on public port 53389. Without this, you cannot RDP to a Windows VM.
			azure.winrm_https_port = 5986

			azure.winrm_transport = %w(https)
	  end
	  
	end

Before final run we have to add azure box - don't be afraid it is almost empty file:

    vagrant box add azure https://github.com/msopentech/vagrant-azure/raw/master/dummy.box

And install azure-vagrant plugin with 

     vagrant plugin install vagrant-azure

##Final command
Enter the directory with `Vagrantfile`. Modify subscription id and run:

    vagrant up --provider=azure