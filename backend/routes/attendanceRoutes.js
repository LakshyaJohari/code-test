// // Defines API routes for attendance management.
// const express = require('express');
// const { startAttendanceSession, endAttendanceSession, markStudentAttendance, getStudentCalendarAttendance } = require('../controllers/attendanceController');
// const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// const router = express.Router();

// const { requireAdminOrFaculty } = require('../middleware/authMiddleware');
// router.post('/student/:studentId/attendance/override', requireAdminOrFaculty, overrideAttendance);

// router.post('/start', authMiddleware, startAttendanceSession); // Start a new attendance session
// router.post('/:session_id/end', authMiddleware, endAttendanceSession); // End an attendance session
// router.get('/subjects/:subject_id/students/:student_id/calendar', authMiddleware, getStudentCalendarAttendance); // Get attendance data for student calendar view

// module.exports = router;

// Defines API routes for attendance management
const express = require('express');
const router = express.Router();

const {
    startAttendanceSession,
    endAttendanceSession,
    markStudentAttendance,
    getStudentCalendarAttendance,
    overrideAttendance
} = require('../controllers/attendanceController');

const { authMiddleware, requireAdminOrFaculty } = require('../middleware/authMiddleware');

// Protect routes using appropriate middleware

// Override attendance – only Admin or Faculty can do this
router.post('/student/:studentId/attendance/override', authMiddleware, requireAdminOrFaculty, overrideAttendance);

// Start a new attendance session (Admin or Faculty)
router.post('/start', authMiddleware, requireAdminOrFaculty, startAttendanceSession);

// End an attendance session (Admin or Faculty)
router.post('/:session_id/end', authMiddleware, requireAdminOrFaculty, endAttendanceSession);

// Get attendance data for student calendar view (Any logged-in user)
router.get('/subjects/:subject_id/students/:student_id/calendar', authMiddleware, getStudentCalendarAttendance);

module.exports = router;
