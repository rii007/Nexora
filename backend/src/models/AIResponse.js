const mongoose = require('mongoose');

const aiResponseSchema = new mongoose.Schema(
  {
    queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, enum: ['huggingface', 'ollama', 'heuristic'], required: true },
    model: { type: String, required: true },
    responseText: { type: String, required: true },
    latencyMs: { type: Number, required: true },
    tokenEstimate: { type: Number, default: 0 },
    fallbackUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const AIResponse = mongoose.model('AIResponse', aiResponseSchema);

module.exports = { AIResponse };
