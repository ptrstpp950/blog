---
layout: post
title: Using letter Pi(π) in JavaScript
image: "/content/images/2017/03/Pi-symbol-svg-1.png"
date: '2017-03-09 18:13:37'
tags:
- javascript
---

Today I was doing some math in JavaScript. I needed a simple calculation from degrees to radians. Of course, I didn't remember the formula. I copied it from [Rapid Tables](http://www.rapidtables.com/convert/number/radians-to-degrees.htm) but I forgot to replace π char. Unexpectedly I received a normal error:
```
Uncaught ReferenceError: π is not defined
```
What? Is Pi sign a valid variable in JavaScript?

## Documentation
[The official ECMA Script documentation](https://www.ecma-international.org/ecma-262/5.1/#sec-7.6) is quite complicated. But we can simplify this to (by [Mathias Bynen](https://mathiasbynens.be/notes/javascript-identifiers)):
```
An identifier must start with $, _, or any character in the Unicode categories “Uppercase letter (Lu)”, “Lowercase letter (Ll)”, “Titlecase letter (Lt)”, “Modifier letter (Lm)”, “Other letter (Lo)”, or “Letter number (Nl)”.
```

This allows us to write following code from ES5
```
var π = Math.PI;
```

Isn't this cool?