import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountLayout from './layouts/AccountLayout'
import DashboardPage from './pages/DashboardPage'
import RechargePage from './pages/RechargePage'
import UsagePage from './pages/UsagePage'
import SettingsPage from './pages/SettingsPage'
import ModelsPage from './pages/ModelsPage'
import SubscriptionPage from './pages/SubscriptionPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminInstancesPage from './pages/admin/AdminInstancesPage'
import AdminModelsPage from './pages/admin/AdminModelsPage'
import AdminFinancePage from './pages/admin/AdminFinancePage'
import AdminConfigPage from './pages/admin/AdminConfigPage'
import AdminLogsPage from './pages/admin/AdminLogsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (user && user.role !== 'admin') {
    return <Navigate to="/account" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="recharge" element={<RechargePage />} />
        <Route path="usage" element={<UsagePage />} />
        <Route path="models" element={<ModelsPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="instances" element={<AdminInstancesPage />} />
        <Route path="models" element={<AdminModelsPage />} />
        <Route path="finance" element={<AdminFinancePage />} />
        <Route path="config" element={<AdminConfigPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
      </Route>
    </Routes>
  )
}

export default App
