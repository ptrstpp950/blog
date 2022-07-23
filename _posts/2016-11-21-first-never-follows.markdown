---
layout: post
title: First never follows
image: "/content/images/2016/11/1395308240_silicon-valley-sign-lg-min.jpg"
date: '2016-11-21 18:44:15'
tags:
- software-engineering
---

In last few years, there is a fashion, especially in IT companies. A lot of managers create a catchphrase like:
> We are the Twitter of telecommunication

or
> We want to be the Uber of banking

They are really easy to create. Just take a company from Silicon Valley on the left and put company core business on the right.
In 90% cases company from Silicon Valley will be Google or Facebook. 

## Copy and paste
As a catchphrase above sentence is really good. Moreover in a lot of conferences you can meet stuff from Github, Facebook, Uber, Google and more. They talk about how they are working. Describing their methodologies, languages, and tools.
As you know success brings success, so we decide to copy their way of doing software. But only the important part, because Go/Ruby/Java/C#/Linux/[anything] won't work in our environment. For example one repository will help for sure.

## Monolith repository
The monolith repository is a great example of a tool that we can easy adapt to our company. Just watch a short part of "Why Google Stores Billions of Lines of Code in a Single Repository" from 10:44 below or open direct link: https://youtu.be/W71BTkUbdqE?t=10m43s
<iframe width="560" height="315" src="https://www.youtube.com/embed/W71BTkUbdqE" frameborder="0" style="margin: 0 auto;display: block;" allowfullscreen></iframe>

Great idea, isn't it? With a simple trick, we can be like Google. There is always a "but". Moreover, let's check out the numbers:
<blockquote class="twitter-tweet tw-align-center" data-lang="en-gb"><p lang="en" dir="ltr">&quot;Google scale&quot; never ceases to wow me. 30k devs, 800k builds a day, 150m test cases run each day. More from <a href="https://twitter.com/mmeckf">@mmeckf</a> at <a href="https://twitter.com/hashtag/FS16sf?src=hash">#FS16sf</a> <a href="https://t.co/YFXEixpXdK">pic.twitter.com/YFXEixpXdK</a></p>&mdash; Richard Seroter (@rseroter) <a href="https://twitter.com/rseroter/status/799320898645868544">17 November 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Impressive!

## Healthy check
Before we start migrating, just a small sanity check with others. First of all Facebook. The latest article about source control in Facebook, which I found, is quite old. From January 2014. Great stuff about using Mercurial at scale - [Scaling Mercurial at Facebook](https://code.facebook.com/posts/218678814984400/scaling-mercurial-at-facebook/). Yes Mercurial, not Git. You are probably asking yourself, why are they using Mercurial, not Git? Everybody says that Git is great. The second company from the top isn't using Git. Facebook uses Mercurial, Google uses a closed-source Piper. Let's check out Uber. 
At least Uber is using Git. So how many repositories do they have? In the May of 2016, they had more than 8000. Eight thousand is not a mistake, exactly it was 8263. Moreover, they had 7005 one month earlier. For more details, watch the following video from 16:02 or open a direct link https://youtu.be/kb-m2fasdDY?t=16m2s:
<iframe width="560" height="315" src="https://www.youtube.com/embed/kb-m2fasdDY" style="margin: 0 auto;display: block;" frameborder="0" allowfullscreen ></iframe>


Amazing!

## Conclusion
Is one monolith repository good or bad? I don't know. Probably you too. The best answer is as always: it depends. But the one repository pattern is just an example. 
The biggest problem is the "copy-paste from Silicon Valley" pattern. This method isn't a simple way to fix anything. They made some decisions to solve their problems. 
We should do exactly the same. Solve problems instead of applying tools. Different companies have different problems and need different solutions.

In the end, to be the best in your core business, remember one rule: first never follows.
