# 企业级 HR 人力资源管理系统 - 开发文档

> Vue 3 + TypeScript + Element Plus 构建的企业级 HR 人力资源管理系统，覆盖组织 / 招聘 / 员工 / 合同 / 考勤 / 薪酬 / 绩效 / 培训等完整 HR 业务模块。当前为 **Mock 模式**，所有数据本地化，无需后端即可运行。

## 项目特性

- 🎯 **完整 HR 业务覆盖** —— 12 个一级业务菜单 + 工作台
- 🤖 **7 个 AI 能力** —— OKR 检查 / 评语优化 / 风险预警 / 简历解析 / 简历匹配 / 薪酬合规 / 员工资料卡
- 🔐 **RBAC 权限控制** —— 7 种预置角色（超级管理员 / HR 管理员 / HRBP / 部门负责人 / 直线经理 / 普通员工 / 面试官）
- 🌐 **国际化** —— 中文 / English 切换
- 🎨 **双框架布局** —— 侧边栏布局 / 顶部布局 + 暗黑主题
- 📦 **完全 Mock 模式** —— 无需后端，固定数据演示

## 技术栈

| 类别 | 技术 |
|---|---|
| 核心框架 | Vue 3.5 + Composition API + `<script setup>` |
| 构建工具 | Vite 7 |
| 开发语言 | TypeScript 5.6 |
| UI 组件库 | Element Plus 2.11 |
| 状态管理 | Pinia 3 + pinia-plugin-persistedstate |
| 路由 | Vue Router 4 |
| 图表 | ECharts 5 + AntV G2 |
| HTTP 客户端 | Axios |
| 国际化 | vue-i18n 9 |
| 工具库 | VueUse, mitt, crypto-js |
| 富文本编辑器 | wangEditor 5 |
| 代码规范 | ESLint + Prettier + Stylelint + Husky + lint-staged + Commitizen |

## 环境要求

- **Node.js** >= 20.19.0
- **pnpm** >= 8.8.0（项目用 pnpm，不要用 npm/yarn）

## 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd hr-system-web

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的本地配置（默认值通常可直接使用）

# 4. 启动开发服务器
pnpm dev
# 浏览器自动打开 http://localhost:3006
```

## 默认账号（Mock 模式）

所有账号密码统一为 `123456`：

| 用户名 | 角色 | 权限范围 |
|---|---|---|
| `admin` | 超级管理员 | 全部权限 |
| `hr` | HR 管理员 | 除系统管理外全部 |
| `manager` | 部门负责人 | 本部门 |
| `user` | 普通员工 | 看自己 |

## 开发命令

```bash
pnpm dev              # 启动开发服务器（自动打开浏览器）
pnpm build            # 生产构建（含 TypeScript 类型检查）
pnpm serve            # 预览生产构建
pnpm lint             # 代码检查
pnpm fix              # 自动修复代码问题
pnpm lint:prettier    # Prettier 格式化所有文件
pnpm lint:stylelint   # Stylelint 修复样式
pnpm clean:dev        # 清理开发缓存
pnpm commit           # 规范化提交（Commitizen 交互式）
```

## 项目结构

```
hr-system-web/
├── src/
│   ├── api/                # API 接口（按业务模块分组）
│   ├── assets/             # 静态资源（图片 / 样式 / 图标）
│   ├── components/
│   │   ├── core/           # 核心基础组件（布局 / 表单 / 表格等）
│   │   └── business/       # 业务组件（AI 助手 / HR 通用组件）
│   ├── composables/        # Vue 组合式函数
│   ├── config/             # 系统配置（主题 / 菜单 / 框架布局）
│   ├── enums/              # 枚举常量
│   ├── locales/            # 国际化（zh.json / en.json）
│   ├── mock/               # Mock 数据
│   │   ├── core/           # 核心数据池（员工 / 组织 / 岗位）
│   │   ├── system/         # 系统数据（角色 / 权限）
│   │   └── *.ts            # 各业务模块 Mock
│   ├── router/             # 路由配置
│   │   ├── modules/        # 各业务模块路由
│   │   ├── guards/         # 路由守卫（认证 / 权限）
│   │   └── staticRoutes.ts # 静态路由（登录 / 异常页等）
│   ├── store/              # Pinia 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── views/              # 业务页面（按模块）
├── docs/                   # 项目文档
├── public/                 # 公共静态资源
├── scripts/                # 构建辅助脚本
├── package.json
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── CLAUDE.md               # 开发规范文档
└── README-DEV.md           # 本文件
```

## 业务模块清单

| 一级菜单 | 路径前缀 | 主要子功能 |
|---|---|---|
| 工作台 | `/workspace` | 个人首页 / 待办 / 快捷入口 |
| 01 组织管理 | `/org/*` | 组织架构 / 岗位体系 / 编制管理 |
| 02 员工管理 | `/employee/*` | 员工档案 / 人员异动 / 离职管理 / 试用期 |
| 03 合同管理 | `/contract/*` | 合同列表 / 合同模板 / 归档 / 统计 |
| 04 招聘管理 | `/recruit/*` | 招聘需求 / 简历池 / 面试 / Offer / 入职 / 背调 |
| 05 考勤与假期 | `/attendance/*` | 考勤规则 / 打卡记录 / 加班 / 假期申请 / 台账 |
| 06 薪酬管理 | `/comp/*` | 薪酬结构 / 薪资核算 / 工资条 / 个税 / 福利 / 调薪 |
| 07 社保公积金 | `/social/*` | 月度申报 / 参保配置 |
| 08 绩效管理 | `/perf/*` | 周期 / 目标 / 评估 / 校准 / 1on1 / 徽章 / PIP / 申诉 |
| 09 人才发展 | `/talent/*` | 人才盘点 / 能力模型 |
| 10 培训管理 | `/training/*` | 课程 / 计划 / 记录 / 考核 / 证书 |
| 11 数据洞察 | `/insight/*` | 业务报表 / AI 辅助中心 |
| 12 系统管理 | `/system/*` | 用户 / 角色 / 字典 / 数据权限 / 审批流 / 系统参数 / 日志 |

## AI 能力

本系统集成了 **7 个 AI 能力**，详见独立文档：

- [`docs/HR系统-AI能力说明.md`](./docs/HR系统-AI能力说明.md) - 产品说明（业务视角）
- [`docs/HR系统-AI能力实现指南.md`](./docs/HR系统-AI能力实现指南.md) - 工程实施指南（接入真 LLM 时参考）

| AI 能力 | 嵌入位置 |
|---|---|
| OKR 质量检查 | 目标管理 → 编辑目标弹窗 |
| 员工资料卡生成 | 1on1 / 绩效面谈准备 |
| 高风险员工预警 | 人才发展 → 人才盘点 |
| 评语优化 | 绩效评估 → 写整体评语 |
| 智能简历解析 | 简历池 → 候选人详情 |
| 智能简历匹配 | 简历池 → AI 智能匹配（独立工作台）|
| 薪酬合理性检查 | Offer 创建 / 调薪申请（inline 检查）|

## 框架布局

系统支持 **运行时切换** 两种布局（右上角设置面板）：

- **侧边栏布局**（Framework One）—— 传统左侧菜单 + 顶部工具栏
- **顶部布局**（Framework Two）—— 固定顶部 Header + 标签页导航

## Mock 模式说明

`.env` 中 `VITE_USE_MOCK = true`（默认开启）。所有 API 请求被 Mock 拦截，由 `src/mock/` 下的固定数据返回。**Mock 数据是固定的，不是随机生成**，确保演示一致性。

## 路由与菜单

- 一级菜单都在 `src/router/modules/` 下注册
- 一级菜单父路由 `component` 固定为 `() => import('@/views/index/index.vue')`
- 实际页面通过子路由 `path: ''` 渲染
- 隐藏路由 `meta.isHide: true`，配合 `activePath` 高亮父菜单
- 详细规则见 [`CLAUDE.md`](./CLAUDE.md) "路由和菜单结构规范" 章节

## 状态管理

Store 模块位于 `src/store/modules/`：

- `setting.ts` - UI 设置（主题 / 菜单 / 布局）
- `user.ts` - 用户认证 / 个人资料
- `menu.ts` - 菜单数据 / 激活状态
- `worktab.ts` - 多标签页导航
- `dict.ts` - 数据字典（全局共享）
- `employee.ts` / `org.ts` 等 - 业务数据缓存

通过 `pinia-plugin-persistedstate` 持久化关键状态到 localStorage。

## 国际化

- **页面内容统一使用中文**，不使用 `$t()` 国际化函数
- **菜单名称需要多语言** —— 路由 `meta.title` 用翻译键（如 `menus.org.title`），同步维护 `zh.json` / `en.json`

## 开发规范

完整开发规范见 [`CLAUDE.md`](./CLAUDE.md)，核心约定：

- **布局**：纯 Flex 布局，不写死高度，`.layout-content` 用 `height: 100%`
- **卡片**：无边框 `border: none !important`、无阴影、圆角 12px
- **表格**：用 `<el-table>` 而非自定义组件，无边框，至少 1-2 列用 `min-width` 撑开
- **按钮**：表格操作列用 `<el-button link>`，间距用 `margin-left: 12px`
- **Tab**：跨路由用 `<ModuleTabBar>`，页面内用 `<PageTabs>`
- **AI 图标**：统一用 `<ArtAiIcon />`（4 角 sparkle SVG），**禁止 emoji**
- **API**：用 `request.get/post/put/del`，不直接调 `request()`
- **Mock 数据**：固定数据，不要随机生成
- **图标**：用 `iconfont-sys` 类，`v-html` 渲染 HTML 实体

## 构建与部署

```bash
pnpm build  # 构建到 dist/ 目录
```

`dist/` 是纯静态资源，可部署到任意静态托管：

- **Nginx** —— 配置 `try_files $uri /index.html;` 支持 SPA 路由
- **Vercel** —— 直接部署，已支持 SPA 路由
- **GitHub Pages** —— 配置 base URL（`vite.config.ts` 中调整 `base`）

## 路径别名

```ts
'@'        → 'src/'
'@views'   → 'src/views'
'@imgs'    → 'src/assets/img'
'@icons'   → 'src/assets/icons'
'@utils'   → 'src/utils'
'@stores'  → 'src/store'
'@plugins' → 'src/plugins'
'@styles'  → 'src/assets/styles'
```

## 文档索引

| 文档 | 内容 |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | 项目完整开发规范（最详细）|
| [`docs/HR系统-AI能力说明.md`](./docs/HR系统-AI能力说明.md) | AI 能力产品说明 |
| [`docs/HR系统-AI能力实现指南.md`](./docs/HR系统-AI能力实现指南.md) | AI 能力工程实施指南 |
| [`docs/2026-04-07-企业HR系统-需求说明书-V1.0.md`](./docs/2026-04-07-企业HR系统-需求说明书-V1.0.md) | 完整需求说明书 |
| [`docs/2026-04-07-企业HR系统-设计方案-v1.0.md`](./docs/2026-04-07-企业HR系统-设计方案-v1.0.md) | 系统设计方案 |

## License

[MIT](./LICENSE) © 2026 ChEnJiAnWeI98
