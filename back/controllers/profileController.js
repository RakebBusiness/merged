const profileModel = require('../model/profileModel');

const profileController = {
    async getStudentProgress(req, res) {
        try {
            const userId = req.userId;
            const role = req.role;

            if (role !== 'etudiant') {
                return res.status(403).json({ error: 'Only students have progress profiles' });
            }

            const profile = await profileModel.getStudentProfile(userId);
            if (!profile) {
                return res.status(404).json({ error: 'Student profile not found' });
            }

            const enrolledCourses = await profileModel.getEnrolledCourses(userId);
            const enrolledExercises = await profileModel.getEnrolledExercises(userId);
            const achievements = await profileModel.getAchievements(userId);
            const allAchievements = await profileModel.getAllAchievements();
            const stats = await profileModel.getProgressStats(userId);

            const completedCourses = enrolledCourses.filter(c => c.completed);
            const completedExercises = enrolledExercises.filter(e => e.completed);
            const inProgressCourses = enrolledCourses.filter(c => !c.completed);
            const inProgressExercises = enrolledExercises.filter(e => !e.completed);

            const progressPercentage = stats.total_exercises_enrolled > 0
                ? Math.round((stats.exercises_completed / stats.total_exercises_enrolled) * 100)
                : 0;

            const xpToNextLevel = ((profile.level) * 100) - profile.xp;

            const unlockedAchievementIds = achievements.map(a => a.idAchievement);
            const lockedAchievements = allAchievements.filter(
                a => !unlockedAchievementIds.includes(a.idAchievement)
            );

            res.json({
                profile: {
                    idUser: profile.idUser,
                    nom: profile.Nom,
                    prenom: profile.Prenom,
                    email: profile.Email,
                    dateNaissance: profile.DateNaissance,
                    specialite: profile.Specialite,
                    annee: profile.Annee,
                    level: profile.level,
                    xp: profile.xp,
                    xpToNextLevel
                },
                statistics: {
                    totalCoursesEnrolled: parseInt(stats.total_courses_enrolled) || 0,
                    coursesCompleted: parseInt(stats.courses_completed) || 0,
                    totalExercisesEnrolled: parseInt(stats.total_exercises_enrolled) || 0,
                    exercisesCompleted: parseInt(stats.exercises_completed) || 0,
                    averageScore: parseFloat(stats.avg_score).toFixed(2),
                    progressPercentage
                },
                courses: {
                    completed: completedCourses,
                    inProgress: inProgressCourses
                },
                exercises: {
                    completed: completedExercises,
                    inProgress: inProgressExercises
                },
                achievements: {
                    unlocked: achievements,
                    locked: lockedAchievements,
                    totalUnlocked: achievements.length,
                    totalAvailable: allAchievements.length
                }
            });
        } catch (err) {
            console.error('Error fetching student progress:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async markExerciseComplete(req, res) {
        try {
            const { id } = req.params;
            const { score } = req.body;
            const userId = req.userId;
            const role = req.role;

            if (role !== 'etudiant') {
                return res.status(403).json({ error: 'Only students can mark exercises as complete' });
            }

            const pool = require('../config/database');
            const updateQuery = `
                UPDATE "ETUDIANT_EXERCICE"
                SET "completed" = TRUE, "score" = $1, "completedAt" = CURRENT_TIMESTAMP
                WHERE "idUser" = $2 AND "idExercice" = $3
                RETURNING *
            `;
            await pool.query(updateQuery, [score || 0, userId, id]);

            const xpGained = 10;
            await profileModel.updateStudentXP(userId, xpGained);

            await profileController.checkAndUnlockAchievements(userId);

            res.json({ message: 'Exercise marked as complete', xpGained });
        } catch (err) {
            console.error('Error marking exercise complete:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async markCourseComplete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            if (role !== 'etudiant') {
                return res.status(403).json({ error: 'Only students can mark courses as complete' });
            }

            const pool = require('../config/database');
            const updateQuery = `
                UPDATE "ETUDIANT_COURS"
                SET "completed" = TRUE, "progress" = 100, "completedAt" = CURRENT_TIMESTAMP
                WHERE "idUser" = $1 AND "idCours" = $2
                RETURNING *
            `;
            await pool.query(updateQuery, [userId, id]);

            const xpGained = 50;
            await profileModel.updateStudentXP(userId, xpGained);

            await profileController.checkAndUnlockAchievements(userId);

            res.json({ message: 'Course marked as complete', xpGained });
        } catch (err) {
            console.error('Error marking course complete:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async checkAndUnlockAchievements(userId) {
        try {
            const stats = await profileModel.getProgressStats(userId);
            const achievementChecks = [
                { id: 1, condition: stats.exercises_completed >= 1 },
                { id: 2, condition: stats.total_courses_enrolled >= 1 },
                { id: 3, condition: stats.exercises_completed >= 5 },
                { id: 4, condition: stats.exercises_completed >= 10 },
                { id: 5, condition: stats.courses_completed >= 1 },
                { id: 6, condition: stats.exercises_completed >= 20 },
                { id: 7, condition: stats.courses_completed >= 3 }
            ];

            const allAchievements = await profileModel.getAllAchievements();

            for (const check of achievementChecks) {
                if (check.condition) {
                    const hasIt = await profileModel.hasAchievement(userId, check.id);
                    if (!hasIt) {
                        await profileModel.unlockAchievement(userId, check.id);
                        const achievement = allAchievements.find(a => a.idAchievement === check.id);
                        if (achievement && achievement.xpReward) {
                            await profileModel.updateStudentXP(userId, achievement.xpReward);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error checking achievements:', err);
        }
    }
};

module.exports = profileController;
