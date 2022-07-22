---
layout: post
title: Private npm registry with fallback to global registry
image: "/content/images/2016/01/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f3939393131332f313739353535332f36383031373762322d366131642d313165332d383265312d3032313933616134653332652e706e67.png"
date: '2016-01-13 16:01:15'
tags:
- nodejs
- devops
---

##The requirement
From time to time we need to use npm packages on following machines:

- Continuous Integration build agent
- with no access to internet (usually CI agent)
- with slow internet proxy

Moreover as Windows developers we have Windows servers.

##Prerequisites
There are few mostly obvious prerequisites. I will list them to make sure You won't forget about anything:

- Windows server (or Linux one) - can be a simple virtual machine
- Installed nodejs from https://nodejs.org/
- Installed and configured CTLM (if your proxy need this)


##Sinopia
[Sinopia](https://www.npmjs.com/package/sinopia) is a private/caching npm repository server.
To install it just run:
```
npm install sinopia -g
```
To "run" it just create a new directory, enter it and start sinopia
```
mkdir sinopia
cd sinopia
sinopia
```

Two important things just happened:

1. In your profile a `config.yaml` file was created (something like `C:\Users\XXXXXX\AppData\Roaming\sinopia\config.yaml`)
2. The server started on default port (enter URL in browser to see it)

Config in global dir is cool but useless. So let's copy it to current dir and run sinopia with:
```
sinopia.cmd --config .\config.yaml
```

##Useful configuration
There are some points we should add or change in configuration:

- Changing the port to "normal" one like 80 or 8080. In the end of `config.yaml` we need to add:
```
listen:
 - 0.0.0.0:80              # listen on all addresses (INADDR_ANY)
```
- Add proxy with
```
http_proxy: http://localhost:3128/
https_proxy: http://localhost:3128/
no_proxy: localhost,127.0.0.1
```
- Depends on your proxy change `https://registry.npmjs.org/` to `http://registry.npmjs.org/`


To verify if everything above is working just run again: 
```
sinopia.cmd --config .\config.yaml
```

##Create a Windows service
Because I mainly work on Windows environment I need to run above a Windows service.
I decided to use [winser package](https://www.npmjs.com/package/winser). 
The easiest usage is to create `package.json` and add commands in it.

##Sum up
All above stuff and changes I put in simple [github repo](https://github.com/ptrstpp950/sinopia-windows). If you find any error contact me and I will fix it. Just clone, fix port if you need and run `npm install` as windows administrator.


