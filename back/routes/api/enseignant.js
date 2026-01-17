const express = require('express');
const router = express.Router();
const enseignantController = require('../../controllers/teacherController');

// Liste enseignants approuvés / en attente
router.get('/approved', enseignantController.getApproved);
router.get('/pending', enseignantController.getPending);

// Approve / delete pending
router.post('/approve/:id', enseignantController.approve);
router.delete('/pending/:id', enseignantController.deletePending);

// Suspend / reactivate teachers
router.post('/suspend/:id', enseignantController.suspend);
router.post('/reactivate/:id', enseignantController.reactivate);

// Profil complet d'un enseignant
router.get('/profile/:id', enseignantController.getProfile);

module.exports = router;
