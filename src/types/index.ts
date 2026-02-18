export type SubscriptionTier = 'basic' | 'pro' | 'enterprise'

export interface User {
  id: number
  username: string
  email: string
  tier: SubscriptionTier
  balance: number
  storage_used: number
  storage_limit: number
  created_at: string
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
