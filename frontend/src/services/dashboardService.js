import { api } from '../api/client'

async function getStats() {
  const { data } = await api.get('/stats')
  return data
}

async function getHistory(limit = 20) {
  const { data } = await api.get('/history', { params: { limit } })
  return data.history || []
}

async function updateHistoryItem(queryId, payload) {
  const { data } = await api.patch(`/history/${queryId}`, payload)
  return data
}

async function deleteHistoryItem(queryId) {
  const { data } = await api.delete(`/history/${queryId}`)
  return data
}

async function routeQuery(payload) {
  const { data } = await api.post('/route', payload)
  return data
}

async function trackToolClick(toolName) {
  const { data } = await api.post('/tool-click', { toolName })
  return data
}

async function submitFeedback(payload) {
  const { data } = await api.post('/feedback', payload)
  return data
}

async function listGoals() {
  const { data } = await api.get('/goals')
  return data.goals || []
}

async function createGoal(payload) {
  const { data } = await api.post('/goals', payload)
  return data.goal
}

async function updateGoal(goalId, payload) {
  const { data } = await api.patch(`/goals/${goalId}`, payload)
  return data.goal
}

async function deleteGoal(goalId) {
  const { data } = await api.delete(`/goals/${goalId}`)
  return data
}

export const dashboardService = {
  getStats,
  getHistory,
  updateHistoryItem,
  deleteHistoryItem,
  routeQuery,
  trackToolClick,
  submitFeedback,
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
}
