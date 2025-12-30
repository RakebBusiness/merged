const express = require('express');
const router = express.Router();
const enseignantModel = require('../../model/enseignantModel');
const coursModel = require('../../model/coursModel');
const exerciceModel = require('../../model/exerciceModel');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await enseignantModel.findById(id);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const courses = await coursModel.findByTeacher(id);
        const exercises = await exerciceModel.findByTeacher(id);

        const teacherProfile = {
            idUser: teacher.idUser,
            nom: teacher.Nom,
            prenom: teacher.Prenom,
            email: teacher.Email,
            specialite: teacher.Specialite,
            grade: teacher.Grade,
            courses: courses,
            exercises: exercises.map(ex => ({
                id: ex.id,
                title: ex.title,
                type: ex.type,
                difficulty: ex.difficulty,
                estimated_duration: ex.estimated_duration,
                idCours: ex.idCours
            }))
        };

        res.json(teacherProfile);
    } catch (err) {
        console.error('Error fetching teacher profile:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
