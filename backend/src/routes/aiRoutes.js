const express = require('express');
const router = express.Router();
const { getSuggestion } = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Route: POST /api/ai/suggestion
router.post('/suggestion', auth, getSuggestion);

module.exports = router;
