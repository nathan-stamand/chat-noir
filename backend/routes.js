"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonParser = body_parser_1.default.json();
const urlParser = body_parser_1.default.urlencoded({
    extended: true
});
const router = express_1.default.Router();
exports.router = router;
router.use(jsonParser);
router.use(urlParser);
// routes
router.get('/', controller_1.loadHome);
router.post('/login', controller_1.handleLogin);
router.get('/logout', controller_1.handleLogout);
router.get("/:room/users", controller_1.getUsers);
router.get("/:room/messages", controller_1.getMessages);
router.get("/chat", controller_1.loadChat);
//# sourceMappingURL=routes.js.map