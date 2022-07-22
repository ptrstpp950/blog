---
layout: post
title: CDN bundles are avaliable
date: '2014-04-28 20:01:47'
tags:
- dotnet
- ui
---

Few days ago I discovered that ASP.NET team at least add possibility to fallback CDN usage in script bundles. It can be done like following:

    public static void RegisterBundles(BundleCollection bundles)
    {
        bundles.UseCdn = true;
        BundleTable.EnableOptimizations = true; //for debbuging
        
       var jquery = new ScriptBundle("~/bundles/jquery",
            "//ajax.aspnetcdn.com/ajax/jquery/jquery-2.0.0.min.js").Include(
            "~/Scripts/jquery-{version}.js");
       jquery.CdnFallbackExpression = "window.jQuery";
       bundles.Add(jquery);
    }
    
Which generates more or less bellow JavaScript:

     <script type="text/javascript">
            if (typeof jQuery == 'undefined') {
               document.write('<scr'+'ipt type="text/javascript"'+
                                   'src="/bundles/jquery"></sc'+'ript>');
            }
     </script> 
     
Everything is really cool, BUT bundles usually has more than ONE file in it. Of course when can create a bundle for each script, but in my opinion it is quite irritating. Especially that wen need fallback for every script :)

I was looking for CDN with popular bundles, but I cannot find anything like this. Thanks to Patrick Nommensen ([@pnommensen](https://twitter.com/pnommensen)) I found that in [jsDelivr](http://www.jsdelivr.com/) I can specify URL query like:
   
    //cdn.jsdelivr.net/g/jquery@2.0.1,angularjs(angular.min.js+angular-resource.min.js+angular-animate.min.js+angular-cookies.min.js+angular-route.min.js+angular-sanitize.min.js)
   
So download multiple files from CDN, using one request, with every version specfied. Moreover I can prepare exactly same bundle localy and use only **one fallback**. Which is really cool :)