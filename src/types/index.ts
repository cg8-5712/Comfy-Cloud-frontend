export type SubscriptionTier = string

export interface TierConfig {
  key: string
  label: string
  color: string        // badge 样式类，如 'bg-primary/10 text-primary'
  price: string        // 显示价格，如 '¥99/月' 或 '免费'
  features: string[]
  popular?: boolean
}

export interface User {
  id: number
  username: string
  email: string
  tier: SubscriptionTier
  balance: number
  storage_used: number
  storage_limit: number
  created_at: string
  role?: 'user' | 'admin'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  token: string
  user: User
}

export interface Balance {
  balance: number
  currency: string
  last_updated: string
}

export interface UsageRecord {
  id: number
  task_id: string
  type: 'gpu_usage' | 'storage' | 'bandwidth'
  started_at: string
  ended_at: string
  duration_seconds: number
  cost: number
  details: Record<string, unknown>
}

export interface UsageStats {
  period: 'day' | 'week' | 'month' | 'year'
  start_date: string
  end_date: string
  gpu_seconds: number
  storage_gb_hours: number
  total_cost: number
  task_count: number
}

// Admin types

export interface AdminUser extends User {
  status: 'active' | 'suspended' | 'banned'
  role: 'user' | 'admin'
  last_login_at: string
}

export interface ComfyInstance {
  id: string
  url: string
  name: string
  status: 'online' | 'offline' | 'busy'
  gpu_type: string
  queue_size: number
  current_task?: string
  uptime_seconds: number
  gpu_utilization: number
  vram_used_gb: number
  vram_total_gb: number
}

export interface AdminStats {
  total_users: number
  active_users_today: number
  total_revenue: number
  total_tasks_today: number
  instances_online: number
  instances_total: number
  avg_queue_length: number
  gpu_utilization_avg: number
}
