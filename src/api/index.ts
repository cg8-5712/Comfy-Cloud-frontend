import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  Balance,
  UsageRecord,
  UsageStats,
  TierConfig,
  AdminUser,
  AdminStats,
  ComfyInstance,
  PrivateModel,
  AdminModel,
  Subscription,
  RechargeRecord,
  FinanceStats,
  SystemConfig,
  SystemLog,
} from '@/types'
import { mockApi } from './mock'

// Check if mock mode is enabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('comfy_cloud_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('comfy_cloud_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper to wrap mock responses in axios-like format
const wrapMock = <T>(promise: Promise<T>) => promise.then((data) => ({ data }))

export const authApi = {
  login: (data: LoginRequest) =>
    USE_MOCK
      ? wrapMock(mockApi.auth.login(data.username, data.password))
      : api.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    USE_MOCK
      ? wrapMock(mockApi.auth.register(data.username, data.email))
      : api.post<RegisterResponse>('/auth/register', data),

  logout: () =>
    USE_MOCK
      ? wrapMock(mockApi.auth.logout())
      : api.post('/auth/logout'),

  getCurrentUser: () =>
    USE_MOCK
      ? wrapMock(mockApi.auth.getCurrentUser())
      : api.get<User>('/auth/me')
}

export const userApi = {
  getBalance: () =>
    USE_MOCK
      ? wrapMock(mockApi.user.getBalance())
      : api.get<Balance>('/user/balance'),

  getUsageRecords: (params?: {
    start_date?: string
    end_date?: string
    limit?: number
    offset?: number
  }) =>
    USE_MOCK
      ? wrapMock(mockApi.user.getUsageRecords(params))
      : api.get<{ records: UsageRecord[]; total: number }>('/usage/records', { params }),

  getUsageStats: (period: 'day' | 'week' | 'month' | 'year') =>
    USE_MOCK
      ? wrapMock(mockApi.user.getUsageStats(period))
      : api.get<UsageStats>('/usage/stats', { params: { period } })
}

export const tierApi = {
  getTiers: () =>
    USE_MOCK
      ? wrapMock(mockApi.tier.getTiers())
      : api.get<TierConfig[]>('/tiers'),
}

export const adminApi = {
  getStats: () =>
    USE_MOCK
      ? wrapMock(mockApi.admin.getStats())
      : api.get<AdminStats>('/admin/stats'),

  getUsers: (params?: { limit?: number; offset?: number; search?: string }) =>
    USE_MOCK
      ? wrapMock(mockApi.admin.getUsers(params))
      : api.get<{ users: AdminUser[]; total: number }>('/admin/users', { params }),

  updateUser: (id: number, data: Partial<Pick<AdminUser, 'tier' | 'status' | 'role' | 'balance'>>) =>
    USE_MOCK
      ? wrapMock(mockApi.admin.updateUser(id, data))
      : api.patch<AdminUser>(`/admin/users/${id}`, data),

  getInstances: () =>
    USE_MOCK
      ? wrapMock(mockApi.admin.getInstances())
      : api.get<ComfyInstance[]>('/admin/instances'),
}

export const modelApi = {
  getPrivateModels: () =>
    USE_MOCK
      ? wrapMock(mockApi.models.getPrivateModels())
      : api.get<{ models: PrivateModel[] }>('/models/private'),

  uploadModel: (file: File, type: PrivateModel['type']) => {
    if (USE_MOCK) return wrapMock(mockApi.models.uploadModel(file.name, type))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return api.post<PrivateModel>('/models/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  deleteModel: (id: number) =>
    USE_MOCK
      ? wrapMock(mockApi.models.deleteModel(id))
      : api.delete(`/models/private/${id}`),
}

export const subscriptionApi = {
  getSubscription: () =>
    USE_MOCK
      ? wrapMock(mockApi.subscription.getSubscription())
      : api.get<Subscription>('/subscription'),

  upgrade: (targetTier: string) =>
    USE_MOCK
      ? wrapMock(mockApi.subscription.upgrade(targetTier))
      : api.post<Subscription>('/subscription/upgrade', { target_tier: targetTier }),
}

export const adminModelApi = {
  getModels: (params?: { visibility?: string; limit?: number; offset?: number }) =>
    USE_MOCK
      ? wrapMock(mockApi.adminModels.getModels(params))
      : api.get<{ models: AdminModel[]; total: number }>('/admin/models', { params }),

  updateModel: (id: number, data: Partial<Pick<AdminModel, 'visibility' | 'status'>>) =>
    USE_MOCK
      ? wrapMock(mockApi.adminModels.updateModel(id, data))
      : api.patch<AdminModel>(`/admin/models/${id}`, data),

  deleteModel: (id: number) =>
    USE_MOCK
      ? wrapMock(mockApi.adminModels.deleteModel(id))
      : api.delete(`/admin/models/${id}`),
}

export const financeApi = {
  getStats: () =>
    USE_MOCK
      ? wrapMock(mockApi.finance.getStats())
      : api.get<FinanceStats>('/admin/finance/stats'),

  getRechargeRecords: (params?: { limit?: number; offset?: number }) =>
    USE_MOCK
      ? wrapMock(mockApi.finance.getRechargeRecords(params))
      : api.get<{ records: RechargeRecord[]; total: number }>('/admin/finance/recharges', { params }),
}

export const configApi = {
  getConfig: () =>
    USE_MOCK
      ? wrapMock(mockApi.config.getConfig())
      : api.get<SystemConfig>('/admin/config'),

  updateConfig: (data: Partial<SystemConfig>) =>
    USE_MOCK
      ? wrapMock(mockApi.config.updateConfig(data))
      : api.patch<SystemConfig>('/admin/config', data),
}

export const logApi = {
  getLogs: (params?: { level?: string; source?: string; limit?: number; offset?: number }) =>
    USE_MOCK
      ? wrapMock(mockApi.logs.getLogs(params))
      : api.get<{ logs: SystemLog[]; total: number }>('/admin/logs', { params }),
}

export default api
