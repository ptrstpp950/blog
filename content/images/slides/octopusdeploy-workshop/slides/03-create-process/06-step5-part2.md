## Step 5: Backup database

```
New-Item -ItemType Directory -Force -Path c:\backup;
Import-Module SQLPS -DisableNameChecking;
$dt = Get-Date -Format yyyyMMddHHmmss;
$dbname = 'WebAppDB';
Backup-SqlDatabase -ServerInstance .\SQLExpress -Database $dbname -BackupFile "c:\Backup\$($dbname)_db_$($dt).bak";
```

note:
    Put your speaker notes here.
    You can see them pressing 's'.
