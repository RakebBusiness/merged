CREATE TABLE IF NOT EXISTS "ENSEIGNANT_ATTENTE" (
    "idUser" INT PRIMARY KEY,
    "Specialite" VARCHAR(150),
    "Grade" VARCHAR(100),
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE
);

-- Créer un index sur idUser
CREATE INDEX IF NOT EXISTS "idx_enseignant_copie_user" ON "ENSEIGNANT_ATTENTE"("idUser");
