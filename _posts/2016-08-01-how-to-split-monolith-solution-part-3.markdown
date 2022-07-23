---
layout: post
title: How to split monolith solution - part 3 - compilation tiers
image: "/content/images/2016/08/GZ38WAOETC.jpg"
date: '2016-08-01 16:38:24'
tags:
- monolith
---

In [the previous article](/how-to-split-monolith-solution-part-2/) I used a term "compilation tiers", but I didn't define it. But before the definition, I have to describe all the possibilities of the split. To make it easier let's assume that we split our big solution into two smaller ones: _solution one_ and _solution two_. Now we have following possibilities:

## Solution two depends on solution one
Image is worth 1000 words, so here it is:
![](/content/images/2016/07/sln_two_needs_sln_one.png)
The most interesting part of above picture is the green arrow. It represents dependencies, usually called __artifacts__. The artifacts can be following:

- ==packages== like Nuget packages/Maven packages/npm packages/etc.
- ==plain files== like simple code files/dll files/protobuf schema/etc.

We can define above as:
**Solution one** ==produces== some kind of __artifacts__, that are needed by **solution two** during or before ==the build==. It is **not** a run-time dependency. It is a compilation dependency.


## Solution one depends on solution two
![](/content/images/2016/07/sln_one_needs_sln_two.png)
As in old joke: replace one with two and start from the beginning of the article.

## Solution one and two doesn't have any relationship
Again 1000 words:
![](/content/images/2016/07/no_relation.png)
How above can happen? I wrote about this in the [previous article](/how-to-split-monolith-solution-part-2/). In most cases, there is a run-time dependency instead of build dependency. The second option is simpler: projects just don't relate to each other at all. For example database migration tool and mobile app. They just don't have any relation.

## Definition
We can define compilation tier as:
> Compilation tier is a subset of all projects without artifact dependencies to each other. The only artifact dependency can be to previous compilation tier.

Making above simpler: ==You can compile solutions from one compilation tier in parallel==.

## Real life
Find first seam is quite easy. First split probably also. But month or two pass away and You will start to worry if You did a good job. Are you compilation tiers correct?
To find out you will have to create a checklist:

1. You don't have circular dependencies between tiers. After You introduce package manager it can be easy to create such. Because all packages already exist in artifact repository.
2. You can compile everything from zero. Very similar to above.
3. Most changes are in last tiers. If you do a lot of changes in first tiers, it suggests that every time You will have to compile everything.
4. You didn't create too many tiers. I think a number between 5 and 10 is maximum. In most projects, it should be below 5.


## Next time
Next time I will try to introduce contracts (interfaces) between solutions. 
But if you wish something else please let me know in comments.



