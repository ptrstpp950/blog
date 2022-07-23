---
layout: post
title: Null pointer exceptions and warnings
image: "/content/images/2015/10/download.jpg"
date: '2015-10-21 06:59:00'
tags:
- c
- visual-studio
---

## Simple code
I am developer so let's start with following C# code:

        public static void Main()
        {
            var sampleList = GetSamples();
            if (sampleList.FirstOrDefault().StartsWith("I"))
            {
                Console.WriteLine("First element starts with I");
            }
            else
            {
                Console.WriteLine("First element doesn't start with I");
            }
        }
It compile without any warnings, which is quite cool, But will it work without problems? Of course it depends on `GetSamples` function. But it should, isn't it?

## Full implementation
So let's extend above code to full implementation:

        static readonly Random Random = new Random();
        static List<string> GetSamples()
        {
            if (Random.Next(100) > 2)
            {
                return new List<string>{"I"};
            }
            return new List<string>();
        }
        public static void Main()
        {
            var sampleList = GetSamples();
            if (sampleList.FirstOrDefault().StartsWith("I"))
            {
                Console.WriteLine("First element starts with I");
            }
            else
            {
                Console.WriteLine("First element doesn't start with I");
            }
        }

Now it starts to look tricky and dangerous. But again you will don't have any warning in Visual Studio.

## Resharper to the rescue
If you use R# you will see following warning:
![](/content/images/2015/10/warning.png)

Using `Alt+Enter`shortcut generate simple fix:
   
    var firstOrDefault = sampleList.FirstOrDefault();
    if (firstOrDefault != null && firstOrDefault.StartsWith("I"))
    {
       Console.WriteLine("First element starts with I");
    }
    else
    {
       Console.WriteLine("First element doesn't start with I");
    }

And we are safe now :)

##... but it doesn't show everything
But imagine that instead of `FirstOrDefault()` the developer used `First()`, so the above `if` will be following:

    if (sampleList.First().StartsWith("I"))

In above case it won't be any warning even in Resharper :(

## Sum up

![](/content/images/2015/10/55730792.jpg)


