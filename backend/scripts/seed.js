// Script to populate the database with initial test data.
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');
const { hashPassword } = require('../utils/passwordHasher');

// Database connection configuration.
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Main function to seed the database.
const seedDatabase = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Database client connected for seeding.');

        console.log('Clearing existing data...');
        await client.query('DELETE FROM attendance_records CASCADE;');
        await client.query('DELETE FROM attendance_sessions CASCADE;');
        await client.query('DELETE FROM enrollments CASCADE;');
        await client.query('DELETE FROM faculty_subjects CASCADE;');
        await client.query('DELETE FROM students CASCADE;');
        await client.query('DELETE FROM subjects CASCADE;');
        await client.query('DELETE FROM faculties CASCADE;');
        await client.query('DELETE FROM departments CASCADE;');
        await client.query('DELETE FROM admins CASCADE;');
        await client.query('DELETE FROM app_settings CASCADE;');
        console.log('Existing data cleared.');

        console.log('Inserting departments...');
        const deptNames = ['ECE', 'IT', 'CS', 'MECH', 'CIVIL'];
        const departmentIds = {};
        for (const name of deptNames) {
            const res = await client.query(`INSERT INTO departments (name) VALUES ($1) RETURNING department_id;`, [name]);
            departmentIds[name] = res.rows[0].department_id;
            console.log(`Inserted department: ${name} (${departmentIds[name]})`);
        }

        console.log('Inserting faculties (more for pagination testing)...');
        const facultyPasswordHash = await hashPassword('testpassword');
        const facultyData = [
            { name: 'Dr. Mukesh Adani', email: 'mukesh.adani@example.com', deptId: departmentIds['ECE'] },
            { name: 'Dr. Priya Sharma', email: 'priya.sharma@example.com', deptId: departmentIds['IT'] },
            { name: 'Prof. Alok Kumar', email: 'alok.kumar@example.com', deptId: departmentIds['CS'] },
            { name: 'Dr. Neha Singh', email: 'neha.singh@example.com', deptId: departmentIds['ECE'] },
            { name: 'Prof. Rahul Verma', email: 'rahul.verma@example.com', deptId: departmentIds['MECH'] },
            { name: 'Dr. Smita Rao', email: 'smita.rao@example.com', deptId: departmentIds['IT'] },
            { name: 'Prof. Vijay Kumar', email: 'vijay.kumar@example.com', deptId: departmentIds['CIVIL'] },
            { name: 'Dr. Jyoti Devi', email: 'jyoti.devi@example.com', deptId: departmentIds['CS'] },
            { name: 'Prof. Ganesh Pillai', email: 'ganesh.pillai@example.com', deptId: departmentIds['ECE'] },
            { name: 'Dr. Indu Prasad', email: 'indu.prasad@example.com', deptId: departmentIds['IT'] },
            { name: 'Prof. Rajeev Kumar', email: 'rajeev.kumar@example.com', deptId: departmentIds['CS'] },
            { name: 'Dr. Meena Reddy', email: 'meena.reddy@example.com', deptId: departmentIds['MECH'] },
        ];
        const facultyIds = {};
        for (const fac of facultyData) {
            const res = await client.query(
                `INSERT INTO faculties (name, email, password_hash, department_id) VALUES ($1, $2, $3, $4) RETURNING faculty_id;`,
                [fac.name, fac.email, facultyPasswordHash, fac.deptId]
            );
            facultyIds[fac.email] = res.rows[0].faculty_id;
            console.log(`Inserted faculty: ${fac.name}`);
        }

        console.log('Inserting subjects (more for pagination testing)...');
        const subjectData = [
            // ECE Subjects
            { name: 'Data Structures', deptId: departmentIds['ECE'], year: 1, section: 'A', semester: 1 },
            { name: 'Digital Electronics', deptId: departmentIds['ECE'], year: 1, section: 'A', semester: 1 },
            { name: 'Analog Communications', deptId: departmentIds['ECE'], year: 2, section: 'A', semester: 2 },
            { name: 'VLSI Design', deptId: departmentIds['ECE'], year: 3, section: 'B', semester: 1 },
            { name: 'Embedded Systems', deptId: departmentIds['ECE'], year: 4, section: 'C', semester: 2 },
            { name: 'Control Systems', deptId: departmentIds['ECE'], year: 3, section: 'A', semester: 1 },
            // IT Subjects
            { name: 'Python Programming', deptId: departmentIds['IT'], year: 1, section: 'C', semester: 1 },
            { name: 'Data Science', deptId: departmentIds['IT'], year: 2, section: 'D', semester: 2 },
            { name: 'Web Technologies', deptId: departmentIds['IT'], year: 3, section: 'C', semester: 1 },
            { name: 'Machine Learning', deptId: departmentIds['IT'], year: 4, section: 'D', semester: 2 },
            { name: 'Cloud Computing', deptId: departmentIds['IT'], year: 3, section: 'A', semester: 2 },
            // CS Subjects
            { name: 'Algorithms', deptId: departmentIds['CS'], year: 2, section: 'A', semester: 1 },
            { name: 'Operating Systems', deptId: departmentIds['CS'], year: 3, section: 'B', semester: 1 },
            { name: 'Computer Networks', deptId: departmentIds['CS'], year: 3, section: 'C', semester: 2 },
            { name: 'Cyber Security', deptId: departmentIds['CS'], year: 4, section: 'A', semester: 1 },
            { name: 'Database Management', deptId: departmentIds['CS'], year: 2, section: 'B', semester: 2 },
        ];
        const subjectIds = {};
        for (const sub of subjectData) {
            const res = await client.query(
                `INSERT INTO subjects (subject_name, department_id, year, section, semester) VALUES ($1, $2, $3, $4, $5) RETURNING subject_id;`,
                [sub.name, sub.deptId, sub.year, sub.section, sub.semester]
            );
            subjectIds[sub.name] = res.rows[0].subject_id;
            console.log(`Inserted subject: ${sub.name}`);
        }

        console.log('Inserting faculty-subject assignments...');
        await client.query(`INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`, [facultyIds['mukesh.adani@example.com'], subjectIds['Data Structures']]);
        await client.query(`INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`, [facultyIds['mukesh.adani@example.com'], subjectIds['Analog Communications']]);
        await client.query(`INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`, [facultyIds['priya.sharma@example.com'], subjectIds['Python Programming']]);
        await client.query(`INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($1, $2);`, [facultyIds['alok.kumar@example.com'], subjectIds['Algorithms']]);
        console.log('Faculty-subject assignments created.');

        console.log('Inserting students (more for pagination testing)...');
        const studentPasswordHash = await hashPassword('studentpass');
        const studentData = [
            { roll: 'IEC2023001', name: 'Alice Smith', email: 'alice.s@example.com', deptId: departmentIds['ECE'], year: 1, section: 'A' },
            { roll: 'IEC2023002', name: 'Bob Johnson', email: 'bob.j@example.com', deptId: departmentIds['IT'], year: 1, section: 'C' },
            { roll: 'IEC2023003', name: 'Charlie Brown', email: 'charlie.b@example.com', deptId: departmentIds['CS'], year: 2, section: 'A' },
            { roll: 'IEC2023004', name: 'Diana Prince', email: 'diana.p@example.com', deptId: departmentIds['ECE'], year: 2, section: 'A' },
            { roll: 'IEC2023005', name: 'Eve Adams', email: 'eve.a@example.com', deptId: departmentIds['IT'], year: 2, section: 'D' },
            { roll: 'IEC2023006', name: 'Frank White', email: 'frank.w@example.com', deptId: departmentIds['CS'], year: 3, section: 'B' },
            { roll: 'IEC2023007', name: 'Grace Lee', email: 'grace.l@example.com', deptId: departmentIds['ECE'], year: 3, section: 'B' },
            { roll: 'IEC2023008', name: 'Harry Potter', email: 'harry.p@example.com', deptId: departmentIds['IT'], year: 3, section: 'C' },
            { roll: 'IEC2023009', name: 'Ivy Green', email: 'ivy.g@example.com', deptId: departmentIds['CS'], year: 4, section: 'A' },
            { roll: 'IEC2023010', name: 'Jack Black', email: 'jack.b@example.com', deptId: departmentIds['ECE'], year: 4, section: 'C' },
            { roll: 'IEC2023011', name: 'Zoro Roronoa', email: 'zoro.r@example.com', deptId: departmentIds['IT'], year: 1, section: 'C' },
            { roll: 'IEC2023012', name: 'Nami Navigator', email: 'nami.n@example.com', deptId: departmentIds['IT'], year: 1, section: 'C' },
        ];
        const studentIds = {};
        for (const stud of studentData) {
            const res = await client.query(
            `INSERT INTO students (roll_number, name, email, password_hash, department_id, current_year, section) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING student_id;`,
            [stud.roll, stud.name, stud.email, studentPasswordHash, stud.deptId, stud.year, stud.section]
            );
            studentIds[stud.roll] = res.rows[0].student_id;
            console.log(`Inserted student: ${stud.name} (${stud.roll})`);
        }
        
        console.log('Inserting student enrollments...');
        await client.query(`INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`, [studentIds['IEC2023001'], subjectIds['Digital Electronics']]);
        await client.query(`INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`, [studentIds['IEC2023001'], subjectIds['Algorithms']]);
        await client.query(`INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`, [studentIds['IEC2023002'], subjectIds['Python Programming']]);
        await client.query(`INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2);`, [studentIds['IEC2023011'], subjectIds['Python Programming']]);
        console.log('Student enrollments created.');

        console.log('Inserting attendance sessions and records...');
        const dsSession1 = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status, qr_code_data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING session_id;`,
            [subjectIds['Data Structures'], facultyIds['mukesh.adani@example.com'], '2024-09-05', '10:00:00', 'completed', 'DS05SEP']
        );
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [dsSession1.rows[0].session_id, studentIds['IEC2023001'], 'present', '2024-09-05 10:05:00+05:30']);

        const dsSession2 = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status, qr_code_data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING session_id;`,
            [subjectIds['Data Structures'], facultyIds['mukesh.adani@example.com'], '2024-09-06', '10:00:00', 'completed', 'DS06SEP']
        );
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [dsSession2.rows[0].session_id, studentIds['IEC2023001'], 'absent', null]);

        const pySession1 = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status, qr_code_data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING session_id;`,
            [subjectIds['Python Programming'], facultyIds['priya.sharma@example.com'], '2024-09-05', '11:00:00', 'completed', 'PY05SEP']
        );
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [pySession1.rows[0].session_id, studentIds['IEC2023002'], 'present', '2024-09-05 11:03:00+05:30']);
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [pySession1.rows[0].session_id, studentIds['IEC2023011'], 'absent', null]);

        const pySession2 = await client.query(
            `INSERT INTO attendance_sessions (subject_id, faculty_id, session_date, start_time, status, qr_code_data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING session_id;`,
            [subjectIds['Python Programming'], facultyIds['priya.sharma@example.com'], '2024-09-06', '11:00:00', 'completed', 'PY06SEP']
        );
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [pySession2.rows[0].session_id, studentIds['IEC2023002'], 'present', '2024-09-06 11:01:00+05:30']);
        await client.query(`INSERT INTO attendance_records (session_id, student_id, status, attended_at) VALUES ($1, $2, $3, $4);`,
            [pySession2.rows[0].session_id, studentIds['IEC2023011'], 'present', '2024-09-06 11:05:00+05:30']
        );
        console.log('Sample attendance sessions and records created.');

        console.log('Inserting default admin user...');
        const adminPasswordHash = await hashPassword('adminpass');
        const adminRes = await client.query(
            `INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash RETURNING admin_id;`,
            ['Super Admin', 'admin@example.com', adminPasswordHash]
        );
        const adminId = adminRes.rows[0].admin_id;
        console.log(`Default admin inserted: admin@example.com (${adminId})`);

        console.log('Inserting default app settings...');
        await client.query(
            `INSERT INTO app_settings (setting_key, setting_value, description) VALUES ($1, $2, $3) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, description = EXCLUDED.description, last_updated = CURRENT_TIMESTAMP;`,
            ['attendance_threshold', '75', 'Minimum attendance percentage for defaulters']
        );
        console.log('Default app settings inserted.');

        console.log('All test data seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (client) {
            client.release();
            console.log('Database client released.');
        }
        process.exit(0);
    }
};

seedDatabase();