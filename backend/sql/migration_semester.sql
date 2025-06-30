-- Migration script to update from batch_name to semester
-- Run this script if you have an existing database with batch_name field

-- Step 1: Add the new semester column
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS semester INT;

-- Step 2: Update existing records to set semester = 1 (default)
-- You may want to manually review and update these based on your data
UPDATE subjects SET semester = 1 WHERE semester IS NULL;

-- Step 3: Make semester NOT NULL
ALTER TABLE subjects ALTER COLUMN semester SET NOT NULL;

-- Step 4: Add CHECK constraint for semester values (1 or 2)
ALTER TABLE subjects ADD CONSTRAINT subjects_semester_check CHECK (semester IN (1, 2));

-- Step 5: Update the unique constraint to include semester
-- First drop the old constraint
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_subject_name_department_id_year_section_key;

-- Then add the new constraint with semester
ALTER TABLE subjects ADD CONSTRAINT subjects_subject_name_department_id_year_section_semester_key 
UNIQUE (subject_name, department_id, year, section, semester);

-- Step 6: Drop the old batch_name column (optional - only if you're sure you don't need it)
-- ALTER TABLE subjects DROP COLUMN IF EXISTS batch_name;

-- Step 7: Create indexes for semester-based queries
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_year_semester ON subjects(year, semester);
CREATE INDEX IF NOT EXISTS idx_subjects_department_year_semester ON subjects(department_id, year, semester);

-- Verification queries (run these to check the migration)
-- SELECT COUNT(*) FROM subjects WHERE semester IS NULL;
-- SELECT DISTINCT semester FROM subjects ORDER BY semester;
-- SELECT subject_name, year, section, semester FROM subjects LIMIT 10; 