---
layout: post
title: How to setup Bash and Ubuntu on Windows - step by step guide
image: "/content/images/2016/04/download-1.png"
date: '2016-04-20 17:32:47'
tags:
- windows
---

Running Ubuntu apps on Windows is now a piece of cake. We just need to setup Ubuntu (with Bash) on Windows using Insider Preview Build in few simple steps.

##Became Windows Insider
If you aren't a Windows Insider, this is the first step. Go to https://insider.windows.com/ and **Get Started**.
Bash on windows is still available only on builds for Insiders

##Setup Windows Update
This step took me more than one week. So be patient :)
First of all open Windows Update on your PC. Press start icon and write __Advanced Windows Update options__, like below:

![](/content/images/2016/04/00.png)

Next step is to setup **Fast ring** on progress bar marked with the red ellipse on below screenshot. By the way, funny bug on Windows is marked with the green rectangle. I have 100% English windows but fast ring description is in Polish.

![](/content/images/2016/04/02-1.png)

##Be patient
This part took on my PC more than 5 days. I manually clicked few times __Get Updates__ but nothing happened. It was day after day like that:

![](/content/images/2016/04/01-1.png)

But one day, yesterday, I received **the update**.

##Enable Windows Subsystem for Linux
Run __Turn Windows features on or off_ and select below the checkbox.

![](/content/images/2016/04/03.png)

Do restart after installation as setup suggests. Now You are ready to final steps

##Final steps
Search for `bash` in the start menu. Then run it and say `y`es to below question:

![](/content/images/2016/04/06.png)

After a few seconds/minutes you will see:

![](/content/images/2016/04/07.png)

Now difficult part happen. Do You still remember some Linux commands? And be careful with `rm /mnt/c -rf`/ It isn't a good command for the first time. Even if some tweet suggests it :D

##Can I run docker on it? Or redis? Or ...?
Unfortunate the answer is: no. Kernel must be 3.10 at minimum to run docker on Ubuntu. When we run `uname -r` the output is `3.4.0+`. So it is incompatible. But still you can install and run for example **redis** or **pgsql** on native Linux inside Windows.

##How does it work?
If you are interested how Windows Subsystem for Linux does work there is a very good blog post on MSDN: https://blogs.msdn.microsoft.com/wsl/2016/04/22/windows-subsystem-for-linux-overview/