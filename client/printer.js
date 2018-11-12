const fs = require("fs");
const path = "/dev/usb/lp0";


function _tryToWrite(text){
	return new Promise((resolve, reject) => {
		try{
		    fs.writeFile(path, text, function(err) {
		        if (err) {
		        	console.log("did not manage to write");
		        	reject("ICI" + err);
		        }
		        else {
		        	console.log("write successfull");
		        	resolve();
		        }
		    });
		}catch(error){
		    reject(error);
		}
	});
}

function write(text, options){
	const chunkLength= 10;
	const nb = Math.ceil(text.length /chunkLength);

	console.log("ici",  nb);

	const chunks = new Array(nb)
	.fill(1)
	.map((e,i) => {
		const chunk = text.slice(i * chunkLength, (i+1) * chunkLength)
		return new Promise((resolve, reject) => {
      console.log("timeout....");
			setTimeout(() => resolve(), (i+1)*1000)
		}).then(() =>{
			_writeOrWait(chunk, options)
		})
	})

	return Promise.all(chunks);
}

function _writeOrWait(text, {spaced = false} = {}){

	const textToWrite = spaced
		? `${text} \n \n \n`
		: text;

	return _tryToWrite(textToWrite)
	.then (()  => console.log("OK"+ text))
	.catch(error => {
		return new Promise((resolve, reject) => {
       		console.log("timeout....");
			setTimeout(() => resolve(), 1000)
		}).then(() =>{
       		console.log("Retry");
			_writeOrWait(textToWrite)
		});
	});
}


function writeMessage(data){
	const {date, message} = JSON.parse(data);
	const dash = "\n ------------------------------\n";
	const lines = "\n \n \n ";
	const text = `${dash} ${date} ${dash} ${message} ${lines}`;
	return write(text)
	.catch(error => {
		return new Promise((resolve, reject) => {
       		console.log("timeout....");
			setTimeout(resolve(), 500)
		}).then(() =>{
       		console.log("Retry");
			write(text)
		});
	});

}



module.exports = {
	write,
	writeMessage,
};
