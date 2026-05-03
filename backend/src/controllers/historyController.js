const { Query } = require('../models/Query');
const { AIResponse } = require('../models/AIResponse');
const { Feedback } = require('../models/Feedback');
const { UserStats } = require('../models/UserStats');
const { refreshAverageScore } = require('../services/statsService');
const { z } = require('zod');

const updateHistorySchema = z.object({
  query: z.string().min(3).max(500),
});

async function getHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Math.min(Number(req.query.limit || 20), 100);

    const queries = await Query.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();

    const queryIds = queries.map((item) => item._id);
    const responses = await AIResponse.find({ queryId: { $in: queryIds } }).lean();
    const feedback = await Feedback.find({ userId, queryId: { $in: queryIds } }).lean();

    const responseMap = new Map(responses.map((item) => [item.queryId.toString(), item]));
    const feedbackMap = new Map(feedback.map((item) => [item.queryId.toString(), item.rating]));

    const history = queries.map((query) => ({
      id: query._id,
      query: query.text,
      intent: query.detectedIntent,
      model: query.modelChosen,
      confidence: query.confidence,
      createdAt: query.createdAt,
      response: responseMap.get(query._id.toString())?.responseText || '',
      feedbackRating: feedbackMap.get(query._id.toString()) || null,
    }));

    return res.status(200).json({ history });
  } catch (error) {
    return next(error);
  }
}

async function updateHistoryItem(req, res, next) {
  try {
    const userId = req.user.id;
    const payload = updateHistorySchema.parse(req.body);

    const query = await Query.findOneAndUpdate(
      { _id: req.params.queryId, userId },
      { text: payload.query },
      { new: true },
    ).lean();

    if (!query) {
      return res.status(404).json({ message: 'Activity item not found' });
    }

    return res.status(200).json({
      item: {
        id: query._id,
        query: query.text,
        toolUsed: query.modelChosen,
        createdAt: query.createdAt,
      },
      message: 'Activity updated',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteHistoryItem(req, res, next) {
  try {
    const userId = req.user.id;

    const query = await Query.findOneAndDelete({ _id: req.params.queryId, userId }).lean();
    if (!query) {
      return res.status(404).json({ message: 'Activity item not found' });
    }

    await Promise.all([
      AIResponse.deleteOne({ queryId: query._id }),
      Feedback.deleteMany({ userId, queryId: query._id }),
    ]);

    const stats = await UserStats.findOne({ userId });
    if (stats) {
      stats.queries = Math.max(0, Number(stats.queries || 0) - 1);
      await stats.save();
      await refreshAverageScore(userId);
    }

    return res.status(200).json({ message: 'Activity deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getHistory, updateHistoryItem, deleteHistoryItem };
