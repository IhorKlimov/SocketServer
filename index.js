const { log } = require('node:console');
const { createServer } = require('node:http');
const { Server } = require("socket.io");


const httpServer = createServer();
const sockserver = new Server(httpServer, {});

const connections = new Set();
sockserver.on('connection', (ws) => {
    console.log('New client connected! ' + ws.id);
    connections.add(ws)
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(message);
        connections.forEach((client) => {
            if (client.id !== ws.id) {
                client.send(JSON.stringify(message));
                console.log("sending message");
            }
        })
    });

    ws.on('close', () => {
        connections.delete(ws);
        console.log('Client has disconnected!');
    });
});

httpServer.listen(443);