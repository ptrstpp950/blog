---
layout: post
title: 3 simple steps to install minikube on Azure VM
image: "/content/images/2018/11/maximilian-weisbecker-121294-unsplash.jpg"
date: '2018-11-17 09:25:52'
tags:
- k8s
- azure
- tutorial
---

## Step 0 - why

If you want to play with K8S MiniKube is the best option. Still, you don't believe that K8S will survive the next few years? And you don't want to install "new crap" on your PC? Using VM in a cloud is a good option :)

## Step 1 - setup machine
First of all, we need a shiny machine with nested virtualization. Not all of them will be able to handle nested virtualization. As I remember you need a machine with `v3` suffix, for example, `Standard D2s v3` will do the job.
To be sure that nested virtualization is available, run:
```
lscpu | grep -i virtual
```
You should see something like:
```
Virtualization:      VT-x
Virtualization type: full
```
If the output is empty, choose another one. The operating system I suggest Ubuntu. And after install run:
``` 
sudo apt-get update
```
just to make your machine updated to latest patches.

## Step 2 - install Virtualbox
For the MiniKube we need a hypervisor to run Kubernetess. The easiest way is to install VirtualBox. First, we need to add repository key:
```
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.as
c -O- | sudo apt-key add -
```
Then install it with:
```
sudo apt install virtualbox
```

## Step 3 - install MiniKube
To check latest version go to: https://github.com/kubernetes/minikube/releases

Then run (replace `v.0.30.0` with the latest version):
```
curl -Lo minikube https://storage.googleapis.com/minikube/relea
ses/v0.30.0/minikube-linux-amd64
chmod +x minikube
sudo mv minikube /usr/local/bin/
```
Now you are ready to run MiniKube:
```
sudo minikube start --vm-driver=virtualbox
```
This will take a while. Moreover, the above command suggests installing `kubectl`, which is the main tool for managing K8S. So do as it suggests with the command (copy it from output):
```
curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.10.0/bin/linux/amd64/kubectl && chmod +x kubectl && sudo cp kubectl /usr/local/bin/ && rm kubectl
```
There is also a "full" instruction on [official site](https://kubernetes.io/docs/tasks/tools/install-kubectl/), but above command is good enough.

To check if everything is fine:
```
sudo kubectl run hello-world --image=k8s.gcr.io/echoserver:1
.4 --port=8080
sudo kubectl expose deployment hello-world --type=NodePort
```
Now wait a bit (30 seconds) and run:
```
curl $(sudo minikube service hello-world --url)
```
You should see "echo" server page, if not repeat after a while.

## The end
Now you can play _safety_ with MiniKube. Have fun!

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@maximilianweisbecker?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Maximilian Weisbecker"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Photo by Maximilian Weisbecker</span></a>