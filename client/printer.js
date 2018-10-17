const fs = require("fs");
const path = "/dev/usb/lp0";


function _tryToWrite(text){
	return new Promise((resolve, reject) => {
	    fs.writeFile(path, text, function(err) {
	        if (err) {
	        	console.log("did not manage to write");
	        	reject(err);
	        }
	        else {
	        	console.log("write successfull");
	        	resolve();
	        }
	    });
	});
}

function write(text){
	return _tryToWrite(text)
	.catch(error => {
		return new Promise((resolve, reject) => {
       		console.log("timeout....");
			setTimeout(resolve(), 500)
		}).then(() =>{ 
       		console.log("Retry");
			_tryToWrite(text)
		});
	});

}

function writeMessage(data){
	const {date, message} = JSON.parse(data);
	const dash = "\n ------------------------------\n";
	const lines = "\n \n \n ";
	const text = `${dash} ${date} ${dash} ${message} ${lines}`;

	return _tryToWrite(text)
	.catch(error => {
		return new Promise((resolve, reject) => {
       		console.log("timeout....");
			setTimeout(resolve(), 500)
		}).then(() =>{ 
       		console.log("Retry");
			_tryToWrite(text)
		});
	});

}



module.exports = {
	write,
	writeMessage,


};