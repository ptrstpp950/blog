---
layout: post
title: HSTS error in Google Chrome
image: "/content/images/2016/06/Untitled.png"
date: '2016-06-10 12:03:11'
tags:
- web
---

Sometimes, specially after using Fiddler, my Google Chrome shows me HSTS error like below:

```
localhost normally uses encryption to protect your information. When Google Chrome tried to connect to localhost this time, the website sent back unusual and incorrect credentials. This may happen when an attacker is trying to pretend to be localhost, or a Wi-Fi sign-in screen has interrupted the connection. Your information is still secure because Google Chrome stopped the connection before any data was exchanged.

You cannot visit localhost right now because the website uses HSTS. Network errors and attacks are usually temporary, so this page will probably work later.
```

There is an easy way to fix it:

1. Open [chrome://net-internals/#hsts](chrome://net-internals/#hsts)
2. Go to `Delete domain` and delete problematic domain :)
3. You can checkout everything in `Query domain`

Cool :)

