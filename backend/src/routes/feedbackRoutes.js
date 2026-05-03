const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const { requireAuth } = require('../middleware/auth');

const feedbackRoutes = express.Router();

feedbackRoutes.post('/', requireAuth, submitFeedback);

module.exports = { feedbackRoutes };
