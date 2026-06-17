const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Route: GET /api/analytics
router.get('/', auth, getAnalytics);

module.exports = router;
