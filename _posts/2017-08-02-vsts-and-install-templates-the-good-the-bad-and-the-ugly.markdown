---
layout: post
title: VSTS and install templates - The Good, the Bad and the Ugly
image: "/content/images/2017/05/24698_the_good_the_bad_and_the_ugly.jpg"
date: '2017-08-02 19:29:00'
tags:
- vsts
- azure
---

If you read my blog post about [deploy & warm-up application in Azure](https://stapp.space/how-to-deploy-and-warmup-an-app-in-azure/), you probably remember below definition. If not you can do it [now](https://stapp.space/how-to-deploy-and-warmup-an-app-in-azure/) ;)

![](/content/images/2017/05/all_tasks-2.png)

It is simple, clean and easy to understand. Almost perfect. Only one question appears in my mind: how to reuse it in different environments? Let's try to find options.

## Clone
The first option is very easy. Just let's clone the deploy definition. The VSTS has even a special button for it

![](/content/images/2017/05/clone_env-1.png)

Just clone it as many times as you need. 

### The Good
You have an exact copy of your environment. Even secrets are copied, so it is a perfect clone. 

### The Bad
Unfortunately, there is a list of disadvantages: 

- If you want to add a new task, you have to add it to all copied environments
- Deploy will be to the wrong environment for the first time with quite a big probability. (__Personal note__: _It is because all variables are copied, and you will forget to change all places. In my case three times in a row_)
- After few a clone&change, every environment will have different deploy definition. Can you imagine that code on every environment is different?
- You cannot clone to another build definition

### The ugly
It is a copy&paste method and you know it is ugly! 


## Save as a template
Just one option below clone is "Save as a template". I still don't know why it is called template, because after applying it you have a simple build definition. There isn't a relation between a build definition and the template. Such strange name probably comes from Visual Studio. When we create a new project, we choose a project template, which creates a proper MSBuild build definition.

### The Good
If you are error-prof it is a great way to create a template. Or just to start. Moreover, such template can be applied to different build definition. Especially that: _Any secret variable in the environment won't be saved as part of the template_. 

### The Bad

Let's check the list from cloning:

- If you want to add a new task, you have to add it to all copied environments
- Deploy will be to the wrong environment for the first time with quite a big probability.
- After few a clone&change, every environment will have different deploy definition. Can you imagine that code on every environment is different?
- ~~You cannot clone to another build definition~~

Only one point was crossed out. It is sad. The only advantage to above list is that secrets aren't copied.

### The ugly
I don't understand the name and how functionality differs from the clone option. Especially that deploy process should be same for every environment to make it repeatable and testable. 


## The task group
Task group is exactly what I understand as a build template. It has same tasks but allows to use different variables. For example, Azure App Service name can be pass to the task group. Creating it a bit complicated. We mark selected tasks (I suggest all) and click _Create task group_.

![](/content/images/2017/05/create_task_group.png)

The result of above operation is one task. Its type is _Task group: [the name you entered]_. But there aren't any variables. To add it we need to modify the just created group.

![](/content/images/2017/05/manage_task_group_option.png)

Then in every place, you would like to have a variable, you need to replace a value with `$(YOUR_NAME)` variable. For sure you have to consider:

- Azure App Service name
- Resource group
- Your deployment process stuff. In my case, it is warm-up URL.

An example is in the images below. Before change the task definition is

![](/content/images/2017/05/task_warmup_before_var.png)

And after

![](/content/images/2017/05/task_warmup_after_var.png)

After you change all your needs in the main screen you can preview and change the description of all variables in your task group.

![](/content/images/2017/05/task_group_definition.png)

Now in build definition, we need to re-add a task group because variables won't show (at the time of writing). Fill them and create a new release. After success, we can reuse this task group in other build definition. **Important note:** if you deploy anything to Azure, don't forget to make Azure subscription as a template variable.

### The good
It is a reusable build definition template. We can even put task group in the task group in the task group, ...., in the task group. In my opinion, it is a good way for managing build definition, and make them as similar as it is possible. Moreover, if we need a change between environments, we can create an optional task.

### The bad
All points from the bad part of previous ways can be crossed out. But there isn't a way to version a task group (or I didn't find it).

### The ugly
It isn't easy to find. And manage it can be frustrating. But it solves a problem, which is just great.

## The end
I don't know anything more, but maybe You know something and can share with me. If yes please contact me or write a comment below.