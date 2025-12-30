/*
  # Allow Teachers to Enroll in Courses

  1. Changes to ETUDIANT_COURS table
    - Drop the foreign key constraint that references ETUDIANT table
    - Add a new foreign key constraint that references USER table instead
    - This allows both students (ETUDIANT) and teachers (ENSEIGNANT) to enroll in courses

  2. Notes
    - Both ETUDIANT and ENSEIGNANT reference USER table with their idUser
    - This change maintains data integrity while allowing more flexibility
    - Existing enrollments are preserved
*/

-- Drop the existing foreign key constraint that restricts to ETUDIANT only
ALTER TABLE "ETUDIANT_COURS"
DROP CONSTRAINT IF EXISTS "ETUDIANT_COURS_idUser_fkey";

-- Add a new foreign key constraint that references USER table
-- This allows both students and teachers to enroll
ALTER TABLE "ETUDIANT_COURS"
ADD CONSTRAINT "ETUDIANT_COURS_idUser_fkey"
FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_etudiant_cours_user ON "ETUDIANT_COURS"("idUser");
