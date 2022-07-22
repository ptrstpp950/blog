---
layout: post
title: Using poshgit @VisualStudio
date: '2014-10-09 06:05:00'
tags:
- git
- powershell
- visual-studio
---

###Git in Visual Studio

As You probably know Visual Studio has integrated git client. It is really cool thing. Unfortunately there is a big **BUT**: it does not support git over ssh.

So in 99% cases I use separate console window to push my stuff to remote repository. But not anymore :)

###Package manager console to the rescue
The easiest way (in my opinion of course) is to use Package Manager Console is a PowerShell console :)
The only difference is that it has separate profile file form standard PowerShell.

###PoshGit - git extension for PowerShell
If didn't try this before, you should now. It was described before at:
- [Better Git with PowerShell](http://haacked.com/archive/2011/12/13/better-git-with-powershell.aspx/) @haacked blog
- [Prompts and Directories - Even Better Git (and Mercurial) with PowerShell](http://www.hanselman.com/blog/PromptsAndDirectoriesEvenBetterGitAndMercurialWithPowerShell.aspx) @shanselman blog

The effect in PowerShell:
![poshgit in powershell](http://res.cloudinary.com/piotrstapp/image/upload/v1412796473/posh-git_wnzkwa.png)hich gives you all needed information with colors and numbers about your local git repository: how many new files, how many changes, is you repository behind/after origin, etc.


###Poshgit inside VisualStudio
If you already install posh-git in "normal" PowerShell the easiest step is add "include" in package manager console profile file. Just run inside package manager console 
```
notepad $PROFILE 
```
and add line like below. Iit depends on how you installed poshgit - you can find it in normal powershell profile with typing in in `notepad $PROFILE`
```
. 'C:\Users\XXXXXX\Documents\WindowsPowerShell\Modules\posh-git\profile.example.ps1'
```
or
```
. 'C:\[somewhere]\posh-git\profile.example.ps1'
```
Reload profile with `. $PROFILE` or just restar Visual Studio. Now I am ready to work:


![posh-git in VS](http://res.cloudinary.com/piotrstapp/image/upload/v1412797070/posh-git-vs_kzhakt.png)
