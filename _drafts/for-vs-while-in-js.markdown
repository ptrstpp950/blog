---
layout: post
title: 'MythBusters: For vs while in js'
---

In last few weeks I heard two times that different loops in JavaScript can have tottaly different performance.


http://stackoverflow.com/questions/18640032/javascript-performance-while-vs-for-loops

```
var max = 1000000;

function whileLoop(max) {
    var j = 0;
    console.time("while loop");
    while (j < max) {
        j++/2;
    }
    console.timeEnd("while loop");
}

function whileNegativeLoop(max) {
    var j = max;
    console.time("while negative loop");
    while (j >0) {
        j--/2;
    }
    console.timeEnd("while negative loop");
}

function forLoop(max){
    console.time("for loop");
    for (var i = 0; i < max; i++) {
        i/2;
    }
    console.timeEnd("for loop");
}

function forNegativeLoop(max){
    console.time("for negative loop");
    for (var i = max; i > 0; i--) {
        i/2;
    }
    console.timeEnd("for negative loop");
}

function doWhileLoop(max) {
    var k = 0;
    console.time("do-while loop");
    do {
        k++/2;
    } while (k < max)
    console.timeEnd("do-while loop");
}
function doWhileNegativeLoop(max) {
    var k = max-1;
    console.time("do-while negative loop");
    do {
        k--/2;
    } while (k > 0)
    console.timeEnd("do-while negative loop");
}

whileLoop(max);
whileNegativeLoop(max);
forLoop(max);
forNegativeLoop(max);
doWhileLoop(max);
doWhileNegativeLoop(max);

whileLoop(max);
whileLoop(max);
whileLoop(max);
whileNegativeLoop(max);
whileNegativeLoop(max);
whileNegativeLoop(max);
forLoop(max);
forLoop(max);
forLoop(max);
forNegativeLoop(max);
forNegativeLoop(max);
forNegativeLoop(max);
doWhileLoop(max);
doWhileLoop(max);
doWhileLoop(max);
doWhileNegativeLoop(max);
doWhileNegativeLoop(max);
doWhileNegativeLoop(max);
```


````
		Win 7	i7-3770 @3.40GHz		Win 7	i5-4590 @3.30GHz		Win10	i7-4790 @ 3.60 GHz	
	.NET	FF 41.0.1	Chrome 46	IE 11	FF 40.0.3	Chrome 46	IE 11	FF 44.0.2	Chrome 48	Edge 25
while loop	0,6697	2,96	2,61	80,886	1,64	0,854	88,823	1,89	0,819	47,925
while negative loop	1,1198	2,48	5,469	79,463	1,06	1,677	58,421	0,97	2,11	48,23
for loop	0,6694	2,38	2,522	57,425	1,07	0,961	53,351	0,77	0,738	39,545
for negative loop	0,6688	2,36	2,854	70,85	0,88	1,893	52,993	0,77	1,58	40,9
do-while loop	1,6716	1,98	1,671	50,43	2,21	1,14	50,19	0,78	0,856	43,385
do-while negative loop	0,6688	1,67	1,988	73,389	1,34	0,896	49,448	1,04	1,227	44,555
while loop	0,6682	1,19	1,058	60,058	0,66	0,439	57,636	0,69	0,421	45,55
while loop	0,6682	0,94	1,117	59,596	0,45	0,432	56,32	0,46	0,419	3,08
while loop	0,6685	0,92	1,46	59,658	0,46	0,433	56,412	0,46	0,418	3,055
while negative loop	0,9173	1,2	2,452	73,337	0,65	1,412	56,619	0,68	1,269	47,91
while negative loop	1,1445	0,94	2,486	72,203	0,45	1,722	55,56	0,47	1,297	3,12
while negative loop	0,7017	0,92	2,356	73,993	0,44	1,591	55,872	0,46	1,329	3,1
for loop	0,5454	1,18	1,016	56,707	0,64	0,457	55,318	0,66	0,55	39,955
for loop	0,5276	0,95	1,007	57,65	0,44	0,57	55,201	0,46	0,738	2,785
for loop	0,5454	0,93	1,005	57,057	0,44	0,455	55,432	0,45	0,741	2,79
for negative loop	0,5276	1,22	2,398	69,447	0,65	1,373	55,475	0,68	1,892	40,61
for negative loop	0,5454	0,93	2,356	72,035	0,44	1,339	55,926	0,46	1,787	4,13
for negative loop	0,5451	0,93	4,057	70,907	0,44	1,392	55,458	0,46	1,364	4,07
do-while loop	1,3362	1,22	1,217	53,323	2,33	0,731	50,524	0,71	0,556	42,035
do-while loop	1,3359	0,91	1,087	52,519	1,96	0,681	48,508	0,46	0,581	3,1
do-while loop	1,3534	0,93	1,117	50,089	2	0,679	49,208	0,46	0,555	3,215
do-while negative loop	0,5276	1,22	1,103	72,543	0,75	0,645	49,397	0,67	0,555	43,98
do-while negative loop	0,5451	0,92	1,085	73,28	0,54	0,575	49,555	0,46	0,544	2,85
do-while negative loop	0,565	0,93	1,095	73,206	0,52	0,575	48,515	0,46	0,557	2,81
```

## God is in the detail


## First test
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.2/Chart.bundle.min.js"></script>


<canvas id="myChart-i5-4590" height="200"></canvas>

<script type="text/javascript">
        var ctx = document.getElementById("myChart-i5-4590");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['while','while negative','for','for negative','do-while','do-while negative','while','while','while','while negative','while negative','while negative','for','for','for','for negative','for negative','for negative','do-while','do-while','do-while','do-while negative','do-while negative','do-while negative'],
        datasets: [ {
            label: 'FireFox 40.0.3',
            backgroundColor: "rgba(224,98,38,0.4)",
            borderColor: "rgba(224,98,38,1)",
            data: [1.64, 1.06, 1.07, 0.88, 2.21, 1.34, 0.66, 0.45, 0.46, 0.65, 0.45, 0.44, 0.64, 0.44, 0.44, 0.65, 0.44, 0.44, 2.33, 1.96, 2, 0.75, 0.54, 0.52]
        },{
            label: 'Chrome 46',
            backgroundColor: "rgba(75,139,245,0.4)",
            borderColor: "rgba(75,139,245,1)",
            data: [0.854, 1.677, 0.961, 1.893, 1.14, 0.896, 0.439, 0.432, 0.433, 1.412, 1.722, 1.591, 0.457, 0.57, 0.455, 1.373, 1.339, 1.392, 0.731, 0.681, 0.679, 0.645, 0.575, 0.575, ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
</script>

## Base timing
Operating system:  Windows 7 
CPU: i7-3770 @3.40GHz

<canvas id="myChart-i3770" height="200"></canvas>
<script type="text/javascript">
        var ctx = document.getElementById("myChart-i3770");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['while','while negative','for','for negative','do-while','do-while negative','while','while','while','while negative','while negative','while negative','for','for','for','for negative','for negative','for negative','do-while','do-while','do-while','do-while negative','do-while negative','do-while negative'],
        datasets: [
{
            label: '.NET ',
            backgroundColor: "rgba(0,0,0,0.4)",
            borderColor: "rgba(0,0,0,1)",
            data: [0.6697,1.1198,0.6694,0.6688,1.6716,0.6688,0.6682,0.6682,0.6685,0.9173,1.1445,0.7017,0.5454,0.5276,0.5454,0.5276,0.5454,0.5451,1.3362,1.3359,1.3534,0.5276,0.5451,0.565]
        }, {
            label: 'FireFox 41.0.1',
            backgroundColor: "rgba(224,98,38,0.4)",
            borderColor: "rgba(224,98,38,1)",
            data: [2.96, 2.48, 2.38, 2.36, 1.98, 1.67, 1.19, 0.94, 0.92, 1.2, 0.94, 0.92, 1.18, 0.95, 0.93, 1.22, 0.93, 0.93, 1.22, 0.91, 0.93, 1.22, 0.92, 0.93]
        },{
            label: 'Chrome 46 Win 7 i7-3770 @3.40GHz',
            backgroundColor: "rgba(75,139,245,0.4)",
            borderColor: "rgba(75,139,245,1)",
            data: [2.61, 5.469, 2.522, 2.854, 1.671, 1.988, 1.058, 1.117, 1.46, 2.452, 2.486, 2.356, 1.016, 1.007, 1.005, 2.398, 2.356, 4.057, 1.217, 1.087, 1.117, 1.103, 1.085, 1.095]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
</script>