---
layout: post
title: Cheapest FTP on Azure
image: "/content/images/2017/08/pablo--1-.png"
date: '2017-08-09 10:32:00'
tags:
- azure
---

Azure has a storage, to be precise a cheap storage, but there isn't an FTP as a service. Still today, some companies want to integrate using FTP instead of anything else. So what we can do?

## Virtual Machine
If you search, the most results will suggest using VM on which you can install something to have an FTP server. For example, you can install [IIS with FTP module](https://blogs.msdn.microsoft.com/mast/2013/12/12/setting-up-a-passive-ftp-server-in-windows-azure-vm/) or [Ubuntu with vsftpd](https://blogs.technet.microsoft.com/taehee/2016/09/05/how-to-use-azure-linux-vm-as-an-ftp-server/).
Whatever you choose this solution is bad because you will have to pay for the VM at least ~30EUR/month for the cheapest one.

## Website with backend
The second option which I found is install something on the Azure App Service and use blob as a storage. Example working stuff is [nodeftpd](https://www.npmjs.com/package/nodeftpd) with [azure-storage-fs](https://www.npmjs.com/package/azure-storage-fs) (from [StackOverflow](https://stackoverflow.com/questions/39992173/ftp-to-azure-blob-storage)). This solution is much, much cheaper especially that you can use Free plan of Azure App Service.

## Going one step more
What if you need only to upload a file once? Or they are small enough? And you don't need multiple logins, but SSL is a must.
I had exactly such situation, so I decided to cheat a bit. I setup an Azure App Service and download deployment credentials. Because App Service support deployments with FTP and FTPS, all my requirements were met. Isn't it sweet?
Free app plan supports only 1GB, but you can easily scale it up and down for a moment when you need.

In the end of the day, I have a working FTPS server for exactly zero. But maybe you have a better idea. If yes please share below?