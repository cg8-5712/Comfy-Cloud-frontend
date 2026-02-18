# Comfy Cloud - 管理平台前端

基于 React + TypeScript + Vite + Tailwind CSS + shadcn/ui 构建的现代化管理平台。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 3.4
- **UI 组件**: shadcn/ui (手动集成)
- **状态管理**: Zustand
- **路由**: React Router v7
- **HTTP 客户端**: Axios
- **日期处理**: date-fns

## 主题色

- **主色调**: #76ED95 (绿色)
- **设计风格**: Glassmorphism (玻璃态)
- **支持**: 亮色/暗色主题

## 项目结构

```
frontend/
├── src/
│   ├── api/              # API 客户端
│   ├── components/       # React 组件
│   │   └── ui/          # shadcn/ui 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具函数
│   ├── pages/           # 页面组件
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript 类型
│   ├── App.tsx          # 应用入口
│   ├── main.tsx         # React 入口
│   └── index.css        # 全局样式
├── public/              # 静态资源
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目配置
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器（Mock 模式）

开发环境默认使用 mock API，无需后端即可运行：

```bash
npm run dev
```

访问 http://localhost:5173

#### 测试账号

**普通用户：**
- 用户名：任意
- 密码：`demo` 或 `123456`

**管理员：**
- 用户名：`admin`
- 密码：`admin`

登录后可以访问：
- 用户面板：`/account` （仪表盘、充值、使用记录、设置）
- 管理后台：`/admin` （概览、用户管理、实例监控）

### 使用真实 API

修改 `.env.development` 文件：

```env
VITE_USE_MOCK_API=false
```

或在启动时设置环境变量：

```bash
VITE_USE_MOCK_API=false npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## Mock 数据说明

Mock 数据定义在 `src/api/mock.ts`，包含：

- 2 个用户（普通用户 + 管理员）
- 3 个订阅等级（基础版、专业版、企业版）
- 15 条使用记录
- 25 个模拟用户（管理后台）
- 3 个 ComfyUI 实例

所有 API 调用都有 300ms 延迟模拟网络请求。

## 已完成功能

### Phase 2.6.1 - 认证页面 ✅

- [x] 登录页面 (`/login`)
- [x] 注册页面 (`/register`)
- [x] Glassmorphism 设计风格
- [x] 响应式设计

### Phase 2.6.2 - 账户管理页面 ✅

- [x] 仪表盘 (`/account`)
  - 账户余额、订阅等级、存储空间、快速启动
  - 最近活动、快捷操作
- [x] 充值页面 (`/account/recharge`)
  - 预设金额、自定义金额
  - 订阅方案（动态从后端获取）
- [x] 使用记录 (`/account/usage`)
  - 统计概览、记录表格、分页
- [x] 个人设置 (`/account/settings`)
  - 个人信息、修改密码、危险操作

### Phase 2.6.3 - Admin 后台 ✅

- [x] 管理概览 (`/admin`)
  - 7 个统计卡片
  - 使用趋势图表（ChartAreaInteractive）
- [x] 用户管理 (`/admin/users`)
  - 用户列表、搜索、分页
  - 编辑用户（等级、状态、角色、余额）
- [x] 实例监控 (`/admin/instances`)
  - 实例状态、GPU 利用率、队列长度
  - 实例详情卡片

### 核心功能 ✅

- [x] 状态管理 (Zustand)
  - authStore: 用户认证、Token 管理
  - tierStore: 订阅等级配置（从后端获取）
- [x] API 客户端 (Axios)
  - 自动注入 Token
  - 401 自动重定向
  - Mock 模式支持
- [x] 路由保护
  - 未登录重定向到登录页
  - 嵌套路由（AccountLayout、AdminLayout）

## 环境变量

### 开发环境 (`.env.development`)

```env
# 启用 Mock API（默认）
VITE_USE_MOCK_API=true
```

### 生产环境 (`.env.production`)

```env
# 使用真实 API
VITE_USE_MOCK_API=false
```

如需自定义 API 地址，可添加：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## API 集成

前端支持两种模式：

### Mock 模式（开发）

通过 `src/api/mock.ts` 提供模拟数据，无需后端即可运行。

### 真实 API 模式（生产）

后端 API 地址默认为 `/api`，可通过 Vite 代理配置：

```typescript
// vite.config.ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

API 规范详见 [API_SPECIFICATION.md](../API_SPECIFICATION.md)。

## 设计规范

### 颜色

- Primary: `hsl(142 79% 69%)` - #76ED95
- Background: 渐变背景 `from-slate-900 via-purple-900 to-slate-900`
- Glass: `bg-white/10` + `backdrop-blur-xl`

### 动画

- Blob 动画: 7s 循环
- Float 动画: 3s 上下浮动
- 过渡: 200-300ms

### 响应式

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 浏览器支持

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)

## License

GPL-3.0

## 相关文档

- [API 规范](../API_SPECIFICATION.md)
- [项目路线图](../CONDUCT_OF_CODE.md)
- [Phase 2.5 完成总结](../PHASE_2.5_COMPLETION_SUMMARY.md)
