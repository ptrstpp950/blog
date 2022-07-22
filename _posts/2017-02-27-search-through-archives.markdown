---
layout: post
title: Search through archives using C#
image: "/content/images/2017/02/01-sherlock-magnifying-glass.jpg"
date: '2017-02-27 18:40:00'
tags:
- code
---

I had a small problem, I need to grep IIS logs and search for few lines. There was only one problem - the size of logs. A few gigabytes of compressed data with 15% compress ratio. The interesting stuff for me happened between 9:00 and 10:00 AM, so everything after 10:00 AM I can just skip.

## Using a log aggregator.
The best option for storing and searching logs is log aggregator. But IIS logs are heavy and searching them is rather a last resort. If I had them on ELK, Splunk or even Hadoop `grep` will be easy.  

## The first try.
I used simple `Select-string` command combine with `7-zip` for unraring my logs and delete them after the search. Why delete? Uncompress data were too large for my hard disk. Everything was good until I didn't found a mistake in my search after operation finished.

## Let's make some code.
The most obvious optimization is to stop searching logs which happened after 10:00 AM. The `Select-string` doesn't have such option and I don't have to unpack everything. Therefore, I created a simple program.

After a search, I decide to use a NuGet package [SharpCompress](https://www.nuget.org/packages/SharpCompress/). It has a simple API, and it is powerful. The first version looks like following:
```
using System;
using System.Diagnostics;
using System.IO;
using SharpCompress.Readers;

namespace FastIISExtractor
{
    class Program
    {
        static void Main(string[] args)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            const string maxTime = "2017-02-02 10:00";
            const string searchValue = "phrase to find";
            const string searchDirectory = @"d:\somewhere\";
            const string searchPattern = "*.rar";
            const string resultFile = @"d:\somewhere2\out.log";

            using (var sw = new StreamWriter(resultFile))
            {
                
                foreach (var file in Directory.EnumerateFiles(searchDirectory, searchPattern))
                {
                    using (var stream = File.OpenRead(file))
                    {
                        var reader = ReaderFactory.Open(stream);
                        while (reader.MoveToNextEntry())
                        {
                            if (reader.Entry.IsDirectory)
                                continue;
                            Console.WriteLine($"------ Processing: {reader.Entry.Key} in {file} -------");
                            using (var streamReader = new StreamReader(reader.OpenEntryStream()))
                            {
                                string line;
                                while ((line = streamReader.ReadLine()) != null)
                                {
                                    if (line.Contains(maxTime))
                                    {
                                        Console.WriteLine("------ To far stop processing-----");
                                        break;
                                    }
                                    if (!line.Contains(searchValue))
                                        continue;

                                    sw.WriteLine(line);
                                    Console.WriteLine("Found line" + line);
                                }
                            }
                        }
                    }
                }
            }
            stopwatch.Stop();
            Console.WriteLine(stopwatch.Elapsed.TotalSeconds);
        }
    }
}

```

First result 848 seconds for 12 1,5GB files with 15% compress ratio. It is better than the first version, but I check my resource monitor and discovered that CPU is using only one core with 100% utilization. In the other hand, disk utilization has some space to improve. In such case, the simple improvement is to introduce threading in the code.


## Make it parallel.
Converting the for loop into `Parallel.ForEach` should bring a time reduction. The only change I have to make is `WriteLog` function with `lock` statement. Because writing is a rare operation in my case I won't optimize this part. The final code is:

```
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using SharpCompress.Readers;

namespace FastIISExtractor
{
    class Program
    {
        private static readonly object FileLock = new object();
        private static void WriteLog(string fileName, string line)
        {
            lock (FileLock)
            {

                File.AppendAllText(fileName, line + Environment.NewLine);
            }
        }
        static int Main(string[] args)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            const string maxTime = "2017-02-02 10:00";
            const string searchValue = "phrase to find";
            const string searchDirectory = @"d:\somewhere\";
            const string searchPattern = "*.rar";
            const string resultFile = @"d:\somewhere2\out.log";
            if (File.Exists(resultFile))
            {
                Console.WriteLine($"File {resultFile} already exists. Quit");
                return -1;
            }
            Parallel.ForEach(Directory.EnumerateFiles(searchDirectory, searchPattern), file =>
            {
                using (var stream = File.OpenRead(file))
                {
                    var reader = ReaderFactory.Open(stream);
                    while (reader.MoveToNextEntry())
                    {
                        if (reader.Entry.IsDirectory)
                            continue;
                        using (var streamReader = new StreamReader(reader.OpenEntryStream()))
                        {
                            string line;
                            while ((line = streamReader.ReadLine()) != null)
                            {
                                if (line.Contains(maxTime))
                                {
                                    Console.WriteLine($"------ To far stop processing {reader.Entry.Key} in {file}-----");
                                    break;
                                }
                                if (!line.Contains(searchValue))
                                    continue;

                                //sw.WriteLine(line);
                                WriteLog(resultFile, line);
                                Console.WriteLine($"Found line {reader.Entry.Key} in {file}: {line}");

                            }
                        }
                    }
                }
            });
            stopwatch.Stop();
            Console.WriteLine(stopwatch.Elapsed.TotalSeconds);
            return 0;
        }
    }
}
```
The result is 421 seconds. Better, much better. The best thing is that I spent 15 minutes on coding and now have a powerful parallel grep tool. I already run it a few times and have some fun. 
Do you think I should make a tool from it?