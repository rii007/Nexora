const express = require('express');
const { authRoutes } = require('./authRoutes');
const { queryRoutes } = require('./queryRoutes');
const { historyRoutes } = require('./historyRoutes');
const { feedbackRoutes } = require('./feedbackRoutes');
const { goalRoutes } = require('./goalRoutes');
const { toolsRoutes } = require('./toolsRoutes');
const { learningRoutes } = require('./learningRoutes');
const { engagementRoutes } = require('./engagementRoutes');

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/query', queryRoutes);
apiRouter.use('/history', historyRoutes);
apiRouter.use('/feedback', feedbackRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/tools', toolsRoutes);
apiRouter.use('/learning', learningRoutes);
apiRouter.use('/', engagementRoutes);

module.exports = { apiRouter };
