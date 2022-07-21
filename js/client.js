const socket = io('http://localhost:8000');

// Get dom elements in a respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('sounds/ting.mp3');

// function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
    }
} 

//Ask new user for name and let the server knows
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

//if a new users joins, receive name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// if server send a message receive it
socket.on('recieve', data => {
    const name = `${data.name}`;
    const message = `${data.message}`;
    append(name + ": " + message, 'left');
});

// if a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});

//if the form gets submit send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
} );