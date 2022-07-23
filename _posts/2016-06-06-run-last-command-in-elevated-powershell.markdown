---
layout: post
title: sudo !! - run last command in elevated PowerShell prompt
image: "/content/images/2016/06/sandwich.png"
date: '2016-06-06 20:09:51'
tags:
- powershell
---

Last week I have a lot of fun with [docker on windows](https://stapp.space/docker-windows-containers-on-windows-host-step-by-step/), but I have one small problem. I usually run PowerShell in standard mode, without admin rights. And from time to time I want to restart service, run docker command or ... - run the previous command in the elevated prompt. In Linux, there is a `sudo !!`. But in PowerShell, there is no even built-in `sudo`.
 
A few months ago I described how to run `sudo` command in PowerShell (more in [Run sudo in Windows](https://stapp.space/sudo-under-windows/)). But I was still missing `sudo !!`.
Today I found a solution. 

## Using Get-History
I need a good name for my function. I decided to name it: `f--k`. I usually say this word, when I forgot about admin rights.

It is really easy to create we just need to get last invoked command using `Get-History` ‎Cmdlet:

```
function f--k
{
    $cmd = (Get-History ((Get-History).Count))[0].CommandLine
    Write-Host "Running $cmd in $PWD"
    sudo powershell -NoExit -Command "pushd '$PWD'; Write-host 'cmd to run: $cmd'; $cmd"
}
```

## Linux style
Now we can modify original `sudo` function to accept `!!`:
```
function sudo  
{
    if($args[0] -eq '!!')
    {
         f--k;
    }
    else
    {
	   $file, [string]$arguments = $args;
	   $psi = new-object System.Diagnostics.ProcessStartInfo $file;
	   $psi.Arguments = $arguments;
	   $psi.Verb = "runas";
	   $psi.WorkingDirectory = get-location;
	   [System.Diagnostics.Process]::Start($psi);
    }
}
```
And now I am happy Windows user with Linux styled command.