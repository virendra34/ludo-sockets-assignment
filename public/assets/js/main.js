const lobbyName = document.getElementById('lobby-name');
const userList = document.getElementById('users');
const ludoGameForm = document.getElementById("chat-form");
const token = localStorage.getItem('ludo_token');
const socket = io("http://localhost:8000", {
  query: {
    token,
  }
});
const { lobbyId } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// Join lobby
socket.emit('joinLobby', { lobbyId });
// client-side
socket.on("connect_error", err => {
  console.log(err instanceof Error); // true
  alert(err.message);
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});

// Get lobby and users
socket.on('lobbyUsers', ({ lobby, users }) => {
  outputUsers(users);
  outputLobbyName(lobby);
  console.log("user", users)
});

//Prompt the user before leave lobby
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveLobby = confirm('Are you sure you want to leave?');
  if (leaveLobby) {
    localStorage.clear();
    window.location = '/static';
  } else {
  }
});

// Add lobby name to DOM
function outputLobbyName(lobby) {
  lobbyName.innerText = lobby;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.name;
    userList.appendChild(li);
  });
}

ludoGameForm.addEventListener('submit', function (e) {
  e.preventDefault();
  // Emit message to server
  socket.emit('rollDice', { lobbyId });
});

socket.on('diceVal', ({ diceVal, msg }) => {
  console.log('diceVal:', diceVal, msg);
  outputMessage(msg);
})

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}