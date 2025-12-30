const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.get('/', profileController.getStudentProgress);
router.post('/exercises/:id/complete', profileController.markExerciseComplete);
router.post('/courses/:id/complete', profileController.markCourseComplete);

module.exports = router;
