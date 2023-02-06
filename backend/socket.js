"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const roomSchema_1 = require("./models/roomSchema");
const socket_io_1 = require("socket.io");
const helpers_1 = require("./helpers");
function socket(server) {
    const io = new socket_io_1.Server(server);
    io.on('connect', (socket) => {
        console.log(':::sockets connected:::');
        socket.on('join-room', msg => {
            socket.username = msg.username;
            socket.room = msg.room;
            socket.join(msg.room);
            socket.broadcast.to(msg.room).emit('chat-message', {
                username: "System",
                text: `${msg.username} has joined ${msg.room}`,
                timestamp: (0, helpers_1.createTimeStamp)(),
            });
            roomSchema_1.rooms.findOne({ name: msg.room }).then(res => {
                if (res) {
                    io.to(msg.room).emit('update-room', {
                        users: res.users
                    });
                }
            });
        });
        socket.on('disconnect', () => {
            roomSchema_1.rooms.findOne({ name: socket.room }).then(room => {
                var users = room.users.filter(user => user.name != socket.username);
                if (users.length) {
                    return roomSchema_1.rooms.updateOne({ _id: room._id }, { users: users });
                }
                else {
                    return roomSchema_1.rooms.deleteOne({ _id: room._id });
                }
            }).then(res => {
                console.log(res);
                if (res.modifiedCount == 1) {
                    console.log(`${socket.username} has left ${socket.room}`);
                }
            }).then(_ => {
                socket.broadcast.to(socket.room).emit('chat-message', {
                    username: "System",
                    text: `${socket.username} has left ${socket.room}`,
                    timestamp: (0, helpers_1.createTimeStamp)(),
                });
                socket.broadcast.to(socket.room).emit('update-room');
            });
        });
        socket.on('chat-message', msg => {
            msg.timestamp = (0, helpers_1.createTimeStamp)();
            roomSchema_1.rooms.findOne({ name: msg.room }).then(room => {
                return roomSchema_1.rooms.updateOne({ _id: room._id }, { messages: [...room.messages, msg] });
            });
            io.to(msg.room).emit('chat-message', msg);
        });
    });
}
exports.socket = socket;
//# sourceMappingURL=socket.js.map