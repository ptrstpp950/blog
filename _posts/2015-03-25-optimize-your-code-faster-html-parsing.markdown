---
layout: post
title: Optimize your code - faster html parsing in PowerShell
date: '2015-03-25 10:10:11'
---

### First idea
In PowerShell I need to parse an HTML page to get some stuff from HTML table.
The web page is really simple - it contains one HTML table. I search goole and find out that I can use a lot of build in stuff. 

So my first try was following:

```
$result = Invoke-WebRequest $url
$table = $result.ParsedHtml.getElementsByTagName("table")[0];
$startDate = (Get-Date)
$downloadedFiles = 0;
$result.ParsedHtml.getElementsByTagName('tr') | %{
    $tr =  $_;
    $filename = $tr.childNodes.item(0).outerText;
    $time = $tr.childNodes.item(5).outerText.Replace("-","").Replace(" ","T").Replace(":","");

    if($time.StartsWith($filterDate))
    {
        Write-host $filename " " $time
        $downloadedFiles++;
    }
}
Write-Host "Found $downloadedFiles files in " ((Get-Date)-$startDate)
```

The result of above code was: `Found 192 files in  00:20:34.3135602` The total rows in table is: 3490 rows. **FAIL**.

Why above fact happened? Because PowerShell in standard mode in parsing HTML uses IE and COM object t communicate. This probably slows down the process too much.

### Speed up

Optimization was simple: instead of parsing HTML using IE I need to parse XML using build in functions. But there is a problem my page is not a valid XML. So I extracted a table, fix XML and do following:

```
$downloadedFiles = 0;
$tableHTML = $result.ParsedHtml.getElementsByTagName('table').item(0);
[xml]$tableXML =$tableHTML.innerHTML.ToString().Replace("<BR>","");

$tableXML.ChildNodes.Item(0).ChildNodes| %{
    $tr =  $_;
    $filename = $tr.childNodes.item(0).InnerText;
    $time = $tr.childNodes.item(5).InnerText.Replace("-","").Replace(" ","T").Replace(":","");

    if($time.StartsWith($filterDate))
    {
        Write-host $filename " " $time
        $downloadedFiles++;
    }
}
Write-Host "Found $downloadedFiles files in " ((Get-Date)-$startDate)
```
The result: `Found 192 files in  00:00:03.0420975`. 

Much better :D