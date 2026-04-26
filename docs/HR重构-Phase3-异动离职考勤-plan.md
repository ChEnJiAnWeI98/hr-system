# HR 系统重构 · Phase 3 · 异动+离职+编制+考勤假期 · 实施计划

**文档版本**：V1.1
**撰写日期**：2026-04-22
**完成日期**：2026-04-22
**状态**：✅ **Phase 3 全部完成**
**对应 Phase**：Phase 3 - 核心人事补齐 + 考勤假期完整化
**前置依赖**：Phase 1 地基 ✅ / Phase 2 菜单归位 ✅
**上游文档**：
- `docs/HR系统重构方案-V2.0-架构篇.md`（第三章 01 组织人事 + 03 考勤与假期）
- `docs/HR系统重构方案-V2.0-实施计划.md`（第四章 Phase 3）

---

## 🎯 Phase 3 目标

**补齐 2 条员工生命周期大流**：**人员异动** + **离职管理** + 支撑它们的**编制管理**；同时**重构考勤/假期/加班**模块，对齐员工池。

---

## ✨ Phase 3 里程碑

当 Phase 3 完成时：

- ✅ 员工档案 Tab 7「异动历史」显示真实数据（调动/晋升/降级/调薪/借调/返聘/离职）
- ✅ 员工档案状态机真正闭环（`待入职 → 试用期 → 正式 → 调动中 → 离职中 → 已离职`）
- ✅ 可以发起完整的异动流程（调动 + 审批 + 生效 + 联动员工档案更新）
- ✅ 可以发起完整的离职流程（申请 + 交接清单 + 面谈 + 离职证明）
- ✅ 编制管理可查看"部门 HC 预算 / 占用 / 缺口"
- ✅ 考勤模块 6 个子页面全部对齐员工池
- ✅ 假期管理 5 个子页面对齐员工池
- ✅ 加班管理成为独立二级（从考勤剥离）
- ✅ 员工档案 Tab 3（合同）展示真实合同历史
- ✅ 所有 Phase 3 模块接入审批引擎

---

## 📊 Phase 3 子阶段

| 子阶段 | 主题 | 关键交付 |
|:---:|---|---|
| 3.0 | 前置准备 | 新建 `types/hrm/transfer.ts` / `offboarding.ts` / `headcount.ts` |
| 3.1 | 人员异动（新建，最核心） | 状态机 + Mock + API + 管理页 + 发起页 + 员工档案 Tab 7 接入 |
| 3.2 | 离职管理（新建） | 状态机 + Mock + API + 列表 + 发起 + 交接清单 + 面谈记录 + 证明生成 |
| 3.3 | 编制管理（新建） | HC 预算 + 占用看板 + 调整申请 + 超编告警 |
| 3.4 | 考勤模块 Mock 重构 | 对齐员工池（attendance/fieldWork/makeupClockIn） |
| 3.5 | 假期模块 Mock 重构 | 对齐员工池（leave 5 个子页） |
| 3.6 | 加班管理增强 | 加班申请 + 审批 + 调休/付费选择 + 统计 |
| 3.7 | 员工档案联动 | Tab 3 合同 + Tab 7 异动历史 接入真实数据 |
| 3.8 | i18n + 验收 | Phase 3 plan 收尾 |

---

## 3.0 前置准备

### 任务

| # | 任务 | 文件 |
|---|---|---|
| 3.0.1 | 异动数据模型 | `src/types/hrm/transfer.ts` |
| 3.0.2 | 离职数据模型 | `src/types/hrm/offboarding.ts` |
| 3.0.3 | 编制数据模型 | `src/types/hrm/headcount.ts` |
| 3.0.4 | 异动 + 离职状态机常量补到 state-machine.ts | `src/types/hrm/state-machine.ts` |

---

## 3.1 人员异动（Phase 3 核心）

### 业务模型

**异动类型**（字典 `TRANSFER_TYPE` Phase 1 已定义）：
- `entry` 入职 / `regularization` 转正 / `transfer` 调动 / `promotion` 晋升 / `demotion` 降级 / `salary_adjust` 调薪 / `renewal` 续签 / `secondment` 借调 / `rehire` 返聘 / `resign` 离职

### 状态机

```
[草稿] ─ 提交 ──→ [一级审批中] ─ 通过 ──→ [二级审批中] ─ 通过 ──→ [待生效] ─ 到期 ──→ [已生效] ─ 联动 ──→ [归档]
             │                        │                         │
             └── 驳回 ──→ [已驳回]     └── 驳回 ──→ [已驳回]      └── 撤销 ──→ [已取消]
```

### 任务清单

| # | 任务 | 文件 | 说明 |
|---|---|---|---|
| 3.1.1 | 异动 Mock 数据 | `src/mock/hrm/transfer.ts` | 30 条历史异动（覆盖 9 种类型，分布在员工池里） |
| 3.1.2 | 异动 API | `src/api/hrm/transfer.ts` | CRUD + 审批 + 生效 |
| 3.1.3 | Store | `src/store/modules/transfer.ts` | 带 `getByEmployee(id)` 方法（档案联动用） |
| 3.1.4 | 人员异动列表页 | `src/views/hrm/transfer/index.vue` | 筛选（类型/状态/发起人/时间）+ 列表 + 发起按钮 |
| 3.1.5 | 发起异动 Dialog | 同上文件内 | 步骤式：选员工 → 选类型 → 填写变更前后 → 选审批人 → 提交 |
| 3.1.6 | 异动详情 Drawer | 同上文件内 | 变更对比 + 审批流水 + 操作（通过/驳回/撤销/生效） |
| 3.1.7 | 异动生效联动员工档案 | transfer store | 生效时调用 `useEmployeeStore().updateEmployee()` 更新岗位/组织/职级/薪酬 |
| 3.1.8 | 员工档案 Tab 7 接入 | `src/views/hrm/employee/detail-transfer.vue`（现在是空壳，新建内容） | 时间线展示该员工所有异动历史 |
| 3.1.9 | 路由注册 | `hrm.ts` 加 `/hrm/transfer` 二级 | 含隐藏子路由 `transfer/create/new` |
| 3.1.10 | i18n + 字典 | 菜单 key + 异动状态字典 | |

### 核心字段

```typescript
export interface EmployeeTransfer {
  id: number
  transferNo: string // TR-20260422-001
  employeeId: number
  employeeName: string
  transferType: TransferType // 字典 TRANSFER_TYPE
  // 变更前
  fromOrgId: number
  fromPositionId: number
  fromLevel: string
  fromSalary?: number
  // 变更后
  toOrgId: number
  toPositionId: number
  toLevel: string
  toSalary?: number
  // 流程
  status: TransferStatus
  effectiveDate: string
  submitTime: string
  submitterId: number
  approvals: TransferApproval[] // 审批流水
  reason: string // 异动原因
  remark?: string
  createTime: string
  updateTime: string
}
```

### 预置 Mock 数据

- 30 条异动，分布在 2024~2026 年
- 9 种类型都有代表（入职 10 / 转正 5 / 调动 4 / 晋升 4 / 调薪 3 / 借调 1 / 返聘 1 / 离职 2）
- 每条绑定员工池里的真实员工

---

## 3.2 离职管理

### 业务模型

**离职类型**（字典 `LEAVE_REASON_TYPE` Phase 1 已定义）：
- `voluntary` 主动离职 / `involuntary` 被动离职 / `negotiated` 协商离职 / `retirement` 退休 / `contract_end` 合同到期 / `terminated_cause` 辞退

### 状态机

```
[员工发起] → [部门负责人审批] → [HR 审批] → [交接中] → [HR 确认交接完成] → [待离职日] → [已离职]
                                                                 │
                                                                 └── [员工撤回/HR 撤销] → [已取消]
```

### 任务清单

| # | 任务 | 文件 |
|---|---|---|
| 3.2.1 | 离职数据模型 | `src/types/hrm/offboarding.ts` |
| 3.2.2 | Mock（15 条历史离职 + 3 条进行中） | `src/mock/hrm/offboarding.ts` |
| 3.2.3 | API | `src/api/hrm/offboarding.ts` |
| 3.2.4 | Store | `src/store/modules/offboarding.ts` |
| 3.2.5 | 离职列表页 | `src/views/hrm/offboarding/index.vue` |
| 3.2.6 | 发起离职 Dialog | 同上 |
| 3.2.7 | 交接清单管理页（子页） | `src/views/hrm/offboarding/handover.vue` |
| 3.2.8 | 离职面谈记录页 | `src/views/hrm/offboarding/interview.vue` |
| 3.2.9 | 离职证明生成预览 | `src/views/hrm/offboarding/certificate.vue` |
| 3.2.10 | 员工档案状态联动 | 离职生效时 `updateStatus('terminated')` |
| 3.2.11 | 路由注册 | `hrm.ts` 加 `/hrm/offboarding` + 子路由 |
| 3.2.12 | i18n | |

### 交接清单设计

每个离职申请带一个交接清单（Checklist）：
- 工作交接（待处理任务 / 项目文档 / 代码权限 / 客户对接）
- 财产归还（工牌 / 电脑 / 移动设备 / 门禁卡）
- 账号权限（邮箱 / 企业微信 / 系统权限清理）
- 财务结算（工资 / 加班费 / 报销 / 违约金）
- 每项状态：未开始 / 进行中 / 已完成 + 负责人

---

## 3.3 编制管理

### 任务清单

| # | 任务 | 文件 |
|---|---|---|
| 3.3.1 | 编制数据模型 | `src/types/hrm/headcount.ts` |
| 3.3.2 | Mock（按 12 个组织节点预置 HC 预算） | `src/mock/hrm/headcount.ts` |
| 3.3.3 | API | `src/api/hrm/headcount.ts` |
| 3.3.4 | 编制总览页（树 + 卡片） | `src/views/hrm/headcount/index.vue` |
| 3.3.5 | 编制调整申请 Dialog | 同上 |
| 3.3.6 | 超编告警 Banner | 同上 |
| 3.3.7 | 路由注册 | `hrm.ts` 加 `/hrm/headcount` |

### 核心字段

```typescript
export interface HeadcountPlan {
  id: number
  orgId: number
  orgName: string
  year: number
  budgetCount: number // 预算人数
  actualCount: number // 实际占用（从员工档案统计）
  pipelineCount: number // 招聘中（从招聘需求池统计）
  gap: number // budgetCount - actualCount - pipelineCount
  status: 'normal' | 'over' | 'warning' // 超编 / 接近上限 / 正常
  lastAdjustTime?: string
}
```

---

## 3.4 考勤模块 Mock 重构

### 范围

3 个考勤 Mock 对齐员工池：
- `mock/attendanceRecord.ts`
- `mock/attendanceRule.ts`（规则 Mock，可能无员工字段）
- `mock/attendanceStatistics.ts`
- `mock/fieldWork.ts`
- `mock/makeupClockIn.ts`

### 改造方式
沿用 Phase 2.10 的 `alignEmployeeFields()` 工具。

---

## 3.5 假期模块 Mock 重构

### 范围

4 个假期 Mock 对齐员工池：
- `mock/leaveApplication.ts`
- `mock/leaveBalance.ts`
- `mock/leaveLedger.ts`
- `mock/leaveQuota.ts`

---

## 3.6 加班管理增强

### 任务

- 加班申请 / 审批（对接审批引擎）
- 调休/付费选择
- 加班统计
- 对齐员工池

### 改造文件
- `mock/overtimeApplication.ts` / `views/attendance/overtime/index.vue`

---

## 3.7 员工档案联动（关键）

让 Phase 1 的空壳 Tab 真正有数据：

| Tab | 内容 | 实现 |
|---|---|---|
| Tab 3 合同 | 该员工的所有合同（从合同 Mock 过滤 employeeId） | 新增 `detail-contract.vue` 内容 |
| Tab 7 异动历史 | 该员工所有异动记录（从异动 Mock 过滤 employeeId）时间线展示 | 新增 `detail-transfer.vue` 内容 |

---

## 3.8 i18n + 验收

### i18n 新增
- `menus.hrm.transfer` / `transferCreate` / `transferDetail`
- `menus.hrm.offboarding` / `offboardingHandover` / `offboardingInterview` / `offboardingCertificate`
- `menus.hrm.headcount` / `headcountAdjust`

### 验收清单
- [ ] 人员异动列表 / 发起 / 审批 / 生效 / 联动员工档案 全流程可用
- [ ] 离职管理 全流程可用（含交接、面谈、证明）
- [ ] 编制管理 可看 HC 占用、做调整
- [ ] 考勤/假期/加班 Mock 全部对齐员工池
- [ ] 员工档案 Tab 3 合同 + Tab 7 异动历史 显示真实数据
- [ ] 用不同账号登录，RBAC 菜单/数据过滤正确
- [ ] npm run dev 无错

---

## ⚠️ 风险项

| # | 风险 | 应对 |
|---|---|---|
| 1 | 异动生效联动员工档案，如果 store 反应不及时，档案显示可能滞后 | 用 `useEmployeeStore().updateEmployee()` 同步更新，用 computed 保证响应式 |
| 2 | 离职证明生成涉及 Word/PDF 导出，原型用 HTML 预览即可 | 用 el-dialog 模拟预览，不做真实导出 |
| 3 | 编制数据实时性：实际占用从员工档案统计，可能性能差 | 用 computed 计算一次，不频繁重算 |
| 4 | 审批流接入：新建异动/离职要创建审批实例 | 原型里做轻量 Mock 审批（直接操作 approvals 数组），不对接真实 approval-engine 逻辑 |
| 5 | 旧 mock 文件字段名和员工池字段名差异 | 复用 Phase 2.10 的 `alignEmployeeFields` + `roles` 选项 |

---

## 📋 执行原则

### 强顺序
**3.0 → 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 → 3.8**
（3.1 异动是核心，3.7 档案联动必须等异动/离职做完）

### 分批汇报
- 每个子阶段完成后停下汇报
- 3.1 异动完成后建议先让用户验证（Phase 3 的核心能力）

### 复用 Phase 1/2 成果
- 员工选择器 `EmployeeSelector`
- 组织树 `OrgTreeSelect`
- 岗位选择器 `PositionSelector`
- 字典选择器 `DictSelector`
- 员工池对齐工具 `alignEmployeeFields`
- 状态机常量模式（参考 `state-machine.ts` 的员工状态机）

### 代码规范
- 继续遵循 CLAUDE.md 的所有规范
- 二级菜单 path 不含 `/`（用 `-` 代替）
- 属性值避免内嵌半角双引号

---

## 📝 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-04-22 | V1.0 | 初始版本 |
| 2026-04-22 | V1.1 | **Phase 3 全部完成** ✅。下方"完成总结"。|

---

## 🏁 Phase 3 完成总结

### 核心交付
| 子阶段 | 状态 | 亮点 |
|:---:|:---:|---|
| 3.0 前置准备 | ✅ | transfer / offboarding / headcount 3 个 types + 状态机常量补齐 |
| 3.1 人员异动 ⭐ | ✅ | 7 种类型（对齐 SAP/Workday/北森，删除 entry/rehire/resign 放到正确模块）+ 9 态状态机 + 2 级审批 + **生效联动员工档案** |
| 3.2 离职管理 | ✅ | 6 种类型 + 9 态状态机 + 12 项 4 类交接清单 + 面谈记录 + 离职证明 HTML 预览 + **完成联动档案状态** |
| 3.3 编制管理 | ✅ | 12 组织 × HC 预算 + 实际占用动态统计 + 超编告警 + 调整审批 |
| 3.4-3.6 考勤假期加班 Mock 对齐 | ✅ | 9 个 Mock 文件批量接入员工池（attendance/leave/overtime/fieldwork/makeup 系列） |
| 3.7 员工档案 Tab 联动 | ✅ | Tab 3 合同展示真实合同历史；Tab 7 异动历史时间线（入职+异动+离职合并） |
| 3.8 i18n + 验收 | ✅ | 本文档收尾 |

### 期间修复的重要业务错误
- **Phase 3.1 异动类型设计失误**：最初放了 `entry / rehire / resign`，经用户质疑后深度对齐 SAP / Workday / 北森做法：
  - 入职（entry）→ 由【招聘入职办理】模块自动创建档案
  - 返聘（rehire）→ 由【招聘入职办理】标记"返聘入职"处理
  - 离职（resign）→ 由【离职管理】专门处理
- 异动类型从 10 种精简为 **7 种**（仅针对"已在职员工"变动）

### 关键联动验证点
1. **异动生效 → 员工档案更新**：点生效后档案的岗位/组织/职级/薪酬同步变化 ✅
2. **离职完成 → 员工档案变"已离职"**：completeOffboardingApi + empStore.updateEmployee ✅
3. **编制实际占用 → 动态统计**：enrichedPlans 的 actualCount 从 empStore.getByOrg 实时计算 ✅
4. **员工档案 Tab 7 合并入职+异动+离职时间线**：mergedHistory computed 按时间倒序合并 ✅

### 新建文件清单
**types**（3）：
- `src/types/hrm/transfer.ts`
- `src/types/hrm/offboarding.ts`
- `src/types/hrm/headcount.ts`
- 扩展：`src/types/hrm/state-machine.ts`（+ TRANSFER + OFFBOARDING 状态机）

**mock**（3）：
- `src/mock/hrm/transfer.ts`（18 条）
- `src/mock/hrm/offboarding.ts`（18 条）
- `src/mock/hrm/headcount.ts`（12 计划 + 3 调整）

**api**（3）：
- `src/api/hrm/transfer.ts`
- `src/api/hrm/offboarding.ts`
- `src/api/hrm/headcount.ts`

**views**（3）：
- `src/views/hrm/transfer/index.vue`
- `src/views/hrm/offboarding/index.vue`
- `src/views/hrm/headcount/index.vue`

**辅助**：
- `contract.ts` 新增 `getContractsByEmployeeMock()` 辅助函数
- 9 个考勤假期加班 Mock 接入 alignEmployeeFields

**路由 + i18n**：
- `hrm.ts` 新增 3 个二级路由（transfer / offboarding / headcount）
- i18n 中英文新增 3 个菜单 key

### 已知限制（Phase 4/5 处理）
1. 编制的 `pipelineCount`（招聘中占用）目前固定 0，等 Phase 5 绩效/招聘数据联动时从招聘需求池统计
2. 异动 / 离职未对接真实 approval-engine，内置简化审批流水（按 V2.0 plan 确认的范围）
3. 离职证明只做 HTML 预览，无 PDF/Word 导出（V2.0 plan 已确认）
4. 返聘入职流程在招聘入职办理里的实现等 Phase 5

---

## 🚀 整体进度

| Phase | 主题 | 状态 |
|:---:|---|:---:|
| Phase 1 | 地基（字典/组织/岗位/员工/RBAC） | ✅ |
| Phase 2 | 菜单归位 + 已有模块迁移 | ✅ |
| Phase 3 | 异动 + 离职 + 编制 + 考勤假期对齐 | ✅ |
| Phase 4 | 薪酬完整闭环 + 培训管理 + 能力评估 | ⏳ 待启动 |
| Phase 5 | 数据洞察 + AI 中枢 + 系统管理完善 | ⏳ |
