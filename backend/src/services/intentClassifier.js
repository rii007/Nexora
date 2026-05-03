const axios = require('axios');
const { env } = require('../config/env');

const labelMap = {
  coding: ['code', 'programming', 'bug', 'algorithm', 'debug', 'javascript', 'python'],
  writing: ['write', 'email', 'blog', 'story', 'grammar', 'tone'],
  research: ['research', 'compare', 'summarize', 'paper', 'analyze', 'facts'],
  image_generation: ['image', 'logo', 'poster', 'illustration', 'generate photo', 'art'],
};

function heuristicClassifier(text) {
  const normalized = text.toLowerCase();
  let winner = 'general';
  let maxMatches = 0;

  for (const [intent, words] of Object.entries(labelMap)) {
    const matches = words.filter((word) => normalized.includes(word)).length;
    if (matches > maxMatches) {
      winner = intent;
      maxMatches = matches;
    }
  }

  return {
    intent: winner,
    confidence: maxMatches > 0 ? Math.min(0.95, 0.55 + maxMatches * 0.1) : 0.45,
    provider: 'heuristic',
  };
}

async function classifyIntent(text) {
  if (!env.huggingFaceApiKey) {
    return heuristicClassifier(text);
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        inputs: text,
        parameters: {
          candidate_labels: ['coding', 'writing', 'research', 'image_generation', 'general'],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.huggingFaceApiKey}`,
        },
        timeout: 12000,
      },
    );

    const topIntent = response.data?.labels?.[0] || 'general';
    const topScore = Number(response.data?.scores?.[0] || 0.5);

    return {
      intent: topIntent,
      confidence: topScore,
      provider: 'huggingface',
    };
  } catch (error) {
    return heuristicClassifier(text);
  }
}

module.exports = { classifyIntent };
