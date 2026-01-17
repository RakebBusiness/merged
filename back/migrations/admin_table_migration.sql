-- ============================
-- TABLE ADMIN
-- ============================
CREATE TABLE IF NOT EXISTS "ADMIN" (
    "idUser" INT PRIMARY KEY,
    "role" VARCHAR(50) DEFAULT 'admin',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS "idx_admin_user" ON "ADMIN"("idUser");

-- Add comment to table
COMMENT ON TABLE "ADMIN" IS 'Stores admin user information, linked to USER table';