var wsLibrary = require('ws');
var WebSocketServer = wsLibrary.Server;
var myPort = 8080;
var wss = new WebSocketServer({ port: myPort });

var allSockets = [] ; 


wss.on('connection', function (browserSocket) {

	// add to the global array of all sockets
	allSockets.push (browserSocket);

	// blindly send the received message to all other sockets
	browserSocket.on('message', function (message) {
		for (var i=0 ; i<allSockets.length ; i++){
			if (allSockets[i]!==browserSocket){
				allSockets[i].send(message);
			}
		}
	});

	// if the socket closes, remove it from the global array
	browserSocket.on('close', function (message) {
		for (var i=0 ; i<allSockets.length ; i++){
			if (allSockets[i]===browserSocket){
				allSockets.splice(i,1); // remove this index from the array
				break; // leave the for loop
			}
		}
	});
});

console.log('started socket server on port '+myPort);