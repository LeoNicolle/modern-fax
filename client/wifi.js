const wifi = require('node-wifi');
const readline = require('readline');

function init(){
  wifi.init({
    iface : null,
  });
    return tryToConnect();
}

function tryToConnect(){
  return amIConnected()
  .then(connected => {
    if(connected) return true;
    else return showConnections();
  })
}

function askForUser(question){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function showConnections(){
  let networkNames;
  let networkName;

  wifi.scan()
  .then(networks => {
    networkNames = networks
    .filter(network => network.ssid.length)
    .map((network) => network.ssid)
    console.log(networkNames);
    return askForUser("Enter the number of the network you want to connect\n\n")
  })
  .then(number => {
    networkName = networkNames[number];
    if(!networkName){
        throw new Error("Network Number not in range")
        return showConnections();
    }
    return askForUser(`Try to connect to ${networkName}. Password ? `);
  })
  .then(password =>   wifi.connect({ ssid : networkName, password }))
  .then(() => amIConnected())
  .then(connected => {
    if(connected){
      console.log('Connected');
      return true;
    }
    throw new Error("Not connected, wrong password ?");
  })
  .catch(error => {
      console.log("Error on connection");
      return showConnections();
  });
}

function amIConnected(){
    return wifi.getCurrentConnections()
    .then(currentConnections => {
      return currentConnections.length;
    });
}

module.exports = {
  init
};
