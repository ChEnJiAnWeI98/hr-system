# HR 系统重构方案 V2.0 · 迁移篇

**文档版本**：V2.0
**撰写日期**：2026-04-21
**配套文档**：`HR系统重构方案-V2.0-架构篇.md` / `HR系统重构方案-V2.0-实施计划.md`

本篇目的：**把当前 21 个一级菜单的每一项都明确去向**，不留任何"说不清怎么处理"的功能。

---

## 📑 目录

1. [迁移总览矩阵](#一迁移总览矩阵)
2. [21 个一级菜单的逐项迁移详情](#二21-个一级菜单的逐项迁移详情)
3. [数据层迁移策略](#三数据层迁移策略)
4. [URL 映射表](#四url-映射表)
5. [组件层复用 & 重构](#五组件层复用--重构)
6. [不迁移（砍掉）清单](#六不迁移砍掉清单)

---

## 一、迁移总览矩阵

### 1.1 处理方式定义

- **🟢 保留**：代码结构基本不变，仅改路径和菜单归属
- **🟡 改造**：结构保留，需要接入新地基（员工档案 / 状态机 / RBAC）
- **🔵 合并**：多个当前页合并为一个新页（侧栏分组或 Tab）
- **🔴 重写**：逻辑基本不变但需要重写代码（主要是接入状态机、字段变化）
- **⚫ 砍掉**：功能删除，不保留

### 1.2 21 个一级菜单处理总览

| # | 当前一级 | 新归属一级 | 处理方式 | 工作量 |
|---|---|---|:---:|:---:|
| 1 | workspace | 工作台（0 级特殊） | 🟡 改造 | 小 |
| 2 | organizationManagement | 01 组织人事 | 🟡 改造 | 中 |
| 3 | employee | 01 组织人事 | 🔴 **重写** | **大** |
| 4 | contract | 01 组织人事（二级） | 🟢 保留 | 小 |
| 5 | attendance | 03 考勤与假期 | 🟡 改造 | 中 |
| 6 | leave | 03 考勤与假期（二级） | 🟢 保留 | 小 |
| 7 | salary | 04 薪酬福利（二级） | 🔴 **重写** | **大** |
| 8 | socialSecurity | 04 薪酬福利（二级） | 🟡 改造 | 中 |
| 9 | performance | 05 绩效管理 | 🟡 改造 | 中 |
| 10 | performanceFeedback | 05 绩效管理（二级） | 🔵 合并 | 中 |
| 11 | performanceAnalytics | **拆**到 05 + 07 | 🔵 拆分 | 中 |
| 12 | performanceSettings | **拆**到 05 + 06 + 07 | 🔵 拆分 | 中 |
| 13 | recruitment | 02 招聘与入职 | 🟡 改造 | 中 |
| 14 | talentExperience | ❌ | ⚫ **砍掉** | 0 |
| 15 | recruitmentOps | 02 招聘与入职（二级+Tab） | 🔵 合并 | 中 |
| 16 | recruitmentSettings | 02 招聘与入职（二级+Tab） | 🔵 合并 | 中 |
| 17 | training | 06 培训与发展 | 🔴 **重写** | **大** |
| 18 | employeeSelfService | ❌（改为角色视图） | ⚫ 砍掉 | 小 |
| 19 | approvalEngine | 08 系统管理（二级） | 🟢 保留 | 小 |
| 20 | dataReport | 07 数据洞察 | 🟡 改造 | 中 |
| 21 | system | 08 系统管理 | 🟡 改造 | 中 |

**总计工作量估算**：保留 4 / 改造 8 / 合并 4 / 重写 3 / 拆分 2 / 砍掉 2 = 23 个处理项（performanceAnalytics/Settings 计两次）

---

## 二、21 个一级菜单的逐项迁移详情

### #1 workspace（工作台）

**当前状态**：独立一级，作为 HR 日常入口

**处理方式**：🟡 **改造**，保留为 0 级特殊菜单（每个系统都有的"首页"）

**具体动作**：
- 路径保持 `/workspace`
- 内容改造：根据登录角色展示不同视图
  - `hr_admin` / `hr_bp`：HR 工作台（待办任务 / 组织动态 / 招聘漏斗 Top 数据）
  - `dept_manager` / `line_manager`：管理者工作台（团队目标进度 / 待审批 / 下属绩效）
  - `employee`：员工工作台（我的任务 / 我的目标 / 待办审批）

**依赖**：角色视图（决策 5）、数据权限（Phase 1）

---

### #2 organizationManagement（组织管理）

**当前状态**：独立一级，有基础的组织树

**处理方式**：🟡 **改造**，迁移到 `01 组织人事 / 组织架构`

**具体动作**：
- 新路径：`/hrm/organization`
- 数据模型扩展（增加字段）：
  - 增加 `orgCode` / `orgShortName` / `costCenter` / `managerId` / `hrbpId`
  - 增加 `headcount`（编制数）/ `startDate` / `endDate`
  - 增加 `nodeType`（集团/事业部/子公司/部门/小组/虚拟）
- 功能增强：
  - 组织迁移（带子组织和员工）
  - 组织演进历史（成立 / 合并 / 拆分 / 撤销事件）
  - 组织负责人指定 + 自动同步

---

### #3 employee（员工）⭐ 重写

**当前状态**：员工列表 + 基础 CRUD，数据与其他模块割裂

**处理方式**：🔴 **完全重写**（这是本次重构的核心）

**具体动作**：
- 新路径：`/hrm/employee`
- 员工数据模型大改（见架构篇 4.3 员工档案字段分组）
- 员工详情页改为 **8 大 Tab**：
  1. 基本信息
  2. 岗位与组织
  3. 合同（引用合同管理数据）
  4. 薪酬（引用薪酬数据，按字段权限显示）
  5. 绩效历史（引用 05 绩效）
  6. 培训记录（引用 06 培训）
  7. 异动历史（引用 01 人员异动）
  8. 关联关系（上级 / 下属 / HRBP / 同部门）
- 员工状态机落地：`待入职 → 试用期 → 正式在职 → 调动中 → 离职中 → 已离职`
- 字段权限：敏感字段（身份证 / 薪酬）按角色可见性
- 批量导入：Excel 导入员工（带字段校验）

**其他模块依赖改造**：
- 所有使用员工数据的页面（绩效、招聘、薪酬、培训等）从"自建员工 Mock" → "读统一员工池"
- 任何员工信息修改只在员工档案一处进行

---

### #4 contract（合同管理）

**当前状态**：独立一级

**处理方式**：🟢 **保留**，降级为 `01 组织人事 / 合同管理` 二级

**具体动作**：
- 新路径：`/hrm/contract`
- 数据引用改造：`employeeName` 等冗余字段改为 `employeeId`，从员工档案动态读取
- 员工档案页的"合同 Tab"展示该员工的所有合同历史
- 续签提醒、到期告警保持

---

### #5 attendance（考勤）

**当前状态**：独立一级，基础打卡记录

**处理方式**：🟡 **改造**

**具体动作**：
- 新路径：`/attendance/record`
- 增加"考勤规则"页（班次 / 考勤组 / 节假日配置）
- 增加"加班管理"页（单独二级）
- 增加"考勤报表"页
- 数据对接：所有考勤记录引用统一员工池

---

### #6 leave（假期）

**当前状态**：独立一级

**处理方式**：🟢 **保留**，降级为 `03 考勤与假期 / 假期管理` 二级

**具体动作**：
- 新路径：`/attendance/leave`
- 与考勤合并后，假期余额与考勤报表联动显示
- 假期类型从字典管理（04 数据字典）读取

---

### #7 salary（薪资）⭐ 重写

**当前状态**：基础的薪资记录

**处理方式**：🔴 **完全重写**，扩展为完整薪酬模块

**具体动作**：
- 拆分为 6 个二级页面（架构篇 04 薪酬福利章节详述）：
  - 薪酬体系（新建）
  - 薪资核算（重写，基于简化公式）
  - 个税管理（新建）
  - 员工工资条（新建）
  - 薪酬报表（新建）
  - 原 salary 的基础功能合并到"薪资核算"
- 简化核算公式：
  ```
  应发 = 基本工资 + 岗位工资 + 绩效工资(S=1.5/A=1.2/B=1.0/C=0.8/D=0.5 × 绩效基数) + 加班费 + 补贴
  扣缴 = 个税(固定累进表) + 社保自缴(5% 简化) + 公积金自缴(12% 简化)
  实发 = 应发 - 扣缴
  ```

---

### #8 socialSecurity（社保）

**当前状态**：独立一级

**处理方式**：🟡 **改造**，降级为 `04 薪酬福利 / 社保公积金` 二级

**具体动作**：
- 新路径：`/comp/social-security`
- 与薪酬核算联动：社保基数参与薪资扣缴计算

---

### #9 performance（绩效管理）

**当前状态**：核心绩效流水线 6 个页面 + 2 个融合 Tab

**处理方式**：🟡 **改造**（保留结构，改路径，接入统一员工池）

**具体动作**：
- 新路径：`/perf/cycle` / `/perf/goal` / `/perf/evaluation` / `/perf/calibration` / `/perf/meeting` / `/perf/archive`
- 员工数据改造：所有 Mock 员工 → 读统一员工池
- 角色视角分层（PhaseC 已有部分）

---

### #10 performanceFeedback（持续反馈）

**当前状态**：3 个二级（1on1 / PIP / 任务中心）

**处理方式**：🔵 **合并**到 `05 绩效管理`

**具体动作**：
- 保留原 3 个页面，迁移路径为：
  - `/perf/feedback`（1on1 + 即时反馈 + 徽章 页内 Tab）
  - `/perf/pip`（独立）
  - `/perf/task`（独立，从"任务中心"重命名）
- C4 徽章管理从 feedback 迁过来（页内 Tab）

---

### #11 performanceAnalytics（绩效数据分析）⚡ 拆分

**当前状态**：2 个二级（分析看板 / 人才盘点）

**处理方式**：🔵 **拆分**

**拆分去向**：
- 分析看板 → `07 数据洞察 / 绩效分析`（`/insight/performance`）
- 人才盘点 → `05 绩效管理 / 人才盘点`（`/perf/talent-review`）

**理由**：
- 分析看板是跨模块分析，归"数据洞察"
- 人才盘点是绩效核心业务动作，归"绩效管理"

---

### #12 performanceSettings（绩效配置）⚡ 拆分

**当前状态**：4 个二级（模板 / 应用规则 / 能力模型 / AI 辅助）

**处理方式**：🔵 **拆分** 到 3 个不同一级

**拆分去向**：
- 评估模板 + 结果应用规则 + 任务中心 → `05 绩效管理 / 绩效配置`（`/perf/settings`）
- 能力模型 → `06 培训与发展 / 能力模型`（`/training/competency`）
- AI 辅助中心 → `07 数据洞察 / AI 辅助中心`（`/insight/ai`）

**理由**：
- 能力模型是"培训与发展"的基础数据，归属错了
- AI 是全系统能力，归"数据洞察"
- 其他是绩效本身的配置，保留

---

### #13 recruitment（招聘管理）

**当前状态**：招聘主流程 6+ 页面

**处理方式**：🟡 **改造**（保留结构，接入统一员工池和组织字典）

**具体动作**：
- 新路径：`/recruit/demand` / `/recruit/job` / `/recruit/resume` / `/recruit/interview` / `/recruit/offer`
- 招聘需求中的部门选择器、岗位选择器全部改用统一组件
- 入职衔接数据对接新的"入职办理"页

---

### #14 talentExperience（候选人体验/门户） ⚫ 砍掉

**当前状态**：候选人官网相关页面

**处理方式**：⚫ **删除所有路由 + 视图文件 + Mock + API**

**删除清单**：
- `src/router/modules/talent-experience.ts`
- `src/views/talent-experience/*`（如果存在）
- 相关 API / Mock（按命名排查）

---

### #15 recruitmentOps（招聘运营）

**当前状态**：4~6 个二级（漏斗 / 效率 / 渠道 ROI / 招聘官画像 / 自动化规则 等）

**处理方式**：🔵 **合并**到 `02 招聘与入职`

**具体动作**：
- 新路径：`/recruit/ops`
- 当前所有 ops 下的子页面，改为该页面的 **页内 Tab**
- 如果 Tab 过多可拆为 2 个二级（运营看板 + 自动化规则）

---

### #16 recruitmentSettings（招聘配置）

**当前状态**：评估表 / 外部集成 / 模板等

**处理方式**：🔵 **合并**到 `02 招聘与入职`

**具体动作**：
- 新路径：`/recruit/settings`
- 所有配置子页改为 **页内 Tab**

---

### #17 training（培训）⭐ 重写

**当前状态**：可能只有基础框架

**处理方式**：🔴 **基本重写**

**具体动作**：
- 6 个二级页面（架构篇 06 详述）：
  - 课程管理（新建）
  - 培训计划（新建）
  - 培训记录（新建）
  - 证书管理（新建）
  - 能力模型（从绩效配置迁入）
  - 继任计划（新建）

---

### #18 employeeSelfService（员工自助） ⚫ 砍掉

**当前状态**：独立一级菜单，员工角色专用

**处理方式**：⚫ **删除独立一级**，改为角色视图切换

**具体动作**：
- 删除 `employee-self-service.ts` 路由
- 员工角色登录后：
  - 工作台默认为"员工工作台"
  - 员工档案菜单只看到自己的档案
  - 考勤菜单只看到自己的考勤
  - 薪酬菜单只看到自己的工资条
  - 绩效菜单只看到自己的绩效档案
  - 培训菜单只看到自己的培训记录
- 技术实现：菜单 + 数据权限自动过滤（RBAC）

---

### #19 approvalEngine（审批引擎）

**当前状态**：独立一级

**处理方式**：🟢 **保留**，降级为 `08 系统管理 / 审批流` 二级

**具体动作**：
- 新路径：`/system/approval`
- 功能不变：流程定义 / 触发条件 / 审批历史

---

### #20 dataReport（数据报表）

**当前状态**：独立一级，含招聘 / 考勤 / 组织 等多个分析报表

**处理方式**：🟡 **改造**，迁移到 `07 数据洞察`

**具体动作**：
- 新路径：`/insight/*`
- 各个报表子页面按领域归属：
  - 招聘报表 → `/insight/recruitment`
  - 考勤报表 → 这是基础报表，移到 `/attendance/report`
  - 组织报表 → `/insight/organization`
- 新增"HR 驾驶舱"（`/insight/dashboard`）作为集团级综合视图

---

### #21 system（系统管理）

**当前状态**：基础的用户 / 角色管理

**处理方式**：🟡 **改造 + 扩展**

**具体动作**：
- 新路径：`/system/*`
- 新增"组织权限（数据权限规则）"页：`/system/data-permission`
- 新增"数据字典"页：`/system/dictionary`
- 新增"消息通知模板"页：`/system/notification`
- 新增"操作日志"页：`/system/log`
- 原"用户 / 角色"强化为完整 RBAC（含字段权限）

---

## 三、数据层迁移策略

### 3.1 统一员工池（核心）

**新建文件**：`src/mock/core/employeePool.ts`

预置 **200 名固定员工**，结构：

| 字段 | 说明 |
|---|---|
| id / employeeNo | 员工 ID / 员工编号 |
| 基本信息 | 姓名/性别/出生/证件号/学历... |
| 岗位信息 | orgId / positionId / jobFamily / level / supervisorId / hrbpId |
| 合同信息 | contractId（引用合同池） |
| 薪酬信息 | baseSalary / positionSalary / perfBase / socialBase |
| 绩效历史 | 历次绩效等级 |
| 培训时长 | 累计 |
| 异动历史 | 入职/转正/调动记录 |
| status | 当前状态（pending_onboard / probation / regular / ...） |

**分布设计（为了演示有代表性）**：
- 8 个组织（集团 1 / 事业部 2 / 子公司 2 / 部门 3）
- 6 个岗位族
- P2~P10 + M1~M3 职级分布
- 状态：195 正式 + 3 试用期 + 2 离职中

### 3.2 字典数据 Mock

**新建目录**：`src/mock/dict/`

按字典分组创建文件：
- `orgType.ts` / `positionFamily.ts` / `positionLevel.ts`
- `empStatus.ts` / `contractType.ts` / `transferType.ts`
- `certificateType.ts` / `educationType.ts` / `maritalStatus.ts` / ...

所有业务 Mock 通过 `@/mock/dict/*` 统一读取选项。

### 3.3 业务 Mock 改造

**原则**：所有业务 Mock 的员工字段从"内嵌数据" → "引用 employeeId"

改造前：
```ts
// 老代码：每个模块自己塞员工信息
const goal = {
  employeeName: '张伟',
  department: '技术研发中心',
  position: '后端工程师',
  // ...
}
```

改造后：
```ts
const goal = {
  employeeId: 1001,  // 只存 ID
  // 展示时通过 useEmployeeStore().getById(1001) 联动读取
}
```

### 3.4 保留的 Mock 文件

原 `src/mock/` 下的文件：
- 🔴 全部删除，按新架构重建
- 保留思路：Mock 策略保留，但数据全部重新生成

### 3.5 创建的新目录结构

```
src/mock/
├── core/                        # 地基数据
│   ├── employeePool.ts          # 200 名员工
│   ├── organizationTree.ts      # 组织树
│   ├── positionMatrix.ts        # 岗位矩阵
│   ├── contractPool.ts          # 合同池
│   └── transferHistory.ts       # 异动历史
│
├── dict/                        # 数据字典
│   ├── basicDict.ts             # 基础字典（教育、婚姻等）
│   ├── empStatus.ts
│   ├── orgType.ts
│   └── ...（20+ 字典）
│
├── recruit/                     # 招聘
├── attendance/                  # 考勤
├── comp/                        # 薪酬
├── perf/                        # 绩效
├── training/                    # 培训
├── insight/                     # 洞察
└── system/                      # 系统
```

---

## 四、URL 映射表

### 旧 → 新 URL 全量映射

由于"决策 10 = A 全部重置"，不做 redirect，但提供对照表便于迁移追踪。

#### 01 组织人事

| 旧 URL | 新 URL |
|---|---|
| `/organization-management/xxx` | `/hrm/organization/xxx` |
| `/employee/xxx` | `/hrm/employee/xxx` |
| `/contract/xxx` | `/hrm/contract/xxx` |
| （新增） | `/hrm/position/xxx` |
| （新增） | `/hrm/transfer/xxx` |
| （新增） | `/hrm/offboarding/xxx` |
| （新增） | `/hrm/headcount/xxx` |

#### 02 招聘与入职

| 旧 URL | 新 URL |
|---|---|
| `/recruitment/demand` | `/recruit/demand` |
| `/recruitment/job` | `/recruit/job` |
| `/recruitment/resume` | `/recruit/resume` |
| `/recruitment/interview` | `/recruit/interview` |
| `/recruitment/offer` | `/recruit/offer` |
| `/recruitment/onboarding` + `onboarding-connection` | `/recruit/onboarding`（合并） |
| `/recruitment-ops/*` | `/recruit/ops`（页内 Tab） |
| `/recruitment-settings/*` | `/recruit/settings`（页内 Tab） |
| `/talent-experience/*` | ❌ 删除 |

#### 03 考勤与假期

| 旧 URL | 新 URL |
|---|---|
| `/attendance/xxx` | `/attendance/record` |
| `/leave/xxx` | `/attendance/leave` |
| （新增） | `/attendance/rule` |
| （新增） | `/attendance/overtime` |
| （新增） | `/attendance/report` |

#### 04 薪酬福利

| 旧 URL | 新 URL |
|---|---|
| `/salary/xxx` | `/comp/payroll`（重写） |
| `/social-security/xxx` | `/comp/social-security` |
| （新增） | `/comp/structure` |
| （新增） | `/comp/tax` |
| （新增） | `/comp/welfare` |
| （新增） | `/comp/payslip` |
| （新增） | `/comp/report` |

#### 05 绩效管理

| 旧 URL | 新 URL |
|---|---|
| `/performance/cycle` | `/perf/cycle` |
| `/performance/goal` | `/perf/goal` |
| `/performance/goal-alignment/x` | `/perf/goal?tab=alignment` |
| `/performance/evaluation` | `/perf/evaluation` |
| `/performance/review-360/x` | `/perf/evaluation?tab=360` |
| `/performance/calibration` | `/perf/calibration` |
| `/performance/meeting` | `/perf/meeting` |
| `/performance/archive` | `/perf/archive` |
| `/performance-feedback/one-on-one` | `/perf/feedback?tab=1on1` |
| `/performance-feedback/pip` | `/perf/pip` |
| `/performance-feedback/tasks` | `/perf/task` |
| `/performance-feedback/appeal` | `/perf/appeal` |
| `/performance-feedback/badges` | `/perf/feedback?tab=badges` |
| `/performance-analytics/dashboard` | `/insight/performance`（跨模块） |
| `/performance-analytics/talent-review` | `/perf/talent-review` |
| `/performance-settings/template` | `/perf/settings?tab=template` |
| `/performance-settings/apply-rules` | `/perf/settings?tab=apply-rules` |
| `/performance-settings/competency` | `/training/competency`（跨模块） |
| `/performance-settings/ai-assistant` | `/insight/ai`（跨模块） |

#### 06 培训与发展

| 旧 URL | 新 URL |
|---|---|
| `/training/xxx` | `/training/course` / `/training/plan` / `/training/record` |
| （从绩效迁入） | `/training/competency` |
| （新增） | `/training/certificate` |
| （新增） | `/training/succession` |

#### 07 数据洞察

| 旧 URL | 新 URL |
|---|---|
| `/data-report/dashboard` | `/insight/dashboard`（重构） |
| `/data-report/recruitment` | `/insight/recruitment` |
| `/data-report/attendance` | `/attendance/report`（移到考勤） |
| （从绩效迁入） | `/insight/performance` |
| （从绩效迁入） | `/insight/ai` |
| （新增） | `/insight/organization` |
| （新增） | `/insight/compensation` |

#### 08 系统管理

| 旧 URL | 新 URL |
|---|---|
| `/system/user` | `/system/user` |
| `/system/role` | `/system/role` |
| `/approval-engine/xxx` | `/system/approval` |
| （新增） | `/system/data-permission` |
| （新增） | `/system/dictionary` |
| （新增） | `/system/notification` |
| （新增） | `/system/log` |

#### 砍掉（无新 URL）

| 旧 URL | 处理 |
|---|---|
| `/talent-experience/*` | ⚫ 删除 |
| `/employee-self-service/*` | ⚫ 删除 |

---

## 五、组件层复用 & 重构

### 5.1 需要新建的通用组件（7 个）

| 组件名 | 位置 | 用途 |
|---|---|---|
| `OrgTreeSelect` | `@/components/core/hr/org-tree-select.vue` | 组织选择器（支持单选/多选/限制层级） |
| `EmployeeSelector` | `@/components/core/hr/employee-selector.vue` | 员工选择器（搜索/分页/按部门筛选/多选） |
| `PositionSelector` | `@/components/core/hr/position-selector.vue` | 岗位选择器（带岗位族-序列-职级级联） |
| `JobFamilyLevelCascader` | `@/components/core/hr/job-family-level.vue` | 岗位族×职级级联 |
| `DictSelector` | `@/components/core/hr/dict-selector.vue` | 通用字典选择器（传 dictCode 即可） |
| `ApprovalFlowTimeline` | `@/components/core/hr/approval-timeline.vue` | 审批流水线（跨模块统一 UI） |
| `DataPermissionFilter` | `@/components/core/hr/data-permission.vue` | 数据权限过滤包裹组件 |

### 5.2 保留的现有组件

| 组件 | 说明 |
|---|---|
| `ModuleTabBar` | 已有，继续用于页内 Tab 切换（招聘 Ops / 绩效 Settings 等） |
| 所有布局组件 | 保持不变（框架一/框架二） |

### 5.3 删除的组件

| 组件 | 原因 |
|---|---|
| `art-fast-enter` | CLAUDE.md 已说明不用 |
| 重复的员工选择器（各模块自建的） | 统一到 `EmployeeSelector` |

### 5.4 组件使用规范（强制）

从重构开始，**任何需要选择组织/员工/岗位的地方，必须用统一组件**，不允许各模块自建 select。

违反规则示例：
```vue
<!-- ❌ 错误：自建员工选择 -->
<el-select v-model="form.employee">
  <el-option v-for="e in hardcodedEmployees" />
</el-select>

<!-- ✅ 正确：用统一组件 -->
<EmployeeSelector v-model="form.employeeId" :org-filter="orgId" />
```

---

## 六、不迁移（砍掉）清单

### 6.1 整体砍掉的模块

| 模块 | 理由 |
|---|---|
| talentExperience | 候选人门户，面向外部用户，原型项目不需要 |
| employeeSelfService | 改为角色视图切换，不需要独立一级 |

### 6.2 砍掉相关文件

| 文件 / 目录 | 操作 |
|---|---|
| `src/router/modules/talent-experience.ts` | 删除 |
| `src/router/modules/employee-self-service.ts` | 删除 |
| `src/views/talent-experience/*` | 删除 |
| `src/views/employee-self-service/*` | 删除 |
| `src/mock/talent-experience.ts`（如有） | 删除 |
| `src/mock/employee-self-service.ts`（如有） | 删除 |
| `src/api/talent-experience.ts`（如有） | 删除 |
| `src/types/talent-experience.ts`（如有） | 删除 |

### 6.3 i18n 清理

删除对应的菜单 key：
- `menus.talentExperience.*`
- `menus.employeeSelfService.*`

### 6.4 检查未注册但存在的文件

从 `router/modules/` 目录还看到：
- `department.ts` - 未在 index.ts 注册，删除
- `exception.ts` - 未注册，看内容决定保留/删除
- `organization.ts` - 已被 `organization-management.ts` 替代，删除
- `position.ts` - 未注册，Phase 1 会新建新版本，删除
- `staffing.ts` - 未注册，看内容决定
- `recruitment.ts` 旧版本 - 检查是否已被新版覆盖

Phase 2 菜单归位时逐一处理。

---

## 七、迁移优先级（与实施计划对应）

| Phase | 迁移动作 | 覆盖项 |
|---|---|---|
| **Phase 1** | 🔴 重写 + 新建地基 | #3 员工重写、#21 system 扩展、所有数据字典新建 |
| **Phase 2** | 🟡 改造 + 🔵 合并 + ⚫ 砍掉 | #1/#2/#4/#9/#10/#13/#15/#16/#19/#20 + #14/#18 砍掉 + #11/#12 拆分 |
| **Phase 3** | 🟡 改造 + 🔴 新建 | #5/#6 考勤假期重构、#17 培训重写 + 能力模型迁入 |
| **Phase 4** | 🔴 重写 | #7/#8 薪酬重写 |
| **Phase 5** | 🟡 改造 | #20 数据洞察强化 + AI 中枢 |

---

**迁移篇完**。下一篇：**实施计划**（5 个 Phase 的详细任务清单）。
