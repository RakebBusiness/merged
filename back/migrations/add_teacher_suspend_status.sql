-- Migration: Add suspended status to ENSEIGNANT table
-- This allows administrators to suspend and reactivate teacher accounts

-- Add suspended column to ENSEIGNANT table (defaults to false - not suspended)
ALTER TABLE "ENSEIGNANT"
ADD COLUMN IF NOT EXISTS "suspended" BOOLEAN DEFAULT FALSE;

-- Create index for performance when querying by suspended status
CREATE INDEX IF NOT EXISTS "idx_enseignant_suspended" ON "ENSEIGNANT"("suspended");

-- Add comment to explain the column
COMMENT ON COLUMN "ENSEIGNANT"."suspended" IS 'Indicates if the teacher account is suspended by an administrator';
