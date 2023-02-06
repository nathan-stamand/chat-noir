"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    name: String,
    users: Array,
    messages: Array
});
const rooms = new mongoose_1.default.model('rooms', roomSchema);
exports.rooms = rooms;
//# sourceMappingURL=roomSchema.js.map