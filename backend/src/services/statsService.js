const { UserStats } = require('../models/UserStats');
const { Query } = require('../models/Query');

async function getOrCreateUserStats(userId) {
  const existing = await UserStats.findOne({ userId });
  if (existing) {
    return existing;
  }

  return UserStats.create({ userId, queries: 0, hoursSaved: 0, avgScore: 0, toolClicks: 0 });
}

async function refreshAverageScore(userId) {
  const records = await Query.find({ userId }).select('confidence').lean();
  const avgScore =
    records.length > 0
      ? Number((records.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / records.length).toFixed(2))
      : 0;

  const stats = await getOrCreateUserStats(userId);
  stats.avgScore = avgScore;
  await stats.save();
  return stats;
}

async function incrementQueryStats(userId, hoursIncrement = 0) {
  const stats = await getOrCreateUserStats(userId);
  stats.queries += 1;
  stats.hoursSaved = Number((stats.hoursSaved + Math.max(0, hoursIncrement)).toFixed(2));
  await stats.save();
  return stats;
}

async function incrementToolClickStats(userId) {
  const stats = await getOrCreateUserStats(userId);
  stats.queries += 1;
  stats.toolClicks += 1;
  await stats.save();
  return stats;
}

module.exports = {
  getOrCreateUserStats,
  refreshAverageScore,
  incrementQueryStats,
  incrementToolClickStats,
};
