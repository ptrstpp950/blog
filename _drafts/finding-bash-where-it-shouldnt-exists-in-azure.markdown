---
layout: post
title: Finding bash where it SHOULDN'T exists in Azure
---

Did you ever use Kudu? If you even test Azure I'm almost sure that the answer is yes, even if you didn't use it knowingly. 
But maybe you don't know what exactly Kudu is. According to [Wikipedia](https://en.wikipedia.org/wiki/Kudu) the definition is following
>Kudu, or koodoo, is the Khoikhoi name for this antelope. Tragos (Greek) denotes a he-goat and elaphos (Greek) a deer. Strepho (Greek) means "twist", and strephis is "twisting". Keras (Greek) refers to the horn of the animal.[1]

Great definition but totally useless in IT. So in the Azure, it is the engine behind deployments in Azure Web Sites. To access it we need to add "scm" to our domain. For example, to access Kudu for `piotrstapp.azurewebsites.net` we need to enter `piotrstapp.scm.azurewebsites.net`.

## Exploring stuff
One of the best tools included in Kudu is 