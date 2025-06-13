// Defines API routes for faculty-specific operations (profile, subjects list).
const express = require('express');
const { getMyProfile, updateMyProfile, changeMyPassword } = require('../controllers/facultyController');
const { getFacultySubjects } = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

const router = express.Router();

router.get('/me', authMiddleware, getMyProfile); // Get authenticated faculty's profile
router.put('/me', authMiddleware, updateMyProfile); // Update authenticated faculty's profile
router.put('/me/password', authMiddleware, changeMyPassword); // Change authenticated faculty's password
router.get('/me/subjects', authMiddleware, getFacultySubjects); // Get subjects assigned to authenticated faculty

module.exports = router;