const io = require('socket.io-client');

const url = "http://"+(process.argv[3]
    ? process.argv[3]: "51.75.28.38")+ ":5000";

const socket = io(url);

console.log("username: ",process.argv[2], " url: ", url);

socket.on('message', (data) => {
  console.log("message received", data);
});

socket.on('connect', (data) => {
  console.log("connected to server");
  socket.emit('user-connect', process.argv[2]);
});

function sendMessage(){
    socket.emit('message', "Salut! Je suis " + process.argv[2]);
}

let i = 0;
setInterval(() => {
  i++
  socket.emit('message', "Salut! Je suis " + process.argv[2] + i)
}, 5000 );
