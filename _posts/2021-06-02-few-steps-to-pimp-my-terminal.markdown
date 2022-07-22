---
layout: post
title: 6 steps to pimp my terminal
image: "/content/images/2021/06/cover.png"
date: '2021-06-02 09:15:12'
tags:
- windows
- terminal
- powershell
- pwsh
---

## Tools

My current setup is mixed of tools from following list:

- oh-my-posh + powerlevel10k_rainbow (with mods) theme + custom font
- posh-git
- Set-PSReadlineKeyHandler for "bash style" search + autocomplete
- PSKubectlCompletion with PSKubeContext for kubernetes
- Register-ArgumentCompleter for dotnet
- MagicTooltips which is responsible for displaying tooltips for kubectl and az

If you just want to copy-paste, scroll down to the end and copy what you need from my $PROFILE file 😅


## Step 1 - standard + small hacks
The posh-git and oh-my-posh modules are quite popular, but will intruce them shortly:

- posh-git displays info about git status 
- oh-my-posh allows to displays a lot of segments (like: time, battery, last exit code, kubernetes, aws, az, ....) 

There are numerous themes for oh-my-posh. I'm using [powerlevel10k rainbow](https://ohmyposh.dev/docs/themes/#powerlevel10k rainbow), but there are missing icons even on the oh-my-posh website. You'll need a unique typeface to get this appearance. Oh-my-posh recommends [Meslo LGM NF](https://ohmyposh.dev/docs/fonts), but I went with [Delugia Nerd Font Complete](https://github.com/adam7/delugia-code). Is is a Cascadia Code "Extended", which includes Nerd Fonts and powerline glyphs.

You must "force it" in Windows Terminal JSON after installation (to access settings, press CTRL+, then the gear icon on the left):
```
 "profiles": 
    {
        "defaults": 
        {
            "fontFace": "Delugia Nerd Font Complete"
        },
```

The final outcome is awesome:

![terminal](/content/images/2021/06/basic.png)

Finally, remember to include your $PROFILE file (the best approach is to modify it using `code $PROFILE` if you have VS Code installed):
```
# posh git
Import-Module-With-Measure posh-git

# oh-my-posh
Import-Module-With-Measure oh-my-posh
Set-PoshPrompt -Theme powerlevel10k_rainbow
```



## Step 2: bash style history search and autocomplete

Do you get tired of typing CTRL+R to look up commands in the history? Is it easier to just use arrows to find the last invocation of `kubectl get`, for example? I was one of them. Simply add the following to your profile:
```
# up&down arrow for history search
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
```
Add one more if you'd like to view all autocomplete options after pressing TAB:
```
# menu complete using TAB instead of CTRL+SPACE
Set-PSReadlineKeyHandler -Chord Tab -Function MenuComplete
```

Still not convinced? It's time for a little demonstration:

<iframe width="560" height="315" src="https://www.youtube.com/embed/CZOwAJEZf0M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Yummy 😋

## Step 3: Autocomplete

Today I'm only using dotnet and kubernetes autocomplete. I hope that soon I could use also `az`.
Kubernetes config I described in [my last post](https://stapp.space/pskube-context/), 

Anyway, the dotnet command is easy:
```
#dotnet completion
Register-ArgumentCompleter -Native -CommandName dotnet -ScriptBlock {
    param($commandName, $wordToComplete, $cursorPosition)
    dotnet complete --position $cursorPosition "$wordToComplete" | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
}
```

What about Az CLI? The proof of concept is easy, but it isn't a top priority for Azure team 😥, just check [GitHub](https://github.com/Azure/azure-cli/pull/13576).
The [gist](https://gist.github.com/travis-c-lagrone/3ea3393ba8f92b508ee24e237d37bfe2) is the only thing I've found, but I'm not using it.

If you need more stuff for autocomplete, just search, implement or rewrite bash to PowerShell. No shorthands, sorry 😥

## Step 4: Magic tooltips
That's great for displaying dynamic segments. What does this imply? When I type `kubectl<SPACE>`, for example, I want to see information about Kubernetes context, but I don't need it most of the time. The same goes for `az` and `aws`.
The oh-my-posh author [guides me](https://github.com/JanDeDobbeleer/oh-my-posh/discussions/772) to a [MagicTooltips module](https://github.com/TravisTX/MagicTooltips/). I'll probably have to submit a PR there to include namespace as well.
Anyway, I choose to set it up as follows:
```
$global:MagicTooltipsSettings = @{
    VerticalOffset = 0
    HorizontalOffset = 4
    HorizontalAlignment = "Right"
    Providers= @{
        Kubernetes = @{
            Commands = "kubectl,helm,kubens,kubectx,k9s,k"
        }
    }
}
Import-Module MagicTooltips
```

However, to make your theme seem good, you'll probably need to set `HorizontalOffset` and `VerticalOffset`.

My powerlevel 10k setup looks like this (the cluster name is under the clock):
![](/content/images/2021/06/magic-tool-tip.png)

## Step 5: find slow modules/segments
I noticed performance issues after installing various extensions. To repair it, I chose to do the following:

- remove unused segments in powerlevel theme
- measure Import-Module

## Step 6: having "sudo" mode
Isn't it awesome to use sudo in a terminal?
I used two functions to implement it:
```
function fcuk {
    $cmd = (Get-History ((Get-History).Count))[0].CommandLine
    Write-Host "Running $cmd in $PWD"
    start-process pwsh -verb runas -WorkingDirectory $PWD -ArgumentList "-NoExit -Command pushd $PWD; Write-host 'cmd to run: $cmd'; $cmd"
}

function sudo {
    if ($first -eq '!!') {
        fcuk;
    }
    else {
        $file=$args[0];
        [string]$arguments = "";
        if ($args.Count -gt 1) {
            $c = $args.Count - 1;
            [string]$arguments = $args[1..$c]
        }
        Write-Host "file = $file args = $arguments";
        start-process $file -verb runas -WorkingDirectory $PWD -ArgumentList $arguments;
    }
}
```


## My $PROFILE file

Finally, here's what my $PROFILE file looks like:

```
# helper
function Import-Module-With-Measure {
    param ($ModuleName)
    $import = Measure-Command {
        Import-Module $ModuleName
    }
    Write-Host "$ModuleName import $($import.TotalMilliseconds) ms"
}

# posh git
Import-Module-With-Measure posh-git

# oh-my-posh
Import-Module-With-Measure oh-my-posh
Set-PoshPrompt -Theme powerlevel10k_rainbow

# menu complete using TAB instead of CTRL+SPACE
Set-PSReadlineKeyHandler -Chord Tab -Function MenuComplete
# up&down arrow for history search
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# kubectl + stuff 
Import-Module-With-Measure PSKubectlCompletion
Set-Alias k -Value kubectl
Register-KubectlCompletion

Import-Module-With-Measure PSKubeContext
Set-Alias kubens -Value Select-KubeNamespace
Set-Alias kubectx -Value Select-KubeContext
Register-PSKubeContextComplete


# magic tooltip config
$global:MagicTooltipsSettings = @{
    VerticalOffset = 0
    HorizontalOffset = 4
    HorizontalAlignment = "Right"
    Providers= @{
        Kubernetes = @{
            Commands = "kubectl,helm,kubens,kubectx,k9s,k"
        }
    }
}
Import-Module MagicTooltips


#dotnet completion
Register-ArgumentCompleter -Native -CommandName dotnet -ScriptBlock {
    param($commandName, $wordToComplete, $cursorPosition)
    dotnet complete --position $cursorPosition "$wordToComplete" | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
}

# SUDO functions
function fcuk {
    $cmd = (Get-History ((Get-History).Count))[0].CommandLine
    Write-Host "Running $cmd in $PWD"
    start-process pwsh -verb runas -WorkingDirectory $PWD -ArgumentList "-NoExit -Command pushd $PWD; Write-host 'cmd to run: $cmd'; $cmd"
}

function sudo {
    if ($first -eq '!!') {
        fcuk;
    }
    else {
        $file=$args[0];
        [string]$arguments = "";
        if ($args.Count -gt 1) {
            $c = $args.Count - 1;
            [string]$arguments = $args[1..$c]
        }
        Write-Host "file = $file args = $arguments";
        start-process $file -verb runas -WorkingDirectory $PWD -ArgumentList $arguments;
    }
}
```

## What comes next?
You can also find some interesting configurations at:

- Terminal-Icons module - check [screenshot](https://github.com/devblackops/Terminal-Icons#screenshots)
- [Pimp my terminal](https://dominikjeske.github.io/pimp-my-terminal/) by Dominik Jeske - check shortcuts

Maybe you have something useful in your setup?  If yes please share!

