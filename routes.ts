import express from "express";
import { loadHome, handleLogin, handleLogout, getUsers, getMessages, loadChat } from "./controller";

import bodyParser from "body-parser";
const jsonParser = bodyParser.json()
const urlParser = bodyParser.urlencoded({
  extended: true
});
const router = express.Router();

router.use(jsonParser);
router.use(urlParser);


// routes
router.get('/', loadHome);

router.post('/login', handleLogin);

router.get('/logout', handleLogout);

router.get("/:room/users", getUsers);

router.get("/:room/messages", getMessages);

router.get("/chat", loadChat);

export { router }
