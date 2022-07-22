---
layout: post
title: Track every single change in folder with git
date: '2014-09-12 12:44:55'
tags:
- git
- powershell
---

During my last work with Vagrant I need to track every single file change. The easiest way which I found was to create simple git repository in selected folder (with `git init` of course) and two new functions in PowerShell profile (to edit profile just run `notepad $PROFILE`):
```
function buildGitMsg(){
	$date = Get-Date
	return $date.ToString("yyyy-MM-dd HH:mm:ss");
	
}
function vagrant(){
	$msg = buildGitMsg;
	$gitRoot=(git rev-parse --show-toplevel).Replace("/","\")
	pushd $gitRoot
	git add .
	git commit -m "$msg"
	popd
	vagrant.exe $args
}
```

This small change allows me to automatically commit on every run `vagrant` with arguments.

Small, easy and cool :)