const pool = require('../config/database');

const profileModel = {
    async getStudentProfile(idUser) {
        const query = `
            SELECT u."idUser", u."Nom", u."Prenom", u."Email", u."DateNaissance",
                   e."Specialite", e."Annee", e."level", e."xp"
            FROM "USER" u
            INNER JOIN "ETUDIANT" e ON u."idUser" = e."idUser"
            WHERE u."idUser" = $1
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    },

    async getEnrolledCourses(idUser) {
        const query = `
            SELECT c.*, ec."completed", ec."progress", ec."completedAt",
                   ec."tempsDebut", ec."tempsFin", ec."tempsConcentration"
            FROM "COURS" c
            INNER JOIN "ETUDIANT_COURS" ec ON c."idCours" = ec."idCours"
            WHERE ec."idUser" = $1
            ORDER BY ec."completedAt" DESC NULLS LAST
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows;
    },

    async getEnrolledExercises(idUser) {
        const query = `
            SELECT ex.*, ee."completed", ee."score", ee."completedAt"
            FROM "EXERCISE" ex
            INNER JOIN "ETUDIANT_EXERCICE" ee ON ex."id" = ee."idExercice"
            WHERE ee."idUser" = $1
            ORDER BY ee."completedAt" DESC NULLS LAST
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows;
    },

    async getAchievements(idUser) {
        const query = `
            SELECT a.*, sa."unlockedAt"
            FROM "ACHIEVEMENT" a
            INNER JOIN "STUDENT_ACHIEVEMENT" sa ON a."idAchievement" = sa."idAchievement"
            WHERE sa."idUser" = $1
            ORDER BY sa."unlockedAt" DESC
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows;
    },

    async getAllAchievements() {
        const query = 'SELECT * FROM "ACHIEVEMENT" ORDER BY "xpReward" ASC';
        const result = await pool.query(query);
        return result.rows;
    },

    async getProgressStats(idUser) {
        const query = `
            SELECT
                COUNT(DISTINCT ec."idCours") as total_courses_enrolled,
                COUNT(DISTINCT CASE WHEN ec."completed" = TRUE THEN ec."idCours" END) as courses_completed,
                COUNT(DISTINCT ee."idExercice") as total_exercises_enrolled,
                COUNT(DISTINCT CASE WHEN ee."completed" = TRUE THEN ee."idExercice" END) as exercises_completed,
                COALESCE(AVG(CASE WHEN ee."completed" = TRUE THEN ee."score" END), 0) as avg_score
            FROM "ETUDIANT" e
            LEFT JOIN "ETUDIANT_COURS" ec ON e."idUser" = ec."idUser"
            LEFT JOIN "ETUDIANT_EXERCICE" ee ON e."idUser" = ee."idUser"
            WHERE e."idUser" = $1
            GROUP BY e."idUser"
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    },

    async updateStudentXP(idUser, xpToAdd) {
        const query = `
            UPDATE "ETUDIANT"
            SET "xp" = "xp" + $1,
                "level" = FLOOR(("xp" + $1) / 100) + 1
            WHERE "idUser" = $2
            RETURNING "level", "xp"
        `;
        const result = await pool.query(query, [xpToAdd, idUser]);
        return result.rows[0];
    },

    async unlockAchievement(idUser, idAchievement) {
        const query = `
            INSERT INTO "STUDENT_ACHIEVEMENT" ("idUser", "idAchievement")
            VALUES ($1, $2)
            ON CONFLICT ("idUser", "idAchievement") DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, idAchievement]);
        return result.rows[0];
    },

    async hasAchievement(idUser, idAchievement) {
        const query = `
            SELECT * FROM "STUDENT_ACHIEVEMENT"
            WHERE "idUser" = $1 AND "idAchievement" = $2
        `;
        const result = await pool.query(query, [idUser, idAchievement]);
        return result.rows.length > 0;
    }
};

module.exports = profileModel;
