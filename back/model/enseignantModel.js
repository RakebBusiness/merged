const pool = require('../config/database');

const enseignantModel = {
    async create(enseignantData) {
        const { idUser, specialite, grade } = enseignantData;
        const query = `
            INSERT INTO "ENSEIGNANT" ("idUser", "Specialite", "Grade")
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, specialite, grade]);
        return result.rows[0];
    },

    async findById(idUser) {
        const query = `
            SELECT u.*, en."Specialite", en."Grade"
            FROM "USER" u
            INNER JOIN "ENSEIGNANT" en ON u."idUser" = en."idUser"
            WHERE u."idUser" = $1
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    },

    async update(idUser, enseignantData) {
        const { specialite, grade } = enseignantData;
        const query = `
            UPDATE "ENSEIGNANT"
            SET "Specialite" = $1, "Grade" = $2
            WHERE "idUser" = $3
            RETURNING *
        `;
        const result = await pool.query(query, [specialite, grade, idUser]);
        return result.rows[0];
    },

    async getAll() {
        const query = `
            SELECT u.*, en."Specialite", en."Grade"
            FROM "USER" u
            INNER JOIN "ENSEIGNANT" en ON u."idUser" = en."idUser"
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = enseignantModel;
