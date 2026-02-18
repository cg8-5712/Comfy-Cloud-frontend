import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 个字符')
      return
    }

    try {
      await register(username, email, password)
      navigate('/account')
    } catch (err: any) {
      setError(err.response?.data?.error || '注册失败，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated gradient background - 只使用主题色 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/40 rounded-full animate-float animation-delay-2000" />
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-primary/20 rounded-full animate-float animation-delay-3000" />
      </div>

      {/* Register card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/50">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              创建账户
            </CardTitle>
            <CardDescription className="text-white/70">
              注册 Comfy Cloud 开始使用 ComfyUI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90">
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="选择一个用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少 6 个字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90">
                  确认密码
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/50 transition-all hover:shadow-xl hover:shadow-primary/60"
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>

              <div className="text-center text-sm text-white/60">
                已有账户？{' '}
                <a
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  立即登录
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
