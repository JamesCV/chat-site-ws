const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const port = 8888
const app = express()
var messageArray = [];

app.use(express.static('public'))

const server = http.createServer(app)
const io = socketIO(server)

function callback(socket) {
    console.log('User connected')
    
    socket.on('disconnect', function(){
        console.log('User disconnected')
    })
  
    // recieving message from sender
    socket.on('chatMessage', function(message) {
        console.log("chat message received: " + message);
        messageArray.push(message);
        console.log(messageArray);
        io.emit('broadcast', messageArray);
    });

    
    
  }

io.on('connection', callback)

server.listen(port, function() {
    console.log('Listening on port ' + port);
});