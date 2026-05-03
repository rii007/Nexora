const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const goalRoutes = express.Router();

goalRoutes.get('/', requireAuth, listGoals);
goalRoutes.post('/', requireAuth, createGoal);
goalRoutes.patch('/:goalId', requireAuth, updateGoal);
goalRoutes.delete('/:goalId', requireAuth, deleteGoal);

module.exports = { goalRoutes };
