---
layout: post
title: RX.JS as CEP
---

```
var subject = new Rx.Subject();

var subscription = subject.subscribe(function (data) {
    console.log('data: ' + data);
});

subject

  // Only A and Q characters are important:

  .filter(char => (char === "A") || (char === "Q"))

  // Accumulate the A characters until there are three
  // or until a Q is received:
  .do(data=> console.log("processing: " + data))
  .scan((acc, char) => {
    
    if ((char === "Q") || (acc.length === 3)) {
      acc = [];
    }
    if (char === "A") {
      acc.push(char);
    }    
    console.log("Temporaty array is: [" + acc+"]");
    //console.log(acc);
    return acc;
  }, [])

  // Filter the accumulated characters until there
  // are three:

  .filter(acc => acc.length === 3)
  .mapTo("OK")
  .subscribe(value => console.log(value));


subject.next('A');
subject.next('a');
subject.next('s');
subject.next('A');
subject.next('d');
subject.next('A');

```