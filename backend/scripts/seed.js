// scripts/seed.js
require('dotenv').config({ path: './.env' }); // Load .env variables from the root of the backend project
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configure database connection (should match your config/db.js or .env)
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Main seeding function
const seedDatabase = async () => {
    let client; // Declare client here
    try {
        client = await pool.connect();
        console.log('Database client connected for seeding.');

        // --- 1. Clear existing data (Optional, but good for re-seeding) ---
        // Using CASCADE to also delete related records in other tables
        console.log('Clearing existing data...');
        await client.query('DELETE FROM attendance_records;');
        await client.query('DELETE FROM attendance_sessions;');
        await client.query('DELETE FROM enrollments;');
        await client.query('DELETE FROM faculty_subjects;');
        await client.query('DELETE FROM students;');
        await client.query('DELETE FROM subjects;');
        await client.query('DELETE FROM faculties;');
        await client.query('DELETE FROM departments;');
        // Note: If you have data in the 'users' table (which wasn't in our schema),
        // you might need to delete it here too if it conflicts.
        // await client.query('DELETE FROM users;');
        console.log('Existing data cleared.');

        // --- 2. Insert Departments ---
        console.log('Inserting departments...');
        const departmentRes1 = await client.query(`INSERT INTO departments (name) VALUES ('ECE') RETURNING department_id;`);
        const eceDepartmentId = departmentRes1.rows[0].department_id;
        const departmentRes2 = await client.query(`INSERT INTO departments (name) VALUES ('IT') RETURNING department_id;`);
        const itDepartmentId = departmentRes2.rows[0].department_id;
        const departmentRes3 = await client.query(`INSERT INTO departments (name) VALUES ('IT-BI') RETURNING department_id;`);
        const itbiDepartmentId = departmentRes3.rows[0].department_id;
        console.log(`Departments inserted: ECE (<span class="math-inline">\{eceDepartmentId\}\), IT \(</span>{itDepartmentId}), IT-BI (${itbiDepartmentId})`);

        // --- 3. Insert Faculties ---
        console.log('Inserting faculties...');
        const facultyPasswordHash = await hashPassword('testpassword');
        const facultyRes = await client.query(
            `INSERT INTO faculties (name, email, password_hash, department_id) VALUES ($1, $2, $3, $4) RETURNING faculty_id;`,
            ['Dr. Mukesh Adani', 'mukesh.adani@example.com', facultyPasswordHash, eceDepartmentId]
        );
        const facultyId = facultyRes.rows[0].faculty_id;
        console.log(`Faculty inserted: Dr. Mukesh Adani (${facultyId})`);

        // --- 4. Insert Subjects ---
        console.log('Inserting subjects...');
        const subjectRes1 = await client.query(
            `INSERT INTO  (subject_name, department_id, year, section, batch_name) VALUES ($1, $2, $3, $4, $5) RETURNING subject_id;`,
            ['Data Structures', eceDepartmentId, 3, 'A', '3rd Year A Batch']
        );
        const dataStructuresSubjectId = subjectRes1.rows[0].subject_id;

        const subjectRes2 = await client.query(
            `INSERT INTO subjects (subject_name, department_id, year, section, batch_name) VALUES ($1, $2, $3, $4, $5) RETURNING subject_id;`,
            ['Operating Systems', eceDepartmentId, 3, 'A', '3rd Year A Batch']
        );
        const operatingSystemsSubjectId = subjectRes2.rows[0].subject_id;
        console.log(`Subjects inserted: Data Structures (<span class="math-inline">\{dataStructuresSubjectId\}\), Operating Systems \(</span>{operatingSystemsSubjectId})`);

        // --- 5. Insert Faculty-Subject Assignments ---
        console.log('Inserting faculty-subject assignments...');
        await client.query(
            `INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`,
            [facultyId, dataStructuresSubjectId]
        );
        await client.query(
            `INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`,
            [facultyId, operatingSystemsSubjectId]
        );
        console.log('Faculty-subject assignments created.');

        // --- 6. Insert Students ---
        console.log('Inserting students...');
        const studentRes = await client.query(
            `INSERT INTO students (roll_number, name, email, department_id, current_year, section) VALUES ($1, $2, $3, $4, $5, $6) RETURNING student_id;`,
            ['IEC2023021', 'Student One', 'student.one@example.com', eceDepartmentId, 3, 'A']
        );
        const studentId = studentRes.rows[0].student_id;
        console.log(`Student inserted: Student One (${studentId})`);

        // --- 7. Insert Student Enrollments ---
        console.log('Inserting student enrollments...');
        await client.query(
            `INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`,
            [studentId, dataStructuresSubjectId]
        );
        await client.query(
            `INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`,
            [studentId, operatingSystemsSubjectId]
        );
        console.log('Student enrollments created.');

        // --- 8. Insert Attendance Sessions & Records (for Calendar View) ---
        console.log('Inserting attendance sessions and records...');
        const sept5SessionRes = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING session_id;`,
            [dataStructuresSubjectId, facultyId, '2024-09-05', '10:00:00', 'closed']
        );
        const sept5SessionId = sept5SessionRes.rows[0].session_id;
        await client.query(
            `INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [sept5SessionId, studentId, 'present', '2024-09-05 10:05:00+05:30']
        );
        console.log(`Attendance for 2024-09-05 recorded (Present).`);

        const sept6SessionRes = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING session_id;`,
            [dataStructuresSubjectId, facultyId, '2024-09-06', '10:00:00', 'closed']
        );
        const sept6SessionId = sept6SessionRes.rows[0].session_id;
        await client.query(
            `INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [sept6SessionId, studentId, 'present', '2024-09-06 10:02:00+05:30']
        );
        console.log(`Attendance for 2024-09-06 recorded (Present).`);

        const sept12SessionRes = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING session_id;`,
            [dataStructuresSubjectId, facultyId, '2024-09-12', '10:00:00', 'closed']
        );
        const sept12SessionId = sept12SessionRes.rows[0].session_id;
        await client.query(
            `INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [sept12SessionId, studentId, 'absent', null]
        );
        console.log(`Attendance for 2024-09-12 recorded (Absent).`);

        console.log('All test data seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (client) {
            client.release();
            console.log('Database client released.');
        }
        // It's good practice to exit the process once seeding is done,
        // especially for scripts that run once.
        process.exit(0);
    }
};

seedDatabase();