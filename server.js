const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const path = require("path");
const cookieParser = require("cookie-parser");

// middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

const roomMembers = {};

app.post('/login', (req, res) => {
  const user = req.body.username;
  const room = req.body.room;
  if (!user || !room) {
    return res.redirect("/?error=incomplete-fields");
  }
  if (user.toLowerCase() == "system") {
    return res.redirect("/?error=invalid-username");
  }
  if (typeof roomMembers[room] === "undefined") {
    console.log(`Creating new room: ${room}`)
    roomMembers[room] = [user];
  } else if (roomMembers[room].includes(user)) { 
    console.error(roomMembers);
    return res.redirect("/?error=duplicate-username");
  } else {
    roomMembers[room].push(user)
    console.log(`added  ${user} to room...`)
  }
  res.cookie('username', user);
  res.cookie('room', room);
  return res.redirect('/chat');
});

app.get("/:room/users", (req, res) => {
  const usersInRoom = roomMembers[req.params.room];
  res.json(usersInRoom)
})

app.get("/chat", (req, res) => {
  return res.sendFile(path.join(__dirname, `/public/chat.html`));
})

// socket events
io.on('connect', (socket) => {
  socket.on('join-room', msg => {
    socket.join(msg.room);
    socket.broadcast.to(msg.room).emit('chat-message', {
      username: "System",
      text: `${msg.username} has joined ${msg.room}`,
      timestamp: createTimeStamp(),
    });
    socket.broadcast.to(msg.room).emit('update-room', {
      users: roomMembers[msg.room]
    })
  });

  socket.on('chat-message', msg => {
    msg.timestamp = createTimeStamp();
    io.to(msg.room).emit('chat-message', msg)
  });
})

// start server
server.listen(PORT, () => {
  console.log(`:::Listening on localhost:${PORT}:::`);
})

// helpers
function createTimeStamp() {
  const settings = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return Intl.DateTimeFormat('en', settings).format(new Date());
}
