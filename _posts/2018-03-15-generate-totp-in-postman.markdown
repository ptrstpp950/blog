---
layout: post
title: Generate a time-based one-time password (TOTP) in Postman
image: "/content/images/2018/03/pablo.png"
date: '2018-03-15 08:44:49'
tags:
- javascript
- tips
---

I have a service with a one-time password, which I'm testing using the [Postman app](https://www.getpostman.com/). Everything is fine except I have to use Google Authenticator/Microsoft Authenticator/Auth before every request which is quite annoying. But calculating time-based one-time password (TOTP) is a well-known algorithm. Moreover, the Postman can run JavaScript code before and after each request. 

## Calculate TOTP in JavaScript
If you Google for a second it is possible. For example, I found a very simple algorithm on
https://www.thepolyglotdeveloper.com/2014/10/generate-time-based-one-time-passwords-javascript/, but it is a bit outdated because the [jsSHA library](https://caligatio.github.io/jsSHA/) changed a bit. The second try was http://jsfiddle.net/russau/ch8PK/, much better except JQuery. The only way to use it was to include full jsSHA in Postman Pre-request Script tab:

![](/content/images/2018/03/postman.png)

## Full solution
The full code is quite long, 2314 lines, so I publish it at gist: https://gist.github.com/ptrstpp950/42660823675f6bf2f2d2f1503663553a


Possibility + algorithm = working solution