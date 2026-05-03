const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true, index: true },
    rating: { type: String, enum: ['like', 'dislike'], required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true },
);

feedbackSchema.index({ userId: 1, queryId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = { Feedback };
