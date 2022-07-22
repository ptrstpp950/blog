---
layout: post
title: Run vagrant on your Windows
date: '2014-09-05 21:00:00'
tags:
- vagrant
- tutorial
- devops
---

####Prerequisites 
1. Windows machine :)
2. Install vagrant form https://www.vagrantup.com/downloads.html
3. Install git with tools (or other ssh.exe client) + add folder to PATH. In powershell just invoke 
`$env:PATH +=";C:\Program Files (x86)\Git\bin"`
4. Configure folder for boxes. 
It is useful when you want to work in offline mode. The easy way is to create mklink to store files in same place. Start cmd as admin and run (of course change second path to proper one):
`mklink /D c:\vagrantfiles d:\downloads\vagrantfiles`
5. Download Oracle VM VirtualBox from https://www.virtualbox.org/ (or other prefered virtualization product). Vagrant already supports Virtualbox, VMWare and Hyper-V :)


####Validate instalation
1. Create new folder. Let's call it test-vagrant
2. Enter it and type: `vagrant init`
3. Open Vagrantfile in your favorite notepad and:
  * Change the box name
  * Add url to the box like:
  `config.vm.box_url = "file:///c:/vagrantfiles/CentOS-6.4-i386-v20131103.box"`
4. Run `vagrant up` to create and start the VM
5. Run `vagrant ssh` to validate if it is working
6. Run `vagrant destroy` to delete the machine