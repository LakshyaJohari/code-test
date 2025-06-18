// backend/routes/facultyRoutes.js

const express = require('express');
// Import loginFaculty along with other controller functions
const { getMyProfile, updateMyProfile, changeMyPassword, loginFaculty } = require('../controllers/facultyController');
const { getFacultySubjects } = require('../controllers/subjectController'); // Assuming this exists
const authMiddleware = require('../middleware/authMiddleware'); // Your faculty-specific auth middleware

const router = express.Router();

// PUBLIC ROUTE: Faculty Login (does NOT use authMiddleware)
router.post('/login', loginFaculty);

// PROTECTED ROUTES: These require a valid token via authMiddleware
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.put('/me/password', authMiddleware, changeMyPassword);
router.get('/me/subjects', authMiddleware, getFacultySubjects); // Assuming this route is for faculty's subjects

module.exports = router;