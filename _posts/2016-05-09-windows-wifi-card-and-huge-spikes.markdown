---
layout: post
title: Windows WiFi card and huge spikes
image: "/content/images/2016/05/ping-2.png"
date: '2016-05-09 18:02:19'
tags:
- windows
---

## The problem
In my local network, I had huge network spikes on my laptop. Ping to my router were like:
```
Reply from 192.168.1.1: bytes=32 time=7ms TTL=64
Reply from 192.168.1.1: bytes=32 time=4ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=146ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2249ms TTL=64
Reply from 192.168.1.1: bytes=32 time=84ms TTL=64
Request timed out.
Reply from 192.168.1.1: bytes=32 time=1068ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=3ms TTL=64
Reply from 192.168.1.1: bytes=32 time=3ms TTL=64
Reply from 192.168.1.1: bytes=32 time=3ms TTL=64
Request timed out.
Request timed out.
Request timed out.
Reply from 192.168.1.1: bytes=32 time=3ms TTL=64
```
## WTF?
I'm Windows Insider and have _fast ring_ updates, so I was afraid that it is this.
My laptop has Intel(R) Dual Band Wireless-AC 8260. I found out on Google that there is a problem with a driver.  It can cause spikes like this.

## Solution

1. Open `regedit`. 
2. Search for `AdapterModel`
3. In the same section try to find `ScanWhenAssociated`. If is not there add it as `DWORD`
4. Set value to `0`
5. Repeat few times until you find all entries
5. Reboot

## Results
Now my ping look like:
```
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
```
Better. I hope it is not a problem with Windows Anniversary Update
