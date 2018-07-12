# chat-site-ws

locally hosted chat website using web sockets using SQLite3

This application will host a website where the socket is pointed to through the socket const:

  ```javascript 
const socket = io.connect('"Insert URL"');
```

All messages and account names are saved into a database called "accounts.db" that will be created if not already existing, in the root folder.

accounts.db supports 2 tables, "users" which consists of a primary key collumn, "userid" and "name" collumn and a "messages" table which consists of a foriegn key collumn, "userid" and "messages" collumn.

Also features some commands such as **clear** command that deletes all messages from the message table in accounts.db and updates the chatbox.
