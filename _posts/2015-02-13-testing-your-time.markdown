---
layout: post
title: Time and culture
date: '2015-02-13 09:43:43'
---

## The problem
Yesterday we find a cool bug in code. The code is really simple and was working on 3 of 4 machines. The problematic code is following:

```
var path = @" E:\tmp\test_" + DateTime.Today.ToShortDateString()+".tmp";

using (var file = new FileStream(path, FileMode.Create, FileAccess.Write))
{
    //something
}
```

The exception was `System.IO.DirectoryNotFoundException` in `FileStream` and we of course checked that `E:\tmp\` exists. Moreover the error was only one **one** machine

## The solution
You can run above code on your machine and I am almost sure that if it works correctly. But If you add following line
```
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("en-us");
```
it will throw an error. **Why?** Because directory: `E:\tmp\test_2\13\` does not exist. In polish culture the file `E:\tmp\2015-02-13.tmp` is created without problems, because it does not contains any `\`

## Thing to remember
Be careful we culture specific date formating, especially when we use them in paths.

The funny thing is that any unit test did not find that issue. 