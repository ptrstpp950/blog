---
layout: post
title: Readable request headers in Application Insights
image: "/content/images/2017/07/pablo--4-.png"
date: '2017-07-27 08:42:11'
tags:
- azure
---

Querying logs is a must have. But to create simple queries, logs must be readable also for humans. Sometimes using default serialisation is not a way to go, and because we are good developers we have to fix it.

## Assumptions
In the begging few assumptions:

- I'm using LibOwin. To read why check out my previous posts about Owin middleware in NET Standard for Application Insights [part 1](https://stapp.space/owin-middleware-in-net-standard-for-application-insights/) and [part 2](https://stapp.space/owin-middleware-in-net-standard-for-application-insights-part-2/)
- I'm trying to write my code to support classic dotnet and dotnet Core, usually using NET Standard :)
- I'm using the SeriLog library. Why? Let's say because I like it. A more serious reason it is because I log objects, and with included sink, it is easily parsable by Azure stuff. If you don't agree or know better logging lib for this purpose, just let me know in comments/email/twitter/facebook/[put something here]


## The problem
In Owin, or maybe I should write in LibOwin, request and response headers have type `IHeaderDictionary` which inherits `IDictionary<string, string[]>`. Above inheritance and [a pull request no 14 from 15 June 2016](https://github.com/serilog/serilog-sinks-applicationinsights/pull/14), produce the following result in [Analytics queries](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics)

![](/content/images/2017/07/org-headers-log.png)

Such representation is ugly and difficult to query. While searching is still simple, a listing is much more complicated. For example, try list all user-agent in last 10 minutes.

## Why header value is an array of strings?
To be precise that was my first question. After a second I found somewhere in my mind that server can send for example more than one accept header. But I need something more to know what's going on. Especially that most useful headers in 99% cases are single values, like a `User-Agent` header mentioned before. In the official documentation, which in this case is [RFC 2616 - HTTP/1.1 - 4.2 Message Headers](https://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2), I found:

>Multiple message-header fields with the same field-name MAY be present in a message if and only if the entire field-value for that header field is defined as a comma-separated list [i.e., #(values)]. It MUST be possible to combine the multiple header fields into one "field-name: field-value" pair, without changing the semantics of the message, by appending each subsequent field-value to the first, each separated by a comma. The order in which header fields with the same field-name are received is therefore significant to the interpretation of the combined field value, and thus a proxy MUST NOT change the order of these field values when a message is forwarded.

Also on [StackOverflow](https://stackoverflow.com/questions/3241326/set-more-than-one-http-header-with-the-same-name), I found the main problem. It is a Cookie spec. The main problem is in `Set-Cookie` header, which contains a comma in value.

So when I know the reason, and the problem I can apply a simple solution

## Convert headers to a dictionary
A simple test showed me that a `Dictionary<string,string>` serialise as we can expect: key and value pair. So I created a simple extension method which solved my problem.

```
internal static IDictionary<string, string> ConvertHeadersToDictionary(this IHeaderDictionary headers)
{
    var result = new Dictionary<string, string>();
    foreach (var header in headers)
    {
        if (header.Value.Length == 1)
        {
            result.Add(header.Key, header.Value.First());
        }
        else
        {
            for (var i = 0; i < header.Value.Length; i++)
            {
                result.Add($"{header.Key}.{i}", header.Value[i]);
            }
        }
    }
    return result;
}
```
The result below. It is beatiful, isn't it?

![](/content/images/2017/07/after-headers-log.png)

The query is also simple. For example, if we want to find all requests which accept en-US language we can write below query
```
traces
| where customDimensions["Headers.Accept-Language"] contains "en-US" 
```

If you have a better idea, please let me know. All ideas welcome :)