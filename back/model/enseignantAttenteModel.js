const pool = require('../config/database');

const create = async ({ idUser, specialite, grade }) => {
    console.log("Création enseignant attente:", idUser, specialite, grade);
    const query = `
        INSERT INTO "ENSEIGNANT_ATTENTE" ("idUser", "Specialite", "Grade")
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [idUser, specialite, grade];
    const result = await pool.query(query, values);
    console.log("Résultat query:", result.rows[0]);
    return result.rows[0];
};


const findById = async (idUser) => {
    const query = `SELECT * FROM "ENSEIGNANT_ATTENTE" WHERE "idUser" = $1`;
    const result = await pool.query(query, [idUser]);
    return result.rows[0];
};

module.exports = { create, findById };
