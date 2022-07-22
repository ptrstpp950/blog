---
layout: post
title: Finding bad dependencies using PowerShell
image: "/content/images/2015/12/Upgrade_3.jpg"
date: '2015-12-01 10:05:06'
tags:
- code
- powershell
- c
---

##Difficult upgrade
From time to time we want (or have) to upgrade our old application to a new version of framework. Usually for core libraries it goes quite fast but finding, which dependency is using previous version of assembly which is used by ... - it isn't trivial

##PowerShell to the rescue
First we need to find out all exe and dll files in our `bin` folder and load them using reflection into array. We can use below script:
```
$references = Get-ChildItem . -Recurse -Include @("*.exe","*.dll")| % {
    $loaded = [reflection.assembly]::LoadFile($_.FullName)
    $name = $loaded.ManifestModule
    $loaded.GetReferencedAssemblies() | % {
        $toAdd='' | select Who,FullName,Name,Version
        $toAdd.Who,$toAdd.FullName,$toAdd.Name,$toAdd.Version = `
            $loaded,$_.FullName,$_.Name,$_.Version
        $toAdd
    }
}
```
Now we can list them sorted by group and sort to give duplicate references:
```
$references | 
    Group-Object FullName,Version | 
    Select-Object -expand Name | 
    Sort-Object

```

In my case I got:
```
[...]
System.Web.Mvc, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, 2.0.0.0
System.Web.Mvc, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, 3.0.0.0
System.Web.Mvc, Version=3.0.0.1, Culture=neutral, PublicKeyToken=31bf3856ad364e35, 3.0.0.1
System.Web.Mvc, Version=5.2.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, 5.2.0.0
System.Web.Mvc, Version=5.2.3.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, 5.2.3.0
[...]
RazorGenerator.Mvc, Version=1.5.0.0, Culture=neutral, PublicKeyToken=null, 1.5.0.0
RazorGenerator.Mvc, Version=2.0.0.0, Culture=neutral, PublicKeyToken=7b26dc2a43f6a0d4, 2.0.0.0
```

With MVC I don't have to worry about, because I have biding redirection in web.config file, but `RazorGenerator.Mvc` looks strange. To have information what is using this library just run:
```
$references | Where-Object {$_.Name -eq 'RazorGenerator.Mvc'}
```
And results will show you exactly problems. 


*@cover from http://www.trainingforwarriors.com/are-you-ready-for-an-upgrade/*