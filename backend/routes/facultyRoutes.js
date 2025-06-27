const express = require('express');
const { loginFaculty, getMyProfile, updateMyProfile, changeMyPassword } = require('../controllers/facultyController');
const { getFacultySubjects } = require('../models/facultyModel'); // Assuming getFacultySubjects is in facultyModel
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this EXACT casing matches your file!
const { requireFaculty } = require('../middleware/accessControlMiddleware'); // Import role middleware

const router = express.Router();

// PUBLIC ROUTE: Faculty Login
router.post('/login', loginFaculty);

// PROTECTED ROUTES: Require a valid token via authMiddleware
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.put('/me/password', authMiddleware, changeMyPassword);

// Faculty assigned subjects - requires faculty role check
router.get('/me/subjects', authMiddleware, requireFaculty, async (req, res) => {
    try {
        const subjects = await getFacultySubjects(req.user.id); // Use req.user.id from authMiddleware
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching faculty subjects:', error);
        res.status(500).json({ message: 'Failed to fetch faculty subjects.' });
    }
});

module.exports = router;