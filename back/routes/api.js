const express = require('express');
const router = express.Router();
const { handleNewUser } = require('../controllers/registerController');
const { handleLogin } = require('../controllers/authController');

router.post('/signup', handleNewUser);
router.post('/login', handleLogin);

module.exports = router;
