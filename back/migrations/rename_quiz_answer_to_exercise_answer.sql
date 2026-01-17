-- Migration: Rename QUIZ_ANSWER to EXERCISE_ANSWER and remove CODE_TEST table
-- This migration consolidates quiz and code exercise answers into a single table

-- Step 1: Rename QUIZ_ANSWER table to EXERCISE_ANSWER
ALTER TABLE IF EXISTS "QUIZ_ANSWER" RENAME TO "EXERCISE_ANSWER";

-- Step 2: Migrate existing code exercise tests to EXERCISE_ANSWER
-- For code exercises, we'll combine all test cases into a single answer field
INSERT INTO "EXERCISE_ANSWER" ("exerciseId", "answer")
SELECT DISTINCT ct."exerciseId", 
       string_agg(ct."input" || ' -> ' || ct."expectedOutput", E'\n' ORDER BY ct."id") as "answer"
FROM "CODE_TEST" ct
WHERE NOT EXISTS (SELECT 1 FROM "EXERCISE_ANSWER" ea WHERE ea."exerciseId" = ct."exerciseId")
GROUP BY ct."exerciseId";

-- Step 3: Drop CODE_TEST table and its index
DROP INDEX IF EXISTS "idx_code_test_exercise";
DROP TABLE IF EXISTS "CODE_TEST";

-- Note: After running this migration, code exercises will use the same EXERCISE_ANSWER table
-- as quiz exercises, with a single "answer" field instead of multiple input/output test cases
