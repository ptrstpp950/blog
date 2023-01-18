---
layout: post
title: 6 steps to pimp my terminal
image: "/content/images/2023/01/cover.png"
date: '2023-01-18 08:30:12'
tags:
- GitHub
- GitHub Actions
- DevOps
---

## How to get secrets from GitHub Actions
Working with secrets can be hard. Especially when you forget their values, and you would like to retrieve them. In my case I didn't store Azure service principal for test environment anywhere.  Moreover I wanted to move them from project level into organization level. Unfortunately reading them from GitHub is not possible, but the actions have them.  What have left? Of course some hacking.

Of course running:
```
steps:
  - run: |
      echo '${{ secrets.AZURE_CREDENTIALS }}'
```
won't work because GitHub is smart enough to replace any secret with `***`

What alternatives we have? I see three:

### Uploading somewhere
We can upload it to external endpoint - too complicated, but for sure it will work. I think about it but I didn't try, because other methods worked 😅

### Use base64
That's the most typical trick. Instead of echo a secret, we can try to echo bas64 of this secret. 
The job is quite obvious but let's write it down:
```
    steps:
      - run: |
          echo '${{ secrets.AZURE_CREDENTIALS }}' | base64
```
To be fair the result was quite strange. I received partially good file, but with omitted `clientSecret`, which I was looking for. So the output was:
```
ICJj***CiAg
***
CiAg***CiAg
ImFjdGl2ZURpcmVjdG9yeUVuZHBvaW50VXJsIjogImh0dHBzOi8vbG9naW4ubWljcm9zb2Z0b25s
aW5lLmNvbSIsCiAgInJlc291cmNlTWFuYWdlckVuZHBvaW50VXJsIjogImh0dHBzOi8vbWFuYWdl
bWVudC5henVyZS5jb20vIiwKICAiYWN0aXZlRGlyZWN0b3J5R3JhcGhSZXNvdXJjZUlkIjogImh0
dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvIiwKICAic3FsTWFuYWdlbWVudEVuZHBvaW50VXJsIjog
Imh0dHBzOi8vbWFuYWdlbWVudC5jb3JlLndpbmRvd3MubmV0Ojg0NDMvIiwKICAiZ2FsbGVyeUVu
ZHBvaW50VXJsIjogImh0dHBzOi8vZ2FsbGVyeS5henVyZS5jb20vIiwKICAibWFuYWdlbWVudEVu
ZHBvaW50VXJsIjogImh0dHBzOi8vbWFuYWdlbWVudC5jb3JlLndpbmRvd3MubmV0LyIKfQo=
```
Which decoded to:
```
{
 "c
  
  
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
Good work GitHub! Anyway let's try something else.


### Use artifacts
Last try! We can write it to the file and upload it as an artifact. It shocked me, but it works like a charm
```
    steps:
      - run: |
          echo '${{ secrets.AZURE_CREDENTIALS }}' > file.txt
      - uses: actions/upload-artifact@v3
        with:
          name: file.txt
          path: file.txt
```
The uploaded file had all the data.
Only remember to delete the workflow run after test 😀

That's all folks
p.s Cover image by <a href="https://unsplash.com/@mbaumi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mika Baumeister</a> on <a href="https://unsplash.com/photos/J5yoGZLdpSI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  