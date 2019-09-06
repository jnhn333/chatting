
var io = require('socket.io').listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket){

    socket.emit('connection', {
        type : 'connected'
    });

    socket.on('connection', function(data) {

        if(data.type === 'join') {

            socket.join(data.room);

            // depracated
            // socket.set('room', data.room);
            socket.room = data.room;

            socket.emit('system', {
                message : 'welcome to chat room'
            });

            socket.broadcast.to(data.room).emit('system', {
                message : data.name+' is connected'
            });
        }

    });

    socket.on('user', function(data)  {

        // depracated
        // socket.get('room', (error, room) => {
        // });

        var room = socket.room;

        if(room) {
            socket.broadcast.to(room).emit('message', data);
        }
    });

});
