---
layout: post
title: Obsidian backup with OneDrive
image: "/content/images/2021/05/pablo.jpg"
date: '2021-05-05 17:20:51'
tags:
- tools
---

I decided to try [Obsidian](https://obsidian.md/) as my new work notes tools. Looks really good, but I note there internal company stuff, so store it in the cloud is not an option.
Fortunately my company uses OneDrive, so making a backup is piece of cake:
```
# launch CMD bellow command doesn't work in pwsh

mklink /j "[path to root of OneDrive folder]\obsidian-notes" "[Path to obsidian notes folder]
```
So easy and so useful 😀