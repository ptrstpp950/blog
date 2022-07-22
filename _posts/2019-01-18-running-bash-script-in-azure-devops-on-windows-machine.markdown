---
layout: post
title: Running bash script in Azure DevOps on Windows machine
image: "/content/images/2019/01/sai-kiran-anagani-555972-unsplash.jpg"
date: '2019-01-18 20:29:50'
tags:
- vsts
- azure-devops
---

I know that title sound ridiculous, but you know in IT sometimes strange things just happen. In my case was migrating agents from Windows to Linux, and I want to have compatibility between them.

You can ask if the Windows agent contains a bash? Of course, it contains. Even if you won't install Windows Subsystem for Linux. So where is `bash`? In Git folder. To be precise in `C:\Program Files (x86)\Git\usr\bin`. If you add this to the path you have working `Bash task` on your Windows agent.

One more tip. If you are passing paths into Arguments of your build escape them with `'` so for example instead of
```
Package FileVersion=1.0.0.$(Build.BuildId) Configuration=$(BuildConfiguration) Output=$(build.artifactstagingdirectory)
```
put 
```
Package FileVersion=1.0.0.$(Build.BuildId) Configuration=$(BuildConfiguration) Output='$(build.artifactstagingdirectory)'
```

Second tip. Remember about `git checkout` and CR-LF versus LF. If you have a problem add `.gitattributes` file with the following content
```
build.sh text eol=lf
```


That was a quite shot recipe. 

The end!


p.s. Photo by Sai Kiran Anagani on Unsplash