---
layout: post
title: 'Docker: Windows containers on Windows host - step by step'
image: "/content/images/2016/05/docker_header1.png"
date: '2016-05-29 18:39:03'
tags:
- windows
- docker
---

For more than one year Windows developers can hear about Docker stuff. But after few sentences how docker is great there is one important sentence:

> Nowadays we can run only docker containers on Linux. There is no way to run Windows containers.

or
> Docker Engine for Windows Server requires Windows Server 2016. You can try Preview to test it. 

Few days ago above statements __outdated__. <mark>Are you ready to run it on your Windows 10? </mark>

##Prerequisites
To have fun with Windows containers you need Windows 10 Insider Preview. I describe how to get it in [How to setup Bash and Ubuntu on Windows - step by step guide](http://stapp.space/how-to-setup-bash-on-windows/)
After you have it check out if you already install version 14352 or greater.

The second way is to install Windows Server 2016 technical preview - as I remember from version 4 containers are available.

Having one of above versions we are ready to deploy a simple Hyper-V container. 

##Small tip before we start
Most commands we will run in elevated PowerShell. I usually, forget to run it. But few months ago I described how to [run `sudo` command in Windows](https://stapp.space/sudo-under-windows/). Using `sudo` I can run `sudo powershell` and use `up arrow` to rerun command as admin.

##Enable Hyper-v and containers feature
If you didn't play with Hyper-v on your machine before, this step is most complicated.
To enable Hyper-v in modern laptops usually we have to access BIOS. For example in Lenovo, I have to find a special hidden button to enter BIOS. Tricky!

When you are ready, start PowerShell as Administrator and run:
```
Enable-WindowsOptionalFeature -Online -FeatureName containers –All
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V –All
``` 
The first command will install containers feature and the second Hyper-v stuff.
Now reboot if needed :)

##Install docker
Containers needs docker. To install it we can run following commands:
```
$dockerDir = "$env:ProgramFiles\docker\"
New-Item -Type Directory -Path "$dockerDir\docker\"
Invoke-WebRequest https://aka.ms/tp5/b/dockerd -OutFile $dockerDir\dockerd.exe
Invoke-WebRequest https://aka.ms/tp5/b/docker -OutFile $env:ProgramFiles\docker\docker.exe

[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$dockerDir\Docker", [EnvironmentVariableTarget]::Machine)
$env:Path = $env:Path + ";$dockerDir\Docker"
```
First three lines will download "special" docker. 
Last two commands will add docker path for future and current session use.


Now we can install docker as a service (maybe DaaS will be next famous shortcut?) and start it: 
```
dockerd --register-service
Start-Service Docker
```

##Base image - NanoServer

We are ready now to install base container image: NanoServer. NanoServer is the "smallest" version on Windows Server 2016. It doesn't have GUI :)
Few simple commands and we are ready:
```
Install-PackageProvider ContainerImage -Force
Install-ContainerImage -Name NanoServer
Restart-Service docker
```
**Attention:** If you have a problem with running commands run `Set-ExecutionPolicy Bypass -scope Process` to change execution policy in current PowerShell process.

To check if everything is OK, invoke:
```
docker images
```
you should see something like:
```
REPOSITORY   TAG              IMAGE ID      CREATED      SIZE
nanoserver   10.0.14300.1010  9db95268a387  9 weeks ago  817.1 MB
```

##Deploy
Now we are ready to deploy container. At first, we need to mark our image as `latest` using:
```
docker tag nanoserver:10.0.14300.1010 nanoserver:latest
```

And our final commands are:
```
docker pull microsoft/sample-dotnet
docker run --isolation=hyperv --rm microsoft/sample-dotnet
```

Hurrah, we just run our first container. To be sure that we are running Windows not Linux try another one:
```
docker run --isolation=hyperv --rm  -it nanoserver powershell
```
Which will run `powershell` on NanoServer image. For example use `ls` and find out what directories you have on Nano Server

##What's next?

Next time I will show how to deploy normal IIS and old .NET version (like 3.5 or 4.5) on docker images. Follow me on twitter, facebook or RRS.
Stay tuned!