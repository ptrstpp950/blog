---
layout: post
title: 'How to split monolith solution - part 1: common myths'
image: "/content/images/2016/07/righttool2-1.jpg"
date: '2016-07-04 11:39:00'
tags:
- code
- visual-studio
---

Do you have a big and heavy solution? Do you want to split it? Are you afraid? 
I will try to help. Be for we start we should answer a few questions.

## Why should I split?
Before I show how to split, I have to deal with common myths:

>My solution is not so big. It has only 10/20/100/100/X projects/classes inside

I cannot recommend how small one _solution_ should be. I can agree that in **some cases** 10 can be enough small, but I am sure that 50 will be too much. I'm sure that when You open a solution You will know that it is too big. But we fair with yourself. 

>I cannot split because we don't have enough test coverage

That is a very interesting myth. A split shouldn't make functional changes, so probably it won't break anything in functional part of your system. Anyway, how do you test when you make a new functionality? Automatically, manually or using production users? In this case, do the same.

>I don't see anything to separate

It is untrue, isn't it?. For example tools/utils can be separate, DTO, database projects, web projects, ...

>I don't have any dependency management

Maybe it is time to introduce it. Moreover, think about how do you include external components. Can you build your stuff when _the Internet_ is down? Aren't they a dependency management?
To introduce dependency management system, try just one library as proof of concept. 

>My business owner/product manager/product owner won't accept spending time on this

Explain it to him using following words: it won't take long and after this change, we can develop easier. We will waste some time now, but in the near future, we can work faster.

What if he doesn't understand? Maybe it is time to quit your job ;)

## What next?
In near future I will show how we can use ReSharper and Visual Studio to split our solution to smaller ones. 

Second part is available. Check it out on [How to split monolith solution - part 2 - find cut lines](https://stapp.space/how-to-split-monolith-solution-part-2/)
