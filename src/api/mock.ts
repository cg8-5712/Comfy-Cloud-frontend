import type {
  LoginResponse,
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

// Mock user data
const mockUser: User = {
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com',
  tier: 'pro',
  balance: 150.50,
  storage_used: 5.2,
  storage_limit: 50,
  created_at: '2024-01-15T08:30:00Z',
  role: 'user',
}

const mockAdminUser: User = {
  id: 999,
  username: 'admin',
  email: 'admin@example.com',
  tier: 'enterprise',
  balance: 9999.99,
  storage_used: 1.5,
  storage_limit: 200,
  created_at: '2023-01-01T00:00:00Z',
  role: 'admin',
}

// Mock token
const mockToken = 'mock_jwt_token_' + Date.now()

// Mock balance
const mockBalance: Balance = {
  balance: 150.50,
  currency: 'CNY',
  last_updated: new Date().toISOString(),
}

// Mock tiers
const mockTiers: TierConfig[] = [
  {
    key: 'basic',
    label: '基础版',
    color: 'bg-muted text-muted-foreground',
    price: '免费',
    features: ['每月 100 次任务', '5 GB 存储空间', '基础模型访问', '社区支持'],
    popular: false,
  },
  {
    key: 'pro',
    label: '专业版',
    color: 'bg-primary/10 text-primary',
    price: '¥99/月',
    features: ['无限任务', '50 GB 存储空间', 'VIP 模型访问', '优先队列', '邮件支持'],
    popular: true,
  },
  {
    key: 'enterprise',
    label: '企业版',
    color: 'bg-amber-500/10 text-amber-600',
    price: '¥299/月',
    features: ['无限任务', '200 GB 存储空间', '全部模型访问', '最高优先级', '专属支持', '团队协作'],
    popular: false,
  },
]

// Mock usage records
const mockUsageRecords: UsageRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  task_id: `task_${Math.random().toString(36).substr(2, 9)}`,
  type: ['gpu_usage', 'storage', 'bandwidth'][i % 3] as UsageRecord['type'],
  started_at: new Date(Date.now() - (15 - i) * 86400000).toISOString(),
  ended_at: new Date(Date.now() - (15 - i) * 86400000 + 300000).toISOString(),
  duration_seconds: 300 + Math.floor(Math.random() * 600),
  cost: 0.5 + Math.random() * 2,
  details: {
    gpu_type: 'RTX 4090',
    model: 'sd_v1.5',
  },
}))

// Mock usage stats
const mockUsageStats: UsageStats = {
  period: 'month',
  start_date: new Date(Date.now() - 30 * 86400000).toISOString(),
  end_date: new Date().toISOString(),
  gpu_seconds: 3600,
  storage_gb_hours: 240,
  total_cost: 25.50,
  task_count: 150,
}

// Mock admin users
const mockAdminUsers: AdminUser[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  username: `user_${i + 1}`,
  email: `user${i + 1}@example.com`,
  tier: ['basic', 'pro', 'enterprise'][i % 3] as string,
  balance: Math.random() * 500,
  storage_used: Math.random() * 50,
  storage_limit: [5, 50, 200][i % 3],
  created_at: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
  status: ['active', 'suspended', 'banned'][Math.floor(Math.random() * 10) > 8 ? Math.floor(Math.random() * 3) : 0] as AdminUser['status'],
  role: i === 0 ? 'admin' : 'user',
  last_login_at: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}))

// Mock admin stats
const mockAdminStats: AdminStats = {
  total_users: 1250,
  active_users_today: 342,
  total_revenue: 125680.50,
  total_tasks_today: 1580,
  instances_online: 3,
  instances_total: 3,
  avg_queue_length: 2.3,
  gpu_utilization_avg: 68.5,
}

// Mock instances
const mockInstances: ComfyInstance[] = [
  {
    id: 'comfyui-1',
    url: 'http://comfyui-1:8188',
    name: 'ComfyUI Instance 1',
    status: 'online',
    gpu_type: 'RTX 4090',
    queue_size: 2,
    current_task: 'task_abc123',
    uptime_seconds: 345600,
    gpu_utilization: 75,
    vram_used_gb: 18.5,
    vram_total_gb: 24,
  },
  {
    id: 'comfyui-2',
    url: 'http://comfyui-2:8188',
    name: 'ComfyUI Instance 2',
    status: 'busy',
    gpu_type: 'RTX 4090',
    queue_size: 5,
    current_task: 'task_def456',
    uptime_seconds: 345600,
    gpu_utilization: 92,
    vram_used_gb: 22.1,
    vram_total_gb: 24,
  },
  {
    id: 'comfyui-3',
    url: 'http://comfyui-3:8188',
    name: 'ComfyUI Instance 3',
    status: 'online',
    gpu_type: 'RTX 4090',
    queue_size: 0,
    uptime_seconds: 345600,
    gpu_utilization: 38,
    vram_used_gb: 8.2,
    vram_total_gb: 24,
  },
]

// Mock private models
const mockPrivateModels: PrivateModel[] = [
  { id: 1, name: 'my_custom_lora.safetensors', type: 'lora', size_bytes: 143654912, uploaded_at: '2026-02-10T15:30:00Z', storage_cost_per_day: 0.01 },
  { id: 2, name: 'portrait_v2.safetensors', type: 'checkpoint', size_bytes: 2147483648, uploaded_at: '2026-02-05T10:00:00Z', storage_cost_per_day: 0.15 },
  { id: 3, name: 'style_transfer.safetensors', type: 'lora', size_bytes: 67108864, uploaded_at: '2026-01-28T08:20:00Z', storage_cost_per_day: 0.005 },
  { id: 4, name: 'custom_vae.safetensors', type: 'vae', size_bytes: 335544320, uploaded_at: '2026-01-15T12:00:00Z', storage_cost_per_day: 0.02 },
  { id: 5, name: 'neg_embed_v1.pt', type: 'embedding', size_bytes: 24576, uploaded_at: '2026-01-10T09:00:00Z', storage_cost_per_day: 0.001 },
]

// Mock admin models
const mockAdminModels: AdminModel[] = [
  { id: 101, name: 'sd_v1.5.safetensors', type: 'checkpoint', size_bytes: 4265380864, uploaded_at: '2025-06-01T00:00:00Z', storage_cost_per_day: 0, user_id: 0, username: 'system', visibility: 'base', status: 'active' },
  { id: 102, name: 'sdxl_base.safetensors', type: 'checkpoint', size_bytes: 6938820608, uploaded_at: '2025-06-01T00:00:00Z', storage_cost_per_day: 0, user_id: 0, username: 'system', visibility: 'base', status: 'active' },
  { id: 103, name: 'premium_realistic.safetensors', type: 'checkpoint', size_bytes: 5368709120, uploaded_at: '2025-08-15T00:00:00Z', storage_cost_per_day: 0, user_id: 0, username: 'system', visibility: 'vip', status: 'active' },
  { id: 104, name: 'premium_anime.safetensors', type: 'lora', size_bytes: 184549376, uploaded_at: '2025-09-01T00:00:00Z', storage_cost_per_day: 0, user_id: 0, username: 'system', visibility: 'vip', status: 'active' },
  ...mockPrivateModels.map((m) => ({ ...m, id: m.id + 200, user_id: 1, username: 'demo_user', visibility: 'private' as const, status: 'active' as const })),
]

// Mock subscription
const mockSubscription: Subscription = {
  tier: 'pro',
  status: 'active',
  started_at: '2026-01-01T00:00:00Z',
  expires_at: '2026-07-01T00:00:00Z',
  auto_renew: true,
}

// Mock recharge records
const mockRechargeRecords: RechargeRecord[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  user_id: (i % 5) + 1,
  username: `user_${(i % 5) + 1}`,
  amount: [10, 50, 100, 200, 500][i % 5],
  currency: 'CNY',
  payment_method: ['alipay', 'wechat', 'stripe'][i % 3],
  status: i < 25 ? 'completed' as const : ['pending', 'failed', 'refunded'][i % 3] as RechargeRecord['status'],
  created_at: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
  completed_at: i < 25 ? new Date(Date.now() - (30 - i) * 86400000 + 60000).toISOString() : undefined,
}))

// Mock finance stats
const mockFinanceStats: FinanceStats = {
  total_revenue: 125680.50,
  revenue_today: 2350.00,
  revenue_this_week: 15680.00,
  revenue_this_month: 42350.00,
  total_recharges: 3250,
  avg_recharge_amount: 38.67,
}

// Mock system config
const mockSystemConfig: SystemConfig = {
  billing: { gpu_price_per_second: 0.002, storage_price_per_gb_day: 0.01, bandwidth_price_per_gb: 0.05 },
  instance_pool: { max_queue_per_instance: 10, health_check_interval_seconds: 30, auto_scale_enabled: false },
  system: { max_upload_size_mb: 4096, allowed_model_types: ['checkpoint', 'lora', 'vae', 'embedding'], maintenance_mode: false },
}

// Mock system logs
const mockSystemLogs: SystemLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: 50 - i,
  level: (['info', 'info', 'info', 'warn', 'error'] as const)[i % 5],
  source: ['auth', 'proxy', 'billing', 'instance', 'system'][i % 5],
  message: [
    '用户登录成功',
    '请求转发到 comfyui-1',
    '用户余额扣费 ¥0.50',
    'comfyui-2 队列长度超过阈值',
    'comfyui-3 健康检查失败',
  ][i % 5],
  user_id: i % 3 === 0 ? (i % 10) + 1 : undefined,
  username: i % 3 === 0 ? `user_${(i % 10) + 1}` : undefined,
  created_at: new Date(Date.now() - i * 600000).toISOString(),
}))
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  auth: {
    login: async (username: string, password: string) => {
      await delay()
      // Admin login
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('mock_current_user', 'admin')
        return { token: mockToken, user: mockAdminUser } as LoginResponse
      }
      // Regular user login (any username except 'admin', password must be 'demo' or '123456')
      if (username !== 'admin' && (password === 'demo' || password === '123456')) {
        localStorage.setItem('mock_current_user', 'user')
        return { token: mockToken, user: mockUser } as LoginResponse
      }
      throw new Error('Invalid credentials')
    },

    register: async (username: string, email: string) => {
      await delay()
      const newUser: User = {
        ...mockUser,
        id: Math.floor(Math.random() * 10000),
        username,
        email,
        tier: 'basic',
        balance: 0,
        storage_limit: 5,
        created_at: new Date().toISOString(),
      }
      return { token: mockToken, user: newUser } as RegisterResponse
    },

    logout: async () => {
      await delay(100)
      localStorage.removeItem('mock_current_user')
      return { message: 'Logged out successfully' }
    },

    getCurrentUser: async () => {
      await delay()
      // Check if there's a stored user type
      const storedUser = localStorage.getItem('mock_current_user')
      if (storedUser === 'admin') {
        return mockAdminUser
      }
      return mockUser
    },
  },

  user: {
    getBalance: async () => {
      await delay()
      return mockBalance
    },

    getUsageRecords: async (params?: { start_date?: string; end_date?: string; limit?: number; offset?: number }) => {
      await delay()
      const offset = params?.offset || 0
      const limit = params?.limit || 50
      return {
        records: mockUsageRecords.slice(offset, offset + limit),
        total: mockUsageRecords.length,
      }
    },

    getUsageStats: async (period: 'day' | 'week' | 'month' | 'year') => {
      await delay()
      return { ...mockUsageStats, period }
    },
  },

  tier: {
    getTiers: async () => {
      await delay()
      return mockTiers
    },
  },

  admin: {
    getStats: async () => {
      await delay()
      return mockAdminStats
    },

    getUsers: async (params?: { limit?: number; offset?: number; search?: string }) => {
      await delay()
      const offset = params?.offset || 0
      const limit = params?.limit || 20
      let filtered = mockAdminUsers
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = mockAdminUsers.filter(
          (u) => u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
        )
      }
      return {
        users: filtered.slice(offset, offset + limit),
        total: filtered.length,
      }
    },

    updateUser: async (id: number, data: Partial<Pick<AdminUser, 'tier' | 'status' | 'role' | 'balance'>>) => {
      await delay()
      const user = mockAdminUsers.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      return { ...user, ...data }
    },

    getInstances: async () => {
      await delay()
      return mockInstances
    },
  },

  models: {
    getPrivateModels: async () => {
      await delay()
      return { models: mockPrivateModels }
    },

    uploadModel: async (name: string, type: PrivateModel['type']) => {
      await delay(500)
      const newModel: PrivateModel = {
        id: Date.now(),
        name,
        type,
        size_bytes: Math.floor(Math.random() * 2147483648),
        uploaded_at: new Date().toISOString(),
        storage_cost_per_day: 0.01,
      }
      mockPrivateModels.push(newModel)
      return newModel
    },

    deleteModel: async (id: number) => {
      await delay()
      const idx = mockPrivateModels.findIndex((m) => m.id === id)
      if (idx !== -1) mockPrivateModels.splice(idx, 1)
      return { message: 'Model deleted successfully' }
    },
  },

  subscription: {
    getSubscription: async () => {
      await delay()
      return mockSubscription
    },

    upgrade: async (targetTier: string) => {
      await delay(500)
      mockSubscription.tier = targetTier
      mockSubscription.started_at = new Date().toISOString()
      mockSubscription.expires_at = new Date(Date.now() + 180 * 86400000).toISOString()
      return mockSubscription
    },
  },

  adminModels: {
    getModels: async (params?: { visibility?: string; limit?: number; offset?: number }) => {
      await delay()
      let filtered = mockAdminModels
      if (params?.visibility) filtered = filtered.filter((m) => m.visibility === params.visibility)
      const offset = params?.offset || 0
      const limit = params?.limit || 50
      return { models: filtered.slice(offset, offset + limit), total: filtered.length }
    },

    updateModel: async (id: number, data: Partial<Pick<AdminModel, 'visibility' | 'status'>>) => {
      await delay()
      const model = mockAdminModels.find((m) => m.id === id)
      if (!model) throw new Error('Model not found')
      return { ...model, ...data }
    },

    deleteModel: async (_id: number) => {
      await delay()
      return { message: 'Model deleted successfully' }
    },
  },

  finance: {
    getStats: async () => {
      await delay()
      return mockFinanceStats
    },

    getRechargeRecords: async (params?: { limit?: number; offset?: number }) => {
      await delay()
      const offset = params?.offset || 0
      const limit = params?.limit || 20
      return { records: mockRechargeRecords.slice(offset, offset + limit), total: mockRechargeRecords.length }
    },
  },

  config: {
    getConfig: async () => {
      await delay()
      return mockSystemConfig
    },

    updateConfig: async (data: Partial<SystemConfig>) => {
      await delay()
      Object.assign(mockSystemConfig, data)
      return mockSystemConfig
    },
  },

  logs: {
    getLogs: async (params?: { level?: string; source?: string; limit?: number; offset?: number }) => {
      await delay()
      let filtered = mockSystemLogs
      if (params?.level) filtered = filtered.filter((l) => l.level === params.level)
      if (params?.source) filtered = filtered.filter((l) => l.source === params.source)
      const offset = params?.offset || 0
      const limit = params?.limit || 20
      return { logs: filtered.slice(offset, offset + limit), total: filtered.length }
    },
  },
}
