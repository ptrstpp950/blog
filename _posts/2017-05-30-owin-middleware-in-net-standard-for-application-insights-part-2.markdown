---
layout: post
title: Owin middleware in .NET Standard for Application Insights - part 2
image: "/content/images/2017/05/night-75526.jpeg"
date: '2017-05-30 07:14:54'
tags:
- dotnet
---

Some things were done, much more to do. If you didn't read [part 1](/owin-middleware-in-net-standard-for-application-insights/), look at it before reading this one.

## Simple tracking
The basic telemetry tracking method is a piece of cake. The example code below
```
public async Task Invoke(IDictionary<string, object> owin)
{
    var context = new OwinContext(owin);
    var requestStart = DateTimeOffset.Now;
    var sw = Stopwatch.StartNew();
    try
    {
        await _next.Invoke(owin).ConfigureAwait(false);
        sw.Stop();
        
        var name = context.Request.Path.HasValue ? context.Request.Path.Value : "unknown";
        
        var requestTelemetry = new RequestTelemetry(
            name, requestStart, sw.Elapsed,
            context.Response.StatusCode.ToString(),
            _isRequestSuccessfulFunc(owin)) {Url = context.Request.Uri};
        requestTelemetry.Properties.Add("HttpMethod", context.Request.Method);
        
        _client.TrackRequest(requestTelemetry);
    }
    catch (Exception exception)
    {
        _client.TrackException(exception);
        sw.Stop();
    }
}
```
One explanation to above code. There is a `requestTelemetry.HttpMethod` but it is marked as obsolete, so I decided to pass it as custom properties. So instead I have
```
requestTelemetry.Properties.Add("HttpMethod", context.Request.Method);
```


## Passing custom properties
In some cases, we want to pass some custom to telemetry. For example URL referrer or error HTTP context or some headers. Whatever you like. To make it flexible as much as possible I decided to use an Action, which will modify a properties dictionary. Of course, the default action should be empty, so the constructor changed a bit
```
public HttpRequestTelemetryTrackingMiddleware(
    AppFunc next,
    Func<IDictionary<string, object>, bool> isSuccessRequestFunc = null,
    Action<IDictionary<string, string>> telemetryPropertiesSetter = null,
    TelemetryConfiguration configuration = null)
{
    _next = next;
    _isRequestSuccessfulFunc = isSuccessRequestFunc ??
                               (owin => new OwinContext(owin).Response.StatusCode < 400);

    _client = configuration != null ? new TelemetryClient(configuration) : new TelemetryClient();
    
    _telemetryPropertiesSetter = telemetryPropertiesSetter ?? (dict => { });
}
```
Moreover, you can notice one more change, from the previous article. I decided to remove `OwinContext` from above method because I hide LibOwin. Creating an OwinContext in dotNET Framework or dotNET Core is very easy and in both can be written as `new OwinContext(owin)`. When I introduced a second Owin implementation, it just makes a rubbish instead of clean code.


## Example telemetry setter
In my case, I decided to track HTTP referer and some of the request headers. The example code is:
```
Action<IDictionary<string, object>, IDictionary<string, string>> telemetrySetter = (owin, properties) =>
{
    var ctx = new OwinContext(owin
    var dictionary = ctx.Request.Headers.Keys.Where(key => key != "UMB_UCONTEXT")
        .ToDictionary(key => key, key => ctx.Request.Headers[key]
    if (ctx.Request.Headers.ContainsKey("Referer"))
    {
        properties.Add("urlReferrer", ctx.Request.Headers["Referer"]);

    properties.Add("requestHeader", JsonConvert.SerializeObject(dictionary)

app.Use<HttpRequestTelemetryTrackingMiddleware>(isSuccessfulRequest, telemetrySetter);
```
To check what can be useful I suggest looking at [Migrating HTTP handlers and modules to ASP.NET Core middleware](https://docs.microsoft.com/en-us/aspnet/core/migration/http-modules) article. It isn't exactly about Owin properties, but almost perfectly describes possible properties.

## GetLastServerErrror or HttpContext?
If you code in ASP.NET, you probably saw `GetServerError` before. It is the last chance to get know what had happened. It is also accessible by `HttpContext.Current.Error`. It is an example of properties, which we cannot access in Owin because Owin's pipeline works in a bit different way. I was thinking about accessing `HttpContext` in `_telemetryPropertiesSetter` action, but there is one problem:
```
await _next.Invoke(owin).ConfigureAwait(false);
```
According to the accepted answer on [Best practice to call ConfigureAwait for all server-side code
](https://stackoverflow.com/questions/13489065/best-practice-to-call-configureawait-for-all-server-side-code#answer-13494570) question on StackOverflow, such method will lose invocation context.
> The only difference ConfigureAwait makes in ASP.NET is whether that thread enters the request context when resuming the method.

Such information makes me think about above code, but I'm not sure if I should change it to `ConfigureAwait(true);`. Maybe should I just handle errors using for example `IHttpModule` instead? What do you think?