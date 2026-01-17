const pool = require('../config/database');

const adminModel = {
    findById: async (idUser) => {
        const query = `
            SELECT 
                u."idUser",
                u."Nom",
                u."Prenom",
                u."DateNaissance",
                u."Email",
                u."motDePasse",
                a."role",
                a."createdAt"
            FROM "USER" u
            INNER JOIN "ADMIN" a ON u."idUser" = a."idUser"
            WHERE u."idUser" = $1
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const query = `
            SELECT 
                u."idUser",
                u."Nom",
                u."Prenom",
                u."DateNaissance",
                u."Email",
                u."motDePasse",
                a."role",
                a."createdAt"
            FROM "USER" u
            INNER JOIN "ADMIN" a ON u."idUser" = a."idUser"
            WHERE u."Email" = $1
        `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    create: async (userData, adminData = {}) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert into USER table
            const userQuery = `
                INSERT INTO "USER" ("Nom", "Prenom", "DateNaissance", "Email", "motDePasse")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING "idUser"
            `;
            const userResult = await client.query(userQuery, [
                userData.Nom,
                userData.Prenom,
                userData.DateNaissance,
                userData.Email,
                userData.motDePasse
            ]);

            const idUser = userResult.rows[0].idUser;

            // Insert into ADMIN table
            const adminQuery = `
                INSERT INTO "ADMIN" ("idUser", "role")
                VALUES ($1, $2)
                RETURNING *
            `;
            const adminResult = await client.query(adminQuery, [
                idUser,
                adminData.role || 'admin'
            ]);

            await client.query('COMMIT');
            return { idUser, ...adminResult.rows[0] };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    getAll: async () => {
        const query = `
            SELECT 
                u."idUser",
                u."Nom",
                u."Prenom",
                u."DateNaissance",
                u."Email",
                a."role",
                a."createdAt"
            FROM "USER" u
            INNER JOIN "ADMIN" a ON u."idUser" = a."idUser"
            ORDER BY a."createdAt" DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    delete: async (idUser) => {
        const query = 'DELETE FROM "ADMIN" WHERE "idUser" = $1 RETURNING *';
        const result = await pool.query(query, [idUser]);
        return result.rows[0];
    }
};

module.exports = adminModel;