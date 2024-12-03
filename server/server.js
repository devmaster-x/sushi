// server.js (Backend - Node.js/Express)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // CORS to allow cross-origin requests

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

let leaderboard = []; // List to store leaderboard data

// Route for adding a new user
app.post('/new-user', (req, res) => {
  const { address, vip, score } = req.body;
  
  // Check if user already exists
  const existingPlayer = leaderboard.find(player => player.address === address);
  
  if (!existingPlayer) {
    leaderboard.push({ address, vip, score });
  }
  
  res.status(200).send({ message: 'User added successfully!' });
});

// Route to fetch current leaderboard
app.get('/leaderboard', (req, res) => {
  res.status(200).json(leaderboard.sort((a, b) => b.score - a.score));
});

// Socket events
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle score update from client
  socket.on('score-update', (data) => {
    const { address, score } = data;
    
    const existingPlayer = leaderboard.find(player => player.address === address);
    
    if (existingPlayer) {
      existingPlayer.score = score;
    } else {
      leaderboard.push({ address, score });
    }

    // Broadcast leaderboard to all clients
    io.emit('leaderboard-update', leaderboard);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
