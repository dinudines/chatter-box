const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const router = require('./routes/index');
const { joinUser, removeUser, getAllUsers} = require('./helpers/users');

const app = express();

app.use(express.static(__dirname + '/client/public'));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('newUser', (name) => {
        const user = joinUser(socket.id, name);
        const activeUsers = getAllUsers();
        io.emit("activeUsers", activeUsers);
    });

    socket.on('message', ({ currentUserId, to, message }) => {
        io.to(to).to(currentUserId).emit('message', {id: currentUserId, message, type: "received-message"});
    });

    socket.on('disconnect', () => {
        const activeUsers = removeUser(socket.id);
        io.emit("activeUsers", activeUsers);
        io.emit("removeChatBox", socket.id);
    });
});

app.use('/', router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`);
});