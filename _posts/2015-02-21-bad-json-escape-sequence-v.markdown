---
layout: post
title: 'Bad JSON escape sequence: \v - the war stories'
date: '2015-02-21 11:09:21'
---

## Introduction 
Yesterday I did a small C# program for hash data in JSON. The are many files, which contains a lot of lines with JSON :)
I was using [Json.NET](http://www.newtonsoft.com/json) the most popular JSON library for .NET. 

One in 200000000 lines (the number is correct) was bad. It was like this:
```
{"data": {"str_1": "&#39; \u001e\v \u0003\u001f&quot;\u0003\u001d %\b)\v#"}}
```

And I receive an exception: `Bad JSON escape sequence: \v. Path 'data.str_1', line 1, position [number]`

`\v` is equal to vertical tab which is `|`

### Google results
The first thing I did was to search Google for '\v' in JSON
I was looking for phrase like this: `bad JSON escape sequence: \v.`. The first result **was** [How to escape special characters in building a JSON string](http://stackoverflow.com/questions/19176024/how-to-escape-special-characters-in-building-a-json-string) on StackOverflow. There I founded that:

> See this list of special character used in JSON :
> ```
> \b  Backspace (ascii code 08)
> \f  Form feed (ascii code 0C)
> \n  New line
> \r  Carriage return
> \t  Tab
> \v  Vertical tab
> \'  Apostrophe or single quote (only valid in single quoted json strings)
> \"  Double quote (only valid in double quoted json strings)
> \\  Backslash caracter
> ```

More over I found a source of above quote: https://www.json.com/json-object

## Next step: question on SO about Newtosoft.Json
I created a new question on SO: [Newtosoft.Json Bad JSON escape sequence: \v.](http://stackoverflow.com/questions/28607899/newtosoft-json-bad-json-escape-sequence-v)
Because I didn't receive any useful answer I decided to fix Newtosoft.Json. My decision appears as a [pull request](https://github.com/JamesNK/Newtonsoft.Json/pull/489)
Unexpectedly James Newton-King reject it and point me that `\v` is not valid according to spec on http://json.org/.

## WHAT???

Moreover he is right. According to both: [RFC 4627](http://www.ietf.org/rfc/rfc4627.txt) and http://json.org/ which is same as [ECMA-404 The JSON Data Interchange Standard](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf) the **\v is not valid**

## Sum up
The unlucky escaped char took one day of my life. But I learn something new, so it is not a lost day

I also created a comment on https://www.json.com/json-object#object-with-strings and I hope they fix the definition. 

The funny part is that some JSON validators accept `\v` some not :)

Below is a table with some JSON validators from [first page on Google search](https://www.google.pl/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=json%20validator)

<table>
	<tr>
    	<th>JSON validator</th>
        <th>Error on \v</th>
        <th>Remarks</th>
    </tr>
    <tr>
        <td>http://jsonlint.com/</td>
        <td><b style="color:green">Show error</b></td>
        <td></td>
    </tr>
    <tr>
        <td>http://www.freeformatter.com/json-validator.html</td>
        <td><b style="color:red">Show valid</b></td>
        <td>Information sent</td>
    </tr>
    <tr>
        <td>http://jsonformatter.curiousconcept.com/</td>
        <td><b style="color:green">Show error</b></td>
        <td></td>
    </tr>
    <tr>
        <td>https://www.jsoneditoronline.org/</td>
        <td><b style="color:green">Show error</b></td>
        <td></td>
    </tr>
    <tr>
        <td>http://codebeautify.org/jsonvalidate</td>
        <td><b style="color:green">Show error</b></td>
        <td></td>
    </tr>
    <tr>
        <td>http://jsonviewer.stack.hu/</td>
        <td><b style="color:red">Show valid</b></td>
        <td></td>
    </tr>
    <tr>
        <td>https://extendsclass.com/json-validator.html</td>
        <td><b style="color:green">Show error</b></td>
        <td></td>
    </tr>

    
    
</table>

