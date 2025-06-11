// quickmark-auth-backend/server.js
const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse JSON request bodies
const cors = require('cors'); // Middleware to handle Cross-Origin Resource Sharing
require('dotenv').config(); // Load environment variables from .env file

// --- Import Routes ---
// Import your authentication routes
const authRoutes = require('./routes/auth');


// --- Initialize Express App ---
const app = express();
// Define the port for your server (from .env or default to 3000)
const PORT = process.env.PORT || 3700;

// --- Middleware Setup ---
// Use body-parser to parse JSON formatted request bodies
app.use(bodyParser.json());
// Enable CORS for all origins during development.
// In a production environment, you should configure CORS to allow only specific origins:
// app.use(cors({ origin: 'http://your-frontend-domain.com' }));
app.use(cors());

// --- API Route Mounting ---
// Mount the authentication routes under the /api/auth path.
// All routes defined in auth.js will now be accessible via /api/auth/...
app.use('/api/auth', authRoutes);

// --- Basic Health Check Route ---
// A simple GET request to the root URL to confirm the API is running
app.get('/', (req, res) => {
    res.send('QuickMark Auth Backend API is running successfully!');
});

// --- Start the Server ---
// Make the Express app listen for incoming HTTP requests on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access API at: http://localhost:${PORT}`);
});