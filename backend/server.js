"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const socket_1 = require("./socket");
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const connection_1 = require("./db/connection");
(0, socket_1.socket)(server);
(0, connection_1.connection)();
app.use('/', routes_1.router);
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// connect to db & start server
server.listen(PORT, () => {
    console.log(`:::Listening on localhost:${PORT}:::`);
});
//# sourceMappingURL=server.js.map