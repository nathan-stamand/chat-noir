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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadChat = exports.getMessages = exports.getUsers = exports.handleLogout = exports.handleLogin = exports.loadHome = void 0;
const roomSchema_1 = require("./models/roomSchema");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// middleware
app.use((0, cookie_parser_1.default)());
function loadHome(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
    });
}
exports.loadHome = loadHome;
function handleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const roomName = req.body.room;
        if (!username || !roomName) {
            return res.redirect(`/?error=incomplete-fields&username=${username || 'UNSET'}&roomname=${roomName || 'UNSET'}`);
        }
        if (username.toLowerCase() == "system") {
            return res.redirect(`/?error=invalid-username&username=${username}&roomname=${roomName}`);
        }
        var room = yield roomSchema_1.rooms.findOne({ name: roomName });
        if (!room) {
            room = yield roomSchema_1.rooms.create({ name: roomName, users: [{ name: username }] });
        }
        else {
            var users = room.users.map(el => el.name);
            if (users.includes(username)) {
                return res.redirect(`/?error=duplicate-username&username=${username}&roomname=${roomName}`);
            }
            room = yield roomSchema_1.rooms.findOneAndUpdate({ _id: room._id }, { users: [...room.users, { name: username }]
            });
        }
        res.cookie('username', username);
        res.cookie('room', roomName);
        return res.redirect('/chat');
    });
}
exports.handleLogin = handleLogin;
function handleLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie("username");
        res.clearCookie("room");
        res.redirect('/');
    });
}
exports.handleLogout = handleLogout;
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        roomSchema_1.rooms.findOne({ name: req.params.room }).then(room => {
            if (room) {
                return res.json(room.users);
            }
            else {
                res.redirect("/?error=empty-room");
            }
        });
    });
}
exports.getUsers = getUsers;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        roomSchema_1.rooms.findOne({ name: req.params.room }).then(room => {
            if (room) {
                return res.json(room.messages);
            }
            else {
                res.redirect("/?error=empty-room");
            }
        });
    });
}
exports.getMessages = getMessages;
function loadChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.sendFile(path_1.default.join(__dirname, "../public/chat.html"));
    });
}
exports.loadChat = loadChat;
//# sourceMappingURL=controller.js.map