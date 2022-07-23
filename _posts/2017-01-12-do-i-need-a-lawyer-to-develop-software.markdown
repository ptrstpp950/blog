---
layout: post
title: Do I need a lawyer to develop software?
image: "/content/images/2017/01/binding-contract-948442_640.jpg"
date: '2017-01-12 07:05:00'
tags:
- unproductive
---

Do I need a lawyer to develop software? Sounds like a stupid question. Can I guess your first through? Mine would be:
> Are you serious? I'm a software developer, I don't need a lawyer.

Today, when a lot of code is available on GitHub, our programming is easier. We find a code; we use it and we are happy. But who checks the license?

## Top open source license types
The Black Duck compare over 9000 global forges and repositories. The top 5 is following:

1. MIT License - **29%**
2. GNU General Public License (GPL) 2.0 - **19%**
3. Apache License 2.0 - **15%**
4. GNU General Public License (GPL) 3.0 - **8%**
5. BSD License 2.0 (3-clause, New or Revised) License - **5%**

If it isn't enough, more can be found in their post: [Top Open Source Licenses](https://www.blackducksoftware.com/top-open-source-licenses)

## Are them same?
If you don't have a lawyer, I suggest you visiting for example [choosealicense.com](http://choosealicense.com/). The most important points are listed and they are easy to compare. But the main page is for open source creators. Not for users of libraries.
Fortunately, the [choosealicense.com] web page has two subpages. The [short one list](http://choosealicense.com/licenses/) with GNU AGPLv3, GPLv3 and LGPLv3, Mozilla Public License 2.0, Apache License 2.0, MIT License and The Unlicense. The [long one list](http://choosealicense.com/appendix/) has much more. 
"So what?" - you will ask. I found it, I check it everything is ok. But the real life is more complicated.

## Real life
A few months ago there was a discussion on the Internet about React library. Everything because Facebook uses BSD license with an additional patent grant. According to Rob Eisenberg:
>If you are using or considering using React in a project, you might want to consult a lawyer. Because of the patent clause, you are not allowed to do anything that constitutes as competing with Facebook. If you do take legal actions or in other ways challenge Facebook, your license to use React is immediately revoked.

>Your license is also revoked if you have any legal disputes if you have legal disputes with any other company using React. This is the reason why both Google and Microsoft employees are not allowed to use React.js in their work

Just watch his talk below (interesting part from 46:34) or open it in on [YouTube](https://www.youtube.com/watch?v=6I_GwgoGm1w&feature=youtu.be&t=2794)
<iframe width="560" height="315" src="https://www.youtube.com/embed/6I_GwgoGm1w" frameborder="0" allowfullscreen></iframe>

## Time has passed
The above internet discussion forced Facebook to publish the [Open Source License FAQ](https://code.facebook.com/pages/850928938376556) and change in their open source licensing. More details in their blog post [Updating Our Open Source Patent Grant](https://code.facebook.com/posts/1639473982937255/updating-our-open-source-patent-grant/). And effect looks better. The [new patents clause](https://github.com/facebook/osquery/blob/master/PATENTS) for me is clean enough. But I'm not a lawyer or English native. So don't trust me and read it by yourself.

## How about adoption? 
For example, Microsoft offers [React UI component library for extending SharePoint](http://react-etc.net/entry/react-is-the-ui-framework-for-extending-sharepoint). Apple also created something using React. The [API Reference](https://developer.apple.com/reference/) is using it. Just *check the source Luke* to find it out. But above examples aren't the core products.

## The conclusion
We are developers, we want clear statements. But choosing technology stack these days isn't obvious. Maybe we don't need a lawyer, but for sure we should check the license twice.


## Half a year later
That's funny but almost nothing has changed.Facebook just published blog post with [explaining React's license](https://code.facebook.com/posts/112130496157735/explaining-react-s-license/)
 
