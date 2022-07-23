---
layout: post
title: NPM versus Yarn - the epic fight for speed in Continuous Integration
image: "/content/images/2016/10/1dajmd.jpg"
date: '2016-11-03 18:25:43'
tags:
- javascript
- teamcity
---

A few days ago, a new tool came from the Facebook team: Yarn package manager. The results published on [the official Yarn web page](https://yarnpkg.com/en/compare) are fantastic. I'm using local NPM registry, so some of the NPM problems don't exist for me.  Still, the `npm install` command is quite slow. How the `yarn install` command performs? Can it be much better?
Let's check it out.

## Why is speed so important in CI?
In the Continuous Integration systems, there are two types of build:

- "git pull"
- clean checkout

To achieve better performance, some of us decide to use the first option. Just because it is faster. But we all know that second is much safer because there won't be anything left after the previous build.

Anyway, all CI systems have one responsibility. Compile as fast as possible to check if nothing is broken after the last commit.
You can use TeamCity, Travis, Jenkins, Bamboo or anything else. But the main goal doesn't change.

On developers machine, such speed is not so important. Unless you change your projects frequently. But this is rare. The developers need fast compilation time.

When I look at my build task a lot of time is consumed by dependency management. The compilation is as fast as your build machine is, but download (and push) of artifacts can take ages. Especially for JavaScript dependencies.

Goal defined. Now I'm ready to describe the environment setup.

## Environment setup
I have the following components in my environment:

- [Artifactory](https://www.jfrog.com/open-source/)
- Windows machine
- no access to the internet (excluding stuff from Artifactory)

Artifactory is really important for this tests because using it I have the stable connection to all packages. They are cached there.

## Certificate
Up to yarn@16.0, it was impossible to use a custom certificate. To use it now just type:
```
yarn config set cert.pem
```
After that, you will find it in the `.yarnrc` file in your home directory. On Windows, its location is `C:\Users\[username]\.yarnrc`


## What will I test?
I decide to use below `packages.json` file. It has only some dev dependencies.
```
{
  "name": "yarn_test",
  "version": "1.0.0",
  "devDependencies": {
    "aurelia-bundler": "^0.4.0",
    "aurelia-tools": "^0.2.4",
    "browser-sync": "^2.17.0",
    "conventional-changelog": "1.1.0",
    "del": "^2.2.1",
    "es6-module-loader": "^0.17.11",
    "gulp": "^3.9.1",
    "gulp-aurelia-template-lint": "^0.9.1",
    "gulp-bump": "^2.2.0",
    "gulp-changed": "^1.3.1",
    "gulp-concat": "^2.6.0",
    "gulp-less": "^3.1.0",
    "gulp-lesshint": "^2.0.0",
    "gulp-notify": "^2.2.0",
    "gulp-plumber": "^1.1.0",
    "gulp-protractor": "3.0.0",
    "gulp-rename": "^1.2.2",
    "gulp-shell": "^0.5.2",
    "gulp-sourcemaps": "^1.6.0",
    "gulp-tslint": "^6.0.2",
    "gulp-typescript": "^2.13.6",
    "isparta": "^4.0.0",
    "jasmine-core": "^2.4.1",
    "jspm": "^0.16.41",
    "karma": "^1.1.2",
    "karma-jasmine": "^1.0.2",
    "karma-mocha-reporter": "^2.1.0",
    "karma-phantomjs-launcher": "^1.0.2",
    "karma-systemjs": "^0.14.0",
    "less": "^2.7.1",
    "less-plugin-autoprefix": "^1.5.1",
    "less-plugin-clean-css": "^1.5.1",
    "object.assign": "^4.0.4",
    "require-dir": "^0.3.0",
    "run-sequence": "^1.2.2",
    "systemjs": "0.19.35",
    "tslint": "^3.13.0",
    "typescript": "^2.0.0",
    "typings": "^1.3.2",
    "vinyl-paths": "^2.1.0",
    "yargs": "^4.8.1"
  }
}
```

## The methodology
I decided to test `npm install` including following options:

- delete npm cache before restore or not
- delete node_modules directory or not
- add `-cache-min=9999` in command or not

The last option forces NPM command to use the local cache as much as possible. Some time ago there was `--no-registry` option, but it isn't working now.

For `yarn install` I decided to use analogous options:

- delete yarn cache before restore or not
- delete node_modules directory or not
- delete `yarn.lock` file or not

The `yarn.lock` file stores all dependencies links. The best definition is on [the official website](https://yarnpkg.com/en/docs/yarn-lock):
>In order to get consistent installs across machines, Yarn needs more information than the dependencies you configure in your package.json. The Yarn needs to store exactly which versions of each dependency were installed.

Above allows the Yarn to download modules without checking dependencies. It knows it up front.

## The results

The results for NPM are:

<style>
.table-versus{
    max-width: 43.75rem;
    margin: 0 auto;
}
.table-versus th{
width:22%;
}
.table-versus .progressContainer {
  position: relative;
  width: 100%;
  height: 30px;
}

.table-versus .progressStatus {
  position: absolute;
  width: 15%;
  height: 100%;
  height: 30px;
  background-color: #4CAF50;
}
.table-versus td{
    text-align: center;
}
</style>
<table class="table-versus">
 <thead>
 <tr>
	<th style="width:10%;">tool</th>
 	<th>delete cache</th>
 	<th>remove node_modules</th>
 	<th>maximizeCache<br/>(cachemin=9999)</th>
 	<th>time (ms)</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 	<td>NPM</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #F63A0F; text-align:right;">178846</td>
 </tr>
 <tr>
 	<td>NPM</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #F47517; text-align:right;">127843</td>
 </tr>
 <tr>
 	<td>NPM</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #f2b01e; text-align:right;">113699</td>
 </tr>
 <tr>
 	<td>NPM</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #98D81E; text-align:right;">13576</td>
 </tr>
 <tr>
 	<td>NPM</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #ff3b30;">No</td>
 	<td style="background: #4cd964;">Yes</td>
 	<td style="background: #98D81E; text-align:right;">13472</td>
 </tr>
 </tbody>
</table>
<br/>
And for the Yarn:
<table class="table-versus">
 <thead>
   <tr>
      <th style="width:10%;">tool</th>
      <th>delete cache</th>
      <th>remove node_modules</th>
      <th>maximizeCache (lock file exists)</th>
      <th>time</th>
   </tr>
 </thead>
 <tbody>
   <tr>
      <td>Yarn</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #CEC01E; text-align:right;">68145</td>
   </tr>
   <tr>
      <td>Yarn</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #CEC01E; text-align:right;">67609</td>
   </tr>
   <tr>
      <td>Yarn</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #BCC81E; text-align:right;">60631</td>
   </tr>
   <tr>
      <td>Yarn</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #BCC81E; text-align:right;">59247</td>
   </tr>
   <tr>
      <td>Yarn</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #98D81E; text-align:right;">29712</td>
   </tr>
   <tr>
      <td>Yarn</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #ff3b30;;">No</td>
      <td style="background: #4cd964;">Yes</td>
      <td style="background: #86E01E; text-align:right;">560</td>
   </tr>
 </tbody>
</table>
<br/>

# What about bower/jspm/...?
Bower is more front-end focused than NPM. First versions of Yarn support it, but with some problems. Unfortunately, they decided to [remove Bower support](https://github.com/yarnpkg/yarn/pull/1441):
>Bower support isn't something we document or support very well. We should just get rid of it since it has a lot of issues. Bower is on it's way out and we shouldn't be supporting it. If you want to continue to use Bower then just use it's CLI. We initially had support for it to support Polymer but since they're migrating entirely to npm there's not much use.

The rest of the tools, like jspm, aren't supported as well. They decided to concentrate on NPM only. In my opinion, it is a good decision especially that latest Tech Radar set the trial status for "NPM for all the things" ([read more](https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things)). Probably one package manager for JavaScript is enough. Especially if it can be fast.

## To sum up
Speed in the Continuous Integration is important. We want to know as fast as possible that everything is OK. If the tool slows us, we have a problem. NPM is exactly such problem. It slows our builds. But now we have an alternative - Yarn.

As we can see Yarn is much faster than NPM. Moreover, it can produce repeatable build with `yarn.lock` file. 
The only downside is that we will have to migrate all our dependencies to NPM. No more Bower, JSPM, volo, ringojs, etc.
One more advantage. On the developer's machine, Yarn will work faster too. 

In the end, there can be only one conclusion:

>The king is dead, long live the king!