const Room = require("./models/roomSchema");
const { Server } = require("socket.io");
const { createTimeStamp } = require("./helpers");

function socket(server) {
  const io = new Server(server);
  io.on('connect', (socket) => {
    console.log(':::sockets connected:::');
    socket.on('join-room', msg => {
      socket.join(msg.room);
      socket.broadcast.to(msg.room).emit('chat-message', {
        username: "System",
        text: `${msg.username} has joined ${msg.room}`,
        timestamp: createTimeStamp(),
      });
      
      Room.findOne({name: msg.room}).then(res => {
        if (res) {
          io.to(msg.room).emit('update-room', {
            users: res.users
          })
        }
      })
    });

    socket.on('chat-message', msg => {
      msg.timestamp = createTimeStamp();
      io.to(msg.room).emit('chat-message', msg)
    });
  });
}

module.exports = socket;
