---
layout: post
title: 1 unbelievable trick to create an easy to consume API in .NET
image: "/content/images/2016/09/pexels-photo-48013.jpeg"
date: '2016-09-26 20:14:24'
tags:
- code
- visual-studio
---

Creating a service for unknown technology is usually painful. Sorry, "service" is an unpopular world, nowadays we call it an API.  For a few years, everybody says: let's create some REST service.
Cool, flexible and uneasy to consume. Exactly **uneasy** - it is not a mistake, uneasy is a correct word.

## My story
Last week I was on hackathon in Berlin: [Collabothon 2016](http://collabothon.de). 
In my team we want to create following parts:

- iOS app
- .NET service - facade for IOS app
- Web page
- Python service 
- external API to use

First of all, we needed a facade to create a connection between iOS and .NET.
First thought: let's create REST service. But how to create a client in Swift 3.0?

## Swagger and Swashbuckle to the rescue

>**Swagger** is a simple yet powerful representation of your RESTful API. With the largest ecosystem of API tooling on the planet, thousands of developers are supporting Swagger in almost every modern programming language and deployment environment. With a Swagger-enabled API, you get interactive documentation, client SDK generation, and discoverability.

Swashbuckle seamlessly adds a Swagger to WebApi projects. It is a NuGet package for .NET projects:)

Just install it with
```
Install-Package Swashbuckle
```
Enter F5 in Visual Studio and enter following URL (be careful with a port number):
```
http://localhost:[YOUR_PORT_HERE]/swagger/ui/index#/
```
You will see something like bellow:

![](/content/images/2016/09/swagger-1.png)

Just 2 clicks allow seeing all method specification, with example request and all strong-type fields. Just take a look:

![](/content/images/2016/09/swagger-2.png)

## What about a client?
It is super easy. For actual version download command is:
```
wget http://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.2.1/swagger-codegen-cli-2.2.1.jar -O swagger-codegen-cli.jar
```
To generate a client, You will need Java and just type:
```
swagger-codegen generate -i http://localhost:[YOUR_PORT_HERE]/swagger/docs/v1 -l [PUT LANGUAGE NAME HERE] -o /tmp/test/
```
Sources and more instructions can be found on https://github.com/swagger-api/swagger-codegen.

## Swift 3.0
But for today swagger-cli doesn't support Swift 3.0. It has only a few weeks and has breaking changes with Swift 2.0 :/
But there is a cool guy Hexelon on Github: https://github.com/hexelon/swagger-codegen 
He is preparing a pull request to the main repository. Because building a swagger-cli is super easy, so we used his work already. Just clone his git repository and run:
```
mvn clean package
```
The jar will be in `swagger-codegen\modules\swagger-codegen-cli\target`

## Where can I read more?
Just look on http://swagger.io/. A lot of examples and tools are ready to use.

Happy coding!!