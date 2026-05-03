const mongoose = require('mongoose');

const memoryTurnSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    message: { type: String, required: true },
    intent: { type: String, default: 'general' },
  },
  { _id: false },
);

const sessionMemorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    turns: { type: [memoryTurnSchema], default: [] },
  },
  { timestamps: true },
);

sessionMemorySchema.index({ userId: 1, sessionId: 1 }, { unique: true });

const SessionMemory = mongoose.model('SessionMemory', sessionMemorySchema);

module.exports = { SessionMemory };
