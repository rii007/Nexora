const express = require('express');
const { getHistory, updateHistoryItem, deleteHistoryItem } = require('../controllers/historyController');
const { requireAuth } = require('../middleware/auth');

const historyRoutes = express.Router();

historyRoutes.get('/', requireAuth, getHistory);
historyRoutes.patch('/:queryId', requireAuth, updateHistoryItem);
historyRoutes.delete('/:queryId', requireAuth, deleteHistoryItem);

module.exports = { historyRoutes };
