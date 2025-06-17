const express = require('express');
const {
    registerAdmin, loginAdmin,
    getDepartments, createDepartment, updateDepartment, deleteDepartment,
    getFaculties, createFaculty, updateFaculty, deleteFaculty,
    getStudents, createStudent, updateStudent, deleteStudent,
    getSubjects, createSubject, updateSubject, deleteSubject,
    // ADDED FOR SETTINGS/BACKUP/ATTENDANCE
    getAttendanceThreshold, updateAttendanceThreshold, backupData, printAttendanceSheet
} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// Admin Authentication (Public)
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);

// Department Management (Admin-only)
router.get('/departments', adminAuthMiddleware, getDepartments);
router.post('/departments', adminAuthMiddleware, createDepartment);
router.put('/departments/:department_id', adminAuthMiddleware, updateDepartment);
router.delete('/departments/:department_id', adminAuthMiddleware, deleteDepartment);

// Faculty Management (Admin-only)
router.get('/faculties', adminAuthMiddleware, getFaculties);
router.post('/faculties', adminAuthMiddleware, createFaculty);
router.put('/faculties/:faculty_id', adminAuthMiddleware, updateFaculty);
router.delete('/faculties/:faculty_id', adminAuthMiddleware, deleteFaculty);

// Student Management (Admin-only)
router.get('/students', adminAuthMiddleware, getStudents);
router.post('/students', adminAuthMiddleware, createStudent);
router.put('/students/:student_id', adminAuthMiddleware, updateStudent);
router.delete('/students/:student_id', adminAuthMiddleware, deleteStudent);

// Subject Management (Admin-only)
router.get('/subjects', adminAuthMiddleware, getSubjects);
router.post('/subjects', adminAuthMiddleware, createSubject);
router.put('/subjects/:subject_id', adminAuthMiddleware, updateSubject);
router.delete('/subjects/:subject_id', adminAuthMiddleware, deleteSubject);

// APP SETTINGS, BACKUP, ATTENDANCE SHEET (Admin-only)
router.get('/settings/attendance-threshold', adminAuthMiddleware, getAttendanceThreshold); // CORRECTED ROUTE
router.put('/settings/attendance-threshold', adminAuthMiddleware, updateAttendanceThreshold); // CORRECTED ROUTE
router.get('/backup', adminAuthMiddleware, backupData);
router.get('/attendance-sheet', adminAuthMiddleware, printAttendanceSheet);

router.get('/dashboard-stats', adminAuthMiddleware, getDashboardStats);

module.exports = router;