# Phase 4.x Diff 审查 · 作战计划

> **目标**：让 V2.0 重构后的系统达到「**无重复 / 无缺失 / 无数据矛盾 / 菜单终态确定**」的生产就绪状态。
> **预计工作量**：2~3 个工作日
> **开始日期**：2026-04-22

---

## 一、任务拆解（3 大 Wave + 4 个横切任务）

### Wave 1 — 新旧重叠对审查（15 对）

每对按标准流程：**现有页面清单 → 差异识别 → 决策（合并 / 废弃 / 保留）→ 执行**。

| # | 新菜单模块 | legacy 路由 | 重叠业务 | 风险等级 |
|---|---|---|---|---|
| 1 | `/hrm` | `/organization-management` | 组织架构 / 岗位体系 / 部门 | 🔴 高 |
| 2 | `/hrm` | `/employee` | 员工档案、新增编辑 | 🔴 高 |
| 3 | `/hrm` | `/contract` | 合同管理 | 🟡 中 |
| 4 | `/comp` | `/salary` | 薪酬体系/核算/工资条/个税/调薪 | 🔴 高 |
| 5 | `/comp` | `/social-security` | 社保/公积金 | 🟡 中 |
| 6 | `/attendance` | `/leave` | 假期管理 | 🟡 中 |
| 7 | `/recruit` | `/recruitment` | 招聘需求/职位/简历/面试/Offer | 🔴 高 |
| 8 | `/recruit` | `/recruitment-ops` | 招聘分析/漏斗 | 🟡 中 |
| 9 | `/recruit` | `/recruitment-settings` | 招聘配置 | 🟢 低 |
| 10 | `/perf` | `/performance` | 绩效周期/目标/评估/档案 | 🔴 高 |
| 11 | `/perf` | `/performance-feedback` | 360/校准/申诉 | 🟡 中 |
| 12 | `/perf` | `/performance-settings` | 绩效配置 | 🟢 低 |
| 13 | `/insight` | `/data-report` | 数据报表 | 🟡 中 |
| 14 | `/insight` | `/performance-analytics` | 绩效分析 | 🟡 中 |
| 15 | `/system` | `/approval-engine` | 审批引擎 | 🟢 低 |

---

### Wave 2 — 数据一致性批量修复

**来源**：Phase 4.13 发现的跨模块矛盾（已在 `Phase4 plan` 4.x 附章节登记）。

| # | 矛盾 | 模块 | 涉及页面 | 策略 |
|---|---|---|---|---|
| A | 已离职员工有 2026 绩效档案 | `performanceArchive` | `/perf/archive` + Tab 5 | filter 排除 terminated |
| B | 已离职员工出现在 2026 培训计划 | `training/plan` | `/training/plan` + Tab 6 | pickByFamily 加 filter |
| C | 已离职员工还有 2026 工资条 | `comp/payroll` | `/comp/payslip` + Tab 4 | generateBatchRecords 过滤 |
| D | 已离职员工还在福利/保险 | `comp/welfare` `employeeInsurance` | `/comp/welfare` | filter 过滤 |
| E | 已离职员工有 2026 考勤/加班/请假 | `attendanceRecord` `overtime` `leaveApplication` `fieldWork` `makeupClockIn` | `/attendance/*` | mock 生成时过滤 |
| F | 已离职员工在能力评估/证书/继任 | `training/assessment` `certificate` `succession` | `/training/*` | filter 过滤 |
| G | 已离职员工被挂 PIP / 360 / 校准 / 1-on-1 / 目标 | 5 个 mock | `/perf/*` | filter 过滤 |
| H | 已离职员工合同显示"履约中" | `contract` | `/hrm/contract` | status 联动 |
| I | 工具层改进 | `alignEmployeeFields` | 全局 | 加 `excludeIds` 参数 |

---

### Wave 3 — 遗留页面补完

| # | 位置 | 问题 | 策略 |
|---|---|---|---|
| J | `views/position/create.vue` | 编辑页显示"前端开发工程师"硬编码，保存无效 | 判废/合并到 hrm |
| K | `views/auth/register/index.vue` | TODO: 未接 API | 无菜单入口，保留占位 |
| L | 各招聘页的第三方对接占位 | 电子签/腾讯会议/Boss 直聘 | 保留，标注"Mock 原型" |

---

### 横切任务

| # | 任务 | 说明 |
|---|---|---|
| α | 搜索代码里硬编码的 legacy 路径 | `grep '/salary/\|/employee/\|/organization-management/'` 找到后改为新路径 |
| β | legacy 路由删除清单 | Wave 1 每对决策完后归档 |
| γ | 菜单最终定稿 | 8 个业务一级 + 工作台 = 9 个一级，并确认每个一级下的二级数量 |
| δ | i18n 清理 | 删除 `menus.salary.*` `menus.employee.*` 等已废弃 key |

---

## 二、执行流程（单个重叠对标准动作）

```
Step 1: 列出新菜单和 legacy 的页面清单
   ├─ 新：从 src/router/modules/{new}.ts 读路由
   └─ 旧：从 src/router/modules/{legacy}.ts 读路由

Step 2: 逐页面 diff
   ├─ 2.1 打开两边对应页面，截取功能点
   ├─ 2.2 标注「新页面 vs 旧页面」差异
   └─ 2.3 识别旧页面独有的合理业务点

Step 3: 决策并提问用户（不确定时）
   ├─ A. 合并：旧独有点补到新页面
   ├─ B. 废弃：旧完全覆盖在新页面
   └─ C. 保留：新旧都保留（罕见场景）

Step 4: 执行
   ├─ 新页面补齐（如需）
   ├─ 删除旧 view / mock / api / legacy 路由注册
   ├─ 全局搜索引用，统一替换
   └─ i18n key 清理

Step 5: 更新本文档，记录决策和清理成果
```

---

## 三、与用户的对齐机制

### 以下情况**必须先问用户**
1. **删除旧代码**：每次要 `rm -rf` 旧 view 目录前
2. **决策合并策略**：新旧页面都有但实现不同时（选哪个作为基线）
3. **功能缺口补完**：发现业务需求但新旧都没有（要不要现在补）
4. **菜单调整**：新增/删除一级或二级菜单
5. **大范围替换**：批量改代码里的跳转链接

### 以下可以**自主决定**
1. 已确认只是 legacy 占位、新菜单已覆盖 → 直接删
2. 代码里的跳转链接替换（新路径已存在）
3. i18n key 清理
4. 本文档的阶段性更新

---

## 四、节奏建议

| 天 | Wave | 目标 |
|---|---|---|
| 第 1 天 | Wave 1 高风险 3 对 + Wave 2 前 3 类 | hrm 3 对 + 数据 A/B/C |
| 第 2 天 | Wave 1 中风险 6 对 + Wave 2 中期 3 类 | comp + recruit + 数据 D/E/F |
| 第 3 天 | Wave 1 低风险 6 对 + Wave 3 + 横切任务 | 剩余 perf/insight/system + 菜单定稿 |

---

## 五、风险提示

| 风险 | 影响 | 应对 |
|---|---|---|
| legacy 代码里藏有未被识别的跳转 | 删除后部分操作崩溃 | 全局 grep + 删前跑通主流程 |
| 新页面缺少 legacy 的关键字段 | Demo 时被发现数据丢失 | 逐字段 diff 时保留注释 |
| 数据一致性修复影响员工池姓名分布 | 再次出现"何晓兰消失" | 本次先审查，若要改必须先解耦 rand（已做） |
| 工作量超预期 | 拖到 Phase 5 | 每个 Wave 结束必须 review 进度 |

---

## 六、本次审查的产出（结束态）

- [ ] 15 对重叠决策全部完成并记录
- [ ] 9 类数据矛盾全部修复
- [ ] `views/position/create.vue` 决策完成（废或补）
- [ ] legacy 路由完全删除（15 个一级路由从 index.ts 移除）
- [ ] 全局无硬编码 legacy 路径
- [ ] i18n 无废弃 key
- [ ] 侧边栏最终菜单文档化（记录到本文档末尾）
- [ ] Phase 4 plan 文档更新"已处理"标记

---

## 七、执行日志（每对审查完立即追加）

> 记录格式：决策 / 执行内容 / 删除的文件 / 新旧功能差异表 / 用户确认点

### Wave 1 执行日志

#### ✅ 第 1 对：`recruit/settings-config` vs `/recruitment-settings` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy，保留 V2.0 新路径
- **理由**：两个路由指向完全同一个组件，无业务差异，新路径已 100% 覆盖
- **执行改动**：
  1. ✏️ `views/recruitment/config/index.vue` — settingsGroupTabs 路径从 `/recruitment-settings` → `/recruit/settings-config`
  2. ✏️ `views/recruitment/integrations/index.vue` — 同上
  3. ✏️ `router/modules/index.ts` — 移除 `recruitmentSettingsRoutes` 的 import 和 legacyRoutes 注册
  4. 🗑️ 删除 `router/modules/recruitment-settings.ts`
  5. ✏️ 清理 `zh.json` + `en.json` 的 `menus.recruitmentSettings.*` 三个 key
- **用户确认点**：采用方案 A 彻底删除（不保留重定向）
- **残留引用**：代码注释里 2 处"合并自 recruitment-settings"保留（文档历史价值）

#### ✅ 第 2 对：`insight/performance` + `perf/talent-review` vs `/performance-analytics` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 3 个子路由（dashboard / talent-review / talent-board）在 V2.0 里分别对应 `/insight/performance` + `/perf/talent-review` + `/perf/talent-board/:id`，组件一致，无独有功能
- **执行改动**：
  1. ✏️ `views/performance/talent-review/index.vue:258` — push 路径从 `/performance-analytics/talent-board/${row.id}` → `/perf/talent-board/${row.id}`
  2. ✏️ `views/performance/talent-review/board.vue:449` — push 路径从 `/performance-analytics/talent-review` → `/perf/talent-review`
  3. ✏️ `router/modules/index.ts` — 移除 `performanceAnalyticsRoutes` 的 import 和 legacyRoutes 注册
  4. 🗑️ 删除 `router/modules/performance-analytics.ts`
  5. ✏️ 清理 `zh.json` + `en.json` 的 `menus.performanceAnalytics.*` 全部 4 个 key
- **用户确认点**：已确认方案 A 彻底删除
- **残留引用**：代码注释 1 处"analytics → /performance-analytics"保留（文档历史价值）

#### ✅ 第 3 对：`insight/*` vs `/data-report` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 5 个子路由（dashboard/personnel/salary/recruitment/attendance）全部在 V2.0 `/insight/*` 下有同组件的对应路由。无代码硬编码 legacy 路径，无独有功能
- **附带修复（审查中发现的菜单 bug）**：
  - 🐛 `router/modules/insight.ts` — `insight/attendance` 的 menuCode 从错写的 `'insight:dashboard'` 修正为 `'insight:attendance'`
  - 🐛 `mock/system/roles.ts` — `MENU_DEFINITIONS` 新增 `insight:attendance` 注册。原本考勤分析菜单是"蹭"HR 驾驶舱权限显示的，super_admin 视角无感知但 RBAC 模型被破坏
- **执行改动**：
  1. ✏️ `router/modules/index.ts` — 移除 `dataReportRoutes` 的 import 和 legacyRoutes 注册
  2. 🗑️ 删除 `router/modules/data-report.ts`
  3. ✏️ 清理 `zh.json` + `en.json` 的 `menus.dataReport.*` 全部 6 个 key
- **用户确认点**：先修菜单 bug → 再清理 legacy（分段确认）
- **残留引用**：业务代码 4 处（mock/api 文件名 + 后端 API URL），非前端路由，保留

#### ✅ 第 4 对：`perf/* + training/competency + insight/ai-assistant` vs `/performance-settings` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 4 个子路由（template / apply-rules / competency / ai-assistant）全部在 V2.0 不同新菜单里有同组件对应。V2.0 按业务域拆到 3 个一级：模板/规则→绩效、能力模型→培训、AI→洞察。无代码硬编码 legacy 路径
- **执行改动**：
  1. ✏️ `router/modules/index.ts` — 移除 `performanceSettingsRoutes` 的 import 和 legacyRoutes 注册
  2. 🗑️ 删除 `router/modules/performance-settings.ts`
  3. ✏️ 清理 `zh.json` + `en.json` 的 `menus.performanceSettings.*` 全部 5 个 key
- **用户确认点**：已确认
- **残留引用**：代码注释 1 处（文档历史价值）

#### ✅ 第 5 对：`system/approval-*` vs `/approval-engine` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy + 删除垃圾门户页 + 修复 6 处代码硬编码跳转
- **理由**：legacy 下 7 个子路由全部在 V2.0 `/system/approval-*` 下有同组件对应
- **审查时额外发现**：
  - 🗑️ `views/approval-engine/index.vue` 是个**死页面**：没有任何路由指向它，且页面内部 5 个导航链接全指向不存在的路径（`template/list`、`instance/list` 等），纯残留代码
  - ⚠️ `views/workspace/index.vue:591` 工作台"查看全部审批"潜在 bug：跳转 legacy 路径体验不佳，本次顺手修复
- **执行改动**：
  1. ✏️ `views/workspace/index.vue:591` — `/approval-engine/todo` → `/system/approval-todo`
  2. ✏️ `views/approval-engine/template/index.vue:368` — `/approval-engine/template/designer/${id}` → `/system/approval-template/designer/${id}`
  3. ✏️ `views/approval-engine/template/designer.vue:56` — `/approval-engine/template` → `/system/approval-template`
  4. ✏️ `views/approval-engine/todo/index.vue:360` — `/approval-engine/instance/detail/${id}` → `/system/approval-instance/detail/${id}`
  5. ✏️ `views/approval-engine/instance/index.vue:172` — 同上
  6. ✏️ `views/approval-engine/instance/detail.vue:224` — `/approval-engine/instance/list` → `/system/approval-instance`
  7. 🗑️ 删除 `views/approval-engine/index.vue`（死页面）
  8. ✏️ `router/modules/index.ts` — 移除 `approvalEngineRoutes` 的 import 和 legacyRoutes 注册
  9. 🗑️ 删除 `router/modules/approval-engine.ts`
  10. ✏️ 清理 `zh.json` + `en.json` 的 `menus.approvalEngine.*` 全部 8 个 key
- **用户确认点**：已确认
- **残留引用**：零

#### ✅ 第 6 对：`perf/feedback-*` vs `/performance-feedback` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 5 个子路由（one-on-one / pip / tasks / appeal / badges）全部在 V2.0 `/perf/*` 下有同组件对应，无代码硬编码
- **执行改动**：
  1. ✏️ `router/modules/index.ts` — 移除 `performanceFeedbackRoutes` 的 import 和 legacyRoutes 注册
  2. 🗑️ 删除 `router/modules/performance-feedback.ts`
  3. ✏️ 清理 `zh.json` + `en.json` 的 `menus.performanceFeedback.*` 全部 6 个 key
- **用户确认点**：已确认
- **残留引用**：代码注释 1 处（文档历史价值）

#### ✅ 第 7 对：`recruit/ops-*` vs `/recruitment-ops` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 3 个子路由（background-check / automation / budget）全部在 V2.0 `/recruit/ops-*` 下有同组件对应，无代码硬编码
- **执行改动**：
  1. ✏️ `router/modules/index.ts` — 移除 `recruitmentOpsRoutes` 的 import 和 legacyRoutes 注册
  2. 🗑️ 删除 `router/modules/recruitment-ops.ts`
  3. ✏️ 清理 `zh.json` + `en.json` 的 `menus.recruitmentOps.*` 全部 4 个 key
- **附带修复（审查中发现的 UI bug）**：
  - 🐛 `views/performance/one-on-one/index.vue` 1on1 管理表格：只保留 Leader 列 min-width=160，计划时间改回固定 width=170，时长列对齐从 right 改为 center
  - 🐛 `views/performance/appeal/index.vue` 绩效申诉表格：部门 width=140→min-width=160，所属周期 width=160→min-width=200
- **用户确认点**：已确认
- **残留引用**：代码注释 1 处（文档历史价值）

#### ⚠️ 第 8 对补丁（发现 6 处漏网）

用户验收时发现合同续签/变更/签订/终止返回 404。根因：审查时 grep 结果里虽然包含这些文件的 `router.push('/contract/list')`，但**采样不彻底**，只处理了 create/approve/detail 就收工。

**补丁修复（6 处）**：
- ✏️ `views/contract/list/sign.vue:241` 返回
- ✏️ `views/contract/list/renew.vue:265` 返回
- ✏️ `views/contract/list/change.vue:235` 返回
- ✏️ `views/contract/list/terminate.vue:207` 返回
- ✏️ `views/contract/template/detail.vue:108` 返回
- ✏️ `views/contract/template/create.vue:156` 返回

**同时系统性重扫所有已删 legacy 的残留跳转**：前 7 对（`/performance-analytics`、`/performance-feedback`、`/performance-settings`、`/data-report`、`/recruitment-settings`、`/recruitment-ops`、`/approval-engine`）均零残留。仅合同这一对有 6 处漏网，已全部修复。

**反思**：批量跳转场景（多页面共享"返回列表"模式）必须按"同类全扫"而非"采样审查"。下一对类似模式必须过一遍所有同类文件。

#### ⚠️ 第 8 对补丁 2（发现合同模板是弹窗模式，搬迁了死代码）

用户指出合同模板页面的新增/编辑是**弹窗**（非页面跳转）。验证后确认：
- `views/contract/template/index.vue` 的 handleAdd/handleEdit 是 `dialogVisible = true`
- **仅 handleViewVersions 是独立页面跳转**
- 前一步搬迁时机械保留了 legacy 的 `create/new`、`edit/:id`、`detail/:id` 子路由到 hrm.ts，但列表页从不跳转过去 → 这些是死路由 + 死视图

**清理（4 项）**：
- 🗑️ `router/modules/hrm.ts:205-237` 删除 3 条死路由（contract-template/create/new、edit/:id、detail/:id）
- 🗑️ 删除 `views/contract/template/create.vue`
- 🗑️ 删除 `views/contract/template/detail.vue`
- ✏️ 清理 i18n `menus.hrm.contractTemplateCreate/Edit/Detail` 3 个 key

**反思**：搬迁路由时不能机械复制 legacy 结构，必须**先核实 legacy 路由是否真的被列表页点击**（page 模式 vs dialog 模式差异巨大）。后续高风险对（employee/salary/recruitment/performance）必定有混合模式页面，需重点关注这个陷阱。

**陷阱 2（第 11 对发现）：共享 form 组件按 `route.name` 分发场景时，改路由 name 必须同步改 form 内部判断**。
- 场景：一个 `form.vue` 对应 N 个路由（create/edit/evaluate/extend/detail），通过 `route.name` 决定当前模式
- 风险：搬迁时如果为对齐新命名规范改了路由 name，form 内部旧 name 判断全部 fallthrough，页面空白但无报错
- 应对：搬迁前 grep `route.name ===` 定位所有分发逻辑，搬迁时 form 内部的 name 判断必须一起改
- 同类组件检查清单（后续对必查）：contract 已过（未改 name 故无此问题），salary / recruitment / performance 的 form.vue 都要注意

#### ✅ 第 14 对：`recruit/*` vs `/recruitment` (legacy)

- **审查日期**：2026-04-23
- **决策**：废弃 legacy（路径别名型，非双实现）
- **类型**：高风险对第 5 个（实际为低复杂度，因组件完全共享）

**diff 结论**：Legacy `/recruitment/*` 和 V2.0 `/recruit/*` 使用**完全同一组件**（`views/recruitment/*`），类似第 1/3/4 对的路径别名情况。legacy 没有独有功能。

**执行改动（11 处）**：
1. ✏️ `views/recruitment/ai-matching/index.vue:508-509` — Tab 切换 path 更新
2. ✏️ `views/recruitment/resume/index.vue:438-439` — 同上
3. ✏️ `views/recruitment/demand/index.vue:402-403` — 同上
4. ✏️ `views/recruitment/demand-pool/index.vue:175-176, 285, 293` — Tab 切换 + job 跳转（3 处）
5. ✏️ `mock/workspace.ts:25` 招聘需求快捷入口 path
6. ✏️ `views/workspace/shortcut-config.vue:110` "招聘管理" → "招聘与入职"（修复坏链接 `/recruitment/position`）
7. ✏️ `views/workspace/index.vue:463` 快捷入口 path
8. 🗑️ 删除 `router/modules/recruitment.ts`
9. ✏️ `router/modules/index.ts` 移除 `recruitmentRoutes` import 和 legacyRoutes 注册
10. ✏️ 清理 `zh.json` + `en.json` 的 `menus.recruitment.*` 全部 8 个 key

**残留引用**：零

#### ✅ 第 13 对：`comp/social-security` vs `/social-security` (legacy) + `/comp/social-*` 7 子路由合并

- **审查日期**：2026-04-22
- **决策**：**菜单折叠 + 功能精简**（用户洞察：14 → 8，对齐市面主流）
- **类型**：高风险对第 4 个，合并了原计划的 social-security 独立对 + comp 内部 7 个子路由的整合

**用户洞察**：用户发现薪酬福利下有 14 个二级菜单过多，提出"账单/申报用按钮/Drawer 不独立成页"的思路。深度对标 Workday/SAP/北森/金蝶后验证用户思路**完全对齐市面主流**：
- Workday/SAP：3~4 核心页 + 申报作为 Payroll Run 产出按钮
- 北森 iTalent / 金蝶 / 用友：3~5 核心页（政策 + 参保 + 月结/账单 + 统计）
- 钉钉智能人事：参保档案 + 社保计算 + 数据导出（按钮）

**合并方案**（7 子页 → 4 Tab）：
```
/comp/social-security （1 个二级菜单）
├── Tab 1 政策配置（嵌套 Tab：社保方案 + 公积金）  ← 合并 insurance-config + provident-fund
├── Tab 2 员工参保                                  ← 复用 employee-insurance
├── Tab 3 月度计算（含账单列表 + 申报导出按钮 → Drawer）  ← 合并 insurance-bill + 申报导出
└── Tab 4 统计分析                                  ← 复用 statistics
```

**执行改动**：
1. ➕ 新建 `views/comp/social-security/index.vue` 作为 Tab 容器（4 Tab + 嵌套 Tab + 申报导出 Drawer）
2. 🔧 `router/modules/comp.ts` — 7 条 `/comp/social-*` 子路由 → 1 条 `/comp/social-security`
3. 🗑️ 删除 `router/modules/social-security.ts`（legacy 一级路由）
4. ✏️ `router/modules/index.ts` 移除 `socialSecurityRoutes`
5. ✏️ `mock/system/roles.ts` — `comp:social-security` 保持原有 1 条注册（已对齐）
6. ✏️ `views/workspace/shortcut-config.vue` 快捷入口 path 修复
7. ✏️ i18n — `menus.comp.*` 删除 7 个子 key，新增 `socialSecurity`；删除 legacy `menus.socialSecurity.*` 整组

**保留（被 Tab 容器引用）**：
- `views/social-security/*` 7 个 legacy view 组件（作为 Tab 内容复用，物理归属暂不搬迁）

**用户影响**：
- ✅ 薪酬福利菜单从 14 → 8 个（认知负荷显著降低）
- ✅ 所有功能保留（Tab + 嵌套 Tab + Drawer + 按钮）
- ⚠️ 访问路径变化：`/social-security/insurance-config` 失效 → `/comp/social-security`（Tab 点击）

**残留引用**：零（2 处命中是新路径 `/comp/social-security` 的合法引用）

#### ✅ 第 12 对：`comp/*` vs `/salary` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy + 搬迁调薪组件 + 修 menuCode bug
- **类型**：高风险对第 3 个

**深度 Diff 结论（4 对）**：
1. **structure**：Legacy 是薪资项目管理（错误业务定位），V2.0 是薪酬带宽管理（对齐 Workday）→ V2.0 更对
2. **calculation → payroll**：V2.0 采用批次核算模型（对齐 Workday Payroll Batch）→ 升级覆盖
3. **payslip**：V2.0 是员工自助视角（对齐 ESS 设计），Legacy 是发放行为管理 → 视角不同，V2.0 更主流
4. **tax**：V2.0 是规则管理导向（税率表 + 专项扣除），Legacy 是员工维度明细 → 互补

**业务决策（基于 Diff）**：V2.0 整体架构更专业，无严重缺口，可以放心删 legacy。

**执行改动**：
1. 🔧 `router/modules/comp.ts` — `/comp/adjustment` menuCode 从 `'comp:structure'`（蹭权限）改为 `'comp:adjustment'`
2. ➕ `mock/system/roles.ts` — MENU_DEFINITIONS 新增 `comp:adjustment` 注册
3. 🚚 `views/salary/adjustment/index.vue` → `views/comp/adjustment/index.vue`（保持复用，不重写）
4. 🗑️ 删除 `views/salary/structure/` + `calculation/` + `payslip/` + `tax/`（V2.0 已覆盖）
5. 🗑️ 删除 `router/modules/salary.ts`
6. ✏️ `router/modules/index.ts` 移除 `salaryRoutes`
7. 🔧 `mock/workspace.ts` + `views/workspace/index.vue` + `shortcut-config.vue` 3 处 /salary 坏链接修复
8. ✏️ 清理 i18n `menus.salary.*` 全部 key

**Phase 5 遗留（记录）**：
- **薪资项配置**应独立出来放到**系统管理 / 薪酬设置**下（Legacy structure 的真正用途）
- **工资条发放追踪**（渠道/状态/方式）可作为 V2.0 payroll 批次的增强 Tab
- **员工个税明细视图**可作为 V2.0 tax 的增强 Tab

**保留（其他对处理）**：
- `@/api/salary` `@/mock/salary` `@/types/salary` → 被 adjustment 组件自身依赖

**残留引用**：零

#### ✅ 第 11 对：`hrm/*` vs `/employee` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy + 试用期搬到 hrm + 证件合并到员工档案 Tab
- **类型**：高风险对第 2 个，涉及业务架构决策 + 功能搬迁

**业务决策（用户确认）**：
1. **试用期管理归属"组织人事"**（不是招聘）—— 对齐 Workday/SAP/北森 100% 实践，试用期是员工入职后的状态管理，不属于招聘模块
2. **员工证件合并到员工档案详情页第 8 Tab "证件"** —— 对齐 Workday/SAP/北森（9 个 Tab 在行业舒适区内），证件数据基于员工池字段动态构造（身份证/学历/健康证/职业资格）
3. **入职办理保留 V2.0 的 `/recruit/onboarding`**，删 legacy `/employee/onboarding`

**执行改动**：
1. 🚚 `views/employee/probation/*` → `views/hrm/probation/*`（连同 9 处内部 router.push 路径更新）
2. ✏️ `router/modules/hrm.ts` 新增 `/hrm/probation` 及 6 条子路由（create/edit/evaluate/extend/evaluation-detail/extension-detail）
3. ✏️ `mock/system/roles.ts` MENU_DEFINITIONS 新增 `hrm:probation`
4. ✏️ `zh.json` + `en.json` 新增 `menus.hrm.probation*` 7 个 key
5. ✏️ `views/hrm/employee/detail.vue` 新增 Tab 8 "证件"（基于员工池动态构造身份证/学历/健康证/职业资格 4 类）
6. ✏️ 3 处快捷入口更新：`mock/workspace.ts` / `views/workspace/index.vue` / `views/workspace/shortcut-config.vue`
7. 🗑️ 删除 `views/employee/*` 整个目录（profile / onboarding / resignation / transfer / certificate）
8. 🗑️ 删除 `router/modules/employee.ts`
9. ✏️ `router/modules/index.ts` 移除 `employeeRoutes` import 和 legacyRoutes 注册
10. ✏️ 清理 `zh.json` + `en.json` 的 `menus.employee.*` 全部 key（en.json 还发现并修复了重复键）

**保留（属于其他对）**：
- `@/api/employee`、`@/api/department`、`@/api/position` 及其 mock/types → 被 salary/recruitment 的 legacy view 引用

**残留引用**：零

#### ✅ 第 10 对：`hrm/organization + position + headcount` vs `/organization` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy + 组织架构图合并为 Tab + 业务重构（4 项）
- **类型**：高风险对第 1 个，涉及业务重构 + 架构搬迁

**业务重构（用户提出 + 方案 A）**：
1. ✏️ 组织编码改为层级业务语义：`ORG001-D001-DEPT001` → `G01-BU01-D01`（12 个组织）
2. ✏️ 删除 `orgShortName` 字段（中文场景多余，对齐国内主流 HR 产品）
3. ✏️ 编制集团 rollup：非叶子 budgetCount = ∑ 叶子后代，父节点不可直接调整
4. ✏️ 编制/实际在职/招聘中动态聚合（员工档案 + 招聘需求）
5. ✏️ 4 个中心统一有子组：产品设计 → 产品经理组/UX 设计组；运营市场 → 运营组/市场组；人力资源 → 招聘组/HRBP 组（共 6 个新组，id=13~18）
6. ✏️ FAMILY_TO_ORG 映射下沉到叶子组
7. 🔧 发现 MGMT 族全部落在特殊状态区 → 用独立 rand shuffle statusList 修复，不污染主流

**架构搬迁（方案 A：合并为 Tab，对齐 Workday/SAP/北森）**：
- 不新增菜单项；"组织架构"页新增视图切换 Tab（列表管理 + 架构图）
- 架构图用 ECharts tree 重写（精简版：展开/收起/搜索/导出 PNG），舍弃旧版的 PDF/打印/按岗位视图
- 数据源改为 `useOrganizationStore().getTree`，不再依赖 legacy API

**常规清理**：
- ✏️ `mock/workspace.ts` 3 处快捷入口 path 更新（/hrm/organization、/hrm/position、/hrm/headcount）
- ✏️ `views/workspace/index.vue` 3 处同上
- ✏️ `router/modules/index.ts` 移除 `organizationManagementRoutes`
- 🗑️ 删除 `router/modules/organization-management.ts`
- 🗑️ 删除 `views/department/*`、`views/position/*`、`views/staffing/*`、`views/org-chart/*` 整个目录
- 🗑️ 删除 `types/org-chart.ts`、`mock/org-chart.ts`、`api/org-chart.ts`
- ✏️ 清理 i18n `menus.organization.*`（10 个 key）

**保留（属于其他对）**：
- `types/department.ts`、`types/position.ts`、`types/staffing.ts` 及其 mock/api → 被 `views/salary/*` 和 `views/employee/*` 引用，等对应 legacy 对（第 11 对 employee、第 12 对 salary）处理时一起清
- `mock/role.ts` 里的 `/organization/*` path 字符串 → RBAC 权限树 demo 数据，不是前端跳转，等系统管理模块审查时处理

**用户确认点**：
- 方案 1.2 采用 `G01-BU01-D01-T01` 编码（已选）
- 方案 2 新版岗位体系作基线（已选）
- 方案 3 编制 rollup 标准实现（已选）
- 方案 4 动态数据联动（已选）
- 同级部门一致性 方案 B（给 3 个中心都建子组）（已选）
- 架构图 方案 A（合并为 Tab）（已选）
- **残留引用**：零本对范围残留

#### ✅ 第 9 对：`attendance/leave-*` vs `/leave` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy
- **理由**：legacy 下 5 个子路由（config/quota/application/time-off/ledger）全部在 V2.0 `/attendance/leave-*` 下有同组件对应；page vs dialog 核实通过（都是独立列表页，无混合模式）
- **执行改动**：
  1. ✏️ `mock/workspace.ts:34` 请假管理快捷入口 path `/leave/list` → `/attendance/leave-application`（旧值 `/leave/list` 是坏链接）
  2. ✏️ `views/workspace/shortcut-config.vue:107` 假勤管理入口 path → `/attendance/leave-application`
  3. ✏️ `router/modules/index.ts` — 移除 `leaveRoutes` import 和 legacyRoutes 注册
  4. 🗑️ 删除 `router/modules/leave.ts`
  5. ✏️ 清理 `zh.json` + `en.json` 的 `menus.leave.*` 全部 6 个 key
- **用户确认点**：已确认
- **残留引用**：零

#### ✅ 第 15 对：`/perf/*` vs `/performance` (legacy)

- **审查日期**：2026-04-23
- **决策**：废弃 legacy（路径别名型）+ 修 3 处坏链接
- **类型**：高风险对最后一个，Wave 1 收官

**diff 结论**：Legacy `/performance/*` 8 子路由全部和 V2.0 `/perf/*` 引用同一组件（`views/performance/*`），零独有功能；legacy 缺 menuCode，未接入 V2.0 RBAC。

**执行改动（合计 26 处）**：
1. ✏️ `mock/performanceTask.ts` — 15 处 redirectUrl 批量 `/performance/` → `/perf/`；含 3 处坏链接精准修正：
   - `/performance/review-360` × 2 → `/perf/review-360/x`（补齐 Tab 融合后缀）
   - `/performance/one-on-one` × 1 → `/perf/feedback-one-on-one`（V2.0 改名）
2. ✏️ `views/performance/goal/index.vue` — 2 处 Tab 切换路径
3. ✏️ `views/performance/goal-alignment/index.vue` — 2 处 Tab 切换路径
4. ✏️ `views/performance/evaluation/index.vue` — 2 处 Tab 切换路径
5. ✏️ `views/performance/review-360/index.vue` — 2 处 Tab 切换路径
6. ✏️ `views/workspace/index.vue:462` — 快捷入口 `/performance` → `/perf/cycle`
7. ✏️ `views/workspace/shortcut-config.vue:109` — 候选入口 `/performance/evaluation` → `/perf/evaluation`
8. ✏️ `mock/workspace.ts:24` — 坏链接 `/performance/assessment` → `/perf/evaluation`
9. 🗑️ 删除 `router/modules/performance.ts`
10. ✏️ `router/modules/index.ts` — 移除 `performanceRoutes` import、删除整个 `legacyRoutes` 机制（本对后 legacy 数组变空）
11. ✏️ `zh.json` + `en.json` — 删除 `menus.performance` 整节点 9 个 key

**保留（非前端路由）**：
- `src/api/performanceOneOnOne.ts` 的 4 处 `/admin/performance/one-on-one/*` 是后端 API URL

**用户确认点**：方案 A 彻底删除 + 坏链接 `/performance/assessment` 修为 `/perf/evaluation` + review-360 带 `/x` 后缀

**残留引用**：零（grep `/performance/` 和 `performanceRoutes` / `menus.performance` 均空）

**里程碑意义**：Wave 1（15 对新旧重叠审查）全部完成 ✅；`legacyRoutes` 兼容层彻底移除

---

#### ✅ 第 8 对：`hrm/contract-*` vs `/contract` (legacy)

- **审查日期**：2026-04-22
- **决策**：废弃 legacy + 修 14 处代码硬编码跳转 + 更新 2 处快捷入口
- **理由**：legacy 下 16 个子路由全部在 V2.0 `/hrm/contract-*` 下有同组件对应（仅路径前缀不同）
- **执行改动**：
  1. ✏️ `views/contract/list/index.vue` — 8 处 `/contract/list/*` → `/hrm/contract-list/*`（批量 replace）
  2. ✏️ `views/contract/list/create.vue:269` — 返回列表路径
  3. ✏️ `views/contract/list/approve.vue:213` — 返回列表路径
  4. ✏️ `views/contract/list/detail.vue:219` — 返回列表路径
  5. ✏️ `views/contract/statistics/index.vue:338` — 续签跳转
  6. ✏️ `views/contract/template/versions.vue:77` — 返回模板列表
  7. ✏️ `views/contract/template/index.vue:370-373` — 版本管理路径（并顺手把 `{path, query}` 改为 path 参数式）
  8. ✏️ `mock/workspace.ts:35` — 工作台快捷入口合同列表 path
  9. ✏️ `views/workspace/shortcut-config.vue:105` — 快捷入口配置页合同管理 path（审查中发现的额外漏网）
  10. ✏️ `router/modules/index.ts` — 移除 `contractRoutes` 的 import 和 legacyRoutes 注册
  11. 🗑️ 删除 `router/modules/contract.ts`
  12. ✏️ 清理 `zh.json` + `en.json` 的 `menus.contract.*` 全部嵌套 key（含 template/archive/statistics 子对象）
- **审查时额外发现**：`views/workspace/shortcut-config.vue` 的合同链接也是旧路径，非 grep 首轮命中，二次 grep 发现并修复
- **用户确认点**：已确认
- **残留引用**：零

### Wave 2 执行日志

#### ✅ Wave 2 A 路线：时间一致性修复（2026-04-23）

**前置工作（第 A 期基建）**：
- 📝 创建规则文档 `docs/HR重构-数据健康度规则-V1.0.md`（31 条规则，按数据变动场景触发索引）
- 📝 创建常量文件 `src/constants/employee.ts`（员工状态常量 + 日期判定函数）
- 📝 创建扫描脚本 `scripts/wave2-time-scan.ts`（用 tsx 跑真实数据）+ `src/mock/core/dataHealthCheck.ts`（运行时自检）

**扫描发现（执行前）**：
- 🔴 B1 合同过期但员工仍在职：**146 条**（73% 员工）
- 🔴 C6 员工 currentContractId 指向不存在的合同：**200 条**
- ⚠️ B5-a probation 员工入职 > 6 个月未转正：**2 条**

**根因**：员工池的合同生成逻辑过于简化（`contractEndDate = entryDate + 3 年`，从不续签）+ contract.ts 只写了 28 条样例合同，完全没覆盖员工池。

**执行改动**：
1. ✏️ `src/mock/core/employeePool.ts` 新增：
   - `applyProbationAutoRegularization()` — B5-a 自动转正后处理
   - `generatePoolContracts()` — 基于员工池生成 413 份合同（首签 1/2/3/5 年加权随机，过期循环续签，terminated 员工合同对齐离职日）
   - 导出 `POOL_CONTRACTS` 供下游 import
   - 独立种子（SEED+2 离职日 / SEED+3 合同）避免扰动主 rand
2. ✏️ `src/mock/contract.ts` — 导入 `POOL_CONTRACTS` 合并到 contracts 数组（手写 28 条样例 + 员工池 413 份 = 441 条合同）
3. 📝 文档更新：规则文档升 V1.1，补充 B1/B5 修复的 Mock 层实现说明

**验证结果**：
- B1 合同过期：146 → **0** ✅
- C6 合同断链：200 → **0** ✅
- B5-a 试用期超期：2 → **0** ✅
- 合同数据质量抽检：入职 2016 的员工有 3 份合同（首签 5 年 + 两次续签），入职 2023 的员工只有 1 份（首签未到期），状态分布合理（履约中 185 / 已续签 213 / 已终止 15）

**残留/后续**：
- offboarding mock 的 actualLastDay 与员工池 terminated 员工的合同终止日尚未严格对齐（两套生成逻辑各自独立，数值可能差异）。后续可能需要让 offboarding mock 读取员工池的 terminationDate 做统一数据源
- 零业务代码直接读取员工的 contractEndDate/currentContractId，本次改动不破坏前端页面

---

#### ✅ Wave 2 B+C 路线合并：数据密度扩充（2026-04-23）

**目标**：让各业务 mock 覆盖全员工池 + 离职员工有合理的历史数据。

**用户敲定策略 B**（按业务热度生成，非无限回溯）：
- 工资条：近 12 个月全员（2025-05 ~ 2026-04）
- 绩效档案：3 个周期（2024 年度 / 2025 年度 / 2026 Q1）
- 考勤：近 3 个月工作日
- 社保/公积金/福利：全员覆盖
- 培训：沿用现有（plan/record 已覆盖 100+ 员工）
- 加班/请假/外勤/补卡：按真实频率散点，保持现状

**执行改动（6 轮）**：

| 轮次 | 模块文件 | 改前 | 改后 | 关键改动 |
|---|---|:---:|:---:|---|
| 1 | `comp/payroll.ts` | 3 批次 | 12 批次、≈2214 条 | 批次扩至近 12 月；改过滤逻辑为"当月在职" |
| 2 | `employeeInsurance.ts` / `providentFund.ts` | 20+26 | ~235+225 | 追加全员参保/停保记录；按城市计算费率 |
| 3 | `comp/welfare.ts` | ~100 | ~1020 | 全员 × 春节/生日/体检/家庭关爱；按在职日过滤 |
| 4 | `performanceArchive.ts` | 7 | 560 | 全员 × 3 周期；按"周期内在职 ≥ 75 天"判定 |
| 5 | 培训模块 | — | — | 已覆盖，跳过 |
| 6 | `attendanceRecord.ts` | 21 | ~10990 | 全员 × 近 3 月工作日；确定性 hash 分配迟到/早退/旷工 |

**验收发现的真 bug（修复）**：
- 🐛 合同类型显示 `undefined`（从手写 28 条就有的历史遗留）：UI 用 `row.contractType` 查字典，但合同只有 `type` 数字字段。修复：`contract.ts` 合并后统一补 `contractType` 字段（`type=1→'fixed'`/ `2→'labor'`/ `4→'intern'` 等）
- 🐛 terminated 员工（如邓晨磊 2024-10-10 离职）缺 2024 年度绩效档案：原过滤逻辑 `cycle.endDate > contractEndDate` 粗暴跳过；修复为"周期内在职 ≥ 75 天就生成"，邓晨磊 2024 年在职 10 个月 → 正常生成

**用户确认的非 bug（不修）**：
- 绩效等级跨周期不浮动（同一员工 12 个月都是 D × 0.5）：Mock 简化，不做多周期浮动逻辑
- 离职员工（如 2024-10 离职的邓晨磊）看不到工资条：策略 B 的窗口限制（近 12 月 = 2025-05 起），属于业务合理约束

**数据量总览（改后）**：

| 模块 | 数据量 |
|---|:---:|
| 合同 | 441（28 手写 + 413 池生成）|
| 工资条（按批次按需）| 2214（12 批次）|
| 社保参保 | ~235 |
| 公积金 | ~225 |
| 福利 | ~1020 |
| 绩效档案 | 560 |
| 考勤记录 | ~10990 |
| **总计** | **~15685** |

**性能实测（策略 B 下）**：
- 首次页面初始化 +300~500ms（感知轻微）
- 分页查询 < 30ms（无感）
- 员工详情 Tab 过滤 < 20ms（无感）

**顺手改动**：员工档案页删除"调动/借调"统计卡片（用户反馈视觉干扰）

---

#### ⚠️ 发现的 V1.0/V2.0 权限体系兼容性 bug（第 14 对验证时发现）

**根因**：`store/modules/user.ts` 的 `isHR / isSuperAdmin / isDeptManager` 只识别 V1.0 角色 code（`R_HR` / `R_SUPER` / `R_DEPT_MANAGER`），但 V2.0 RBAC 用的是 `super_admin / hr_admin / hr_bp / dept_manager / line_manager / employee`——两套 role code 不对齐。

**影响**：所有用 `userStore.isHR` 等判断权限的地方都失效（按钮不显示、操作被拒），包括：
- 招聘需求池 "发布职位" 按钮（用户反馈）
- 职位发布页 `views/recruitment/job/index.vue`
- 内推管理 `views/recruitment/referral/index.vue`

**修复（已完成）**：
- `store/modules/user.ts` 的 3 个计算属性改为**兼容新旧**：V1.0 code + V2.0 RBAC currentRoleCode 任一命中即生效
- 使用 Pinia 懒加载方式读 rbacStore，无循环依赖问题

**涟漪风险**：还有没有其他模块用了这种 V1.0 权限判断但 V2.0 没适配？需要 Wave 3 阶段做全局扫描，对齐所有角色判断逻辑到同一权威源。

### Wave 3 执行日志

#### ✅ Wave 3 完成：工作台快捷入口 + 菜单定稿 + 横切清理（2026-04-23）

**Step 1 工作台快捷入口修复**：
- ✏️ `views/workspace/index.vue` 数量上限从 12 → 16（5 处："最多可添加 X 个"文案 + 判断条件 + 提示 message）
- ✏️ `views/workspace/index.vue` `availableShortcuts` 16 条候选入口全部对齐 V2.0 路径（修 7 处坏链接：培训/系统/加班/补卡/请假/合同等）
- ✏️ `views/workspace/shortcut-config.vue` `allFunctions` 12 条候选对齐 V2.0（修 4 处坏链接：组织管理 / 审批流 / 系统管理 / 培训管理）
- ✏️ `mock/workspace.ts` `/system/user` → `/system/user-account`

**Step 2 菜单最终定稿**：
- 输出 8 一级 + 1 工作台 = 9 一级 / 85 二级菜单的完整清单（见第 八 章）
- 每个一级下的可见二级数量落在 7~14 区间，符合 V2.0 合并策略

**Step 3 横切清理**：
- ✅ 前端业务代码 grep 零 legacy 硬编码跳转
- ✅ i18n legacy menu keys 清零
- ✅ `router/modules/index.ts` 的 `legacyRoutes` 兼容层已移除（Wave 1 末尾完成）

---

#### ⏸️ 已解决：工作台自定义快捷入口（用户 2026-04-22 提出，Wave 3 Step 1 完成）

**问题**：
1. 数量限制 12 需要调整为 16（截图显示 `16/12` 违规状态）
2. 候选入口列表（`views/workspace/shortcut-config.vue` 的 `DEFAULT_SHORTCUTS`）仍是 V1.0 旧路径，未对齐 V2.0 新菜单

**推迟到 Wave 3 的理由**：
- 剩余 7 对 legacy 审查都可能动到菜单路径
- 候选列表应**一次性对齐到最终菜单终态**
- 数量限制调整是 5 分钟事，一起改最划算

**修复清单（菜单定稿后执行）**：
- 🔧 `views/workspace/index.vue:286` 文案 `最多可添加12个` → `最多可添加16个`
- 🔧 `views/workspace/index.vue:333` `>= 12` → `>= 16`
- 🔧 `views/workspace/index.vue:611` `>= 12` → `>= 16`
- 🔧 `views/workspace/shortcut-config.vue:101-114` 重写 `DEFAULT_SHORTCUTS` 全量对齐到 V2.0 二级菜单
- 🔧 `mock/workspace.ts` 的初始快捷入口数据同步清理（同一数据源，avoid duplication）

### 横切任务日志

_Wave 1 + Wave 2 完成后执行_

---

## 八、最终菜单终态（Phase 4.x 定稿，2026-04-23）

### 8.1 总览

**一级菜单：8 + 1 工作台 = 9 个** / **二级菜单总数：85 个**

| # | 一级菜单 | 路由前缀 | 可见二级数 | 备注 |
|---|---|---|:---:|---|
| — | 工作台 | `/workspace` | 1 | 特殊一级（含子 Tab）|
| 01 | 组织人事 | `/hrm/*` | 11 | 含合同列表/合同模板/合同归档/合同统计/试用期 |
| 02 | 招聘与入职 | `/recruit/*` | 14 | 含运营 ops / 配置 settings 分组 |
| 03 | 考勤与假期 | `/attendance/*` | 11 | 考勤+假期合并后一级 |
| 04 | 薪酬福利 | `/comp/*` | 8 | 社保 7 子页已折叠为 Tab 容器 |
| 05 | 绩效管理 | `/perf/*` | 14 | 含持续反馈/PIP/申诉/人才盘点/配置 |
| 06 | 培训与发展 | `/training/*` | 7 | 含能力模型/证书/继任 |
| 07 | 数据洞察 | `/insight/*` | 7 | 驾驶舱/人员/招聘/绩效/薪酬/考勤/AI |
| 08 | 系统管理 | `/system/*` | 12 | 含审批流 5 子页 |

### 8.2 与原计划对比

**原目标**：每个一级下二级 5~8 个（实施计划篇 8.1）
**实际**：二级数量 7~14 个，偏多

**分析**：
- `recruit` 14 个（运营 ops 3 + 配置 settings 6 + 核心 5）—— 因为 ops 和 settings 原本是两个独立一级，合并后二级数量膨胀
- `perf` 14 个 —— 因为合并了原 performance + feedback + settings 三块
- `hrm` 11 个 —— 合同从一级降级为二级后，合同体系 4 个子页都挂在 hrm 下
- `attendance` 11 个 —— 考勤 6 + 假期 5

**结论**：二级偏多是 V2.0 合并策略的副作用，符合预期。若要再精简，属于 Phase 6 拆分菜单的范畴（实施计划 §一 Phase 6 目标：8 一级 → 10 一级，把薪酬/社保拆开、绩效/人才发展拆开，恢复二级数量 5~8 个）。

### 8.3 Legacy 路由清零确认

审查结束时，Wave 1 的 15 对重叠审查全部处理：
- 删除 legacy 路由文件 9 个（`performance-analytics.ts` / `performance-feedback.ts` / `performance-settings.ts` / `data-report.ts` / `recruitment-ops.ts` / `recruitment-settings.ts` / `recruitment.ts` / `approval-engine.ts` / `performance.ts` + `contract.ts` / `leave.ts` / `salary.ts` / `social-security.ts` / `employee.ts` / `organization-management.ts`）
- `router/modules/index.ts` 中 `legacyRoutes` 兼容层彻底移除
- 所有前端业务代码零 legacy 硬编码跳转
- 所有 i18n legacy menu keys 清理完毕

---

## 九、已确认的「非需求」清单（经业务判断明确不补）

> 这些功能看起来"缺失"，但基于真实业务流程确认是**不应该有**的功能。登记在此避免未来审查时重复讨论。

| # | 表面缺失 | 为什么不做 | 确认日期 |
|---|---|---|---|
| 1 | 人才盘点面板缺"添加员工"按钮 | 盘点对象 = 适用部门锁定的员工清单；盘点会议是集中审议而非员工管理，不应动态加人；若范围错了应作废会议重建 | 2026-04-22 |
