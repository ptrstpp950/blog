---
layout: post
title: Get Firebug logs from Selenium tests
image: "/content/images/2015/08/firebug_back.png"
date: '2015-08-18 13:10:05'
tags:
- selenium
- c
- testing
- firebug
---

##The problem
Selenium test are difficult to debug, especially when they are run on CI server. To diagnose why a test failed, sometimes we need something more than a simple screenshot.

In my opinion we need 3 things:

 - a screenshot
 - network log
 - console log

The easiest way to get last two is to use Firebug in Firefox.

##Run Firebug in Selenium
To get results from firebug we need two more extensions:

 - netExport https://github.com/ptrstpp950/netexport (my changes are not merged yet)
 - consoleExport https://github.com/firebug/consoleexport (my changes already merged)

You can compile both using ant :)

##The C# code
The final code:

    var fireBugLogDir = "somewhere";

    FirefoxProfile ffProfile = new FirefoxProfile();
    ffProfile.AddExtension(@".\FireFoxAddons\firebug-2.0.11.xpi");
    ffProfile.SetPreference("extensions.firebug.currentVersion", "2.0.11"); //your version number
    ffProfile.SetPreference("extensions.firebug.showStackTrace", true);
    ffProfile.SetPreference("extensions.firebug.delayLoad", false);
    ffProfile.SetPreference("extensions.firebug.showFirstRunPage", false);
    ffProfile.SetPreference("extensions.firebug.allPagesActivation", "on");
    ffProfile.SetPreference("extensions.firebug.console.enableSites", true);
    ffProfile.SetPreference("extensions.firebug.net.enableSites", true);
    ffProfile.SetPreference("extensions.firebug.scripts.enableSites", true);
    ffProfile.SetPreference("extensions.firebug.defaultPanelName", "console");

    // Set default NetExport preferences
    ffProfile.AddExtension(@".\FireFoxAddons\netExport-0.9b8.xpi");
    ffProfile.SetPreference("extensions.firebug.netexport.alwaysEnableAutoExport", true);
    ffProfile.SetPreference("extensions.firebug.netexport.showPreview", false);
    ffProfile.SetPreference("extensions.firebug.netexport.includeResponseBodies", false);
    ffProfile.SetPreference("extensions.firebug.netexport.defaultLogDir", fireBugLogDir);
    ffProfile.SetPreference("extensions.firebug.netexport.harFileName", @"network"); //the file will be save as network.har in fireBugLogDir

    // Set default consoleExport preferences
    ffProfile.AddExtension(@".\FireFoxAddons\consoleExport-0.5b6.xpi");
    ffProfile.SetPreference("extensions.firebug.consoleexport.active", true);
    ffProfile.SetPreference("extensions.firebug.consoleexport.alwaysEnableAutoExport", true);
    ffProfile.SetPreference("extensions.firebug.consoleexport.format", "xml");
    ffProfile.SetPreference("extensions.firebug.consoleexport.logFilePath",
        Path.Combine(fireBugLogDir, "consoleLog.xml")); //the file will be save as consoleLog.xml in fireBugLogDir
    
    var firefoxDriver = new FirefoxDriver(ffProfile);
    return firefoxDriver;