import { Server } from 'socket.io';
const io = new Server(8000, {
    cors:{
        origin: '*',
    }
});

// import { Server } from 'socket.io';
// import { createServer } from 'http';

// const httpServer = createServer();
// const io = new Server(httpServer, {
//     cors:{
//         origin: '*',
//     }
// });

const users = {};

io.on('connection', socket => {
    // If any new user joins, let others users connected to the server know.
    socket.on('new-user-joined', name => {
        // console.log("New user", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people.
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // If someone leaves the chat, let other people know.
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

// httpServer.listen(3001, ()=> {
//     console.log('listening on port 8000')
// })