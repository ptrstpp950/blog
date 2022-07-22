---
layout: post
title: Atom on Windows
date: '2014-05-09 08:23:57'
---

I decied to try to build Atom and I succeed.

The instruction is very simple:

- Install [git](http://msysgit.github.io/)
- Install [posh-git](http://haacked.com/archive/2011/12/13/better-git-with-powershell.aspx/)
- Install [Python 2.7](https://www.python.org/download/releases/2.7)

After above run powershell with following commands:


    $env:Path+=";C:\Python27;C:\Program Files\nodejs;C:\Users\"+$env:USERNAME+"\github\atom\node_modules\"
    mkdir ("c:\users\"+$env:USERNAME+"\github")
    cd ("c:\users\"+$env:USERNAME+"\github")
    git clone https://github.com/atom/atom
    cd atom
    script\build
    
    
 But if you don't want to do above **download my build** from [here](https://drive.google.com/file/d/0B4N_AbBPGGwLeFh3WVIzc2c1V3M/edit?usp=sharing)
