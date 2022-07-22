---
layout: post
title: VS 2017 + new csproj = useful or useless?
image: "/content/images/2017/01/csproj.png"
date: '2017-01-23 19:50:58'
tags:
- visual-studio
- dotnet
- vs2017
---

Here we go again. New Visual Studio, new NET Core tools. This post is the second one about new Visual Studio 2017. Last week I wrote about [Common code style in Visual Studio 2017](https://stapp.space/common-code-style-in-visual-studio-2017/).
The question for today is simple: is VS2017 with new csproj useful or useless? Let's find it out.

## Simple structure
Do you remember `project.json`? For me, it was a new hope ([read more](https://stapp.space/project-json-made-my-life-easier-and-it-is-not-a-joke/#episodevianewhope)), but Microsoft removed it. Instead, we have a new csproj format, much simpler than ever. It is human readable and can be created without IDE. For example, a csproj file for NET core console app is following: 
```
<Project Sdk="Microsoft.NET.Sdk" ToolsVersion="15.0">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp1.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="**\*.cs" />
    <EmbeddedResource Include="**\*.resx" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NETCore.App" Version="1.0.1" />
  </ItemGroup>
</Project>
```
Three groups with a clear responsibility. The first one defines project type and target framework. The second one includes all source code files. The last one is for NuGet dependencies. Still too complicated? We can reduce root element to `<Project Sdk="Microsoft.NET.Sdk">`. There are a few advantages of such csproj file structure for me, including:

- no more changes when we add or remove a file in a folder;
- no more git conflicts in merge;
- all files included in subdirectories using `**` symbol;
- no more `xmlns` attribute.

I was really worried when Microsoft decided to replace `project.json` with a csproj file, but above looks simple, clean and easy to understand.


## Auto reload
Do you remember below popup? There is a chance that you seen it today just because some git operations cause it.

![](/content/images/2017/01/reload2.png)

In VS 2017 with NET core projects it is gone forever. The newest Visual Studio auto reloads changes in a file structure and the csproj itself. When we add or remove a file, it is automatically visible inside a Solution View. The same behavior is with the package references. For example, when we change the version of NuGet package, Visual Studio auto-setup it in a second.  

## What about XYZ property from project.json?
Old csproj and project.json have a lot more properties to set. Above example is a minimal working file. If you want to add version, multiple frameworks, before and after targets, snk file, test framework, etc - it is possible. In IDE it is a click, in "plain text file mode" you will have to check the documentation. But this is same as before and properties have clean names. Even complicated files are readable for a human. 

## Sum up
Visual Studio 2017 with NET core toolset is nice. The csproj format looks better for me even than project.json. I hope that this is a final version of NET core project file. Or to be precise a final major version. 

Next time about NuGet dependencies in above structure. Few things have changed, especially that NET Core project uses NuGet 4.0. 
If you don't want to miss the next post, follow me using buttons bellow.