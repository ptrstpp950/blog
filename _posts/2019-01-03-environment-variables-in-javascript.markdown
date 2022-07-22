---
layout: post
title: 3 simple tips for handling environment variables in JavaScript
image: "/content/images/2019/01/mpho-mojapelo-127562-unsplash.jpg"
date: '2019-01-03 19:18:00'
tags:
- javascript
- devops
---

So you have a SPA application and you are proud of it. And suddenly a random developer comes and say: "In a test environment, we need a bit different URL/variable/routine/stupid thing/..."
In big companies, the way to solve above is a piece of cake. You go to the architect and (s)he gives you a solution. Everybody implements it and are happy ever after. 

Wait! No! Step back!!!! The real life doesn't look like this. But the problem still exists. We need variables in our SPA applications. No matter in is it Angular, React or Vue. Bellow a few ideas on how to solve this problem.

## Solution 1 - No config at all
To implement "no config at all" you need to create a multiple `if` statements based for example on URL. So when the application is on `localhost` variable becomes X, when it is on `test` becomes Y, and so on. Example code can look like:

```
let envName = "";
if(document.URL.startsWith("http://localhost")){
  envName = "localhost"
} else if(document.URL.startsWith("https://test")){
  envName = "test"
} else if(document.URL.startsWith("https://www")){
  envName = "prod"
} else {
  console.warn("NOOOOOOO!!!!!")
}
```

**Pros**

- It is working, isn't it?

**Cons**

- It isn't testable at all until you deploy to the proper environment 
- You cannot create a new env fast
- Every mistake in the config function requires deploying to every environment


## Solution 2 - Build using env files
This is the most common solution in JavaScript world. For example, in Angular, you have following files:
```
├── environment.ts
├── environment.dev.ts
├── environment.uat.ts
├── environment.prod.ts
```
With entries `.angular-cli.json` like:
```
"environmentSource": "environments/environment.ts",
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts"
}
```
More in the [official documentation](https://github.com/angular/angular-cli/wiki/build). In other frameworks it is similar. For example in React projects we use `.env` files ([example project](https://github.com/tuchk4/react-app-env)). In Vue.js is almost same ([docs](https://vuejs-templates.github.io/webpack/env.html))


**Pros**

- It looks better
- Adding new environment looks easy
- Testable is better because we can test all files separately and check the contents

**Cons**

- Still building once for all environments is not possible, unless we run `npm build` in deploy scripts, which can have side effects (like packages changes)

## Solution 3 - default + override

Declare your variables in one file (like above in `environment.ts`) and in your index.html include a separate javascript file with overrides, like `<script src="env.js"></script>`. If it won't exist or be empty your code will use defaults.

**Pros**

- It looks better
- Adding a new environment is very easy - just deploy new `env.js` file
- It is testable

**Cons**

- You have to talk with backend developers or even worse with DevOps guy to create such file ;)

## The end
Do you use something else? Maybe I am wrong, and don't know a better solution. If yes please let me know!