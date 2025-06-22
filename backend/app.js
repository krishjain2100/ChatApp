const express = require('express');
const cors = require('cors');

const server = express();
const authRoutes = require('./routes/auth');
const users = require('./users');

server.use(cors({origin: 'http://localhost:3001'}));

server.use(express.json());
server.use('/auth', authRoutes);



server.get('/users', (req, res) => {
  res.send(users);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

