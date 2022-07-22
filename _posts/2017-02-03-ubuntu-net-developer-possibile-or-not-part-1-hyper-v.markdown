---
layout: post
title: Ubuntu .NET developer - possibile or not? - part 1 - Hyper-V
image: "/content/images/2017/02/dualboot-ubuntu-windows.png"
date: '2017-02-03 08:15:04'
tags:
- dotnet
- ubuntu-net
---

A long time ago when I was a student I was using Linux side by side with Windows. Dual boot was standard, and I cursed myself many times, just because I launched a wrong operating system. My professional career caused that I forgot about Linux, except SSH console from putty or Git. To be fair, I was sure that Linux won't come back on my PC. But one day some magic happened in Microsoft world. NET Core, bash on Windows, Visual Studio Code, SQL Server on Linux. Is it time to come back?

## Before we start
First of all, you don't have to install Ubuntu or any other Linux distribution on a physical machine. Virtual one should be enough to check if everything is working fine. I will use Ubuntu because it is the most popular distribution of Linux. 
I will use Hyper-V because virtual machine for an experiment is better - one click, and it is gone. If you prefer to use VirtualBox or VMWare feel free. For this experiment you can use the technology, which you like most.

## Preparation
First of all, we need Ubuntu. You can download it from the [official website](https://www.ubuntu.com/download/desktop). When an ISO is downloading, we can enable Hyper-V. There is a good guide from Microsoft: [Install Hyper-V on Windows 10](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). A restart will be needed, so be careful if you are downloading the file in the background.

## Linux installation
It is a piece of cake. Open Hyper-V, go through the wizard. On the third screen, you can select Generation 2. But this is optional. Generation 1 will be good enough. I suggest you assign more than 1024MB RAM but don't worry you can change this value later.
On the last step, please select downloaded ISO.
Now **important** step before you start the new shiny Virtual Machine. On Hyper-V settings, you have to uncheck `Enable Secure Boot` in the Security tab:

<img src="/content/images/2017/02/hyperv-boot-security.png" style="max-width:80%"/>

Without above your machine won't boot from downloaded ISO.
Ubuntu installation is a classic wizard process. Next, next, next and you are done. After a while, we will see beautiful shiny Ubuntu desktop. Hurray!

## Installing VS Code
Go to https://code.visualstudio.com/ and download `deb` package and run it. I'm still surprised that I didn't install Visual Studio Code from the terminal.

## Hyper-v and Ubuntu resolution
I don't know why Ubuntu on Hyper-V ends with 1152x864 and I cannot change it inside the virtual machine. Previous steps were ok, but I want to code in a full screen mode. To change the resolution, we need some magic tricks. We need to edit `/etc/default/grub`. If you know how to use `vi` or `nano` text editor just run
``` 
sudo vi /etc/default/grub
```
The alternative option is to use a graphic text editor like Visual Studio Code. I didn't manage to launch the latest version of Code as sudo because it needs additional parameter which just doesn't work. We can temporary change permissions to above file with chmod command.
Anyway I need to replace one line from `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"`to `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"`. After saving the file there are two commands to launch in the terminal:
```
sudo update-grub
reboot
```
The machine should launch in the new resolution, so working with it will be a pleasure.

## .NET Core
Installing .NET Core is the last thing for today. Go to https://www.microsoft.com/net/core#linuxubuntu and choose the appropriate version. In my case, it is Ubuntu 16.04:
```
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
```
Above only configure package source and now we can install .NET Core, but please check current version on the official website.
```
sudo apt-get install dotnet-dev-1.0.0-preview2.1-003177
```

## Next time
In the next post, I will  create, compile and debug a simple app on host (Windows) and guest (Ubuntu) environment. Of course with SQL Server installed.

If you don't want to miss next post ==follow me using bellow buttons==.