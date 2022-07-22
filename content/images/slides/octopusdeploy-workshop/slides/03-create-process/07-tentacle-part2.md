## Error

```
Backup-SqlDatabase : System.Data.SqlClient.SqlError: The server principal "NT 
AUTHORITY\SYSTEM" is not able to access the database "WebAppDB" under the 
current security context.
```

we need to change service credentials to:

- user: vagrant
- pass: vagrant

Let's try again. Our web app will be installed into 
```
C:\Octopus\Applications\Test\WebApplication\1.0.0.0
```

note:
    Put your speaker notes here.
    You can see them pressing 's'.
