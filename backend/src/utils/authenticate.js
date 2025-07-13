const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // express converts the header keys to lowercase
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // decoded contains the payload set during jwt.sign + the iat (issued at) timestamp
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;