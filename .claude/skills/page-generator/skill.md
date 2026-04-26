---
name: page-generator
description: >
  You MUST use this skill when users ask to create, generate, add pages, or implement features in existing projects. Triggers: (1) "创建页面" "生成页面" "添加页面" "新建页面", (2) "列表页" "详情页" "表单页" "编辑页", (3) "实现xx功能" "按照需求说明书实现xx功能" "按照需求说明书实现所有功能", (4) "开发xx功能" "做xx功能" "完成xx功能", (5) Users need to add pages to admin/website/mobile projects, (6) Need page templates with proper layout, routing, and styling. Automatically identifies project type (admin/website/mobile) and provides corresponding page templates, layout specifications, routing configuration, and style guidelines.
---

# 页面生成器规范

本 skill 提供标准化的页面开发规范和模版，根据项目类型自动识别并提供对应的页面生成方案。

## 使用流程

### 步骤 1: 自动识别项目类型

**技能会自动识别当前项目类型，这决定了使用哪套页面模版和规范。**

识别规则：

1. **检查项目依赖（package.json）**：
   - 包含 `element-plus` + 有侧边栏布局组件 → **管理后台项目**
   - 包含 `element-plus` + 无侧边栏布局 → **Web 前台项目**
   - 包含 `vant` → **移动端项目**

2. **检查项目结构**：
   - 有 `src/components/core/layouts/art-sidebar-menu/` → **管理后台项目**
   - 有 `src/layout/` 且包含 Header/Footer 组件 → **Web 前台项目**
   - 有 Tabbar 相关组件 → **移动端项目**

3. **检查路由配置**：
   - 路由文件在 `src/router/modules/` 且有菜单配置 → **管理后台项目**
   - 路由文件简单扁平结构 → **Web 前台项目**

4. **询问用户确认**：
   - 如果无法自动识别，询问用户项目类型

### 步骤 2: 根据项目类型加载对应规范

识别出项目类型后，自动加载对应的规范文档：

- **管理后台项目** → 使用 `references/admin/` 下的规范和模版
- **Web 前台项目** → 使用 `references/web/` 下的规范和模版
- **移动端项目** → 使用 `references/mobile/` 下的规范和模版

---

## 项目类型说明

### 1. 管理后台项目

**特征：**

- Vue3 + Element Plus + TypeScript
- 侧边栏菜单 + 顶部栏布局
- 表格、表单、树形结构等数据管理功能
- 权限控制、路由守卫

**适用场景：**

- 后台管理系统
- CMS 内容管理
- 数据管理平台
- 企业内部系统

**参考文档：**

- [管理后台通用规范](references/admin/general-specs.md)
- [路由配置指南](references/admin/routing-guide.md)
- [样式规范](references/admin/styling-guide.md)
- [标准列表页模版](references/admin/template-list-page.md)
- [树形表格页模版](references/admin/template-tree-page.md)
- [二级页面模版](references/admin/template-secondary-page.md)
- [左右分栏布局模版](references/admin/template-split-layout.md)

---

### 2. Web 前台项目

**特征：**

- Vue3 + Element Plus + TypeScript
- Header + Footer 布局
- 响应式设计，支持移动端
- 内容展示、产品介绍、新闻列表

**适用场景：**

- 企业官网
- 产品官网
- 门户网站
- 营销页面

**参考文档：**

- [Web 前台通用规范](references/web/general-specs.md)
- [路由配置指南](references/web/routing-guide.md)
- [样式规范](references/web/styling-guide.md)
- [首页模版](references/web/template-home-page.md)
- [列表页模版](references/web/template-list-page.md)
- [详情页模版](references/web/template-detail-page.md)
- [表单页模版](references/web/template-form-page.md)

---

### 3. 移动端项目

**特征：**

- Vue3 + Vant + TypeScript
- NavBar + Tabbar 布局
- 触摸优化、下拉刷新、上拉加载
- 移动端交互体验

**适用场景：**

- H5 应用
- 移动端网站
- 小程序（H5 版本）
- 移动端商城

**参考文档：**

- [移动端通用规范](references/mobile/general-specs.md)
- [路由配置指南](references/mobile/routing-guide.md)
- [样式规范](references/mobile/styling-guide.md)
- [Tabbar 页面模版](references/mobile/template-tabbar-page.md)
- [列表页模版](references/mobile/template-list-page.md)
- [详情页模版](references/mobile/template-detail-page.md)
- [表单页模版](references/mobile/template-form-page.md)

---

## 核心设计原则

### 卡片式布局规范

**所有页面必须使用卡片式布局**，这是项目的核心设计规范。

**卡片默认样式：**

- **无边框**：`border: none !important;`
- **无阴影**：`box-shadow: none !important;`
- **圆角**：`border-radius: 12px`
- **背景色**：`background: #fff`

**重要提示：** 只有在特殊说明的情况下才添加投影和边框，默认情况下卡片保持简洁的无边框无投影样式。

### 结合项目实际情况

生成页面时必须：

1. **参考项目现有页面** - 查看项目中已有的页面实现，保持风格一致
2. **遵循项目规范** - 严格遵循项目的 CLAUDE.md 或其他规范文档
3. **使用项目组件** - 优先使用项目中已有的公共组件
4. **保持代码风格** - 与项目现有代码保持一致的命名和结构
5. **适配项目布局** - 根据项目的实际布局框架调整页面结构

---

## 工作流程

当用户请求生成页面时，按照以下流程执行：

### 0. 检测 CRUD 工具（必须第一步）

检查 `src/utils/crud/index.ts` 是否存在：

- **存在** → 直接继续
- **不存在** → 说明是新项目或尚未建立工具目录，**立即创建以下三个文件**，不询问用户：
  - `src/utils/crud/mockHelper.ts`
  - `src/utils/crud/apiHelper.ts`
  - `src/utils/crud/index.ts`

**mockHelper.ts 内容：**

```typescript
export function createCrudMock<T extends { id: number }>(
  initialData: T[],
  options: { searchFields?: (keyof T)[] } = {}
) {
  let data = [...initialData]
  let nextId = Math.max(...initialData.map((d) => d.id), 0) + 1

  return {
    getList(params: Record<string, any>) {
      const { page = 1, pageSize = 20, ...filters } = params
      let filtered = [...data]
      for (const [key, val] of Object.entries(filters)) {
        if (val === undefined || val === null || val === '') continue
        filtered = filtered.filter((item) => {
          const itemVal = (item as any)[key]
          if (options.searchFields?.includes(key as keyof T)) {
            return String(itemVal).includes(String(val))
          }
          const numVal = typeof val === 'string' ? parseInt(val) : val
          return itemVal === numVal || itemVal === val
        })
      }
      const start = (Number(page) - 1) * Number(pageSize)
      return { list: filtered.slice(start, start + Number(pageSize)), total: filtered.length }
    },
    getDetail(id: number) {
      return data.find((d) => d.id === id) || null
    },
    add(item: Omit<T, 'id'>) {
      const newItem = { ...item, id: nextId++ } as T
      data.push(newItem)
      return newItem
    },
    update(item: Partial<T> & { id: number }) {
      const idx = data.findIndex((d) => d.id === item.id)
      if (idx === -1) throw new Error('数据不存在')
      data[idx] = { ...data[idx], ...item }
      return data[idx]
    },
    remove(id: number) {
      const idx = data.findIndex((d) => d.id === id)
      if (idx === -1) throw new Error('数据不存在')
      data.splice(idx, 1)
      return true
    }
  }
}
```

**apiHelper.ts 内容：**

```typescript
import request from '@/utils/http'

export function createCrudApi<T>(options: {
  baseUrl: string
  mockFns: ReturnType<typeof import('./mockHelper').createCrudMock>
}) {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
  const { baseUrl, mockFns } = options

  const mock = <R>(fn: () => R): Promise<{ code: number; message: string; data: R }> =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ code: 200, message: 'success', data: fn() }), 300)
    )

  return {
    getList: (params: Record<string, any>) =>
      USE_MOCK
        ? mock(() => mockFns.getList(params))
        : request.get({ url: `${baseUrl}/list`, params }),
    getDetail: (id: number) =>
      USE_MOCK ? mock(() => mockFns.getDetail(id)) : request.get({ url: `${baseUrl}/${id}` }),
    add: (data: Partial<T>) =>
      USE_MOCK
        ? mock(() => mockFns.add(data as any))
        : request.post({ url: `${baseUrl}/add`, data }),
    update: (data: Partial<T> & { id: number }) =>
      USE_MOCK ? mock(() => mockFns.update(data)) : request.put({ url: `${baseUrl}/update`, data }),
    remove: (id: number) =>
      USE_MOCK ? mock(() => mockFns.remove(id)) : request.del({ url: `${baseUrl}/${id}` })
  }
}
```

**index.ts 内容：**

```typescript
export { createCrudMock } from './mockHelper'
export { createCrudApi } from './apiHelper'
```

### 1. 识别项目类型 & 读取风格参考

**同时完成两件事：**

1. 识别项目类型（检查 package.json + 目录结构 + 路由配置）
2. **读取一个现有页面作为风格参考**，确保生成的页面与项目保持一致

```
管理后台 → 读 src/views/ 下任意一个已有列表页（如 permission/role/index.vue）
Web前台  → 读 src/views/ 下任意一个已有内容页
移动端   → 读 src/views/ 下任意一个已有列表页
```

> ⚠️ 每个 UI Agent 必须先读风格参考页，再生成新页面，不能凭空生成。

### 2. 可视化执行计划（必须输出）

**无论是 1 个功能还是 N 个功能，都必须先输出执行计划表，再开始执行。**

**单功能示例：**

```
📋 执行计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
功能：巡检路线管理
拆分 4 个 Agent 并行执行：

  Agent 1 [数据层]   → mock/inspectionRoute.ts + api/inspectionRoute.ts
  Agent 2 [列表页]   → views/inspection/route/index.vue
  Agent 3 [编辑页]   → views/inspection/route/create.vue
  Agent 4 [配置层]   → router/inspection.ts + zh.json + en.json

后处理（串行）：注册路由 → TS 诊断
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 开始并行执行...
```

**多功能示例：**

```
📋 执行计划（3 个功能全部并行）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
功能 A：巡检路线管理（4 Agent）
  A1 [数据层]  → mock/inspectionRoute.ts + api/inspectionRoute.ts
  A2 [列表页]  → views/inspection/route/index.vue
  A3 [编辑页]  → views/inspection/route/create.vue
  A4 [配置层]  → router + i18n

功能 B：任务管理（3 Agent）
  B1 [数据层]  → mock/task.ts + api/task.ts
  B2 [UI层]    → views/task/index.vue
  B3 [配置层]  → router + i18n

总计：7 个 Agent 同时并行
后处理（串行）：注册所有路由 → TS 诊断
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 开始并行执行...
```

### 3. 定义共享 Spec

为每个功能定义 Spec，内联在消息中（不写文件）：

```
【功能 A Spec】
实体接口: interface InspectionRoute { id: number; name: string; status: number; ... }
文件路径: mock/inspectionRoute.ts, api/inspectionRoute.ts, views/inspection/route/...
路由: /inspection/route, 名称: InspectionRoute
i18n: menus.inspection.route = "巡检路线管理"
风格参考: src/views/permission/role/index.vue（UI Agent 必须先读此文件）
```

### 4. 多功能 × 多 Agent 全量并行

**在同一条消息中，启动所有功能的所有 Agent（最大并行度）。**

**Agent 数量动态决定规则：**

| 可并行单元      | 拆分规则                                             |
| --------------- | ---------------------------------------------------- |
| 每个数据实体    | 1 个 Data Agent（mock + api）                        |
| 每个复杂页面    | 1 个 UI Agent（简单页面可合并）                      |
| 每个功能的路由  | 1 个 Config Agent（各自独立新建路由文件）            |
| 所有功能的 i18n | 合并到 1 个 i18n Agent（zh.json/en.json 不能并发写） |

**⚠️ i18n 冲突规则：多功能时，zh.json/en.json 必须由 1 个 Agent 串行处理，不能多个 Agent 同时写。**

### 5. Token 节省策略

| 内容             | 做法                                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| 项目布局规范     | 传文件路径让 Agent 自己读                                                   |
| TypeScript 接口  | 只传该 Agent 需要的接口                                                     |
| Mock 样本数据    | 只传字段名和示例值                                                          |
| zh.json 现有内容 | 只传 menus 节点                                                             |
| CRUD 工具用法    | 传一句话：`使用 createCrudMock/createCrudApi，参考 src/utils/crud/index.ts` |

### 6. 后处理（所有 Agent 完成后串行）

1. 更新 `src/router/modules/index.ts`，注册所有新路由（一次性完成）
2. 运行 TypeScript 诊断，确认无报错

### 7. 完成

只告知用户实现了什么功能，不列出文件清单。

---

## 通用注意事项

**所有项目类型：**

1. **开发完成后必须验证**：
   - 运行 `npm run build` 验证代码是否合规
   - 不要运行 `npm run dev`，由用户自行启动

2. **遵循项目规范**：
   - 严格遵循对应项目类型的布局规范
   - 使用项目已有的组件和样式
   - 保持代码风格一致

3. **组件使用**：
   - 管理后台：Element Plus 组件
   - Web 前台：Element Plus 组件 + 响应式布局
   - 移动端：Vant 组件

4. **代码质量**：
   - TypeScript 类型定义完整
   - 代码注释清晰
   - 变量命名规范

---

## 快速开始

### 示例 1: 生成管理后台列表页

```
用户：生成一个用户管理列表页

技能执行流程：
1. 识别项目类型 → 管理后台项目
2. 加载 references/admin/ 规范
3. 选择模版 → template-list-page.md
4. 生成代码：
   - src/views/user/index.vue
   - src/router/modules/user.ts
   - src/api/user.ts
   - src/mock/user.ts
   - src/types/user.ts
5. 验证构建 → npm run build
```

### 示例 2: 生成 Web 前台产品列表页

```
用户：生成一个产品列表页

技能执行流程：
1. 识别项目类型 → Web 前台项目
2. 加载 references/web/ 规范
3. 选择模版 → template-list-page.md
4. 生成代码：
   - src/views/products/index.vue
   - src/router/index.ts（添加路由）
   - src/api/products.ts
5. 验证构建 → npm run build
```

### 示例 3: 生成移动端商品列表页

```
用户：生成一个商品列表页

技能执行流程：
1. 识别项目类型 → 移动端项目
2. 加载 references/mobile/ 规范
3. 选择模版 → template-list-page.md
4. 生成代码：
   - src/views/goods/list.vue
   - src/router/index.ts（添加路由）
   - src/api/goods.ts
5. 验证构建 → npm run build
```

---

## 项目类型识别示例

### 当前项目识别

**检查依赖：**

```json
{
  "dependencies": {
    "vue": "^3.x",
    "element-plus": "^2.x",
    "pinia": "^2.x"
  }
}
```

**检查目录结构：**

```
src/
├── components/
│   └── core/
│       └── layouts/
│           └── art-sidebar-menu/  ← 有侧边栏菜单
├── router/
│   └── modules/                   ← 路由模块化
└── views/
```

**识别结果：** 管理后台项目

**加载规范：** `references/admin/`

---

## 总结

page-generator 技能通过自动识别项目类型，为不同端提供专门的页面生成方案：

- **管理后台** - 数据管理、表格、表单
- **Web 前台** - 内容展示、响应式布局
- **移动端** - 触摸优化、下拉刷新

每种项目类型都有独立的规范文档和页面模版，确保生成的代码符合对应端的开发规范。
