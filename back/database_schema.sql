-- ============================
-- AlgoMaster Database Schema (Unified Quoted Format)
-- PostgreSQL Database Setup
-- ============================

-- ============================
-- TABLE USER
-- ============================
CREATE TABLE IF NOT EXISTS "USER" (
    "idUser" SERIAL PRIMARY KEY,
    "Nom" VARCHAR(100),
    "Prenom" VARCHAR(100),
    "DateNaissance" DATE,
    "Email" VARCHAR(150) UNIQUE NOT NULL,
    "motDePasse" VARCHAR(255) NOT NULL
);

-- ============================
-- TABLE ETUDIANT
-- ============================
CREATE TABLE IF NOT EXISTS "ETUDIANT" (
    "idUser" INT PRIMARY KEY,
    "Specialite" VARCHAR(150),
    "Annee" INT,
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE
);

-- ============================
-- TABLE ENSEIGNANT
-- ============================
CREATE TABLE IF NOT EXISTS "ENSEIGNANT" (
    "idUser" INT PRIMARY KEY,
    "Specialite" VARCHAR(150),
    "Grade" VARCHAR(100),
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE
);

-- ============================
-- TABLE COURS
-- ============================
CREATE TABLE IF NOT EXISTS "COURS" (
    "idCours" INT PRIMARY KEY,
    "titre" VARCHAR(150),
    "niveau" VARCHAR(20) CHECK ("niveau" IN ('Algo1', 'Algo2')),
    "description" TEXT,
    "duree" VARCHAR(50),
    "idEnseignant" INT,
    FOREIGN KEY ("idEnseignant") REFERENCES "ENSEIGNANT"("idUser")
);

-- ============================
-- TABLE TOPIC
-- ============================
CREATE TABLE IF NOT EXISTS "TOPIC" (
    "idTopic" SERIAL PRIMARY KEY,
    "nom" VARCHAR(100),
    "idCours" INT,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours")
);

-- ============================
-- TABLE COURS_SECTION
-- ============================
CREATE TABLE IF NOT EXISTS "COURS_SECTION" (
    "idSection" SERIAL PRIMARY KEY,
    "section" VARCHAR(150),
    "theorie" TEXT,
    "codeExample" TEXT,
    "idCours" INT,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours")
);

-- ============================
-- TABLE EXERCISE
-- ============================
CREATE TABLE IF NOT EXISTS "EXERCISE" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('qcm', 'quiz', 'code')),
    "statement" TEXT NOT NULL,
    "idEnseignant" INT,
    "idCours" INT,
    FOREIGN KEY ("idEnseignant") REFERENCES "ENSEIGNANT"("idUser") ON DELETE SET NULL,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours") ON DELETE SET NULL
);

-- ============================
-- TABLE QCM_OPTION
-- ============================
CREATE TABLE IF NOT EXISTS "QCM_OPTION" (
    "id" SERIAL PRIMARY KEY,
    "exerciseId" INT NOT NULL,
    "optionText" TEXT NOT NULL,
    FOREIGN KEY ("exerciseId") REFERENCES "EXERCISE"("id") ON DELETE CASCADE
);

-- ============================
-- TABLE QCM_ANSWER
-- ============================
CREATE TABLE IF NOT EXISTS "QCM_ANSWER" (
    "exerciseId" INT PRIMARY KEY,
    "correctOptionIndex" INT NOT NULL,
    FOREIGN KEY ("exerciseId") REFERENCES "EXERCISE"("id") ON DELETE CASCADE
);

-- ============================
-- TABLE QUIZ_ANSWER
-- ============================
CREATE TABLE IF NOT EXISTS "QUIZ_ANSWER" (
    "exerciseId" INT PRIMARY KEY,
    "answer" TEXT NOT NULL,
    FOREIGN KEY ("exerciseId") REFERENCES "EXERCISE"("id") ON DELETE CASCADE
);

-- ============================
-- TABLE CODE_TEST
-- ============================
CREATE TABLE IF NOT EXISTS "CODE_TEST" (
    "id" SERIAL PRIMARY KEY,
    "exerciseId" INT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    FOREIGN KEY ("exerciseId") REFERENCES "EXERCISE"("id") ON DELETE CASCADE
);

-- ============================
-- TABLE FEEDBACK
-- ============================
CREATE TABLE IF NOT EXISTS "FEEDBACK" (
    "idFeedback" SERIAL PRIMARY KEY,
    "Avis" VARCHAR(255),
    "idUser" INT,
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE
);

-- ============================
-- TABLE ETUDIANT_EXERCICE
-- ============================
CREATE TABLE IF NOT EXISTS "ETUDIANT_EXERCICE" (
    "idUser" INT,
    "idExercice" INT,
    PRIMARY KEY ("idUser", "idExercice"),
    FOREIGN KEY ("idUser") REFERENCES "ETUDIANT"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idExercice") REFERENCES "EXERCISE"("id") ON DELETE CASCADE
);

-- ============================
-- TABLE ETUDIANT_COURS
-- ============================
CREATE TABLE IF NOT EXISTS "ETUDIANT_COURS" (
    "idUser" INT,
    "idCours" INT,
    "tempsDebut" INT,
    "tempsFin" INT,
    "tempsConcentration" INT,
    PRIMARY KEY ("idUser", "idCours"),
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours") ON DELETE CASCADE
);

-- ============================
-- TABLE USER_FEEDBACK
-- ============================
CREATE TABLE IF NOT EXISTS "USER_FEEDBACK" (
    "idUser" INT,
    "idFeedback" INT,
    PRIMARY KEY ("idUser", "idFeedback"),
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idFeedback") REFERENCES "FEEDBACK"("idFeedback") ON DELETE CASCADE
);

-- ============================
-- INDEXES
-- ============================
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "USER"("Email");
CREATE INDEX IF NOT EXISTS "idx_etudiant_user" ON "ETUDIANT"("idUser");
CREATE INDEX IF NOT EXISTS "idx_enseignant_user" ON "ENSEIGNANT"("idUser");
CREATE INDEX IF NOT EXISTS "idx_cours_enseignant" ON "COURS"("idEnseignant");

CREATE INDEX IF NOT EXISTS "idx_exercise_enseignant" ON "EXERCISE"("idEnseignant");
CREATE INDEX IF NOT EXISTS "idx_exercise_cours" ON "EXERCISE"("idCours");

CREATE INDEX IF NOT EXISTS "idx_qcm_option_exercise" ON "QCM_OPTION"("exerciseId");
CREATE INDEX IF NOT EXISTS "idx_code_test_exercise" ON "CODE_TEST"("exerciseId");

CREATE INDEX IF NOT EXISTS "idx_topic_cours" ON "TOPIC"("idCours");
CREATE INDEX IF NOT EXISTS "idx_section_cours" ON "COURS_SECTION"("idCours");
-- ============================
-- Add Progress Tracking Features
-- ============================

-- Add completion status and progress fields to ETUDIANT_EXERCICE
ALTER TABLE "ETUDIANT_EXERCICE"
ADD COLUMN IF NOT EXISTS "completed" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "score" INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP;

-- Add completion status and progress fields to ETUDIANT_COURS
ALTER TABLE "ETUDIANT_COURS"
ADD COLUMN IF NOT EXISTS "completed" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "progress" INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP;

-- Add level and XP to ETUDIANT table
ALTER TABLE "ETUDIANT"
ADD COLUMN IF NOT EXISTS "level" INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS "xp" INT DEFAULT 0;

-- Create ACHIEVEMENT table
CREATE TABLE IF NOT EXISTS "ACHIEVEMENT" (
    "idAchievement" SERIAL PRIMARY KEY,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(100),
    "xpReward" INT DEFAULT 0
);

-- Create STUDENT_ACHIEVEMENT table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS "STUDENT_ACHIEVEMENT" (
    "idUser" INT,
    "idAchievement" INT,
    "unlockedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("idUser", "idAchievement"),
    FOREIGN KEY ("idUser") REFERENCES "ETUDIANT"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idAchievement") REFERENCES "ACHIEVEMENT"("idAchievement") ON DELETE CASCADE
);

-- Insert default achievements
INSERT INTO "ACHIEVEMENT" ("name", "description", "icon", "xpReward")
VALUES
    ('First Steps', 'Complete your first exercise', '🎯', 50),
    ('Course Explorer', 'Enroll in your first course', '📚', 30),
    ('Quick Learner', 'Complete 5 exercises', '⚡', 100),
    ('Dedicated Student', 'Complete 10 exercises', '🌟', 200),
    ('Course Master', 'Complete your first course', '🏆', 150),
    ('Algorithm Expert', 'Complete 20 exercises', '💎', 500),
    ('Consistency King', 'Complete 3 courses', '👑', 300)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_achievement_user ON "STUDENT_ACHIEVEMENT"("idUser");
CREATE INDEX IF NOT EXISTS idx_etudiant_level ON "ETUDIANT"("level");
CREATE INDEX IF NOT EXISTS idx_etudiant_cours_completed ON "ETUDIANT_COURS"("completed");
CREATE INDEX IF NOT EXISTS idx_etudiant_exercice_completed ON "ETUDIANT_EXERCICE"("completed");
-- Migration: Fix Section and Topic ID columns to use SERIAL
-- This allows the database to auto-generate IDs instead of relying on client-side generation

-- Drop and recreate TOPIC table with SERIAL primary key
DROP TABLE IF EXISTS "TOPIC" CASCADE;
CREATE TABLE "TOPIC" (
    "idTopic" SERIAL PRIMARY KEY,
    "nom"     VARCHAR(100),
    "idCours" INT,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours") ON DELETE CASCADE
);

-- Drop and recreate COURS_SECTION table with SERIAL primary key
DROP TABLE IF EXISTS "COURS_SECTION" CASCADE;
CREATE TABLE "COURS_SECTION" (
    "idSection"   SERIAL PRIMARY KEY,
    "section"     VARCHAR(150),
    "theorie"     TEXT,
    "codeExample" TEXT,
    "idCours"     INT,
    FOREIGN KEY ("idCours") REFERENCES "COURS"("idCours") ON DELETE CASCADE
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_topic_cours ON "TOPIC"("idCours");
CREATE INDEX IF NOT EXISTS idx_section_cours ON "COURS_SECTION"("idCours");
/*
  # Add Enrollment Timestamps

  1. Changes to ETUDIANT_COURS table
    - Add `enrolledAt` (timestamp) - when the student enrolled in the course
    - Add `finishedAt` (timestamp) - when the student finished the course (NULL if not finished)
    - Update existing enrollments to have enrolledAt set to current timestamp

  2. Notes
    - enrolledAt defaults to CURRENT_TIMESTAMP when a student enrolls
    - finishedAt is NULL by default and set when student completes the course
    - These fields are linked to the existing progress tracking system
*/

-- Add enrollment timestamps to ETUDIANT_COURS
ALTER TABLE "ETUDIANT_COURS"
ADD COLUMN IF NOT EXISTS "enrolledAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "finishedAt" TIMESTAMP;

-- Update existing enrollments to have enrolledAt set
UPDATE "ETUDIANT_COURS"
SET "enrolledAt" = CURRENT_TIMESTAMP
WHERE "enrolledAt" IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_etudiant_cours_enrolled ON "ETUDIANT_COURS"("enrolledAt");
CREATE INDEX IF NOT EXISTS idx_etudiant_cours_finished ON "ETUDIANT_COURS"("finishedAt");
