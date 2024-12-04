const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

let leaderboard = []; // List to store leaderboard data

// Route for adding a new user or updating an existing user
app.post('/new-user', async (req, res) => {
  const { wallet, username, isVIP, top_score, current_score } = req.body;

  try {
    // Assuming you have a User model connected to a database
    let user = await User.findOne({ wallet });
    if (!user) {
      user = new User({
        wallet,
        username,
        isVIP,
        top_score,
        current_score
      });
    } else {
      user.username = username;
      user.isVIP = isVIP;
      user.current_score = current_score;
    }
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Route to fetch current leaderboard
app.get('/leaderboard', (req, res) => {
  res.status(200).json(leaderboard.sort((a, b) => b.score - a.score));
});

// Socket events
io.on('connection', (socket) => {
  console.log('User connected');

  // Send the current leaderboard to the connected user
  socket.emit('leaderboard-update', leaderboard);

  // Handle score update from the client
  socket.on('score-update', (data) => {
    console.log("score update: ",data );
    const { address, score, vip } = data;

    // Find the user in the leaderboard or add them
    const existingPlayer = leaderboard.find(player => player.address === address);
    if (existingPlayer) {
      existingPlayer.score = score;
      existingPlayer.vip = vip;
    } else {
      leaderboard.push({ address, score, vip });
    }

    // Sort the leaderboard by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Broadcast the updated leaderboard to all clients
    io.emit('leaderboard-update', leaderboard);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
