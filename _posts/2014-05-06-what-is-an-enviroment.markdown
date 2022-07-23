---
layout: post
title: What is an Enviroment?
date: '2014-05-06 07:08:54'
---

#### Introduction
Yesterday our team have about domain model in our company. It wasn't the first one and probably not the last one :) Anyway we spent more than an hour ~~fighting~~ discussing what is an **Enviroment**. Everybody knows what it is, but everybody knows something else

#### Simple case - one small project
Let's assume that we develop simple project: website (asp.net,php,etc.) with database (SQL, NoSQL, files,...). We separate website machine with database machine for security, performance, scaling, (put here whatever you want). So we have at least **2** machines
We can have following environments (whatever it is):

* Test env for developers
* Preproduction (test environment)
* Production

So what is an environment? First try: "set of machines". This option is very popular in tools like Octopus Deploy. This definition is quite good, but we can install all instances on same machines. Usually it is not installed on same machines but it **can**. This happen what we have problem with licences for SQL Server, lack of machines in NoSQL solutions, etc.

So "set of machines" doesn't work for environment.


#### More complicated case
To complicate our solution, let's add one more dimension: TIME. So we have now following environments:

* Production with version 1.0.0.333
* Preproduction (test environment) with version 1.1.0.22 - hotfix is coming :)
* Test env for developers with version 1.5.0.555 - night build of new version

Moreover "environment" sometimes needs different prerequisites, because we can for example upgrade our framework form version 3.5 to 4.5 our we upgrade our database version (e.g.: SQL Server 2008 to SQL Server 2012) and we need some migration.


#### Conclusion
To define an environment at least we have to include:

- machine (virtual or physical)
- versions of components
- prerequisites
- and maybe some other things




