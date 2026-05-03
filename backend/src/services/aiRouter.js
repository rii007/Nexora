const { getModelPlan } = require('./modelManager');
const { callHuggingFace, callOllama, heuristicImageHelper } = require('./providerClients');

async function generateWithProvider(route, prompt) {
  if (route.provider === 'huggingface') {
    return callHuggingFace(route.model, prompt);
  }

  if (route.provider === 'ollama') {
    return callOllama(route.model, prompt);
  }

  return heuristicImageHelper(prompt);
}

async function routeAndGenerate({ intent, confidence, prompt, personalizationBoost = 0 }) {
  const modelPlan = getModelPlan(intent);
  const adjustedConfidence = Math.max(0, Math.min(1, confidence + personalizationBoost));

  let selectedRoute = modelPlan.primary;
  let fallbackUsed = false;
  const start = Date.now();

  try {
    const responseText = await generateWithProvider(selectedRoute, prompt);
    return {
      responseText,
      provider: selectedRoute.provider,
      model: selectedRoute.model,
      confidence: adjustedConfidence,
      latencyMs: Date.now() - start,
      fallbackUsed,
    };
  } catch (primaryError) {
    selectedRoute = modelPlan.fallback;
    fallbackUsed = true;

    const responseText = await generateWithProvider(selectedRoute, prompt);

    return {
      responseText,
      provider: selectedRoute.provider,
      model: selectedRoute.model,
      confidence: Math.max(0.35, adjustedConfidence - 0.1),
      latencyMs: Date.now() - start,
      fallbackUsed,
    };
  }
}

module.exports = { routeAndGenerate };
