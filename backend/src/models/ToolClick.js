const mongoose = require('mongoose');

const toolClickSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    toolName: { type: String, required: true, trim: true },
    toolUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

toolClickSchema.index({ userId: 1, createdAt: -1 });

const ToolClick = mongoose.model('ToolClick', toolClickSchema);

module.exports = { ToolClick };
