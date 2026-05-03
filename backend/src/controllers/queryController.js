const { z } = require('zod');
const { classifyIntent } = require('../services/intentClassifier');
const { routeAndGenerate } = require('../services/aiRouter');
const { getSessionContext, appendSessionTurn } = require('../services/contextService');
const { preferenceBoost, rankToolSuggestions, updateUserPreferenceScores } = require('../services/personalizationService');
const { buildToolSuggestionMessage } = require('../services/suggestionService');
const { User } = require('../models/User');
const { Query } = require('../models/Query');
const { AIResponse } = require('../models/AIResponse');

const querySchema = z.object({
  text: z.string().min(3),
  sessionId: z.string().min(3),
});

async function handleQuery(req, res, next) {
  try {
    const payload = querySchema.parse(req.body);
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const intentResult = await classifyIntent(payload.text);
    const boost = preferenceBoost(user.intentPreferences, intentResult.intent);
    const contextSummary = await getSessionContext(userId, payload.sessionId);

    const prompt = contextSummary
      ? `Conversation context:\n${contextSummary}\n\nUser request:\n${payload.text}`
      : payload.text;

    const routed = await routeAndGenerate({
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      prompt,
      personalizationBoost: boost,
    });

    const query = await Query.create({
      userId,
      sessionId: payload.sessionId,
      text: payload.text,
      detectedIntent: intentResult.intent,
      confidence: routed.confidence,
      modelChosen: routed.model,
      contextSummary,
    });

    const aiResponse = await AIResponse.create({
      queryId: query._id,
      userId,
      provider: routed.provider,
      model: routed.model,
      responseText: routed.responseText,
      latencyMs: routed.latencyMs,
      tokenEstimate: Math.ceil(routed.responseText.length / 4),
      fallbackUsed: routed.fallbackUsed,
    });

    await appendSessionTurn(userId, payload.sessionId, 'user', payload.text, intentResult.intent);
    await appendSessionTurn(userId, payload.sessionId, 'assistant', routed.responseText, intentResult.intent);
    await updateUserPreferenceScores(userId, intentResult.intent);

    const suggestions = rankToolSuggestions(user.intentPreferences);

    return res.status(200).json({
      queryId: query._id,
      responseId: aiResponse._id,
      intent: intentResult.intent,
      confidence: Number(routed.confidence.toFixed(2)),
      provider: routed.provider,
      model: routed.model,
      fallbackUsed: routed.fallbackUsed,
      response: routed.responseText,
      toolSuggestion: buildToolSuggestionMessage(intentResult.intent),
      recommendedIntents: suggestions,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { handleQuery };
