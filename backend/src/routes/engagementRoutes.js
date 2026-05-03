const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { routeQueryToTool, recordToolClick, getDashboardStats } = require('../controllers/engagementController');

const engagementRoutes = express.Router();

engagementRoutes.post('/route', requireAuth, routeQueryToTool);
engagementRoutes.post('/tool-click', requireAuth, recordToolClick);
engagementRoutes.get('/stats', requireAuth, getDashboardStats);

module.exports = { engagementRoutes };
