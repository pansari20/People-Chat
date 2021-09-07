const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { userJoin, getCurrentUser, userLeave, getRoomUsers, formatMessages } = require('./functions')
// const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, './Public')));

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessages('Joined', `Welcome to ${user.room} Room!`));

        socket.broadcast.to(user.room).emit('message', formatMessages(user.username, `${user.username} has joined the Chat!`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessages(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessages(user.username, `${user.username} has left the Chat!`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});