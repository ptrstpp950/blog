---
layout: post
title: Web.config for SPA applications
---

Almost everything today is a SPA application. We create it, destroy, deploy again. Most of them are changing URL's to be more user and SEO friendly. But there's a catch. Everything is served from one file.

## Rewrite
The easiest way to achieve needed result is to create a `web.config` with following rewrite rule.
```
<rewrite>
  <rules>
    <rule name="SPA route" stopProcessing="true">
      <match url=".*" />
      <conditions logicalGrouping="MatchAll">
        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
        <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
      </conditions>
      <action type="Rewrite" url="/" />
    </rule>
  </rules>
</rewrite>
```
This will work for all request that:

-  aren't a file (`<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />`)
-  aren't a directory (`<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />`)
- aren't a call to our backend API (`<add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />`)

## JSON files
On Azure App usually, there is a second problem. Serving JSON files causes an error because Azure doesn't have a correct mime type for it. To fix it simply add
```
<staticContent>
  <mimeMap fileExtension=".json" mimeType="application/json" />
</staticContent>
```
And that's all folks.