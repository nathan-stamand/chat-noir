const params = createParamObject();
const user = params["username"];
const room = params["roomname"];

if (params['error']) {
  console.log(user, room)
  showError(params['error'], user, room);
}

function varExists(variable) {
  return typeof variable !== "undefined";
}

function showError(code, user, room) {
  if (!varExists(user) || !varExists(room)) {
    console.error("User and room not set.")
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
  errorBox.innerHTML = errorCodes[code];
  errorBox.style.display = "block";
}

function createParamObject() {
  const errorParam = location.search.replace("?", "").split("&");
  const params = {};
  errorParam.forEach(param => {
    let k = param.split("=")[0]
    let v = param.split("=")[1]
    params[k] = v
  });
  return params;
}

// TODO: Create helpers file, this is duplicate function
function getUserInfo() {
  const rawCookies = document.cookie.split("; ");
  const cookies = {};
  rawCookies.forEach(cookie => {
    let k = cookie.split('=', 2)[0];
    let v = cookie.split('=', 2)[1];
    cookies[k] = v;
  });
  return cookies;
}
