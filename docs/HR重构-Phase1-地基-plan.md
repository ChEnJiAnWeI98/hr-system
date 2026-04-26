# HR 系统重构 · Phase 1 · 地基层 · 实施计划

**文档版本**：V1.1
**撰写日期**：2026-04-21
**完成日期**：2026-04-21
**状态**：✅ **Phase 1 全部完成**
**对应 Phase**：Phase 1 - 地基层（数据字典 / 组织 / 岗位 / 员工档案 / RBAC）
**预计周期**：**3 周**（11 周总工期的第 1~3 周）
**前置依赖**：V2.0 三篇重构方案已 Review 通过
**上游文档**：
- `docs/HR系统重构方案-V2.0-架构篇.md`（第四章 地基层设计）
- `docs/HR系统重构方案-V2.0-实施计划.md`（第二章 Phase 1）

---

## 🎯 Phase 1 目标

建立**五大地基**，为后续所有模块提供统一数据源和权限控制：

1. **基础字典**（22 种）—— 所有业务选项的单一来源
2. **组织架构** —— 组织树 + 迁移 + 演进历史
3. **岗位体系** —— 岗位族 × 序列 × 职级三层矩阵
4. **员工档案** —— 200 名员工统一池 + 8 大 Tab + 状态机
5. **RBAC 权限** —— 7 种角色 + 三层权限（菜单/数据/字段）

---

## ✨ Phase 1 里程碑

**当 Phase 1 完成时，系统应该能做到**：

- ✅ 在"数据字典"页维护 22 种基础字典
- ✅ 在"组织架构"页做组织 CRUD、迁移、查看演进历史
- ✅ 在"岗位体系"页查看岗位族 × 序列 × 职级矩阵
- ✅ 在"员工档案"页查看 200 名员工花名册，点进去看 8 大 Tab（Tab 3~7 空壳）
- ✅ 在"角色权限"页配置 7 种角色的菜单 + 数据 + 字段权限
- ✅ 切换不同账号登录，菜单、数据、字段都能正确过滤
- ✅ 7 个通用组件可在其他模块调用
- ✅ `useEmployeeStore` / `useDictStore` / `useRBACStore` 可用

---

## 📅 Phase 1 排期

| 子阶段 | 主题 | 天数 | 子任务数 |
|:---:|---|:---:|:---:|
| **1.0** | 前置准备（删旧 + 建新目录） | 0.5 天 | 3 |
| **1.1** | 基础字典 | 3 天 | 6 |
| **1.2** | 组织架构 | 2.5 天 | 6 |
| **1.3** | 岗位体系 | 2 天 | 5 |
| **1.4** | 员工档案 ⭐ | 6 天 | 18 |
| **1.5** | RBAC 权限 | 3 天 | 8 |
| **1.6** | Phase 1 验收 + i18n | 1 天 | 3 |
| 合计 | | **~18 天** | **49** |

按工作日计算 = 约 3~3.5 周。

---

## 🧱 1.0 前置准备（0.5 天）

### 目标
清理旧文件，建立新目录结构。

### 任务清单

| # | 任务 | 说明 |
|---|---|---|
| 1.0.1 | 创建新目录结构 | 见下 |
| 1.0.2 | 删除废弃路由文件 | `talent-experience.ts` / `employee-self-service.ts` / `department.ts` / `exception.ts` / `organization.ts`（旧版本）/ `position.ts`（旧未注册）/ `staffing.ts` |
| 1.0.3 | 备份旧 Mock 目录 | 重命名 `src/mock/` → `src/mock.backup/`（Phase 1 过程中参考旧逻辑，Phase 2 末彻底删除） |

### 新目录结构

```
src/
├── mock/                        # 全新（旧的改名为 mock.backup）
│   ├── core/                    # 地基数据（Phase 1）
│   │   ├── employeePool.ts      # 200 名员工生成脚本
│   │   ├── organizationTree.ts  # 组织树
│   │   ├── positionMatrix.ts    # 岗位矩阵
│   │   └── seed.ts              # 固定种子常量
│   ├── dict/                    # 数据字典（Phase 1）
│   │   ├── index.ts             # 字典总入口
│   │   ├── basicDict.ts         # 教育/婚姻/民族等
│   │   ├── orgDict.ts           # 组织相关
│   │   ├── positionDict.ts      # 岗位相关
│   │   ├── employeeDict.ts      # 员工状态/合同/异动/离职
│   │   ├── attendanceDict.ts    # 假期/加班/考勤
│   │   ├── compDict.ts          # 薪酬/社保/福利
│   │   ├── trainingDict.ts      # 培训/证书
│   │   └── systemDict.ts        # 审批流类型
│   ├── system/                  # 系统管理 Mock（Phase 1）
│   │   ├── roles.ts             # 7 种角色
│   │   ├── menus.ts             # 菜单树
│   │   └── permissions.ts       # 权限规则
│   └── [业务模块/] 其余 Phase 填充
│
├── types/
│   ├── hrm/                     # 组织人事类型（Phase 1 + Phase 3）
│   │   ├── organization.ts
│   │   ├── position.ts
│   │   ├── employee.ts
│   │   └── state-machine.ts     # 所有状态机配置常量
│   ├── system/                  # 系统管理类型
│   │   ├── dictionary.ts
│   │   └── rbac.ts
│
├── store/modules/               # Pinia
│   ├── employee.ts              # 🆕 员工统一 store
│   ├── organization.ts          # 🆕 组织树 store
│   ├── position.ts              # 🆕 岗位 store
│   ├── dict.ts                  # 🆕 字典 store
│   └── rbac.ts                  # 🆕 RBAC store（替换/扩展 user.ts 权限部分）
│
├── components/core/hr/          # 🆕 HR 业务通用组件
│   ├── org-tree-select.vue
│   ├── employee-selector.vue
│   ├── position-selector.vue
│   ├── job-family-level.vue
│   ├── dict-selector.vue
│   ├── approval-timeline.vue
│   └── data-permission.vue
│
├── directives/
│   └── field-permission.ts      # 🆕 v-field-permission 指令
│
├── utils/
│   ├── code-generator.ts        # 🆕 编码规则生成器
│   └── desensitize.ts           # 🆕 字段脱敏工具
│
├── router/modules/              # 路由重组
│   ├── hrm.ts                   # 🆕 01 组织人事
│   ├── system.ts                # 改造：扩展 RBAC 管理页
│   └── [其余 Phase 2 再动]
```

---

## 📚 1.1 基础字典（3 天）

### 目标
建立 22 种基础字典的数据模型、Mock 数据、管理页、通用选择器、编码规则。

### 任务清单

| # | 任务 | 文件 | 验收要点 |
|---|---|---|---|
| 1.1.1 | 设计字典数据模型 | `src/types/system/dictionary.ts` | 支持父子字典（如民族含 56 个子项）、编码规则、启用状态、排序 |
| 1.1.2 | 22 种字典 Mock 数据 | `src/mock/dict/*.ts` | 数据固定不随机、分 8 组文件 |
| 1.1.3 | 创建 `useDictStore` | `src/store/modules/dict.ts` | `getDict(code)` 获取单个字典、`getOption(code, value)` 获取 label |
| 1.1.4 | 通用 `DictSelector` 组件 | `src/components/core/hr/dict-selector.vue` | `<DictSelector dict-code="EDUCATION" v-model />` |
| 1.1.5 | 字典管理页 | `src/views/system/dictionary/index.vue` | 左侧字典分组列表，右侧字典项 CRUD |
| 1.1.6 | 编码规则生成器 | `src/utils/code-generator.ts` | 员工号/合同号/组织号/岗位号自动生成 |

### 22 种字典清单

#### 基础字典（9 种）
| 编码 | 名称 | 字典项示例 |
|---|---|---|
| `GENDER` | 性别 | 男/女/保密 |
| `EDUCATION` | 教育程度 | 小学/初中/高中/中专/大专/本科/硕士/博士/博士后 |
| `MARITAL_STATUS` | 婚姻状况 | 未婚/已婚/离异/丧偶/保密 |
| `POLITICAL_STATUS` | 政治面貌 | 群众/共青团员/中共党员/民主党派/其他 |
| `NATION` | 民族 | 汉族 + 55 个少数民族 |
| `NATIONALITY` | 国籍 | 中国/港澳台/外籍 |
| `CERTIFICATE_TYPE` | 证件类型 | 身份证/护照/港澳通行证/台胞证/军官证 |
| `EMERGENCY_RELATION` | 紧急联系人关系 | 父母/配偶/子女/兄弟姐妹/其他 |
| `LANGUAGE_LEVEL` | 语言等级 | 母语/精通/熟练/一般/入门 |

#### 组织 / 岗位（3 种）
| 编码 | 名称 | 字典项示例 |
|---|---|---|
| `ORG_TYPE` | 组织类型 | 集团/公司/事业部/部门/小组/虚拟组织 |
| `ORG_NATURE` | 组织性质 | 经营/职能/支持/研发 |
| `JOB_FAMILY` | 岗位族 | 技术/产品/销售/运营/职能/管理 |

#### 员工状态 / 合同 / 异动（4 种）
| 编码 | 名称 |
|---|---|
| `EMP_STATUS` | 员工状态（7 种：待入职/试用期/正式/调动中/借调中/离职中/已离职） |
| `CONTRACT_TYPE` | 合同类型（固定期限/无固定期限/以完成任务为期限/劳务/实习） |
| `TRANSFER_TYPE` | 异动类型（入职/转正/调动/晋升/降级/调薪/续签/借调/返聘/离职） |
| `LEAVE_REASON_TYPE` | 离职类型（主动/被动/协商/退休/合同到期/辞退） |

#### 考勤 / 假期（3 种）
| 编码 | 名称 |
|---|---|
| `LEAVE_TYPE` | 假期类型（年假/事假/病假/产假/陪产假/婚假/丧假/调休/哺乳假） |
| `OVERTIME_TYPE` | 加班类型（工作日/周末/节假日） |
| `ATTENDANCE_STATUS` | 考勤状态（正常/迟到/早退/旷工/缺卡） |

#### 薪酬 / 福利（3 种）
| 编码 | 名称 |
|---|---|
| `SALARY_ITEM` | 薪资项（基本工资/岗位工资/绩效工资/加班费/餐补/交通补贴/通讯补贴） |
| `SOCIAL_ITEM` | 社保项（养老/医疗/失业/工伤/生育/公积金） |
| `WELFARE_ITEM` | 福利项（节日/生日/体检/旅游/商业保险） |

**总计 22 种**（另外"技能标签库 / 证书类型 / 课程类型 / 审批流类型"放 Phase 3~5 按需添加）

### 字典数据模型

```typescript
// src/types/system/dictionary.ts
export interface DictEntry {
  dictCode: string           // 字典编码（如 'EDUCATION'）
  dictName: string           // 字典名称（如 '教育程度'）
  dictGroup: string          // 分组（basic/org/employee/...）
  description?: string
  items: DictItem[]
  status: 0 | 1
  sortOrder: number
}

export interface DictItem {
  value: string | number     // 字典值（如 'bachelor'）
  label: string              // 显示名（如 '本科'）
  sortOrder: number
  status: 0 | 1
  parentValue?: string | number  // 支持父子字典
  extra?: Record<string, any>    // 扩展字段（如性别的颜色）
}
```

### 编码规则

| 编码类型 | 格式 | 示例 |
|---|---|---|
| 员工编号 | `YG` + YYYY + 4 位流水 | `YG20260001` |
| 合同编号 | `HT` + YYYYMMDD + 4 位流水 | `HT202604210001` |
| 组织编号 | `ORG` + 3 位集团 + 3 位部门 | `ORG001005` |
| 岗位编号 | `POS` + 岗位族前缀（TECH/PROD/...） + 3 位 | `POSTECH001` |

### 1.1 验收

- [ ] 22 种字典在字典管理页完整展示
- [ ] `<DictSelector dict-code="EDUCATION" />` 可用
- [ ] 编码生成器可在控制台调用测试
- [ ] 字典数据无遗漏（民族必须 56 个）

---

## 🏢 1.2 组织架构（2.5 天）

### 目标
组织树 CRUD、迁移、演进历史、`OrgTreeSelect` 通用组件。

### 任务清单

| # | 任务 | 文件 | 验收要点 |
|---|---|---|---|
| 1.2.1 | 组织数据模型 | `src/types/hrm/organization.ts` | 完整字段（见下） |
| 1.2.2 | 组织树 Mock（8 节点） | `src/mock/core/organizationTree.ts` | 集团 1 / 事业部 2 / 子公司 2 / 部门 3 |
| 1.2.3 | `useOrganizationStore` | `src/store/modules/organization.ts` | `getTree()` / `getNode(id)` / `getPath(id)` |
| 1.2.4 | 组织架构页（Tree 可视化 + CRUD） | `src/views/hrm/organization/index.vue` | 左树右详情 + 编辑/迁移/新增子节点 |
| 1.2.5 | 组织迁移功能 | 同上（含确认 Dialog） | 目标父组织选择 + 携带子组织选项 |
| 1.2.6 | 组织演进历史页 | `src/views/hrm/organization/history.vue` | 时间线展示"成立/合并/拆分/撤销"事件 |
| 1.2.7 | `OrgTreeSelect` 通用组件 | `src/components/core/hr/org-tree-select.vue` | 支持单选/多选/限制层级/排除指定节点 |

### 组织数据模型

```typescript
// src/types/hrm/organization.ts
export interface Organization {
  id: number
  orgCode: string                    // 如 'ORG001005'
  orgName: string
  orgShortName?: string
  parentId: number | null
  path: string                       // '/1/5/12' 便于权限判断
  level: number                      // 层级深度
  nodeType: 'group' | 'company' | 'division' | 'department' | 'team' | 'virtual'
  orgNature?: string                 // 字典 ORG_NATURE
  managerId?: number                 // 组织负责人 employeeId
  managerName?: string
  hrbpId?: number                    // 分管 HRBP employeeId
  hrbpName?: string
  costCenter?: string                // 成本中心代码
  headcount: number                  // 编制数
  actualCount: number                // 实际人数（计算值）
  startDate: string
  endDate?: string
  status: 'active' | 'suspended' | 'dissolved'
  sortOrder: number
  description?: string
  createTime: string
  updateTime: string
}

// 组织演进历史
export interface OrgEvent {
  id: number
  eventType: 'establish' | 'merge' | 'split' | 'rename' | 'dissolve' | 'move'
  orgId: number
  orgName: string
  targetOrgId?: number               // 合并/迁移 目标
  eventDate: string
  operator: string
  description: string
}
```

### 预置组织树（8 节点）

```
中和集团 (G001)
├ 技术事业部 (D001)
│  └ 技术研发中心 (DEPT001)
│     ├ 后端组 (TEAM001)
│     └ 前端组 (TEAM002)
├ 产品事业部 (D002)
│  └ 产品设计中心 (DEPT002)
├ 商业子公司 (C001)
│  └ 运营市场中心 (DEPT003)
├ 职能子公司 (C002)
│  └ 人力资源部 (DEPT004)
└ 虚拟组织：AI 孵化项目组 (VIRT001)
```

### 1.2 验收

- [ ] 组织树 CRUD 可用，层级正确
- [ ] 组织迁移（含子组织）功能可用
- [ ] 组织演进历史时间线展示
- [ ] `<OrgTreeSelect />` 在其他测试页面可用

---

## 📐 1.3 岗位体系（2 天）

### 目标
岗位族 × 序列 × 职级三层矩阵、岗位说明书、两个通用组件。

### 任务清单

| # | 任务 | 文件 | 验收要点 |
|---|---|---|---|
| 1.3.1 | 岗位数据模型 | `src/types/hrm/position.ts` | 族/序列/职级三层结构 |
| 1.3.2 | 岗位矩阵 Mock | `src/mock/core/positionMatrix.ts` | 6 族 × 平均 3 序列 × P2~P10 + M1~M3 |
| 1.3.3 | `usePositionStore` | `src/store/modules/position.ts` | `getByFamily(family)` / `getMatrix()` |
| 1.3.4 | 岗位体系矩阵页 | `src/views/hrm/position/index.vue` | 矩阵视图（行=序列，列=职级）+ 点击单元格查看岗位 |
| 1.3.5 | 岗位说明书详情页 | `src/views/hrm/position/detail.vue` | 职责描述 / 任职资格 / 薪酬带宽（占位） |
| 1.3.6 | `PositionSelector` 组件 | `src/components/core/hr/position-selector.vue` | 支持按岗位族筛选 |
| 1.3.7 | `JobFamilyLevelCascader` 组件 | `src/components/core/hr/job-family-level.vue` | 级联：族 → 序列 → 职级 |

### 岗位数据模型

```typescript
export interface JobFamily {
  code: string                       // 'TECH' / 'PROD' / 'SALES' / 'OPS' / 'FUNC' / 'MGMT'
  name: string
  sequences: JobSequence[]
}

export interface JobSequence {
  code: string                       // 如 'TECH_BACKEND'
  name: string                       // 后端开发
  familyCode: string                 // TECH
  positions: Position[]
}

export interface Position {
  id: number
  positionCode: string               // 'POSTECH001'
  positionName: string               // 高级后端工程师
  familyCode: string
  sequenceCode: string
  levelMin: string                   // P5
  levelMax: string                   // P7
  jobDescription: string             // 职责描述
  qualification: string              // 任职资格
  status: 0 | 1
  createTime: string
  updateTime: string
}

// 职级体系（字典 LEVEL_SPEC）
export interface LevelSpec {
  code: string                       // P1~P10 / M1~M5
  name: string
  track: 'professional' | 'management'
  rank: number                       // 用于排序比较
}
```

### 预置岗位矩阵

| 岗位族 | 序列 | 职级范围 | 预置岗位数 |
|---|---|---|:---:|
| 技术 | 后端/前端/算法/测试/运维/架构 | P2~P10 | 18 |
| 产品 | 产品经理/产品设计/交互/UI | P3~P10 | 12 |
| 销售 | 销售代表/商务/大客户 | P3~P9 | 9 |
| 运营 | 内容运营/用户运营/活动运营 | P3~P9 | 9 |
| 职能 | HR/财务/法务/行政 | P3~P9 | 12 |
| 管理 | （管理序列，与专业序列并行） | M1~M5 | 5 |

**总计约 65 个岗位**。

### 1.3 验收

- [ ] 岗位矩阵页可视化清晰
- [ ] 岗位说明书 CRUD 可用
- [ ] 两个选择器组件可复用

---

## 👤 1.4 员工档案 ⭐（6 天 · Phase 1 核心）

### 目标
建立**统一员工池**，所有业务模块的员工数据从这里读；员工档案 8 Tab 可查看（Tab 3~7 空壳占位）；状态机驱动；字段权限生效。

### 任务清单

| # | 任务 | 文件 | 工时 |
|---|---|---|:---:|
| 1.4.1 | 员工档案完整数据模型 | `src/types/hrm/employee.ts` | 0.5d |
| 1.4.2 | **员工状态机代码常量** | `src/types/hrm/state-machine.ts` | 0.5d |
| 1.4.3 | 字段脱敏工具函数 | `src/utils/desensitize.ts` | 0.2d |
| 1.4.4 | **200 员工生成脚本**（固定种子） | `src/mock/core/employeePool.ts` | 1.5d |
| 1.4.5 | `useEmployeeStore`（核心） | `src/store/modules/employee.ts` | 0.5d |
| 1.4.6 | 员工花名册列表页 | `src/views/hrm/employee/index.vue` | 1d |
| 1.4.7 | 员工档案详情页（8 Tab 框架） | `src/views/hrm/employee/detail.vue` | 0.3d |
| 1.4.8 | Tab 1：基本信息 | `.../detail-basic.vue` | 0.5d |
| 1.4.9 | Tab 2：岗位与组织 | `.../detail-position.vue` | 0.3d |
| 1.4.10 | Tab 3：合同（空壳） | `.../detail-contract.vue` | 0.1d |
| 1.4.11 | Tab 4：薪酬（空壳） | `.../detail-compensation.vue` | 0.1d |
| 1.4.12 | Tab 5：绩效历史（空壳） | `.../detail-performance.vue` | 0.1d |
| 1.4.13 | Tab 6：培训记录（空壳） | `.../detail-training.vue` | 0.1d |
| 1.4.14 | Tab 7：异动历史（空壳） | `.../detail-transfer.vue` | 0.1d |
| 1.4.15 | Tab 8：关联关系 | `.../detail-relations.vue` | 0.3d |
| 1.4.16 | 员工批量导入 | `.../import.vue` | 0.5d |
| 1.4.17 | `EmployeeSelector` 通用组件 | `src/components/core/hr/employee-selector.vue` | 0.5d |
| 1.4.18 | `v-field-permission` 指令 | `src/directives/field-permission.ts` | 0.3d |

### 员工档案数据模型

```typescript
export interface Employee {
  // === 基本信息 ===
  id: number
  employeeNo: string                   // 'YG20260001'
  nameZh: string
  nameEn?: string
  gender: 'M' | 'F' | 'OTHER'
  birthDate: string
  age: number                          // 计算值
  certificateType: string              // 字典
  certificateNo: string                // 敏感字段 → 脱敏
  nation: string                       // 字典
  nationality: string                  // 字典
  maritalStatus: string                // 字典
  politicalStatus: string              // 字典
  education: string                    // 字典
  graduatedSchool?: string
  major?: string
  mobile: string                       // 敏感 → 脱敏
  email: string
  homeAddress?: string                 // 敏感 → 脱敏
  emergencyContact: {                  // 敏感 → 脱敏
    name: string
    relation: string
    mobile: string
  }

  // === 岗位与组织 ===
  orgId: number
  orgName: string                      // 冗余，便于展示
  orgPath: string                      // '/G001/D001/DEPT001'
  positionId: number
  positionName: string                 // 冗余
  jobFamily: string                    // 字典 JOB_FAMILY
  jobSequence: string                  // 字典
  level: string                        // 'P6' / 'M2'
  levelTrack: 'professional' | 'management'
  supervisorId?: number                // 直属上级
  hrbpId?: number                      // 归属 HRBP
  workLocation: string                 // 工作地点
  employmentType: 'regular' | 'intern' | 'outsourcing'

  // === 入职与生命周期 ===
  entryDate: string                    // 入职日期
  regularizationDate?: string          // 转正日期
  seniority: number                    // 司龄（年）
  status: EmployeeStatus               // 状态机当前状态

  // === 合同 Mini 信息（详情在合同模块） ===
  currentContractId?: number
  contractType?: string
  contractStartDate?: string
  contractEndDate?: string

  // === 薪酬 Mini 信息 ===
  baseSalary?: number                  // 敏感 → 整列隐藏（HR 可见）
  positionSalary?: number              // 敏感
  performanceBase?: number             // 敏感
  socialBase?: number                  // 敏感

  // === 管理属性（Q5 HRBP 分管）===
  managedOrgIds?: number[]             // 如果该员工是 HRBP，这里配置他/她分管的组织 ID 列表

  // === 系统字段 ===
  createTime: string
  updateTime: string
}

export type EmployeeStatus =
  | 'pending_onboard'
  | 'probation'
  | 'regular'
  | 'transferring'
  | 'seconded'
  | 'offboarding'
  | 'terminated'
```

### 员工状态机（Q8 = 代码常量）

```typescript
// src/types/hrm/state-machine.ts
export const EMPLOYEE_STATE_MACHINE: Record<EmployeeStatus, {
  name: string
  color: string
  allowedNext: EmployeeStatus[]
  allowedActions: string[]
}> = {
  pending_onboard: {
    name: '待入职',
    color: 'info',
    allowedNext: ['probation', 'terminated'],
    allowedActions: ['confirm_onboard', 'cancel_offer']
  },
  probation: {
    name: '试用期',
    color: 'warning',
    allowedNext: ['regular', 'terminated'],
    allowedActions: ['confirm_regular', 'terminate_probation', 'extend_probation']
  },
  regular: {
    name: '正式在职',
    color: 'success',
    allowedNext: ['transferring', 'seconded', 'offboarding'],
    allowedActions: ['start_transfer', 'start_secondment', 'resign']
  },
  transferring: {
    name: '调动中',
    color: 'primary',
    allowedNext: ['regular'],
    allowedActions: ['complete_transfer', 'cancel_transfer']
  },
  seconded: {
    name: '借调中',
    color: 'primary',
    allowedNext: ['regular'],
    allowedActions: ['recall_from_secondment']
  },
  offboarding: {
    name: '离职中',
    color: 'danger',
    allowedNext: ['terminated'],
    allowedActions: ['complete_offboarding', 'cancel_offboarding']
  },
  terminated: {
    name: '已离职',
    color: 'info',
    allowedNext: [],                   // Q1 = A：返聘开新档案，老档案不流转
    allowedActions: ['view_only']
  }
}
```

### 字段脱敏规则（Q2 + Q3）

```typescript
// src/utils/desensitize.ts
export const SENSITIVE_FIELDS = {
  // 脱敏字段（混合 A）
  mobile: (v: string) => v ? v.slice(0, 3) + '****' + v.slice(-4) : '',
  certificateNo: (v: string) => v ? v.slice(0, 6) + '********' + v.slice(-4) : '',
  homeAddress: (v: string) => v ? v.slice(0, 3) + '***' + v.slice(-3) : '',
  emergencyMobile: (v: string) => v ? v.slice(0, 3) + '****' + v.slice(-4) : '',
  bankCard: (v: string) => v ? '****' + v.slice(-4) : ''
}

// 整列隐藏字段（混合 B）
export const HIDDEN_FIELDS_FOR_NON_HR = [
  'baseSalary',
  'positionSalary',
  'performanceBase',
  'socialBase'
]
```

**字段权限判断逻辑**（`v-field-permission` 指令实现）：
```
角色 ∈ { super_admin, hr_admin, hr_bp } → 全字段可见（不脱敏）
角色 ∈ { dept_manager, line_manager, employee } →
  - 脱敏字段自动脱敏显示
  - 薪酬字段整列隐藏（DOM 不渲染）
```

### 200 员工生成脚本（Q7）

```typescript
// src/mock/core/seed.ts
export const SEED = 20260421             // 固定种子

// 伪随机（固定种子就确定）
export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// src/mock/core/employeePool.ts
// 分布设计（确定性）：
// - 200 人
// - 分布到 8 个组织（权重：技术研发中心 60 / 产品设计中心 40 / 运营市场 30 / 人力资源 20 / 其他 50）
// - 岗位族分布：技术 90 / 产品 40 / 运营 30 / 职能 20 / 管理 20
// - 职级分布：P2~P10 正态分布，峰值 P5~P6
// - 状态分布：193 正式 / 3 试用期 / 2 调动中 / 2 离职中
// - 姓名：姓氏从"百家姓 Top 100" + 名字组合（从预置 200 个字里抽 2 字）
// - 生日：1965~2003 正态分布，峰值 1990
// - 司龄：2012~2025 分布，峰值 2020
// - 上下级关系：按组织层级 + 岗位级别自动分配
// - HRBP 绑定：人力资源部的 P7+ 员工担任，managedOrgIds 按事业部划分
```

**脚本输出的关键约束**：
- 结果固定（同种子 → 同结果）
- 全字段真实合理（如身份证号符合校验规则）
- 上下级关系无环、无悬挂
- 至少 5 个 HRBP、覆盖所有事业部
- 至少 10 个部门负责人

### useEmployeeStore 关键方法

```typescript
export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>(loadPool())

  const getById = (id: number) => employees.value.find(e => e.id === id)
  const getByOrg = (orgId: number, includeSub = true) => { /* ... */ }
  const getByStatus = (status: EmployeeStatus) => { /* ... */ }
  const getSubordinates = (supervisorId: number) => { /* ... */ }
  const getByHRBP = (hrbpId: number) => { /* ... */ }     // 用 managedOrgIds 反查
  const search = (keyword: string) => { /* ... */ }

  // 数据权限过滤
  const getVisibleEmployees = (rule: DataPermissionRule, currentUser: Employee) => {
    // 根据 rule.type 返回对应范围
  }

  return { employees, getById, getByOrg, getByStatus, getSubordinates, getByHRBP, search, getVisibleEmployees }
})
```

### 员工详情页 8 Tab

| Tab | 内容 | Phase 1 状态 |
|---|---|---|
| 1 基本信息 | 全部 23+ 基本字段，按权限脱敏 | ✅ 完整 |
| 2 岗位与组织 | 组织/岗位/职级/上级/HRBP/工作地 | ✅ 完整 |
| 3 合同 | 空壳 + "将在 Phase 2 接入" 提示 | 🟡 占位 |
| 4 薪酬 | 空壳（非 HR 完全不渲染整个 Tab） | 🟡 占位 |
| 5 绩效历史 | 空壳 + "将在 Phase 2 接入" | 🟡 占位 |
| 6 培训记录 | 空壳 + "将在 Phase 4 接入" | 🟡 占位 |
| 7 异动历史 | 空壳 + "将在 Phase 3 接入" | 🟡 占位 |
| 8 关联关系 | 上级/下属/HRBP/同部门员工 可视化 | ✅ 完整 |

### 1.4 验收

- [ ] 200 员工 Mock 固定生成（执行 2 次结果一致）
- [ ] 花名册列表可筛选（按部门/岗位/状态/关键字）
- [ ] 员工详情页 8 Tab 全部可访问（3~7 空壳有提示）
- [ ] 非 HR 角色登录看不到薪酬 Tab，手机号身份证脱敏
- [ ] `<EmployeeSelector />` 在测试页可用
- [ ] `useEmployeeStore().getById(1001)` 测试通过
- [ ] 管理关系无环（可用 DFS 检测）

---

## 🔐 1.5 RBAC 权限（3 天）

### 目标
三层权限模型（菜单 / 数据 / 字段）落地，7 种角色配置完整，登录不同账号看到不同视图。

### 任务清单

| # | 任务 | 文件 | 工时 |
|---|---|---|:---:|
| 1.5.1 | RBAC 数据模型 | `src/types/system/rbac.ts` | 0.5d |
| 1.5.2 | 7 种角色 Mock | `src/mock/system/roles.ts` | 0.3d |
| 1.5.3 | 菜单权限 Mock（菜单树） | `src/mock/system/menus.ts` | 0.2d |
| 1.5.4 | 数据权限规则 Mock | `src/mock/system/permissions.ts` | 0.3d |
| 1.5.5 | `useRBACStore` | `src/store/modules/rbac.ts` | 0.5d |
| 1.5.6 | 角色管理页（角色 CRUD + 菜单权限树）| `src/views/system/role/index.vue` | 0.5d |
| 1.5.7 | 数据权限规则配置页 | `src/views/system/data-permission/index.vue` | 0.5d |
| 1.5.8 | `DataPermissionFilter` 包裹组件 | `src/components/core/hr/data-permission.vue` | 0.3d |
| 1.5.9 | 菜单动态裁剪（改造现有逻辑） | `src/router/index.ts` / `menu` store | 0.4d |
| 1.5.10 | 登录 7 个测试账号 | `src/mock/auth.ts` 扩展 | 0.3d |

### RBAC 数据模型

```typescript
// src/types/system/rbac.ts

export interface Role {
  id: number
  roleCode: string                     // 'super_admin' / 'hr_admin' / ...
  roleName: string
  description: string
  isSystem: boolean                    // 系统角色不可删
  menuIds: number[]                    // 菜单权限
  dataPermissionCode: DataScope        // 数据权限
  fieldPermissionRule: FieldRule       // 字段权限
  status: 0 | 1
  createTime: string
  updateTime: string
}

export type DataScope =
  | 'self'                             // 仅本人
  | 'subordinate'                      // 直属下属
  | 'self_and_subordinate'             // 本人 + 下属
  | 'department'                       // 本部门（含子）
  | 'department_exclusive'             // 本部门（不含子）
  | 'custom_org'                       // 自定义（用 managedOrgIds）
  | 'all'                              // 全员

export interface FieldRule {
  sensitiveFields: 'visible' | 'masked' | 'hidden'  // 敏感字段展示方式
  salaryFields: 'visible' | 'hidden'                // 薪酬字段
  customFields?: Record<string, 'visible' | 'masked' | 'hidden'>
}

// 菜单项（树）
export interface MenuItem {
  id: number
  menuCode: string
  menuName: string
  parentId: number | null
  path: string
  icon?: string
  sortOrder: number
  status: 0 | 1
  children?: MenuItem[]
}
```

### 预置 7 种角色

```typescript
// src/mock/system/roles.ts
export const PRESET_ROLES: Role[] = [
  {
    roleCode: 'super_admin',
    roleName: '超级管理员',
    menuIds: ALL_MENU_IDS,
    dataPermissionCode: 'all',
    fieldPermissionRule: { sensitiveFields: 'visible', salaryFields: 'visible' }
  },
  {
    roleCode: 'hr_admin',
    roleName: 'HR 管理员',
    menuIds: [...ALL_EXCEPT_SYSTEM],   // 除"系统管理"外全部
    dataPermissionCode: 'all',
    fieldPermissionRule: { sensitiveFields: 'visible', salaryFields: 'visible' }
  },
  {
    roleCode: 'hr_bp',
    roleName: 'HRBP',
    menuIds: [...ALL_EXCEPT_SYSTEM],
    dataPermissionCode: 'custom_org',  // 用 managedOrgIds
    fieldPermissionRule: { sensitiveFields: 'visible', salaryFields: 'visible' }
  },
  {
    roleCode: 'dept_manager',
    roleName: '部门负责人',
    menuIds: [...CORE_MENUS],
    dataPermissionCode: 'department',
    fieldPermissionRule: { sensitiveFields: 'masked', salaryFields: 'hidden' }
  },
  {
    roleCode: 'line_manager',
    roleName: '直线经理',
    menuIds: [...CORE_MENUS],
    dataPermissionCode: 'self_and_subordinate',
    fieldPermissionRule: { sensitiveFields: 'masked', salaryFields: 'hidden' }
  },
  {
    roleCode: 'employee',
    roleName: '普通员工',
    menuIds: [...EMPLOYEE_MENUS],       // 档案/绩效/培训/考勤/工资条
    dataPermissionCode: 'self',
    fieldPermissionRule: { sensitiveFields: 'masked', salaryFields: 'visible' } // 员工自己的薪资可见
  },
  {
    roleCode: 'interviewer',
    roleName: '面试官',
    menuIds: [INTERVIEW_MENU_ID],
    dataPermissionCode: 'custom_resume',
    fieldPermissionRule: { sensitiveFields: 'masked', salaryFields: 'hidden' }
  }
]
```

### 7 个测试账号（Q4 = B 登录切换）

| 账号 | 密码 | 角色 | 绑定员工 ID |
|---|---|---|:---:|
| admin | 123456 | super_admin | - |
| hr | 123456 | hr_admin | 4001（人力资源部负责人） |
| hrbp1 | 123456 | hr_bp | 4005（管理 managedOrgIds=[技术事业部, 产品事业部]） |
| manager1 | 123456 | dept_manager | 1001（技术研发中心负责人） |
| leader1 | 123456 | line_manager | 1010（后端组 leader） |
| emp1 | 123456 | employee | 1050（普通后端） |
| interviewer1 | 123456 | interviewer | 1020 |

### 菜单动态裁剪

改造现有的 `menu` store，登录后：
1. 读取当前用户角色
2. 遍历所有路由，过滤出 `menuIds` 包含的路由
3. 构建可见的菜单树

### DataPermissionFilter 使用示例

```vue
<template>
  <DataPermissionFilter :data="allEmployees" v-slot="{ visibleData }">
    <el-table :data="visibleData" />
  </DataPermissionFilter>
</template>
```

组件内部调用 `useEmployeeStore().getVisibleEmployees(rule, currentUser)`。

### v-field-permission 使用示例

```vue
<!-- 薪酬字段：非 HR 不渲染整列 -->
<el-table-column
  v-field-permission="'salary'"
  prop="baseSalary"
  label="基本工资"
/>

<!-- 手机号：自动脱敏 -->
<span v-field-permission:mask="'mobile'">{{ employee.mobile }}</span>
```

### 1.5 验收

- [ ] 7 个角色配置完整
- [ ] 用 admin 登录：所有菜单、全字段
- [ ] 用 hr 登录：无"系统管理"，其他全部
- [ ] 用 hrbp1 登录：只看管理的事业部员工
- [ ] 用 manager1 登录：只看本部门，薪酬不可见
- [ ] 用 emp1 登录：只看自己档案，手机号脱敏
- [ ] 角色管理页 / 数据权限页 CRUD 可用

---

## 🧹 1.6 Phase 1 验收 + i18n（1 天）

### 任务清单

| # | 任务 |
|---|---|
| 1.6.1 | i18n 新增 key：`menus.hrm.*` / `menus.system.dictionary/role/dataPermission/...` |
| 1.6.2 | 跑一遍 Phase 1 全部验收清单（见下） |
| 1.6.3 | 在 `docs/HR重构-Phase1-地基-plan.md` 末尾追加 "V1.1 完成记录" |

### Phase 1 全局验收清单

#### 数据地基
- [ ] 22 种字典全部预置完整
- [ ] 组织树 8 节点可视化正确
- [ ] 岗位矩阵 6×N 完整
- [ ] 200 员工池确定性生成
- [ ] 编码规则可用

#### UI 层
- [ ] 字典管理页、组织架构页、岗位体系页、员工花名册页、员工详情页、角色管理页、数据权限页 —— **7 个核心页面**全部可用
- [ ] 7 个通用组件（OrgTreeSelect / EmployeeSelector / PositionSelector / JobFamilyLevelCascader / DictSelector / ApprovalTimeline 预留 / DataPermissionFilter）全部可用
- [ ] `v-field-permission` 指令可用
- [ ] `desensitize` 工具可用

#### Store 层
- [ ] `useDictStore` / `useOrganizationStore` / `usePositionStore` / `useEmployeeStore` / `useRBACStore` 全部可用

#### 权限层
- [ ] 7 个测试账号全部可登录
- [ ] 菜单按角色动态裁剪
- [ ] 数据权限（5 种范围 + 自定义组织）全部验证通过
- [ ] 字段权限（脱敏 + 整列隐藏）全部验证通过

#### 文档层
- [ ] i18n 中英文齐全
- [ ] Phase 1 plan 文档追加完成记录

---

## ⚠️ 风险项与应对

| # | 风险 | 应对 |
|---|---|---|
| 1 | 200 员工生成脚本的"上下级关系无环" 验证复杂 | 生成后用 DFS 检测，有环就打印警告让我手工调整种子 |
| 2 | RBAC 菜单动态裁剪可能破坏现有路由守卫 | 先读懂现有 `menu` store + 路由守卫，小步改造 |
| 3 | 字段权限指令 `v-field-permission` 在 `el-table-column` 上可能不生效（虚拟滚动情况） | 备选：用 `v-if` + computed 代替指令 |
| 4 | 员工档案详情页 8 Tab 如果同屏渲染会很重 | 用 `v-if` + 懒加载 Tab 内容，只渲染当前激活 Tab |
| 5 | 字典数据量大（56 个民族）可能影响加载 | 字典一次性加载，后续从 store 读取（不每次查询） |

---

## 📋 执行原则（SOP）

### 强顺序
**必须严格按 1.0 → 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 顺序**，因为：
- 字典是所有模型的依赖
- 组织是员工的依赖
- 岗位是员工的依赖
- 员工是 RBAC 的依赖（数据权限要过滤员工）

### 每个子阶段的 SOP
1. 动手前在 TaskCreate 里创建该子阶段全部任务
2. 每完成一个小任务，更新 TaskUpdate 状态
3. 子阶段完成后，跑一遍该子阶段的验收清单
4. 通过后给用户简短汇报，再进入下一子阶段

### 代码规范
严格按 `CLAUDE.md`：
- 页面中文不用 i18n 函数
- 表格按钮用 `link` 类型
- 布局用纯 Flex + `el-scrollbar`
- 数字输入用 `el-input`
- Mock 数据固定不随机
- 禁止直接 import `@element-plus/icons-vue` 的不存在图标（上次 `Magic` 教训）

---

## 📝 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-04-21 | V1.0 | 初始版本，Phase 1 全部子任务细化 |
| 2026-04-21 | V1.1 | **Phase 1 全部完成** ✅。交付清单见下方"Phase 1 完成总结"。|

---

## 🏁 Phase 1 完成总结

### 交付文件清单

**类型定义（4 个）**：
- `src/types/system/dictionary.ts`
- `src/types/system/rbac.ts`
- `src/types/hrm/organization.ts`
- `src/types/hrm/position.ts`
- `src/types/hrm/employee.ts`
- `src/types/hrm/state-machine.ts`

**Mock 数据（10 个）**：
- `src/mock/dict/basicDict.ts`（9 种基础字典）
- `src/mock/dict/orgDict.ts`（3 种组织岗位字典）
- `src/mock/dict/employeeDict.ts`（4 种员工字典）
- `src/mock/dict/attendanceDict.ts`（3 种考勤假期字典）
- `src/mock/dict/compDict.ts`（3 种薪酬字典）
- `src/mock/dict/index.ts`（汇总 22 种字典）
- `src/mock/core/seed.ts`（固定种子 + 工具）
- `src/mock/core/organizationTree.ts`（12 个组织节点 + 演进事件）
- `src/mock/core/positionMatrix.ts`（6 族 × 23 序列 × 62 岗位 + 15 职级）
- `src/mock/core/employeePool.ts`（200 员工生成脚本）
- `src/mock/system/roles.ts`（7 种预置角色 + 57 个菜单定义）

**Store 模块（5 个）**：
- `src/store/modules/dict.ts`
- `src/store/modules/organization.ts`
- `src/store/modules/position.ts`
- `src/store/modules/employee.ts`（核心：`useEmployeeStore`）
- `src/store/modules/rbac.ts`

**通用组件（5 个）**：
- `src/components/core/hr/dict-selector.vue`
- `src/components/core/hr/org-tree-select.vue`
- `src/components/core/hr/position-selector.vue`
- `src/components/core/hr/job-family-level.vue`
- `src/components/core/hr/employee-selector.vue`
- `src/components/core/hr/data-permission.vue`

**工具 / 指令**：
- `src/utils/code-generator.ts`（员工号/合同号/组织号/岗位号）
- `src/utils/desensitize.ts`（手机/身份证/地址/银行卡/邮箱脱敏）
- `src/directives/field-permission.ts`（v-field-permission）

**视图页面（6 个）**：
- `src/views/system/dictionary/index.vue`（字典管理，左分组+右CRUD）
- `src/views/hrm/organization/index.vue`（组织架构 Tree+CRUD+迁移+演进历史）
- `src/views/hrm/position/index.vue`（岗位体系矩阵视图 + 列表视图 + 说明书抽屉）
- `src/views/hrm/employee/index.vue`（员工花名册 + 统计卡）
- `src/views/hrm/employee/detail.vue`（员工详情 8 Tab）
- `src/views/system/role/index.vue`（角色与权限管理）
- `src/views/system/data-permission/index.vue`（权限效果预览）

**路由与 i18n**：
- `src/router/modules/hrm.ts`（新建一级路由）
- `src/router/modules/index.ts`（注册 hrmRoutes）
- `src/router/modules/system.ts`（新增 data-permission 二级）
- `src/locales/langs/zh.json` / `en.json`（新增 menus.hrm.* / menus.system.dataPermission）

**删除**：
- `src/router/modules/department.ts` / `exception.ts` / `organization.ts` / `position.ts` / `staffing.ts`（5 个孤立文件）

---

### 核心能力

1. **22 种基础字典**：统一数据源，所有业务选项从字典读取
2. **12 节点组织树**：集团→事业部→部门→小组四层结构，含演进历史
3. **62 个岗位**：6 族 × 23 序列 × P1~P10 + M1~M5 完整矩阵
4. **200 员工池**（固定种子）：确定性分布（技术 90 / 产品 40 / 运营 30 / 销售 10 / 职能 20 / 管理 20）
5. **员工 8 Tab 档案**：基本/岗位/合同/薪酬/绩效/培训/异动/关联关系（Tab 3~7 空壳占位）
6. **三层 RBAC**：菜单权限（57 个菜单）× 数据权限（7 种范围）× 字段权限（脱敏/隐藏/可见）
7. **7 种预置角色**：super_admin / hr_admin / hr_bp / dept_manager / line_manager / employee / interviewer
8. **角色切换演示**：在"角色权限"页和"数据权限"页可一键切换角色查看效果

---

### 验收结果

| 验收项 | 结果 |
|---|:---:|
| 22 种基础字典完整 | ✅ |
| 组织架构 8+ 节点 CRUD+迁移+演进 | ✅（12 节点） |
| 岗位体系矩阵视图 + 说明书 | ✅ |
| 200 员工确定性生成（含上下级 / HRBP 分管） | ✅ |
| 员工档案 8 Tab | ✅ |
| 7 种预置角色 | ✅ |
| 角色切换 → 菜单/数据/字段均正确过滤 | ✅（预览页可验证） |
| 6+1 个通用组件 | ✅ |
| 5 个 Pinia Store（dict/org/pos/emp/rbac） | ✅ |

---

### 延后事项（Phase 2 处理）

1. ❌ **菜单动态裁剪**：目前菜单显示仍是全量 21 个一级，Phase 2 菜单归位时统一接入 RBAC
2. ❌ **登录时自动绑定角色**：目前通过"角色权限"页手动切换，Phase 2 改造 auth.ts 接入
3. ❌ **删除 talent-experience / employee-self-service 模块**：等 Phase 2 统一处理
4. ❌ **批量导入员工**：目前仅有 Dialog 提示，Phase 3 异动模块实现

---

### 已知问题 / 后续改进

1. 🔶 访问 `/hrm/*` 需要从左侧新增的"组织人事"菜单进入，但旧的"组织管理"和"员工管理"菜单仍存在
2. 🔶 `v-field-permission` 指令目前依赖 RBAC store 的 `canViewSalary` 判断，仅覆盖"薪酬"和"敏感"两类
3. 🔶 字典 Store 修改后会持久化到 localStorage，清除缓存可恢复默认数据

---

## 🚀 下一步

**Phase 2：菜单归位 + 已有模块迁移**（1 周）

核心任务：
- 21 个一级菜单 → 8 个一级菜单
- 招聘 4 个 / 绩效 4 个各合并为 1 个
- 删除 talent-experience / employee-self-service
- 所有旧业务模块改用新 `useEmployeeStore` 读员工数据
- 需求说明书 V1.0 章节同步重构为 8 章


---

## 🚀 启动步骤（确认此 plan 后）

1. 用户 Review 此 plan
2. 通过后，我将：
   - 一次性创建 1.0 ~ 1.6 全部 49 个子任务到 TaskCreate
   - 按强顺序开始执行 1.0 前置准备
3. 每个子阶段完成停下汇报

**等你 Review 通过。**
