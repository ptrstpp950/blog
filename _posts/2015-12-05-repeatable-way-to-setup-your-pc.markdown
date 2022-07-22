---
layout: post
title: Repeatable way to setup Your PC
image: "/content/images/2015/12/download.jpg"
date: '2015-12-05 19:37:00'
tags:
- devops
- windows
- code
---

##Imagine
Imagine following situations:
>My Windows is soo slow. I need to reinstall it

or
>I bought a new PC, but I don't have time to setup it for 2 weeks

or
>[put here your last reason of new Windows installation]

It will take me sooooo long :(. Why it couldn't be done somehow without me?

##First approach
[Chocolatey](https://chocolatey.org/) on Windows environment is like `apt-get` on Ubuntu. Using it we can install easy a lot of stuff like:

- Tools like: 7zip or TotalCommander
- Utils like: Git + Sourcetree + poshgit or NodeJS
- Editors: Sublime/Brackets/Notepad++
- Browsers: Firefox/Chrome/Safari/Opera or even All this browsers in [one command](https://chocolatey.org/packages/allbrowsers)
- IDE: Visual Studio/Intellij/Eclipse/Android Studio

With one simple command:
```
choco install [name of the stuff you really need]
```
or even simpler with:
```
cinst [name of the stuff you really need]
```
Using above we can create simple script to install almost all we need like:

```
cinst git
cinst poshgit
cinst nodejs.install

cinst sublimetext3
cinst notepadplusplus
cinst 7zip.install

cinst google-chrome-x64
cinst firefox
```
It starts to be really interesting :) But is it enough?

##Boxstarter - the next step
[Boxstarter web launcher](http://boxstarter.org/WebLauncher) is a next step. Using simple file like gist on github we can run and setup our machine with Chocolatey pages and Windows stuff (like IIS or Windows update) and even pinned task-bar item or Visual studio add-ons on local or remote machine. We can event test it on example Azure machine :)

##Today morning
Using boxstarter gist (like https://gist.github.com/ptrstpp950/1274f0b8d16f1c25b686)  I run yesterday evening my new PC setup. In today morning I have a new shiny Windows 10 with almost all features which I needed. Just **Fire&Forget** 

##Is everything working?
Of course not. In my case problem was installing Visual Studio after Windows Update without reboot in the middle. But next time I will just try to make my script better :)