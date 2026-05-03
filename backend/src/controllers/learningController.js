const { z } = require('zod');
const {
  LEARNING_PATHS,
  getLearningPathById,
  getModuleFromPath,
} = require('../services/catalogService');
const { LearningEnrollment } = require('../models/LearningEnrollment');

const enrollSchema = z.object({
  pathId: z.string().min(3),
});

const moduleOpenSchema = z.object({
  pathId: z.string().min(3),
  moduleId: z.string().min(2),
});

const toolUsageSchema = z.object({
  toolName: z.string().min(2),
});

function normalizeToolName(value) {
  return String(value || '').trim().toLowerCase();
}

function computeLearningProgress(enrollment) {
  const toolProgress = Math.min(45, Number(enrollment.toolUseCount || 0) * 8);
  const moduleProgress = Math.min(45, Number((enrollment.openedModuleIds || []).length) * 15);
  const multiToolBonus = (enrollment.usedToolNames || []).length >= 2 ? 10 : 0;
  return Math.min(100, toolProgress + moduleProgress + multiToolBonus);
}

function nextRecommendedStep(path, enrollment, progress) {
  if (progress >= 100) {
    return 'Path completed. Pick another path to continue learning.';
  }

  const opened = new Set(enrollment?.openedModuleIds || []);
  const nextModule = path.modules.find((item) => !opened.has(item.id));
  if (nextModule) {
    return `Open module: ${nextModule.title}`;
  }

  if (Number(enrollment?.toolUseCount || 0) < 3) {
    return `Use one of these tools in practice: ${path.skills.slice(0, 2).join(', ')}`;
  }

  return path.next;
}

function inAppTipFromSummary(activePath) {
  if (!activePath) {
    return 'Start a learning path and use a tool to unlock practical tips.';
  }

  if (activePath.progress >= 100) {
    return `You completed ${activePath.title}. Try a new path to grow further.`;
  }

  return `Tip: ${activePath.nextRecommendedStep}`;
}

function toPathPayload(path, enrollment, isActivePath) {
  const progress = enrollment ? computeLearningProgress(enrollment) : 0;
  const nextStep = nextRecommendedStep(path, enrollment || {}, progress);

  return {
    ...path,
    modulesCount: `${path.modules.length} modules`,
    modules: path.modules,
    progress,
    enrolled: Boolean(enrollment),
    action: enrollment ? 'Continue Path' : 'Start Path',
    activePath: isActivePath,
    nextRecommendedStep: nextStep,
  };
}

async function listLearningPaths(req, res, next) {
  try {
    const search = String(req.query.search || '').trim().toLowerCase();
    const filtered = LEARNING_PATHS.filter((item) => {
      if (!search) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.skills.some((skill) => skill.toLowerCase().includes(search))
      );
    });

    const enrollments = await LearningEnrollment.find({ userId: req.user.id }).lean();
    const enrollmentMap = new Map(enrollments.map((item) => [item.pathId, item]));

    const activeEnrollment = [...enrollments]
      .sort((a, b) => Number(b.progress || 0) - Number(a.progress || 0) || new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    const activePathId = activeEnrollment?.pathId || null;

    const paths = filtered.map((item) =>
      toPathPayload(item, enrollmentMap.get(item.id), item.id === activePathId),
    );

    return res.status(200).json({ paths });
  } catch (error) {
    return next(error);
  }
}

async function enrollPath(req, res, next) {
  try {
    const payload = enrollSchema.parse({ pathId: req.params.pathId });
    const path = getLearningPathById(payload.pathId);

    if (!path) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    const enrollment = await LearningEnrollment.findOneAndUpdate(
      { userId: req.user.id, pathId: payload.pathId },
      {
        $setOnInsert: {
          userId: req.user.id,
          pathId: payload.pathId,
          progress: 0,
          usedToolNames: [],
          toolUseCount: 0,
          openedModuleIds: [],
          moduleOpenCount: 0,
        },
      },
      { upsert: true, new: true },
    );

    enrollment.progress = computeLearningProgress(enrollment);
    await enrollment.save();

    return res.status(200).json({
      enrollment,
      path: toPathPayload(path, enrollment.toObject(), true),
      message: 'Path started. Open your first module to begin learning.',
    });
  } catch (error) {
    return next(error);
  }
}

async function openModule(req, res, next) {
  try {
    const payload = moduleOpenSchema.parse({ pathId: req.params.pathId, moduleId: req.params.moduleId });
    const path = getLearningPathById(payload.pathId);
    const module = getModuleFromPath(payload.pathId, payload.moduleId);

    if (!path || !module) {
      return res.status(404).json({ message: 'Learning module not found' });
    }

    const enrollment = await LearningEnrollment.findOneAndUpdate(
      { userId: req.user.id, pathId: payload.pathId },
      {
        $setOnInsert: {
          userId: req.user.id,
          pathId: payload.pathId,
          progress: 0,
          usedToolNames: [],
          toolUseCount: 0,
          openedModuleIds: [],
          moduleOpenCount: 0,
        },
      },
      { upsert: true, new: true },
    );

    if (!enrollment.openedModuleIds.includes(payload.moduleId)) {
      enrollment.openedModuleIds.push(payload.moduleId);
      enrollment.moduleOpenCount += 1;
    }

    enrollment.progress = computeLearningProgress(enrollment);
    await enrollment.save();

    return res.status(200).json({
      message: 'Module opened and progress updated.',
      module,
      progress: enrollment.progress,
      nextRecommendedStep: nextRecommendedStep(path, enrollment, enrollment.progress),
    });
  } catch (error) {
    return next(error);
  }
}

async function trackToolUsage(req, res, next) {
  try {
    const payload = toolUsageSchema.parse(req.body || {});
    const normalizedTool = normalizeToolName(payload.toolName);

    const matchedPaths = LEARNING_PATHS.filter((path) =>
      path.skills.some((skill) => normalizeToolName(skill) === normalizedTool),
    );

    const targetPath = matchedPaths[0] || LEARNING_PATHS[0];

    const enrollment = await LearningEnrollment.findOneAndUpdate(
      { userId: req.user.id, pathId: targetPath.id },
      {
        $setOnInsert: {
          userId: req.user.id,
          pathId: targetPath.id,
          progress: 0,
          usedToolNames: [],
          toolUseCount: 0,
          openedModuleIds: [],
          moduleOpenCount: 0,
        },
      },
      { upsert: true, new: true },
    );

    enrollment.toolUseCount += 1;
    if (!enrollment.usedToolNames.includes(payload.toolName)) {
      enrollment.usedToolNames.push(payload.toolName);
    }

    enrollment.progress = computeLearningProgress(enrollment);
    await enrollment.save();

    return res.status(200).json({
      message: 'Tool usage recorded for learning progress.',
      pathId: targetPath.id,
      progress: enrollment.progress,
      nextRecommendedStep: nextRecommendedStep(targetPath, enrollment, enrollment.progress),
    });
  } catch (error) {
    return next(error);
  }
}

async function getLearningSummary(req, res, next) {
  try {
    const enrollments = await LearningEnrollment.find({ userId: req.user.id }).lean();

    const enriched = enrollments
      .map((enrollment) => {
        const path = getLearningPathById(enrollment.pathId);
        if (!path) {
          return null;
        }

        const progress = computeLearningProgress(enrollment);
        return {
          id: path.id,
          title: path.title,
          progress,
          nextRecommendedStep: nextRecommendedStep(path, enrollment, progress),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.progress - a.progress);

    const activePath = enriched[0] || null;

    return res.status(200).json({
      activePath,
      tip: inAppTipFromSummary(activePath),
      nextRecommendedStep: activePath?.nextRecommendedStep || 'Open a path and use a tool to get personalized steps.',
    });
  } catch (error) {
    return next(error);
  }
}

async function unenrollPath(req, res, next) {
  try {
    const deleted = await LearningEnrollment.findOneAndDelete({
      userId: req.user.id,
      pathId: req.params.pathId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json({ message: 'Enrollment removed' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listLearningPaths,
  enrollPath,
  openModule,
  trackToolUsage,
  getLearningSummary,
  unenrollPath,
};
