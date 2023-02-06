"use strict";
const params = createParamObject();
const user = params.username;
const room = params.roomname;
if (params['error']) {
    showError(params['error'], user, room);
}
function paramExists(variable) {
    return typeof variable !== "undefined";
}
function showError(code, user, room) {
    if (!paramExists(user) || !paramExists(room)) {
        console.error("User and room not set.");
        return;
    }
    const errorCodes = {
        "incomplete-fields": "Please complete both the username and the room field.",
        "duplicate-username": `Username '${user}' already exists in room ${room}.`,
        "invalid-username": `Username '${user}' is invalid, please choose another.`,
        "empty-room": `${room} is empty. Please sign in again.`
    };
    if (typeof errorCodes[code] === "undefined") {
        console.error(`No matching error code found for ${code}.`);
        return;
    }
    const errorBox = document.querySelector("#error-box");
    if (errorBox) {
        errorBox.innerHTML = errorCodes[code];
        errorBox.style.display = "block";
    }
}
function createParamObject() {
    const errorParam = location.search.replace("?", "").split("&");
    const params = {};
    errorParam.forEach(param => {
        let k = param.split("=")[0];
        let v = param.split("=")[1];
        params[k] = v;
    });
    return params;
}
//# sourceMappingURL=index.js.map