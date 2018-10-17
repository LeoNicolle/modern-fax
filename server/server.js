const fs = require("fs");
const io = require('socket.io')();
const users = [
];
const allMessages = [];
const path = "./data.json";

function init(){

    function startServer(){
      console.log("start server");
      io.listen(5000);
      setInterval(save, 10000);
    }

    fs.exists(path, (exists) => {
      if(exists) {
        fs.readFile(path, (err, data) => {
          console.log("read database....");
          users.push(...JSON.parse(data));
          startServer();
        });
      }else{
        console.log("no database found. Start from scratch");
        startServer();
      }
    });

}
function save(){
    fs.writeFile(path, JSON.stringify(users.map(({name, missedMessages}) => ({
      name, missedMessages
    }))), err => {if(err) throw err});
}

function createUser(name){
    const user =  {
      name,
      missedMessages: []
    };
    users.push(user);
    return user;
}

function  getUser(username){
  return  users.find(({name}) => name === username)
  || createUser(username);
}

io.on('connection', function(socket){
  console.log("connection")
  let currentUser;
  socket.on('user-connect', username => {
    console.log("user connect", username);
      currentUser = getUser(username);
      currentUser.socket = socket;
      console.log("send missed mesasges");
      currentUser.missedMessages.forEach(message => {
        socket.emit('message', message);
      });
      currentUser.missedMessages = [];
  });

  socket.on('disconnect', () => {
    if(!currentUser) {
      console.warn("no user on disconnect");
      return;
    }
    currentUser.socket = null;
    console.log(`user disconnect ${currentUser.name}`);
  });

  socket.on('message', (message) => {
    console.log(`received message ${message}`);
    if(!currentUser) {
      console.warn("no user on message", message);
      return;

    };
    // add message to message: 
    const data = {
      
    }

    const otherUsers= users.filter(otherUser => currentUser !== otherUser);
    otherUsers.forEach(user => {
      if(!user.socket){
        console.log(`---miss ${user.name}`);
        user.missedMessages.push(message);
      }else{
        console.log(`---send ${user.name}`);
        user.socket.emit("message", message);
      }
    });
  });
});

init();
