---
layout: post
title: Working on IISExpress with custom domain and SSL on 443
image: "/content/images/2017/03/pexels-photo-270700.jpeg"
date: '2017-03-26 17:31:00'
tags:
- visual-studio
---

Working with IISExpress in extremely useful. But running in on custom domain and SSL on a default port (443) is a bit tricky.

## Custom domain
If you are running Visual Studio as administrator, you can put `https://mystuff.local` and it will work like a charm. But without an admin privilege, it simply doesn't. To fix it we need to configure the `netsh` tool. The command is quite simple:

```
netsh http add urlacl url=https://mystuff.local:{port}/ user={login}
```
Where `{port}` is a port number which you would like to use. In my case, I will unblock 80 and 443. To obtain `{login}` just run `whoami` in the PowerShell or CMD prompt.

The second step is to add proper binding in the `application.host` config file under the `.vs` folder in your project. It will look more or less like below:

```
<site name="WebApp(1)" id="3">
    <application path="/" applicationPool="Clr4IntegratedAppPool">
        <virtualDirectory path="/" physicalPath="C:\projects\MyWebApp\WebApp" />
    </application>
    <bindings>
        <binding protocol="http" bindingInformation="*:80:mystuff.local" />
        <binding protocol="https" bindingInformation="*:443:mystuff.local" />
    </bindings>
</site>
```

Now in the Visual Studio, we can configure our domain for HTTP protocol. The F5 button should work. For HTTPS on 443 we still have a problem even with admin privilege. For ports like 443xx it is working like a charm. Why?

## HTTPS 
First of all, let's find out why 443xx ports work. The `netsh` is again our best friend. Let's run:
```
netsh http show sslcert
```
OMG! A lot of lines! But don't worry, there are almost same. The only difference is the port number. That is the reason why HTTPS works on IISExpress any port like 443xx. Bellow the last one:
```
IP:port                      : 0.0.0.0:44399
    Certificate Hash             : {HASH YOU ARE LOOKING FOR}
    Application ID               : {GUID YOUR ARE LOOKING FOR}
    [rest of the entry]
```

Now using above run in the elevated cmd prompt
```
netsh http add sslcert ipport=0.0.0.0:443 certhash=HASH_FROM_ABOVE appid={GUID_FROM_ABOVE}
```
In the PowerShell prompt you will recive an error that parameter is incorent because of `{` and `}` chars so the correnct command is:
```
netsh http add sslcert ipport=0.0.0.0:443 certhash=HASH_FROM_ABOVE appid="{GUID_FROM_ABOVE}"
```

And that's it. Now you can run IISExpress safety on https://mystuff.local/. Happy coding.