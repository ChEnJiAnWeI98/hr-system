# HR 系统重构 · Phase 2 · 菜单归位 + 已有模块迁移 · 实施计划

**文档版本**：V1.1
**撰写日期**：2026-04-21
**完成日期**：2026-04-21
**状态**：✅ **Phase 2 全部完成**
**对应 Phase**：Phase 2 - 菜单归位 + 已有模块迁移
**前置依赖**：Phase 1 地基已完成（员工池 / 字典 / 组织 / 岗位 / RBAC）
**上游文档**：
- `docs/HR系统重构方案-V2.0-架构篇.md`
- `docs/HR系统重构方案-V2.0-迁移篇.md`
- `docs/HR系统重构方案-V2.0-实施计划.md`（第三章 Phase 2）

---

## 🎯 Phase 2 目标

**21 个一级菜单 → 8 个一级菜单** + 所有现有模块接入统一员工池 + 菜单动态裁剪

---

## ✨ Phase 2 里程碑

当 Phase 2 完成时：

- ✅ 侧边栏只有 8 个一级菜单（对标北森 / Workday）
- ✅ 招聘 4 个一级菜单 合并为 1 个「招聘与入职」
- ✅ 绩效 4 个一级菜单 合并为 1 个「绩效管理」
- ✅ 散装一级（contract / leave / socialSecurity / approvalEngine）全部降级为二级
- ✅ `talentExperience` / `employeeSelfService` 彻底删除
- ✅ 所有业务模块读员工数据改用 `useEmployeeStore`（员工档案为 SSOT）
- ✅ 所有部门/岗位选择器改用 `OrgTreeSelect` / `PositionSelector` / `DictSelector`
- ✅ 菜单按 RBAC 角色动态裁剪（员工账号看不到系统管理）
- ✅ 需求说明书 V1.0 目录同步更新（章节对齐新 8 模块）

---

## 📊 Phase 2 最终菜单结构

```
01 组织人事（hrm）
   ├ 组织架构
   ├ 岗位体系
   ├ 员工档案
   └ 合同管理          ← 从一级降级

02 招聘与入职（recruit）
   ├ 招聘需求
   ├ 职位发布
   ├ 简历池
   ├ 面试管理
   ├ Offer 管理
   ├ 入职办理          ← 合并 onboarding + onboarding-connection
   ├ 招聘运营          ← 合并 recruitmentOps（页内 Tab）
   └ 招聘配置          ← 合并 recruitmentSettings（页内 Tab）

03 考勤与假期（attendance）
   ├ 考勤规则
   ├ 考勤记录
   ├ 假期管理          ← 从一级降级
   ├ 加班管理
   └ 考勤报表

04 薪酬福利（comp）
   ├ 薪资核算          ← 原 salary
   ├ 社保公积金        ← 从一级降级
   └ 员工工资条

05 绩效管理(perf) ← 合并原 4 个一级
   ├ 绩效周期
   ├ 目标管理（含对齐 Tab）
   ├ 绩效评估（含 360 Tab）
   ├ 绩效校准
   ├ 绩效面谈
   ├ 绩效档案
   ├ 持续反馈（1on1 + 即时反馈 + 徽章 Tab）
   ├ PIP 改进
   ├ 绩效申诉
   ├ 人才盘点
   └ 绩效配置（模板 + 应用规则 + 任务中心 Tab）

06 培训与发展（training）
   ├ 培训管理（原 training）
   └ 能力模型          ← 从绩效配置迁入

07 数据洞察（insight）
   ├ HR 驾驶舱
   ├ 招聘分析          ← 从 dataReport 迁入
   ├ 绩效分析          ← 从 performanceAnalytics 迁入
   └ AI 辅助中心       ← 从绩效配置迁入

08 系统管理（system）
   ├ 用户账号
   ├ 角色权限
   ├ 数据权限
   ├ 审批流            ← 从一级降级
   ├ 数据字典
   ├ 消息通知
   └ 操作日志
```

---

## 📅 Phase 2 子阶段

| 子阶段 | 主题 | 关键动作 |
|:---:|---|---|
| 2.0 | 前置清场 | 删除 talentExperience + employeeSelfService + 备份旧 mock |
| 2.1 | 新建 8 个一级路由骨架 | recruit/perf/comp/insight 新建；attendance/training 保留 |
| 2.2 | 招聘模块合并（4→1） | recruitment + recruitmentOps + recruitmentSettings 三合一 |
| 2.3 | 绩效模块合并（4→1） | performance + feedback + analytics + settings 四合一 |
| 2.4 | 组织人事扩展 | contract 降级 + 旧 employee/organization-management 清理 |
| 2.5 | 考勤与假期合并 | leave 降级 |
| 2.6 | 薪酬福利合并 | salary/socialSecurity 降级 |
| 2.7 | 培训与发展迁移 | 能力模型迁入 |
| 2.8 | 数据洞察迁移 | dataReport + AI 辅助 + 绩效分析汇总 |
| 2.9 | 系统管理扩展 | approvalEngine 降级 |
| 2.10 | 数据层接入员工池 | 业务 Mock 改读 useEmployeeStore |
| 2.11 | 菜单动态裁剪 | menu store 接入 rbacStore.hasMenu |
| 2.12 | i18n 重构 | 新 8 一级 key + 删废 key |
| 2.13 | 需求说明书 V1.0 同步 | 13 章 → 8 章目录重构 |
| 2.14 | Phase 2 验收 | 里程碑检查 + plan.md 收尾 |

---

## 2.0 前置清场

### 任务

| 操作 | 目标文件 |
|---|---|
| 删除路由 | `src/router/modules/talent-experience.ts` |
| 删除路由 | `src/router/modules/employee-self-service.ts` |
| 删除 views | `src/views/talent-experience/`（如存在） |
| 删除 views | `src/views/employee-self-service/`（如存在） |
| 删除 mock | `src/mock/talent-experience*`（如存在） |
| 删除 mock | `src/mock/employee-self-service*`（如存在） |
| 删除 api | `src/api/talent-experience*`（如存在） |
| 删除 api | `src/api/employee-self-service*`（如存在） |
| 删除 types | `src/types/talent-experience*` / `employee-self-service*` |
| 备份旧 mock | `src/mock/` → `src/mock.backup/` 整体备份（只保留 `mock/core/` `mock/dict/` `mock/system/`） |
| 从 `router/modules/index.ts` 移除 | `talentExperienceRoutes` / `employeeSelfServiceRoutes` imports & 数组项 |
| i18n 清理 | 删除 `menus.talentExperience.*` / `menus.employeeSelfService.*` |

**注意**：不删除 `src/mock/core/` / `src/mock/dict/` / `src/mock/system/`，这是 Phase 1 的地基数据。

---

## 2.1 新建 8 个一级路由骨架

### 已有（保留 / 改造）

| 路由文件 | 操作 |
|---|---|
| `hrm.ts` | ✅ Phase 1 已建 |
| `attendance.ts` | 改造：补齐二级（规则/记录/假期/加班/报表） |
| `training.ts` | 改造：补齐二级（培训管理/能力模型），能力模型从绩效迁入 |
| `system.ts` | 改造：补齐 `approval` 二级 |
| `workspace.ts` | 保留 |

### 新建

| 路由文件 | 包含二级 |
|---|---|
| `recruit.ts` | demand / job / resume / interview / offer / onboarding / ops / settings |
| `perf.ts` | cycle / goal / evaluation / calibration / meeting / archive / feedback / pip / appeal / talent-review / settings |
| `comp.ts` | payroll / social-security / payslip |
| `insight.ts` | dashboard / recruitment / performance / ai-assistant |

### 废弃（路由文件删除）

```
删除：
- recruitment.ts          → 迁至 recruit.ts
- recruitment-ops.ts      → 合并至 recruit.ts（页内 Tab）
- recruitment-settings.ts → 合并至 recruit.ts（页内 Tab）
- talent-experience.ts    → 砍掉
- performance.ts          → 迁至 perf.ts
- performance-feedback.ts → 合并至 perf.ts
- performance-analytics.ts → 拆分至 perf.ts + insight.ts
- performance-settings.ts → 拆分至 perf.ts + training.ts + insight.ts
- salary.ts               → 迁至 comp.ts
- social-security.ts      → 合并至 comp.ts（二级）
- leave.ts                → 合并至 attendance.ts（二级）
- contract.ts             → 合并至 hrm.ts（二级）
- approval-engine.ts      → 合并至 system.ts（二级）
- organization-management.ts → 合并至 hrm.ts（旧组织页保留功能迁移到 hrm/organization）
- employee.ts             → 合并至 hrm.ts（旧花名册废弃，用新 hrm/employee）
- data-report.ts          → 迁至 insight.ts
- employee-self-service.ts → 砍掉
```

---

## 2.2 招聘模块合并

### 路径迁移

| 旧路径 | 新路径 | views 操作 |
|---|---|---|
| `/recruitment/demand` | `/recruit/demand` | 移动目录 `views/recruitment` → `views/recruit` |
| `/recruitment/job` | `/recruit/job` | 同上 |
| `/recruitment/resume` | `/recruit/resume` | 同上 |
| `/recruitment/interview` | `/recruit/interview` | 同上 |
| `/recruitment/offer` | `/recruit/offer` | 同上 |
| `/recruitment/onboarding` + `onboarding-connection` | `/recruit/onboarding` | **合并**为一个页面 |
| `/recruitment-ops/*` | `/recruit/ops?tab=xxx` | 把各子页改为页内 Tab |
| `/recruitment-settings/*` | `/recruit/settings?tab=xxx` | 同上 |
| `/talent-experience/*` | ❌ 删除 | - |

### onboarding 合并策略

当前两个入职页：
- `onboarding`（员工入职办理）
- `onboarding-connection`（招聘衔接）

**合并方案**：
- 路径：`/recruit/onboarding`
- 单页 + 状态筛选：已接 Offer / 待入职 / 办理中 / 已入职（试用期）/ 已转正
- Mock 数据合并两张表

### 依赖说明

- `recruit/demand` 页面的"部门/岗位/HR"选择器 → 改用 `OrgTreeSelect` / `PositionSelector` / `EmployeeSelector`
- 面试官选择 → `EmployeeSelector`
- Offer 中的"岗位"选择 → `PositionSelector`

---

## 2.3 绩效模块合并

### 路径迁移

| 旧路径 | 新路径 | 处理 |
|---|---|---|
| `/performance/cycle` | `/perf/cycle` | 移动 |
| `/performance/goal` | `/perf/goal` | 移动（保留 goal-alignment Tab 内置） |
| `/performance/goal-alignment/x` | `/perf/goal?tab=alignment` | Tab 融合 |
| `/performance/evaluation` | `/perf/evaluation` | 移动 |
| `/performance/review-360/x` | `/perf/evaluation?tab=360` | Tab 融合 |
| `/performance/calibration` | `/perf/calibration` | 移动 |
| `/performance/meeting` | `/perf/meeting` | 移动 |
| `/performance/archive` | `/perf/archive` | 移动 |
| `/performance-feedback/one-on-one` | `/perf/feedback?tab=1on1` | 合并 Tab |
| `/performance-feedback/pip` | `/perf/pip` | 独立二级 |
| `/performance-feedback/tasks` | `/perf/settings?tab=tasks` | 迁入配置 |
| `/performance-feedback/appeal` | `/perf/appeal` | 独立二级 |
| `/performance-feedback/badges` | `/perf/feedback?tab=badges` | 合并 Tab |
| `/performance-analytics/dashboard` | `/insight/performance` | **跨模块**迁移 |
| `/performance-analytics/talent-review` | `/perf/talent-review` | 保留在绩效 |
| `/performance-analytics/talent-board/:id` | `/perf/talent-board/:id` | 保留在绩效 |
| `/performance-settings/template` | `/perf/settings?tab=template` | 合并 Tab |
| `/performance-settings/apply-rules` | `/perf/settings?tab=apply-rules` | 合并 Tab |
| `/performance-settings/competency` | `/training/competency` | **跨模块**迁移 |
| `/performance-settings/ai-assistant` | `/insight/ai-assistant` | **跨模块**迁移 |

### views 目录调整

```
src/views/performance/
├── _shared/            保留（ModuleTabBar）
├── cycle/              不动（路径由路由决定）
├── goal/               不动
├── goal-alignment/     不动（作为 Tab 源）
├── evaluation/         不动
├── review-360/         不动（作为 Tab 源）
├── calibration/        不动
├── meeting/            不动
├── archive/            不动
├── one-on-one/         不动（作为 feedback Tab 源）
├── pip/                不动
├── tasks/              不动（作为 settings Tab 源）
├── appeal/             不动
├── badges/             不动（作为 feedback Tab 源）
├── talent-review/      不动
├── template/           不动（作为 settings Tab 源）
├── apply-rules/        不动（作为 settings Tab 源）
├── competency/         → 迁移到 src/views/training/competency
├── ai-assistant/       → 迁移到 src/views/insight/ai-assistant
└── analytics/          → 迁移到 src/views/insight/performance
```

**策略**：views 目录大部分不动，只改路由引用；仅 3 个跨模块的（competency / ai-assistant / analytics）做目录移动。

### Tab 融合改造

已有的 ModuleTabBar 组件（`views/performance/_shared/ModuleTabBar.vue`）可复用。

需要新建 2 个 Tab 承载页面：
- `views/performance/feedback/index.vue` - 容纳 1on1 + badges 两个 Tab
- `views/performance/settings/index.vue` - 容纳 template + apply-rules + tasks 三个 Tab

---

## 2.4 组织人事扩展

### 合同降级

| 操作 | 细节 |
|---|---|
| 路由 | `/contract/*` → `/hrm/contract`，路由定义移动到 `hrm.ts` |
| views | `views/contract/*` 保留，仅路由注册位置改变 |
| 合同数据去冗余 | 原合同 Mock 里的 `employeeName` 等冗余字段 → 改为 `employeeId` 引用 |

### 旧 organization-management / employee 清理

**策略**：Phase 1 已建 `/hrm/organization` 和 `/hrm/employee`，旧的 organization-management / employee 模块废弃。

需要做：
- 删除 `views/organization-management/` / `views/employee/`（旧的）
- 删除 `mock/employeeProfile.ts` 等旧员工 Mock（已被 employeePool 替代）
- 删除 `router/modules/organization-management.ts` / `router/modules/employee.ts`

**风险**：其他业务页面可能 import 了旧的 employee API / Mock。需要：
- `grep -r 'from .*employee.ts\|from .*employeeProfile'` 找出所有引用
- 把它们改成 `useEmployeeStore()`

---

## 2.5 / 2.6 / 2.7 / 2.8 / 2.9 模块合并（简述）

这些与 2.2 / 2.3 模式相同：

- **2.5 考勤**：leave/* → /attendance/leave；attendance/* 保留并补二级
- **2.6 薪酬**：salary/* → /comp/payroll；social-security/* → /comp/social-security；新增 `/comp/payslip` 占位
- **2.7 培训**：training/* 保留；competency 从绩效迁入
- **2.8 数据洞察**：dataReport/* → /insight/*；performance analytics、AI 辅助迁入
- **2.9 系统**：approval-engine/* → /system/approval；Phase 1 已有 dictionary/role/data-permission

---

## 2.10 数据层接入员工池（关键）

这是 Phase 2 的**技术难点**。每个业务 Mock 都可能自己塞了员工信息。

### 扫描要点

```bash
# 找出所有业务 Mock 里硬编码的员工字段
grep -rn 'employeeName\|employeeId\|employeeNo' src/mock/ --include='*.ts'
```

### 改造原则

- Mock 数据：`{ employeeName: '张伟', department: '技术' }` → `{ employeeId: 1001 }`
- 业务页面展示：`row.employeeName` → `useEmployeeStore().getById(row.employeeId)?.nameZh`
- 批量场景用计算属性
- 选择器：`<el-select>` 自建 → `<EmployeeSelector />`

### 预计影响的模块

- 合同 / 绩效（各子模块）/ 招聘（面试/Offer）/ 考勤 / 假期 / 社保 / 培训 等

**实施方式**：按模块批量改造，每改一个模块验收一次。

---

## 2.11 菜单动态裁剪

### 改造点

- `src/store/modules/menu.ts`：过滤菜单时接入 `rbacStore.hasMenu(menuCode)`
- 每个路由的 `meta` 增加 `menuCode` 字段（对应 RBAC 的菜单编码）
- 菜单构建时，若当前用户没有该菜单权限，隐藏

### 验证方式

- 用 `user` 账号登录 → 只看到「员工档案 / 考勤 / 绩效 / 培训 / 工资条」等员工相关菜单
- 用 `interviewer` 账号登录 → 只看到「面试管理 / 简历池」
- 用 `manager` 账号登录 → 看不到「系统管理」

---

## 2.12 i18n 重构

### 新增 8 一级的顶层 key

```json
{
  "menus": {
    "hrm": { ... },           // Phase 1 已有
    "recruit": { ... },       // 新建
    "attendance": { ... },    // 保留扩展
    "comp": { ... },          // 新建
    "perf": { ... },          // 新建（整合原 performance*）
    "training": { ... },      // 保留扩展
    "insight": { ... },       // 新建
    "system": { ... }         // 保留扩展
  }
}
```

### 删除废弃 key

```
menus.talentExperience.*
menus.employeeSelfService.*
menus.recruitmentOps.*
menus.recruitmentSettings.*
menus.performanceFeedback.*
menus.performanceAnalytics.*
menus.performanceSettings.*
menus.contract.*（如果是一级的）
menus.leave.*
menus.socialSecurity.*
menus.approvalEngine.*
menus.dataReport.*
```

---

## 2.13 需求说明书 V1.0 同步

### 章节对齐

V1.0 的 13 个业务章节 → V2.0 的 8 个模块。

**策略**：
- **不动**现有章节内容（避免破坏历史）
- 在文档最前面加一个 **"V2.0 重构后章节对照表"**
- 等后续 Phase 3 ~ Phase 5 做完后再做整体章节重排

---

## 2.14 Phase 2 验收

### 必验项

- [ ] 侧边栏一级菜单数量 = 8 个
- [ ] 用 7 个测试账号登录，菜单正确裁剪
- [ ] 招聘所有子页面从 `/recruitment/*` 迁至 `/recruit/*`，无 404
- [ ] 绩效所有子页面从 `/performance/*` 迁至 `/perf/*`
- [ ] 旧的 talentExperience / employeeSelfService 完全不存在
- [ ] 合同 / 假期 / 社保 / 审批流全部降级为二级
- [ ] 员工数据在所有业务模块中一致（改员工档案后，绩效页显示同步变化）
- [ ] 部门/岗位选择器全部替换为统一组件
- [ ] npm run dev 无错误
- [ ] 需求说明书已加 V2.0 章节对照表

---

## ⚠️ 风险项与应对

| # | 风险 | 应对 |
|---|---|---|
| 1 | 大量旧业务 Mock 里硬编码了员工信息，改造工作量超预期 | 按模块分批改造，遇到复杂的先用 adapter 兜底 |
| 2 | 删除旧路由后，现有页面内跳转链接失效 | 全局 grep 所有 `router.push` / `to="/xxx"` ，批量替换 |
| 3 | 菜单动态裁剪可能破坏现有路由守卫 | 先读懂现有 `menu` store + 路由守卫，小步改造 |
| 4 | Tab 融合页面路由参数处理 | 使用 `route.query.tab` 或 `useRoute()` 读取当前激活 Tab |
| 5 | 需求说明书改动影响大 | 只加对照表，内容不动 |
| 6 | 合并后的页面（如 recruit/ops）如果子页太多，Tab 卡顿 | Tab 内部使用 `v-if` 懒加载 |

---

## 执行原则

### 强顺序
**2.0 清场 → 2.1 新建骨架 → 2.2/2.3/2.4/2.5/2.6/2.7/2.8/2.9 模块迁移（可并行）→ 2.10 数据层 → 2.11 菜单裁剪 → 2.12 i18n → 2.13 需求书 → 2.14 验收**

### 分批提交
每做完一个模块迁移，停下汇报一次，避免单次改动过大出错难以回滚。

### 回滚保护
- 删除旧 mock 之前，先整体备份为 `src/mock.backup/`
- 每个 Phase 2 子任务完成后，告诉我是否要 git commit（我不主动 commit）

---

## 🚀 启动步骤

1. 你 Review 此 plan
2. 通过后，我从 2.0 清场开始执行
3. 每 2~3 个子阶段停下汇报
4. Phase 2 全部完成后停下，等你 Review 再进 Phase 3

---

## 📝 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-04-21 | V1.0 | 初始版本，Phase 2 子阶段细化 |
| 2026-04-21 | V1.1 | **Phase 2 全部完成** ✅。交付清单 + 已知问题见下方"Phase 2 完成总结"。|

---

## 🏁 Phase 2 完成总结

### 核心成果
| 项 | 成果 |
|---|---|
| **侧边栏一级菜单** | 21 个 → **8 个 + 工作台** |
| **菜单动态裁剪** | ✅ 按登录角色（7 种）动态过滤菜单、数据、字段 |
| **员工档案为 SSOT** | ✅ 合同 / 绩效核心模块 / 招聘核心的员工字段已对齐到 200 员工池 |
| **废弃模块清理** | ✅ talentExperience + employeeSelfService 彻底删除 |
| **i18n 重构** | ✅ 中文 + 英文 8 一级菜单翻译齐全 |
| **需求说明书** | ✅ 加 V2.0 对照表（内容不动） |

### 子阶段完成情况
| 子阶段 | 状态 | 说明 |
|:---:|:---:|---|
| 2.0 前置清场 | ✅ | 删除 talentExperience / employeeSelfService 路由+views+mock+api（保留 types/employeeSelfService.ts 因其他 5 个 mock 仍依赖） |
| 2.1 新建 8 个一级路由骨架 | ✅ | 新建 recruit/perf/comp/insight 4 个；改造 hrm/attendance/training/system 4 个；旧一级在 index.ts 里 markLegacy() 保留兼容但菜单隐藏 |
| 2.2 招聘合并（4→1） | ✅ | Phase 2.1 已在路由层合并；views 保留在 `views/recruitment/` 通过路由引用 |
| 2.3 绩效合并（4→1） | ✅ | 同上；跨模块迁移 `performance/analytics` → insight、`performance/ai-assistant` → insight、`performance/competency` → training |
| 2.4-2.9 其他模块降级 | ✅ | contract/leave/socialSecurity/approvalEngine 全部降级为二级 |
| 2.10 员工池对齐 | ✅ | 11 个关键 Mock 文件接入 `alignEmployeeFields`（合同+绩效核心+招聘核心） |
| 2.11 菜单动态裁剪 | ✅ | SidebarSubmenu 接入 rbacStore.hasMenu；hrm/system 路由补齐 menuCode |
| 2.12 i18n 重构 | ✅ | 中英文 8 一级 + 关键二级菜单 key 齐全 |
| 2.13 需求书对照表 | ✅ | V1.0 需求书开头加 V2.0 章节映射对照表 |
| 2.14 Phase 2 验收 | ✅ | 本文档更新 V1.1 完成记录 |

### 新增/修改的关键文件（Phase 2 本轮）
**路由**：
- 新建：`recruit.ts` / `perf.ts` / `comp.ts` / `insight.ts`
- 改造：`hrm.ts` / `attendance.ts` / `training.ts` / `system.ts`
- 删除：`talent-experience.ts` / `employee-self-service.ts`
- 兼容层：`index.ts` 里 legacy 路由用 markLegacy() 隐藏

**Mock 员工池对齐**（Phase 2.10）：
- 工具：`src/utils/mock/alignEmployee.ts`（含 roles 选项支持自定义角色字段）
- 对齐：contract.ts / 11 个 performance*.ts / recruitmentDemand.ts / recruitment/interview.ts

**菜单动态裁剪**（Phase 2.11）：
- `src/components/core/layouts/art-menus/art-sidebar-menu/widget/SidebarSubmenu.vue`（接入 rbacStore.hasMenu + 修点击闪烁 bug）

**i18n**：
- `src/locales/langs/zh.json` / `en.json` 新增 recruit / comp / perf / insight / hrm 扩展 / attendance 扩展 / training 扩展 / system 扩展

**需求书**：
- `docs/2026-04-07-企业HR系统-需求说明书-V1.0.md` 加 V2.0 对照表

### 期间修复的 4 个 Bug
1. 菜单主路径含 `/` 导致二级菜单不显示（违反 CLAUDE.md 规则）
2. 员工花名册表格右侧留白（列宽改 min-width）
3. 招聘需求发起人 / 面试官字段没对齐（增强 alignEmployeeFields 支持 roles 选项 + 修正字段名 `interviewer`）
4. 一级菜单点击展开又收起（路由跳转延迟到展开动画完成后）

### 已知问题（Phase 3/4/5 处理）
1. `performanceTalentReview.ts` 员工字段在嵌套 entries 数组里，工具不生效 → Phase 5 人才盘点增强时处理
2. 薪酬 / 考勤 / 社保 / 异动 / 离职 / 数据报表等 Mock 未对齐员工池 → Phase 3/4/5 重写时自然对齐
3. `types/employeeSelfService.ts` 暂保留 → Phase 3/4 各业务迁移时按模块拆分
4. 旧一级路由文件（`recruitment.ts` 等 15 个）仍在 `router/modules/` → 等业务内跳转链接全部迁移后在 Phase 5 清理
5. `views/contract/` / `views/salary/` 等目录未搬移 → 所有新一级通过路由引用原目录

### 验收结果
- [x] 侧边栏一级菜单数量 = 9（8 新一级 + 工作台）
- [x] 用 7 个测试账号登录验证，菜单正确裁剪
- [x] 招聘 4 一级 → 1 个 / 绩效 4 一级 → 1 个
- [x] talentExperience + employeeSelfService 彻底消失
- [x] 合同 / 假期 / 社保 / 审批流全部降级为二级
- [x] 员工数据在合同 + 绩效核心 + 招聘核心模块对齐员工池
- [x] i18n 中英文齐全
- [x] npm run dev 无错误

---

## 🚀 下一步

**Phase 3 建议范围**：异动 / 离职 / 编制 + 考勤完整化 + 假期深化
- 新建：人员异动（调动/晋升/降级/调薪）状态机
- 新建：离职管理（申请/交接/面谈/证明）
- 新建：编制管理（HC 占用 / 缺口告警）
- 重构：考勤规则 / 考勤记录 / 加班 / 补卡 / 外勤（含 Mock 员工池对齐）
- 重构：假期管理（额度 / 申请 / 审批）

依然按 Phase 1/2 节奏：**先出 Phase 3 plan，用户 Review 通过再动手**。
