const exerciceModel = require('../model/exerciceModel');
const etudiantModel = require('../model/etudiantModel');

// Transformation des données de l'exercice pour le front
const transformExerciseData = (exercise) => {
    if (!exercise) return null;

    const transformed = {
        idExercice: exercise.id?.toString(),
        titre: exercise.title,
        Type: exercise.type === 'qcm' ? 'Multiple choice' : exercise.type === 'quiz' ? 'Text Answer' : 'Code',
        enonce: exercise.statement,
        difficulte: exercise.difficulty,
        dureeEstimee: exercise.estimated_duration,
        idEnseignant: exercise.idEnseignant,
        nomEnseignant: exercise.nomEnseignant,
        prenomEnseignant: exercise.prenomEnseignant,
        emailEnseignant: exercise.emailEnseignant,
        idCours: exercise.idCours,
    };

    if (exercise.type === 'qcm' && exercise.options) {
        transformed.options = exercise.options.map(opt => opt.optionText);
        transformed.correctAnswer = exercise.options[exercise.correctOptionIndex]?.optionText;
        transformed.correctOptionIndex = exercise.correctOptionIndex;
    } else if (exercise.type === 'quiz') {
        transformed.correctAnswer = exercise.answer;
    } else if (exercise.type === 'code') {
        transformed.tests = exercise.tests;
    }

    return transformed;
};

const exerciceController = {
    async getAllExercises(req, res) {
        try {
            const userId = req.userId;
            const role = req.role;
            const myExercisesOnly = req.query.my === 'true';

            let exercises;
            if (!userId || !role) {
                exercises = await exerciceModel.findAll();
            } else if (myExercisesOnly && role === 'enseignant') {
                exercises = await exerciceModel.findByTeacher(userId);
            } else {
                exercises = await exerciceModel.findAll();
            }

            const transformedExercises = exercises.map(transformExerciseData);
            res.json(transformedExercises);
        } catch (err) {
            console.error('Error fetching exercises:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async getExerciseById(req, res) {
        try {
            const { id } = req.params;
            const exercise = await exerciceModel.findById(id);

            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            const transformedExercise = transformExerciseData(exercise);
            res.json(transformedExercise);
        } catch (err) {
            console.error('Error fetching exercise:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async createExercise(req, res) {
        try {
            const { title, type, statement, idCours, options, correctOptionIndex, answer, tests } = req.body;
            const userId = req.userId;
            const role = req.role;

            if (!title || !type || !statement) {
                return res.status(400).json({ error: 'Title, type, and statement are required' });
            }

            if (role !== 'enseignant' && role !== 'admin') {
                return res.status(403).json({ error: 'Only teachers and admins can create exercises' });
            }

            if (type === 'qcm' && (!options || options.length === 0)) {
                return res.status(400).json({ error: 'QCM exercises must have options' });
            }

            if (type === 'quiz' && !answer) {
                return res.status(400).json({ error: 'Quiz exercises must have an answer' });
            }

            if (type === 'code' && (!tests || tests.length === 0)) {
                return res.status(400).json({ error: 'Code exercises must have test cases' });
            }

            const newExercise = await exerciceModel.create({
                title,
                type,
                statement,
                idEnseignant: userId,
                idCours,
                options,
                correctOptionIndex,
                answer,
                tests
            });

            res.status(201).json(newExercise);
        } catch (err) {
            console.error('Error creating exercise:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateExercise(req, res) {
        try {
            const { id } = req.params;
            const { title, type, statement, idCours, options, correctOptionIndex, answer, tests } = req.body;
            const userId = req.userId;
            const role = req.role;

            const exercise = await exerciceModel.findById(id);
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            if (role !== 'admin' && exercise.idEnseignant !== userId) {
                return res.status(403).json({ error: 'You can only update your own exercises' });
            }

            if (type === 'qcm' && (!options || options.length === 0)) {
                return res.status(400).json({ error: 'QCM exercises must have options' });
            }

            if (type === 'quiz' && !answer) {
                return res.status(400).json({ error: 'Quiz exercises must have an answer' });
            }

            if (type === 'code' && (!tests || tests.length === 0)) {
                return res.status(400).json({ error: 'Code exercises must have test cases' });
            }

            const updatedExercise = await exerciceModel.update(id, {
                title,
                type,
                statement,
                idCours,
                options,
                correctOptionIndex,
                answer,
                tests
            });

            res.json(updatedExercise);
        } catch (err) {
            console.error('Error updating exercise:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async deleteExercise(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            const exercise = await exerciceModel.findById(id);
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            if (role !== 'admin' && exercise.idEnseignant !== userId) {
                return res.status(403).json({ error: 'You can only delete your own exercises' });
            }

            await exerciceModel.delete(id);
            res.json({ message: 'Exercise deleted successfully' });
        } catch (err) {
            console.error('Error deleting exercise:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async enrollExercise(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            if (role !== 'etudiant') {
                return res.status(403).json({ error: 'Only students can enroll in exercises' });
            }

            const exercise = await exerciceModel.findById(id);
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            const student = await etudiantModel.findById(userId);
            if (!student) {
                return res.status(400).json({ error: 'Student profile not found' });
            }

            const isAlreadyEnrolled = await exerciceModel.isEnrolled(userId, id);
            if (isAlreadyEnrolled) {
                return res.status(400).json({ error: 'Already enrolled in this exercise' });
            }

            await exerciceModel.enrollStudent(userId, id);
            res.status(201).json({ message: 'Successfully enrolled in exercise' });
        } catch (err) {
            console.error('Error enrolling in exercise:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async getEnrolledExercises(req, res) {
        try {
            const userId = req.userId;
            const exercises = await exerciceModel.getEnrolledExercises(userId);
            const transformedExercises = exercises.map(transformExerciseData);
            res.json(transformedExercises);
        } catch (err) {
            console.error('Error fetching enrolled exercises:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = exerciceController;
