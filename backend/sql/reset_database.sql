-- Reset Database - Clear all data and start fresh
-- This will clear all tables but keep the schema structure

-- Clear attendance records first (due to foreign key constraints)
TRUNCATE TABLE attendance_records CASCADE;

-- Clear attendance sessions
TRUNCATE TABLE attendance_sessions CASCADE;

-- Clear enrollments
TRUNCATE TABLE enrollments CASCADE;

-- Clear main tables
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE faculties CASCADE;
TRUNCATE TABLE departments CASCADE;

-- Reset sequences (if any)
-- Note: PostgreSQL automatically resets sequences when TRUNCATE is used

-- Verify tables are empty
SELECT 'departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'faculties', COUNT(*) FROM faculties
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'attendance_sessions', COUNT(*) FROM attendance_sessions
UNION ALL
SELECT 'attendance_records', COUNT(*) FROM attendance_records; 