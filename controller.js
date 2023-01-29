const Room = require("./models/roomSchema");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

// middleware
app.use(cookieParser());

async function loadHome (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
}

async function handleLogin (req, res) {
  const username = req.body.username;
  const roomName = req.body.room;

  if (!username || !roomName) {
    return res.redirect("/?error=incomplete-fields");
  }
  if (username.toLowerCase() == "system") {
    return res.redirect("/?error=invalid-username");
  } 

  var room = await Room.findOne({name: roomName})

  if (!room) {
    room = await Room.create({name: roomName, users: [{name: username}]});
  } else {
    var users = room.users.map(el => el.name)
    if (users.includes(username)) {
      return res.redirect("/?error=duplicate-username");
    }
    room = await Room.findOneAndUpdate(
      {_id: room._id}, 
      {users: [...room.users, {name: username}]
    });
  }

  res.cookie('username', username);
  res.cookie('room', roomName);
  return res.redirect('/chat');
}

async function getUsers (req, res) {
  Room.findOne({name: req.params.room}).then(room => {
    if (room) {
      return res.json(room.users);
    } else {
      res.redirect("/?error=empty-room");
    }
  });
}

async function loadChat (req, res) {
  res.sendFile(path.join(__dirname, "/public/chat.html"));
}

module.exports = {
  loadHome,
  handleLogin,
  getUsers,
  loadChat
}
