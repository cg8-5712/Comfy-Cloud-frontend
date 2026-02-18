import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminApi } from '@/api'
import type { AdminStats } from '@/types'
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    adminApi.getStats().then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const cards = [
    { label: '总用户数', value: stats?.total_users ?? '-' },
    { label: '今日活跃', value: stats?.active_users_today ?? '-' },
    { label: '今日任务', value: stats?.total_tasks_today ?? '-' },
    { label: '总收入', value: stats?.total_revenue != null ? `¥${stats.total_revenue.toFixed(2)}` : '-' },
    { label: '在线实例', value: stats ? `${stats.instances_online}/${stats.instances_total}` : '-' },
    { label: '平均队列', value: stats?.avg_queue_length?.toFixed(1) ?? '-' },
    { label: 'GPU 利用率', value: stats?.gpu_utilization_avg != null ? `${stats.gpu_utilization_avg.toFixed(0)}%` : '-' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">管理概览</h1>
        <p className="text-muted-foreground">平台运行状态一览</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartAreaInteractive />
    </div>
  )
}
