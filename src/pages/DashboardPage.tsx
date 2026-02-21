import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTierStore } from '@/stores/tierStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, balance, fetchUser, fetchBalance } = useAuthStore()
  const { fetchTiers, getLabel, getColor } = useTierStore()

  useEffect(() => {
    fetchUser()
    fetchBalance()
    fetchTiers()
  }, [])

  const storagePercent = user
    ? Math.round((user.storage_used / user.storage_limit) * 100)
    : 0

  const formatBytes = (gb: number) => {
    if (gb < 1) return `${Math.round(gb * 1024)} MB`
    return `${gb.toFixed(1)} GB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来，{user?.username || '用户'}</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">账户余额</CardTitle>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{balance?.balance?.toFixed(2) ?? '0.00'}</div>
            <Button variant="link" className="px-0 h-auto text-xs text-primary" onClick={() => navigate('/account/recharge')}>
              去充值 →
            </Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">订阅等级</CardTitle>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{getLabel(user?.tier || 'basic')}</span>
              <Badge className={getColor(user?.tier || 'basic')}>{user?.tier || 'basic'}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">当前订阅方案</p>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">存储空间</CardTitle>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storagePercent}%</div>
            <Progress value={storagePercent} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatBytes(user?.storage_used || 0)} / {formatBytes(user?.storage_limit || 10)}
            </p>
          </CardContent>
        </Card>

        {/* Quick launch */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">快速启动</CardTitle>
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">打开 ComfyUI 开始创作</p>
            <Button size="sm" onClick={() => window.location.href = import.meta.env.VITE_COMFY_URL || '/comfy/'} className="w-full">
              启动 ComfyUI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity & quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground flex-1">暂无最近活动</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/account/usage')} className="w-full">
                查看全部记录
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">快捷操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/account/recharge')}>
                充值余额
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = import.meta.env.VITE_COMFY_URL || '/comfy/'}>
                打开 ComfyUI
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/account/usage')}>
                使用统计
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/account/settings')}>
                账户设置
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
