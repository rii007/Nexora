const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    progress: { type: Number, required: true, min: 0, max: 100, default: 0 },
  },
  { timestamps: true },
);

goalSchema.index({ userId: 1, createdAt: -1 });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = { Goal };
