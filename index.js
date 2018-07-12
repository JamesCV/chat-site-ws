const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const port = 8888
const app = express()
var messageArray = [];
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('accounts');
readMessages();

db.serialize(function(msgObject){
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages (userId INT, message TEXT)");
    
});


function insertIntoDb(msgObject) {
    db.get("SELECT name FROM users WHERE name = ?", msgObject.name, function(error, row) {
        if (error) console.log(error);

        if (row == undefined) {
            var insertUser = db.prepare("INSERT INTO users VALUES (?, ?)");
            insertUser.run(null, msgObject.name);
            insertUser.finalize();
        }

        nextStep();
    });
    
    function nextStep(){
        db.get("SELECT id FROM users WHERE name = ?", msgObject.name, function(error, row){
            if (error) console.log(error);

            var insertMessage = db.prepare("INSERT INTO messages VALUES (?, ?)");
            insertMessage.run(row.id, msgObject.message);
            insertMessage.finalize();
            
        })
    }
}

function clearDb(){
    var clearMessages = db.prepare("DELETE FROM messages");
    clearMessages.run();
}

function readMessages() {
    db.all("SELECT users.name, messages.message FROM users, messages WHERE users.id = messages.userId", function(error, rows){
        if (error) {
            console.log(error);
        } else {
            messageArray = [];
            for (i = 0; i < rows.length; i++) {
                obj = {
                    name: rows[i].name,
                    message: rows[i].message,
                }
                messageArray.push(obj);
            }
        }
    })
}


app.use(express.static('public'))

const server = http.createServer(app)
const io = socketIO(server)

function callback(socket) {
    console.log('User connected')
    
    socket.emit('loadMessages', messageArray);

    socket.on('disconnect', function(){
        console.log('User disconnected')
    })
  
    socket.on('chatMessage', function(msgObject) {
        insertIntoDb(msgObject);
        if (msgObject.message == "/clear"){
            clearMessages();
        } else {
            readMessages();
            io.emit('broadcast', msgObject);
        }
    });
   
    
  }
  
  function clearMessages() {
    messageArray = [];
    clearDb();
    io.emit('command', "clear-messages")
  }

io.on('connection', callback)

server.listen(port, function() {
    console.log('Listening on port ' + port);
});