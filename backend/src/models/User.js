const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    intent: {
      type: String,
      enum: ['coding', 'writing', 'research', 'image_generation', 'general'],
      required: true,
    },
    score: { type: Number, default: 0 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'professional'], default: 'student' },
    persona: {
      primaryUseCase: { type: String, default: 'general' },
      preferredTone: { type: String, default: 'balanced' },
      experienceLevel: { type: String, default: 'beginner' },
    },
    intentPreferences: {
      type: [preferenceSchema],
      default: [
        { intent: 'coding', score: 0 },
        { intent: 'writing', score: 0 },
        { intent: 'research', score: 0 },
        { intent: 'image_generation', score: 0 },
        { intent: 'general', score: 0 },
      ],
    },
    lastActiveAt: { type: Date },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
