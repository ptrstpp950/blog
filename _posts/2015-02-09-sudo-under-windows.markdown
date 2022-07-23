---
layout: post
title: Run sudo in Windows
date: '2015-02-09 08:47:53'
---

It is really frustrating when you need UAC to run one command. You are doing you stuff and you have to launch a new console (cmd or PowerShell) run one command, close it (or not) and start working again.
In Linux you have one magic word: `sudo` and you do not have to think about it. Of course we can disable UAC, but it is not recommended :)

But on Friday at least I found a magic `sudo` command for windows. Simple, plain PowerShell script, just to put in $PROFILE in PowerShell

```
function sudo
{
	$file, [string]$arguments = $args;
	$psi = new-object System.Diagnostics.ProcessStartInfo $file;
	$psi.Arguments = $arguments;
	$psi.Verb = "runas";
	$psi.WorkingDirectory = get-location;
	[System.Diagnostics.Process]::Start($psi);
}
```

Now we can run everything in PowerShell with `sudo command arg1 arg2  argX`. Hurray :)

## Update
The above works only with programs and have a problem with PowerShell commands. The simple workaround is to use `sudo !!` (run last command as sudo). I describe this in the [sudo !! - run last command in elevated PowerShell prompt](https://stapp.space/run-last-command-in-elevated-powershell/)