// @ts-nocheck
/**
 * 评估表模板 Mock（Phase A2）
 */
import { createCrudMock } from '@/utils/crud'
import type {
  PerformanceTemplate,
  EvalDimension
} from '@/types/performanceTemplate'
import { DEFAULT_EVAL_NODES, DEFAULT_GRADE_MAPPING } from '@/types/performanceTemplate'

/* ========== 预置维度 ========== */

// 技术研发 P5-P7 维度
const techDimensions: EvalDimension[] = [
  {
    name: '业绩成果',
    weight: 40,
    description: '基于 OKR 完成情况和核心交付物评估',
    subIndicators: [
      {
        name: 'OKR 完成度',
        weight: 60,
        scoringGuide: {
          s1: 'OKR 完成度 < 40%',
          s3: 'OKR 完成度 70% 左右，基本达成',
          s5: 'OKR 完成度 > 100%，超预期交付'
        }
      },
      {
        name: '交付质量',
        weight: 40,
        scoringGuide: {
          s1: '交付物频繁出现严重 Bug',
          s3: '交付物质量合格，偶有小问题',
          s5: '交付物零缺陷，设计精巧可复用'
        }
      }
    ]
  },
  {
    name: '专业能力',
    weight: 30,
    description: '技术深度 / 系统设计能力 / 代码质量',
    subIndicators: [
      { name: '技术深度', weight: 50 },
      { name: '系统设计', weight: 30 },
      { name: '代码质量', weight: 20 }
    ]
  },
  {
    name: '团队协作',
    weight: 20,
    description: '跨团队合作 / 知识分享 / 新人带教',
    subIndicators: [
      { name: '跨团队协作', weight: 50 },
      { name: '知识分享', weight: 30 },
      { name: '新人带教', weight: 20 }
    ]
  },
  {
    name: '创新突破',
    weight: 10,
    description: '技术创新 / 流程优化 / 降本增效',
    subIndicators: [
      { name: '技术创新', weight: 60 },
      { name: '流程优化', weight: 40 }
    ]
  }
]

// 产品设计 P5-P7 维度
const productDimensions: EvalDimension[] = [
  {
    name: '业绩成果',
    weight: 45,
    subIndicators: [
      { name: 'OKR 完成度', weight: 60 },
      { name: '产品影响力', weight: 40 }
    ]
  },
  {
    name: '专业能力',
    weight: 30,
    subIndicators: [
      { name: '需求分析', weight: 40 },
      { name: '产品设计', weight: 40 },
      { name: '数据驱动', weight: 20 }
    ]
  },
  {
    name: '团队协作',
    weight: 15,
    subIndicators: [
      { name: '跨部门协作', weight: 60 },
      { name: '沟通表达', weight: 40 }
    ]
  },
  {
    name: '创新突破',
    weight: 10,
    subIndicators: [{ name: '创新能力', weight: 100 }]
  }
]

// 管理岗（总监及以上）维度
const managerDimensions: EvalDimension[] = [
  {
    name: '业务结果',
    weight: 40,
    subIndicators: [
      { name: '业务目标达成', weight: 60 },
      { name: '战略执行', weight: 40 }
    ]
  },
  {
    name: '团队建设',
    weight: 25,
    subIndicators: [
      { name: '团队氛围 / NPS', weight: 40 },
      { name: '人才培养', weight: 40 },
      { name: '梯队建设', weight: 20 }
    ]
  },
  {
    name: '战略思考',
    weight: 20,
    subIndicators: [
      { name: '战略规划', weight: 50 },
      { name: '跨部门协作', weight: 50 }
    ]
  },
  {
    name: '创新变革',
    weight: 15,
    subIndicators: [{ name: '创新驱动', weight: 100 }]
  }
]

// 销售 KPI 维度
const salesDimensions: EvalDimension[] = [
  {
    name: '业绩达成',
    weight: 70,
    subIndicators: [
      { name: '销售额目标', weight: 60 },
      { name: '新客户数', weight: 20 },
      { name: '回款率', weight: 20 }
    ]
  },
  {
    name: '客户服务',
    weight: 20,
    subIndicators: [
      { name: '客户满意度', weight: 70 },
      { name: '续约率', weight: 30 }
    ]
  },
  {
    name: '团队协作',
    weight: 10,
    subIndicators: [{ name: '团队协作', weight: 100 }]
  }
]

// 职能通用维度
const functionDimensions: EvalDimension[] = [
  {
    name: '工作成果',
    weight: 50,
    subIndicators: [
      { name: '核心 KPI', weight: 70 },
      { name: '交付质量', weight: 30 }
    ]
  },
  {
    name: '专业能力',
    weight: 25,
    subIndicators: [
      { name: '专业深度', weight: 60 },
      { name: '学习成长', weight: 40 }
    ]
  },
  {
    name: '团队协作',
    weight: 15,
    subIndicators: [{ name: '协作沟通', weight: 100 }]
  },
  {
    name: '价值观认同',
    weight: 10,
    subIndicators: [{ name: '价值观', weight: 100 }]
  }
]

// PIP 专用简化维度
const pipDimensions: EvalDimension[] = [
  {
    name: '改进目标完成度',
    weight: 70,
    subIndicators: [
      { name: '阶段 1 目标', weight: 50 },
      { name: '阶段 2 目标', weight: 50 }
    ]
  },
  {
    name: '改进态度 & 沟通',
    weight: 30,
    subIndicators: [
      { name: '主动沟通', weight: 50 },
      { name: '接受反馈', weight: 50 }
    ]
  }
]

/* ========== 预置模板 ========== */
const mockTemplates: PerformanceTemplate[] = [
  {
    id: 1,
    templateNo: 'TPL2026T001',
    templateName: '技术研发 - P5~P7 绩效评估表',
    jobFamily: '技术研发',
    level: 'P5-P7',
    evalType: 'okr',
    dimensions: techDimensions,
    evalNodes: DEFAULT_EVAL_NODES,
    gradeMapping: DEFAULT_GRADE_MAPPING,
    status: 1,
    version: 2,
    inUse: true,
    remark: '技术主流岗位通用评估表',
    createdBy: '张HR',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-02-15 14:00:00'
  },
  {
    id: 2,
    templateNo: 'TPL2026P001',
    templateName: '产品设计 - P5~P7 绩效评估表',
    jobFamily: '产品设计',
    level: 'P5-P7',
    evalType: 'okr',
    dimensions: productDimensions,
    evalNodes: DEFAULT_EVAL_NODES,
    gradeMapping: DEFAULT_GRADE_MAPPING,
    status: 1,
    version: 1,
    inUse: true,
    remark: '产品岗通用评估表',
    createdBy: '张HR',
    createTime: '2026-01-10 10:30:00',
    updateTime: '2026-01-10 10:30:00'
  },
  {
    id: 3,
    templateNo: 'TPL2026M001',
    templateName: '管理岗 - 总监及以上评估表',
    jobFamily: '管理岗位',
    level: '总监及以上',
    evalType: 'mixed',
    dimensions: managerDimensions,
    evalNodes: [
      { nodeType: 'self', nodeName: '自评', weight: 10, order: 1, deadlineDays: 5 },
      { nodeType: 'direct', nodeName: '直属上级评', weight: 50, order: 2, deadlineDays: 7 },
      { nodeType: 'skip', nodeName: '隔级 / HRD 评', weight: 40, order: 3, deadlineDays: 5 },
      { nodeType: 'hr', nodeName: 'HR 归档', weight: 0, order: 4, deadlineDays: 3 }
    ],
    gradeMapping: DEFAULT_GRADE_MAPPING,
    status: 1,
    version: 1,
    inUse: false,
    remark: '管理岗专用，隔级权重加大',
    createdBy: '张HR',
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-01-15 10:00:00'
  },
  {
    id: 4,
    templateNo: 'TPL2026S001',
    templateName: '销售 - 全体 KPI 评估表',
    jobFamily: '运营市场',
    level: '全部',
    evalType: 'kpi',
    dimensions: salesDimensions,
    evalNodes: [
      { nodeType: 'self', nodeName: '自评', weight: 5, order: 1, deadlineDays: 3 },
      { nodeType: 'direct', nodeName: '直属主管评', weight: 75, order: 2, deadlineDays: 5 },
      { nodeType: 'hr', nodeName: 'HR 归档', weight: 20, order: 3, deadlineDays: 3 }
    ],
    gradeMapping: DEFAULT_GRADE_MAPPING,
    status: 1,
    version: 3,
    inUse: true,
    remark: '销售业绩导向，业绩权重 70%',
    createdBy: '张HR',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2026-03-01 14:00:00'
  },
  {
    id: 5,
    templateNo: 'TPL2026F001',
    templateName: '职能支持 - 通用评估表',
    jobFamily: '职能支持',
    level: '全部',
    evalType: 'kpi',
    dimensions: functionDimensions,
    evalNodes: DEFAULT_EVAL_NODES,
    gradeMapping: DEFAULT_GRADE_MAPPING,
    status: 1,
    version: 1,
    inUse: true,
    remark: '职能岗位（HR / 财务 / 行政等）通用',
    createdBy: '张HR',
    createTime: '2026-01-12 10:00:00',
    updateTime: '2026-01-12 10:00:00'
  },
  {
    id: 6,
    templateNo: 'TPL2026PIP001',
    templateName: 'PIP 专用 - 改进计划评估表',
    jobFamily: '全部',
    level: '全部',
    evalType: 'kpi',
    dimensions: pipDimensions,
    evalNodes: [
      { nodeType: 'self', nodeName: '自评（改进反思）', weight: 20, order: 1, deadlineDays: 3 },
      { nodeType: 'direct', nodeName: '直属上级评', weight: 50, order: 2, deadlineDays: 5 },
      { nodeType: 'hr', nodeName: 'HR + HRBP 评', weight: 30, order: 3, deadlineDays: 3 }
    ],
    gradeMapping: [
      { grade: 'A', minScore: 80, maxScore: 100, label: '通过（回归正常绩效）' },
      { grade: 'B', minScore: 60, maxScore: 79, label: '延期（延长 1 个月）' },
      { grade: 'D', minScore: 0, maxScore: 59, label: '不通过（进入离职流程）' }
    ],
    status: 1,
    version: 1,
    inUse: false,
    remark: '仅用于 PIP 改进计划考核',
    createdBy: '张HR',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-02-01 10:00:00'
  }
]

export const performanceTemplateMock = createCrudMock<PerformanceTemplate>(mockTemplates, {
  searchFields: ['templateName', 'jobFamily', 'level', 'remark'],
  sortField: 'updateTime'
})

/* ========== 业务操作 ========== */

/**
 * 复制为新版本（已启用被引用的模板编辑必须走这条路）
 */
export function cloneTemplateMock(id: number): PerformanceTemplate {
  const src = performanceTemplateMock.getDetail(id)
  if (!src) throw new Error('模板不存在')
  const all = performanceTemplateMock.getData()
  const nextId = Math.max(...all.map((t) => t.id), 0) + 1
  const newTpl: PerformanceTemplate = {
    ...src,
    id: nextId,
    templateNo: `${src.templateNo}-V${src.version + 1}`,
    templateName: `${src.templateName} (V${src.version + 1})`,
    version: src.version + 1,
    inUse: false,
    dimensions: JSON.parse(JSON.stringify(src.dimensions)),
    evalNodes: JSON.parse(JSON.stringify(src.evalNodes)),
    gradeMapping: JSON.parse(JSON.stringify(src.gradeMapping)),
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  all.push(newTpl)
  return newTpl
}

/**
 * 权重校验工具
 */
export function validateWeights(t: Partial<PerformanceTemplate>): string | null {
  // 维度权重
  const dimSum = (t.dimensions || []).reduce((s, d) => s + (d.weight || 0), 0)
  if (Math.round(dimSum) !== 100) return `维度权重总和 = ${dimSum}（应为 100）`

  // 子指标权重
  for (const d of t.dimensions || []) {
    const subSum = d.subIndicators.reduce((s, i) => s + (i.weight || 0), 0)
    if (Math.round(subSum) !== 100) return `「${d.name}」下子指标权重总和 = ${subSum}（应为 100）`
  }

  // 节点权重
  const nodeSum = (t.evalNodes || []).reduce((s, n) => s + (n.weight || 0), 0)
  if (Math.round(nodeSum) !== 100) return `节点权重总和 = ${nodeSum}（应为 100）`

  // 等级映射不重叠不留空
  const grades = [...(t.gradeMapping || [])].sort((a, b) => a.minScore - b.minScore)
  for (let i = 0; i < grades.length - 1; i++) {
    if (grades[i].maxScore + 1 !== grades[i + 1].minScore) return `等级映射存在缝隙或重叠`
  }
  return null
}
