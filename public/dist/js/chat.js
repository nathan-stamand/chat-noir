"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const socket = io(); // TODO: Add types to socket
const USERNAME = getUserInfo()['username'];
const ROOM = getUserInfo()['room'];
var usersInRoom;
if (!varExists(USERNAME) || !varExists(ROOM)) {
    location.replace(location.origin);
}
const form = document.querySelector("#chat form");
const messageInput = document.querySelector("#message");
const messageFeed = document.querySelector("#message-feed");
setRoom(ROOM);
setUser(USERNAME);
loadMessages(ROOM);
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
    });
});
socket.on("chat-message", (msg) => {
    if (typeof USERNAME == "string" && messageFeed) {
        createMessage(msg, USERNAME, messageFeed);
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }
});
if (form) {
    form.addEventListener("submit", (e) => {
        sendMessage(e, messageInput);
    });
}
window.addEventListener("unload", () => {
    location.replace(location.origin + '/logout');
});
// handlers
function sendMessage(e, messageInput) {
    e.preventDefault();
    if (messageInput) {
        socket.emit('chat-message', {
            username: USERNAME,
            room: ROOM,
            text: messageInput.value
        });
        messageInput.value = "";
    }
}
function loadMessages(room) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof USERNAME == "string" && messageFeed) {
            fetch(`${location.origin}/${room}/messages`)
                .then(res => res.json())
                .then(data => {
                data.forEach((msg) => {
                    createMessage(msg, USERNAME, messageFeed);
                });
                messageFeed.scrollTop = messageFeed.scrollHeight;
            });
        }
    });
}
function updateRoom(room, username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof room == "string" && typeof username == "string") {
            fetch(`${location.origin}/${room}/users`)
                .then(res => res.json())
                .then(data => setUsersInRoom(data, username));
        }
    });
}
// helpers
// TODO: Move duplicate function to helpers file
function varExists(variable) {
    return typeof variable !== "undefined";
}
function setRoom(room) {
    if (!varExists(room))
        return;
    const roomName = document.querySelector("#room-name");
    if (roomName) {
        roomName.innerText = `Room: ${room}`;
    }
}
function setUser(user) {
    if (typeof user == "undefined")
        return;
    const userDisplay = document.querySelector("#user-display");
    if (userDisplay) {
        userDisplay.innerHTML = user;
    }
}
function setUsersInRoom(users, currentUser) {
    const userListEl = document.querySelector("#user-list");
    if (!userListEl)
        return;
    userListEl.innerHTML = '';
    let userArray = users.map(el => el.name);
    userArray = userArray.filter(el => el != currentUser);
    if (userArray.length < 1)
        return;
    switch (userArray.length) {
        case 0:
            userListEl.innerText = '';
            return;
        case 1:
            userListEl.innerText = `Joined by ${userArray[0]}`;
            return;
        case 2:
            userListEl.innerText = `Joined by ${userArray[0]} and ${userArray[1]}`;
            return;
    }
    const last = userArray.pop();
    if (last) {
        userArray.push('and');
        userArray.push(last);
    }
    let usersString = userArray.join(", ");
    usersString = usersString.replace(", and,", ", and ");
    userListEl.innerText = `Joined by ${usersString}`;
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
        return "text-sm text-white mt-2";
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
    };
    const style = author == currentUser ? styleTypes['outgoing'] : styleTypes['incoming'];
    const classes = `${style["bgColor"]} 
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
//# sourceMappingURL=chat.js.map