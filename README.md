# chat-site-ws

locally hosted chat website using web sockets using SQLite3

This application will host a website where the socket is pointed to through the socket const,

  ```javascript 
const socket = io.connect('"Insert URL"');
```

All messages and account names are saved into a database called "accounts.db" that will be created if not already existing, in the root folder.
