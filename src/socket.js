const SocketIO = require('socket.io');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server);

    app.set('io', io);

    // socket.io middleware (save in session)
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', socket => {
        let userCount = 0;
        console.log('socket connected!');
        
        socket.on('join', ({ user, room }) => {
            socket.join(room);
            userCount++;
            socket.to(room).emit('userJoin', `${user} 님이 입장하였습니다.`);
        });

        socket.on('message', ({ user, room }) => {
            socket.to(room).emit('new message', user );
        });

        socket.on('disconnect', ({ room }) => {
            console.log('socket disconnected');
            socket.leave(room);
            userCount--;

            if (userCount === 0) {
                axios.delete(`/room/${id}`);
            } else {
                socket.to(room).emit('exit', `${user} 님이 퇴장하였습니다.`);
            }
        });
    });
}