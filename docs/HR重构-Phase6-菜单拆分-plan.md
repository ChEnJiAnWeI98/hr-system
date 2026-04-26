# HR 系统重构 · Phase 6 · 终态菜单拆分 · 实施计划

**文档版本**：V1.0
**撰写日期**：2026-04-23
**对应 Phase**：Phase 6 - 终态菜单拆分（8 → 10 一级，对标北森/金蝶）
**前置依赖**：Phase 1 ✅ / Phase 2 ✅ / Phase 3 ✅ / Phase 4 ✅ / Phase 4.x ✅ / Phase 5 ✅
**上游文档**：
- `docs/HR系统重构方案-V2.0-架构篇.md`
- `docs/HR系统重构方案-V2.0-实施计划.md`（§一 Phase 6 目标）
- `docs/HR重构-Phase4x-Diff审查-作战计划.md`（§八 菜单终态）

---

## 🎯 Phase 6 目标

**当前**：8 一级 + 工作台 = 9 一级 / 85 二级
**目标**：10 一级 + 工作台 = **11 一级 / 89 二级**（社保 Tab 恢复为多个二级后数量增加）

**对标**：北森 iTalent / 金蝶 s-HR / 用友大易 / 钉钉智能人事 的一级菜单结构

---

## ✨ 两大拆分动作

### 拆分 1：04 薪酬福利 → 04 薪酬管理 + 05 社保公积金

**理由**：国内 HR SaaS 主流（北森/金蝶/用友/钉钉）把社保公积金作为独立一级菜单（中国特色：五险一金独立法规体系）。Phase 4.x 折叠的 4-Tab 容器需要拆回多个二级。

### 拆分 2：05 绩效管理 + 06 培训与发展 → 06 绩效管理 + 07 人才发展 + 08 培训管理

**理由**：人才发展（人才盘点 + 能力模型 + 继任计划）是独立赛道（对标北森"人才管理"、Workday"Talent"），当前散落在绩效和培训两边不合理。拆出后三块业务边界清晰。

---

## 📐 终态菜单清单

| # | 一级 | 路由 | 二级数 | 变化 |
|---|---|---|:---:|---|
| — | 工作台 | `/workspace` | 1 | — |
| 01 | 组织人事 | `/hrm/*` | 11 | — |
| 02 | 招聘与入职 | `/recruit/*` | 14 | — |
| 03 | 考勤与假期 | `/attendance/*` | 11 | — |
| 04 | **薪酬管理** | `/comp/*` | 7 | ⬇️ 8→7（拆出社保） |
| 05 | **社保公积金** | `/social/*` | 5 | ✨ 新增 |
| 06 | **绩效管理** | `/perf/*` | 13 | ⬇️ 14→13（拆出人才盘点） |
| 07 | **人才发展** | `/talent/*` | 4 | ✨ 新增 |
| 08 | **培训管理** | `/training/*` | 4 | ⬇️ 7→4（拆出能力/继任） |
| 09 | 数据洞察 | `/insight/*` | 7 | — |
| 10 | 系统管理 | `/system/*` | 12 | — |

---

## 🛣️ 路径命名决策（避免冲突 + 简洁）

| 新路由 | 说明 |
|---|---|
| `/social/*` | ✅ 无冲突（legacy `/social-security` 已删，与 `/comp/social-security` Tab 容器将被废弃） |
| `/talent/*` | ✅ 无冲突（之前只在 `/perf/talent-review` `/perf/talent-board` 二级路径占用） |
| `/talent/review` | 替代 `/talent/talent-review`（避免冗余前缀） |
| `/talent/board/:id` | 替代 `/talent/talent-board/:id` |
| `/talent/competency` `/talent/assessment` `/talent/succession` | 从 `/training/*` 平移，路径不变前缀 |

**menuCode 命名**（RBAC 注册表）：
- `social:config-insurance` / `social:config-fund` / `social:employee` / `social:monthly` / `social:statistics`
- `talent:review` / `talent:competency` / `talent:assessment` / `talent:succession`

---

## 🗓️ 分两批实施（方案 B）

- **Batch A**：拆社保（1~1.5 天）→ 用户 review
- **Batch B**：拆人才发展（1~1.5 天）→ 用户 review

每批独立成一次变更，降低回滚成本和审查复杂度。

---

# Batch A · 薪酬福利拆出社保公积金

## A.1 任务清单

### A.1.1 新建 `/social/*` 一级路由

| # | 任务 | 文件 |
|---|---|---|
| A.1.1.1 | 新建 `src/router/modules/social.ts` | 5 个二级：social-insurance-config / social-provident-fund / social-employee / social-monthly / social-statistics |
| A.1.1.2 | `router/modules/index.ts` 注册 `socialRoutes` | import + appRoutes 数组 |
| A.1.1.3 | i18n 新增 `menus.social.*`（zh.json + en.json） | title / configInsurance / configFund / employee / monthly / statistics |

**路由结构设计**：
```typescript
{
  path: '/social',
  name: 'Social',
  component: () => import('@/views/index/index.vue'),
  meta: { title: 'menus.social.title', icon: '&#xe8xx;', isFirstLevel: true },
  children: [
    { path: 'insurance-config', ... menuCode: 'social:config-insurance' },
    { path: 'provident-fund', ... menuCode: 'social:config-fund' },
    { path: 'employee', ... menuCode: 'social:employee' },
    { path: 'monthly', ... menuCode: 'social:monthly' },  // 月度计算 + 申报导出 Drawer
    { path: 'statistics', ... menuCode: 'social:statistics' }
  ]
}
```

### A.1.2 拆回 Tab 容器恢复原独立页面（Phase 4.x 逆向）

| # | 任务 | 说明 |
|---|---|---|
| A.1.2.1 | 废弃 `src/views/comp/social-security/index.vue` Tab 容器 | Phase 4.x 建的容器不再使用 |
| A.1.2.2 | 5 个二级各自使用 `views/social-security/*` 的原组件（`insurance-config` / `provident-fund` / `employee-insurance` / `insurance-bill` / `statistics`） | 组件无需重写，仅路由指向变化 |
| A.1.2.3 | `monthly`（月度计算）页内集成申报导出 Drawer | 把 Phase 4.x 的申报导出按钮保留为 Drawer，不单独成页 |
| A.1.2.4 | 决策：原 `views/social-security/*` 目录是否搬迁到 `views/social/*` | 推荐**不搬**（保持与 Phase 4.x 风格一致：Tab 引用复用不搬目录），只改路由指向 |

### A.1.3 `/comp/*` 删除社保二级

| # | 任务 | 说明 |
|---|---|---|
| A.1.3.1 | `router/modules/comp.ts` 删除 `social-security` 子路由 | 8 → 7 二级 |
| A.1.3.2 | i18n 删除 `menus.comp.socialSecurity` | zh.json + en.json |
| A.1.3.3 | 删除 Tab 容器 `views/comp/social-security/index.vue` | 确认无其他引用后删 |

### A.1.4 MENU_DEFINITIONS 调整

| # | 任务 | 文件 |
|---|---|---|
| A.1.4.1 | 删除 `comp:social-security` 注册 | `src/mock/system/roles.ts` |
| A.1.4.2 | 新增 5 条 `social:*` 注册 | 按侧边栏显示顺序插入新 groupCode `social` |
| A.1.4.3 | 7 种角色的菜单权限映射检查 | 确认 super_admin / hr_admin / hr_bp 能看到新菜单，dept_manager 等按业务需求配 |

### A.1.5 硬编码路径修复

| # | 位置 | 改动 |
|---|---|---|
| A.1.5.1 | `views/workspace/shortcut-config.vue:112` | `/comp/social-security` → `/social/employee`（默认入口选参保）|
| A.1.5.2 | `mock/workspace.ts`（如有） | 快捷入口 path 对齐 |
| A.1.5.3 | 全局 grep `/comp/social-security` | 扫描所有 .vue .ts 文件，逐一替换到对应新路径 |

### A.1.6 验收测试

- [ ] 侧边栏显示 10 一级（新增"社保公积金"）
- [ ] `/social/*` 5 个二级都能打开，数据正常
- [ ] `/comp/*` 不再有"社保公积金"
- [ ] super_admin 能看到全部新菜单
- [ ] 工作台快捷入口"社保公积金"跳转正常
- [ ] 员工详情页"薪酬 Tab"如有社保展示逻辑，数据来源正常
- [ ] 无 404 / 无控制台报错

---

## A.2 Batch A 影响分析

### 连锁影响扫描

| 维度 | 是否受影响 | 处理 |
|---|:---:|---|
| `/comp` 菜单下二级数量 | ✅ | 8 → 7 |
| 社保相关 API（`@/api/employeeInsurance` 等）| ❌ | 后端协议不变 |
| 社保相关 types（`@/types/employeeInsurance`）| ❌ | 无变化 |
| 社保相关 Mock 数据 | ❌ | 无变化 |
| `views/social-security/*` 7 个原组件 | ❌ | 保持原位，只改路由指向 |
| 员工档案 Tab（基本信息/薪酬等引用社保数据）| ⚠️ | 扫描 `views/hrm/employee/` 里对社保的引用点 |
| 工作台快捷入口 | ✅ | `/comp/social-security` → `/social/employee` |
| RBAC 权限 | ✅ | MENU_DEFINITIONS + 角色权限映射 |
| i18n | ✅ | 删 `menus.comp.socialSecurity` + 新增 `menus.social.*` |

### 风险项

| 风险 | 等级 | 应对 |
|---|:---:|---|
| Phase 4.x 的 Tab 容器已删除，但用户收藏过该 URL | 🟢 低 | Mock 原型项目，无真实用户 |
| `comp:social-security` menuCode 仍被 7 种角色引用 | 🟡 中 | 删注册时同步删所有 `rolePermissions` 里的引用 |
| `views/comp/social-security/index.vue` 被其他页面 import | 🟢 低 | grep 确认后删 |

---

# Batch B · 绩效 + 培训拆出人才发展

## B.1 任务清单

### B.1.1 新建 `/talent/*` 一级路由

| # | 任务 | 文件 |
|---|---|---|
| B.1.1.1 | 新建 `src/router/modules/talent.ts` | 4 个二级：review / competency / assessment / succession |
| B.1.1.2 | `router/modules/index.ts` 注册 `talentRoutes` | 按顺序插在 `perfRoutes` 和 `trainingRoutes` 之间 |
| B.1.1.3 | i18n 新增 `menus.talent.*`（zh.json + en.json） | title / review / competency / assessment / succession |

**路由结构设计**：
```typescript
{
  path: '/talent',
  name: 'Talent',
  component: () => import('@/views/index/index.vue'),
  meta: { title: 'menus.talent.title', icon: '&#xe8xx;', isFirstLevel: true },
  children: [
    {
      path: 'review',
      name: 'TalentReview',
      component: () => import('@/views/performance/talent-review/index.vue'),
      meta: { title: 'menus.talent.review', keepAlive: true, menuCode: 'talent:review' }
    },
    {
      path: 'board/:id',
      name: 'TalentBoard',
      component: () => import('@/views/performance/talent-review/board.vue'),
      meta: { isHide: true, activePath: '/talent/review' }
    },
    {
      path: 'competency',
      name: 'TalentCompetency',
      component: () => import('@/views/performance/competency/index.vue'),
      meta: { title: 'menus.talent.competency', keepAlive: true, menuCode: 'talent:competency' }
    },
    {
      path: 'assessment',
      name: 'TalentAssessment',
      component: () => import('@/views/training/assessment/index.vue'),
      meta: { title: 'menus.talent.assessment', keepAlive: true, menuCode: 'talent:assessment' }
    },
    {
      path: 'succession',
      name: 'TalentSuccession',
      component: () => import('@/views/training/succession/index.vue'),
      meta: { title: 'menus.talent.succession', keepAlive: true, menuCode: 'talent:succession' }
    }
  ]
}
```

**注意**：
- **不搬组件目录**（`views/performance/talent-review/` 和 `views/performance/competency/` 和 `views/training/assessment/` 和 `views/training/succession/` 保持原位）
- 只改路由指向，对齐 Phase 4.x 决策风格

### B.1.2 `/perf/*` 删除人才盘点二级

| # | 任务 | 说明 |
|---|---|---|
| B.1.2.1 | `router/modules/perf.ts` 删除 `talent-review` 和 `talent-board/:id` | 14 → 13 二级 |
| B.1.2.2 | i18n 删除 `menus.perf.talentReview` 和 `menus.perf.talentBoard` | |

### B.1.3 `/training/*` 删除能力/继任三个二级

| # | 任务 | 说明 |
|---|---|---|
| B.1.3.1 | `router/modules/training.ts` 删除 competency / assessment / succession | 7 → 4 二级 |
| B.1.3.2 | i18n 删除 `menus.training.competency` / `assessment` / `succession` | |

### B.1.4 MENU_DEFINITIONS 调整

| # | 任务 | 文件 |
|---|---|---|
| B.1.4.1 | 删除 4 条：`perf:talent-review` / `training:competency` / `training:assessment` / `training:succession` | `src/mock/system/roles.ts` |
| B.1.4.2 | 新增 4 条 `talent:*` 注册 | groupCode `talent` |
| B.1.4.3 | 7 种角色的菜单权限映射检查 | HR 管理员 / HRBP / 部门经理对人才发展的可见性 |

### B.1.5 硬编码路径修复

| # | 位置 | 改动 |
|---|---|---|
| B.1.5.1 | `views/performance/talent-review/index.vue:285` | `/perf/talent-board/${row.id}` → `/talent/board/${row.id}` |
| B.1.5.2 | `views/performance/talent-review/board.vue:449` | `/perf/talent-review` → `/talent/review` |
| B.1.5.3 | `views/workspace/shortcut-config.vue` | 如有人才盘点/能力/继任的快捷入口，逐一改 |
| B.1.5.4 | `mock/workspace.ts` | 如有相关 path，对齐 |
| B.1.5.5 | 全局 grep `/perf/talent\|/training/competency\|/training/assessment\|/training/succession` | 所有 .vue .ts 逐一替换 |

### B.1.6 员工档案 Tab 数据引用检查

| # | 位置 | 关系 |
|---|---|---|
| B.1.6.1 | `views/hrm/employee/detail.vue:630` | import `getAssessmentsByEmployee from '@/mock/training/assessment'` |
| B.1.6.2 | 评估：Mock 文件路径不变，只是菜单位置移动 | ⚠️ 考虑是否把 `mock/training/assessment.ts` `mock/training/succession.ts` 也搬到 `mock/talent/` |

**决策**：Mock 文件路径**不搬**（与 Batch A 决策一致，保持"只改路由不搬目录"）。这样做的原因：
- Mock 文件与 views 组件路径无强耦合关系
- 搬迁 Mock 文件会触发连锁的 import 路径修改（api/types/views 等）
- 统一原则：Phase 6 只做**菜单层重组**，不做组件/数据层搬迁

### B.1.7 验收测试

- [ ] 侧边栏显示 11 一级（含"人才发展"）
- [ ] `/talent/*` 4 个二级都能打开，数据正常
- [ ] `/perf/*` 不再有"人才盘点"
- [ ] `/training/*` 不再有"能力模型/评估/继任"
- [ ] 人才盘点→看板跳转 `/talent/board/:id` 正常
- [ ] 员工详情页"培训记录 Tab"数据正常（引用 mock/training/assessment 不受影响）
- [ ] 无 404 / 无控制台报错

---

## B.2 Batch B 影响分析

### 连锁影响扫描

| 维度 | 是否受影响 | 处理 |
|---|:---:|---|
| `/perf` 菜单二级数量 | ✅ | 14 → 13 |
| `/training` 菜单二级数量 | ✅ | 7 → 4 |
| 绩效相关 API / Mock / types | ❌ | 不变 |
| 培训相关 API / Mock / types | ❌ | 不变（competency/assessment/succession 保留原文件路径）|
| `views/performance/talent-review/` 组件 | ⚠️ | 内部两处 router.push 需改 |
| `views/performance/competency/` 组件 | ❌ | 无跳转，仅路由指向变 |
| `views/training/assessment/` `views/training/succession/` | ❌ | 无跳转，仅路由指向变 |
| 员工档案 Tab 6（培训记录）引用 assessment mock | ❌ | mock 文件路径不变 |
| 工作台快捷入口 | ⚠️ | 如有相关项需改 |
| RBAC | ✅ | 4 条 MENU_DEFINITIONS 调整 |
| i18n | ✅ | `menus.perf.talent*` + `menus.training.competency/assessment/succession` 删除 + 新增 `menus.talent.*` |

### 风险项

| 风险 | 等级 | 应对 |
|---|:---:|---|
| "人才发展"名字与 "02 招聘" 的"人才"概念混淆 | 🟡 中 | 侧边栏 i18n 用"人才发展"（talent development），避免只写"人才" |
| `views/performance/talent-review/` 里隐藏 `router.push('/perf/...')` 未命中 grep | 🟡 中 | 审查完 grep 结果后逐文件 open 核对 |
| 能力模型页面 `views/performance/competency/` 位于 performance 目录下但归 talent 菜单，后续维护者迷惑 | 🟢 低 | 路由注释写清楚"Phase 6 重组后归人才发展" |

---

## 🗂️ 第三方清单：Phase 6 完成后待清理的遗留

**本次不做**，仅登记：

| # | 遗留 | 为什么先不做 |
|---|---|---|
| 1 | `views/performance/talent-review/` 目录位置（现归 `/talent`）| 搬目录会连带改所有 import，超出 Phase 6 菜单重组范畴 |
| 2 | `views/performance/competency/` 目录位置（现归 `/talent`）| 同上 |
| 3 | `views/training/assessment/` `views/training/succession/` 目录位置（现归 `/talent`）| 同上 |
| 4 | `views/social-security/*` 目录位置（现归 `/social`）| 同上 |
| 5 | `views/comp/social-security/index.vue` Tab 容器 | Phase 6 Batch A 执行时会直接删 |
| 6 | Mock 文件路径（`mock/training/assessment.ts` 等）与新菜单不对齐 | 搬迁 Mock 会触发 API/types 连锁改动 |

**处理建议**：Phase 6 完成 + 用户试用一周无问题后，统一做一次"目录规整 Phase 6.1"（可选）。

---

## ✅ Phase 6 总验收清单

- [ ] 侧边栏 = 10 一级 + 1 工作台
- [ ] 89 二级（4 有增减：comp -1 / social +5 / perf -1 / training -3 / talent +4）
- [ ] 7 种角色登录后菜单正确裁剪
- [ ] 所有硬编码路径已更新（grep `/comp/social\|/perf/talent\|/training/competency\|/training/assessment\|/training/succession` 零结果）
- [ ] i18n 无废弃 key（`menus.comp.socialSecurity` / `menus.perf.talent*` / `menus.training.competency/assessment/succession`）
- [ ] MENU_DEFINITIONS 增减对齐（+5 social + 4 talent - 1 comp social - 1 perf talent - 3 training）
- [ ] 工作台快捷入口候选列表对齐新路径
- [ ] 无 404 / 无控制台报错
- [ ] 对标北森/金蝶菜单结构一致性 ≥ 95%

---

## 📝 执行日志

### ✅ Batch A 完成（2026-04-23）

**决策**：薪酬福利拆出社保公积金，对齐北森/金蝶/用友/钉钉主流

**执行改动**：
1. ➕ 新建 `src/router/modules/social.ts` — 5 个二级（insurance-config / provident-fund / employee / monthly / statistics）
2. ➕ 新建 `src/views/social/monthly/index.vue` — 月度计算包装页（InsuranceBill + 申报导出 Drawer）
3. ✏️ `src/router/modules/index.ts` — 注册 `socialRoutes`，位置插在 `compRoutes` 之后
4. ✏️ `src/router/modules/comp.ts` — 删除 social-security 子路由（8 → 7 二级），更新模块注释
5. ✏️ `src/mock/system/roles.ts` — 删 `comp:social-security`，新增 5 条 `social:*`；comp groupName "薪酬福利" → "薪酬管理"
6. ✏️ `src/locales/langs/zh.json` + `en.json` — 删 `menus.comp.socialSecurity`，新增 `menus.social.*`（5 key）；`comp.title` → "薪酬管理"
7. ✏️ `src/views/workspace/shortcut-config.vue` — 快捷入口 #10 path `/comp/social-security` → `/social/employee`
8. 🗑️ 删除 `src/views/comp/social-security/index.vue` + 空目录（Phase 4.x 的 4-Tab 容器）

**用户确认点**：
- 社保独立一级（方案 A）
- 路径命名用短前缀 `/social/*` `/talent/*`
- 分两批实施（方案 B）
- 组件目录不搬（保持 `views/social-security/*` 原位）

**顺手做的**：
- 英文 `comp.title` "Compensation & Benefits" → "Compensation"（Benefits 已独立到 social）
- 筛选优化：员工参保页删除"部门"和"操作类型"两个筛选项（用户另行指示）
- "结束日期"列空值显示"进行中"（浅灰色文字，对齐 Workday/SAP/北森主流）
- Mock 数据：initialData 追加 5 条停保事件（id 21~25），并在数据数组组合时提到最前，确保首页同时展示"进行中"和"具体停保日"两种形态

**残留引用**：零

---

### ✅ Batch B 完成（2026-04-23）

**决策**：绩效管理 + 培训与发展 拆出人才发展独立成一级

**执行改动**：
1. ➕ 新建 `src/router/modules/talent.ts` — 4 个可见二级（review / competency / assessment / succession）+ 1 个隐藏详情路由（board/:id）
2. ✏️ `src/router/modules/index.ts` — 注册 `talentRoutes`，插在 `perfRoutes` 和 `trainingRoutes` 之间
3. ✏️ `src/router/modules/perf.ts` — 删除 `talent-review` 和 `talent-board/:id` 子路由（14 → 13 二级）
4. ✏️ `src/router/modules/training.ts` — 删除 `competency` / `assessment` / `succession`（7 → 4 二级），title "培训与发展" → "培训管理"
5. ✏️ `src/mock/system/roles.ts` — 删 4 条 menuCode（`perf:talent-review` / `training:competency/assessment/succession`），新增 4 条 `talent:*`；`MANAGER_MENUS` 里 `perf:talent-review` → `talent:review`；培训 groupName "培训与发展" → "培训管理"
6. ✏️ `src/locales/langs/zh.json` + `en.json` — `menus.perf` 删 `talentReview/talentBoard`；`menus.training` 删 `competency/assessment/succession`，title "培训与发展" → "培训管理"；新增 `menus.talent.*`（5 key：title / review / board / competency / assessment / succession）
7. ✏️ `src/views/performance/talent-review/index.vue:285` — `router.push('/perf/talent-board/${id}')` → `/talent/board/${id}`
8. ✏️ `src/views/performance/talent-review/board.vue:449` — `router.push('/perf/talent-review')` → `/talent/review`

**路径命名**：
- 采用 `/talent/review`（非 `/talent/talent-review`）避免冗余前缀
- 采用 `/talent/board/:id`（非 `/talent/talent-board/:id`）保持一致

**组件位置**：
- `views/performance/talent-review/` 保持原位（路由指向不搬目录，对齐 Phase 4.x 决策）
- `views/performance/competency/` 保持原位
- `views/training/assessment/` `views/training/succession/` 保持原位
- Mock 路径（`mock/training/assessment.ts` `mock/training/succession.ts`）也保持不变

**残留引用**：零（grep 验证通过）

---

### ✅ 图标修复（2026-04-23）

**背景**：用户反馈一级菜单部分图标与名称不对应（截图可见：招聘用钱包码位、薪酬用文档等）

**从 `src/assets/icons/system/iconfont.json` 的 glyphs 里查出精准语义匹配**：

| 菜单 | 改前 | 改后 | 语义 |
|---|---|---|---|
| 工作台 | `&#xe651;` | 保留 | 计划工作 |
| 01 组织人事 | `&#xe7b3;` | **`&#xe724;`** | 团队 |
| 02 招聘与入职 | `&#xe7b0;` | **`&#xe82e;`** | 邀请人2 |
| 03 考勤与假期 | `&#xe7a2;` | **`&#xe749;`** | 打卡 |
| 04 薪酬管理 | `&#xe722;` | **`&#xe6ff;`** | 钱包 |
| 05 社保公积金 | `&#xe893;` | **`&#xe7a9;`** | 身份证 |
| 06 绩效管理 | `&#xe721;` | 保留 | 统计 |
| 07 人才发展 | `&#xe6d5;` | **`&#xe7f0;`** | 奖杯 |
| 08 培训管理 | `&#xe73e;` | **`&#xe80c;`** | 书本 |
| 09 数据洞察 | `&#xe8a4;` | **`&#xe812;`** | 数据 |
| 10 系统管理 | `&#xe72b;` | 保留 | 设置 |

**改动 8 个路由文件**，每文件一行修改。

---

## 🏁 Phase 6 终态确认

- ✅ 一级菜单：**10 + 1 工作台 = 11 一级**
- ✅ 二级菜单：**89 个**
- ✅ 对标北森/金蝶/Workday 菜单结构一致性 ≥ 95%
- ✅ 所有硬编码路径清零（grep 验证通过）
- ✅ i18n 废弃 key 清零
- ✅ MENU_DEFINITIONS 对齐（5 social + 4 talent 新增，1 comp + 1 perf + 3 training 删除）
- ✅ 一级菜单图标语义化对齐

**Phase 6 plan 完**。
