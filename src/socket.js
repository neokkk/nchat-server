const SocketIO = require('socket.io'),
      axios = require('axios');

      const { Room } = require('./models');

let userCount = 0;

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server);

    app.set('io', io);

    // socket.io middleware (save in session)
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', socket => {
        console.log('socket connected!');
        
        socket.on('join', ({ user, room }) => {
            socket.myRoom = room;
            socket.currentUser = user;
            socket.join(room);
            userCount++;
            console.log('userCount : ', userCount);
            socket.to(room).emit('userJoin', `${user} 님이 입장하였습니다.`);
            io.emit('userCountChanged', { userCount, roomId: socket.myRoom });
        });

        socket.on('message', ({ user, room }) => {
            console.log('on message')
            console.log(user);
            console.log(room);
            socket.to(room).emit('new message', user );
        });

        socket.on('leave', () => {
            console.log('leave')
            leave();
        })

        socket.on('disconnect', () => {
            console.log('socket disconnected');
            leave();
            console.log('userCount: ', userCount)
        });

        function leave() {
            if (!socket.currentUser) return;
            socket.leave(socket.myRoom);
            userCount--;
 
            if (userCount === 0) {
                try {
                    Room.destroy({ where: { id: socket.myRoom } });
                } catch (err) {
                    console.error(err);
                    next(err);
                }
            } else {
                socket.to(socket.myRoom).emit('exit', `${socket.currentUser} 님이 퇴장하였습니다.`);
            }

            socket.currentUser = null;
            io.emit('userCountChanged', { userCount, roomId: socket.myRoom });
        }
    });
}