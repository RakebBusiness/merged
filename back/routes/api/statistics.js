const express = require('express');
const router = express.Router();
const pool = require('../../config/database');
const verifyJWT = require('../../middleware/verifyJWT');

// Apply JWT verification to all routes
router.use(verifyJWT);

// Get teacher statistics
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Total students enrolled in teacher's courses
        const studentsQuery = `
            SELECT COUNT(DISTINCT ec."idUser") as total
            FROM "ETUDIANT_COURS" ec
            JOIN "COURS" c ON c."idCours" = ec."idCours"
            WHERE c."idEnseignant" = $1
        `;
        const studentsResult = await pool.query(studentsQuery, [teacherId]);

        // Total courses published by teacher
        const coursesQuery = `
            SELECT COUNT(*) as total
            FROM "COURS"
            WHERE "idEnseignant" = $1
        `;
        const coursesResult = await pool.query(coursesQuery, [teacherId]);

        // Total exercises for teacher's courses
        const exercisesQuery = `
            SELECT COUNT(*) as total
            FROM "EXERCICE" e
            JOIN "COURS" c ON c."idCours" = e."idCours"
            WHERE c."idEnseignant" = $1
        `;
        const exercisesResult = await pool.query(exercisesQuery, [teacherId]);

        // Average completion rate
        const completionQuery = `
            SELECT AVG("progress") as avg_progress
            FROM "ETUDIANT_COURS" ec
            JOIN "COURS" c ON c."idCours" = ec."idCours"
            WHERE c."idEnseignant" = $1
        `;
        const completionResult = await pool.query(completionQuery, [teacherId]);

        res.json({
            totalStudents: parseInt(studentsResult.rows[0].total),
            totalCourses: parseInt(coursesResult.rows[0].total),
            totalExercises: parseInt(exercisesResult.rows[0].total),
            avgCompletion: Math.round(parseFloat(completionResult.rows[0].avg_progress) || 0)
        });
    } catch (error) {
        console.error('Error fetching teacher statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// Get course performance data
router.get('/courses/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;

        const query = `
            SELECT
                c."idCours",
                c."titre" as name,
                COUNT(DISTINCT ec."idUser") as students,
                COALESCE(AVG(ec."progress"), 0) as completion
            FROM "COURS" c
            LEFT JOIN "ETUDIANT_COURS" ec ON ec."idCours" = c."idCours"
            WHERE c."idEnseignant" = $1
            GROUP BY c."idCours", c."titre"
            ORDER BY students DESC
            LIMIT 5
        `;

        const result = await pool.query(query, [teacherId]);

        const coursesData = result.rows.map(row => ({
            name: row.name,
            students: parseInt(row.students),
            completion: Math.round(parseFloat(row.completion))
        }));

        res.json(coursesData);
    } catch (error) {
        console.error('Error fetching course performance:', error);
        res.status(500).json({ message: 'Error fetching course performance' });
    }
});

// Get student progress distribution
router.get('/progress/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;

        const query = `
            SELECT
                SUM(CASE WHEN ec."completed" = true THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN ec."progress" > 0 AND ec."progress" < 100 AND ec."completed" = false THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN ec."progress" = 0 THEN 1 ELSE 0 END) as just_started
            FROM "ETUDIANT_COURS" ec
            JOIN "COURS" c ON c."idCours" = ec."idCours"
            WHERE c."idEnseignant" = $1
        `;

        const result = await pool.query(query, [teacherId]);
        const data = result.rows[0];

        res.json({
            completed: parseInt(data.completed) || 0,
            inProgress: parseInt(data.in_progress) || 0,
            justStarted: parseInt(data.just_started) || 0
        });
    } catch (error) {
        console.error('Error fetching progress distribution:', error);
        res.status(500).json({ message: 'Error fetching progress distribution' });
    }
});

// Get recent activity
router.get('/activity/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;

        const query = `
            SELECT
                'enrollment' as type,
                c."titre" as title,
                ec."enrolledAt" as time,
                COUNT(*) OVER (PARTITION BY c."idCours", DATE(ec."enrolledAt")) as count
            FROM "ETUDIANT_COURS" ec
            JOIN "COURS" c ON c."idCours" = ec."idCours"
            WHERE c."idEnseignant" = $1
            ORDER BY ec."enrolledAt" DESC
            LIMIT 10
        `;

        const result = await pool.query(query, [teacherId]);

        const activities = result.rows.map(row => ({
            type: row.type,
            title: row.title,
            time: row.time,
            count: parseInt(row.count)
        }));

        res.json(activities);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Error fetching recent activity' });
    }
});

module.exports = router;
