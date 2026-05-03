function buildToolSuggestionMessage(intent) {
  const map = {
    coding: 'Use coding mode with detailed stack traces and language-specific constraints.',
    writing: 'Use writing mode with style, audience, and tone controls.',
    research: 'Use research mode with source-backed summaries and compare tables.',
    image_generation: 'Use image mode with prompt templates and negative prompts.',
    general: 'Use balanced mode for mixed questions and quick ideation.',
  };

  return map[intent] || map.general;
}

module.exports = { buildToolSuggestionMessage };
