---
layout: post
title: Quo Vadis, Open-source?
image: "/content/images/2024/04/cover.png"
date: '2024-04-09 08:30:12'
tags:
- open source
---

Reflecting on the past year, I've become increasingly convinced that the open-source model faces challenges from various angles. Here are my favorite moments from last months: 


## 👉 Moq - the dotnet open source library for mocking
The owner added a SponsorLink that was sending a hash of developer email to a cloud service. Why? Because the owner wanted to test how they could get funds for their work. While some might consider this approach unconventional, it’s clear that the owner’s motivation was to earn money from their work. We can argue about the method, but the goal is clear: we don't want to work for free. 

## 👉 Terraform 
There was a huge controversy around Terraform when they changed their license. Although some view this as a broken promise to the Terraform community, the reaction was to create a fork and “start over.” Whether this is good or bad depends on individual perspectives, but it’s likely that companies will now think twice before investing in such open-source projects. As a result, the trust in open source is decreasing. 

## 👉 Redis 
Redis also underwent a licensing change. While opinions on whether this change is good or bad may vary, the first sentence in many news articles is quite (un)expected. For instance, TechCrunch reported: “The Linux Foundation last week announced that it will host Valkey, a fork of the Redis in-memory data store. Valkey is backed by Amazon Web Services, Google Cloud, Oracle, Ericsson, and Snap.” Essentially, some major companies decided to create a fork and work on it, ensuring they continue to profit from Redis without losing their investment. Did you expect that or not?

## 👉 XZ backdoor

This incident in my opinion is a masterpiece in providing a backdoor within open source. Over three years of effort within the open-source community led to the insertion of a backdoor code into a library used by the Open SSH server. Kudos to Microsoft employee Andres Freund, who detected this change. Interestingly, it wasn’t during a code review; he stumbled upon it while investigating performance regression in Debian/Postgres. It makes you wonder how many such backdoors exist in open source, still undetected. 

## To trust or not to trust?
At the end of the day, do you still believe that the current model is working? And more importantly, do you have any ideas on how to address this on a global scale? Ensuring that creators receive fair compensation for their work while maintaining user trust in the software they produce is crucial. While trust remains intact for now, a few missteps could irreparably damage it. Once that trust is broken, there may be no way to fully restore it.