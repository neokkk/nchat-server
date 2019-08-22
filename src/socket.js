const SocketIO = require('socket.io');

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
        socket.on('initialUserCount', () => {
            io.emit('userCountChanged', { userCount, roomId: socket.myRoom });
        });
        
        // 채팅방 입장
        socket.on('join', ({ user, room }) => {
            socket.myRoom = room;
            socket.currentUser = user;
            socket.join(room);
            
            userCount++;

            socket.to(room).emit('userJoin', `${user} 님이 입장하였습니다.`);
            io.emit('userCountChanged', { userCount, roomId: socket.myRoom });
        });

        // 메세지 작성
        socket.on('message', ({ user, room }) => {
            socket.to(room.id).emit('new message', { user, room } );
        });

        // 채팅방 퇴장
        socket.on('leave', () => {
            leave();
        })

        socket.on('disconnect', () => {
            leave();
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