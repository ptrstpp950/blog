---
layout: post
title: Run Angular cli, React cli, Aurelia or Vue cli build in VSTS
image: "/content/images/2017/06/pablo.png"
date: '2017-06-07 07:35:30'
tags:
- vsts
---

Modern JavaScript frameworks come with dedicated command line interface (CLI). It applies for:

- Angular -> [Angular CLI](https://cli.angular.io/)
- React -> [react cli](https://github.com/reactcli/react-cli) - not offical
- Vue.js -> [vue cli](https://github.com/vuejs/vue-cli)
- Aurelia -> [aurelia cli](https://github.com/aurelia/cli)
- and much more

It is great for developers because their life is easier. The only question is how to run such build in VSTS without multiple hacks.

## Before we start
The article is based on VSTS, but as I know it can be applied the same way in TeamCity, Jenkins and other CI tools.


## Command line task
VSTS supports npm, gulp and grunt task. Simple drag&drop. But for example, Angular has it own CLI. The suggested build command is
```
ng bulid --env=prod
```
To run the custom command in VSTS we can create *command line task* for Windows agent or *batch script* if you are on Linux. The example command is:
```
$(Build.SourcesDirectory)\node_modules\.bin\ng.cmd
```
Above assume that in `package.json` we will have saved proper CLI as dev dependency.
According to above, the task will have below definition.

![](/content/images/2017/05/ng-cli_in_cmd.png)

Of course on Linux agent change slash to backslash. If you are confused about slash and backslash, it is easy to remember with Slash pictures ;)

![](/content/images/2017/05/slash-backslash.jpg)

First success. The above script is working. Thu build logs are ugly but who cares. But can we do it better? 

## Npm script
Instead of running command line, we can put a build command into `package.json` file. Moreover, most nowadays templates contain it already. For example, after we create a project from Angular template we have got
```
{
  "name": "Your name here!",
  "version": "0.0.0",
  "license": "MIT",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  //unimportant rest of the file
```
To be precise we can run build using:
```
npm run build
```
Which is equal to above `ng build`. Of course, we can add options like in the original command. To use custom arguments when executing scripts, but you need to prepend them with `--`. For example, to build production environment we run:
```
npm run build -- --env=prod
```
Which is exactly same as the original command `ng bulid --env=prod`. The npm command looks, in my opinion, more ugly but it is more CI friendly.
Using it has an unexpected bonus. We can forget about slash and backslash configuration, and run the same build definition on Windows and Linux agent.

## Npm task
In the VSTS we can choose `npm task` and apply arguments like below.

![](/content/images/2017/05/ng-cli_in_npm-task.png)

To sum up. If we decide to wrap framework command line interface with npm scripts, the build process is a piece of cake and logs looks much more human-friendly. 

If you have a better idea or have some doubts, please let me know.