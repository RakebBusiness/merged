/*
  # Make Course ID Auto-Increment

  1. Changes
    - Convert idCours from INT to SERIAL for auto-increment
    - Create a sequence for idCours if it doesn't exist
    - Set the sequence to start from the max current value + 1

  2. Notes
    - This ensures that teachers don't have to manually enter course IDs
    - Existing courses are preserved with their current IDs
*/

DO $$
DECLARE
    max_id INT;
BEGIN
    -- Get the maximum current idCours value
    SELECT COALESCE(MAX("idCours"), 0) INTO max_id FROM "COURS";

    -- Create sequence if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'cours_idcours_seq') THEN
        EXECUTE format('CREATE SEQUENCE cours_idcours_seq START WITH %s', max_id + 1);
    ELSE
        -- Reset sequence to max value + 1
        EXECUTE format('ALTER SEQUENCE cours_idcours_seq RESTART WITH %s', max_id + 1);
    END IF;

    -- Set the default value to use the sequence
    ALTER TABLE "COURS" ALTER COLUMN "idCours" SET DEFAULT nextval('cours_idcours_seq');

    -- Make sure the sequence is owned by the column
    ALTER SEQUENCE cours_idcours_seq OWNED BY "COURS"."idCours";
END $$;
