---
layout: post
title: Ridiculous bug in Azure Cosmos DB
image: "/content/images/2018/11/cris-dinoto-319209-unsplash.jpg"
date: '2018-11-05 18:43:00'
tags:
- azure
---

**UPDATE** Read to the end, it is a problem with code and indexes, but it isn't obvious. Basically, it is my fault and my lack of understanding what am I doing. And there is a happy end :)

I didn't write a post for half a year, I have the flu, I'm tired. But a few seconds ago I found a stupid, ridiculous stupid bug in Azure Cosmos DB. And I have to share it with the world.

Imagine you have the following JSON (some fields skipped for simplicity):

```
{
    "id": "token",
    "User": {
        "UserToken": "token",
        "Email": "email@email.com"
    },
    "_ts": 1521728825
}
```
And you write a following query using LINQ:
```
await _dbClient.Where<UserDocument>(_collectionUri,feedOptions,
        d => d.User.UserToken == searchString
             || d.User.Email.Contains(searchString))                        
    .OrderByDescending(d => d.Timestamp)
    .AsDocumentQuery().ToListAsync())
```
When you run it with `searchString=="token"` it will return an EMPTY list. Let's modify the LINQ a bit:
```
await _dbClient.Where<UserDocument>(_collectionUri,feedOptions,
        d => d.User.UserToken == searchString
//Bellow line is in comment
             /*|| d.User.Email.Contains(searchString)*/)                        
    .OrderByDescending(d => d.Timestamp)
    .AsDocumentQuery().ToListAsync())
```
Magically it started working. What the hell is going on????

## Fast inspection
I'm found [this issue on Github](https://github.com/Azure/azure-cosmosdb-dotnet/issues/317) and copy it to my code. It didn't help at all, but I can easily debug SQL statement. In the first version is equal to:
```
SELECT * FROM root 
WHERE (root["User"]["UserToken"] = "token")
ORDER BY root["_ts"] DESC 
```
For the second one:
```
SELECT * FROM root 
WHERE ((root["User"]["UserToken"] = "token") 
OR CONTAINS(root["User"]["Email"], "token")) 
ORDER BY root["_ts"] DESC 
```
If you run them in portal, first one works, second one doesn't.  But simple change in the second SQL to:
```
SELECT * FROM root 
WHERE ((root["User"]["UserToken"] = "token") 
OR CONTAINS(root["user"]["email"], "token")) 
ORDER BY root["_ts"] DESC 
```
makes it working. Can you see the difference? BTW changing all to lower (cammel case) won't help!!!! That's is why soultion from the GitHub issue didn't help me. 

## I'm stupid or something
Next part. The second query is working because `root["user"]["email"]` just not exist in JSON, so the doc is just query in "strange" way. 
But it is more strange. It doesn't work only for old documents. If I update a document it starts working WTF?  My colleague suggests removing `ORDER BY root["_ts"] DESC` and it is working. Magic!!!!

Forrest Gump said that "Stupid is as stupid does", so am I stupid or something? Please write in the comment what I did wrong.

## Whole world to the rescue
Thanks to my friends and their friends and all the "Rabbit's Friends-and-Relations" this post was read by Samer Boshra (I suspect that he is this [Samer Boshra](https://www.linkedin.com/in/samer-boshra-78a52b9/) who works as Principal Software Development Engineer at Microsoft). His full explanation is in the [first comment](https://stapp.space/ridiculous-bug-in-azure-cosmos-db/#comment-4183732673) and the most important information for me is:

> What's happening here is the query gets preempted, due to either approaching the timeout or exceeding the RU budget, before encountering a single match. In such a case, the query will return a continuation token that you should be passed in to the next request to resume execution from where it stopped. Eventually, you should get all matching documents if you followed all the continuations. As for why adding/removing ORDER BY makes a difference - this is basically because the scan order changes and it would result in encountering matching documents in a different order.

I decided to check what is going on. It was easy I just opened the query stats tab. And he is right. My basic RTU was 400, but the query needed:


![](/content/images/2018/11/rtu.png)

My query needed more than 2300 RTU. So it was killed, by Azure Cosmos DB engine. I can only complain to 3 things:

- I don't get the exception or continuation token in my .NET code (the real origin of the problem)
- I don't have such information in the portal (error: too much RTU or something like this)
- I don't know databases good enough :)

But to sum up. The fix is on the way. I'm happy. The sun is shining and my flu is almost over.

... and they lived happily ever after!!!  THE END!

