const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userLists = document.getElementById('users');

const params = new URLSearchParams(window.location.search)

var room = params.get('room');
var UserName = params.get('User');










const socket = io();

socket.emit('JoinRoom' , {UserName , room});

socket.on('roomUsers' , ({room , users}) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message' , function (message) {
  console.log(message);
 outputMessage(message);

 chatMessages.scrollTop = chatMessages.scrollHeight;


})

chatForm.addEventListener('submit' , function (e) {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage' , msg);
  e.target.elements.msg.value = ' ';
  e.target.elements.msg.focus();


})



function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class = "meta"> ${message.userName} <span> ${message.time} </span></p>
  <p class="text"> ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);


}

function outputRoomName(room) {
  roomName.innerHTML = room

}

function outputUsers(users) {
  userLists.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.UserName;
    userLists.appendChild(li);
  });

}
