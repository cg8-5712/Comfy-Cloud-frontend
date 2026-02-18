import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/account"
        element={
          isAuthenticated ? (
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">账户管理</h1>
                <p className="text-muted-foreground">开发中...</p>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
