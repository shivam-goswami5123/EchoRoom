const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

// Define the stored password
const PASSWORD = 'mySecurePassword';

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log(`A user is attempting to connect (socket ID: ${socket.id})...`);
    let authenticated = false;

    // Handle authentication
    const authenticateUser = (password) => {
        if (password === PASSWORD) {
            authenticated = true;
            console.log(`User authenticated successfully (socket ID: ${socket.id}).`);
            socket.emit('authenticated', { success: true });
        } else {
            console.log(`Authentication failed (socket ID: ${socket.id}).`);
            socket.emit('authenticated', { success: false, message: 'Wrong password. Please try again.' });
        }
    };

    // Listen for authentication events
    socket.on('authenticate', (password) => {
        authenticateUser(password);
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        if (authenticated) {
            console.log(`Message received from socket ID ${socket.id}: ${msg}`);
            io.emit('chat message', msg);
        } else {
            console.log(`Unauthorized message attempt from socket ID: ${socket.id}`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected (socket ID: ${socket.id}).`);
        authenticated = false; // Reset authentication when the user disconnects
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
