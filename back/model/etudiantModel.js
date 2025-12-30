const pool = require('../config/database');

const etudiantModel = {
    async create(etudiantData) {
        const { idUser, specialite, annee } = etudiantData;
        const query = `
            INSERT INTO "ETUDIANT" ("idUser", "Specialite", "Annee")
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, specialite, annee]);
        return result.rows[0];
    },

    async findById(idUser) {
        const query = `
            SELECT u.*, e."Specialite", e."Annee"
            FROM "USER" u
            INNER JOIN "ETUDIANT" e ON u."idUser" = e."idUser"
            WHERE u."idUser" = $1
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    },

    async update(idUser, etudiantData) {
        const { specialite, annee } = etudiantData;
        const query = `
            UPDATE "ETUDIANT"
            SET "Specialite" = $1, "Annee" = $2
            WHERE "idUser" = $3
            RETURNING *
        `;
        const result = await pool.query(query, [specialite, annee, idUser]);
        return result.rows[0];
    },

    async getAll() {
        const query = `
            SELECT u.*, e."Specialite", e."Annee"
            FROM "USER" u
            INNER JOIN "ETUDIANT" e ON u."idUser" = e."idUser"
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = etudiantModel;
