---
layout: post
title: ReAttach - how to easily (re)attach the debugger in Visual Studio
image: "/content/images/2016/01/ReAttach-2.gif"
date: '2016-01-21 14:07:00'
tags:
- tools
- visual-studio
---

In more complicated projects, simple F5 doesn't compile&debug. In cases where you're working with IIS (w3wp process), we need to attach the debugger manually.

## Attaching debugger
The simple gif below shows you how to attach it normally:
![Standard Visual Studio debugger attach](/content/images/2016/01/StandardAttach.gif)

For the first time it's ok, but repeating this step 10 times in hour is painful. 
Could this be done in one button or keyboard shortcut?

## Tool to the rescue
ReAttach is a free tool which solves this exact issue. Just take a look at the picture below:

![Attach debugger using ReAttach](/content/images/2016/01/ReAttach.gif)

It has many useful and simple features:

1. Hotkey sequence CTRL+R, CTRL+[number] allows you to attach to one of the latest targets
2. It waits for the process if it doesn't exist yet (for example `w3wp IIS\APPPOOL myapp`)
3. It supports all Visual Studio versions after and including 2010

You can install it from the [Visual Studio Gallery](https://visualstudiogallery.msdn.microsoft.com/8cccc206-b9de-42ef-8f5a-160ad0f017ae) and browse source code on [github](https://github.com/erlandranvinge/ReAttach)