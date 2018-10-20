const wifi = require("./wifi");
const client = require("./client");
const printer = require("./printer");

// tryes to connect:
wifi.init()
.then((connected) => {
  console.log("wifi connected");
  client.init();
})
.catch(e => console.log(e));
