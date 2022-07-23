---
layout: post
title: I'll be watching you - Monitoring is everything
image: "/content/images/2015/10/58405343.jpg"
date: '2015-10-13 07:03:31'
tags:
- quote
- tools
---

## Imagine
Imagine a perfect world, with your perfect system, when everything goes fine. 
And fine.
More fine
[...]
And then suddenly you have a call from your boss/client/colleague:

>Why our button XYZ is so slow? What's going on?

Then you check:

1. IIS/apache is fine
2. Database is fine
3. JavaScript looks like normal
4. External functionality is good 

So where is the problem? You check XYZ button and it is fine.

## So what just happened?
The sad answer: now it is nothing. The problem was 2-3 hours ago and it is gone now. You just spent some of your time completely useless. 
The question which suddenly comes to your mind is: what had happened and what changed?
Moreover one more should appear: when it will happen again? 


## Monitoring
There are a lot of tools, you should use to measure your application:

1. Performance counters or JMX - this is the base
2. Logs - unfortunate most developers (including myself) create poor quality logs. But quick access to logs is very useful. Moreover try ELK or Splunk enable fast search over history
3. Live dashboards - I know that Zabbix or Nagios are old and ugly, but they are damn useful. 
4. Add more measures to you code with tools like MiniProfiler/Glimpse on .NET or Metric in Java. This can show use easy bottlenecks in our applications. Moreover we can see it live with tools from point 2 and 3.

We are IT, we are lazy, we need tools which will do work for us. Just find what is useful for you and check what your admins use :)

To sum up - remember Sting song : 

> 
Every move you make 
Every vow you break 
Every smile you fake 
every claim you stake 
I’ll be watching you 

<iframe width="420" height="315" src="https://www.youtube.com/embed/OMOGaugKpzs" frameborder="0" allowfullscreen></iframe>