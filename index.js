const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const port = 8888
const app = express()
var messageArray = [];
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('accounts');
var userId = 0;

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

function clearDb() {
    var deleteMessages = db.prepare("DELETE FROM messages");
    deleteMessages.run();
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
        messageArray.push(msgObject);
        if (msgObject.message == "/clear"){
            clearMessages();
        } else {
            console.log(msgObject);
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