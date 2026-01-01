const coursModel = require('../model/coursModel');
const etudiantModel = require('../model/etudiantModel');

const coursController = {
    async getAllCourses(req, res) {
        try {
            const userId = req.userId;
            const role = req.role;
            const myCoursesOnly = req.query.my === 'true';

            let courses;
            if (!userId || !role) {
                courses = await coursModel.findAll();
            } else if (myCoursesOnly && role === 'enseignant') {
                courses = await coursModel.findByTeacher(userId);
            } else {
                courses = await coursModel.findAll();
            }

            res.json(courses);
        } catch (err) {
            console.error('Error fetching courses:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async getCourseById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const course = await coursModel.findById(id, userId);

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.json(course);
        } catch (err) {
            console.error('Error fetching course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async createCourse(req, res) {
        try {
            const { titre, niveau, description, duree, sections, topics } = req.body;
            const userId = req.userId;
            const role = req.role;

            if (!titre || !niveau || !description) {
                return res.status(400).json({ error: 'Title, level, and description are required' });
            }

            if (role !== 'enseignant' && role !== 'admin') {
                return res.status(403).json({ error: 'Only teachers and admins can create courses' });
            }

            const newCourse = await coursModel.create({
                titre,
                niveau,
                description,
                duree,
                idEnseignant: userId,
                sections: sections || [],
                topics: topics || []
            });

            res.status(201).json(newCourse);
        } catch (err) {
            console.error('Error creating course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const { titre, niveau, description, duree, sections, topics } = req.body;
            const userId = req.userId;
            const role = req.role;

            const course = await coursModel.findById(id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            if (role !== 'admin' && course.idEnseignant !== userId) {
                return res.status(403).json({ error: 'You can only update your own courses' });
            }

            const updatedCourse = await coursModel.update(id, {
                titre,
                niveau,
                description,
                duree,
                sections: sections || [],
                topics: topics || []
            });
            res.json(updatedCourse);
        } catch (err) {
            console.error('Error updating course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            const course = await coursModel.findById(id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            if (role !== 'admin' && course.idEnseignant !== userId) {
                return res.status(403).json({ error: 'You can only delete your own courses' });
            }

            await coursModel.delete(id);
            res.json({ message: 'Course deleted successfully' });
        } catch (err) {
            console.error('Error deleting course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async enrollCourse(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            if (!role || (role !== 'etudiant' && role !== 'enseignant')) {
                return res.status(403).json({ error: 'Only students and teachers can enroll in courses' });
            }

            const course = await coursModel.findById(id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const isAlreadyEnrolled = await coursModel.isEnrolled(userId, id);
            if (isAlreadyEnrolled) {
                return res.status(400).json({ error: 'Already enrolled in this course' });
            }

            await coursModel.enrollStudent(userId, id);
            res.status(201).json({ message: 'Successfully enrolled in course' });
        } catch (err) {
            console.error('Error enrolling in course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async getEnrolledCourses(req, res) {
        try {
            const userId = req.userId;
            const courses = await coursModel.getEnrolledCourses(userId);
            res.json(courses);
        } catch (err) {
            console.error('Error fetching enrolled courses:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async finishCourse(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const role = req.role;

            if (!role || (role !== 'etudiant' && role !== 'enseignant')) {
                return res.status(403).json({ error: 'Only students and teachers can finish courses' });
            }

            const isEnrolled = await coursModel.isEnrolled(userId, id);
            if (!isEnrolled) {
                return res.status(400).json({ error: 'Not enrolled in this course' });
            }

            const result = await coursModel.finishCourse(userId, id);
            res.json({ message: 'Course finished successfully', data: result });
        } catch (err) {
            console.error('Error finishing course:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateProgress(req, res) {
        try {
            const { id } = req.params;
            const { progress } = req.body;
            const userId = req.userId;
            const role = req.role;

            if (!role || (role !== 'etudiant' && role !== 'enseignant')) {
                return res.status(403).json({ error: 'Only students and teachers can update progress' });
            }

            if (typeof progress !== 'number' || progress < 0 || progress > 100) {
                return res.status(400).json({ error: 'Progress must be a number between 0 and 100' });
            }

            const isEnrolled = await coursModel.isEnrolled(userId, id);
            if (!isEnrolled) {
                return res.status(400).json({ error: 'Not enrolled in this course' });
            }

            const result = await coursModel.updateProgress(userId, id, progress);
            res.json({ message: 'Progress updated successfully', data: result });
        } catch (err) {
            console.error('Error updating progress:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateConcentrationTime(req, res) {
        try {
            const { id } = req.params;
            const { focusTime, totalTime } = req.body;
            const userId = req.userId;
            const role = req.role;

            if (!role || (role !== 'etudiant' && role !== 'enseignant')) {
                return res.status(403).json({ error: 'Only students and teachers can update concentration time' });
            }

            if (typeof focusTime !== 'number' || focusTime < 0) {
                return res.status(400).json({ error: 'Focus time must be a positive number' });
            }

            const isEnrolled = await coursModel.isEnrolled(userId, id);
            if (!isEnrolled) {
                return res.status(400).json({ error: 'Not enrolled in this course' });
            }

            const result = await coursModel.updateConcentrationTime(userId, id, focusTime, totalTime);
            res.json({ message: 'Concentration time updated successfully', data: result });
        } catch (err) {
            console.error('Error updating concentration time:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = coursController;
