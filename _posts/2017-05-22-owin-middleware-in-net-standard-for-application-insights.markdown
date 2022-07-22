---
layout: post
title: Owin middleware in .NET Standard for Application Insights
image: "/content/images/2017/05/StockSnap_Z6NQG48GT0.jpg"
date: '2017-05-22 20:16:01'
tags:
- dotnet
- azure
---

I'm sure that you heard about .NET Standard. To simplify the definition just one quote from [the offical GitHub repo FAQ](https://github.com/dotnet/standard/blob/master/docs/faq.md)

> .NET Standard is a specification that represents a set of APIs that all .NET platforms have to implement. This unifies the .NET platforms and prevents future fragmentation. 

BTW in case you don't know just read the full article [Introducing .NET Standard](https://blogs.msdn.microsoft.com/dotnet/2016/09/26/introducing-net-standard/). 

On the other hand, Owin is (from [owin.org](http://owin.org/)):

>OWIN defines a standard interface between .NET web servers and web applications. The goal of the OWIN interface is to decouple server and application, encourage the development of simple modules for .NET web development, and, by being an open standard, stimulate the open source ecosystem of .NET web development tools.

Both tools should work together in a perfect way. In my case, I tried to find a way to use Application Insights in the OWIN based applications. I have some in .NET Framework and in .NET Core. 

## Application Insights OWIN extensions
There is an open source project [Application Insights OWIN extensions](https://github.com/marcinbudny/applicationinsights-owinextensions). Sounds perfect, isn't it? But unfortunately, it isn't. As we check it on [I can have .NET Core](https://icanhasdot.net/result?github=marcinbudny~2Fapplicationinsights-owinextensions), it has some problems. Mostly, because of its reference to `Microsoft.Owin` package. There is a known replacement for .NET Core called `Microsoft.AspNetCore.Owin`.

## Migration
I migrated a class to uses the `Microsoft.AspNetCore.Owin` package:
```
public class RequestTrackingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestTrackingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        await _next(context);
        sw.Stop();
        Console.WriteLine(sw);
    }
```
But this approach is stupid. It is because I cannot use above class in standard .NET Framework. I ended with a question on [Stack Overflow](http://stackoverflow.com/questions/44051965/creating-owin-middleware-in-net-standard/44065720). In the middle my colleague [Marcin](https://orientman.wordpress.com/) send me an article about [How to write OWIN middleware in 5 different steps](http://benfoster.io/blog/how-to-write-owin-middleware-in-5-different-steps). It is exactly the same as David Fowl posted in the answer.  The third step solves my problem. To simplify the answer we just need to know that all Owin wrappers are made on the top of `IDictionary<string, object> environment` class. And `Invoke` method must return the `Task`. Are you ready? Check the next paragraph for the working code.

## Creating portable code
The first working example which I created is very simple.
```
using AppFunc = Func<IDictionary<string, object>, Task>;

public class OwinMiddleware
{
    private readonly AppFunc _next;
    public OwinMiddleware(AppFunc next)
    {
        _next = next;
    }
    public async Task Invoke(IDictionary<string, object> environment)
    {
        var sw = Stopwatch.StartNew();
        await _next.Invoke(environment);
        sw.Stop();
    }
    
}
```
But such code isn't easy to use because you need to know how to access specific key on the dictionary. To find out what are correct keys probably the easiest way is to use the debugger like below. The wrappers are better, because they give us access using know properties like `Request or `Response`

![Owin debugger](/content/images/2017/05/owin-debugger.png)

## Owin wrapper
So we need an Owin wrapper, without dependencies. And there is exactly such. It is a [LibOwin](https://raw.githubusercontent.com/damianh/LibOwin). But installing using the newest NuGet won't work. The package will be installed, but there won't be a file `App_Packages\LibOwin.X.Y\LibOwin.cs` as it should. This bug probably is caused by newest NuGet.
Anyway, I decided to add manually from the [official repo](https://github.com/damianh/LibOwin/blob/master/src/LibOwin/LibOwin.cs). Hurray, now we have an IntelliSense.

![IntelliSense](/content/images/2017/05/libowin-intellisense.png)

But life is life and there are two compile errors. One is easy to fix just install `System.Security.Claims` NuGet package. For the second one, we need a deeper search. The answer is `System.Globalization.Extensions` package.

Above changes allow creating a quite simple method.
```
public async Task Invoke(IDictionary<string, object> environment)
{
    var context = new OwinContext(environment);
    await _next.Invoke(environment);
    _log.Info("Resonse staus is: "+context.Response.StatusCode);
```
But how to pass `_log` variable? It is not very compilcated.

## Additional arguments
 
Because I would like to track all requests and send them Application Insights I created following constructor
```
public HttpRequestTelemetryTrackingMiddleware(
            AppFunc next, 
            TelemetryConfiguration configuration = null)
{
   _next = next;
   _client = configuration != null ? new TelemetryClient(configuration) : new TelemetryClient();

}
```
And use it like below in classic .NET Framework
```
public override void Configuration(Owin.IAppBuilder app)
{
  app.Use<HttpRequestTelemetryTrackingMiddleware>();
}
```
Unfortunatley, without a reason, this cause an error: `The class 'HttpRequestTelemetryTrackingMiddleware' does not have a constructor taking 1 arguments`.
I spent some time why this error happens, but I still don't know the reason. If you do, please leave a comment or send me an info. Anyway, I added the second constructor to save my time. After above changes and adding a `Microsoft.ApplicationInsights` package, the `Invoke` function is:

```
public async Task Invoke(IDictionary<string, object> environment)
{
    var context = new OwinContext(environment);
    var requestStart = DateTimeOffset.Now;
    
    var sw = Stopwatch.StartNew();
    try
    {
        await _next.Invoke(environment);
        sw.Stop();
    
        var path = context.Request.Path.HasValue ? context.Request.Path.Value : "unknown";
    
        var requestTelemetry = new RequestTelemetry(
            context.Request.Method + " " + path, requestStart, sw.Elapsed,
            context.Response.StatusCode.ToString(), _isRequestSuccessfulFunc(environment));
    
        _client.TrackRequest(requestTelemetry);
    }
    catch (Exception exception)
    {
        _client.TrackException(exception);
        sw.Stop();
    }
}
```
If you decide to copy&paste above code, you will notice that it won't compile, because  `_isRequestSuccessfulFunc` is missing. The main aime of it is to detect that request is correct. 

## When HTTP request is a correct one?
A simple answer is when its value is 200. But that's not true. For example, there are more statuses in the range between 200 and 300, like `204 No Content`. They are correct too.
The next try is all statuses lower than 400, should be good. But this is untrue too. For example, we don't want to have temporary redirects (status `302`) but status `304 Not Modified` is perfect, cause it indicates that the resource has not been modified and the client can use his local cache.
Moreover, you want to accept even some `404 Not Found` statuses for some requests.  For example, in my case, my deployment script makes a fake request to make sure that my 404 page is working correctly.
So the final answer is: it is complicated. To make a decision we need more information and it depends on your current project. If you need to check HTTP response statuses, you can check [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
But the default function can be very simple. I just need to have a control on it. Below the default implementation in the constructor. Notice that I introduced one more parameter.
```
public HttpRequestTelemetryTrackingMiddleware(
    AppFunc next,
    Func<IDictionary<string, object>, bool> isSuccessRequestFunc = null,
    TelemetryConfiguration configuration = null)
    
{
    _next = next;
    _isRequestSuccessfulFunc = isSuccessRequestFunc ??
                               (owinCtx => new OwinContext(owinCtx).Response.StatusCode < 400);

    _client = configuration != null ? new TelemetryClient(configuration) : new TelemetryClient()
}
```
This extension is as much flexible as it is possible, but it will be difficult to use. Because in each implementation we will be missing Owin context helpers. To make it simpler we can make `OwinContext` from `LibOwin` public and pass it as an argument instead of `IDictionary`. To use it we need to define compilation constant LIBOWIN_PUBLIC in the build tag of our project.

![](/content/images/2017/05/lin_owin_constant.png)

After above the constructor simplifies a bit.
```
public HttpRequestTelemetryTrackingMiddleware(
    AppFunc next,
    Func<IOwinContext, bool> isSuccessRequestFunc = null,
    TelemetryConfiguration configuration = null)
{
    _next = next;
    _isRequestSuccessfulFunc = isSuccessRequestFunc ??
                               (owinCtx => owinCtx.Response.StatusCode < 400)
    _client = configuration != null ? new TelemetryClient(configuration) : new TelemetryClient()
}
```

## What's coming next?
Above code only measure a time of HTTP requests, but I need more. I would like to have control on user id, operation id and maybe a session id. Next time I will share my progress how we can track more. So are you ready for the part 2? It is already available: [Owin middleware in .NET Standard for Application Insights part 2](https://stapp.space/owin-middleware-in-net-standard-for-application-insights-part-2/)