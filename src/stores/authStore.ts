import { create } from 'zustand'
import type { User, Balance } from '@/types'
import { authApi, userApi } from '@/api'

interface AuthState {
  user: User | null
  balance: Balance | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  fetchBalance: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  balance: null,
  isAuthenticated: !!localStorage.getItem('comfy_cloud_token'),
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true })
    try {
      const { data } = await authApi.login({ username, password })
      localStorage.setItem('comfy_cloud_token', data.token)
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await authApi.register({ username, email, password })
      localStorage.setItem('comfy_cloud_token', data.token)
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('comfy_cloud_token')
    set({
      user: null,
      balance: null,
      isAuthenticated: false
    })
  },

  fetchUser: async () => {
    try {
      const { data } = await authApi.getCurrentUser()
      set({ user: data })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  },

  fetchBalance: async () => {
    try {
      const { data } = await userApi.getBalance()
      set({ balance: data })
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }
}))
