---
layout: post
title: Get through corporate proxy - any host any protocol
date: '2014-09-24 08:30:00'
tags:
- tutorial
- putty
- azure
---

## Prerequisites

1. Install [putty](http://www.putty.org/)
2. Install favorite Linux machine on [Azure portal](https://portal.azure.com/)
3. Install and configure [Cntlm](http://cntlm.sourceforge.net/)

## Enable endpoint
In azure portal (old or new one) you need to modify SSH endpoint to port 443
![azure endpoints](http://res.cloudinary.com/piotrstapp/image/upload/c_scale,w_640/v1411544922/azure-endpoint_ecggjb.png)

## SSH using putty

1. Open putty and in host name write: YOURMACHINE.cloudapp.net
2. In port set 443 instead of 22
3. Open Connection->proxy in side bar and fill it with cntlm settings like bellow ![putty proxy ](http://res.cloudinary.com/piotrstapp/image/upload/v1411545783/putty-proxy_qwsw87.png)
4. Save your session and log in to YOURMACHINE.cloudapp.net to check connection
5. If above is working, load saved session
6. Open Connection->SSH->Tunnels in proxy and fill it for example like below ![putty forward ](http://res.cloudinary.com/piotrstapp/image/upload/v1411546203/putty-forward_in21bs.png)
7. Save your session and in my example do RDP using localhost:2222 as Computer
8. If you need "full" Internet access without proxy limits just use dynamic port forwarding like describe in [DYNAMIC SSH TUNNELING WITH PUTTY TO SECURE WEB TRAFFIC](http://blog.buttewifi.com/2010/01/dynamic-ssh-tunneling-with-putty-to-secure-web-traffic/)


![happy nerd](http://res.cloudinary.com/piotrstapp/image/upload/v1411547329/putty_azure_nerd_uef15n.png)