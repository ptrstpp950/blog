---
layout: post
title: Clean code - regular expressions
image: "/content/images/2016/01/wizard.jpg"
date: '2016-01-04 14:27:11'
tags:
- code
---

The most important thing I learn in 2015 is about clean code. It is everything. You can have a bad performance or logical errors or even security issues. But without clean code, you cannot fix it. Unless you don't understand the code, you won't fix it.

## Regexp versus clean code
The regular expressions were always dramatic for fast reading. I always need a lot of time to understand what exactly is going on. The only help was in the variable name.

Take a look on example from StackOverflow question [Regular expression for matching account numbers](http://stackoverflow.com/questions/34588143/regular-expression-for-matching-account-numbers):

    ^Acc(?:oun)?t(?:\s+Number)?.+[\d-]+$

Reading it through gives me an idea that string should contain:

- some parts of `Account Number` 
- digits at the end of the string. 

But the full requirement was:
>I need a regex which checks each line starting with “Acc”, ignore white space and any special character and then ending with numeric.

> However, in addition to account numbers it is also matching other patterns such as "Bank ID : 12345"; "Account Name : ABC" . ; "Account Address" etc. Any way to exclude these?

Does above rather simple regexp fulfill requirements? To be fair I don't know.

The only rescue is in tools like [Jex Regulex](https://jex.im/regulex) to visualize regular expressions and make them readable:
![Example Regexp visualization](/content/images/2016/01/download.png)


## How about the code?
Such solution has one problem. We need an additional tool or plugin to see what is going on in one line in the code. Which make this solution useless until we are debugging an error. A few unit tests can make above regexp cleaner. But isn't more readable. It just makes it easier to investigate.
Can you image that above code will look like following?

```
var tester = VerEx()
            .startOfLine()
            .then( "Acc" ) 
            .maybe("oun")
            .then("t")
            .maybe(VerEx().add("\\s+").then("Number"))
            .anything()
            .then(VerEx().then("-").or().range(0,9)).add("+")
            .endOfLine();

```
which produces expression like:
![](/content/images/2016/01/new-1.png)

The above code is done using the [VerbalExpressions] (https://github.com/VerbalExpressions/JSVerbalExpressions) library. There are also ports to other languages like C#, Java, Ruby or Objective-C on http://verbalexpressions.github.io/. It is much more readable. I miss only two functions, so I have to cheat above. The missing functions are:

1. `oneOrMore()` instead of `add("+")`. Existing function `repeatPrevious` allows only repeating the item exactly. It produces `{x}` or `{x,y}` expression
2. `whitespace()` - above I used `add("\\s+")`. They implemented functions like `word()` or `tab()` or even `lineBreak()`, but this one is missing.

With above two functions we can make our code even better:
```
var tester = VerEx()
            .startOfLine()
            .then( "Acc" ) 
            .maybe("oun")
            .then("t")
            .maybe(VerEx().whitespace().oneOrMore().then("Number"))
            .anything()
            .then(VerEx().then("-").or().range(0,9)).oneOrMore()
            .endOfLine();
```

The above code is clean. Using it I can guess the requirements without knowing them. And I can easy make some changes. 

**Update**: pull request is ~~pending~~ [merged on github](https://github.com/VerbalExpressions/JSVerbalExpressions/pull/92)

*@cover from http://wall.alphacoders.com/big.php?i=157189*