/*
  # Create Feedback Management Tables

  1. New Tables
    - `FEEDBACK`
      - `id` (uuid, primary key) - Unique identifier for feedback
      - `name` (text) - Name of the person providing feedback
      - `email` (text) - Email address (optional)
      - `message` (text) - Feedback message content
      - `rating` (integer) - Rating from 1-5 (optional)
      - `created_at` (timestamptz) - When feedback was approved/created
    
    - `FEEDBACK_ATTENTE`
      - `id` (uuid, primary key) - Unique identifier for pending feedback
      - `name` (text) - Name of the person providing feedback
      - `email` (text) - Email address (optional)
      - `message` (text) - Feedback message content
      - `rating` (integer) - Rating from 1-5 (optional)
      - `created_at` (timestamptz) - When feedback was submitted
  
  2. Security
    - Enable RLS on both tables
    - Allow public to insert into FEEDBACK_ATTENTE (for feedback form)
    - Allow public to read from FEEDBACK (for displaying approved feedback)
    - Only authenticated admin users can approve/delete pending feedback
*/

-- Create FEEDBACK table for approved feedback
CREATE TABLE IF NOT EXISTS FEEDBACK (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create FEEDBACK_ATTENTE table for pending feedback
CREATE TABLE IF NOT EXISTS FEEDBACK_ATTENTE (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE FEEDBACK ENABLE ROW LEVEL SECURITY;
ALTER TABLE FEEDBACK_ATTENTE ENABLE ROW LEVEL SECURITY;

-- Policies for FEEDBACK table
-- Allow everyone to read approved feedback
CREATE POLICY "Anyone can read approved feedback"
  ON FEEDBACK FOR SELECT
  TO public
  USING (true);

-- Policies for FEEDBACK_ATTENTE table
-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON FEEDBACK_ATTENTE FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read pending feedback (for admin panel)
CREATE POLICY "Authenticated users can read pending feedback"
  ON FEEDBACK_ATTENTE FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to delete pending feedback
CREATE POLICY "Authenticated users can delete pending feedback"
  ON FEEDBACK_ATTENTE FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON FEEDBACK(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_attente_created_at ON FEEDBACK_ATTENTE(created_at DESC);