---
layout: post
title: Configuration management in VSTS for classic ASP.NET applications
---

Configuration is almost constant between environments. There are only a few differences like connection string, server name, port or path. In classic ASP.NET application deploy to Azure, the easiest way to manage configuration is using MSDeploy because KUDU uses it for deployment. In Azure there is also a second option, instead of providing configuration on deploy, we can put in in environment variables. But such approach has one problem, there isn't one place to manage and preview all configuration variables. That is why I suggest you using MSDeploy instead 

When you run MSBuild command for MSDeploy it automagically generates zip package with contents plus parameters called [Your project name].SetParameters.xml. VSTS task takes this files and uses it for deployment. The only problem is to provide a proper file content.

## Connection string
First of all, let's remove connection strings from Web.config to separate file. It will simply next steps. It will cause that in web.config connection strings section will look like:
```
  <connectionStrings configSource="config\connectionStrings.config" />
```
And `connectionStrings.config` will be:
```
?xml version="1.0" encoding="utf-8" ?>
<connectionStrings>
  <remove name="umbracoDbDSN" />
  <add name="umbracoDbDSN" connectionString="Data Source=|DataDirectory|\Umbraco.sdf;Flush Interval=1;" providerName="System.Data.SqlServerCe.4.0" />
</connectionStrings>
```

Now it is time to create parameters.xml file. It is a simple plain XML file in root of your web application. In my case it is like following:
```
<?xml version="1.0" encoding="utf-8" ?>
<parameters>
  <parameter name="providerName" description="database provider name"
             defaultValue="System.Data.SqlClient" tags="">
    <parameterEntry kind="XmlFile" scope="\\connectionStrings.config$" match="/connectionStrings/add[@name='umbracoDbDSN']/@providerName" />
  </parameter>
  <parameter name="connectionString" description="database connection string"
             defaultValue="__ConnectionString__" tags="">
    <parameterEntry kind="XmlFile" scope="\\connectionStrings.config$" match="/connectionStrings/add[@name='umbracoDbDSN']/@connectionString" />
  </parameter>
</parameters>
```
The syntax is pretty clear. The `scope` attribute is a regexp to search files in your structure. The easiest way is to write `\\filename.extenstion$`. The match attribute is more difficult because for XmlFile (in kind attribute(


![](/content/images/2017/05/setParameters_in_deploy_task.png)
