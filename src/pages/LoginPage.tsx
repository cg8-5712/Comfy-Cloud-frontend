import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(username, password)

      // Check if there's a redirect URL
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')

      if (redirect) {
        window.location.href = decodeURIComponent(redirect)
      } else {
        // Get user from store to check role
        const user = useAuthStore.getState().user
        if (user?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/account')
        }
      }
    } catch (err) {
      setError('登录失败，请检查用户名和密码')
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

      {/* Login card */}
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
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              Comfy Cloud
            </CardTitle>
            <CardDescription className="text-white/70">
              登录到您的账户以继续使用 ComfyUI
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
                  placeholder="输入您的用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-white/70 cursor-pointer"
                  >
                    记住我
                  </Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  忘记密码？
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/50 transition-all hover:shadow-xl hover:shadow-primary/60"
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>

              <div className="text-center text-sm text-white/60">
                还没有账户？{' '}
                <a
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  立即注册
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
