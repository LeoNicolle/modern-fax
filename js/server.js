const fs = require("fs");
const io = require('socket.io')();
const users = [
];
const allMessages = [];

function init(){
    console.log("init");
    fs.readFile("./data.json", (err, data) => {
      users.push(...JSON.parse(data));
      console.log(" read database: ", users);
      io.listen(5000);
      setInterval(save, 10000);
    });
}
function save(){
    fs.writeFile("./data.json", JSON.stringify(users.map(({name, missedMessages}) => ({
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

  socket.on('message', (data) => {
    console.log(`received message ${data}`);
    if(!currentUser) {
      console.warn("no user on message", data);
      return;

    };
    const otherUsers= users.filter(otherUser => currentUser !== otherUser);
    otherUsers.forEach(user => {
      if(!user.socket){
        console.log(`---miss ${user.name}`);
        user.missedMessages.push(data);
      }else{
        console.log(`---send ${user.name}`);
        user.socket.emit("message", data);
      }
    });
  });
});

init();
