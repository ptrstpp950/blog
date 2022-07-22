---
layout: post
title: Restart, start and stop all Azure Web Apps in resource group using PowerShell
date: '2019-03-19 15:30:19'
tags:
- azure
- devops
---

This post is short but useful. We need just two lines (we can combine it to one):
```
$allSites = Get-AzureRmWebApp -ResourceGroupName resource-group-name
@($allSites).GetEnumerator() | Restart-AzureRmWebApp
```
The trick is to use `GetEnumerator()` because above commandlet returns `System.Collections.Generic.List` instead of array of individual objects into pipeline.

This also works with `Stop-AzureRmWebApp` and `Start-AzureRmWebApp`.

Simple, fast and useful. What we need more :)

