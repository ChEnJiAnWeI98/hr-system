# HR 系统重构 · Phase 4 · 薪酬福利 + 培训与发展 · 实施计划

**文档版本**：V1.0
**撰写日期**：2026-04-22
**对应 Phase**：Phase 4 - 薪酬完整闭环 + 培训管理 + 能力评估 + 继任计划
**前置依赖**：Phase 1 ✅ / Phase 2 ✅ / Phase 3 ✅
**上游文档**：
- `docs/HR系统重构方案-V2.0-架构篇.md`（第三章 04 薪酬福利 + 06 培训与发展）
- `docs/HR系统重构方案-V2.0-实施计划.md`（第五章 Phase 4）
- V2.0 决策：**6=B 简化核算** / **8=A 管理型培训**

---

## 🎯 Phase 4 目标

**两大模块重写 + 扩展**：
1. **薪酬完整闭环**（04 薪酬福利）：薪酬体系 → 薪资核算 → 工资条 → 个税 → 社保 → 福利 → 报表
2. **培训与发展扩展**（06 培训与发展）：课程 / 计划 / 记录 / 证书 / 能力评估（扩展 Phase C1a）/ 继任计划

---

## ✨ Phase 4 里程碑

- ✅ 薪酬 7 个二级页面全部可用（体系/核算/工资条/个税/社保/福利/报表）
- ✅ 简化核算公式跑通：输入员工 + 周期 → 自动计算应发/扣缴/实发
- ✅ 员工档案 Tab 4「薪酬」接入真实数据（HR 可见，员工仅本人可见）
- ✅ 培训 6 个二级页面完整（课程/计划/记录/证书/能力/继任）
- ✅ 员工档案 Tab 6「培训记录」接入真实数据
- ✅ 能力模型（Phase C1a 已建）扩展"给员工打分"功能 → 雷达图真实数据
- ✅ 继任计划对接 9-box 人才盘点（Phase C1b 已建）
- ✅ 薪酬字段权限：非 HR 角色不可见

---

## 📊 Phase 4 子阶段

| 子阶段 | 主题 | 子任务 |
|:---:|---|:---:|
| 4.0 | 前置准备 | 薪酬 types + 培训 types + 字典扩展 |
| 4.1 | 薪酬体系（带宽） | 按岗位族 × 职级定义薪资区间 |
| 4.2 | 薪资核算（简化版） | 核算批次 + 公式 + 审批 + 下发 |
| 4.3 | 个税管理 | 累进税率表 + 专项附加扣除 |
| 4.4 | 社保公积金（重构） | 方案 + 参保 + 缴费明细（Mock 对齐员工池） |
| 4.5 | 福利管理（新建） | 福利项 + 发放记录 |
| 4.6 | 员工工资条（角色视图） | 员工只看自己 + 历史 + 年度汇总 |
| 4.7 | 薪酬报表 | 人力成本 + 部门成本 + 岗位薪酬分位 |
| 4.8 | 培训课程管理 | 课程 CRUD + 分类 + 讲师 |
| 4.9 | 培训计划 + 记录 + 证书 | 计划 + 报名 + 签到 + 结业 + 证书 |
| 4.10 | 能力评估（扩展 C1a） | 给员工按能力打分 + 雷达图真实数据 |
| 4.11 | 继任计划 | 关键岗位 + 梯队 + 对接 9-box |
| 4.12 | 员工档案 Tab 联动 | Tab 4 薪酬 + Tab 6 培训 接入真实 |
| **4.x** | **新旧页面 Diff 审查** ⭐⭐⭐ | **逐页对比新旧功能，合并/废弃旧页面**（见 4.x 章节） |
| 4.13 | i18n + 验收 | 文档收尾 |

---

## 4.0 前置准备

### 任务
| # | 任务 | 文件 |
|---|---|---|
| 4.0.1 | 薪酬体系 types | `src/types/comp/structure.ts`（薪酬带宽） |
| 4.0.2 | 薪资核算 types | `src/types/comp/payroll.ts` |
| 4.0.3 | 个税/社保/福利 types | `src/types/comp/tax.ts` / `social.ts` / `welfare.ts` |
| 4.0.4 | 培训 types | `src/types/training/course.ts` / `plan.ts` / `record.ts` / `certificate.ts` / `succession.ts` |
| 4.0.5 | 字典扩展 | 课程分类 / 证书类型 / 薪酬项 / 福利类型 |

---

## 4.1 薪酬体系（薪酬带宽）

### 任务
- 薪酬带宽数据模型（岗位族 × 职级 × { min / mid / max }）
- Mock：6 岗位族 × 9 职级 × 3 档（共 ~162 个带宽区间）
- 矩阵可视化管理页
- 员工薪酬落点分析（当前薪资在带宽里的分位）
- 调薪规则配置（年度 / 晋升 / 特批）

### 核心字段
```typescript
export interface SalaryBand {
  id: number
  jobFamily: string   // 字典 JOB_FAMILY
  level: string       // P1~P10 / M1~M5
  minSalary: number   // 带宽下限
  midSalary: number   // 中位
  maxSalary: number   // 带宽上限
  year: number        // 生效年度
}
```

---

## 4.2 薪资核算（Phase 4 核心）

### 任务
- 核算批次 CRUD（按月 × 组织）
- 核算执行（一键生成批次下所有员工工资单）
- **简化核算公式**：见下
- 核算审批（HRBP → HRD 双确认）
- 工资条下发（到员工"我的工资条"）

### 简化核算公式（V2.0 决策 6=B）
```
应发 = 基本工资 + 岗位工资 + 绩效工资 + 加班费 + 餐补 + 交通补贴
    绩效工资 = 绩效基数 × 绩效系数
        S = 1.5, A = 1.2, B = 1.0, C = 0.8, D = 0.5
    加班费 = 工作日 1.5 倍 / 周末 2 倍 / 节假日 3 倍（简化固定）

扣缴 = 个税 + 社保自缴 + 公积金自缴
    个税：按简化累进表（阶梯 3K/5K/10K/20K/...）
    社保自缴 = 社保基数 × 10.5%（养老 8% + 医疗 2% + 失业 0.5%）
    公积金自缴 = 社保基数 × 12%

实发 = 应发 - 扣缴
```

### 核心字段
```typescript
export interface PayrollBatch {
  id: number
  batchNo: string        // PR202604
  period: string         // 2026-04
  orgIds: number[]       // 适用组织
  status: 'draft' | 'calculating' | 'reviewing' | 'approved' | 'released'
  totalEmployees: number
  totalAmount: number    // 实发总额
  createTime: string
}

export interface PayrollRecord {
  id: number
  batchId: number
  employeeId: number
  period: string
  items: PayrollItem[]     // 薪资项明细
  grossAmount: number      // 应发
  deductionAmount: number  // 扣缴
  netAmount: number        // 实发
  performanceGrade?: 'S' | 'A' | 'B' | 'C' | 'D'  // 从绩效档案读取
}
```

---

## 4.3 个税管理

### 任务
- 个税累进税率表配置（预置固定 7 级）
- 员工专项附加扣除登记（子女教育 / 住房贷款 / 赡养老人 / 继续教育 等 6 项）
- 年度个税汇算清缴（简化展示）

---

## 4.4 社保公积金（重构）

### 任务
**沿用 Phase 2.1 已有的 7 个子页面结构**，不重建，只：
- Mock 对齐员工池（alignEmployeeFields）
- 接入 useEmployeeStore 展示员工数据
- 社保方案按地区（北京/上海/深圳/杭州）预置简化比例

---

## 4.5 福利管理（新建）

### 任务
- 福利项配置（节日 / 生日 / 体检 / 旅游 / 商业保险 / 团建 7 类）
- 福利发放记录
- 员工福利查询（角色视图：员工看自己）

---

## 4.6 员工工资条（角色视图）

### 任务
- 员工角色登录后 → `/comp/payslip` 默认只看自己
- HR 角色 → 可切换员工查看
- 历史工资条列表（按月）
- 工资条详情弹窗（应发/扣缴/实发逐项展示 + 税前税后）
- 年度汇总（个税 + 社保 + 公积金 + 实发合计）

---

## 4.7 薪酬报表

### 任务
- 月度人力成本（部门 × 月）
- 部门成本分析（总额 + 人均 + 环比）
- 岗位薪酬分位（P25 / P50 / P75 + 当前员工落点）
- 调薪趋势（近 12 月调薪人数 + 涨幅）

---

## 4.8-4.9 培训模块（课程 + 计划 + 记录 + 证书）

### 课程管理
- 课程 CRUD（含分类 / 讲师 / 时长 / 价格 / 上下架）
- 预置 20 门课程覆盖：新员工入职 / 通用技能 / 岗位技能 / 管理课程 / 合规培训

### 培训计划
- 创建计划（关联课程 + 指定学员或范围 + 时间地点）
- 学员报名 + HR 审批
- 签到记录
- 结业评估

### 培训记录
- 个人培训时长累计
- 部门培训率统计
- 结业率 / 出勤率

### 证书管理
- 证书类型配置（职业资格 / 岗位认证 / 外部证书）
- 证书颁发（关联培训结业）
- 有效期提醒（到期 30 天前告警）

---

## 4.10 能力评估（扩展 Phase C1a 能力模型）

### 现状
Phase C1a 已建能力模型字典（62 个岗位 × 5 级 L1~L5 行为化描述），但**没有给员工打分的流程**。Phase 4.10 补齐。

### 任务
- 能力评估发起（由直属上级 + HRBP 对员工打分）
- 员工自评
- 能力雷达图真实数据（替换之前的 demo 占位）
- 能力缺口识别（实际 vs 期望）
- 成长建议（自动匹配培训课程）

---

## 4.11 继任计划

### 任务
- 关键岗位标识（M1 以上 + 技术专家 P8+）
- 每个关键岗位指定 **1~3 位候选继任者**（从 9-box "核心骨干"和"明日之星"中选）
- 继任准备度：就绪（0-1 年）/ 培养中（1-3 年）/ 长期（3-5 年）
- 继任计划与人才盘点 9-box 联动：`高潜新星` 和 `明日之星` 自动进入候选池
- 个人发展计划（IDP）—— 简化版，只做展示

---

## 4.x 新旧页面 Diff 审查（⭐ 重要，Phase 4 收尾插入）

**由来**：V2.0 重构至 Phase 4，新建了大量页面（薪酬/培训等），但旧 views（`/salary/*` / `/employee/*` / `/organization-management/*` 等）通过 `legacy` 机制仍保留。存在新旧功能重叠、业务逻辑差异、旧页面遗漏业务点等盲点。

### 审查范围

| 重叠对 | 新页面 | 旧 legacy 页面 |
|---|---|---|
| 薪资核算 | `/comp/payroll` | `/salary/calculation` |
| 工资条 | `/comp/payslip` | `/salary/payslip` |
| 个税 | `/comp/tax` | `/salary/tax` |
| 薪酬体系 | `/comp/structure` | `/salary/structure` |
| 调薪管理 | (暂无) | `/salary/adjustment` |
| 员工管理 | `/hrm/employee` | `/employee/*`（多页） |
| 组织管理 | `/hrm/organization` | `/organization-management/*`（多页） |

### 审查流程（每个重叠对）

1. **功能清单**：列出新/旧页面各自的功能点
2. **差异识别**：
   - 新页面缺了什么？（例：旧薪资考虑了出差补贴，新的没做）
   - 旧页面有哪些过时逻辑？（例：字段命名 `deptId` vs 新 `orgId`）
3. **决策**：
   - **合并**：把旧页面独有的合理业务点补到新页面
   - **废弃**：确认旧页面无补充价值 → 删除 view + mock + api + legacy 路由
4. **清理**：
   - 从 `router/modules/index.ts` 移除 legacy 注册
   - 删除 `views/salary/` 等旧 view 目录
   - 删除旧 mock / api
   - 清理 i18n 旧 key

### 产出

1. 《废弃页面清单》记录在本 plan 末尾
2. 清理后 `src/mock/` / `src/views/` 目录干净
3. 侧边栏菜单 = 最终 8 个一级 +（保留工作台）

### 工作量

预估 **2~3 天**，作为 Phase 4 收尾任务。

---

## 4.x.附 跨模块数据一致性遗留问题（Phase 4.13 发现）

### 背景

Phase 4.13 验收期间，用户在员工档案 Tab 7 异动历史发现"周斌"既离职又调动的矛盾，根因定位到 `alignEmployeeFields` 工具按 index 对齐员工，多个 mock 抢同一批员工，且未与员工池 status 联动校验。

**已在本 Phase 修复**：
- ✅ `mock/hrm/transfer.ts` + `mock/hrm/offboarding.ts` + `mock/core/employeePool.ts`
- 加了 status filter，扩展 STATUS_DIST 引入 `terminated`（15 人）

### 待 Diff 审查阶段处理的同类矛盾

**判定原则**：每条都先验证"对应的页面真实存在 + 矛盾会被用户在 UI 上看到"，避免做无效修复。

| # | 数据矛盾 | 涉及 mock | 暴露页面（已确认存在） | 优先级 | 修复策略 |
|---|---|---|---|---|---|
| 1 | 已离职员工有 2026 绩效档案 | `performanceArchive` | `/perf/archive` + 员工档案 Tab 5 | 🔴 高 | mock 加 filter 排除 status='terminated'，或档案截止到离职日期前 |
| 2 | 已离职员工出现在 2026 培训计划报名名单 | `training/plan`（enrolledEmployees 字段） | `/training/plan` 详情 Drawer + 员工档案 Tab 6 | 🔴 高 | plan.ts 的 pickByFamily/pickAll 加 filter |
| 3 | 已离职员工还有 2026 工资条 | `comp/payroll`（按需生成） | `/comp/payslip` + 员工档案 Tab 4 | 🔴 高 | generateBatchRecords 时排除 terminated |
| 4 | 已离职员工出现在福利发放对象 | `comp/welfare` | `/comp/welfare` | 🟡 中 | 福利对象解析时过滤 |
| 5 | 已离职员工有 2026 考勤打卡记录 | `attendanceRecord` | `/attendance/record` | 🟡 中 | mock 生成时过滤 |
| 6 | 已离职员工有加班/请假/出差/补卡 | `overtime` `leaveApplication` `fieldWork` `makeupClockIn` | `/attendance/*` 5 个子页 | 🟡 中 | 同上 |
| 7 | 已离职员工还在缴社保/公积金 | `employeeInsurance` `providentFund` | `/comp/employee-insurance`（需先确认路径）+ `/comp/provident-fund` | 🟡 中 | 先确认页面存在再修 |
| 8 | 已离职员工出现在能力评估/证书/继任候选 | `training/assessment` `training/certificate` `training/succession` | `/training/assessment` `/training/certificate` `/training/succession` | 🟡 中 | mock 加 filter |
| 9 | 已离职员工被挂在 PIP / 360 评估 / 校准 / 1-on-1 / 目标 | `performancePIP` `performance360` `performanceCalibration` `performanceOneOnOne` `performanceGoal` | `/perf/pip` `/perf/review-360` `/perf/calibration` `/perf/one-on-one` `/perf/goal` | 🟡 中 | 同上 |
| 10 | 已离职员工合同显示"履约中" | `contract` | `/hrm/contract`（需确认路径） | 🟡 中 | 联动 status='terminated' → contract.status='terminated' |

### 审查检查清单

每条数据矛盾在 Diff 审查阶段需走完：
1. **页面存在性核实**：grep 路由配置，确认 menuCode 已注册
2. **运行时验证**：登录系统，按 status='terminated' 的员工（如何晓兰 YG20200194）逐页核对
3. **批量修复**：可以共享一个工具函数 `excludeTerminated(records)`，统一在 mock 层加 filter
4. **回归测试**：修复后用 Tab 7 异动历史 + 各业务页面交叉验证

### 工具优化建议

`src/utils/mock/alignEmployee.ts` 现有 `filter` 选项已支持，但仍按数组 index 对齐。建议在 Diff 审查阶段：
- 加 `excludeIds` 参数（避免和其他 mock 抢同一员工）
- 或引入"员工分配协调器"统一记账

## 4.12 员工档案 Tab 联动

### 任务
- **Tab 4 薪酬**：展示该员工
  - 当前薪酬结构（基本 + 岗位 + 绩效基数 + 社保基数）
  - 历史调薪记录（从异动模块 `salary_adjust` 类型读取）
  - 近 6 个月工资条（从 payroll 读取）
  - **非 HR 角色整个 Tab 不渲染**
- **Tab 6 培训记录**：
  - 个人累计培训时长
  - 参加过的课程列表
  - 持有证书
  - 能力评估分（雷达图）

---

## 4.13 i18n + 验收

### i18n 新增
- comp: `structure` / `payroll` / `tax` / `welfare` / `report` 相关 key
- training: `course` / `plan` / `record` / `certificate` / `succession` / `competencyEval` 相关 key

### 验收清单
- [ ] 薪酬 7 个二级页面可用，简化核算公式跑通
- [ ] 员工档案 Tab 4 薪酬显示真实数据，RBAC 字段权限生效
- [ ] 员工档案 Tab 6 培训记录显示真实数据
- [ ] 培训 6 个二级页面齐全
- [ ] 能力模型扩展为可评分 + 雷达图真实化
- [ ] 继任计划对接 9-box
- [ ] 薪酬字段对非 HR 角色整列隐藏
- [ ] 用 `user` 账号登录工资条，只看到自己
- [ ] npm run dev 无错

---

## ⚠️ 风险项

| # | 风险 | 应对 |
|---|---|---|
| 1 | 简化核算公式在极端数据下可能算出负数 | 对每一项做兜底（min 0）+ 前端 validation |
| 2 | 员工池里没有"绩效等级"字段，核算公式里的绩效系数怎么取？ | 从绩效档案 Mock（Phase A/B 已做）读取；无记录的员工默认 B（系数 1.0） |
| 3 | 培训计划关联学员，学员数量可能很多 | 用 EmployeeSelector 多选 + 批量，不自建 |
| 4 | 能力评估需要直属上级录入，流程较长 | 原型里简化：一键生成"模拟评估数据"便于演示 |
| 5 | 继任候选池需要 9-box 数据，Phase C1b 嵌套数组工具不生效 | 直接从盘点 entries 读，不依赖 alignEmployeeFields |
| 6 | 薪酬 Mock 数据量大（200 员工 × 12 月 = 2400 条） | 按需生成：每次访问批次才生成，不预存所有历史 |

---

## 📋 执行原则

### 强顺序
**4.0 → 4.1 → 4.2（核心）→ 4.3/4.4/4.5（薪酬扩展）→ 4.6 → 4.7 → 4.8/4.9/4.10/4.11（培训）→ 4.12 → 4.13**

### 关键里程碑
- **4.2 完成后停下汇报**（核心，用户验证核算跑通）
- **4.9 完成后停下汇报**（培训主干完成）
- **4.12 完成后停下汇报**（档案联动，验证闭环）

### 复用
- `alignEmployeeFields`（Phase 2.10）
- 员工选择器 / 组织树 / 岗位选择器 / 字典选择器
- 状态机常量模式（参考 Phase 3）
- RBAC 字段权限指令 `v-field-permission`

---

## 📝 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-04-22 | V1.0 | 初始版本 |
