// const express = require('express');
// const {
//     loginStudent,
//     getMyStudentProfile,
//     markAttendanceByLoggedInStudent,
//     getMyAttendanceCalendar
// } = require('../controllers/studentController');
// const studentAuthMiddleware = require('../middleware/studentAuthMiddleware'); // Student-specific auth middleware

// const router = express.Router();

// // Student Authentication (Public)
// router.post('/auth/login', loginStudent); // Student login

// // Student Protected Routes
// router.get('/me', studentAuthMiddleware, getMyStudentProfile); // Get logged-in student's profile
// router.post('/attendance/mark', studentAuthMiddleware, markAttendanceByLoggedInStudent); // Mark attendance (protected)
// router.get('/attendance/calendar', studentAuthMiddleware, getMyAttendanceCalendar); // Get student's own attendance calendar

// module.exports = router;

const express = require('express');
const {
    loginStudent,
    getMyStudentProfile,
    markAttendanceByLoggedInStudent,
    getStudentCalendar
} = require('../controllers/studentController');
const studentAuthMiddleware = require('../middleware/studentAuthMiddleware');

const router = express.Router();

// Student Authentication (Public) - this is the dedicated student login endpoint
router.post('/auth/login', loginStudent);

// Student Protected Routes (require student token)
router.get('/me', studentAuthMiddleware, getMyStudentProfile);
router.post('/attendance/mark', studentAuthMiddleware, markAttendanceByLoggedInStudent);
router.get('/:student_id/attendance/calendar', studentAuthMiddleware, getStudentCalendar); // Route for calendar

module.exports = router;