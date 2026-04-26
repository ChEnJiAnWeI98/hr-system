/**
 * 组织架构 Mock 数据（Phase 1.2）
 * 预置组织树：
 *   星河集团 (G001)
 *   ├ 技术事业部 (D001)
 *   │  └ 技术研发中心 (DEPT001)
 *   │     ├ 后端组 (TEAM001)
 *   │     └ 前端组 (TEAM002)
 *   ├ 产品事业部 (D002)
 *   │  └ 产品设计中心 (DEPT002)
 *   ├ 星河商业 (C001)
 *   │  └ 运营市场中心 (DEPT003)
 *   ├ 星河共享 (C002)
 *   │  └ 人力资源部 (DEPT004)
 *   └ AI 孵化项目组 (VIRT001) 虚拟组织
 */
import type { Organization, OrgEvent } from '@/types/org/organization'

/** 组织（扁平存储） */
export const ORGANIZATIONS: Organization[] = [
  // === 集团 ===
  {
    id: 1,
    orgCode: 'G01',
    orgName: '星河集团',
    parentId: null,
    path: '/1',
    level: 1,
    nodeType: 'group',
    orgNature: 'business',
    managerId: undefined,
    managerName: '（待指定）',
    costCenter: 'CC001',
    headcount: 500,
    actualCount: 200,
    startDate: '2012-01-01',
    status: 'active',
    sortOrder: 1,
    description: '集团总部',
    createTime: '2012-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 事业部（集团下） ===
  {
    id: 2,
    orgCode: 'G01-BU01',
    orgName: '技术事业部',
    parentId: 1,
    path: '/1/2',
    level: 2,
    nodeType: 'division',
    orgNature: 'rd',
    costCenter: 'CC001-01',
    headcount: 180,
    actualCount: 95,
    startDate: '2015-03-01',
    status: 'active',
    sortOrder: 1,
    description: '集团技术研发与创新中心',
    createTime: '2015-03-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 3,
    orgCode: 'G01-BU02',
    orgName: '产品事业部',
    parentId: 1,
    path: '/1/3',
    level: 2,
    nodeType: 'division',
    orgNature: 'business',
    costCenter: 'CC001-02',
    headcount: 80,
    actualCount: 42,
    startDate: '2015-06-01',
    status: 'active',
    sortOrder: 2,
    description: '产品规划与设计中心',
    createTime: '2015-06-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 子公司 ===
  {
    id: 4,
    orgCode: 'G01-BU03',
    orgName: '星河商业',
    parentId: 1,
    path: '/1/4',
    level: 2,
    nodeType: 'company',
    orgNature: 'business',
    costCenter: 'CC001-03',
    headcount: 60,
    actualCount: 32,
    startDate: '2018-01-01',
    status: 'active',
    sortOrder: 3,
    description: '承担集团商业化业务',
    createTime: '2018-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 5,
    orgCode: 'G01-BU04',
    orgName: '星河共享',
    parentId: 1,
    path: '/1/5',
    level: 2,
    nodeType: 'company',
    orgNature: 'functional',
    costCenter: 'CC001-04',
    headcount: 40,
    actualCount: 22,
    startDate: '2016-01-01',
    status: 'active',
    sortOrder: 4,
    description: '集团职能支持中心',
    createTime: '2016-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 部门（事业部/子公司下） ===
  {
    id: 6,
    orgCode: 'G01-BU01-D01',
    orgName: '技术研发中心',
    parentId: 2,
    path: '/1/2/6',
    level: 3,
    nodeType: 'department',
    orgNature: 'rd',
    costCenter: 'CC001-01-01',
    headcount: 120,
    actualCount: 78,
    startDate: '2015-03-15',
    status: 'active',
    sortOrder: 1,
    createTime: '2015-03-15 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 7,
    orgCode: 'G01-BU02-D02',
    orgName: '产品设计中心',
    parentId: 3,
    path: '/1/3/7',
    level: 3,
    nodeType: 'department',
    orgNature: 'business',
    costCenter: 'CC001-02-01',
    headcount: 60,
    actualCount: 38,
    startDate: '2015-06-15',
    status: 'active',
    sortOrder: 1,
    createTime: '2015-06-15 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 8,
    orgCode: 'G01-BU03-D03',
    orgName: '运营市场中心',
    parentId: 4,
    path: '/1/4/8',
    level: 3,
    nodeType: 'department',
    orgNature: 'business',
    costCenter: 'CC001-03-01',
    headcount: 50,
    actualCount: 28,
    startDate: '2018-01-15',
    status: 'active',
    sortOrder: 1,
    createTime: '2018-01-15 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 9,
    orgCode: 'G01-BU04-D04',
    orgName: '人力资源部',
    parentId: 5,
    path: '/1/5/9',
    level: 3,
    nodeType: 'department',
    orgNature: 'functional',
    costCenter: 'CC001-04-01',
    headcount: 15,
    actualCount: 10,
    startDate: '2016-01-15',
    status: 'active',
    sortOrder: 1,
    createTime: '2016-01-15 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 小组（部门下） ===
  {
    id: 10,
    orgCode: 'G01-BU01-D01-T01',
    orgName: '后端组',
    parentId: 6,
    path: '/1/2/6/10',
    level: 4,
    nodeType: 'team',
    orgNature: 'rd',
    costCenter: 'CC001-01-01-01',
    headcount: 50,
    actualCount: 32,
    startDate: '2016-01-01',
    status: 'active',
    sortOrder: 1,
    createTime: '2016-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 11,
    orgCode: 'G01-BU01-D01-T02',
    orgName: '前端组',
    parentId: 6,
    path: '/1/2/6/11',
    level: 4,
    nodeType: 'team',
    orgNature: 'rd',
    costCenter: 'CC001-01-01-02',
    headcount: 30,
    actualCount: 21,
    startDate: '2016-01-01',
    status: 'active',
    sortOrder: 2,
    createTime: '2016-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 虚拟组织（跨事业部） ===
  {
    id: 12,
    orgCode: 'G01-BU05',
    orgName: 'AI 孵化项目组',
    parentId: 1,
    path: '/1/12',
    level: 2,
    nodeType: 'virtual',
    orgNature: 'rd',
    headcount: 15,
    actualCount: 8,
    startDate: '2025-09-01',
    status: 'active',
    sortOrder: 99,
    description: '跨事业部孵化 AI 创新项目',
    createTime: '2025-09-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 产品设计中心下子组 ===
  {
    id: 13,
    orgCode: 'G01-BU02-D02-T03',
    orgName: '产品经理组',
    parentId: 7,
    path: '/1/3/7/13',
    level: 4,
    nodeType: 'team',
    orgNature: 'product',
    costCenter: 'CC001-02-01-01',
    headcount: 30,
    actualCount: 0,
    startDate: '2020-06-01',
    status: 'active',
    sortOrder: 1,
    createTime: '2020-06-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 14,
    orgCode: 'G01-BU02-D02-T04',
    orgName: 'UX 设计组',
    parentId: 7,
    path: '/1/3/7/14',
    level: 4,
    nodeType: 'team',
    orgNature: 'product',
    costCenter: 'CC001-02-01-02',
    headcount: 30,
    actualCount: 0,
    startDate: '2020-06-01',
    status: 'active',
    sortOrder: 2,
    createTime: '2020-06-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 运营市场中心下子组 ===
  {
    id: 15,
    orgCode: 'G01-BU03-D03-T05',
    orgName: '运营组',
    parentId: 8,
    path: '/1/4/8/15',
    level: 4,
    nodeType: 'team',
    orgNature: 'operation',
    costCenter: 'CC001-03-01-01',
    headcount: 25,
    actualCount: 0,
    startDate: '2019-03-01',
    status: 'active',
    sortOrder: 1,
    createTime: '2019-03-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 16,
    orgCode: 'G01-BU03-D03-T06',
    orgName: '市场组',
    parentId: 8,
    path: '/1/4/8/16',
    level: 4,
    nodeType: 'team',
    orgNature: 'sales',
    costCenter: 'CC001-03-01-02',
    headcount: 25,
    actualCount: 0,
    startDate: '2019-03-01',
    status: 'active',
    sortOrder: 2,
    createTime: '2019-03-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },

  // === 人力资源部下子组 ===
  {
    id: 17,
    orgCode: 'G01-BU04-D04-T07',
    orgName: '招聘组',
    parentId: 9,
    path: '/1/5/9/17',
    level: 4,
    nodeType: 'team',
    orgNature: 'function',
    costCenter: 'CC001-04-01-01',
    headcount: 8,
    actualCount: 0,
    startDate: '2018-01-01',
    status: 'active',
    sortOrder: 1,
    createTime: '2018-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 18,
    orgCode: 'G01-BU04-D04-T08',
    orgName: 'HRBP 组',
    parentId: 9,
    path: '/1/5/9/18',
    level: 4,
    nodeType: 'team',
    orgNature: 'function',
    costCenter: 'CC001-04-01-02',
    headcount: 7,
    actualCount: 0,
    startDate: '2018-01-01',
    status: 'active',
    sortOrder: 2,
    createTime: '2018-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  }
]

/** 组织演进事件（Mock） */
export const ORG_EVENTS: OrgEvent[] = [
  {
    id: 1,
    eventType: 'establish',
    orgId: 1,
    orgName: '星河集团',
    eventDate: '2012-01-01',
    operator: '创始人',
    description: '集团成立',
    createTime: '2012-01-01 00:00:00'
  },
  {
    id: 2,
    eventType: 'establish',
    orgId: 2,
    orgName: '技术事业部',
    eventDate: '2015-03-01',
    operator: 'CEO',
    description: '集团技术能力独立，设立技术事业部',
    createTime: '2015-03-01 00:00:00'
  },
  {
    id: 3,
    eventType: 'establish',
    orgId: 3,
    orgName: '产品事业部',
    eventDate: '2015-06-01',
    operator: 'CEO',
    description: '产品规划独立，设立产品事业部',
    createTime: '2015-06-01 00:00:00'
  },
  {
    id: 4,
    eventType: 'establish',
    orgId: 4,
    orgName: '星河商业',
    eventDate: '2018-01-01',
    operator: '董事会',
    description: '设立商业子公司「星河商业」承担商业化业务',
    createTime: '2018-01-01 00:00:00'
  },
  {
    id: 5,
    eventType: 'rename',
    orgId: 8,
    orgName: '运营市场中心',
    eventDate: '2023-05-01',
    operator: 'COO',
    description: '由"市场部"更名为"运营市场中心"',
    createTime: '2023-05-01 00:00:00'
  },
  {
    id: 6,
    eventType: 'establish',
    orgId: 12,
    orgName: 'AI 孵化项目组',
    eventDate: '2025-09-01',
    operator: 'CTO',
    description: '跨部门成立 AI 创新孵化团队',
    createTime: '2025-09-01 00:00:00'
  }
]
