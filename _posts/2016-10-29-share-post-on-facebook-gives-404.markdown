---
layout: post
title: Share post on Facebook gives 404
image: "/content/images/2016/10/404-facebook-error.png"
date: '2016-10-29 16:07:34'
tags:
- tips
---

A few days ago, I tried to share my own post on Facebook. But instead of post miniature, I ended up with `404 - Page not found`. Exactly like bellow: 

![](/content/images/2016/10/404-facebook-min.png)

##Quick fix
A quick fix was simple: I added a query string into URL. And magically Facebook read my post without problems.
But a few days later my friend wants to share my post on his timeline. And he gets the exactly same result as me before.

##Facebook developers tools
The real solution is simple, but not well known. Moreover is as easy as the quick fix. 

1. Go to https://developers.facebook.com/tools/debug/
2. Put your not working URL and press the "Debug" button.
5. You will see `404` in `Response Code` like below: ![](/content/images/2016/10/404-facebook-1.png)
4. Press "Scrape again" (marked on above image) and you are done. 
5. Now you should see `200` in `Response Code`: ![](/content/images/2016/10/404-facebook-2.png)

Done!