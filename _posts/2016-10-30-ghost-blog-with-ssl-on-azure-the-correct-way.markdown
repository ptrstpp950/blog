---
layout: post
title: Ghost blog with SSL on azure - the correct way
image: "/content/images/2016/10/halloween-1751901_640.jpg"
date: '2016-10-30 16:38:59'
tags:
- tips
- azure
---

My blog is hosted on Azure Web Pages. A few months ago I decided to use SSL on it because I can get a free SSL certificate from "Let's Encrypt" [website](https://letsencrypt.org/).

##Change URL in config
Simple change URL in `config.js` generates the following error:
```
Too many redirects 
```

##Why?
As you probably know, Ghost is a node.js app. Azure IIS, in this case, is a reverse proxy server. It is working on localhost with `http`. Moreover, Ghost has the build-in check for SSL. But it doesn't know anything about the reverse proxy. And it checks `http://127.0.0.1:[process.env.PORT]` instead of `https://stapp.space` in my case.

##Bad fix
When first time I had above error. I found a simple fix: rewrite all URL in the `web.config` from `http` to `https`. And it was working like a charm. The rule was more or less like below:
```
       <rule name="ForceSSL" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{HTTPS}" pattern="^OFF$" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
        </rule>
```
But this ends with bellow problems:

- my web page generates all URLs starting with `http`. So almost every user click was redirected without a reason.
- on RRS feed I had the same problem.
- Firefox shows warnings on my page only because of above

##Searching
On Google search, I found Tom SSL blog with [an article about this problem](https://tomssl.com/2015/01/05/installing-ghost-on-azure-websites-and-forcing-ssl-with-a-custom-certificate/). But he suggests changing a function inside Ghost. This function is `function isSSLrequired(isAdmin)`.
After applying this solution, on every Ghost upgrade, I will have to remember about above fix.  No way.

Then, I found the second solution. But it applies only to NGIX and Apache: https://github.com/TryGhost/Ghost/issues/2796

And this gave me a clue.

##Good fix
To add the `X-Forwarded-Proto` header in IIS configuration, I need one line in `iisnode.yml`:
```
enableXFF: true
```
The `iisnode.yml` file is side by side with web.config.

Now put correct URL in your `config.js`. Restart web page and it is working like a charm.