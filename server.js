require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Set up socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());

// Store connected users
const users = {};

// Handle socket events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle setting the username
  socket.on('set_username', (username) => {
    users[socket.id] = username;
    console.log(`${username} connected with ID: ${socket.id}`);
  });

  // Handle sending and broadcasting messages
  socket.on('send_message', (data) => {
    const sender = users[socket.id] || 'Anonymous';
    const message = { user: sender, message: data.message };
    console.log(`Message from ${sender}: ${data.message}`);
    io.emit('receive_message', message); // Broadcast message to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    console.log(`${username || 'User'} disconnected`);
  });
});


// server testing 
app.get("/about", (req,res) => {
   res.status(200).send("About Page")
})

app.use(express.static('public')); // Serve files from the "public" folder


// Start the server
// const PORT = 3001;
// server.listen(PORT,'0.0.0.0' ,() => {
//   console.log(`Server running on http://127.0.0.1:${PORT}`);
// });


const PORT = process.env.PORT || 10000 ;
server.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});
