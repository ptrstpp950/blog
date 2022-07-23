---
layout: post
title: How to analyze log files (part 1)
date: '2014-10-01 07:34:07'
---

## Log files 
In the beginning I start I would like to present some very simple error log
```
[2014-09-30 20:00:00] ERROR Exception: Client doesn't have Facebook id
[...]
[2014-09-30 20:01:00] ERROR NetworkException: connection is down. Reconnecting
[...]
[2014-09-30 20:02:00] ERROR SQLException: no such column: p.p_id
[...]
[2014-09-30 20:03:00] ERROR SQLException: key already exist
```

All above errors are different cases, all should we treat differently. I will try to go through them case by case. **Why?** To help operators and automatic monitoring help discover what is wrong with system.

## Case 1: Business exception
```
[2014-09-30 20:00:00] ERROR Exception: Client doesn't have Facebook id
```
Above error is a typical business exception. It doesn't say anything about your system state. In 99% percent cases it should be ignored by operators. But there is a problem. Also in your system logs you could have error like bellow:
```
[2014-09-30 20:00:00] ERROR Exception: Something is wrong with configuration
```
The second error is still *Exception* - the signature is identical to previous one. But if operator read above *message*, he should start an alarm, because usually problems with configuration are **FATAL** problem to your system.

To sum up first error type you should:

- precise what type of exception it is. In first case it could be for example *BuisnessException* and for the second one use *ConfigurationException*. This will be much more readable to operators
- try to separate business exceptions from other ones. Most logging libraries allow to log different errors to different targets quite easy.


## Case 2: Complex errors
```
[2014-09-30 20:01:00] ERROR NetworkException: connection is down. Reconnecting
```
Above exception is very difficult to analyze. Why? Because it depends on context. If it happen rarely it is probably not a problem at all. But if your log is full of such error you probably have a BIG problem. How to monitor such situation? Unfortunate it is complex event processing, but you can simple ask your administrators about what automatic system they use. They probably will know how to monitor such situation. If you don't have an idea write to me, I will
Anyway, as a developer/designer, it is **Your responsibility**  to sit with them and analyze what frequency is dangerous.


## Case 3: External system errors (like SQLExceptions)
```
[2014-09-30 20:02:00] ERROR SQLException: no such column: p.p_id
[...]
[2014-09-30 20:03:00] ERROR SQLException: key already exist
```
This part in my opinion is most tricky part. Both are SQLException, but first is kind of FATAL one, and second can be last data validation
But in above errors one very important information is missing: **error code**. 
With the error code you can build rules in system monitoring base on error code. Of course it will take some time to build such rules, but you can start with simple one: everything is FATAL. After you analyze first batch of errors, you can start with building rules


## Sum up
Conclusions:
1. Create **meaningful exceptions**, which are easy separable: use different exceptions and error codes
2. **Analyze** your log all the time
3. **Ask** operators what they need

In next part I will describe other problems with application logs.
