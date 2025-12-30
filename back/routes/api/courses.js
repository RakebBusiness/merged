const express = require('express');
const router = express.Router();
const coursController = require('../../controllers/coursController');
const verifyJWT = require('../../middleware/verifyJWT');
const optionalJWT = require('../../middleware/optionalJWT');

router.get('/', optionalJWT, coursController.getAllCourses);
router.get('/enrolled', verifyJWT, coursController.getEnrolledCourses);
router.get('/:id', optionalJWT, coursController.getCourseById);
router.post('/', verifyJWT, coursController.createCourse);
router.put('/:id', verifyJWT, coursController.updateCourse);
router.delete('/:id', verifyJWT, coursController.deleteCourse);
router.post('/:id/enroll', verifyJWT, coursController.enrollCourse);
router.post('/:id/finish', verifyJWT, coursController.finishCourse);
router.patch('/:id/progress', verifyJWT, coursController.updateProgress);

module.exports = router;
