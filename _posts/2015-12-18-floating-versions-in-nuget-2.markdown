---
layout: post
title: Floating versions in Nuget
image: "/content/images/2015/12/projectJson-dependency-4.png"
date: '2015-12-18 12:34:25'
tags:
- dotnet
- c
- code
---

##Asp.NET 5 RC
At least ASP.NET 5 is production ready. I know that current state is release candidate, but  be honest it means that it is ready. Maybe some quick fixes will be need but who cares ;)

This means that we can start thinking about migrating `csproj` to `project.json`

##Nuget >= 3.0
The separate part of .NET is Nuget. It is separate but very important unless you don't have one project solution, and you don't have external dependencies.

In Visual Studio 2015 Update 1 Nuget 3.3. is included. I hope 3.3 means all big bugs was eliminated.

##Dependency management
Until now nuget allows us to create version range but this causes that lowest applicable version was used. Or cached one if you have it on disk.

This causes that a lot of companies which needed always latest version (useful in CI development) have to use external tools like [ripple](http://fubuworld.com/ripple/) from fubu. Tools like ripple solves some problems, but add some others.

##Floating Versions in Nuget
Going back to plain nuget. From version 3.0 they added support for floating versions which means that:
>When a floating version constraint is specified then NuGet will resolve the highest version of a package that matches the version pattern, for example 6.0.* will get the highest version of a package that starts with 6.0 [more on official docs](https://docs.nuget.org/Consume/ProjectJson-Dependency#user-content-floating-versions)
![](https://docs.nuget.org/images/consume/projectJson-dependency-4.png)

Which means **no more problems in Continuous Integration**

##Something more?
If you look on npm, bower or F# tool called [Paket](https://fsprojects.github.io/Paket/) there is only one more thing they should added: **git dependencies**.
I hope next version will bring them also


