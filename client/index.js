const wifi = require("./wifi");
const client = require("./client");


// tryes to connect:
wifi.init()
.then((connected) => {
  client.init();
});
