const { z } = require('zod');
const { Feedback } = require('../models/Feedback');
const { Query } = require('../models/Query');
const { updateUserPreferenceScores } = require('../services/personalizationService');

const feedbackSchema = z.object({
  queryId: z.string().min(3),
  rating: z.enum(['like', 'dislike']),
  note: z.string().max(280).optional(),
});

async function submitFeedback(req, res, next) {
  try {
    const payload = feedbackSchema.parse(req.body);
    const userId = req.user.id;

    const query = await Query.findOne({ _id: payload.queryId, userId });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { userId, queryId: payload.queryId },
      {
        userId,
        queryId: payload.queryId,
        rating: payload.rating,
        note: payload.note || '',
      },
      { new: true, upsert: true },
    );

    await updateUserPreferenceScores(userId, query.detectedIntent, payload.rating);

    return res.status(200).json({
      message: 'Feedback recorded',
      feedback,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { submitFeedback };
