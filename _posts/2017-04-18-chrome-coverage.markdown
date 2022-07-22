---
layout: post
title: Search and clean redundant JS and CSS on your page
image: "/content/images/2017/04/person-looking-searching-clean.jpg"
date: '2017-04-18 06:56:00'
tags:
- web
---

Creating a web page is easy. But making it fast it isn't a piece of cake. First steps are "easy". You optimize the server-side response time, images sizes and weight, minification, and bundling. And then you probably see the following error in [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/):

>Eliminate render-blocking CSS in above-the-fold content

What? How can I find which CSS is redundant?

## Chrome to the rescue
In the latest Chrome (the minimum version is 59 according to the [release notes](https://developers.google.com/web/updates/2017/04/devtools-release-notes)), there is a new tool called Coverage. To run it just launch developers tools and press three dots on the lower left:

![](/content/images/2017/04/chrome-coverage-1.png)

The rest is "easy". Run your browser in incognito mode to skip scripts and CSS from extensions, press record, visit your site and review results. For example, on my blog most lines of the foundation.css file are redundant and I can delete it:

![](/content/images/2017/04/chrome-coverage-2.png)

For the first time in my life, I can easy check which part of CSS are used on my website. I hope in near future we can use this functionality for example with selenium on CI. That's really great.