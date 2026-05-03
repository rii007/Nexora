const express = require('express');
const { handleQuery } = require('../controllers/queryController');
const { requireAuth } = require('../middleware/auth');

const queryRoutes = express.Router();

queryRoutes.post('/', requireAuth, handleQuery);

module.exports = { queryRoutes };
