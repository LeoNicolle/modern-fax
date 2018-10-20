const wifi = require('node-wifi');
const readline = require('readline');
const printer = require('./printer');


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
    printer.write(question, {spaced: true});
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
    .map((network) => network.ssid);

    const text = networkNames
      .slice(0,5)
      .reduce((text, name, i) => `${text}${i}: ${name}\n`, "");
    printer.write(text, {spaced: true});
    return askForUser("Enter the number of the network you want to connect")
  })
  .then(number => {
    networkName = networkNames[number];
    if(!networkName){
        const text = "Network Number not in range";
        printer.write(text, {spaced: true});
        throw new Error(text)
        return showConnections();
    }
    return askForUser(`Try to connect to ${networkName}. Password ? `);
  })
  .then(password =>   wifi.connect({ ssid : networkName, password }))
  .then(() => amIConnected())
  .then(connected => {
    if(connected){
      const text = 'Connected';
      printer.write(text, {spaced: true});
      console.log(text);
      return true;
    }
    const text = "Not connected, wrong password ?";
    printer.write(text, {spaced: true});
    throw new Error(text);
  })
  .catch(error => {
      const text = "Error on connection";
      printer.write(text, {spaced: true});
      console.log(text);
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
