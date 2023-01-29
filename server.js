require('dotenv').config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socket = require("./socket")(server);
const router = require("./routes");
const path = require("path");
const connection = require("./db/connection");
connection();
app.use('/', router)
app.use(express.static(path.join(__dirname, "public")));

// connect to db & start server
server.listen(PORT, () => {
  console.log(`:::Listening on localhost:${PORT}:::`)
})
