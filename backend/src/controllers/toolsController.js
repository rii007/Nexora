const { z } = require('zod');
const { filterTools, recommendToolsForProfile, getStarterTools } = require('../services/catalogService');
const { User } = require('../models/User');

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  skillLevel: z.string().optional(),
  verified: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => {
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      return undefined;
    }),
  pricing: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

const wizardSchema = z.object({
  query: z.string().max(160).optional(),
});

async function listTools(req, res, next) {
  try {
    const parsed = querySchema.parse(req.query);
    const page = Math.max(1, Number(parsed.page || 1));
    const limit = Math.max(1, Math.min(50, Number(parsed.limit || 6)));
    const pricing = parsed.pricing ? parsed.pricing.split(',').map((item) => item.trim()) : [];

    const filtered = filterTools({
      search: parsed.search || '',
      category: parsed.category || 'All Tools',
      pricing,
      verified: parsed.verified,
      skillLevel: parsed.skillLevel,
    });

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return res.status(200).json({
      items,
      total: filtered.length,
      page,
      limit,
      hasMore: start + limit < filtered.length,
    });
  } catch (error) {
    return next(error);
  }
}

async function recommendTools(req, res, next) {
  try {
    const payload = wizardSchema.parse(req.body || {});
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const recommendations = recommendToolsForProfile({
      primaryUseCase: user.persona?.primaryUseCase || 'general',
      query: payload.query || '',
    });

    const items = recommendations.length > 0 ? recommendations : getStarterTools();

    return res.status(200).json({
      items,
      message: 'Recommendations generated based on your profile',
    });
  } catch (error) {
    return next(error);
  }
}

async function trackToolInteraction(req, res, next) {
  try {
    const interactionSchema = z.object({
      action: z.enum(['try', 'details']),
    });

    const payload = interactionSchema.parse(req.body);
    return res.status(200).json({
      message: payload.action === 'try' ? 'Tool added to your recent tries' : 'Tool details viewed',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTools,
  recommendTools,
  trackToolInteraction,
};
