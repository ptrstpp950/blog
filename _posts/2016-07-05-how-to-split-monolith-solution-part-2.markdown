---
layout: post
title: How to split monolith solution - part 2 - find the seams
image: "/content/images/2016/07/DSC_4268.jpg"
date: '2016-07-05 17:03:53'
tags:
- monolith
- code
- visual-studio
---

In the first part [How to split monolith solution - part 1: common myths](https://stapp.space/how-to-split-monolit-solution-part-1/) I wrote about common myths. In this post I will try to find the "seams" to cut, using the Visual Studio and the ReSharper. Let's go!

##Assumptions
1. Big solution :)
2. Time :D
3. Will for change

I will use .NET solution and tools because I know them the best.

##Tools
1. Visual Studio
2. ReSharper from JetBrains (https://www.jetbrains.com/resharper/) - be careful it is addictive

##My solution
Overview:

1. 67 projects
2. 36 projects on root
3. 2 sub-folders with projects
3. 19 projects with tests

In the Visual Studio, it looks like below: 

![overview](/content/images/2016/07/overview-1.png)

To start working we need to visualize dependencies. And in this part, ReSharper save my day.
>With ReSharper, you can explore project dependencies in your solution using a visual representation of the solution architecture. At any time, you can open the Architecture View (ReSharper | Architecture | Show Project Dependency Diagram) and explore project dependencies without compiling anything. 

If you know other tools, which can do above, please let me know in comments.

Anyway. After simple click on `ReSharper->Architecture->Show Project Dependency Diagram` below image showed. (Yellow and green rectangle I added myself using paint):
![overview graph](/content/images/2016/07/overview-2.png)
What did I notice?

1. There are 3 projects ==without a reference to anything else==. It is a yellow group on the bottom-right. There are more groups like this, but on the overview, I don't see them clearly.
2. My solution folders marked with black background rectangles. The left-hand side is `tests`. 
3. Green rectangle marks a big separated part. There isn't anything with reference to this part.

The good thing is that I have a folder so I can use collapsed graph in smaller groups. Just click:
![collapse graph icon](/content/images/2016/07/collapse.png).

In my case it looks like following:

![overview graph collapsed](/content/images/2016/07/overview-3.png)

After collapse I noticed more:
1. I have only one arrow down - arrow shows dependency between projects
2. I have more project without a reference.
3. I can ease create compilation tiers, there are 7 layers on above picture.

The most interesting point is 2. Why do I have unrelated projects? I see following possibilities:
 
 - IoC;
 - tools without direct dependency like MSBuild tasks, file converter, UI test stuff, DB helpers, etc.;
 - more complex infrastructure - above solution is not the only one in the project;
 - something more? If yes please let me know :)

As you think about first 2 groups we can easily move out. In my case, it is 9 projects from 67. It is ~13% of all projects in the solution. If I exclude tests projects it is ~18%. So I just make my solution a bit smaller.

#Sum up
After quite simple above steps I noticed that:

1. I have parts that can be easily separated
2. Most my references are one-way. From bottom to up. I can easily create compilation tiers.
3. Folders in big solution are good in the overview.

What's coming next?

1. What is a compilation tier, because I didn't explain it at all and guys in comments ask for it :) - it is already available: [How to split monolith solution - part 3 - compilation tiers](/how-to-split-monolith-solution-part-3/)
2. Dependency management, for compilation tiers.
3. Split or remove circular dependencies in grouped projects