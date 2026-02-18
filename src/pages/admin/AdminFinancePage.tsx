import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { financeApi } from '@/api'
import type { FinanceStats, RechargeRecord } from '@/types'

export default function AdminFinancePage() {
  const [stats, setStats] = useState<FinanceStats | null>(null)
  const [records, setRecords] = useState<RechargeRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const limit = 20

  useEffect(() => {
    financeApi.getStats().then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  useEffect(() => {
    financeApi.getRechargeRecords({ limit, offset: page * limit }).then(({ data }) => {
      setRecords(data.records)
      setTotal(data.total)
    }).catch(() => {})
  }, [page])

  const statusColors: Record<string, string> = {
    completed: 'bg-primary/10 text-primary',
    pending: 'bg-amber-500/10 text-amber-600',
    failed: 'bg-destructive/10 text-destructive',
    refunded: 'bg-muted text-muted-foreground',
  }

  const totalPages = Math.ceil(total / limit)

  const cards = [
    { label: '总收入', value: stats ? `¥${stats.total_revenue.toLocaleString()}` : '-' },
    { label: '今日收入', value: stats ? `¥${stats.revenue_today.toLocaleString()}` : '-' },
    { label: '本周收入', value: stats ? `¥${stats.revenue_this_week.toLocaleString()}` : '-' },
    { label: '本月收入', value: stats ? `¥${stats.revenue_this_month.toLocaleString()}` : '-' },
    { label: '总充值次数', value: stats?.total_recharges ?? '-' },
    { label: '平均充值金额', value: stats ? `¥${stats.avg_recharge_amount.toFixed(2)}` : '-' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">财务报表</h1>
        <p className="text-muted-foreground">收入统计和充值记录</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{c.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">充值记录</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.username || `user_${r.user_id}`}</TableCell>
                  <TableCell className="font-medium">¥{r.amount.toFixed(2)}</TableCell>
                  <TableCell>{r.payment_method}</TableCell>
                  <TableCell><Badge className={statusColors[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleString('zh-CN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">共 {total} 条</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>下一页</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
