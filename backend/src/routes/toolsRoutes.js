const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listTools, recommendTools, trackToolInteraction } = require('../controllers/toolsController');

const toolsRoutes = express.Router();

toolsRoutes.get('/', requireAuth, listTools);
toolsRoutes.post('/recommend', requireAuth, recommendTools);
toolsRoutes.post('/:toolId/interactions', requireAuth, trackToolInteraction);

module.exports = { toolsRoutes };
