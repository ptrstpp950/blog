---
layout: post
title: Better SourceTree with Mono.Cecil
date: '2014-03-27 14:01:37'
---

### Introduction
I am using Git for a while, but I hate git console for Windows. But some time ago Scott Hanselman published how to [integrate Git with PowerShell](http://www.hanselman.com/blog/PromptsAndDirectoriesEvenBetterGitAndMercurialWithPowerShell.aspx) which is exactly what I need. Instead of old *cmd* I have all features from **PowerShell**.

Sometime ago my friends show me [SourceTree](http://sourcetreeapp.com/), which is quite nice tool. But it has a one irritating button: **Terminal**, which opens *Git console* or *cmd*. But I hate git console and I hate cmd, I would like to open PowerShell instead. I look all the options but I cannot find anyway to change this button action, or at least hide it.

### What does this button do?
Because I didn't find any useful option, I decided to check the source. But SourceTree is not open-source app, which is quite strange in this days ;)

SourceTree is .NET application, so we can restore "our" code using some  dedicated tools like dotPeek or ILSpy. I find out that terminal button handler looks like following:

    public void LaunchGitBashPrompt(string path)
    {
      string str = GeneralHelper.CombinePath(RepoHandlerGit.GitBasePath(), "bin\\sh.exe");
      ProcessStartInfo startInfo = new ProcessStartInfo("cmd.exe");
      if (path != null)
        startInfo.WorkingDirectory = path;
      startInfo.Arguments = string.Format("/c \"{0}\" --login -i", (object) str);
      Process.Start(startInfo);
    }

All the stings are **hardcoded**, so there isn't an easy way to replace them.

### Mono.Cecil to the rescue.
Quoting [offical site](http://mono-project.com/Cecil) (the most importat part is bolded): 
>Cecil is a library written by Jb Evain to generate and inspect programs and libraries in the ECMA CIL format. It has full support for generics, and support some debugging symbol format.

>In simple English, with Cecil, you can load existing managed assemblies, browse all the contained types, **modify them on the fly and save back** to the disk the modified assembly.

>Today it is used by the Mono Debugger, the bug-finding and compliance checking tool Gendarme, MoMA, DB4O, as well as many other tools.

So I produce simple Console application:
	
        public static void Main(string[] args)
        {
             const string powershellLink =
                @"C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Accessories\Windows PowerShell\Windows PowerShell.lnk";
            const string powershellArgs = " -NoExit \"cd '{0}';\"";

            var resolver = new DefaultAssemblyResolver();
            resolver.AddSearchDirectory(@"C:\tempSourceTree\sourceMy");

            var parameters = new ReaderParameters
            {
                AssemblyResolver = resolver,
            };

            var assembly = AssemblyDefinition.ReadAssembly(@"C:\tempSourceTree\sourceMy\SourceTree2.exe", parameters);

            var repoHandlerGit = assembly.MainModule.Types.First(x => x.Name.EndsWith("RepoHandlerGit"));
            Console.WriteLine(repoHandlerGit);
            var launchGitBashPrompt = repoHandlerGit.Methods.First(x => x.Name == "LaunchGitBashPrompt");
            Console.WriteLine(launchGitBashPrompt);

            var cmdString = launchGitBashPrompt.Body.Instructions.First(x => "cmd.exe".Equals(x.Operand));

            cmdString.Operand = powershellLink;

            var argsString = launchGitBashPrompt.Body.Instructions.First(x => x.Operand != null && x.Operand is string && ((string)x.Operand).Contains("login"));

            argsString.Operand = powershellArgs;

            launchGitBashPrompt.Body.Instructions[14] = launchGitBashPrompt.Body.Instructions[10];


            assembly.Write(@"C:\tempSourceTree\sourceMy\SourceTree.exe");
            Console.WriteLine("Done");
            Console.ReadLine();
        }

To use it copy SourceTree instalation into temp folder (in my case  `C:\tempSourceTree\sourceMy`) and rename `SourceTree.exe` to `SourceTree2.exe`. 
After execution just replace `SourceTree.exe` with new file

That all folks. 

p.s. I hoper bext time *Atlassian* will just show us code and I don't have to use dirty tricks.