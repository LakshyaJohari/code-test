-- Migration: Add attendance_weight column to attendance_sessions table
-- This column stores the weight (1-4) assigned to the attendance session by faculty

ALTER TABLE attendance_sessions 
ADD COLUMN IF NOT EXISTS attendance_weight INTEGER CHECK (attendance_weight >= 1 AND attendance_weight <= 4);

-- Add comment for documentation
COMMENT ON COLUMN attendance_sessions.attendance_weight IS 'Weight assigned to this attendance session (1-4) by faculty when submitting attendance'; 