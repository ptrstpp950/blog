---
layout: post
title: Setting up TeamCity agent with SSH on windows
date: '2014-02-28 13:39:58'
tags:
- teamcity
- ssh
- devops
---

## Where is the problem	
I use TeamCity a lot at home and at work. Basically we work on .NET but sometimes we need to use invoke parts on Linux. One solution is to buy licence for Linux agent, but it in our case it will be just throwing out many: we need this more or less once a week for 5 minutes.

### One way communication
One way communication: from agent on windows it's quite easy. The only thing you need is a plugin for TeamCity. You can get it from here: http://confluence.jetbrains.com/display/TW/Deployer+plugin
It's really good and allows to create simple build steps like:

* SSH Deployer - upload files to SSH
* SSH Exec - my favorite it allows to run commands using SSH
* SMB Deployer - upload to windows share, which is useless for me
* FTP Deployer - same for FTP

### Two ways communication
Above plugin are missing one much important feature: it doesn't allow to download files **from** Linux
But we have got *pscp.exe* from putty which we can install on agent machine ore include in our build.
So the build step is quite easy:

* We setup Powershell build step
* In the Script field we enter: 
`echo y | & "C:\Program Files (x86)\PuTTY\pscp.exe" -pw [YOUR PASS][USER]@%RedHat_host%:/somewhere/you_file.txt .`
Small explanation the `echo y` statement. When you first connect to SSH host it ask you to add host into trust one. This command allow to "skip" this part.

Unfortunately we need to include pass in statement or run in this agent a SSH agent to store password. The easiest and enought security option in my opinion is to create guest account with only read-only rights



That's all folks, see you next time.