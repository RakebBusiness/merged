const express = require('express');
const router = express.Router();
const exerciceController = require('../../controllers/exerciceController');
const verifyJWT = require('../../middleware/verifyJWT');
const optionalJWT = require('../../middleware/optionalJWT');

router.get('/', optionalJWT, exerciceController.getAllExercises);
router.get('/enrolled', verifyJWT, exerciceController.getEnrolledExercises);
router.get('/:id', verifyJWT, exerciceController.getExerciseById);
router.post('/', verifyJWT, exerciceController.createExercise);
router.put('/:id', verifyJWT, exerciceController.updateExercise);
router.delete('/:id', verifyJWT, exerciceController.deleteExercise);
router.post('/:id/enroll', verifyJWT, exerciceController.enrollExercise);

module.exports = router;
