import { api } from '../api/client'

async function getSummary() {
  const { data } = await api.get('/learning/summary')
  return data
}

async function listPaths(search = '') {
  const { data } = await api.get('/learning/paths', { params: { search } })
  return data.paths || []
}

async function enroll(pathId) {
  const { data } = await api.post(`/learning/paths/${pathId}/enroll`)
  return data
}

async function openModule(pathId, moduleId) {
  const { data } = await api.post(`/learning/paths/${pathId}/modules/${moduleId}/open`)
  return data
}

async function trackToolUsage(toolName) {
  const { data } = await api.post('/learning/tool-usage', { toolName })
  return data
}

async function unenroll(pathId) {
  const { data } = await api.delete(`/learning/paths/${pathId}/enroll`)
  return data
}

export const learningService = {
  getSummary,
  listPaths,
  enroll,
  openModule,
  trackToolUsage,
  unenroll,
}
