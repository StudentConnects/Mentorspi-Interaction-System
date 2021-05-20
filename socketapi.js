var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', (socket)=>{
    // console.log('A user connected');
    console.log('New WebSocket connection')

    socket.emit('Connect',"Welcone!")
    socket.broadcast.emit('Connect',"New User Joined !")
    
    socket.on('sentmgs', (data) => {
       
        io.emit('Connect', data)
    })
    socket.on('disconnect',()=>{
        io.emit('Connect',"User Left")
    })
});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;