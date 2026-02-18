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
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
yarn build
```

### 预览生产构建

```bash
yarn preview
```

## 已完成功能

### Phase 2.6.1 - 认证页面 ✅

- [x] 登录页面 (`/login`)
  - Glassmorphism 设计风格
  - 用户名/密码登录
  - 记住我选项
  - 忘记密码链接
  - 动画背景和浮动元素
  - 响应式设计

- [x] 注册页面 (`/register`)
  - 用户名、邮箱、密码输入
  - 密码确认验证
  - 表单验证
  - 错误提示

### 核心功能

- [x] 状态管理 (Zustand)
  - 用户认证状态
  - Token 管理
  - 余额信息

- [x] API 客户端 (Axios)
  - 自动注入 Token
  - 401 自动重定向
  - 错误处理

- [x] 路由保护
  - 未登录重定向到登录页
  - 登录后跳转到账户页面

## 待开发功能

### Phase 2.6.2 - 账户管理页面

- [ ] 账户概览 (`/account/dashboard`)
- [ ] 充值页面 (`/account/recharge`)
- [ ] 使用记录 (`/account/usage`)
- [ ] 订阅管理 (`/account/subscription`)
- [ ] 个人设置 (`/account/settings`)

### Phase 2.6.3 - Admin 后台

- [ ] 用户管理 (`/admin/users`)
- [ ] 实例监控 (`/admin/instances`)
- [ ] 计费管理 (`/admin/billing`)
- [ ] 系统设置 (`/admin/settings`)

## 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_COMFYUI_URL=http://localhost:8188
```

## API 集成

后端 API 地址通过 Vite 代理配置：

```typescript
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

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
