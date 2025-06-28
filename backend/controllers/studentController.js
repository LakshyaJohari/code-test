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
        const student = await studentModel.findStudentById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }
        res.status(200).json({
            id: student.student_id,
            roll_number: student.roll_number,
            name: student.name,
            email: student.email,
            department_id: student.department_id,
            current_year: student.current_year,
            section: student.section,
            department_name: student.department_name
        });
    } catch (error) {
        console.error('Error getting student profile:', error);
        res.status(500).json({ message: 'Internal server error getting student profile.' });
    }
};

// Student Marking Attendance (secure version)
const markAttendanceByLoggedInStudent = async (req, res) => {
    const studentId = req.student.id;
    const { qr_code_data } = req.body;

    if (!qr_code_data) {
        return res.status(400).json({ message: 'QR code data is required.' });
    }

    try {
        const session = await attendanceModel.getActiveSessionByQRCode(qr_code_data);
        if (!session) {
            return res.status(404).json({ message: 'Active attendance session not found with this QR code.' });
        }

        const isStudentEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, session.subject_id);
        if (!isStudentEnrolled) {
            return res.status(400).json({ message: 'You are not enrolled in this subject for this session.' });
        }

        const attendedAt = new Date().toISOString();
        const record = await attendanceModel.markAttendance(session.session_id, studentId, 'present', attendedAt);

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
const getStudentCalendar = async (req, res) => {
    const studentId = req.student.id;
    const { subject_id, start_date, end_date } = req.query;

    if (!subject_id || !start_date || !end_date) {
        return res.status(400).json({ message: 'Subject ID, start date, and end date are required query parameters.' });
    }

    try {
        const isEnrolled = await studentModel.isStudentEnrolledInSubject(studentId, subject_id);
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not enrolled in this subject.' });
        }

        const attendanceRecords = await studentModel.getStudentAttendanceCalendar(
            studentId,
            subject_id,
            start_date,
            end_date
        );

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error getting student calendar attendance:', error.message);
        res.status(500).json({ message: 'Internal server error getting calendar attendance.' });
    }
};

module.exports = {
    loginStudent,
    getMyStudentProfile,
    markAttendanceByLoggedInStudent,
    getStudentCalendar
};