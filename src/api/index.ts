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
  ComfyInstance
} from '@/types'
import { mockApi } from './mock'

// Check if mock mode is enabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

const api = axios.create({
  baseURL: '/api',
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

export default api
