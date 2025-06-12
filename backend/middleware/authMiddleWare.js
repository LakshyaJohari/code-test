// Middleware to authenticate requests using JWT.
const { verifyToken } = require('../config/jwt'); // Import JWT verification utility

const authMiddleware = (req, res, next) => {
    // Get token from 'Authorization' header (e.g., 'Bearer TOKEN')
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract token part
    if (!token) {
        return res.status(401).json({ message: 'Token format is incorrect' });
    }

    try {
        const decoded = verifyToken(token); // Verify and decode the token
        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.user = decoded; // Attach decoded user info (id, email) to request object
        next(); // Proceed to the next route handler or middleware
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
};

module.exports = authMiddleware;