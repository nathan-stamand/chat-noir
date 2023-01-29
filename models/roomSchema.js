const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String,
  users: Array,
  messages: Array
});

const rooms = new mongoose.model('rooms', roomSchema);

module.exports = rooms;


