const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route: POST /api/auth/register
router.post('/register', register);

// Route: POST /api/auth/login
router.post('/login', login);

// Route: PUT /api/auth/profile
router.put('/profile', auth, updateProfile);

module.exports = router;
