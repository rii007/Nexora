/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('airouter_token'))
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('airouter_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = Boolean(token && user)

  const persistAuth = useCallback((nextToken, nextUser, remember = true) => {
    if (remember) {
      localStorage.setItem('airouter_token', nextToken)
      localStorage.setItem('airouter_user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('airouter_token')
      localStorage.removeItem('airouter_user')
    }

    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem('airouter_token')
    localStorage.removeItem('airouter_user')
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (payload, options = {}) => {
    const data = await authService.login(payload)
    persistAuth(data.token, data.user, options.remember !== false)
    return data
  }, [persistAuth])

  const signup = useCallback(async (payload) => {
    const data = await authService.signup(payload)
    persistAuth(data.token, data.user, true)
    return data
  }, [persistAuth])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      signup,
      logout: clearAuth,
    }),
    [token, user, isAuthenticated, login, signup, clearAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
