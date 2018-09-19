const io = require('socket.io-client');

const socket = io('http://localhost:5000');

console.log("process.argv[1]",process.argv[2]);

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
