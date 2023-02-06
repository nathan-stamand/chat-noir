"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeStamp = void 0;
function createTimeStamp() {
    const settings = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return Intl.DateTimeFormat('en', settings).format(new Date());
}
exports.createTimeStamp = createTimeStamp;
//# sourceMappingURL=helpers.js.map