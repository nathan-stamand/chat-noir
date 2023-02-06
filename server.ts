require('dotenv').config();
const PORT = process.env.PORT || 8000;
import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { socket } from "./socket";
import { router } from "./routes";
import path from "path";
import { connection } from "./db/connection";

socket(server);
connection();

app.use('/', router)
app.use(express.static(path.join(__dirname, "../public")));

// connect to db & start server
server.listen(PORT, () => {
  console.log(`:::Listening on localhost:${PORT}:::`);
})

