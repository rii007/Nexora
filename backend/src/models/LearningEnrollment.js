const mongoose = require('mongoose');

const learningEnrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pathId: { type: String, required: true, index: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    usedToolNames: { type: [String], default: [] },
    toolUseCount: { type: Number, default: 0, min: 0 },
    openedModuleIds: { type: [String], default: [] },
    moduleOpenCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

learningEnrollmentSchema.index({ userId: 1, pathId: 1 }, { unique: true });

const LearningEnrollment = mongoose.model('LearningEnrollment', learningEnrollmentSchema);

module.exports = { LearningEnrollment };
