const express = require("express")
const app = express()
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io")
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});
const port = process.env.PORT || 8080;
const CHAT_MESSAGE = "chat message"

io.on('connection', (socket) => {
	console.log(`${socket.id} connected!`);
	//here can start emitting events to the client
	socket.on(CHAT_MESSAGE, (ID, msg) => {
		console.log(`client ${ID} just wrote a message: ${msg}`);
		socket.broadcast.emit(CHAT_MESSAGE, msg);
	});
	socket.on("disconnect", () => {
		console.log("User disconnected.");
	})
})

httpServer.listen(port, () => {
	console.log('index.js - listening on port: ', port);
});

// io.listen(port);