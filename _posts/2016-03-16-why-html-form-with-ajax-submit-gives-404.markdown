---
layout: post
title: Why HTML form with AJAX submit gives 404?
image: "/content/images/2016/03/lego.jpg"
date: '2016-03-16 07:32:00'
tags:
- javascript
---

Imagine you have a simple login HTML form on your `/Login` page. It looks like below:
```
<form id="loginForm" method="POST">
  <input id="textinput" type="text" placeholder="login"/>
  <br/>
  <input id="passwordinput" type="password" placeholder="password"/>
  <br/>
  <button type="submit">Submit</button>
</form>
```
Because we all love SPA, I/you/they decide to add AJAX login instead of full reload. 
Below AJAX call script uses jQuery, but You can replace it with anything you want. It is only **a snippet**, not a full code:
```
// attach to form submit
$("#loginForm").submit(function(e) {
    var url = "/ajaxLogin"; // the url where you handle the form input.
    $.ajax({
           type: "POST",
           url: url,
           data: $("#loginForm").serialize(), // serializes the form's elements.
           success: function(data)
           {
               alert("You did it hurray :D"); // do stuff
           }
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});
```
If you want to run above code just use bellow snippet: <a class="embedly-card" href="https://jsfiddle.net/ptrstpp950/3o0d892g/">AJAX form causes 404 - JSFiddle</a>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

## The problem
From time to time, a small and random group of users sends a bug:
> After I log in, I have 404 error

You check your landing page, error handling, etc. - but there isn't anything causing `404`. 
Desperately you decide to search your _www servers_ like Apache or IIS. You find out that some users have `404` error on `POST` request to `/Login` page. 
## What? Why? When?
Let's check the script. The only `POST` should go to `/ajaxLogin` -in fiddler example it is `/echo/json`. This URL is responsible for handling the form. The `/Login` page can be a static HTML resource or method with only `GET` implemented.

So what just happened? There are few similar possibilities:

 - scripts loading was slower than user
 - there is an error in the script, which happens occasionally
 - if **You** have any other idea just put it in the comments

## The solutions
Below my ideas for above problems:

**Option 1:** accept `POST` on `/Login` and handle form correctly.
It will work perfectly even if there is a problem with JavaScript. But there is one problem. If it isn't a fault in your script on the login page, the user probably will have problems on the "after-login" page.

**Option 2:** add URL into `form` and handle full reload in `/ajaxLogin`. This option is same as above.

**Option 3:** disable form until JavaScript is ready. For example, we can remove submit button and add it from JavaScript only. *Remember:* hiding form will not always work correctly especially for passwords managers.

**Option 4:** remove the form and use only inputs. This is a bad idea because `form` element is handled well by accessibility tools

If you have more options please put it in the comments or write me a message.

## Updated status - what caused my problem
I found out that some chrome extensions broke my JavaScript. It is not compatible with Require.JS and causes bug like below:

![](/content/images/2016/03/screen.png)


If you know that extension, please send me a name.
