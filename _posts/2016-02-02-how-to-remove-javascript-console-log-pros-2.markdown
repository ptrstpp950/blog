---
layout: post
title: How to remove JavaScript console.log - pros&cons
image: "/content/images/2016/01/pros_and_cons.jpg"
date: '2016-02-02 06:10:25'
tags:
- javascript
- code
---

# How to remove JavaScript console.log - pros&cons

A few days ago I wrote a post:  [Disable JavaScript console on production](/disable-javascript-console-on-production/). Shortly after that, I had a discussion with a friend about other ways to remove `console.*` statements. I felt that the conclusions of that conversion are useful, so I decided to share them with you.

## Method 1: remove it manually
The header is self explanatory. If we decide to go down this route, we need to search and remove all variations of `console.*` statements. For example: console.trace, console.time, console.warn, ...

In this case, a regular expression like `console[.]\w[(].+[)]` will be useful
<h3 style="color:green">Pros</h3>
- `console.*` statements are  removed from our codebase
<h3 style="color:red">Cons</h3>
- it's manual
- it needs to be run after every single commit
- there's no way to turn logging on, on demand (i.e to troubleshoot a crash)
- did I mention that it is manual?

Of course we can run some static code analyst to find out all the `console.*` statements. Event **JSLint** will be enough

## Method 2: build step
We can automate the previous steps using our build tools. A couple of examples are included below:

- [grunt task](https://github.com/ehynds/grunt-remove-logging) to remove `console.*` statements.
- [UglifyJS 2](https://github.com/mishoo/UglifyJS2) `drop_console` option to discard `console.*` functions

and some more.

<h3 style="color:green">Pros</h3>
- `console.*` statements are  removed from our codebase
- it is done automatically 
<h3 style="color:red">Cons</h3>
- only way turn logging is to rebuild&deploy our code
- we have to check if library supports fancy statements like `console && console.log("foo")`

## Method 3: Using a logging library
There are a couple libraries available on market. Just few names: 

- [JsNLog](http://js.jsnlog.com/), 
- [log4javascript](http://log4javascript.org/), 
- [loglevel](https://github.com/pimterry/loglevel). 

The main idea using a 3rd party library is that instead of `console`, we wrote: `log`, `debug`, `JL`, etc.  
Another benefit is that logging can be turned on and off globally through a config file. It is handy for troubleshooting in production environments

<h3 style="color:green">Pros</h3>
- libraries are configurable, so we can disable only some logs
<h3 style="color:red">Cons</h3>
- used plugins probably does not use same logging library
- we need to run periodic check to see if nobody is using `console.*`

## Method 4: Override
This approach allows us to override the `console.*` statements. And, we can easily do it globally. The full code is in my post: [Disable JavaScript console on production](/disable-javascript-console-on-production/)
<h3 style="color:green">Pros</h3>
- it's easy to implement
- it includes all external libraries logs statements
- it is configurable. In my code I disable all log types, but we can choose to disable only a subset (only error or info)
<h3 style="color:red">Cons</h3>
- does anybody have an idea? 

If you have another idea on how to implement this or want to discuss this further feel free to leave a comment or send me a message.
