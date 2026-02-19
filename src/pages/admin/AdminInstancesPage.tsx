import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/api'
import type { ComfyInstance } from '@/types'

export default function AdminInstancesPage() {
  const [instances, setInstances] = useState<ComfyInstance[]>([])

  const load = () => {
    adminApi.getInstances().then(({ data }) => {
      // 后端返回的字段与前端类型不完全匹配，补充默认值
      const normalized = (Array.isArray(data) ? data : []).map((inst: any) => ({
        id: inst.id ?? '',
        url: inst.url ?? '',
        name: inst.name ?? '',
        status: inst.status === 'active' ? 'online' : inst.status === 'inactive' ? 'offline' : (inst.status ?? 'offline'),
        gpu_type: inst.gpu_type ?? `GPU #${inst.gpu_id ?? 0}`,
        queue_size: inst.queue_size ?? 0,
        current_task: inst.current_task,
        uptime_seconds: inst.uptime_seconds ?? 0,
        gpu_utilization: inst.gpu_utilization ?? 0,
        vram_used_gb: inst.vram_used_gb ?? 0,
        vram_total_gb: inst.vram_total_gb ?? 0,
      }))
      setInstances(normalized)
    }).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const statusStyle: Record<string, string> = {
    online: 'bg-primary/10 text-primary',
    offline: 'bg-muted text-muted-foreground',
    busy: 'bg-amber-500/10 text-amber-600',
  }

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`
    return `${h}h ${m}m`
  }

  const online = instances.filter((i) => i.status !== 'offline').length
  const avgGpu = instances.length
    ? instances.reduce((s, i) => s + i.gpu_utilization, 0) / instances.length
    : 0
  const totalQueue = instances.reduce((s, i) => s + i.queue_size, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">实例监控</h1>
          <p className="text-muted-foreground">ComfyUI 实例运行状态</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>刷新</Button>
      </div>
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">在线实例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{online} / {instances.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均 GPU 利用率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGpu.toFixed(0)}%</div>
            <Progress value={avgGpu} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总队列长度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQueue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Instance cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances.map((inst) => (
          <Card key={inst.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{inst.name}</CardTitle>
              <Badge className={statusStyle[inst.status] || ''}>{inst.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">GPU</span>
                <span className="text-right font-medium">{inst.gpu_type}</span>
                <span className="text-muted-foreground">VRAM</span>
                <span className="text-right font-medium">{inst.vram_used_gb.toFixed(1)} / {inst.vram_total_gb} GB</span>
                <span className="text-muted-foreground">队列</span>
                <span className="text-right font-medium">{inst.queue_size}</span>
                <span className="text-muted-foreground">运行时间</span>
                <span className="text-right font-medium">{formatUptime(inst.uptime_seconds)}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">GPU 利用率</span>
                  <span>{inst.gpu_utilization}%</span>
                </div>
                <Progress value={inst.gpu_utilization} className="h-1.5" />
              </div>
              {inst.current_task && (
                <p className="text-xs text-muted-foreground truncate">
                  当前任务: <span className="font-mono">{inst.current_task}</span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {instances.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              暂无实例数据
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
