-- Update deadline column to support datetime with timezone
ALTER TABLE tasks ALTER COLUMN deadline TYPE timestamptz USING deadline::timestamptz;