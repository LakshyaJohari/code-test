// // // backend/routes/adminRoutes.js

// // const express = require('express');
// // const {
// //     registerAdmin, loginAdmin,
// //     getDepartments, createDepartment, updateDepartment, deleteDepartment,
// //     getFaculties, createFaculty, updateFaculty, deleteFaculty,
// //     getStudents, createStudent, updateStudent, deleteStudent,
// //     getSubjects, createSubject, updateSubject, deleteSubject,
// //     getAttendanceThreshold, updateAttendanceThreshold, backupData, printAttendanceSheet,
// //     getDashboardStats,
// //     getLowAttendanceDefaulters // IMPORT THE NEW CONTROLLER FUNCTION
// // } = require('../controllers/adminController');
// // const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// // const router = express.Router();

// // // Admin Authentication (Public)
// // router.post('/auth/register', registerAdmin);
// // router.post('/auth/login', loginAdmin);

// // // Department Management (Admin-only)
// // router.get('/departments', adminAuthMiddleware, getDepartments);
// // router.post('/departments', adminAuthMiddleware, createDepartment);
// // router.put('/departments/:department_id', adminAuthMiddleware, updateDepartment);
// // router.delete('/departments/:department_id', adminAuthMiddleware, deleteDepartment);

// // // Faculty Management (Admin-only)
// // router.get('/faculties', adminAuthMiddleware, getFaculties);
// // router.post('/faculties', adminAuthMiddleware, createFaculty);
// // router.put('/faculties/:faculty_id', adminAuthMiddleware, updateFaculty);
// // router.delete('/faculties/:faculty_id', adminAuthMiddleware, deleteFaculty);

// // // Student Management (Admin-only)
// // router.get('/students', adminAuthMiddleware, getStudents);
// // router.post('/students', adminAuthMiddleware, createStudent);
// // router.put('/students/:student_id', adminAuthMiddleware, updateStudent);
// // router.delete('/students/:student_id', adminAuthMiddleware, deleteStudent);

// // // Subject Management (Admin-only)
// // router.get('/subjects', adminAuthMiddleware, getSubjects);
// // router.post('/subjects', adminAuthMiddleware, createSubject);
// // router.put('/subjects/:subject_id', adminAuthMiddleware, updateSubject);
// // router.delete('/subjects/:subject_id', adminAuthMiddleware, deleteSubject);

// // // APP SETTINGS, BACKUP, ATTENDANCE SHEET (Admin-only)
// // router.get('/settings/attendance-threshold', adminAuthMiddleware, getAttendanceThreshold);
// // router.put('/settings/attendance-threshold', adminAuthMiddleware, updateAttendanceThreshold);
// // router.get('/backup', adminAuthMiddleware, backupData);
// // router.get('/attendance-sheet', adminAuthMiddleware, printAttendanceSheet);

// // // NEW: Defaulters List (Admin-only)
// // router.get('/defaulters', adminAuthMiddleware, getLowAttendanceDefaulters); // Route for fetching defaulters

// // router.get('/dashboard-stats', adminAuthMiddleware, getDashboardStats);

// // module.exports = router;

// // backend/routes/adminRoutes.js

// const express = require('express');
// const {
//     registerAdmin, loginAdmin, // Admin Auth
//     getDepartments, createDepartment, updateDepartment, deleteDepartment, // Departments
//     getFaculties, createFaculty, updateFaculty, deleteFaculty, // Faculties
//     getStudents, createStudent, updateStudent, deleteStudent, // Students
//     getSubjects, createSubject, updateSubject, deleteSubject, // Subjects
//     getAttendanceThreshold, updateAttendanceThreshold, backupData, printAttendanceSheet, // Settings/Utils
//     getDashboardStats,
//     getLowAttendanceDefaulters // Defaulters
// } = require('../controllers/adminController'); // Import ALL admin controller functions

// const adminAuthMiddleware = require('../middleware/adminAuthMiddleware'); // Your admin authentication middleware

// const router = express.Router();

// // --- Admin Authentication (These routes are PUBLIC, no middleware needed for login/register) ---
// router.post('/auth/register', registerAdmin);
// router.post('/auth/login', loginAdmin); // This route will handle /api/admin/auth/login

// // --- Protected Admin Routes (Require adminAuthMiddleware) ---

// // Department Management
// router.get('/departments', adminAuthMiddleware, getDepartments);
// router.post('/departments', adminAuthMiddleware, createDepartment);
// router.put('/departments/:department_id', adminAuthMiddleware, updateDepartment);
// router.delete('/departments/:department_id', adminAuthMiddleware, deleteDepartment);

// // Faculty Management
// router.get('/faculties', adminAuthMiddleware, getFaculties);
// router.post('/faculties', adminAuthMiddleware, createFaculty);
// router.put('/faculties/:faculty_id', adminAuthMiddleware, updateFaculty);
// router.delete('/faculties/:faculty_id', adminAuthMiddleware, deleteFaculty);

// // Student Management
// router.get('/students', adminAuthMiddleware, getStudents);
// router.post('/students', adminAuthMiddleware, createStudent);
// router.put('/students/:student_id', adminAuthMiddleware, updateStudent);
// router.delete('/students/:student_id', adminAuthMiddleware, deleteStudent);

// // Subject Management
// router.get('/subjects', adminAuthMiddleware, getSubjects);
// router.post('/subjects', adminAuthMiddleware, createSubject);
// router.put('/subjects/:subject_id', adminAuthMiddleware, updateSubject);
// router.delete('/subjects/:subject_id', adminAuthMiddleware, deleteSubject);

// // APP SETTINGS, BACKUP, ATTENDANCE SHEET
// router.get('/settings/attendance-threshold', adminAuthMiddleware, getAttendanceThreshold);
// router.put('/settings/attendance-threshold', adminAuthMiddleware, updateAttendanceThreshold);
// router.get('/backup', adminAuthMiddleware, backupData);
// router.get('/attendance-sheet', adminAuthMiddleware, printAttendanceSheet);

// // Dashboard Stats
// router.get('/dashboard-stats', adminAuthMiddleware, getDashboardStats);

// // Defaulters List
// router.get('/defaulters', adminAuthMiddleware, getLowAttendanceDefaulters);

// module.exports = router;

const express = require('express');
const {
    registerAdmin, loginAdmin,
    getDepartments, createDepartment, updateDepartment, deleteDepartment,
    getFaculties, createFaculty, updateFaculty, deleteFaculty,
    getStudents, createStudent, updateStudent, deleteStudent,
    getSubjects, createSubject, updateSubject, deleteSubject, // getSubjects now handles pagination
    getAttendanceThreshold, updateAttendanceThreshold, backupData, printAttendanceSheet,
    getDashboardStats
} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

const router = express.Router();

// Admin Authentication (Public)
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);

// Dashboard Stats
router.get('/dashboard-stats', adminAuthMiddleware, getDashboardStats);

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

// Subject Management (Admin-only) - getSubjects now supports pagination via query params
router.get('/subjects', adminAuthMiddleware, getSubjects); // Expects ?page=X&limit=Y
router.post('/subjects', adminAuthMiddleware, createSubject);
router.put('/subjects/:subject_id', adminAuthMiddleware, updateSubject);
router.delete('/subjects/:subject_id', adminAuthMiddleware, deleteSubject);

// App Settings, Backup, Attendance Sheet (Admin-only)
router.get('/settings/attendance-threshold', adminAuthMiddleware, getAttendanceThreshold);
router.put('/settings/attendance-threshold', adminAuthMiddleware, updateAttendanceThreshold);
router.get('/backup', adminAuthMiddleware, backupData);
router.get('/attendance-sheet', adminAuthMiddleware, printAttendanceSheet);

module.exports = router;