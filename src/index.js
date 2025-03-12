const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Active users store
const users = {};

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining
  socket.on('user_join', (username) => {
    console.log(`${username} joined with ID: ${socket.id}`);
    users[socket.id] = {
      id: socket.id,
      username: username,
      status: 'online'
    };
    
    // Broadcast updated user list to all clients
    io.emit('user_list', Object.values(users));
  });
  
  // Handle 1-to-1 private messages
  socket.on('private_message', (data) => {
    const { to, message } = data;
    
    // Send to recipient
    io.to(to).emit('private_message', {
      from: socket.id,
      message: message,
      username: users[socket.id].username
    });
    
    // Send back to sender for their chat history
    socket.emit('private_message_sent', {
      to: to,
      message: message,
      username: users[to]?.username || 'Unknown User'
    });
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    io.to(data.to).emit('typing', {
      from: socket.id,
      isTyping: data.isTyping,
      username: users[socket.id].username
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit('user_list', Object.values(users));
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});