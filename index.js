const express=require('express');
const {createServer}=require('node:http');
const {join}=require('node:path');
const { Server } = require('socket.io');

const app=express();
const server=createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});


app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
});

//Socket IO Connection
io.on('connection',(socket)=>{
    console.log('User Connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000,()=>{console.log('Server is running on port 3000')});

