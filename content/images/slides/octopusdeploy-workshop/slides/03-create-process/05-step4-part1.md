## Step 4:  How to create a package?

To create it we need `OctoPack` nuget package. We can install it with:
```
Install-Package OctoPack
```

Then we build our solution form `cmd` with:
```
MSBuild.exe WebApplication.sln /t:Build /p:RunOctoPack=true
```

Result will be in 
```
.\WebApplication\WebApplication\obj\octopacked
```


note:
    Put your speaker notes here.
    You can see them pressing 's'.
