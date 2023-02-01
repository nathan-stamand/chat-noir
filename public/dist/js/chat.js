const socket = io();
const USERNAME = getUserInfo()['username'];
const ROOM = getUserInfo()['room'];

var usersInRoom;

if (!varExists(USERNAME) || !varExists(ROOM)) {
  location.replace(location.origin)
}

const form = document.querySelector("#chat form");
const messageInput = document.querySelector("#message");
const messageFeed = document.querySelector("#message-feed");

setRoom(ROOM);
setUser(USERNAME);
loadMessages(ROOM)

socket.on("connect", () => {
  socket.emit('join-room', {
    username: USERNAME,
    room: ROOM
  });
});

socket.on("update-room", () => updateRoom(ROOM, USERNAME));

socket.on('disconnect', () => {
  socket.emit('leave-room', {
    username: USERNAME,
    room: ROOM
  })
})

socket.on("chat-message", msg => {
  createMessage(msg, USERNAME, messageFeed);
  messageFeed.scrollTop = messageFeed.scrollHeight;
});

form.addEventListener("submit", (e) => { 
  sendMessage(e, messageInput)
});

window.addEventListener("unload", () => {
  location.replace(location.origin + '/logout')
})

// handlers
function sendMessage(event, messageInput) {
  event.preventDefault();

  socket.emit('chat-message', {
    username: USERNAME,
    room: ROOM,
    text: messageInput.value
  });
  messageInput.value = "";
}

async function loadMessages(room) {
  fetch(`${location.origin}/${room}/messages`)
    .then(res => res.json())
    .then(data => {
      data.forEach(message => {
        createMessage(message, USERNAME, messageFeed)
      })
      messageFeed.scrollTop = messageFeed.scrollHeight;
    })
}

async function updateRoom(room, username) {
  fetch(`${location.origin}/${room}/users`)
    .then(res => res.json())
    .then(data => setUsersInRoom(data, username))
}

// helpers
// TODO: Move duplicate function to helpers file
function varExists(variable) {
  return typeof variable !== "undefined";
}

function setRoom(room) {
  const roomName = document.querySelector("#room-name");
  roomName.innerText =`Room: ${room}`;
}

function setUser(user) {
  const userDisplay = document.querySelector("#user-display");
  userDisplay.innerText = user;
}

function setUsersInRoom(users, currentUser) {
  const userList = document.querySelector("#user-list")
  userList.innerHTML = '';
  users = users.map(el => el.name);
  users = users.filter(el => el != currentUser);
  if (users.length < 1) return;
  switch (users.length) {
    case 0:
      userList.innerText = '';
      return;
    case 1:
      userList.innerText = `Joined by ${users[0]}`;
      return;
    case 2:
      userList.innerText = `Joined by ${users[0]} and ${users[1]}`
      return;
  }
  const last = users.pop();
  users.push('and');
  users.push(last)
  let usersString = users.join(", ");
  usersString = usersString.replace(", and,", ", and ");
  userList.innerText = `Joined by ${usersString}`;
}

function getUserInfo() {
  const rawCookies = document.cookie.split("; ");
  const cookies = {};
  rawCookies.forEach(cookie => {
    let k = cookie.split('=', 2)[0];
    let v = cookie.split('=', 2)[1];
    cookies[k] = v;
  });
  return cookies;
}

function createMessage(msg, currentUser, messageFeed) {
  var message, messageText, time, username;
  message = document.createElement('article');

  username = document.createElement('span');
  username.className = "inline-block mr-2 font-bold text-xs";
  username.innerText = msg.username;

  time = document.createElement('time');
  time.className = "inline-block mr-2 font-medium text-xs";
  time.innerText = msg.timestamp;

  messageText = document.createElement('div');
  messageText.innerText = msg.text;

  message.appendChild(username);
  message.appendChild(time);
  message.appendChild(messageText);

  message.className = styleMessage(msg.username, currentUser);
  message.setAttribute('data-user', msg.username);

  messageFeed.appendChild(message);
}

function styleMessage(author, currentUser) {
  if (author == "System") {
    return "text-sm text-white mt-2"
  }
  const styleTypes = {
    outgoing: {
      bgColor: "bg-sky-400",
      borderColor: "before:border-sky-400",
      tailPosition: "before:left-full",
      tailDirection: "before:border-r-transparent",
    },
    incoming: {
      bgColor: "bg-zinc-300",
      borderColor: "before:border-zinc-300",
      tailPosition: "before:right-full",
      tailDirection: "before:border-l-transparent",
    }
  }

  const style = author == currentUser ? styleTypes['outgoing'] : styleTypes['incoming'];

  const classes = 
         `${style["bgColor"]} 
          text-black py-2 px-3 mt-4 relative
          before:content-[''] 
          before:border-4 
          ${style["borderColor"]} 
          before:border-solid 
          before:absolute 
          ${style["tailPosition"]} before:bottom-0 
          before:border-t-transparent 
          ${style["tailDirection"]}`;

  return classes;
}
