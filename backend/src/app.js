const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const User = require('./models/users.model');
const handleSocketConnection = require('./socket/socketHandler');

require('dotenv').config();

const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

handleSocketConnection(io);

server.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:3001'}));
server.use(express.json());
server.use('/auth', authRoutes);
server.use('/message', messageRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}...`);
});


server.get('/users', async (req, res) => {
  try {
      const users = await User.find({});
      res.status(200).json(users);
  }
  catch (error) {
      return res.status(500).json({error: error.message});
  }
});
