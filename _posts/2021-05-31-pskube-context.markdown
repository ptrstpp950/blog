---
layout: post
title: Make PowerShell with k8s great again
image: "/content/images/2021/05/PSKubeContext.jpg"
date: '2021-05-31 13:38:51'
tags:
- powershell
- k8s
---

So, like me, you're using Windows. WSL isn't always reliable (e.g. VPN problems), yet you're working with Kubernetes and require autocomplete tools. I'm the same way :)

## Kubectl autocomplete

With bash or zsh, having autocomplete is straightforward. Almost only one command is required to complete the task:

```
source <(kubectl completion bash)
```
However, this will obviously not work in PowerShell😅. Especially when you look what and how many lines the `kubectl completion bash` command produces and how many lines it generates:
```
kubectl completion bash | wc -l
```
14143 is the correct answer! To implement autocomplete, more than 14k lines of code were written!
How to use it on Windows?  Is it possible to move it? Yes, and thankfully, someone else did the legwork for you: https://github.com/mziyabo/PSKubectlCompletion/blob/master/PSKubectlCompletion.psm1

To use autocomplete we will need the [PSKubectlCompletion module](https://github.com/mziyabo/PSKubectlCompletion). Install it with `Install-Module PSKubectlCompletion` and include with:
```
Import-Module PSKubectlCompletion
Set-Alias k -Value kubectl
Register-KubectlCompletion
```
At this point the basics are working quite well. But how about other tools? Like ...

## kubectx and kubens
If you never use the original ones these are two simple commands to switch your current Kubernetes context (`kubectx`) and namespace (`kubens`). In PowerShell world they should be named rather like Select-KubeContext and Select-KubeNamespace, but I will you aliases instead 😜

And for above someone else did the work for you once more. It's me this time: https://github.com/ptrstpp950/PSKubeContext
How it works? Just let me present a small YouTube:
<iframe width="560" height="315" src="https://www.youtube.com/embed/_6XjdLD0TWo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Great, isn't it?  I'm so glad it works that I made and published a module called [PSKubeContext
](https://www.powershellgallery.com/packages/PSKubeContext)

To utilize it, install it with `Install-Module PSKubeContext`, and simply add the following to your profile:
```
Import-Module PSKubeContext
Set-Alias kubens -Value Select-KubeNamespace
Set-Alias kubectx -Value Select-KubeContext
Register-PSKubeContextComplete
```

What's inside:

- `Select-KubeContext` or if you prefer alias `kubectx`
- `Select-KubeNamespace` or `kubens`
- 100% autocomplete using <TAB> 🙈🙉🙊
- A menu in command line to select the context/namespace if something goes wrong 😅

And that's it. Your PowerShell is great again and works well with Kubernetes CLI.
