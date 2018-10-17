const io = require('socket.io-client');
const url = "http://"+(process.argv[3] === "localhost"
    ? process.argv[3]: "51.75.28.38")+ ":5000";

const printer = require("./printer")


function getDate () {
    const options = { 
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: "numeric",
      minute: "numeric"
    };
    
    const date = new Date();
    return date.toLocaleDateString('en-EN', options);
}
function init(){
  const socket = io(url);
  console.log("username: ",process.argv[2], " url: ", url);

  function sendMessage(text = "\n"){
      const message = {
        date: getDate(),
        message: text,
      }
      socket.emit('message', JSON.stringify(message));
  }



  socket.on('message', (data) => {
    console.log("message received", data);

    if(process.argv[3] !=="debug"){
      printer.writeMessage(data).then(() => printer.write("\n"));
    }

  });

  socket.on('connect', (data) => {
    console.log("connected to server");
    socket.emit('user-connect', process.argv[2]);
  });

  let i = 0;
  setInterval(() => {
    i++;
    sendMessage("Salut! Je suis " + process.argv[2] + i);
  }, 5000 );
}

module.exports = {
  init,
};
