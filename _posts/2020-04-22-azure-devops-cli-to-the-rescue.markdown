---
layout: post
title: Azure DevOps CLI to the rescue
image: "/content/images/2020/04/pablo.jpg"
date: '2020-04-22 14:10:53'
tags:
- azure-devops
---

I need to migrate a lot of repositories from one Azure DevOps to another. Migration! Don't ask why, please. Let's assume it was much more simple than other options.

I was thinking that I will have to do it manually, but I found Azure DevOps CLI. Hurray!

## Setup
`az devops` and `az repos` are inside `az` do the easiest way is to log in using `az login` and forget about other options ;)

Then we can set up default organization and project using:
```
az devops configure --defaults organization=https://dev.azure.com/MyOrg project=MyProject

```


## Find all repositories

The first query was quite easy. I need to find all repositories in the old organization:

```
 az repos list --organization https://dev.azure.com/MyOldOrg --project OldProject -o tsv --query "[].name"
```

## Copy
From the above list choose all needed projects and declare them as an array in bash:

```
export repoArray=(
  repo1
  repo2
  repo3
)
```
Now we can copy using `create` and `import`.
But before you start coping generate PAT token for GIT for your old Azure DevOps. Just go to `https://dev.azure.com/MyOldOrg/_usersSettings/tokens`
```
for REPO_NAME in "${repoArray[@]}"
do
    az repos create --name $REPO_NAME --project "NewProject"
    az repos import create \
        --git-source-url "https://dev.azure.com/MyOldOrg/_git/$REPO_NAME" \
        --repository $REPO_NAME \
        --project "NewProject" \
        --requires-authorization \
        --user-name piotr.stapp
done
```

## Create build pipeline
Now the funny part. If you are using YAML files for a build we can create build definition using:

```
az pipelines create --name $REPO_NAME \
    --yaml-path 'build.yml' \
    --repository-type tfsgit \
    --branch develop \
    --project "NewProject" \
    --repository $REPO_NAME
```