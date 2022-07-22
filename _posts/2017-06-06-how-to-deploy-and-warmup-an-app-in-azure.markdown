---
layout: post
title: How to deploy & warm-up an application in Azure using VSTS
image: "/content/images/2017/06/pablo-1.png"
date: '2017-06-06 07:13:00'
tags:
- vsts
---

**Disclaimer** This article was also published on my company blog. You can read it in [Polish](https://finai.com/pl/newsroom/jak-rozgrzac-aplikacje-w-chmurze-azure/) and in [English](https://finai.com/en/newsroom/how-to-deploy-warm-up-an-application-in-azure-using-vsts/) on FinAi blog.

This article is based on Umbraco site deployment, but I'm sure that it will fit in most common ASP.NET projects. If you will have any problems, just let me know.

## Create a build definition
First, we need to create a build definition. In most common cases just choose ASP.NET (Preview) template and it will work like a charm. Of course, as always some error will appear. To fix it on your machine check out your project into the clean directory and run:
```
msbuild.exe YourProject.sln /p:DeployOnBuild=true /p:WebPublishMethod=Package /p:PackageAsSingleFile=true /p:SkipInvalidConfigurations=true /p:PackageLocation="c:\tmp\"
```
In my experience the most common problems are:

- not existing files included in csproj (problem with .gitignore)
- references to NuGet packages from other projects

Be patient, cross your fingers, and in after a while, it will work. Success!

## Make it install
That should be simple, isn't it? Few steps maybe more. First, we need to create release definition. In most cases, your choice is the Azure App Service Deployment. We can add more tasks later.

![](/content/images/2017/04/create.png)

In the next step, you can mark "Continuous deployment" option, so every build will create a release and try to deploy it. For dev environment, it should be checked. After pressing "Create" button new task shows on the list. Magic!

![](/content/images/2017/04/definition-basic.png)
Fill "Azure subscription" and "App Service name" and you are ready for the first deploy. I suggest renaming "Environment 1" on left to something meaningful like "dev", "uat" or "perf". Press "+Release" button and run your first release. In my case, it is working like a charm, but when I try to redeploy I got following error:
```
Error Code: ERROR_FILE_IN_USE More Information: Web Deploy cannot modify the file 'XYZ.dll' on the destination because it is locked by an external process.  In order to allow the publish operation to succeed, you may need to either restart your application to release the lock, or use the AppOffline rule handler for .Net applications on your next publish attempt.  Learn more at http://go.microsoft.com/fwlink/?LinkId=221672#ERROR_FILE_IN_USE.
```
To fix it we need to inspect and change "Additional Deployment Options" section in Deploy Azure App Service task. A simple fix is to check "Take App Offline" like below:

![](/content/images/2017/04/definition-take_app_offline.png)

Ready? Steady? Wait for a second!! There are a few additional options to consider:

- __Remove additional files at destination__ - if you don't mark it after a while you can have a garbage on your server. If you use before an HTML5 clipboard helper with fallback to Adobe Flash (like ZeroCliboard) you can create a security hole on your server (e.g [XSS on old ZeroClipboard](https://github.com/zeroclipboard/zeroclipboard/issues/14)). But if you write any files on the server you will delete them. Of course writing files on Azure App Service in not the best way to create software, but it happens. The better option is using a Blob Storage for your files, and Application Insights for logs. But if you really must to save some files and keep them on the server, check the next option
- __Exclude files from the App_Data folder__ - the purpose of App_data folder is simple: *Contains application data files including .mdf database files, XML files, and other data store files.* (from [official documentation](https://msdn.microsoft.com/pl-pl/library/ex526337.aspx)). So this is the place when ASP.NET app should write files if it really must. If you remove this folder you can lose some data.

In my opinion, both options should be checked.

## Warm-up
The saddest thing about classic ASP.NET websites is startup time. No matter how big is your application I'm sure that you thing that startup can be faster. Of course, you can optimize some operations. For example, to reduce MVC views compilation time, you can use [Razor Generator](https://github.com/RazorGenerator/RazorGenerator), for dependency injection you can try faster IoC container ([simple benchmark](https://www.akshaysura.com/2016/08/31/ioc-container-benchmark-comparison-2016-including-microsoft-extensions-dependencyinjection/)), and so on. But still it can be faster for the first user, isn't it? 
The simple way to cheat is to warm up the site ourselves. We can use a range of tasks from VSTS to create and run even cloud web performance test. But there isn't a simple task to just invoke a bunch of URLs. But we can create a PowerShell task to do the job:
```
param(
    [Parameter(Mandatory)]
    [string]
    $rootUrl
)

#Make sure that website is alive
for($tryIndex=0; $tryIndex -le 10; $tryIndex++){
    try{
        $time =  Measure-Command{Invoke-WebRequest $rootUrl -UseBasicParsing -ErrorAction Stop -ErrorVariable siteIsNotAlive}
        Write-Host "Site is running"
        Write-Host "wget $rootUrl in $($time.TotalSeconds)"
        break;
    }
    catch{
        Write-Host "Sleep + repeat"
        Start-Sleep -s 1
    }
}

#url suffixes
$suffixes = @("/", "/url_1", "url_2")

$suffixes | ForEach-Object{
    $url = $rootUrl+$_;
    $time = Measure-Command{Invoke-WebRequest $url -UseBasicParsing}
    Write-Host "wget $url in $($time.TotalSeconds)"
}
```
 
Probably you ask yourself why I included the part after comment: `Make sure that website is alive`. It is because azure app service doesn't start instant. When the site is still offline, it returns an HTTP error code. You can put above script in VSTS directly or commit it to your repository. I believe that second option is better because deployment scripts are code as anything else. So they should be in the repository. 
But after a commit, we cannot select it, because it is inside MSDeploy package. To fix it we need to modify the csproj file to copy above script in the same location as the MSDeploy package. The change in csproj for MSBuild is:
```
<Target Name="CopyDeployScriptToPackageFolder" AfterTargets="Package">
    <Copy SourceFiles="$(MSBuildProjectDirectory)\deployment\warm-up.ps1" DestinationFolder="$(PackageLocation)" />
</Target>
```
Now new task in VSTS is very simple:

![](/content/images/2017/05/warm-up-ps1.png)

## Downtime
If you still here you probably see the problem: the site downtime is long. Or to be precise is too long for [put your important reason here]. There is a way to fix this in Azure. We need to use application slots. Such solution isn't cheap because you will have to use Standard or Premium plan before we can add a slot. 
After migration adding a new slot is a piece of cake. Just click Add Slot button in Deployment slots section in App Service tile in the Azure portal.

![](/content/images/2017/05/add_slot-2.png) 

The slot is created, so we can change the Deploy Azure App Service task. Click _Deploy to slot_ checkbox and select created slot. Moreover, we have to change warm-up script argument to slot address, because our slot has different URL.
But how to swap slots? Again add a new task to VSTS workflow. This time an "Azure App Service Manage" task. In the time of writing it has a PREVIEW label, but for me, it works perfectly. In the end, we can also stop the slot. After deployment, it contains the previous version of our service. It will be easy to rollback, just swap slots again, to restore it. One more thing, we have to make make sure that our slot is running before running the warm-up script. The easiest way is by adding start slot task. In the end, the full release definition is:

![](/content/images/2017/05/all_tasks-2.png)

There is only one big disadvantage of above setup. We cannot use the *App_data* folder anymore because it doesn't sync between slots. To save data we need to use other Azure stuff like blobs, external logging, SQL database, etc.

p.s. If you are interested more in VSTS, you can check my next article in this topic: [VSTS and install templates - The Good, the Bad and the Ugly](https://stapp.space/vsts-and-install-templates-the-good-the-bad-and-the-ugly/)