const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();
var sound = new Audio('sound.mp3');
sound.volume = 0.2;
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    sound.play();
    outputMessage(message);
    // console.log(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', (data) => {
    roomName.innerText ='Room : ' + data.room ;
    outputUsers(data.users);
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputUsers(users) {
    document.getElementById('users').innerHTML='<hr>';
    for (let i = 0; i < users.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `${users[i].username}`;
        document.getElementById('users').appendChild(li);
    }
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    }
  });