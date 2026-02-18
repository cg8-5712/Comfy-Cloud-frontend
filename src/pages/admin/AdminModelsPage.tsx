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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { adminModelApi } from '@/api'
import type { AdminModel } from '@/types'

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

const visibilityLabels: Record<string, string> = { base: '基础', vip: 'VIP', private: '私有' }
const visibilityColors: Record<string, string> = {
  base: 'bg-muted text-muted-foreground',
  vip: 'bg-amber-500/10 text-amber-600',
  private: 'bg-primary/10 text-primary',
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<AdminModel[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<string>('all')
  const [editModel, setEditModel] = useState<AdminModel | null>(null)

  const load = () => {
    const params = filter === 'all' ? {} : { visibility: filter }
    adminModelApi.getModels(params).then(({ data }) => {
      setModels(data.models)
      setTotal(data.total)
    }).catch(() => {})
  }

  useEffect(() => { load() }, [filter])

  const handleSave = async () => {
    if (!editModel) return
    await adminModelApi.updateModel(editModel.id, { visibility: editModel.visibility, status: editModel.status })
    setEditModel(null)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个模型吗？')) return
    await adminModelApi.deleteModel(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">模型管理</h1>
        <p className="text-muted-foreground">管理平台所有模型</p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="base">基础模型</SelectItem>
            <SelectItem value="vip">VIP 模型</SelectItem>
            <SelectItem value="private">私有模型</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">共 {total} 个模型</span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>可见性</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>所有者</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-sm">{m.name}</TableCell>
                  <TableCell><Badge variant="outline">{m.type}</Badge></TableCell>
                  <TableCell><Badge className={visibilityColors[m.visibility]}>{visibilityLabels[m.visibility]}</Badge></TableCell>
                  <TableCell>{formatSize(m.size_bytes)}</TableCell>
                  <TableCell className="text-muted-foreground">{m.username}</TableCell>
                  <TableCell><Badge variant={m.status === 'active' ? 'default' : 'outline'}>{m.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditModel({ ...m })}>编辑</Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(m.id)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editModel} onOpenChange={(o) => !o && setEditModel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>编辑模型 — {editModel?.name}</DialogTitle></DialogHeader>
          {editModel && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>可见性</Label>
                <Select value={editModel.visibility} onValueChange={(v: AdminModel['visibility']) => setEditModel({ ...editModel, visibility: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">基础（所有用户）</SelectItem>
                    <SelectItem value="vip">VIP（付费用户）</SelectItem>
                    <SelectItem value="private">私有（仅所有者）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={editModel.status} onValueChange={(v: AdminModel['status']) => setEditModel({ ...editModel, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditModel(null)}>取消</Button>
                <Button onClick={handleSave}>保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
