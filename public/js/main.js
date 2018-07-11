var socket = io.connect('http://localhost:8888/');

function sendMessage() {
    var msg = document.getElementById('inputValue').value;
    socket.emit('chatMessage', msg)
    document.getElementById('inputValue').value = "";
}

socket.on('broadcast', function(messageArray){
    var noOfItems = messageArray.length;
    var txtNode = document.createTextNode(noOfItems);
    var elementNode = document.createElement("p");
    var node = elementNode.appendChild(txtNode);
    document.getElementById('content').appendChild(node);
    
})

