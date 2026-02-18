import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useTierStore } from '@/stores/tierStore'
import { subscriptionApi } from '@/api'
import type { Subscription } from '@/types'

export default function SubscriptionPage() {
  const { user } = useAuthStore()
  const { tiers, fetchTiers } = useTierStore()
  const [sub, setSub] = useState<Subscription | null>(null)
  const [upgrading, setUpgrading] = useState('')

  useEffect(() => {
    fetchTiers()
    subscriptionApi.getSubscription().then(({ data }) => setSub(data)).catch(() => {})
  }, [])

  const handleUpgrade = async (tierKey: string) => {
    setUpgrading(tierKey)
    try {
      const { data } = await subscriptionApi.upgrade(tierKey)
      setSub(data)
    } catch { /* */ }
    setUpgrading('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">订阅管理</h1>
        <p className="text-muted-foreground">管理您的订阅方案</p>
      </div>

      {sub && (
        <Card>
          <CardHeader><CardTitle className="text-base">当前订阅</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">方案</p>
                <p className="text-lg font-bold">{tiers.find((t) => t.key === sub.tier)?.label || sub.tier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">状态</p>
                <Badge className={sub.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>{sub.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">到期时间</p>
                <p className="font-medium">{new Date(sub.expires_at).toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">自动续费</p>
                <p className="font-medium">{sub.auto_renew ? '是' : '否'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => {
          const isCurrent = user?.tier === tier.key
          return (
            <Card key={tier.key} className={tier.popular ? 'border-primary shadow-sm' : ''}>
              <CardHeader>
                {tier.popular && <Badge className="w-fit bg-primary/10 text-primary mb-2">推荐</Badge>}
                <CardTitle className="text-lg">{tier.label}</CardTitle>
                <p className="text-2xl font-bold">{tier.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent || upgrading === tier.key}
                  onClick={() => handleUpgrade(tier.key)}
                >
                  {isCurrent ? '当前方案' : upgrading === tier.key ? '处理中...' : '选择方案'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
