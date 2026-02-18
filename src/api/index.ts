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

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get<User>('/auth/me')
}

export const userApi = {
  getBalance: () => api.get<Balance>('/user/balance'),

  getUsageRecords: (params?: {
    start_date?: string
    end_date?: string
    limit?: number
    offset?: number
  }) => api.get<{ records: UsageRecord[]; total: number }>('/usage/records', { params }),

  getUsageStats: (period: 'day' | 'week' | 'month' | 'year') =>
    api.get<UsageStats>('/usage/stats', { params: { period } })
}

export const tierApi = {
  getTiers: () => api.get<TierConfig[]>('/tiers'),
}

export const adminApi = {
  getStats: () => api.get<AdminStats>('/admin/stats'),

  getUsers: (params?: { limit?: number; offset?: number; search?: string }) =>
    api.get<{ users: AdminUser[]; total: number }>('/admin/users', { params }),

  updateUser: (id: number, data: Partial<Pick<AdminUser, 'tier' | 'status' | 'role' | 'balance'>>) =>
    api.patch<AdminUser>(`/admin/users/${id}`, data),

  getInstances: () => api.get<ComfyInstance[]>('/admin/instances'),
}

export default api
