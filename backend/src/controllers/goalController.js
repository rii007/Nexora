const { z } = require('zod');
const { Goal } = require('../models/Goal');

const createGoalSchema = z.object({
  name: z.string().min(2).max(120),
  progress: z.number().min(0).max(100).optional(),
});

const updateGoalSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  progress: z.number().min(0).max(100).optional(),
});

async function listGoals(req, res, next) {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ goals });
  } catch (error) {
    return next(error);
  }
}

async function createGoal(req, res, next) {
  try {
    const payload = createGoalSchema.parse(req.body);
    const goal = await Goal.create({
      userId: req.user.id,
      name: payload.name,
      progress: payload.progress ?? 0,
    });

    return res.status(201).json({ goal });
  } catch (error) {
    return next(error);
  }
}

async function updateGoal(req, res, next) {
  try {
    const payload = updateGoalSchema.parse(req.body);
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.goalId, userId: req.user.id },
      payload,
      { new: true },
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    return res.status(200).json({ goal });
  } catch (error) {
    return next(error);
  }
}

async function deleteGoal(req, res, next) {
  try {
    const deleted = await Goal.findOneAndDelete({ _id: req.params.goalId, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    return res.status(200).json({ message: 'Goal deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
