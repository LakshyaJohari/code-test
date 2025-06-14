// const pool = require('../config/db');
// const { hashPassword } = require('../utils/passwordHasher');

// const findAdminByEmail = async (email) => {
//     const query = 'SELECT * FROM admins WHERE email = $1';
//     try {
//         const result = await pool.query(query, [email]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error finding admin by email:', error);
//         throw new Error('Database query failed');
//     }
// };

// const createAdmin = async (name, email, passwordHash) => {
//     const query = `
//         INSERT INTO admins (name, email, password_hash)
//         VALUES ($1, $2, $3)
//         RETURNING admin_id, name, email;
//     `;
//     try {
//         const result = await pool.query(query, [name, email, passwordHash]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating admin:', error);
//         throw new Error('Database insertion failed');
//     }
// };

// const getAllDepartments = async () => {
//     const query = 'SELECT * FROM departments ORDER BY name;';
//     try {
//         const result = await pool.query(query);
//         return result.rows;
//     } catch (error) {
//         console.error('Error getting all departments:', error);
//         throw new Error('Database query failed');
//     }
// };

// const createDepartment = async (name) => {
//     const query = 'INSERT INTO departments (name) VALUES ($1) RETURNING *;';
//     try {
//         const result = await pool.query(query, [name]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating department:', error);
//         throw new Error('Database insertion failed');
//     }
// };

// const updateDepartment = async (departmentId, name) => {
//     const query = `
//         UPDATE departments SET name = $1, updated_at = CURRENT_TIMESTAMP
//         WHERE department_id = $2 RETURNING *;
//     `;
//     try {
//         const result = await pool.query(query, [name, departmentId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error updating department:', error);
//         throw new Error('Database update failed');
//     }
// };

// const deleteDepartment = async (departmentId) => {
//     const query = 'DELETE FROM departments WHERE department_id = $1 RETURNING *;';
//     try {
//         const result = await pool.query(query, [departmentId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error deleting department:', error);
//         throw new Error('Database deletion failed');
//     }
// };

// const getAllFaculties = async () => {
//     const query = 'SELECT f.faculty_id, f.name, f.email, d.name AS department_name FROM faculties f JOIN departments d ON f.department_id = d.department_id ORDER BY f.name;';
//     try {
//         const result = await pool.query(query);
//         return result.rows;
//     } catch (error) {
//         console.error('Error getting all faculties:', error);
//         throw new Error('Database query failed');
//     }
// };

// const createFacultyByAdmin = async (name, email, password, departmentId) => {
//     const hashedPassword = await hashPassword(password);
//     const query = `
//         INSERT INTO faculties (name, email, password_hash, department_id)
//         VALUES ($1, $2, $3, $4)
//         RETURNING faculty_id, name, email;
//     `;
//     try {
//         const result = await pool.query(query, [name, email, hashedPassword, departmentId]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating faculty by admin:', error);
//         throw new Error('Database insertion failed');
//     }
// };

// const updateFaculty = async (facultyId, name, email, departmentId) => {
//     const query = `
//         UPDATE faculties SET name = $1, email = $2, department_id = $3, updated_at = CURRENT_TIMESTAMP
//         WHERE faculty_id = $4 RETURNING faculty_id, name, email;
//     `;
//     try {
//         const result = await pool.query(query, [name, email, departmentId, facultyId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error updating faculty:', error);
//         throw new Error('Database update failed');
//     }
// };

// const deleteFaculty = async (facultyId) => {
//     const query = 'DELETE FROM faculties WHERE faculty_id = $1 RETURNING *;';
//     try {
//         const result = await pool.query(query, [facultyId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error deleting faculty:', error);
//         throw new Error('Database deletion failed');
//     }
// };

// const getAllStudents = async () => {
//     const query = 'SELECT s.student_id, s.roll_number, s.name, s.email, d.name AS department_name, s.current_year, s.section FROM students s JOIN departments d ON s.department_id = d.department_id ORDER BY s.roll_number;';
//     try {
//         const result = await pool.query(query);
//         return result.rows;
//     } catch (error) {
//         console.error('Error getting all students:', error);
//         throw new Error('Database query failed');
//     }
// };

// const createStudent = async (rollNumber, name, email, departmentId, currentYear, section) => {
//     const query = `
//         INSERT INTO students (roll_number, name, email, department_id, current_year, section)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING student_id, roll_number, name, email;
//     `;
//     try {
//         const result = await pool.query(query, [rollNumber, name, email, departmentId, currentYear, section]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating student:', error);
//         throw new Error('Database insertion failed');
//     }
// };

// const updateStudent = async (studentId, rollNumber, name, email, departmentId, currentYear, section) => {
//     const query = `
//         UPDATE students SET roll_number = $1, name = $2, email = $3, department_id = $4, current_year = $5, section = $6, updated_at = CURRENT_TIMESTAMP
//         WHERE student_id = $7 RETURNING student_id, roll_number, name, email;
//     `;
//     try {
//         const result = await pool.query(query, [rollNumber, name, email, departmentId, currentYear, section, studentId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error updating student:', error);
//         throw new Error('Database update failed');
//     }
// };

// const deleteStudent = async (studentId) => {
//     const query = 'DELETE FROM students WHERE student_id = $1 RETURNING *;';
//     try {
//         const result = await pool.query(query, [studentId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error deleting student:', error);
//         throw new Error('Database deletion failed');
//     }
// };

// const getAllSubjects = async () => {
//     const query = 'SELECT s.subject_id, s.subject_name, s.year, s.section, s.batch_name, d.name AS department_name FROM subjects s JOIN departments d ON s.department_id = d.department_id ORDER BY s.subject_name;';
//     try {
//         const result = await pool.query(query);
//         return result.rows;
//     } catch (error) {
//         console.error('Error getting all subjects:', error);
//         throw new Error('Database query failed');
//     }
// };

// const createSubject = async (subjectName, departmentId, year, section, batchName) => {
//     const query = `
//         INSERT INTO subjects (subject_name, department_id, year, section, batch_name)
//         VALUES ($1, $2, $3, $4, $5)
//         RETURNING subject_id, subject_name;
//     `;
//     try {
//         const result = await pool.query(query, [subjectName, departmentId, year, section, batchName]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating subject:', error);
//         throw new Error('Database insertion failed');
//     }
// };

// const updateSubject = async (subjectId, subjectName, departmentId, year, section, batchName) => {
//     const query = `
//         UPDATE subjects SET subject_name = $1, department_id = $2, year = $3, section = $4, batch_name = $5, updated_at = CURRENT_TIMESTAMP
//         WHERE subject_id = $6 RETURNING subject_id, subject_name;
//     `;
//     try {
//         const result = await pool.query(query, [subjectName, departmentId, year, section, batchName, subjectId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error updating subject:', error);
//         throw new Error('Database update failed');
//     }
// };

// const deleteSubject = async (subjectId) => {
//     const query = 'DELETE FROM subjects WHERE subject_id = $1 RETURNING *;';
//     try {
//         const result = await pool.query(query, [subjectId]);
//         return result.rows[0] || null;
//     } catch (error) {
//         console.error('Error deleting subject:', error);
//         throw new Error('Database deletion failed');
//     }
// };

// module.exports = {
//     findAdminByEmail,
//     createAdmin,
//     getAllDepartments,
//     createDepartment,
//     updateDepartment,
//     deleteDepartment,
//     getAllFaculties,
//     createFacultyByAdmin,
//     updateFaculty,
//     deleteFaculty,
//     getAllStudents,
//     createStudent,
//     updateStudent,
//     deleteStudent,
//     getAllSubjects,
//     createSubject,
//     updateSubject,
//     deleteSubject
// }; 
const pool = require('../config/db');

// Admin
const findAdminByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        return result.rows[0];  // Return the first matching admin
    } catch (error) {
        console.error('Error in findAdminByEmail:', error);
        throw error;
    }
};

const createAdmin = async (name, email, password_hash) => {
    try {
        const result = await pool.query(
            'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password_hash]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error in createAdmin:', error);
        throw error;
    }
};

// Department
const getAllDepartments = async () => {
    const result = await pool.query('SELECT * FROM departments');
    return result.rows;
};

const createDepartment = async (name) => {
    const result = await pool.query(
        'INSERT INTO departments (name) VALUES ($1) RETURNING *',
        [name]
    );
    return result.rows[0];
};

const updateDepartment = async (id, name) => {
    const result = await pool.query(
        'UPDATE departments SET name = $1 WHERE department_id = $2 RETURNING *',
        [name, id]
    );
    return result.rows[0];
};

const deleteDepartment = async (id) => {
    const result = await pool.query(
        'DELETE FROM departments WHERE department_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Faculty
const getAllFaculties = async () => {
    const result = await pool.query('SELECT * FROM faculties');
    return result.rows;
};

const createFacultyByAdmin = async (name, email, password_hash, department_id) => {
    const result = await pool.query(
        'INSERT INTO faculties (name, email, password_hash, department_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password_hash, department_id]
    );
    return result.rows[0];
};

const updateFaculty = async (id, name, email, department_id) => {
    const result = await pool.query(
        'UPDATE faculties SET name = $1, email = $2, department_id = $3 WHERE faculty_id = $4 RETURNING *',
        [name, email, department_id, id]
    );
    return result.rows[0];
};

const deleteFaculty = async (id) => {
    const result = await pool.query(
        'DELETE FROM faculties WHERE faculty_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Student
const getAllStudents = async () => {
    const result = await pool.query('SELECT * FROM students');
    return result.rows;
};

const createStudent = async (roll_number, name, email, department_id, current_year, section) => {
    const result = await pool.query(
        'INSERT INTO students (roll_number, name, email, department_id, current_year, section) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [roll_number, name, email, department_id, current_year, section]
    );
    return result.rows[0];
};

const updateStudent = async (id, roll_number, name, email, department_id, current_year, section) => {
    const result = await pool.query(
        'UPDATE students SET roll_number = $1, name = $2, email = $3, department_id = $4, current_year = $5, section = $6 WHERE student_id = $7 RETURNING *',
        [roll_number, name, email, department_id, current_year, section, id]
    );
    return result.rows[0];
};

const deleteStudent = async (id) => {
    const result = await pool.query(
        'DELETE FROM students WHERE student_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Subject
const getAllSubjects = async () => {
    const result = await pool.query('SELECT * FROM subjects');
    return result.rows;
};

const createSubject = async (name, department_id, year, section, batch_name) => {
    const result = await pool.query(
        'INSERT INTO subjects (subject_name, department_id, year, section, batch_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, department_id, year, section, batch_name]
    );
    return result.rows[0];
};

const updateSubject = async (id, name, department_id, year, section, batch_name) => {
    const result = await pool.query(
        'UPDATE subjects SET subject_name = $1, department_id = $2, year = $3, section = $4, batch_name = $5 WHERE subject_id = $6 RETURNING *',
        [name, department_id, year, section, batch_name, id]
    );
    return result.rows[0];
};

const deleteSubject = async (id) => {
    const result = await pool.query(
        'DELETE FROM subjects WHERE subject_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    findAdminByEmail,
    createAdmin,
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllFaculties,
    createFacultyByAdmin,
    updateFaculty,
    deleteFaculty,
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};
