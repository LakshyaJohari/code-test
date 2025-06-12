// quickmark-auth-backend/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Middleware to authenticate JWT tokens from the Authorization header
const authenticateToken = (req, res, next) => {
    // Get the Authorization header from the request (e.g., "Bearer YOUR_TOKEN_HERE")
    const authHeader = req.headers['authorization'];
    // Extract the token part (the second part after "Bearer ")
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // If no token is provided, the request is unauthorized
        return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify the token using the JWT_SECRET from your .env file
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // If verification fails (e.g., token is invalid or expired)
            console.error('JWT verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' }); // Forbidden
        }
        // If verification is successful, attach the decoded user payload to the request object
        // This makes user information (like id, email, role) available to subsequent route handlers
        req.user = user;
        // Proceed to the next middleware or route handler in the chain
        next();
    });
};

// Middleware to authorize users based on their role
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        // This middleware assumes that 'authenticateToken' has already run
        // and attached the user object to req.user.
        if (!req.user || !req.user.role) {
            // If user object or role is missing, deny access
            return res.status(403).json({ message: 'Access denied: User role not found' });
        }
        // Check if the user's role is included in the array of allowed roles
        if (!roles.includes(req.user.role)) {
            // If the user's role is not allowed, deny access
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
        // If the user has the required role, proceed to the next middleware or route handler
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };