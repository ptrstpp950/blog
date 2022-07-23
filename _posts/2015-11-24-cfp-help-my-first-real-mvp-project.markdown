---
layout: post
title: cfp.help - my first real MVP project
image: "/content/images/2015/11/how-to-build-a-minimum-viable-product.jpg"
date: '2015-11-24 08:40:54'
tags:
- oss
- speaker
---

## The reason
Everything started with a simple tweet

<blockquote class="twitter-tweet" lang="en-gb"><p lang="en" dir="ltr"><a href="https://twitter.com/mihcall">@mihcall</a> is there any site with the list of upcoming conferences in Poland?</p>&mdash; Konrad Kokosa (@konradkokosa) <a href="https://twitter.com/konradkokosa/status/661827624772247552">November 4, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Ideas
I am almost sure that when you think about such site you just included:

- server side technology
- front-end framework
- database
- hosting
- git 
- ...

We also had a long discussion on Tweeter about technologies (from golang to .NET), databases (like rethinkDB), etc. 


## Real needs
Send here a moment and think what do we need to present.
My idea accepted by others (Konrad Kokosa, Michał Śliwoń and Marcin Biegała) was to create a simple web page with one table containing following information:

- conference name
- localization (city/country)
- conference date
- CFP final date
- CFP link
- optional tags for easier search
- optional search box (because we can replace it by CTRL+F in browser)

## Technologies
Sum up of above idea can be: static webpage. For layout we decided to use bootstrap and bootstrap table component.
Konrad did it a simple page with a JSON file (for date) in one evening. For source control we used github, and for hosting github pages. Because the only database we have is plain JSON file. After 2 or 3 days we decide to have one JSON per CFP and use Jekyll to merge it into final one JSON file - it is much easier to maintain.

## MVP
The funny thing is that instead of "huge" project we created 100% useful page. Exactly what we all understand as Minimum Viable Product. Now we can go we new ideas like: RSS feed, icon/image, more user friendly process of adding CFP, etc.


If you have an idea just visit http://cfp.help/ or https://github.com/callForPapers/callForPapers.github.io/ and propose it :)

*@cover by http://blog.fastmonkeys.com/*
