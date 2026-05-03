const { SessionMemory } = require('../models/SessionMemory');

async function getSessionContext(userId, sessionId, maxTurns = 4) {
  const memory = await SessionMemory.findOne({ userId, sessionId });
  if (!memory || memory.turns.length === 0) {
    return '';
  }

  return memory.turns
    .slice(-maxTurns)
    .map((turn) => `${turn.role}: ${turn.message}`)
    .join('\n');
}

async function appendSessionTurn(userId, sessionId, role, message, intent) {
  const memory = await SessionMemory.findOneAndUpdate(
    { userId, sessionId },
    {
      $push: {
        turns: {
          $each: [{ role, message, intent }],
          $slice: -12,
        },
      },
    },
    { new: true, upsert: true },
  );

  return memory;
}

module.exports = { getSessionContext, appendSessionTurn };
