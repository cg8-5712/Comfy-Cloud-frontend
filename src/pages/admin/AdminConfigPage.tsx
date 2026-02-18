import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { configApi } from '@/api'
import type { SystemConfig } from '@/types'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    configApi.getConfig().then(({ data }) => setConfig(data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    try {
      const { data } = await configApi.updateConfig(config)
      setConfig(data)
    } catch { /* */ }
    setSaving(false)
  }

  if (!config) return <div className="text-center text-muted-foreground py-12">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">系统配置</h1>
          <p className="text-muted-foreground">管理计费规则和系统参数</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存配置'}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">计费规则</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>GPU 单价 (¥/秒)</Label>
              <Input type="number" step="0.001" value={config.billing.gpu_price_per_second}
                onChange={(e) => setConfig({ ...config, billing: { ...config.billing, gpu_price_per_second: parseFloat(e.target.value) || 0 } })} />
            </div>
            <div className="space-y-2">
              <Label>存储单价 (¥/GB/天)</Label>
              <Input type="number" step="0.001" value={config.billing.storage_price_per_gb_day}
                onChange={(e) => setConfig({ ...config, billing: { ...config.billing, storage_price_per_gb_day: parseFloat(e.target.value) || 0 } })} />
            </div>
            <div className="space-y-2">
              <Label>带宽单价 (¥/GB)</Label>
              <Input type="number" step="0.001" value={config.billing.bandwidth_price_per_gb}
                onChange={(e) => setConfig({ ...config, billing: { ...config.billing, bandwidth_price_per_gb: parseFloat(e.target.value) || 0 } })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">实例池配置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>单实例最大队列</Label>
              <Input type="number" value={config.instance_pool.max_queue_per_instance}
                onChange={(e) => setConfig({ ...config, instance_pool: { ...config.instance_pool, max_queue_per_instance: parseInt(e.target.value) || 0 } })} />
            </div>
            <div className="space-y-2">
              <Label>健康检查间隔 (秒)</Label>
              <Input type="number" value={config.instance_pool.health_check_interval_seconds}
                onChange={(e) => setConfig({ ...config, instance_pool: { ...config.instance_pool, health_check_interval_seconds: parseInt(e.target.value) || 0 } })} />
            </div>
            <div className="space-y-2">
              <Label>自动扩缩容</Label>
              <div className="pt-2">
                <Button variant={config.instance_pool.auto_scale_enabled ? 'default' : 'outline'} size="sm"
                  onClick={() => setConfig({ ...config, instance_pool: { ...config.instance_pool, auto_scale_enabled: !config.instance_pool.auto_scale_enabled } })}>
                  {config.instance_pool.auto_scale_enabled ? '已启用' : '已禁用'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">系统参数</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>最大上传大小 (MB)</Label>
              <Input type="number" value={config.system.max_upload_size_mb}
                onChange={(e) => setConfig({ ...config, system: { ...config.system, max_upload_size_mb: parseInt(e.target.value) || 0 } })} />
            </div>
            <div className="space-y-2">
              <Label>允许的模型类型</Label>
              <p className="text-sm text-muted-foreground pt-2">
                {config.system.allowed_model_types.map((t) => (
                  <Badge key={t} variant="outline" className="mr-1">{t}</Badge>
                ))}
              </p>
            </div>
            <div className="space-y-2">
              <Label>维护模式</Label>
              <div className="pt-2">
                <Button variant={config.system.maintenance_mode ? 'destructive' : 'outline'} size="sm"
                  onClick={() => setConfig({ ...config, system: { ...config.system, maintenance_mode: !config.system.maintenance_mode } })}>
                  {config.system.maintenance_mode ? '维护中' : '正常运行'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
