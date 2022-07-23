---
layout: post
title: Should not happen comment
image: "/content/images/2015/10/2488402.jpg"
date: '2015-10-19 11:35:38'
tags:
- code
---

## The code & the comment
Today I found the simple code with the even more simple comment:

    [...]
    if (entry== null)
           return; // should not happen
    [...]

## What if the "if" just happened?

The [Finagle's law](https://en.wikipedia.org/wiki/Finagle%27s_law) is:
> Anything that can go wrong, will—at the worst possible moment.

Especially in IT it is true. Unfortunately I saw variation of above code many times, which is completely sad.

## Fail fast
In my private opinion the best way is to fail fast. I know that user/system/boss will be sad/broke/angry, but if abnormal situation happen even once you will be know about it.
So the easiest way is to 
    
    if (variable == null)
        throw new Exception("Oh my god the universe just doomed: entry is null");

## but I cannot 
If you really cannot throw an `Exception`, log this error. Log it in standard way with **all** needed information like: stack trace, context, etc. It should be easy to access as all your logs.

## The perfect solution
The perfect solution is simple: combine logging and exception. This should allow to track fast what exactly happened, which should not happened

