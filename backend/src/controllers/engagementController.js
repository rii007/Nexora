const { z } = require('zod');
const { classifyIntent } = require('../services/intentClassifier');
const { chooseToolForIntent, getToolByName } = require('../services/catalogService');
const { Query } = require('../models/Query');
const { ToolClick } = require('../models/ToolClick');
const {
  getOrCreateUserStats,
  refreshAverageScore,
  incrementQueryStats,
  incrementToolClickStats,
} = require('../services/statsService');

const routeSchema = z.object({
  text: z.string().min(3),
  sessionId: z.string().min(3).optional(),
});

const toolClickSchema = z.object({
  toolName: z.string().min(2),
});

function estimateSavedHours(text) {
  const base = 0.2;
  const extra = Math.min(1.2, text.length / 300);
  return Number((base + extra).toFixed(2));
}

async function routeQueryToTool(req, res, next) {
  try {
    const payload = routeSchema.parse(req.body);
    const userId = req.user.id;
    const intentResult = await classifyIntent(payload.text);
    const selectedTool = chooseToolForIntent(intentResult.intent);

    const query = await Query.create({
      userId,
      sessionId: payload.sessionId || `session-${Date.now()}`,
      text: payload.text,
      detectedIntent: intentResult.intent,
      confidence: Number((intentResult.confidence * 100).toFixed(2)),
      modelChosen: selectedTool.name,
      contextSummary: '',
    });

    await incrementQueryStats(userId, estimateSavedHours(payload.text));
    await refreshAverageScore(userId);

    return res.status(200).json({
      queryId: query._id,
      toolName: selectedTool.name,
      toolUrl: selectedTool.url,
      intent: intentResult.intent,
      timestamp: query.createdAt,
    });
  } catch (error) {
    return next(error);
  }
}

async function recordToolClick(req, res, next) {
  try {
    const payload = toolClickSchema.parse(req.body);
    const userId = req.user.id;
    const tool = getToolByName(payload.toolName);

    await ToolClick.create({
      userId,
      toolName: payload.toolName,
      toolUrl: tool?.url || '',
    });

    const stats = await incrementToolClickStats(userId);

    return res.status(200).json({
      message: 'Tool click tracked',
      queries: stats.queries,
    });
  } catch (error) {
    return next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const stats = await getOrCreateUserStats(req.user.id);

    return res.status(200).json({
      queries: stats.queries,
      hoursSaved: stats.hoursSaved,
      avgScore: stats.avgScore,
      isNewUser: stats.queries === 0,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  routeQueryToTool,
  recordToolClick,
  getDashboardStats,
};
