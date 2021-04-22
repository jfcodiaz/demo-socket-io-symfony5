const app = require('express')();
const http = require('http').createServer(app);
const sockertIo = require('socket.io');

const io = sockertIo(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    console.log("Alguien se conecto");
    socket.emit('newClient', {
        message: "Hola Mundo"
    });

    socket.on('joinUser', data => {
        console.log(data)
        io.sockets.emit('newUser', {
            "message" : `<b>${data.nickname}</b> ha entrado al chat, Welcome`            
        })
    });

    socket.on('sendMessage', data => {
        io.sockets.emit('newMessage', data);
    });

    socket.on('awesome-proccess', function (data) {
        console.log(data);
        io.sockets.emit('notifications', data);        
     });
})



app.get('/', (req, res) => {
    return res.status(200).send("SocketIO");
})
http.listen(3000, () => {
    console.log("Server started port 3000")
})