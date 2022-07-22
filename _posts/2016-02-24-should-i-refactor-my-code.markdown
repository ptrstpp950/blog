---
layout: post
title: Should I refactor my code?
image: "/content/images/2016/02/refactoring_poster-r723da0bee0b0423799654d8a59350032_i5v9b_8byvr_1024.jpg"
date: '2016-02-24 08:00:00'
---

Probably everybody knows below meme:
<iframe src="//giphy.com/embed/5xaOcLQwK7I3YAA9eEw?html5=true" width="480" height="418" frameBorder="0" style="display:block;margin: 0 auto;" class="giphy-embed" allowFullScreen></iframe>
But why are we so afraid?

##New requirement
Imagine that your boss just gave you a new requirement. He wants to include twitter alias in `login` method. 

You open the file and see below code:
```
public bool Login(string us, string p)
{
  if(us.Length==7){
     return TempLogin(us, p);
  }
  if(us.IsDigits()==false && us.Length==8){
      if(us.IsEmail()){
          us = RunQuery("SELECT id FROM UserInfo WHERE Email=@email",us);
      }
      else{
          us = RunQuery("SELECT id FROM UserInfo WHERE Alias=@alias",us);
      }
  }
  bool r;
  ValidateUser(us, p, out r);
  return r;
}
```
Fortunately code isn't bad. We can read it and even understand quickly: `us` is for user `p` is for password. 
But ask yourself what should you do:

- add one more `if` with another `SELECT`
- propose some refactoring to clean up above code like separate business logic from data access, change names, ...
- quit job because they don't use ORM/NoSQL/...
- other options?

I'm sure most of developers will decide to use copy-paste method: add one more `if`. Why?
Because this looks safe. Because **we** are afraid of mistakes. 

The funniest thing is that without refactoring we only delay errors. 

>I will fix it fast and make it work. Next time it won't be me, it will be someone else. 

Yes, sure, it won't be _me_, in 95% it will be _future me_.

#Names and ifs
Cool names like `us`, `p` or `r`are completely unreadable. The `us` is "perfect name" for email, id, alias and of course ~~United States of America~~  username. 
Fortunately `p` is for password. It could be `temp` or `x1`. Maybe be `agent007` or `secret_agent` will be better? ;)

I'm sure first use of "if" was 100% rationale. Of course except adding a `SELECT` :) 
But maybe it was a junior? Or someone was in hurry? Or maybe someone was _lazy_? Or ...?

When we see code which could be better, we shouldn't wait, but fix it ASAP. Real ASAP, not "Around September, August - Probably".
 
If you are afraid or you aren't sure, talk to your boss or team leader. There is a big probability that nobody before said it to him, because adding a new `else if` was always easier. 

##What more?
There are other well know cases like: hell in CSS, hell in dependencies, unreadable class/method names, etc. And we have a lot of ways to fix it. Sometimes even with rewriting the part or changing technology to something better. Like switch from CSS to LESS or SASS. And teach everybody around you how to use the new technology. The coolest technologies don't bring good code. You do!

##Be a craftsman
There are wise words by Sandro Mancuso in The Software Craftsman:
>[In a well-crafted codebase] adding or changing features does not take longer than it used to take at the beginning of the project.

And this is true but difficult to achieve. The only way is to fix the code when you see a problem. It will not take long, maybe an hour or two. Do not wait, because next developer probably won't fix it also. He will be even more afraid than you.

I am sure that everyone will add the first "if". The problem is always with third-fifth-tenth when we start to see that the code is strange and ugly. Moreover you have the biggest chance to modify this method next time, because you know it well. 

Remember the refactoring is for You.