const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    queries: { type: Number, default: 0, min: 0 },
    hoursSaved: { type: Number, default: 0, min: 0 },
    avgScore: { type: Number, default: 0, min: 0, max: 100 },
    toolClicks: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const UserStats = mongoose.model('UserStats', userStatsSchema);

module.exports = { UserStats };
