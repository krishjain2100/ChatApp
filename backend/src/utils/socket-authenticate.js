const jwt = require('jsonwebtoken');

const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Socket authentication error:', err);
            return next(new Error('Authentication error'));
        }
        socket.userId = decoded.id;
        next();
    });
};

module.exports = authenticateSocket;