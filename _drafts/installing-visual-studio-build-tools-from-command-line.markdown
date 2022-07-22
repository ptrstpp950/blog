---
layout: post
title: Installing Visual Studio Build Tools from command line
---

Visual Studio Build Tools as the name suggests needs to be installed (almost) only on build servers. In my opinion, it should install from the command line as easy as pie. But if you ever tried, you know that it is hard.

## If you are lucky
If you are lucky you can use [Chocolatey](https://chocolatey.org). Moreover, if your build machine is modern enough you can use Chocolatey as OneGet provider. To add it just type:
```
Register-PackageSource -Name chocolatey -ProviderName Chocolatey -Location http://chocolatey.org/api/v2/ -Trusted -Force
```
And for example, you can install Google Chrome with the following command 
```
Install-Package -Name GoogleChrome -Source Chocolatey -Force
```

Moreover, you can find some packages on the Chocolatey to install Visual Studio Build tools created by [Jakub Berezanski](https://chocolatey.org/profiles/jberezanski). But Jakub doesn't always update everything, which is quite reasonable. Anyway, the basic package exists [Visual Studio 2017 Build Tools](https://chocolatey.org/packages/visualstudio2017buildtools) and even more specific, for example [Web development build tools workload for Visual Studio 2017 Build Tools](https://chocolatey.org/packages/visualstudio2017-workload-webbuildtools). In my case, it failed with following error

```
ERROR: The term 'Install-VisualStudio' is not recognized as the name of a cmdlet, function, script file, or operable pro
gram. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

To fix it I had to force reinstall [Chocolatey Visual Studio servicing extensions 1.4.](https://chocolatey.org/packages/chocolatey-visualstudio.extension) with
```
choco install chocolatey-visualstudio.extension --force -y
```

But still, I have few problems. I don't want to install everything (like C++ compiler), but still, I needed some not typical options (like F# compiler)

## Finding options
When I was a ~~young~~ junior .NET developer, for any problems there was only one answer. Look the MSDN, Luke! And I was really surprised to find the first link in Google pointing me to [Use command-line parameters to install Visual Studio 2017](https://docs.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio). Interesting option for me is `--add`, I can probably guess it before. Anyway, the add option needs one or more workload or component IDs. So where I can found these IDs? A quick search and I found [Visual Studio 2017 workload and component IDs](https://docs.microsoft.com/en-us/visualstudio/install/workload-and-component-ids). Hurray! Even if you download Visual Studio Build Tools from https://www.visualstudio.com/pl/downloads/#other-pl you can easily test it just with running
```
.\vs_BuildTools.exe --add "option"
```
If an option is bad, you will receive a beautiful alert with an information about it. But after an hour I didn't found a proper option for the F# compiler. Gosh!

![](/content/images/2017/08/vs-installer-error.png)

## Checking source
Somehow the installer knows all available options. In such case, I know two possibilities. They are compiled in or installer downloads them from the internet.
I decided to look what is in the vs_BuildTools.exe file. Fortunately, 7-zip can unpack it and we can see following structure

![](/content/images/2017/08/7zip.png)

The `vs_setup_bootstrapper.json` contains link to https://aka.ms/vs/15/release/channel. If you download this file you will have `visualstudio.15.release.chman` which is also a JSON. Moreover, it contains a channel item with id `Microsoft.VisualStudio.Product.BuildTools`, but without an URL. That is why I used URL from `Microsoft.VisualStudio.Manifests.VisualStudio` and Eureka. I the downloaded `visualstudio.vsman` I found all components I need. It is really a huge JSON file, but you can search using labels from the GUI installer. In my case, I was searching for `F# compiler` and found `Microsoft.VisualStudio.Component.FSharp.MSBuild`. 


# Running the command
I was ready to run and the command was exactly like below
```
choco install visualstudio2017buildtools --no-progress --force -y --package-parameters "modify --add Microsoft.VisualStudio.Component.FSharp.MSBuild --add Microsoft.VisualStudio.Workload.MSBuildTools" 
```
But above produced an error
```
ERROR: Exception calling "Add" with "2" argument(s): "Item has already been added. Key in dictionary: 'add'  Key being added: 'add'"
The install of visualstudio2017buildtools was NOT successful.
```
I tried a few options, but all of them produce some kind of errors. So I have to give up with this package and decided to use the basic installer.

## Installer
After all above steps, using installer should be simple. Should is the most important word in the previous sentence, but I manage that the final script for my case is:
```
mkdir -p c:\agent
wget https://download.visualstudio.microsoft.com/download/pr/11168600/e64d79b40219aea618ce2fe10ebd5f0d/vs_BuildTools.exe -o c:\agent\vs_BuildTools.exe
$options = "Microsoft.VisualStudio.Component.FSharp.MSBuild", "Microsoft.VisualStudio.Workload.MSBuildTools", "Microsoft.VisualStudio.Workload.WebBuildTools", "Microsoft.VisualStudio.Workload.NetCoreBuildTools", "Microsoft.Net.ComponentGroup.4.7.DeveloperTools", "Microsoft.Net.ComponentGroup.4.6.2.DeveloperTools"
$ar = "--norestart --wait --quiet --includeRecommended --add $($options -join " --add ")"
Start-Process -FilePath .\vs_BuildTools.exe -ArgumentList $ar -Wait | Write-Output
```
## Tips & tricks
I was testing above script on `Set-AzureRmVMCustomScriptExtension` and I spend a whole day without knowing why above doesn't work. Of cource when I run it manually eveything was working like a charm. 
If you have problem I suggest you check

- `c:\Windows\Temp` folder to see if there are any VS log files
- `Start-Process` doesn't produce an error code, so replace it with `$exitCode = [Diagnostics.Process]::Start($vsBuildToolsPath,$ar).WaitForExit();`
- Run&fix until it is working, than destroy and run the whole process again
- Use `ngrok` to serve local files, so you can easily manage changes in script. Example usage you can find in my post: [How to test azure function on localhost from the Internet?](https://stapp.space/how-to-test-azure-function-on-localhost-from-the-internet/)
- If above doesn't work without a reason use choco to install visualstudio2017buildtools and then instead of downloaded installer run modify command on installed Visual Studio Installer:
```
$options = "Microsoft.VisualStudio.Component.FSharp.MSBuild", "Microsoft.VisualStudio.Workload.MSBuildTools", "Microsoft.VisualStudio.Workload.WebBuildTools", "Microsoft.VisualStudio.Workload.NetCoreBuildTools", "Microsoft.Net.ComponentGroup.4.7.DeveloperTools", "Microsoft.Net.ComponentGroup.4.6.2.DeveloperTools"
#$ar = "--norestart --wait --quiet --includeRecommended --add $($options -join " --add ")"

$ar = "modify", "--norestart", "--includeRecommended"
$ar += "--installPath `"C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools`""
foreach($opt in $options){
    $ar+= "--add $($opt)"  
}
$ar += "--quiet"
$vsInstallerPath = "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe"
[Diagnostics.Process]::Start($vsInstallerPath, $ar).WaitForExit();
```
