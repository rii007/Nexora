const { User } = require('../models/User');

async function updateUserPreferenceScores(userId, intent, feedbackRating) {
  const user = await User.findById(userId);
  if (!user) {
    return;
  }

  const index = user.intentPreferences.findIndex((pref) => pref.intent === intent);
  if (index >= 0) {
    const delta = feedbackRating === 'like' ? 2 : feedbackRating === 'dislike' ? -2 : 1;
    user.intentPreferences[index].score += delta;
  }

  user.lastActiveAt = new Date();
  await user.save();
}

function preferenceBoost(intentPreferences, intent) {
  const pref = intentPreferences.find((item) => item.intent === intent);
  if (!pref) {
    return 0;
  }

  return Math.max(-0.15, Math.min(0.15, pref.score / 100));
}

function rankToolSuggestions(intentPreferences) {
  return [...intentPreferences]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((pref) => pref.intent);
}

module.exports = {
  updateUserPreferenceScores,
  preferenceBoost,
  rankToolSuggestions,
};
