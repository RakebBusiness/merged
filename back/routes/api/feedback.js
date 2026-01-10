const express = require('express');
const router = express.Router();
const feedbackController = require('../../controllers/feedbackController');

// Routes publiques
router.get('/approved', feedbackController.getApproved);
router.get('/pending', feedbackController.getPending);
router.post('/submit', feedbackController.submitFeedback);

// Routes pour gérer les feedbacks (approve / delete) sans auth
router.post('/approve/:id', feedbackController.approveFeedback);
router.delete('/pending/:id', feedbackController.deletePending);

module.exports = router;
