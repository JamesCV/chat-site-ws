const socket = io.connect('http://192.168.0.13:8888/');




$('#btnChangeName').on('click', function(){
    var name = $('#nameInput').val();
    document.cookie = "username=" + name;
    $('.modal').removeClass('is-active');
})

$('#btnUsername').on('click', function () {
    $('#submitMessageModal').addClass("is-active")
})

$('.buttonClose').on('click', function () {
    $('.modal').removeClass('is-active');
})

$('#inputValue').on('keyup', function(event){
    if (event.keyCode == 13) {
        sendMessage();
    }
})
function scrollChatBox(){
    var chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}


function checkPage() {
    
    if (checkCookie("username") == -1) {
        $('#submitMessageModal').addClass('is-active');
    } else {
        $('#submitMessageModal').removeClass('is-active');
        
    
    }
    
}

function sendMessage() {

    if (checkCookie("username") == -1) {
        $('#noUsernameModal').addClass('is-active');
    } else {
        socket.emit('chatMessage', {
            name: getCookie("username"),
            message: $("#inputValue").val(),
        });
        
        $("#inputValue").val("");
    }
    
}


socket.on('loadMessages', function(messageArray){
    $("#chat-box").html("");
    for (var i = 0; i < messageArray.length; i++) {
        $("#chat-box").append(
            '<div class="msg ">\
                <div class="name">' + messageArray[i].name + ': </div>\
                <div class="content">' + messageArray[i].message + '</div>\
            </div>'
        );
    }
    scrollChatBox();
})

socket.on('broadcast', function (msgObject){
    var element = $(
        '<div class="msg ">\
            <div class="name"></div>\
            <div class="content"></div>\
        </div>'
    );

    $(element).find('.name').text(msgObject.name);
    $(element).find('.content').text(msgObject.message);
    $("#chat-box").append(element);
    scrollChatBox();       
});

socket.on('command', function(command){
    console.log(command);
    if (command == "clear-messages") {
        $('#chat-box').text("");
    }
})


function setName() {
    if (getCookie("username") == undefined) {
        $('#submitMessageModal').addClass("is-active")
    } 
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

function checkCookie(cookie) {
    var allCookies = document.cookie;
     return allCookies.indexOf(cookie);
}

