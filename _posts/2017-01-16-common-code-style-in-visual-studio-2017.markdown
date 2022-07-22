---
layout: post
title: Common code style in Visual Studio 2017
image: "/content/images/2017/01/vs2017-editorconfig-1.png"
date: '2017-01-16 19:03:57'
tags:
- tools
- visual-studio
- vs2017
---

You open a file, change one line, press save and the file has changed its structure. But you add only a simple comma, variable or if. How could this happen to me again?

## IDE vs style vs developers
Today we use different IDE and notepads in teams. Moreover, I'm sure that you have more than one text editor installed. And most of them have syntax helpers and code formatters.

## Tool to the rescue
There is a nice tool that helps developers configure and enforce formatting and code style. It is [EditorConfig](http://editorconfig.org/). Using a plain file `.editorconfig` we can enforce for example:

- spaces or tab indentation; 
- charset; 
- end of line char;
- and more.

## Can I use it?
Editor Config has a really wide support. It will work without plugin in JetBrains tools (InteliJ, WebStorm, PHPStorm, ...), Github and TortoiseGit. Moreover, there is a plugin for almost every IDE like NetBrains, Eclipse, Emacs, Atom, Sublime, Notepad++, Visual Studio Code and older versions of Visual Studio.

## Visual Studio 2017
In Visual Studio 2017 Microsoft implemented native support for Editor Config. They extended specification and added more features for .NET developers. For example:

- force or disallow `this.` before methods and properties in C#;
- prefer expression-bodied members for properties in C# (`public int Age => _age;` instead of `public int Age { get { return _age; }}`);
- null propagation in null checking;
- and more.

All options are described on [.NET Code Style Settings For EditorConfig](https://docs.microsoft.com/en-us/visualstudio/ide/editorconfig-code-style-settings-reference). What's more? We can specify a severity for every option: `none`, `suggestion`, `warning`, or `error`.

The result in VS 2017 looks like:
![](/content/images/2017/01/vs2017-editorconfig.png)
Really nice, isn't it?

##  
Common code format is better, it makes it more readable. But the most important reason is much simpler. Using common formatting and code style has one big advantage. There aren't commits with formatting only. And all changes can be small.
The last thing. Do you want to code with the same code format as Microsoft developers? Yes we can! The [Roslyn Editor Config file](https://github.com/dotnet/roslyn/blob/master/.editorconfig) is available on Github, so we can use it in our projects.