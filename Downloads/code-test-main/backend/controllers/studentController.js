// // const studentModel = require('../models/studentModel');
// // const attendanceModel = require('../models/attendanceModel');
// // const { comparePassword, hashPassword } = require('../utils/passwordHasher');
// // const { generateToken } = require('../config/jwt');

// // // Student Login
// // const loginStudent = async (req, res) => {
// //     const { roll_number, password } = req.body;
// //     if (!roll_number || !password) {
// //         return res.status(400).json({ message: 'Roll number and password are required.' });
// //     }
// //     try {
// //         const student = await studentModel.findStudentByRollNumber(roll_number);
// //         if (!student) {
// //             return res.status(401).json({ message: 'Invalid credentials.' });
// //         }
// //         const isMatch = await comparePassword(password, student.password_hash);
// //         if (!isMatch) {
// //             return res.status(401).json({ message: 'Invalid credentials.' });
// //         }
// //         const token = generateToken({ id: student.student_id, roll_number: student.roll_number, isStudent: true });
// //         res.status(200).json({
// //             message: 'Logged in successfully!',
// //             student: {
// //                 id: student.student_id,
// //                 roll_number: student.roll_number,
// //                 name: student.name,
// //                 email: student.email
// //             },
// //             token
// //         });
// //     } catch (error) {
// //         console.error('Student login error:', error);
// //         res.status(500).json({ message: 'Internal server error during student login.' });
// //     }
// // };

// // // Student Profile
// // const getMyStudentProfile = async (req, res) => {
// //     const studentId = req.student.id;
// //     try {
// //         const student = await studentModel.findStudentByRollNumber(req.student.roll_number);
// //         if (!student || student.student_id !== studentId) {
// //             return res.status(404).json({ message: 'Student profile not found or mismatch.' });
// //         }
// //         res.status(200).json({
// //             id: student.student_id,
// //             roll_number: student.roll_number,
// //             name: student.name,
// //             email: student.email,
// //             department_id: student.department_id,
// //             current_year: student.current_year,
// //             section: student.section
// //         });
// //     } catch (error) {
// //         console.error('Error getting student profile:', error);
// //         res.status(500).json({ message: 'Internal server error getting student profile.' });
// //     }
// // };

// // // Student Marking Attendance (secure version)
// // const markAttendanceByLoggedInStudent = async (req, res) => {
// //     const studentId = req.student.id;
// //     const { session_code } = req.body;

// //     if (!session_code) {
// //         return res.status(400).json({ message: 'Session code is required.' });
// //     }

// //     try {
// //         const session = await attendanceModel.findOpenSessionByQrCode(session_code);
// //         if (!session) {
// //             return res.status(404).json({ message: 'Active attendance session not found with this code.' });
// //         }

// //         const isStudentEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, session.subject_id);
// //         if (!isStudentEnrolled) {
// //             return res.status(400).json({ message: 'You are not enrolled in this subject for this session.' });
// //         }

// //         const attendedAt = new Date().toISOString();
// //         const record = await attendanceModel.createOrUpdateAttendanceRecord(
// //             session.session_id,
// //             studentId,
// //             'present',
// //             attendedAt
// //         );

// //         res.status(200).json({
// //             message: 'Attendance marked successfully!',
// //             record: {
// //                 session_id: record.session_id,
// //                 student_id: record.student_id,
// //                 status: record.status,
// //                 attended_at: record.attended_at
// //             }
// //         });
// //     } catch (error) {
// //         console.error('Error marking attendance for logged-in student:', error.message);
// //         res.status(500).json({ message: 'Internal server error marking attendance.' });
// //     }
// // };

// // // Student View Own Attendance History (Calendar view)
// // const getMyAttendanceCalendar = async (req, res) => {
// //     const studentId = req.student.id;
// //     const { subject_id, month, year } = req.query;

// //     if (!subject_id || !month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
// //         return res.status(400).json({ message: 'Subject ID, Month, and Year are required query parameters.' });
// //     }

// //     const parsedMonth = parseInt(month);
// //     const parsedYear = parseInt(year);

// //     if (parsedMonth < 1 || parsedMonth > 12) {
// //         return res.status(400).json({ message: 'Month must be between 1 and 12.' });
// //     }
// //     if (parsedYear < 2000 || parsedYear > 2100) {
// //         return res.status(400).json({ message: 'Year must be a valid number (e.g., 2024).' });
// //     }

// //     try {
// //         const isEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, subject_id);
// //         if (!isEnrolled) {
// //             return res.status(403).json({ message: 'You are not enrolled in this subject.' });
// //         }

// //         // --- CRUCIAL FIX HERE: Ensure backticks (`) are used for template literals ---
// //         const formattedMonth = String(parsedMonth).padStart(2, '0');
// //         const startDate = `${parsedYear}-${formattedMonth}-01`; // Use BACKTICKS here
// //         const endDate = `${parsedYear}-${formattedMonth}-${new Date(parsedYear, parsedMonth, 0).getDate()}`; // Use BACKTICKS here

// //         const attendanceRecords = await attendanceModel.getStudentAttendanceBySubjectAndDateRange(
// //             studentId,
// //             subject_id,
// //             startDate,
// //             endDate
// //         );

// //         const formattedCalendarData = {};
// //         attendanceRecords.forEach(record => {
// //             const date = record.session_date.toISOString().split('T')[0];
// //             formattedCalendarData[date] = record.attendance_status;
// //         });

// //         res.status(200).json(formattedCalendarData);
// //     } catch (error) {
// //         console.error('Error getting student calendar attendance:', error.message);
// //         res.status(500).json({ message: 'Internal server error getting calendar attendance.' });
// //     }
// // };

// // module.exports = {
// //     loginStudent,
// //     getMyStudentProfile,
// //     markAttendanceByLoggedInStudent,
// //     getMyAttendanceCalendar
// // };

// const studentModel = require('../models/studentModel');
// const attendanceModel = require('../models/attendanceModel'); // Import the attendance model
// const { comparePassword } = require('../utils/passwordHasher'); // Import comparePassword
// const { generateToken } = require('../config/jwt'); // Import generateToken

// // Student Login
// const loginStudent = async (req, res) => {
//     const { roll_number, password } = req.body;
//     if (!roll_number || !password) {
//         return res.status(400).json({ message: 'Roll number and password are required.' });
//     }
//     try {
//         const student = await studentModel.findStudentByRollNumber(roll_number);
//         if (!student) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }
//         const isMatch = await comparePassword(password, student.password_hash);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }
//         // Ensure student_id and roll_number are in token payload
//         const token = generateToken({ id: student.student_id, roll_number: student.roll_number, isStudent: true });
//         res.status(200).json({
//             message: 'Logged in successfully!',
//             student: {
//                 id: student.student_id,
//                 roll_number: student.roll_number,
//                 name: student.name,
//                 email: student.email
//             },
//             token
//         });
//     } catch (error) {
//         console.error('Student login error:', error);
//         res.status(500).json({ message: 'Internal server error during student login.' });
//     }
// };

// // Student Profile (for logged-in student)
// const getMyStudentProfile = async (req, res) => {
//     const studentId = req.student.id; // Assuming student_id from token payload
//     try {
//         const student = await studentModel.findStudentByRollNumber(req.student.roll_number); // Find by roll_number from token
//         if (!student || student.student_id !== studentId) {
//             return res.status(404).json({ message: 'Student profile not found or mismatch.' });
//         }
//         res.status(200).json({
//             id: student.student_id,
//             roll_number: student.roll_number,
//             name: student.name,
//             email: student.email,
//             department_id: student.department_id,
//             current_year: student.current_year,
//             section: student.section
//         });
//     } catch (error) {
//         console.error('Error getting student profile:', error);
//         res.status(500).json({ message: 'Internal server error getting student profile.' });
//     }
// };

// // Student Marking Attendance (secure version)
// const markAttendanceByLoggedInStudent = async (req, res) => {
//     const studentId = req.student.id;
//     const { session_code } = req.body;

//     if (!session_code) {
//         return res.status(400).json({ message: 'Session code is required.' });
//     }

//     try {
//         const session = await attendanceModel.findOpenSessionByQrCode(session_code);
//         if (!session) {
//             return res.status(404).json({ message: 'Active attendance session not found with this code.' });
//         }

//         const isStudentEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, session.subject_id);
//         if (!isStudentEnrolled) {
//             return res.status(400).json({ message: 'You are not enrolled in this subject for this session.' });
//         }

//         const attendedAt = new Date().toISOString();
//         const record = await attendanceModel.createOrUpdateAttendanceRecord(
//             session.session_id,
//             studentId,
//             'present',
//             attendedAt
//         );

//         res.status(200).json({
//             message: 'Attendance marked successfully!',
//             record: {
//                 session_id: record.session_id,
//                 student_id: record.student_id,
//                 status: record.status,
//                 attended_at: record.attended_at
//             }
//         });
//     } catch (error) {
//         console.error('Error marking attendance for logged-in student:', error.message);
//         res.status(500).json({ message: 'Internal server error marking attendance.' });
//     }
// };

// // Student View Own Attendance History (Calendar view)
// const getMyAttendanceCalendar = async (req, res) => {
//     const studentId = req.student.id; // Get student_id from authenticated token
//     const { subject_id, month, year } = req.query;

//     // Validate month and year are numbers, and within reasonable range
//     if (!month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
//         return res.status(400).json({ message: 'Month and Year are required query parameters for calendar.' });
//     }
//     const parsedMonth = parseInt(month);
//     const parsedYear = parseInt(year);
//     if (parsedMonth < 1 || parsedMonth > 12) {
//         return res.status(400).json({ message: 'Month must be between 1 and 12.' });
//     }
//     if (parsedYear < 2000 || parsedYear > 2100) { // Reasonable year range
//         return res.status(400).json({ message: 'Year must be a valid number (e.g., 2024).' });
//     }

//     try {
//         // Optional: Check if student is enrolled in subject if subject_id is provided
//         if (subject_id && !(await studentModel.isStudentEnrolledInSubject(studentId, subject_id))) {
//             return res.status(403).json({ message: 'You are not enrolled in this subject.' });
//         }

//         // Construct start and end dates for the month
//         const formattedMonth = String(parsedMonth).padStart(2, '0'); // Ensures '01' instead of '1'
//         const startDate = `${parsedYear}-${formattedMonth}-01`;
//         const endDate = `${parsedYear}-${formattedMonth}-${new Date(parsedYear, parsedMonth, 0).getDate()}`; // Last day of the month

//         const calendarData = await studentModel.getStudentAttendanceCalendar(
//             studentId,
//             subject_id || null, // Pass subject_id or null if not filtering by subject
//             startDate,
//             endDate
//         );

//         // Format data for frontend calendar display (e.g., { 'YYYY-MM-DD': 'present'/'absent'/'late' })
//         const formattedCalendarData = {};
//         calendarData.forEach(record => {
//             const date = record.session_date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
//             formattedCalendarData[date] = record.attendance_status;
//         });

//         res.status(200).json(formattedCalendarData);
//     } catch (error) {
//         console.error('Error getting student attendance calendar:', error);
//         res.status(500).json({ message: 'Internal server error getting calendar attendance.' });
//     }
// };

// module.exports = {
//     loginStudent,
//     getMyStudentProfile,
//     markAttendanceByLoggedInStudent,
//     getStudentCalendar: getMyAttendanceCalendar // Export the calendar function
// };

const studentModel = require('../models/studentModel');
const attendanceModel = require('../models/attendanceModel');
const { comparePassword } = require('../utils/passwordHasher');
const { generateToken } = require('../config/jwt');

// Student Login
const loginStudent = async (req, res) => {
    const { roll_number, password } = req.body;
    if (!roll_number || !password) {
        return res.status(400).json({ message: 'Roll number and password are required.' });
    }
    try {
        const student = await studentModel.findStudentByRollNumber(roll_number);
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await comparePassword(password, student.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = generateToken({ id: student.student_id, roll_number: student.roll_number, isStudent: true });
        res.status(200).json({
            message: 'Logged in successfully!',
            student: {
                id: student.student_id,
                roll_number: student.roll_number,
                name: student.name,
                email: student.email
            },
            token
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ message: 'Internal server error during student login.' });
    }
};

// Student Profile (for logged-in student)
const getMyStudentProfile = async (req, res) => {
    const studentId = req.student.id;
    try {
        const student = await studentModel.findStudentByRollNumber(req.student.roll_number);
        if (!student || student.student_id !== studentId) {
            return res.status(404).json({ message: 'Student profile not found or mismatch.' });
        }
        res.status(200).json({
            id: student.student_id,
            roll_number: student.roll_number,
            name: student.name,
            email: student.email,
            department_id: student.department_id,
            current_year: student.current_year,
            section: student.section
        });
    } catch (error) {
        console.error('Error getting student profile:', error);
        res.status(500).json({ message: 'Internal server error getting student profile.' });
    }
};

// Student Marking Attendance (secure version)
const markAttendanceByLoggedInStudent = async (req, res) => {
    const studentId = req.student.id;
    const { session_code } = req.body;

    if (!session_code) {
        return res.status(400).json({ message: 'Session code is required.' });
    }

    try {
        const session = await attendanceModel.findOpenSessionByQrCode(session_code);
        if (!session) {
            return res.status(404).json({ message: 'Active attendance session not found with this code.' });
        }

        const isStudentEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, session.subject_id);
        if (!isStudentEnrolled) {
            return res.status(400).json({ message: 'You are not enrolled in this subject for this session.' });
        }

        const attendedAt = new Date().toISOString();
        const record = await attendanceModel.createOrUpdateAttendanceRecord(
            session.session_id,
            studentId,
            'present',
            attendedAt
        );

        res.status(200).json({
            message: 'Attendance marked successfully!',
            record: {
                session_id: record.session_id,
                student_id: record.student_id,
                status: record.status,
                attended_at: record.attended_at
            }
        });
    } catch (error) {
        console.error('Error marking attendance for logged-in student:', error.message);
        res.status(500).json({ message: 'Internal server error marking attendance.' });
    }
};

// Student View Own Attendance History (Calendar view)
const getMyAttendanceCalendar = async (req, res) => {
    const studentId = req.student.id;
    const { subject_id, month, year } = req.query;

    if (!month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
        return res.status(400).json({ message: 'Month and Year are required query parameters for calendar.' });
    }
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);
    if (parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }
    if (parsedYear < 2000 || parsedYear > 2100) {
        return res.status(400).json({ message: 'Year must be a valid number (e.g., 2024).' });
    }

    try {
        if (subject_id && !(await studentModel.isStudentEnrolledInSubject(studentId, subject_id))) {
            return res.status(403).json({ message: 'You are not enrolled in this subject.' });
        }

        const formattedMonth = String(parsedMonth).padStart(2, '0');
        const startDate = `${parsedYear}-${formattedMonth}-01`;
        const endDate = `${parsedYear}-${formattedMonth}-${new Date(parsedYear, parsedMonth, 0).getDate()}`;

        const calendarData = await studentModel.getStudentAttendanceCalendar(
            studentId,
            subject_id || null,
            startDate,
            endDate
        );

        const formattedCalendarData = {};
        calendarData.forEach(record => {
            const date = record.session_date.toISOString().split('T')[0];
            formattedCalendarData[date] = record.attendance_status;
        });

        res.status(200).json(formattedCalendarData);
    } catch (error) {
        console.error('Error getting student attendance calendar:', error);
        res.status(500).json({ message: 'Internal server error getting calendar attendance.' });
    }
};

module.exports = {
    loginStudent,
    getMyStudentProfile,
    markAttendanceByLoggedInStudent,
    getStudentCalendar: getMyAttendanceCalendar
};