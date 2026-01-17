-- Migration: Remove duplicate QCM options
-- This migration removes duplicate options that may have been inserted twice for the same exercise

-- Step 1: Create a temporary table with unique options only (keeping the first occurrence)
CREATE TEMP TABLE "QCM_OPTION_TEMP" AS
SELECT DISTINCT ON ("exerciseId", "optionText") *
FROM "QCM_OPTION"
ORDER BY "exerciseId", "optionText", "id";

-- Step 2: Delete all options
DELETE FROM "QCM_OPTION";

-- Step 3: Reinsert unique options
INSERT INTO "QCM_OPTION" ("id", "exerciseId", "optionText")
SELECT "id", "exerciseId", "optionText"
FROM "QCM_OPTION_TEMP";

-- Step 4: Reset the sequence to the max ID
SELECT setval(pg_get_serial_sequence('"QCM_OPTION"', 'id'), COALESCE(MAX("id"), 1), true) FROM "QCM_OPTION";

-- Step 5: Add a unique constraint to prevent future duplicates
-- Note: This prevents exact duplicates (same exerciseId AND same optionText)
ALTER TABLE "QCM_OPTION" 
ADD CONSTRAINT "unique_exercise_option" 
UNIQUE ("exerciseId", "optionText");

-- Cleanup
DROP TABLE "QCM_OPTION_TEMP";
