const modelCatalog = {
  coding: {
    primary: { provider: 'ollama', model: 'qwen2.5-coder:7b' },
    fallback: { provider: 'huggingface', model: 'google/flan-t5-large' },
  },
  writing: {
    primary: { provider: 'huggingface', model: 'google/flan-t5-large' },
    fallback: { provider: 'ollama', model: 'llama3.1:8b' },
  },
  research: {
    primary: { provider: 'huggingface', model: 'google/flan-t5-large' },
    fallback: { provider: 'ollama', model: 'llama3.1:8b' },
  },
  image_generation: {
    primary: { provider: 'huggingface', model: 'stabilityai/stable-diffusion-xl-base-1.0' },
    fallback: { provider: 'heuristic', model: 'prompt-helper' },
  },
  general: {
    primary: { provider: 'ollama', model: 'llama3.1:8b' },
    fallback: { provider: 'huggingface', model: 'google/flan-t5-large' },
  },
};

function getModelPlan(intent) {
  return modelCatalog[intent] || modelCatalog.general;
}

module.exports = { getModelPlan, modelCatalog };
