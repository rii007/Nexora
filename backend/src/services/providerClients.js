const axios = require('axios');
const { env } = require('../config/env');

async function callHuggingFace(model, prompt) {
  if (!env.huggingFaceApiKey) {
    throw new Error('HF_API_KEY is not configured');
  }

  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 220,
        temperature: 0.3,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${env.huggingFaceApiKey}`,
      },
      timeout: 20000,
    },
  );

  const payload = response.data;

  if (Array.isArray(payload) && payload[0]?.generated_text) {
    return payload[0].generated_text;
  }

  if (typeof payload?.generated_text === 'string') {
    return payload.generated_text;
  }

  return JSON.stringify(payload);
}

async function callOllama(model, prompt) {
  const response = await axios.post(
    `${env.ollamaBaseUrl}/api/generate`,
    {
      model,
      prompt,
      stream: false,
    },
    { timeout: 20000 },
  );

  return response.data?.response || 'No response from Ollama model.';
}

function heuristicImageHelper(prompt) {
  return [
    'Image model request detected. Here is an optimized prompt template you can use with Stable Diffusion:',
    `Subject: ${prompt}`,
    'Style: cinematic lighting, high detail, sharp focus',
    'Composition: rule of thirds, centered subject, clean background',
    'Negative prompt: blurry, low quality, watermark, text artifacts',
  ].join('\n');
}

module.exports = { callHuggingFace, callOllama, heuristicImageHelper };
