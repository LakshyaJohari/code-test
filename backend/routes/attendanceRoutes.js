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
