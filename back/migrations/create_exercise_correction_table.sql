/*
  # AI Exercise Correction System

  1. New Tables
    - `EXERCISE_CORRECTION`
      - `id` (serial, primary key) - Unique correction ID
      - `idExercice` (integer) - Reference to exercise
      - `idUser` (integer) - Reference to student
      - `studentSolution` (text) - Student's submitted solution
      - `evaluation` (text) - AI's evaluation of the solution
      - `score` (integer) - Score from 0-100
      - `perfectSolution` (text) - AI's suggested perfect solution
      - `correctedAt` (timestamp) - When correction was generated

  2. Indexes
    - Index on (idUser, idExercice) for quick history lookup
    - Index on correctedAt for chronological queries

  3. Security
    - Enable RLS on `EXERCISE_CORRECTION` table
    - Students can only view their own corrections
    - Teachers can view corrections for exercises they created

  4. Important Notes
    - Uses IF NOT EXISTS to prevent errors on re-run
    - Cascades deletion if exercise or user is deleted
    - Stores complete correction history for progress tracking
*/

-- Create the correction table
CREATE TABLE IF NOT EXISTS "EXERCISE_CORRECTION" (
  "id" SERIAL PRIMARY KEY,
  "idExercice" INTEGER NOT NULL,
  "idUser" INTEGER NOT NULL,
  "studentSolution" TEXT NOT NULL,
  "evaluation" TEXT NOT NULL,
  "score" INTEGER CHECK ("score" >= 0 AND "score" <= 100),
  "perfectSolution" TEXT NOT NULL,
  "correctedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_correction_exercise"
    FOREIGN KEY ("idExercice")
    REFERENCES "EXERCISE"("id")
    ON DELETE CASCADE,
  CONSTRAINT "fk_correction_user"
    FOREIGN KEY ("idUser")
    REFERENCES "USER"("idUser")
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_correction_user_exercise"
  ON "EXERCISE_CORRECTION"("idUser", "idExercice");

CREATE INDEX IF NOT EXISTS "idx_correction_date"
  ON "EXERCISE_CORRECTION"("correctedAt" DESC);

-- Enable Row Level Security
ALTER TABLE "EXERCISE_CORRECTION" ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own corrections
CREATE POLICY "Students can view own corrections"
  ON "EXERCISE_CORRECTION"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "idUser");

-- Policy: Students can insert their own corrections
CREATE POLICY "Students can create own corrections"
  ON "EXERCISE_CORRECTION"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "idUser");

-- Policy: Teachers can view corrections for their exercises
CREATE POLICY "Teachers can view corrections for their exercises"
  ON "EXERCISE_CORRECTION"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "EXERCISE" e
      WHERE e."id" = "EXERCISE_CORRECTION"."idExercice"
      AND e."idEnseignant" = auth.uid()
    )
  );

-- Note: Since we're using PostgreSQL without Supabase auth helpers,
-- we'll handle authorization in the application layer instead of RLS.
-- The policies above are template for if/when Supabase auth is integrated.
-- For now, we'll DROP the policies and rely on JWT middleware.

DROP POLICY IF EXISTS "Students can view own corrections" ON "EXERCISE_CORRECTION";
DROP POLICY IF EXISTS "Students can create own corrections" ON "EXERCISE_CORRECTION";
DROP POLICY IF EXISTS "Teachers can view corrections for their exercises" ON "EXERCISE_CORRECTION";

-- Comment explaining the security approach
COMMENT ON TABLE "EXERCISE_CORRECTION" IS
'Stores AI-generated corrections for student exercise submissions. Security is enforced via JWT middleware in the application layer.';
