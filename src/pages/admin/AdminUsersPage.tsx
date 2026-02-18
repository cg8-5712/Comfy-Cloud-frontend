import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { adminApi } from '@/api'
import { useTierStore } from '@/stores/tierStore'
import type { AdminUser } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const { tiers, fetchTiers, getLabel } = useTierStore()
  const limit = 20

  const load = () => {
    adminApi
      .getUsers({ limit, offset: page * limit, search: search || undefined })
      .then(({ data }) => {
        setUsers(data.users)
        setTotal(data.total)
      })
      .catch(() => {})
  }

  useEffect(() => { fetchTiers() }, [])
  useEffect(() => { load() }, [page])
  const handleSearch = () => {
    setPage(0)
    load()
  }

  const handleSave = async () => {
    if (!editUser) return
    try {
      const { data } = await adminApi.updateUser(editUser.id, {
        tier: editUser.tier,
        status: editUser.status,
        role: editUser.role,
        balance: editUser.balance,
      })
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)))
      setEditUser(null)
    } catch {
      // handle error
    }
  }

  const statusColor: Record<string, string> = {
    active: 'bg-primary/10 text-primary',
    suspended: 'bg-amber-500/10 text-amber-600',
    banned: 'bg-destructive/10 text-destructive',
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground">管理平台用户账户</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="搜索用户名或邮箱..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="max-w-sm"
            />
            <Button size="sm" onClick={handleSearch}>搜索</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>等级</TableHead>
                <TableHead>余额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>角色</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{getLabel(u.tier)}</Badge></TableCell>
                  <TableCell>¥{u.balance.toFixed(2)}</TableCell>
                  <TableCell><Badge className={statusColor[u.status] || ''}>{u.status}</Badge></TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditUser({ ...u })}>
                      编辑
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
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

      {/* Edit dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑用户 — {editUser?.username}</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>订阅等级</Label>
                <Select value={editUser.tier} onValueChange={(v) => setEditUser({ ...editUser, tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiers.map((t) => (
                      <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={editUser.status} onValueChange={(v: AdminUser['status']) => setEditUser({ ...editUser, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={editUser.role} onValueChange={(v: AdminUser['role']) => setEditUser({ ...editUser, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>余额</Label>
                <Input
                  type="number"
                  value={editUser.balance}
                  onChange={(e) => setEditUser({ ...editUser, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditUser(null)}>取消</Button>
                <Button onClick={handleSave}>保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
