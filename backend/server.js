// // const express = require('express');
// // const dotenv = require('dotenv');
// // const pool = require('./config/db'); // Your database connection pool
// // const cors = require('cors');

// // dotenv.config(); // Load environment variables from .env file

// // const app = express();
// // const PORT = process.env.PORT || 3700;

// // // Middleware
// // app.use(express.json()); // For parsing application/json
// // app.use(cors());         // Enable CORS for all origins (adjust for production)

// // // Import Routes
// // const authRoutes = require('./routes/authRoutes');         // For faculty auth
// // const facultyRoutes = require('./routes/facultyRoutes');
// // const subjectRoutes = require('./routes/subjectRoutes');
// // const attendanceRoutes = require('./routes/attendanceRoutes');
// // const adminRoutes = require('./routes/adminRoutes');       // For ALL admin operations, including admin auth
// // const studentRoutes = require('./routes/studentRoutes');

// // // Use Routes - Ensure each main path maps to its correct router
// // app.use('/api/auth', authRoutes);           // Handles faculty login/register
// // app.use('/api/faculty', facultyRoutes);
// // app.use('/api/subjects', subjectRoutes);
// // app.use('/api/attendance', attendanceRoutes);
// // app.use('/api/admin', adminRoutes);         // Crucial: This mounts adminRoutes for /api/admin/*
// // app.use('/api/student', studentRoutes);

// // // Basic root route
// // app.get('/', (req, res) => {
// //     res.send('Welcome to the QuickMark API!');
// // });

// // app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// // });

// // const express = require('express');
// // const dotenv = require('dotenv');
// // const pool = require('./config/db'); // Your database connection pool
// // const cors = require('cors');

// // dotenv.config(); // Load environment variables from .env file

// // const app = express();
// // const PORT = process.env.PORT || 3700;

// // // Middleware
// // app.use(express.json()); // For parsing application/json
// // app.use(cors());         // Enable CORS for all origins (adjust for production)

// // // Import Routes
// // const adminRoutes = require('./routes/adminRoutes');
// // const studentRoutes = require('./routes/studentRoutes'); // Import student routes

// // // Use Routes - Ensure each main path maps to its correct router
// // app.use('/api/admin', adminRoutes);         // Admin operations (including Admin login)
// // app.use('/api/student', studentRoutes);     // Student operations (including Student login and calendar)

// // // Basic root route
// // app.get('/', (req, res) => {
// //     res.send('Welcome to the QuickMark API!');
// // });

// // // Database Connection Test (Optional, but good for startup)
// // pool.query('SELECT NOW()')
// //     .then(() => console.log('Successfully connected to PostgreSQL database!'))
// //     .catch(err => console.error('Error connecting to the database:', err));


// // // Start the server
// // app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// // });

// const express = require('express');
// const dotenv = require('dotenv');
// const pool = require('./config/db'); // Your database connection pool
// const cors = require('cors');

// dotenv.config(); // Load environment variables from .env file

// const app = express();
// const PORT = process.env.PORT || 3700;

// // Middleware
// app.use(express.json()); // For parsing application/json
// app.use(cors());         // Enable CORS for all origins (adjust for production)

// // Import Routes
// const authRoutes = require('./routes/authRoutes');         // For faculty auth
// const facultyRoutes = require('./routes/facultyRoutes');
// const subjectRoutes = require('./routes/subjectRoutes');
// const attendanceRoutes = require('./routes/attendanceRoutes');
// const adminRoutes = require('./routes/adminRoutes');       // For ALL admin operations, including admin auth
// const studentRoutes = require('./routes/studentRoutes');

// // Use Routes - Ensure each main path maps to its correct router
// app.use('/api/auth', authRoutes);           // Handles faculty login/register
// app.use('/api/faculty', facultyRoutes);
// app.use('/api/subjects', subjectRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/admin', adminRoutes);         // Crucial: This mounts adminRoutes for /api/admin/*
// app.use('/api/student', studentRoutes);

// // Basic root route
// app.get('/', (req, res) => {
//     res.send('Welcome to the QuickMark API!');
// });

// // Database Connection Test (Optional, but good for startup)
// pool.query('SELECT NOW()')
//     .then(() => console.log('Successfully connected to PostgreSQL database!'))
//     .catch(err => console.error('Error connecting to the database:', err));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({ message: 'Internal server error' });
// });

// // 404 handler for undefined routes
// app.use('*', (req, res) => {
//     res.status(404).json({ message: 'Route not found' });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3700;

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes'); // Import student routes

// Use Routes
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes); // Mount student routes

// Basic root route
app.get('/', (req, res) => {
    res.send('Welcome to the QuickMark API!');
});

// Database Connection Test
pool.query('SELECT NOW()')
    .then(() => console.log('Successfully connected to PostgreSQL database!'))
    .catch(err => console.error('Error connecting to the database:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});