-- Migration to add designation column to faculties table
-- Run this script to update existing database

-- Add designation column to faculties table
ALTER TABLE faculties ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT 'Faculty';

-- Update existing faculty records to have 'Faculty' designation if they don't have one
UPDATE faculties SET designation = 'Faculty' WHERE designation IS NULL;

-- Make sure the column is not null
ALTER TABLE faculties ALTER COLUMN designation SET NOT NULL; 