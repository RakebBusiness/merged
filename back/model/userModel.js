const pool = require('../config/database');

const userModel = {
    async findByEmail(email) {
        const query = 'SELECT * FROM "USER" WHERE "Email" = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    async findById(id) {
        const query = 'SELECT * FROM "USER" WHERE "idUser" = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async create(userData) {
        const { idUser, nom, prenom, dateNaissance, email, motDePasse } = userData;
        const query = `
            INSERT INTO "USER" ("idUser", "Nom", "Prenom", "DateNaissance", "Email", "motDePasse")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, nom, prenom, dateNaissance, email, motDePasse]);
        return result.rows[0];
    },

    async update(id, userData) {
        const { nom, prenom, dateNaissance, email } = userData;
        const query = `
            UPDATE "USER"
            SET "Nom" = $1, "Prenom" = $2, "DateNaissance" = $3, "Email" = $4
            WHERE "idUser" = $5
            RETURNING *
        `;
        const result = await pool.query(query, [nom, prenom, dateNaissance, email, id]);
        return result.rows[0];
    },

    async updatePassword(id, hashedPassword) {
        const query = `
            UPDATE "USER"
            SET "motDePasse" = $1
            WHERE "idUser" = $2
            RETURNING *
        `;
        const result = await pool.query(query, [hashedPassword, id]);
        return result.rows[0];
    },

    async delete(id) {
        const query = 'DELETE FROM "USER" WHERE "idUser" = $1';
        await pool.query(query, [id]);
    },

    async getNextId() {
        const query = 'SELECT COALESCE(MAX("idUser"), 0) + 1 as next_id FROM "USER"';
        const result = await pool.query(query);
        return result.rows[0].next_id;
    }
};

module.exports = userModel;
