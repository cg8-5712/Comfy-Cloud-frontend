import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'
import { useTierStore } from '@/stores/tierStore'

const presetAmounts = [10, 50, 100, 200, 500, 1000]

export default function RechargePage() {
  const { user, balance } = useAuthStore()
  const { tiers, fetchTiers } = useTierStore()
  const [amount, setAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)

  useEffect(() => {
    fetchTiers()
  }, [])

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value)
    setAmount(String(value))
  }

  const handleCustomAmount = (value: string) => {
    setSelectedPreset(null)
    setAmount(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">充值</h1>
        <p className="text-muted-foreground">为您的账户充值或升级订阅方案</p>
      </div>

      {/* Current balance */}
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>当前余额</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            ¥{balance?.balance?.toFixed(2) ?? '0.00'}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Recharge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">余额充值</CardTitle>
          <CardDescription>选择充值金额或输入自定义金额</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((value) => (
              <Button
                key={value}
                variant={selectedPreset === value ? 'default' : 'outline'}
                onClick={() => handlePresetClick(value)}
                className="h-12"
              >
                ¥{value}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-amount">自定义金额</Label>
            <div className="flex gap-2">
              <Input
                id="custom-amount"
                type="number"
                min="1"
                placeholder="输入金额"
                value={selectedPreset ? '' : amount}
                onChange={(e) => handleCustomAmount(e.target.value)}
              />
              <Button disabled={!amount || Number(amount) <= 0} className="shrink-0">
                确认充值
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription plans */}
      {tiers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">订阅方案</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.key}
                className={tier.popular ? 'border-primary shadow-sm' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tier.label}</CardTitle>
                    {tier.popular && <Badge>推荐</Badge>}
                  </div>
                  <CardDescription className="text-2xl font-bold text-foreground">
                    {tier.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {user?.tier === tier.key ? '当前方案' : '升级'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
