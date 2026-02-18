import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { modelApi } from '@/api'
import type { PrivateModel } from '@/types'

const typeLabels: Record<string, string> = {
  checkpoint: 'Checkpoint',
  lora: 'LoRA',
  vae: 'VAE',
  embedding: 'Embedding',
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default function ModelsPage() {
  const [models, setModels] = useState<PrivateModel[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadType, setUploadType] = useState<PrivateModel['type']>('lora')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    modelApi.getPrivateModels().then(({ data }) => setModels(data.models)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const totalSize = models.reduce((s, m) => s + m.size_bytes, 0)
  const dailyCost = models.reduce((s, m) => s + m.storage_cost_per_day, 0)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      await modelApi.uploadModel(file, uploadType)
      setShowUpload(false)
      load()
    } catch { /* */ }
    setUploading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个模型吗？')) return
    await modelApi.deleteModel(id)
    load()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">模型管理</h1>
          <p className="text-muted-foreground">管理您的私有模型</p>
        </div>
        <Button size="sm" onClick={() => setShowUpload(true)}>上传模型</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">模型数量</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{models.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">总存储</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatSize(totalSize)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">每日存储费用</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">¥{dailyCost.toFixed(3)}</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead>日费用</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium font-mono text-sm">{m.name}</TableCell>
                  <TableCell><Badge variant="outline">{typeLabels[m.type] || m.type}</Badge></TableCell>
                  <TableCell>{formatSize(m.size_bytes)}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(m.uploaded_at).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell>¥{m.storage_cost_per_day.toFixed(3)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(m.id)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
              {models.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">暂无私有模型</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader><DialogTitle>上传模型</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>模型类型</Label>
              <Select value={uploadType} onValueChange={(v: PrivateModel['type']) => setUploadType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkpoint">Checkpoint</SelectItem>
                  <SelectItem value="lora">LoRA</SelectItem>
                  <SelectItem value="vae">VAE</SelectItem>
                  <SelectItem value="embedding">Embedding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <p className="text-sm text-muted-foreground">
                {uploading ? '上传中...' : '拖拽文件到此处，或点击选择文件'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">支持 .safetensors, .pt, .ckpt 格式</p>
              <input ref={fileRef} type="file" className="hidden" accept=".safetensors,.pt,.ckpt" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
