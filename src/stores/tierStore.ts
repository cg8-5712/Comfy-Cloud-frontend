import { create } from 'zustand'
import type { TierConfig } from '@/types'
import { tierApi } from '@/api'

interface TierState {
  tiers: TierConfig[]
  loaded: boolean
  fetchTiers: () => Promise<void>
  getLabel: (key: string) => string
  getColor: (key: string) => string
  getTier: (key: string) => TierConfig | undefined
}

export const useTierStore = create<TierState>((set, get) => ({
  tiers: [],
  loaded: false,

  fetchTiers: async () => {
    if (get().loaded) return
    try {
      const { data } = await tierApi.getTiers()
      set({ tiers: data, loaded: true })
    } catch {
      // fallback 默认值，保证页面不会空白
      set({
        tiers: [
          { key: 'basic', label: '基础版', color: 'bg-muted text-muted-foreground', price: '免费', features: [] },
          { key: 'pro', label: '专业版', color: 'bg-primary/10 text-primary', price: '¥99/月', features: [] },
          { key: 'enterprise', label: '企业版', color: 'bg-amber-500/10 text-amber-600', price: '¥299/月', features: [] },
        ],
        loaded: true,
      })
    }
  },

  getLabel: (key) => get().tiers.find((t) => t.key === key)?.label ?? key,
  getColor: (key) => get().tiers.find((t) => t.key === key)?.color ?? '',
  getTier: (key) => get().tiers.find((t) => t.key === key),
}))
