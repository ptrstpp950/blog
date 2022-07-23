---
layout: post
title: Generate API instead of GUI
date: '2015-03-31 19:38:44'
---

## Report system is a requirement    
Sooner or later every organization/solution/group needs a reporting system. The story usually begins like this: someone from "business part" come and say "we need simple report system, which will show us simple stats"
Most of use believe above statement and create MVP up which fulfill above requirements.
But than something completely strange happened. The same person from "business" part say something similar to: 
- This looks very nice, could you reorder columns
- `AND` `OR` possibilities in conditions is a must
- Ohh maybe pie char will look better than bar chart. Could you add both options?
- ...
My reaction was always: ARGH

## External generic report interface to the rescue
Today we can use some external report GUI, instead of build our own. There are plenty solutions available on the market. Some of them are free in part, some are very expensive, some have both options. The systems you could look for are for example:
- Qlick Sense - Desktop is for free: http://www.qlik.com/Sense-Desktop‎
- Tableau - Not very cheap but online version is not so expensive https://tableau.secure.force.com/webstore
- Pentaho - Pentaho Community Edition is free: http://community.pentaho.com/
- some others

The main plus of above solutions for developers is that we do not have to create full reporting system. Just create API - in most cases to download plain fail with data. And that is all, rest is done by external, well-supported product

