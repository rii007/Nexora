import { api } from '../api/client'

async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export const authService = {
  login,
  signup,
}
