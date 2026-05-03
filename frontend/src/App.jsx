import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import DiscoverToolsPage from './pages/DiscoverToolsPage'
import LearningHubPage from './pages/LearningHubPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discover-tools"
        element={
          <ProtectedRoute>
            <DiscoverToolsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning-hub"
        element={
          <ProtectedRoute>
            <LearningHubPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
