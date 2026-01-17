const pool = require('../config/database');
const coursModel = require('../model/coursModel');
const exerciceModel = require('../model/exerciceModel');

// Transformation pour le front
const transformEnseignant = (row) => ({
    idUser: row.idUser,
    Specialite: row.Specialite,
    Grade: row.Grade,
    suspended: row.suspended || false,
    user: {
        idUser: row.idUser,
        nom: row.Nom,
        prenom: row.Prenom,
        email: row.Email
    }
});

const enseignantController = {
    async getApproved(req, res) {
        try {
            const result = await pool.query(`
                SELECT e.*, u."Nom", u."Prenom", u."Email"
                FROM "ENSEIGNANT" e
                JOIN "USER" u ON e."idUser" = u."idUser"
                ORDER BY u."Nom", u."Prenom"
            `);

            const enseignants = result.rows.map(transformEnseignant);
            res.json(enseignants);
        } catch (err) {
            console.error('Error fetching approved enseignants:', err);
            res.status(500).json({ message: 'Error fetching approved enseignants' });
        }
    },

    async getPending(req, res) {
        try {
            const result = await pool.query(`
                SELECT ea.*, u."Nom", u."Prenom", u."Email"
                FROM "ENSEIGNANT_ATTENTE" ea
                JOIN "USER" u ON ea."idUser" = u."idUser"
                ORDER BY u."Nom", u."Prenom"
            `);

            const enseignants = result.rows.map(transformEnseignant);
            res.json(enseignants);
        } catch (err) {
            console.error('Error fetching pending enseignants:', err);
            res.status(500).json({ message: 'Error fetching pending enseignants' });
        }
    },

    async approve(req, res) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const { id } = req.params;
            const selectResult = await client.query(
                'SELECT * FROM "ENSEIGNANT_ATTENTE" WHERE "idUser" = $1',
                [id]
            );

            if (!selectResult.rows.length) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Enseignant not found' });
            }

            const enseignant = selectResult.rows[0];

            await client.query(
                'INSERT INTO "ENSEIGNANT" ("idUser", "Specialite", "Grade") VALUES ($1, $2, $3)',
                [enseignant.idUser, enseignant.Specialite, enseignant.Grade]
            );

            await client.query(
                'DELETE FROM "ENSEIGNANT_ATTENTE" WHERE "idUser" = $1',
                [id]
            );

            await client.query('COMMIT');
            res.json({ message: 'Enseignant approved successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error approving enseignant:', err);
            res.status(500).json({ message: 'Error approving enseignant' });
        } finally {
            client.release();
        }
    },

    async deletePending(req, res) {
        try {
            const { id } = req.params;

            // 1. Supprimer de la table ENSEIGNANT_ATTENTE
            const result = await pool.query(
                'DELETE FROM "ENSEIGNANT_ATTENTE" WHERE "idUser" = $1 RETURNING *',
                [id]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Enseignant not found' });
            }

            // 2. Supprimer aussi de la table USER
            await pool.query(
                'DELETE FROM "USER" WHERE "idUser" = $1',
                [id]
            );

            res.json({ message: 'Enseignant deleted successfully' });

        } catch (err) {
            console.error('Error deleting pending enseignant:', err);
            res.status(500).json({ message: 'Error deleting pending enseignant' });
        }
    },


    async getProfile(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query(`
                SELECT e.*, u."Nom", u."Prenom", u."Email"
                FROM "ENSEIGNANT" e
                JOIN "USER" u ON e."idUser" = u."idUser"
                WHERE e."idUser" = $1
            `, [id]);

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            const teacher = result.rows[0];
            const courses = await coursModel.findByTeacher(id);
            const exercises = await exerciceModel.findByTeacher(id);

            res.json({
                idUser: teacher.idUser,
                nom: teacher.Nom,
                prenom: teacher.Prenom,
                email: teacher.Email,
                Specialite: teacher.Specialite,
                Grade: teacher.Grade,
                courses,
                exercises: exercises.map(ex => ({
                    id: ex.id,
                    title: ex.title,
                    type: ex.type,
                    difficulty: ex.difficulty,
                    estimated_duration: ex.estimated_duration,
                    idCours: ex.idCours
                }))
            });
        } catch (err) {
            console.error('Error fetching teacher profile:', err);
            res.status(500).json({ message: err.message });
        }
    },

    async suspend(req, res) {
        try {
            const { id } = req.params;
            
            const result = await pool.query(
                'UPDATE "ENSEIGNANT" SET "suspended" = TRUE WHERE "idUser" = $1 RETURNING *',
                [id]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            res.json({ message: 'Teacher suspended successfully' });
        } catch (err) {
            console.error('Error suspending teacher:', err);
            res.status(500).json({ message: 'Error suspending teacher' });
        }
    },

    async reactivate(req, res) {
        try {
            const { id } = req.params;
            
            const result = await pool.query(
                'UPDATE "ENSEIGNANT" SET "suspended" = FALSE WHERE "idUser" = $1 RETURNING *',
                [id]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            res.json({ message: 'Teacher reactivated successfully' });
        } catch (err) {
            console.error('Error reactivating teacher:', err);
            res.status(500).json({ message: 'Error reactivating teacher' });
        }
    }
};

module.exports = enseignantController;
