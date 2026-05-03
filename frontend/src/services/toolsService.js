import { api } from '../api/client'

async function listTools(params) {
  const { data } = await api.get('/tools', { params })
  return data
}

async function runWizard(payload) {
  const { data } = await api.post('/tools/recommend', payload)
  return data
}

async function getStarterRecommendations() {
  const { data } = await api.post('/tools/recommend', { query: '' })
  return data
}

async function trackToolClick(toolName) {
  const { data } = await api.post('/tool-click', { toolName })
  return data
}

export const toolsService = {
  listTools,
  runWizard,
  getStarterRecommendations,
  trackToolClick,
}
