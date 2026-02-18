import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { logApi } from '@/api'
import type { SystemLog } from '@/types'

const levelColors: Record<string, string> = {
  info: 'bg-primary/10 text-primary',
  warn: 'bg-amber-500/10 text-amber-600',
  error: 'bg-destructive/10 text-destructive',
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [levelFilter, setLevelFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const limit = 20

  const load = () => {
    const params: Record<string, unknown> = { limit, offset: page * limit }
    if (levelFilter !== 'all') params.level = levelFilter
    if (sourceFilter !== 'all') params.source = sourceFilter
    logApi.getLogs(params as { level?: string; source?: string; limit?: number; offset?: number }).then(({ data }) => {
      setLogs(data.logs)
      setTotal(data.total)
    }).catch(() => {})
  }

  useEffect(() => { setPage(0) }, [levelFilter, sourceFilter])
  useEffect(() => { load() }, [page, levelFilter, sourceFilter])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">系统日志</h1>
        <p className="text-muted-foreground">查看系统运行日志</p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-28"><SelectValue placeholder="级别" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部级别</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-28"><SelectValue placeholder="来源" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="proxy">Proxy</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="instance">Instance</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">共 {total} 条</span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">级别</TableHead>
                <TableHead className="w-20">来源</TableHead>
                <TableHead>消息</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell><Badge className={levelColors[l.level]}>{l.level}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{l.source}</Badge></TableCell>
                  <TableCell>{l.message}</TableCell>
                  <TableCell className="text-muted-foreground">{l.username || '-'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString('zh-CN')}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">暂无日志</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">第 {page + 1}/{totalPages} 页</p>
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
