const attendanceModel = require('../models/attendanceModel');
const subjectModel = require('../models/subjectModel');
const studentModel = require('../models/studentModel');

// Starts a new attendance session for a subject.
const startAttendanceSession = async (req, res) => {
    const { subject_id, qr_code_data } = req.body;
    const facultyId = req.user.id;
    if (!subject_id) {
        return res.status(400).json({ message: 'Subject ID is required.' });
    }
    try {
        const isAssigned = await subjectModel.isFacultyAssignedToSubject(facultyId, subject_id);
        if (!isAssigned) {
            return res.status(403).json({ message: 'You are not authorized to start attendance for this subject.' });
        }
        const sessionDate = new Date().toISOString().split('T')[0];
        const startTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const finalQrCodeData = qr_code_data || Math.random().toString(36).substring(2, 8).toUpperCase();

        const newSession = await attendanceModel.createAttendanceSession(
            subject_id,
            facultyId,
            sessionDate,
            startTime,
            finalQrCodeData
        );

        res.status(201).json({
            message: 'Attendance session started successfully!',
            session: newSession
        });
    } catch (error) {
        console.error('Error starting attendance session:', error.message);
        res.status(500).json({ message: 'Internal server error starting session.' });
    }
};

// Ends an active attendance session.
const endAttendanceSession = async (req, res) => {
    const { session_id } = req.params;
    const facultyId = req.user.id;
    try {
        const session = await attendanceModel.findSessionById(session_id);

        if (!session || session.status !== 'open') {
            return res.status(404).json({ message: 'Active attendance session not found or already closed.' });
        }
        if (session.faculty_id !== facultyId) {
            return res.status(403).json({ message: 'You are not authorized to end this session.' });
        }

        const endTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const closedSession = await attendanceModel.closeAttendanceSession(session_id, endTime);

        res.status(200).json({
            message: 'Attendance session ended successfully!',
            session: closedSession
        });
    } catch (error) {
        console.error('Error in endAttendanceSession:', error.message);
        res.status(500).json({ message: 'Internal server error ending session.' });
    }
};

// Faculty manually marks a student's attendance.
const markStudentAttendance = async (req, res) => {
    const { session_id } = req.params;
    const { student_id, status } = req.body;
    const facultyId = req.user.id;

    if (!student_id || !status) {
        return res.status(400).json({ message: 'Student ID and status are required.' });
    }

    const validStatuses = ['present', 'absent', 'late'];
    if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: `Invalid status. Must be: ${validStatuses.join(', ')}` });
    }

    try {
        const session = await attendanceModel.findSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'Attendance session not found.' });
        }

        const isAssigned = await subjectModel.isFacultyAssignedToSubject(facultyId, session.subject_id);
        if (!isAssigned) {
            return res.status(403).json({ message: 'Forbidden: Not assigned to this subject.' });
        }

        const isStudentEnrolled = await studentModel.isStudentEnrolledInSubject(student_id, session.subject_id);
        if (!isStudentEnrolled) {
            return res.status(400).json({ message: 'Student not enrolled in this subject.' });
        }

        const attendedAt = new Date().toISOString();
        const record = await attendanceModel.createOrUpdateAttendanceRecord(
            session_id,
            student_id,
            status.toLowerCase(),
            attendedAt
        );

        res.status(200).json({ message: 'Attendance recorded.', record });

    } catch (error) {
        console.error('Error in markStudentAttendance:', error.message);
        res.status(500).json({ message: 'Internal server error while marking attendance.' });
    }
};

// Faculty view: Calendar-style attendance for a student
const getStudentCalendarAttendance = async (req, res) => {
    const { subject_id, student_id } = req.params;
    const { month, year } = req.query;
    const facultyId = req.user.id;

    if (!month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
        return res.status(400).json({ message: 'Month and Year must be valid numbers.' });
    }

    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    if (parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }

    if (parsedYear < 2000 || parsedYear > 2100) {
        return res.status(400).json({ message: 'Year out of range.' });
    }

    try {
        const isAssigned = await subjectModel.isFacultyAssignedToSubject(facultyId, subject_id);
        if (!isAssigned) {
            return res.status(403).json({ message: 'You are not assigned to this subject.' });
        }

        const isEnrolled = await studentModel.isStudentEnrolledInSubject(student_id, subject_id);
        if (!isEnrolled) {
            return res.status(404).json({ message: 'Student not enrolled.' });
        }

        const startDate = `${parsedYear}-${String(parsedMonth).padStart(2, '0')}-01`;
        const endDate = `${parsedYear}-${String(parsedMonth).padStart(2, '0')}-${new Date(parsedYear, parsedMonth, 0).getDate()}`;

        const records = await attendanceModel.getStudentAttendanceBySubjectAndDateRange(student_id, subject_id, startDate, endDate);
        const formattedCalendarData = {};

        records.forEach(record => {
            const date = record.session_date.toISOString().split('T')[0];
            formattedCalendarData[date] = record.attendance_status;
        });

        res.status(200).json(formattedCalendarData);

    } catch (error) {
        console.error('Error in getStudentCalendarAttendance:', error.message);
        res.status(500).json({ message: 'Failed to fetch calendar attendance.' });
    }
};

// OPTIONAL: Override Attendance (for Admin/Faculty)
const overrideAttendance = async (req, res) => {
    const { studentId } = req.params;
    const { subject_id, session_date, new_status } = req.body;

    if (!(req.user.isAdmin || req.user.isFaculty)) {
        return res.status(403).json({ message: 'Forbidden: Only admin or faculty can override attendance.' });
    }

    if (!studentId || !subject_id || !session_date || !new_status) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const session = await attendanceModel.findSessionByDate(subject_id, session_date);
        if (!session) {
            return res.status(404).json({ message: 'Attendance session not found for given date and subject.' });
        }

        const updated = await attendanceModel.overrideAttendanceStatus(session.session_id, studentId, new_status);
        res.status(200).json({ message: 'Attendance overridden.', updated });

    } catch (error) {
        console.error('Error in overrideAttendance:', error.message);
        res.status(500).json({ message: 'Failed to override attendance.' });
    }
};

module.exports = {
    startAttendanceSession,
    endAttendanceSession,
    markStudentAttendance,
    getStudentCalendarAttendance,
    overrideAttendance
};
