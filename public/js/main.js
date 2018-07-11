var socket = io.connect('http://localhost:8888/');

function sendMessage() {
    var msg = document.getElementById('inputValue').value;
    socket.emit('chatMessage', msg)
    document.getElementById('inputValue').value = "";
}

socket.on('broadcast', function(messageArray){
    $("#chat-box").html("");
    for (var i = 0; i < messageArray.length; i++) {
        $("#chat-box").append(
            '<div class="msg">\
                <div class="name">name: </div>\
                <div class="content">' + messageArray[i] + '</div>\
            </div>'
        );
    }    
})

