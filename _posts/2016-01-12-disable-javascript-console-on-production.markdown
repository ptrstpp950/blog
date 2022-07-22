---
layout: post
title: Disable JavaScript console on production
image: "/content/images/2016/01/1418084477970.jpg"
date: '2016-01-12 12:21:46'
tags:
- javascript
- code
---

I love to put a log of debugging information in my code. Especially in JavaScript part. 
It shows me a lot of stuff during my work and allows to diagnose what had happened.
Moreover I can include tracing/measure/etc using `time` and `profile` functions.
But all above logs shouldn't be visible on production to every user.

The solution for above is simple. we need to override `window.console` functions.
```
(function () {
    var method;
    var noop = function noop() { };
    var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];
		console[method] = noop;
    }
}());
```

If I forgot about something in `window.console` object, just let me know.

*@Cover from [WAToday](http://www.watoday.com.au/wa-news/protestors-put-stop-to-helms-forest-logging-near-nannup-20141208-122t2y.html)*