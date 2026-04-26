/**
 * 岗位体系 Mock 数据（Phase 1.3）
 * 6 岗位族 × 多个序列 × P2~P10 + M1~M5
 */
import type { LevelSpec, JobSequence, Position } from '@/types/org/position'

/** ========== 职级体系 ========== */

export const LEVEL_SPECS: LevelSpec[] = [
  // 专业序列 P1~P10
  { code: 'P1', name: 'P1（助理）', track: 'professional', rank: 1 },
  { code: 'P2', name: 'P2（初级）', track: 'professional', rank: 2 },
  { code: 'P3', name: 'P3（中级）', track: 'professional', rank: 3 },
  { code: 'P4', name: 'P4（中高级）', track: 'professional', rank: 4 },
  { code: 'P5', name: 'P5（高级）', track: 'professional', rank: 5 },
  { code: 'P6', name: 'P6（资深）', track: 'professional', rank: 6 },
  { code: 'P7', name: 'P7（专家）', track: 'professional', rank: 7 },
  { code: 'P8', name: 'P8（高级专家）', track: 'professional', rank: 8 },
  { code: 'P9', name: 'P9（资深专家）', track: 'professional', rank: 9 },
  { code: 'P10', name: 'P10（首席专家）', track: 'professional', rank: 10 },
  // 管理序列 M1~M5
  { code: 'M1', name: 'M1（组长）', track: 'management', rank: 5 },
  { code: 'M2', name: 'M2（经理）', track: 'management', rank: 6 },
  { code: 'M3', name: 'M3（总监）', track: 'management', rank: 8 },
  { code: 'M4', name: 'M4（副总裁）', track: 'management', rank: 9 },
  { code: 'M5', name: 'M5（总裁）', track: 'management', rank: 10 }
]

/** ========== 岗位序列 ========== */

export const JOB_SEQUENCES: JobSequence[] = [
  // 技术族
  { code: 'TECH_BACKEND', name: '后端开发', familyCode: 'TECH', levelMin: 'P2', levelMax: 'P10', description: '后端/服务端开发' },
  { code: 'TECH_FRONTEND', name: '前端开发', familyCode: 'TECH', levelMin: 'P2', levelMax: 'P10', description: '前端/Web 开发' },
  { code: 'TECH_ALGO', name: '算法', familyCode: 'TECH', levelMin: 'P3', levelMax: 'P10', description: '机器学习/AI 算法' },
  { code: 'TECH_QA', name: '测试', familyCode: 'TECH', levelMin: 'P2', levelMax: 'P8' },
  { code: 'TECH_OPS', name: '运维', familyCode: 'TECH', levelMin: 'P2', levelMax: 'P8' },
  { code: 'TECH_ARCH', name: '架构', familyCode: 'TECH', levelMin: 'P6', levelMax: 'P10' },
  // 产品族
  { code: 'PROD_PM', name: '产品经理', familyCode: 'PROD', levelMin: 'P3', levelMax: 'P10' },
  { code: 'PROD_DESIGN', name: '产品设计', familyCode: 'PROD', levelMin: 'P3', levelMax: 'P9' },
  { code: 'PROD_UX', name: '交互设计', familyCode: 'PROD', levelMin: 'P3', levelMax: 'P8' },
  { code: 'PROD_UI', name: 'UI 设计', familyCode: 'PROD', levelMin: 'P3', levelMax: 'P8' },
  // 销售族
  { code: 'SALES_REP', name: '销售代表', familyCode: 'SALES', levelMin: 'P3', levelMax: 'P7' },
  { code: 'SALES_BIZ', name: '商务经理', familyCode: 'SALES', levelMin: 'P3', levelMax: 'P8' },
  { code: 'SALES_KA', name: '大客户经理', familyCode: 'SALES', levelMin: 'P5', levelMax: 'P9' },
  // 运营族
  { code: 'OPS_CONTENT', name: '内容运营', familyCode: 'OPS', levelMin: 'P3', levelMax: 'P8' },
  { code: 'OPS_USER', name: '用户运营', familyCode: 'OPS', levelMin: 'P3', levelMax: 'P8' },
  { code: 'OPS_ACTIVITY', name: '活动运营', familyCode: 'OPS', levelMin: 'P3', levelMax: 'P8' },
  // 职能族
  { code: 'FUNC_HR', name: '人力资源', familyCode: 'FUNC', levelMin: 'P3', levelMax: 'P9' },
  { code: 'FUNC_FIN', name: '财务', familyCode: 'FUNC', levelMin: 'P3', levelMax: 'P9' },
  { code: 'FUNC_LEGAL', name: '法务', familyCode: 'FUNC', levelMin: 'P4', levelMax: 'P9' },
  { code: 'FUNC_ADMIN', name: '行政', familyCode: 'FUNC', levelMin: 'P2', levelMax: 'P7' },
  // 管理族
  { code: 'MGMT_TEAM_LEAD', name: '团队管理（组）', familyCode: 'MGMT', levelMin: 'M1', levelMax: 'M1' },
  { code: 'MGMT_DEPT', name: '部门管理（部门/中心）', familyCode: 'MGMT', levelMin: 'M2', levelMax: 'M3' },
  { code: 'MGMT_EXEC', name: '高管', familyCode: 'MGMT', levelMin: 'M4', levelMax: 'M5' }
]

/** ========== 岗位 ========== */

/** 构造岗位的简易工厂 */
let positionAutoId = 0
function pos(
  code: string,
  name: string,
  familyCode: any,
  sequenceCode: string,
  levelMin: string,
  levelMax: string,
  jobDescription: string,
  qualification: string,
  sortOrder: number
): Position {
  positionAutoId += 1
  return {
    id: positionAutoId,
    positionCode: code,
    positionName: name,
    familyCode,
    sequenceCode,
    levelMin,
    levelMax,
    jobDescription,
    qualification,
    status: 1,
    sortOrder,
    createTime: '2016-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  }
}

export const POSITIONS: Position[] = [
  // ===== 技术族 =====
  pos('POSTECH001', '初级后端工程师', 'TECH', 'TECH_BACKEND', 'P2', 'P3', '负责服务端功能模块的开发', '本科以上，扎实的 Java/Go 基础', 1),
  pos('POSTECH002', '中级后端工程师', 'TECH', 'TECH_BACKEND', 'P3', 'P5', '独立负责业务模块设计与开发', '2+ 年后端经验，熟悉分布式', 2),
  pos('POSTECH003', '高级后端工程师', 'TECH', 'TECH_BACKEND', 'P5', 'P7', '主导核心系统架构', '5+ 年后端经验，具备架构能力', 3),
  pos('POSTECH004', '后端技术专家', 'TECH', 'TECH_BACKEND', 'P7', 'P10', '业务领域技术带头人', '8+ 年经验，行业级技术影响力', 4),
  pos('POSTECH005', '初级前端工程师', 'TECH', 'TECH_FRONTEND', 'P2', 'P3', '负责 Web 端功能开发', '本科以上，熟悉 HTML/CSS/JS', 5),
  pos('POSTECH006', '中级前端工程师', 'TECH', 'TECH_FRONTEND', 'P3', 'P5', '独立负责前端业务模块', '2+ 年前端经验，熟悉 Vue/React', 6),
  pos('POSTECH007', '高级前端工程师', 'TECH', 'TECH_FRONTEND', 'P5', 'P7', '主导前端架构', '5+ 年前端经验，有架构经验', 7),
  pos('POSTECH008', '前端技术专家', 'TECH', 'TECH_FRONTEND', 'P7', 'P10', '前端领域技术专家', '8+ 年经验', 8),
  pos('POSTECH009', '算法工程师', 'TECH', 'TECH_ALGO', 'P3', 'P5', '机器学习算法开发', '硕士以上，扎实数学基础', 9),
  pos('POSTECH010', '高级算法工程师', 'TECH', 'TECH_ALGO', 'P5', 'P7', '主导核心算法模型', '5+ 年 AI 相关经验', 10),
  pos('POSTECH011', '算法专家', 'TECH', 'TECH_ALGO', 'P7', 'P10', '算法技术带头人', '行业级算法影响力', 11),
  pos('POSTECH012', '测试工程师', 'TECH', 'TECH_QA', 'P2', 'P4', '功能测试与自动化', '1+ 年测试经验', 12),
  pos('POSTECH013', '高级测试工程师', 'TECH', 'TECH_QA', 'P4', 'P7', '质量保障体系建设', '5+ 年测试经验', 13),
  pos('POSTECH014', '运维工程师', 'TECH', 'TECH_OPS', 'P2', 'P5', 'CI/CD + 系统稳定性', '2+ 年运维经验', 14),
  pos('POSTECH015', '高级运维工程师', 'TECH', 'TECH_OPS', 'P5', 'P8', '大规模系统架构运维', '5+ 年经验，云原生', 15),
  pos('POSTECH016', '系统架构师', 'TECH', 'TECH_ARCH', 'P6', 'P8', '系统架构设计', '8+ 年经验，具备大型系统架构经验', 16),
  pos('POSTECH017', '高级架构师', 'TECH', 'TECH_ARCH', 'P8', 'P10', '集团级架构决策', '10+ 年经验', 17),
  pos('POSTECH018', '首席架构师', 'TECH', 'TECH_ARCH', 'P10', 'P10', '集团技术战略', '业界资深专家', 18),

  // ===== 产品族 =====
  pos('POSPROD001', '产品经理', 'PROD', 'PROD_PM', 'P3', 'P5', '产品功能规划与设计', '3+ 年产品经验', 19),
  pos('POSPROD002', '高级产品经理', 'PROD', 'PROD_PM', 'P5', 'P7', '产品线规划', '5+ 年产品经验', 20),
  pos('POSPROD003', '产品专家', 'PROD', 'PROD_PM', 'P7', 'P10', '产品战略制定', '8+ 年经验', 21),
  pos('POSPROD004', '产品设计师', 'PROD', 'PROD_DESIGN', 'P3', 'P5', '产品视觉与设计', '3+ 年设计经验', 22),
  pos('POSPROD005', '高级产品设计师', 'PROD', 'PROD_DESIGN', 'P5', 'P7', '产品设计体系建设', '5+ 年经验', 23),
  pos('POSPROD006', '设计专家', 'PROD', 'PROD_DESIGN', 'P7', 'P9', '设计战略', '8+ 年经验', 24),
  pos('POSPROD007', 'UX 设计师', 'PROD', 'PROD_UX', 'P3', 'P5', '交互设计', '熟悉交互原则', 25),
  pos('POSPROD008', '高级 UX 设计师', 'PROD', 'PROD_UX', 'P5', 'P8', '交互规范建设', '5+ 年经验', 26),
  pos('POSPROD009', 'UI 设计师', 'PROD', 'PROD_UI', 'P3', 'P5', '视觉设计', '3+ 年设计经验', 27),
  pos('POSPROD010', '高级 UI 设计师', 'PROD', 'PROD_UI', 'P5', 'P8', '视觉体系建设', '5+ 年经验', 28),
  pos('POSPROD011', '产品助理', 'PROD', 'PROD_PM', 'P3', 'P3', '协助产品经理工作', '1+ 年经验', 29),
  pos('POSPROD012', '高级交互设计师', 'PROD', 'PROD_UX', 'P6', 'P8', '复杂产品交互架构', '6+ 年经验', 30),

  // ===== 销售族 =====
  pos('POSSALES001', '销售代表', 'SALES', 'SALES_REP', 'P3', 'P5', '客户开拓与维护', '3+ 年销售经验', 31),
  pos('POSSALES002', '高级销售代表', 'SALES', 'SALES_REP', 'P5', 'P7', '重点客户销售', '5+ 年销售经验', 32),
  pos('POSSALES003', '商务经理', 'SALES', 'SALES_BIZ', 'P4', 'P7', '商务谈判与合作', '4+ 年商务经验', 33),
  pos('POSSALES004', '高级商务经理', 'SALES', 'SALES_BIZ', 'P7', 'P8', '关键合作项目', '7+ 年商务经验', 34),
  pos('POSSALES005', '大客户经理', 'SALES', 'SALES_KA', 'P5', 'P7', '战略客户运营', '5+ 年 KA 经验', 35),
  pos('POSSALES006', '高级大客户经理', 'SALES', 'SALES_KA', 'P7', 'P9', '头部客户深度运营', '7+ 年经验', 36),

  // ===== 运营族 =====
  pos('POSOPS001', '内容运营', 'OPS', 'OPS_CONTENT', 'P3', 'P5', '内容策划与运营', '3+ 年运营经验', 37),
  pos('POSOPS002', '高级内容运营', 'OPS', 'OPS_CONTENT', 'P5', 'P7', '内容体系规划', '5+ 年经验', 38),
  pos('POSOPS003', '内容运营专家', 'OPS', 'OPS_CONTENT', 'P7', 'P8', '内容战略', '7+ 年经验', 39),
  pos('POSOPS004', '用户运营', 'OPS', 'OPS_USER', 'P3', 'P5', '用户增长与留存', '3+ 年经验', 40),
  pos('POSOPS005', '高级用户运营', 'OPS', 'OPS_USER', 'P5', 'P8', '用户运营体系', '5+ 年经验', 41),
  pos('POSOPS006', '活动运营', 'OPS', 'OPS_ACTIVITY', 'P3', 'P5', '活动策划与执行', '3+ 年经验', 42),
  pos('POSOPS007', '高级活动运营', 'OPS', 'OPS_ACTIVITY', 'P5', 'P8', '大型活动策划', '5+ 年经验', 43),
  pos('POSOPS008', '运营专家', 'OPS', 'OPS_ACTIVITY', 'P7', 'P8', '运营体系建设', '7+ 年经验', 44),
  pos('POSOPS009', '运营助理', 'OPS', 'OPS_CONTENT', 'P3', 'P3', '运营协助', '1+ 年经验', 45),

  // ===== 职能族 =====
  pos('POSFUNC001', 'HR 专员', 'FUNC', 'FUNC_HR', 'P3', 'P4', '人力资源事务性工作', '2+ 年 HR 经验', 46),
  pos('POSFUNC002', 'HR 主管', 'FUNC', 'FUNC_HR', 'P4', 'P6', 'HR 模块管理', '4+ 年 HR 经验', 47),
  pos('POSFUNC003', 'HRBP', 'FUNC', 'FUNC_HR', 'P6', 'P8', '事业部 HR 业务伙伴', '6+ 年 HR 经验', 48),
  pos('POSFUNC004', 'HR 专家', 'FUNC', 'FUNC_HR', 'P7', 'P9', 'HR 体系建设', '7+ 年经验', 49),
  pos('POSFUNC005', '财务专员', 'FUNC', 'FUNC_FIN', 'P3', 'P5', '日常财务核算', '3+ 年财务经验', 50),
  pos('POSFUNC006', '财务主管', 'FUNC', 'FUNC_FIN', 'P5', 'P7', '财务团队管理', '5+ 年经验', 51),
  pos('POSFUNC007', '财务专家', 'FUNC', 'FUNC_FIN', 'P7', 'P9', '财务战略', '7+ 年经验', 52),
  pos('POSFUNC008', '法务专员', 'FUNC', 'FUNC_LEGAL', 'P4', 'P6', '合规审查', '4+ 年法务经验', 53),
  pos('POSFUNC009', '法务经理', 'FUNC', 'FUNC_LEGAL', 'P6', 'P9', '法务团队管理', '6+ 年经验', 54),
  pos('POSFUNC010', '行政专员', 'FUNC', 'FUNC_ADMIN', 'P2', 'P4', '日常行政工作', '1+ 年经验', 55),
  pos('POSFUNC011', '行政主管', 'FUNC', 'FUNC_ADMIN', 'P4', 'P7', '行政管理', '4+ 年经验', 56),
  pos('POSFUNC012', '助理', 'FUNC', 'FUNC_ADMIN', 'P2', 'P3', '管理层事务支持', '2+ 年经验', 57),

  // ===== 管理族 =====
  pos('POSMGMT001', '团队组长', 'MGMT', 'MGMT_TEAM_LEAD', 'M1', 'M1', '5-10 人小组管理', '3+ 年带团队经验', 58),
  pos('POSMGMT002', '部门经理', 'MGMT', 'MGMT_DEPT', 'M2', 'M2', '10-30 人部门管理', '5+ 年管理经验', 59),
  pos('POSMGMT003', '高级经理/总监', 'MGMT', 'MGMT_DEPT', 'M3', 'M3', '30-100 人中心管理', '7+ 年管理经验', 60),
  pos('POSMGMT004', '副总裁', 'MGMT', 'MGMT_EXEC', 'M4', 'M4', '事业部/子公司管理', '10+ 年高级管理经验', 61),
  pos('POSMGMT005', '总裁/CEO', 'MGMT', 'MGMT_EXEC', 'M5', 'M5', '集团业务管理', '15+ 年经验', 62)
]
