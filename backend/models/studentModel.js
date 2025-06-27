// // // // Database operations for students.
// // // const pool = require('../config/db');

// // // // Gets all students enrolled in a specific subject.
// // // const getStudentsBySubjectId = async (subjectId) => {
// // //     const query = `
// // //         SELECT
// // //             s.student_id, s.roll_number, s.name, s.email,
// // //             d.name AS department_name
// // //         FROM students s
// // //         JOIN enrollments e ON s.student_id = e.student_id
// // //         JOIN departments d ON s.department_id = d.department_id
// // //         WHERE e.subject_id = $1
// // //         ORDER BY s.roll_number;
// // //     `;
// // //     try {
// // //         const result = await pool.query(query, [subjectId]);
// // //         return result.rows;
// // //     } catch (error) {
// // //         console.error('Error fetching students by subject ID:', error);
// // //         throw new Error('Database query failed');
// // //     }
// // // };

// // // // Checks if a student is enrolled in a given subject.
// // // const isStudentEnrolledInSubject = async (studentId, subjectId) => {
// // //     const query = `
// // //         SELECT EXISTS (
// // //             SELECT 1 FROM enrollments
// // //             WHERE student_id = $1 AND subject_id = $2
// // //         );
// // //     `;
// // //     try {
// // //         const result = await pool.query(query, [studentId, subjectId]);
// // //         return result.rows[0].exists;
// // //     } catch (error) {
// // //         console.error('Error checking student enrollment in DB:', error);
// // //         throw new Error('Database query failed');
// // //     }
// // // };

// // // const findStudentByRollNumber = async (rollNumber) => {
// // //     const query = 'SELECT * FROM students WHERE roll_number = $1';
// // //     try {
// // //         const result = await pool.query(query, [rollNumber]);
// // //         return result.rows[0] || null;
// // //     } catch (error) {
// // //         console.error('Error finding student by roll number:', error);
// // //         throw new Error('Database query failed');
// // //     }
// // // };

// // // module.exports = {
// // //     getStudentsBySubjectId,
// // //     isStudentEnrolledInSubject,
// // //     findStudentByRollNumber // ADD THIS
// // // };

// // const pool = require('../config/db');
// // const { hashPassword } = require('../utils/passwordHasher'); // Assuming passwordHasher is in utils

// // // Gets all students enrolled in a specific subject. (Used by faculty/admin)
// // const getStudentsBySubjectId = async (subjectId) => {
// //     const query = `
// //         SELECT
// //             s.student_id, s.roll_number, s.name, s.email,
// //             d.name AS department_name
// //         FROM students s
// //         JOIN enrollments e ON s.student_id = e.student_id
// //         JOIN departments d ON s.department_id = d.department_id
// //         WHERE e.subject_id = $1
// //         ORDER BY s.roll_number;
// //     `;
// //     try {
// //         const result = await pool.query(query, [subjectId]);
// //         return result.rows;
// //     } catch (error) {
// //         console.error('Error fetching students by subject ID:', error);
// //         throw new Error('Database query failed');
// //     }
// // };

// // // Checks if a student is enrolled in a given subject.
// // const isStudentEnrolledInSubject = async (studentId, subjectId) => {
// //     const query = `
// //         SELECT EXISTS (
// //             SELECT 1 FROM enrollments
// //             WHERE student_id = $1 AND subject_id = $2
// //         );
// //     `;
// //     try {
// //         const result = await pool.query(query, [studentId, subjectId]);
// //         return result.rows[0].exists;
// //     } catch (error) {
// //         console.error('Error checking student enrollment in DB:', error);
// //         throw new Error('Database query failed');
// //     }
// // };

// // const findStudentByRollNumber = async (rollNumber) => {
// //     const query = 'SELECT * FROM students WHERE roll_number = $1';
// //     try {
// //         const result = await pool.query(query, [rollNumber]);
// //         return result.rows[0] || null;
// //     } catch (error) {
// //         console.error('Error finding student by roll number:', error);
// //         throw new Error('Database query failed');
// //     }
// // };

// // // --- NEW/UPDATED: Get Student's Own Attendance Calendar Data ---
// // const getStudentAttendanceCalendar = async (studentId, subjectId = null, startDate, endDate) => {
// //     // This query fetches all attendance records for a specific student,
// //     // categorized by subject and date, within a date range.
// //     let query = `
// //         SELECT
// //             s.subject_name,
// //             asess.session_date,
// //             asess.start_time,
// //             asess.end_time,
// //             ar.status AS attendance_status,
// //             ar.attended_at
// //         FROM
// //             attendance_records ar
// //         JOIN
// //             attendance_sessions asess ON ar.session_id = asess.session_id
// //         JOIN
// //             subjects s ON asess.subject_id = s.subject_id
// //         WHERE
// //             ar.student_id = $1
// //             AND asess.session_date >= $2::date
// //             AND asess.session_date <= $3::date
// //     `;
// //     const queryParams = [studentId, startDate, endDate];
// //     let paramIndex = 4;

// //     if (subjectId) {
// //         query += ` AND asess.subject_id = $${paramIndex}`;
// //         queryParams.push(subjectId);
// //         paramIndex++;
// //     }

// //     query += ` ORDER BY asess.session_date ASC, s.subject_name ASC;`;

// //     try {
// //         const result = await pool.query(query, queryParams);
// //         return result.rows;
// //     } catch (error) {
// //         console.error(`Error getting attendance calendar for student ${studentId}:`, error);
// //         throw new Error('Database query failed for student attendance calendar.');
// //     }
// // };

// // module.exports = {
// //     getStudentsBySubjectId,
// //     isStudentEnrolledInSubject,
// //     findStudentByRollNumber,
// //     getStudentAttendanceCalendar // Export the new function
// // };

const pool = require('../config/db');
const { hashPassword } = require('../utils/passwordHasher');

// Gets all students enrolled in a specific subject. (Used by faculty/admin)
const getStudentsBySubjectId = async (subjectId) => {
    const query = `
        SELECT
            s.student_id, s.roll_number, s.name, s.email,
            d.name AS department_name
        FROM students s
        JOIN enrollments e ON s.student_id = e.student_id
        JOIN departments d ON s.department_id = d.department_id
        WHERE e.subject_id = $1
        ORDER BY s.roll_number;
    `;
    try {
        const result = await pool.query(query, [subjectId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching students by subject ID:', error);
        throw new Error('Database query failed');
    }
};

// Checks if a student is enrolled in a given subject.
const isStudentEnrolledInSubject = async (studentId, subjectId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM enrollments
            WHERE student_id = $1 AND subject_id = $2
        );
    `;
    try {
        const result = await pool.query(query, [studentId, subjectId]);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking student enrollment in DB:', error);
        throw new Error('Database query failed');
    }
};

const findStudentByRollNumber = async (rollNumber) => {
    const query = 'SELECT * FROM students WHERE roll_number = $1';
    try {
        const result = await pool.query(query, [rollNumber]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error finding student by roll number:', error);
        throw new Error('Database query failed');
    }
};

// --- NEW/UPDATED: Get Student's Own Attendance Calendar Data ---
const getStudentAttendanceCalendar = async (studentId, subjectId = null, startDate, endDate) => {
    // This query fetches all attendance records for a specific student,
    // categorized by subject and date, within a date range.
    let query = `
        SELECT
            s.subject_name,
            asess.session_date,
            asess.start_time,
            asess.end_time,
            ar.status AS attendance_status,
            ar.attended_at
        FROM
            attendance_records ar
        JOIN
            attendance_sessions asess ON ar.session_id = asess.session_id
        JOIN
            subjects s ON asess.subject_id = s.subject_id
        WHERE
            ar.student_id = $1
            AND asess.session_date >= $2::date
            AND asess.session_date <= $3::date
    `;
    const queryParams = [studentId, startDate, endDate];
    let paramIndex = 4;

    if (subjectId) {
        query += ` AND asess.subject_id = $${paramIndex}`;
        queryParams.push(subjectId);
        paramIndex++;
    }

    query += ` ORDER BY asess.session_date ASC, s.subject_name ASC;`;

    try {
        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error(`Error getting attendance calendar for student ${studentId}:`, error);
        throw new Error('Database query failed for student attendance calendar.');
    }
};

module.exports = {
    getStudentsBySubjectId,
    isStudentEnrolledInSubject,
    findStudentByRollNumber,
    getStudentAttendanceCalendar
};
