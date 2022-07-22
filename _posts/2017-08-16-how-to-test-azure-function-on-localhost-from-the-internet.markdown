---
layout: post
title: How to test azure function on localhost from the Internet?
image: "/content/images/2017/08/pablo--2-.png"
date: '2017-08-16 14:52:22'
tags:
- azure
---

What a stupid question, isn't it? You can answer like I would use my public IP and setup proxy on IIS to access it. Isn't good enough?

As I (and probably you) know life is not so simple there are firewalls, NATs and more security tools which destroy developers life;)

## Secure tunnels to localhost
To make life easier we can use some kind of tunnels to localhost. For example [ngrok](https://ngrok.com/). If you never used it before a short list of features below:

- HTTP(S) tunnels
- TCP tunnels
- TLS tunnels
- custom domain and custom prefix support in paid plans

## Setup with Azure function
The setup is piece of cake. Download it from the [official website](https://ngrok.com/download). Run `.\ngrok authtoken aaa` to generate a config file. Its location will be printed as output. In 99% cases it is `C:\Users\[my user name]\.ngrok2\ngrok.yml`.
Now open it in your favourite editor and replace content with following:
```
tunnels:
  azurefunction:
    proto: http
    addr: 7071
    host_header: localhost
```
You have just configured running ngrok with protocol http and https on port 7071, with rewrite host header to localhost on the template called `azurefunction`.
Now last two steps. Run your Azure function on localhost from Visual Studio with F5 and in PowerShell (or cmd) type:
```
.\ngrok.exe start azurefunction
```
After a while, in the output you will see your current Internet domain for tests. It will apper in `Session Status` column. Moreover, you can access ngrok portal on `http://127.0.0.1:4040` like below

![](/content/images/2017/08/ngrok-1.png)

Have fun!

p.s. Of cource you can also debug your Azure function deployed to Azure. But in my opinion, this way is faster.
