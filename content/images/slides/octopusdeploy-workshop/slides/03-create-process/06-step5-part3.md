## Step 5: Backup database

We need a script task now. 
We will add variables to our script: `databasename`, `SQLServerInstance`, `backupfolder`

Script can look like:
```
New-Item -ItemType Directory -Force -Path $backupfolder ;
Import-Module SQLPS -DisableNameChecking;
$dt = Get-Date -Format yyyyMMddHHmmss;
Backup-SqlDatabase -ServerInstance $SQLServerInstance -Database $databasename -BackupFile "$backupfolder\$($databasename)_db_by_octopus_$($dt).bak";
```
Let's run it from: 
```
C:\packagedrop\Test\WebApp
```

note:
    Put your speaker notes here.
    You can see them pressing 's'.
