const Room = require("./models/roomSchema");
const { Server } = require("socket.io");
const { createTimeStamp } = require("./helpers");

function socket(server) {
  const io = new Server(server);
  io.on('connect', (socket) => {
    console.log(':::sockets connected:::');
    socket.on('join-room', msg => {
      socket.username = msg.username;
      socket.room = msg.room;
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

    socket.on('disconnect', () => {
      Room.findOne({name: socket.room}).then(room => {
        var users = room.users.filter(user => user.name != socket.username)

        if (users.length) {
          return Room.updateOne({_id: room._id}, {users: users})
        } else {
          return Room.deleteOne({_id: room._id});
        }
      }).then(res => {
        console.log(res)
        if (res.modifiedCount == 1) {
          console.log(`${socket.username} has left ${socket.room}`)
        }
      }).then(_ => {
        socket.broadcast.to(socket.room).emit('chat-message', {
          username: "System",
          text: `${socket.username} has left ${socket.room}`,
          timestamp: createTimeStamp(),
        });

        socket.broadcast.to(socket.room).emit('update-room')
      });
    });

    socket.on('chat-message', msg => {
      msg.timestamp = createTimeStamp();
      Room.findOne({name: msg.room}).then(room => {
        return Room.updateOne({_id: room._id}, { messages: [...room.messages, msg] })
      })
      io.to(msg.room).emit('chat-message', msg)
    });
  });
}

module.exports = socket;
