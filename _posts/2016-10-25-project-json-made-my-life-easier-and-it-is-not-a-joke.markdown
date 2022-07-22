---
layout: post
title: Project.json made my life easier and it is not a joke
image: "/content/images/2016/10/magic-cube-cube-puzzle-play-54101.jpeg"
date: '2016-10-25 13:10:36'
tags:
- visual-studio
---

Project.json is a celeb in .NET world. But its status is rather "famous for being famous", instead of usefulness. Probably you heard some time ago that it will replace `csproj` and a few months later that it won't. What is it still doing here? Only one word: dependencies.

##TL;DR;
The history of the package management in .NET world is long and rather turbulent. Getting always the latest version for many years was just impossible. 
If know NuGet history and structure, you can skip first few paragraphs up to [Episode IV: A new hope](#episodeivanewhope). The solution description starts there. I hope you will find it useful.

##Where are we from?
I don't know anybody who hasn't copied/included/committed external libraries into a project. Even today JavaScript libraries are frequently included in web projects. Well, in the beginning of this century it was a standard.
One of the oldest package management system - Maven - was born on [Mon, 27 Aug 2001 16:35:05 GMT](http://mail-archives.apache.org/mod_mbox/jakarta-alexandria-dev/200108.mbox/%3C20010827163505.53005.qmail@icarus.apache.org%3E). 
.NET didn't even exist then. The first version was released on [2002-02-13](https://en.wikipedia.org/wiki/.NET_Framework_version_history). 
That time, the most advanced dependency management on Windows platforms used shared folders. The solution above helps the developers sharing their work in the big teams.

##What about NuGet?
NuPack was born on August 2010 as an open-source package manager for the Microsoft development platform. Did you notice the open source? It was hosted on [CodePlex](http://nuget.codeplex.com/).
 
But what is NuPack? Now it is NuGet. The name was changed on 21 October 2010. The funny thing is that the most people pronounce it like "nugget". But according to [the authors](http://haacked.com/archive/2010/10/29/nupack-is-now-nuget.aspx/) it should be pronounced slightly different:
>NuGet (pronounced “New Get” and not “Nugget” and not “Noojay” for you hoity-toity) 

As you probably know NuGet is a simple zip file with a defined structure. You can use for example 7zip to see the structure of any nupkg file. Below structure of `microsoft.aspnet.mvc.6.0.0-rc1-final.nupkg`
```
lib/
lib/dotnet5.4/
lib/dotnet5.4/Microsoft.AspNet.Mvc.dll
lib/dotnet5.4/Microsoft.AspNet.Mvc.xml
lib/net451/
lib/net451/Microsoft.AspNet.Mvc.dll
lib/net451/Microsoft.AspNet.Mvc.xml
Microsoft.AspNet.Mvc.nuspec
[Content_Types].xml
_rels/
_rels/.rels
```

It is simple and clean. Even `nuspec` file is human readable. Just take a look:
```
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2012/06/nuspec.xsd">
  <metadata>
    <id>Microsoft.AspNet.Mvc</id>
    <version>6.0.0-rc1-final</version>
    <requireLicenseAcceptance>true</requireLicenseAcceptance>
    <authors>Microsoft</authors>
    <owners>Microsoft</owners>
    <description>ASP.NET MVC is a web framework that gives you a powerful, patterns-based way to build dynamic websites and Web APIs. ASP.NET MVC enables a clean separation of concerns and gives you full control over markup.</description>
    <dependencies>
      <group targetFramework=".NETFramework4.5.1">
        <dependency id="Microsoft.AspNet.Mvc.ApiExplorer" version="6.0.0-rc1-final" />
<!--a few more lines like above-->
      </group>
      <group targetFramework=".NETPlatform5.4">
        <dependency id="Microsoft.AspNet.Mvc.ApiExplorer" version="6.0.0-rc1-final" />
<!--a few more lines like above-->
      </group>
    </dependencies>
    <frameworkAssemblies>
      <frameworkAssembly assemblyName="mscorlib" targetFramework=".NETFramework4.5.1" />
<!--a few more lines like above-->
    </frameworkAssemblies>
    <licenseUrl>http://www.microsoft.com/web/webpi/eula/net_library_eula_enu.htm</licenseUrl>
    <iconUrl>http://go.microsoft.com/fwlink/?LinkID=288859</iconUrl>
    <copyright>Copyright © Microsoft Corporation</copyright>
    <projectUrl>http://www.asp.net/</projectUrl>
  </metadata>
</package>
```
Even the basic package definition inside a project is easy to understand. Simple XML file called `packages.config`. More or less like below:
```
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Microsoft.AspNet.Mvc" version="5.2.3" targetFramework="net452" />
  <!--a few more lines like above-->
</packages>
```
Nice, isn't it?

##But my feelings are ...

<iframe src="//giphy.com/embed/26ufccrP68kianc0E" width="480" height="330" frameBorder="0" class="giphy-embed" style="display: block;margin-left: auto;margin-right: auto;" allowFullScreen></iframe>

Moreover, there are a lot of developers like you. With exactly the same feeling. For example [Gutek](https://twitter.com/gutek) once upon a time posted on twitter:

![](/content/images/2016/10/gutek.png)

##Where is the problem?
Bear in mind that NuGet is simple, but it integrates with `csproj` file in ##@$@$ way. Just take a look inside this simple `csproj`:
```
 <ItemGroup>
<Reference Include="System.Web.Mvc, Version=5.2.3.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL">
      <Private>True</Private>
      <HintPath>..\packages\Microsoft.AspNet.Mvc.5.2.3\lib\net45\System.Web.Mvc.dll</HintPath>
    </Reference>
```
Can you see this version string inside a path? That's the main reason of our frustration. Just 6 chars: `.5.2.3`.
Every package upgrade always changes these two files: `csproj` and `packages.config`. 
Moreover, there wasn't a way to have always the LATEST version. We need to upgrade the packages every time. And this made an irritating GIT/TFS/SVN conflicts. 

##How to run NuLatestGet?
There aren't many ways. One is to run it on a Continuous Integration tool. For example, TeamCity has built-in task just for this operation. You can read about it on [their blog](https://blog.jetbrains.com/teamcity/2013/08/nuget-package-restore-with-teamcity/).
But still, we need to commit such changes.

In my company, we have been using [ripple from the fubu team](https://github.com/FubuMvcArchive/ripple) for a few years. But this project died. Today the official web page even doesn't exist. Only the GitHub repository linked above remained. Sad.

Another solution is to switch to [paket](https://fsprojects.github.io/Paket/). It was created for the F# guys, but it works nicely with C# projects, too. Good stuff.

Can you any disadvantage of above solution? I know only one. Developers have to use a console to restore project dependencies.

##Episode IV: A new hope
When I read about project.json for the first time, I was excited. I crossed my fingers and even took a part in [a discussion about versions string format](https://github.com/aspnet/dnx/issues/442).
Then project.json died, because of the tooling or something. But some part of it is still alive. Exactly NuGet part. Almost one year ago I even created a post about it: [Floating versions in Nuget](https://stapp.space/floating-versions-in-nuget-2/).
But it wasn't useful at that time. This has changed a few months ago. Exactly on  27 June 2016, when Visual Studio Update 3 was released. At first, I didn't notice this fact, but it is working. After two months of using it, I'm just happy. It isn't perfect, but it is good enough.

##There can be only one
The main difference is really simple. Instead of two entries about package dependency we have only one in `project.json`. In `csproj`, there is only an include of `project.json` file. All dependencies are in `project.json`. Much simpler, isn't it?

##How to start?
It's simple. Just start a new or open an existing solution in Visual Studio. Add at least one NuGet package, but probably this was done by project template. 
Now check if you already have the Update 3. It has a few months already, but after all, it is better to be safe than sorry. To check it just open Help->About Microsoft Visual Studio.

Close Visual Studio and open csproj in your favorite text editor. Find all dependencies with `HintPath` set to `packages` folder and remove them. Like below:
```
<Reference Include="System.Web.Mvc, Version=5.2.3.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL">
      <Private>True</Private>
      <HintPath>..\packages\Microsoft.AspNet.Mvc.5.2.3\lib\net45\System.Web.Mvc.dll</HintPath>
    </Reference>
```  

Now step number two. Find below line: 
```
<Content Include="packages.config" />
``` 
And replace `packages.config` with `project.json`. Create such file with below content. We need to specify the target frameworks. In my case .NET 4.6.1:
```
{
  "frameworks": {
    "net461": { }
  },
  "runtimes": {
    "win": {} 
  }
}
```
Now we can add the dependencies manually by using one of the methods below:

- from `packages.config` extract strings like:  `"Microsoft.AspNet.Mvc": "5.2.3"` - it's a few find and replace commands
- install all the needed packages from the Package Manager Console

If you would like to use ==an automatic script==, just subscribe to my newsletter on the right. I will release it in a few days. Also, above tutorial will be released as GitHub repository.

##Final effect
It's simply working. Just press F5 in Visual Studio. In my case, after `nuget restore`, I can see following in the `Solution Explorer`:

![](/content/images/2016/10/solutionExplorer.png)

##Problems
The latest package still has a small feature. You can use it just with `*` as a version number, but in Visual Studio it will disappear.
The second problem is described in the following article: [.NET Core Tooling in Visual Studio “15” ](https://blogs.msdn.microsoft.com/dotnet/2016/10/19/net-core-tooling-in-visual-studio-15/). I don't know how `project.json` will finish. But I hope the version strings will be working inside `csproj` too.

##Sum up
A very short sum up:

- Correct NuGet pronunciation is "New Get", not "nugget" or ...
- From Visual Studio Update 3, we can get latest NuGet package with `project.json`
- It integrates well with Visual Studio and MsBuild. We don't need additional step in console.
- ==Subscribe my newsletter to receive an info about automatic conversion tool==. I will publish it in a week or two. 