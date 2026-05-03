const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listLearningPaths,
  enrollPath,
  openModule,
  trackToolUsage,
  getLearningSummary,
  unenrollPath,
} = require('../controllers/learningController');

const learningRoutes = express.Router();

learningRoutes.get('/paths', requireAuth, listLearningPaths);
learningRoutes.get('/summary', requireAuth, getLearningSummary);
learningRoutes.post('/paths/:pathId/enroll', requireAuth, enrollPath);
learningRoutes.post('/paths/:pathId/modules/:moduleId/open', requireAuth, openModule);
learningRoutes.post('/tool-usage', requireAuth, trackToolUsage);
learningRoutes.delete('/paths/:pathId/enroll', requireAuth, unenrollPath);

module.exports = { learningRoutes };
