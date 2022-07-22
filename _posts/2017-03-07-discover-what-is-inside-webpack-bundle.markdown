---
layout: post
title: Discover what is inside webpack bundle
image: "/content/images/2017/03/pexels-photo-47446.jpeg"
date: '2017-03-07 20:08:18'
tags:
- javascript
---

You start a new project using magic tools like `yo`,  a built-in CLI (e.g. `aurelia-cli`, `angular-cli`, `react-cli`, `vue-cli`, `omg-new-framework-cli`) or just a template from GitHub. Most of them have a webpack inside because this is a fancy module bundler nowadays. But what exactly is inside of built bundle?

## Running plain webpack tool
Before we start optimization we need to run plain `webpack`. In most templates, it is hidden behind `grunt`, `gulp` or native command. Running it manually is simple:
```
 ./node_modules/.bin/webpack
```
but I'm sure that you will end with an error like:
```
No configuration file found and no output filename configured via CLI option.
A configuration file could be named 'webpack.config.js' in the current directory.
Use --help to display the CLI options.
```

So instead we should run (replace `./conf/webpack-dist.conf.js` with proper path)
```
./node_modules/.bin/webpack --config ./conf/webpack-dist.conf.js
```

This will give a nice output with all files listed, but it isn't readable enough.

## Make it more readable
Like always we need another NPM. For example a [Webpack Bundle Size Analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer). After install we can run:
```
./node_modules/.bin/webpack --config ./conf/webpack-dist.conf.js --json | webpack-bundle-size-analyzer.cmd
```
And receive a simple plain result where `<self>` is your code
```
xxx: 169.66 KB (44.7%)
xxx-validate: 81.14 KB (21.4%)
xxx-router: 54.8 KB (14.5%)
xxx-resource: 34.22 KB (9.03%)
style-loader: 6.74 KB (1.78%)
css-loader: 1.42 KB (0.375%)
xxx-loader: 1.12 KB (0.295%)
webpack: 509 B (0.131%)
<self>: 29.56 KB (7.80%)
```
