const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    detectedIntent: {
      type: String,
      enum: ['coding', 'writing', 'research', 'image_generation', 'general'],
      required: true,
    },
    confidence: { type: Number, required: true },
    modelChosen: { type: String, required: true },
    contextSummary: { type: String, default: '' },
  },
  { timestamps: true },
);

querySchema.index({ userId: 1, createdAt: -1 });

const Query = mongoose.model('Query', querySchema);

module.exports = { Query };
