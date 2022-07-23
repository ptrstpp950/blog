---
layout: post
title: How to enhance debugging in Visual Studio with just one simple step
image: "/content/images/2016/09/code.png"
date: '2016-09-12 17:33:00'
tags:
- c
- visual-studio
---

During the debugging session, I always had problems with complex structures. Preview most interesting properties were irritating, we need to expand a variable.
In most cases, I tried to override `ToString` method. But it isn't always possible.
Default tooltip is useless. Just look on it:
![](/content/images/2016/09/rangeWithoutAttribute.png)

## Adding an attribute
Probably You won't believe me, but a few years ago, in .NET 2.0 times, Microsoft introduced `DebuggerDisplayAttribute`, which is very useful. Just add it like below:
```
[DebuggerDisplay("Range=<{RangeStart}; {RangeEnd})")]
class Range
{
    public int Start;
    public int End;
    //Other stuff
}
```

Now, tooltip looks great. Moreover, your class doesn't change at all. Just check it out:
![](/content/images/2016/09/rangeWithAttribute.png)


## More awesome stuff
Another great attribute is `DebuggerBrowsableAttribute` and `DebuggerTypeProxyAttribute`. Just take a look on [MSDN](https://msdn.microsoft.com/en-us/library/ms228992%28v=vs.110%29.aspx?f=255&MSPPError=-2147217396) to find out more.
