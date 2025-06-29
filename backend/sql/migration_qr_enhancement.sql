-- Migration script for QR enhancement
-- Run this after updating the schema.sql

-- Add subject_code column to subjects table
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS subject_code VARCHAR(10);

-- Update existing subjects with default codes based on subject names
UPDATE subjects SET subject_code = 
    CASE 
        WHEN LOWER(subject_name) LIKE '%digital%' OR LOWER(subject_name) LIKE '%electronics%' THEN 'DEL'
        WHEN LOWER(subject_name) LIKE '%computer%' OR LOWER(subject_name) LIKE '%programming%' THEN 'CS'
        WHEN LOWER(subject_name) LIKE '%mathematics%' OR LOWER(subject_name) LIKE '%math%' THEN 'MATH'
        WHEN LOWER(subject_name) LIKE '%physics%' THEN 'PHY'
        WHEN LOWER(subject_name) LIKE '%chemistry%' THEN 'CHEM'
        WHEN LOWER(subject_name) LIKE '%english%' THEN 'ENG'
        WHEN LOWER(subject_name) LIKE '%history%' THEN 'HIST'
        WHEN LOWER(subject_name) LIKE '%economics%' THEN 'ECO'
        ELSE UPPER(SUBSTRING(subject_name, 1, 3))
    END
WHERE subject_code IS NULL;

-- Make subject_code NOT NULL after updating
ALTER TABLE subjects ALTER COLUMN subject_code SET NOT NULL;

-- Add unique constraint for subject_code combination
ALTER TABLE subjects ADD CONSTRAINT unique_subject_code_dept_year_section_semester 
    UNIQUE (subject_code, department_id, year, section, semester);

-- Add QR sequence and expiration columns to attendance_sessions
ALTER TABLE attendance_sessions ADD COLUMN IF NOT EXISTS qr_sequence_number INT DEFAULT 0;
ALTER TABLE attendance_sessions ADD COLUMN IF NOT EXISTS qr_expires_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for new QR fields
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_qr_expires ON attendance_sessions(qr_expires_at) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_sequence ON attendance_sessions(session_id, qr_sequence_number);

-- Update existing attendance_sessions to have default values
UPDATE attendance_sessions SET qr_sequence_number = 0 WHERE qr_sequence_number IS NULL;
UPDATE attendance_sessions SET qr_expires_at = created_at + INTERVAL '5 seconds' WHERE qr_expires_at IS NULL; 