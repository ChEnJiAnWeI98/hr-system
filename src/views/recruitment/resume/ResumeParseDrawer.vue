<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    :size="800"
    :before-close="handleBeforeClose"
    @open="onOpen"
  >
    <template #header>
      <div class="drawer-header">
        <el-icon class="drawer-icon"><Document /></el-icon>
        <span class="drawer-title">智能简历解析 · {{ candidateName || '候选人' }}</span>
      </div>
    </template>

    <div v-if="loading" class="state-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在解析简历…</span>
    </div>

    <div v-else-if="error" class="state-error">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ error }}</span>
      <el-button size="small" @click="invoke">重试</el-button>
    </div>

    <div v-else-if="result" class="parse-page">
      <!-- ============ Header（HR 30 秒决策核心字段） ============ -->
      <div class="profile-header">
        <div class="header-main">
          <div class="header-top">
            <span class="header-name">{{ result.basicInfo.name }}</span>
            <span class="header-pos">
              {{ currentJob?.position || '—' }}
              <span class="header-at">@</span>
              <strong>{{ currentJob?.company || '—' }}</strong>
            </span>
          </div>
          <div class="header-bottom">
            <span class="header-meta-item">
              <el-icon><Briefcase /></el-icon>
              {{ totalYears }} 年经验
            </span>
            <span class="header-meta-item">
              <el-icon><School /></el-icon>
              {{ result.education[0]?.school }} · {{ result.education[0]?.degree }}
            </span>
            <span class="header-meta-item">
              <el-icon><Money /></el-icon>
              期望 {{ result.expectedSalary.monthly || '—' }}
            </span>
            <span v-if="result.basicInfo.location" class="header-meta-item">
              <el-icon><Location /></el-icon>
              {{ result.basicInfo.location }}
            </span>
            <el-tag
              v-if="currentJob?.isCurrent"
              size="small"
              type="warning"
              effect="dark"
              class="header-tag"
            >
              当前在职
            </el-tag>
            <el-tag
              v-if="hasFieldWarning"
              size="small"
              type="warning"
              effect="plain"
              class="header-tag"
            >
              <el-icon class="tag-icon"><WarningFilled /></el-icon>
              待复核
            </el-tag>
          </div>
        </div>

        <div class="header-actions">
          <el-button :icon="View" @click="rawVisible = true">查看原文</el-button>
          <el-button type="primary" :icon="Calendar" @click="handleSchedule">
            邀面试
          </el-button>
          <el-button
            :icon="isStarred ? StarFilled : Star"
            :type="isStarred ? 'warning' : 'default'"
            @click="handleStar"
          >
            {{ isStarred ? '已收藏' : '收藏' }}
          </el-button>
          <el-button :icon="Folder" @click="handleAddPool">
            {{ inTalentPool ? '查看人才库档案' : '加入人才库' }}
          </el-button>
        </div>
      </div>

      <!-- ============ AI 摘要带（1 行，业界标准） ============ -->
      <div class="ai-summary-bar">
        <el-icon class="ai-icon"><ArtAiIcon /></el-icon>
        <span class="ai-summary-text">{{ result.insights.aiSummary }}</span>
      </div>

      <!-- ============ Main + Right Panel ============ -->
      <div class="parse-body">
        <!-- ===== Main 主区（左 65%） ===== -->
        <el-scrollbar class="main-area">
          <!-- 工作经历（含项目，业界共识合并）-->
          <div class="info-card">
            <div class="card-head">
              <el-icon class="card-icon"><Briefcase /></el-icon>
              <span class="card-title">工作经历</span>
              <span class="card-meta">{{ result.workExperience.length }} 段 · 共 {{ totalYears }} 年</span>
            </div>

            <div
              v-for="(work, i) in result.workExperience"
              :key="i"
              class="work-item"
              :class="{ 'work-current': work.isCurrent }"
            >
              <div class="work-head">
                <span class="work-company">{{ work.company }}</span>
                <span v-if="work.department" class="work-dept">· {{ work.department }}</span>
                <span class="work-position">· {{ work.position }}</span>
                <el-tag
                  v-if="work.isCurrent"
                  size="small"
                  type="warning"
                  effect="dark"
                  class="work-current-tag"
                >
                  在职
                </el-tag>
              </div>
              <div class="work-time">
                {{ work.startDate }} ~ {{ work.endDate || '至今' }}
                <span v-if="work.duration" class="work-duration">（{{ work.duration }}）</span>
              </div>

              <ul class="work-achievements">
                <li v-for="(a, j) in work.achievements" :key="j">{{ a }}</li>
              </ul>

              <div v-if="work.keywords?.length" class="work-keywords">
                <el-tag
                  v-for="kw in work.keywords"
                  :key="kw"
                  size="small"
                  effect="plain"
                  class="kw-tag"
                >
                  {{ kw }}
                </el-tag>
              </div>

              <!-- 该段时间内的项目（合并展示，业界共识：项目挂工作下） -->
              <div
                v-if="getProjectsInRange(work).length > 0"
                class="work-projects"
              >
                <div class="work-projects-title">
                  <el-icon><Folder /></el-icon>
                  <span>关联项目</span>
                </div>
                <div
                  v-for="(p, k) in getProjectsInRange(work)"
                  :key="k"
                  class="project-mini"
                >
                  <span class="project-mini-name">{{ p.name }}</span>
                  <span class="project-mini-meta">
                    {{ p.role }}{{ p.teamSize ? ` · ${p.teamSize}` : '' }}
                  </span>
                  <div class="project-mini-output">{{ p.output }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 教育经历 -->
          <div class="info-card">
            <div class="card-head">
              <el-icon class="card-icon"><Reading /></el-icon>
              <span class="card-title">教育经历</span>
            </div>
            <div v-for="(edu, i) in result.education" :key="i" class="edu-item">
              <div class="edu-main">
                <strong>{{ edu.school }}</strong> · {{ edu.major }}
                <el-tag size="small" effect="plain" class="edu-degree">{{ edu.degree }}</el-tag>
              </div>
              <div class="edu-time" v-if="edu.startDate || edu.endDate">
                {{ edu.startDate }} ~ {{ edu.endDate }}
              </div>
            </div>
          </div>

          <!-- 技能 -->
          <div class="info-card">
            <div class="card-head">
              <el-icon class="card-icon"><Tools /></el-icon>
              <span class="card-title">技能</span>
              <span class="card-meta">主技能 · 加分 · 方向</span>
            </div>
            <div class="skill-row">
              <span class="skill-label">主技能</span>
              <el-tag
                v-for="s in result.skills.primary"
                :key="s"
                size="small"
                type="primary"
                effect="dark"
                class="skill-tag skill-primary"
              >
                <el-icon class="tag-icon"><StarFilled /></el-icon>
                {{ s }}
              </el-tag>
            </div>
            <div v-if="result.skills.secondary?.length" class="skill-row">
              <span class="skill-label">加分</span>
              <el-tag
                v-for="s in result.skills.secondary"
                :key="s"
                size="small"
                effect="plain"
                class="skill-tag"
              >
                {{ s }}
              </el-tag>
            </div>
            <div v-if="result.skills.direction?.length" class="skill-row">
              <span class="skill-label">方向</span>
              <el-tag
                v-for="s in result.skills.direction"
                :key="s"
                size="small"
                type="warning"
                effect="plain"
                class="skill-tag"
              >
                {{ s }}
              </el-tag>
            </div>
            <div class="skill-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>点击「找匹配岗位」可查看与具体岗位的命中详情</span>
            </div>
          </div>
        </el-scrollbar>

        <!-- ===== Right Panel（右 35%） ===== -->
        <el-scrollbar class="right-panel">
          <!-- 联系方式 -->
          <div class="side-card">
            <div class="side-head">
              <el-icon><Connection /></el-icon>
              <span>联系方式</span>
            </div>
            <div class="contact-row">
              <el-icon class="contact-icon"><Phone /></el-icon>
              <span>{{ result.basicInfo.phone || '—' }}</span>
            </div>
            <div class="contact-row">
              <el-icon class="contact-icon"><Message /></el-icon>
              <span>{{ result.basicInfo.email || '—' }}</span>
            </div>
            <div class="contact-row">
              <el-icon class="contact-icon"><LocationFilled /></el-icon>
              <span>{{ result.basicInfo.location || '—' }}</span>
            </div>
          </div>

          <!-- 字段校验 + AI 洞察细节（默认折叠） -->
          <el-collapse v-model="activeCollapse" class="side-collapse">
            <el-collapse-item name="checks">
              <template #title>
                <el-icon class="collapse-icon"><DocumentChecked /></el-icon>
                <span class="collapse-title">字段校验</span>
                <el-tag
                  v-if="warningCount > 0"
                  size="small"
                  type="warning"
                  effect="plain"
                  class="collapse-badge"
                >
                  {{ warningCount }} 项需复核
                </el-tag>
              </template>
              <div class="check-list">
                <div v-for="(c, i) in result.fieldChecks" :key="i" class="check-item">
                  <el-icon v-if="c.status === 'ok'" class="check-ok"><CircleCheck /></el-icon>
                  <el-icon v-else class="check-warn"><WarningFilled /></el-icon>
                  <div class="check-body">
                    <span class="check-field">{{ c.field }}</span>
                    <span v-if="c.reason" class="check-reason">{{ c.reason }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <el-collapse-item name="insights">
              <template #title>
                <el-icon class="collapse-icon"><DataAnalysis /></el-icon>
                <span class="collapse-title">AI 洞察详情</span>
              </template>

              <div class="insight-block">
                <div class="insight-row">
                  <span class="insight-label">
                    <el-icon><PieChart /></el-icon>
                    职业稳定性
                  </span>
                  <el-tag size="small" :type="hopTagType" effect="light">
                    {{ hopLabel }}
                  </el-tag>
                </div>
                <div class="insight-text">{{ result.insights.averageTenure }}</div>
                <div v-if="result.insights.jobHopComment" class="insight-comment">
                  {{ result.insights.jobHopComment }}
                </div>
              </div>

              <el-divider />

              <div class="insight-block">
                <div class="insight-label-block">
                  <el-icon><DataLine /></el-icon>
                  核心技能 · 使用上下文
                </div>
                <div class="skill-context-list">
                  <div
                    v-for="(s, i) in result.insights.skillContext"
                    :key="i"
                    class="skill-context-item"
                  >
                    <div class="sc-head">
                      <el-tag size="small" type="primary" effect="dark">
                        {{ s.skill }}
                      </el-tag>
                      <span v-if="s.duration" class="sc-duration">{{ s.duration }}</span>
                    </div>
                    <div class="sc-scenarios">{{ s.scenarios }}</div>
                  </div>
                </div>
              </div>

              <el-divider />

              <div class="insight-block">
                <div class="insight-label">
                  <el-icon><Aim /></el-icon>
                  行业聚焦
                </div>
                <div class="insight-text">{{ result.insights.industryFocus }}</div>
              </div>
            </el-collapse-item>
          </el-collapse>

          <!-- 期望薪资详情 -->
          <div class="side-card">
            <div class="side-head">
              <el-icon><Money /></el-icon>
              <span>期望薪资</span>
            </div>
            <div class="salary-row">
              <span class="salary-label">月薪</span>
              <strong>{{ result.expectedSalary.monthly || '—' }}</strong>
            </div>
            <div v-if="result.expectedSalary.package" class="salary-row">
              <span class="salary-label">年包</span>
              <span>{{ result.expectedSalary.package }}</span>
            </div>
            <div v-if="result.expectedSalary.estimatedAnnual" class="salary-row">
              <span class="salary-label">估算</span>
              <span class="estimated">{{ result.expectedSalary.estimatedAnnual }}</span>
            </div>
          </div>

          <div class="footer-hint">
            <el-icon><WarningFilled /></el-icon>
            <span>AI 字段抽取仅供 HR 初筛参考，关键字段入库前请人工复核。</span>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 简历原文 Dialog（按需打开） -->
    <el-dialog
      v-model="rawVisible"
      title="简历原文"
      width="700px"
      :append-to-body="true"
      top="6vh"
    >
      <el-scrollbar max-height="68vh">
        <div class="raw-doc">
          <div class="raw-section">
            <div class="raw-label">基本信息</div>
            <div class="raw-text">
              {{ candidateName }} · {{ resumeRaw?.gender === 1 ? '男' : '女' }} ·
              {{ resumeRaw?.age || '—' }} 岁 · {{ resumeRaw?.workYears || 0 }} 年经验
            </div>
            <div class="raw-text muted">
              {{ resumeRaw?.phone || '—' }} · {{ resumeRaw?.email || '—' }} ·
              {{ resumeRaw?.location || '—' }}
            </div>
          </div>
          <div class="raw-section">
            <div class="raw-label">教育经历</div>
            <div class="raw-text">
              {{ resumeRaw?.education }} · {{ resumeRaw?.school }} · {{ resumeRaw?.major }}
            </div>
          </div>
          <div class="raw-section">
            <div class="raw-label">工作经历</div>
            <pre class="raw-multiline">{{ resumeRaw?.workExperience || '（暂无）' }}</pre>
          </div>
          <div class="raw-section">
            <div class="raw-label">项目经历</div>
            <pre class="raw-multiline">{{ resumeRaw?.projectExperience || '（暂无）' }}</pre>
          </div>
          <div class="raw-section">
            <div class="raw-label">自我评价</div>
            <pre class="raw-multiline">{{ resumeRaw?.selfEvaluation || '（暂无）' }}</pre>
          </div>
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button @click="rawVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="result" :icon="Refresh" @click="invoke">重新解析</el-button>
        <el-button v-if="result" type="primary" :icon="DocumentCopy" @click="handleCopy">
          复制解析结果
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Loading,
  WarningFilled,
  DocumentCopy,
  Refresh,
  CircleCheck,
  View,
  Calendar,
  Star,
  StarFilled,
  Folder,
  Connection,
  DocumentChecked,
  DataAnalysis,
  Briefcase,
  School,
  Reading,
  Tools,
  Money,
  Location,
  LocationFilled,
  Phone,
  Message,
  Document,
  InfoFilled,
  PieChart,
  DataLine,
  Aim
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { invokeAIAbility, updateAIAdoption } from '@/api/performanceAI'
import type { ResumeParseResult } from '@/types/performanceAI'
import type { Resume } from '@/types/recruitment'

interface Props {
  modelValue: boolean
  contextInput: string
  candidateName?: string
  resumeRaw?: Resume | null
  operatorName?: string
}

const props = withDefaults(defineProps<Props>(), {
  candidateName: '',
  resumeRaw: null,
  operatorName: 'HR-Lisa'
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const error = ref('')
const result = ref<ResumeParseResult | null>(null)
const recordId = ref<number | null>(null)
const rawVisible = ref(false)
const activeCollapse = ref<string[]>([]) // 默认折叠

const onOpen = () => {
  result.value = null
  error.value = ''
  recordId.value = null
  activeCollapse.value = []
  checkStarred()
  if (props.contextInput.trim()) {
    invoke()
  } else {
    error.value = '简历内容为空，无法解析'
  }
}

const invoke = async () => {
  loading.value = true
  error.value = ''
  try {
    const res: any = await invokeAIAbility(
      'resume_parse',
      props.contextInput,
      props.operatorName,
      props.candidateName
    )
    result.value = (res.data?.structured as ResumeParseResult) || null
    recordId.value = res.data?.recordId || null
    if (!result.value) error.value = 'AI 返回数据格式异常，请重试'
  } catch (e: any) {
    error.value = e?.message || 'AI 调用失败，请重试'
  } finally {
    loading.value = false
  }
}

/** 当前在职工作 */
const currentJob = computed(() => {
  if (!result.value) return null
  return result.value.workExperience.find((w) => w.isCurrent) || result.value.workExperience[0]
})

/** 总工作年限（粗算）*/
const totalYears = computed(() => {
  if (!result.value) return 0
  return result.value.workExperience.length === 0
    ? 0
    : Math.round(
        result.value.workExperience.reduce((sum, w) => {
          const m = (w.duration || '').match(/(\d+(\.\d+)?)/)
          return sum + (m ? parseFloat(m[1]) : 0)
        }, 0)
      )
})

const hasFieldWarning = computed(() => {
  if (!result.value) return false
  return result.value.fieldChecks.some((c) => c.status === 'warning')
})
const warningCount = computed(() => {
  if (!result.value) return 0
  return result.value.fieldChecks.filter((c) => c.status === 'warning').length
})

const hopTagType = computed<'success' | 'warning' | 'danger'>(() => {
  if (!result.value) return 'success'
  if (result.value.insights.jobHopFrequency === 'low') return 'success'
  if (result.value.insights.jobHopFrequency === 'high') return 'danger'
  return 'success'
})
const hopLabel = computed(() => {
  if (!result.value) return ''
  const map = { low: '低 · 稳定', normal: '正常', high: '偏高' }
  return map[result.value.insights.jobHopFrequency]
})

/**
 * 把项目挂到匹配的工作经历下
 * 简单实现：按时间区间匹配（项目时间在该工作时间内则归属）
 */
const getProjectsInRange = (work: ResumeParseResult['workExperience'][number]) => {
  if (!result.value) return []
  return result.value.projects.filter((p) => {
    const workStartYear = (work.startDate || '').slice(0, 4)
    const workEndYear = work.endDate === '至今' ? '9999' : (work.endDate || '').slice(0, 4)
    const m = (p.duration || '').match(/(\d{4})/g)
    if (!m) return false
    const projYear = m[0]
    return projYear >= workStartYear && projYear <= workEndYear
  })
}

/* ========== 操作按钮 · 真功能 ========== */

const router = useRouter()

/** 收藏 · localStorage 持久化（HR 个人级别，不依赖后端） */
const STAR_KEY = 'hr_starred_resumes'
const isStarred = ref(false)
const checkStarred = () => {
  if (!props.resumeRaw) return
  const ids: number[] = JSON.parse(localStorage.getItem(STAR_KEY) || '[]')
  isStarred.value = ids.includes(props.resumeRaw.id)
}
const handleStar = () => {
  if (!props.resumeRaw) return
  const ids: number[] = JSON.parse(localStorage.getItem(STAR_KEY) || '[]')
  if (isStarred.value) {
    const next = ids.filter((i) => i !== props.resumeRaw!.id)
    localStorage.setItem(STAR_KEY, JSON.stringify(next))
    isStarred.value = false
    ElMessage.info('已取消收藏')
  } else {
    ids.push(props.resumeRaw.id)
    localStorage.setItem(STAR_KEY, JSON.stringify(ids))
    isStarred.value = true
    ElMessage.success('已收藏，可在简历池筛选「我的收藏」查看')
  }
}

/** 邀面试 · 跳转到面试管理页面 */
const handleSchedule = () => {
  if (!props.resumeRaw) return
  router.push({
    path: '/recruit/interview',
    query: { resumeId: props.resumeRaw.id, candidateName: props.resumeRaw.candidateName }
  })
  ElMessage.success('已跳转面试管理，请填写面试安排')
  visible.value = false
}

/** 人才库 · 已入库则跳转档案；未入库则直接创建档案 + 关联 */
const inTalentPool = computed(() => !!props.resumeRaw?.talentProfileId)
const handleAddPool = async () => {
  if (!props.resumeRaw) return

  if (inTalentPool.value) {
    ElMessage.info(`该候选人已在人才库（档案 ID: ${props.resumeRaw.talentProfileId}）`)
    router.push(`/recruit/ops-talent-pool?profileId=${props.resumeRaw.talentProfileId}`)
    visible.value = false
    return
  }

  try {
    // 1. 创建人才档案（基于简历真实字段 + AI 解析补充）
    const r = props.resumeRaw
    const { talentProfileApi } = await import('@/api/talentPool')
    const { linkResumeToTalent } = await import('@/api/recruitment/resume')

    const profileRes: any = await talentProfileApi.add({
      name: r.candidateName,
      gender: r.gender === 1 ? 'male' : r.gender === 2 ? 'female' : 'unknown',
      mobile: r.phone || '',
      email: r.email || '',
      currentCity: r.location || '',
      currentCompany: result.value?.workExperience[0]?.company || '',
      currentPosition: result.value?.workExperience[0]?.position || r.position || '',
      workYears: r.workYears || 0,
      highestEducation: r.education || '',
      profileStatus: 'active'
    } as any)

    const newProfileId = profileRes.data?.id
    if (!newProfileId) throw new Error('档案创建失败')

    // 2. 关联回简历
    await linkResumeToTalent(r.id, newProfileId)

    ElMessage.success(`已加入人才库（档案 ID: ${newProfileId}），跳转档案页`)
    router.push(`/recruit/ops-talent-pool?profileId=${newProfileId}`)
    visible.value = false
  } catch (e: any) {
    ElMessage.error(e?.message || '加入人才库失败')
  }
}

const handleCopy = async () => {
  if (recordId.value != null) {
    try {
      await updateAIAdoption(recordId.value, 'adopted', 0)
    } catch {
      /* 留痕失败不阻塞 */
    }
  }
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(result.value, null, 2))
    ElMessage.success('已复制结构化解析结果到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动选中文本')
  }
}

const handleBeforeClose = (done: () => void) => {
  done()
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;

  .drawer-icon {
    font-size: 18px;
    color: #409eff;
  }
}

/* 通用 tag 内嵌 icon */
.tag-icon {
  margin-right: 2px;
  font-size: 11px;
  vertical-align: -1px;
}

.state-loading,
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: #606266;
  font-size: 14px;

  .el-icon {
    font-size: 36px;
  }
}

.state-error .el-icon {
  color: #f56c6c;
}

.parse-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ============ Header ============ */
.profile-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f4f9ff 0%, #ffffff 100%);
  border: 1px solid #d9ecff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.header-main {
  flex: 1;
  min-width: 0;

  .header-top {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;

    .header-name {
      font-size: 24px;
      font-weight: 700;
      color: #303133;
      letter-spacing: -0.2px;
    }

    .header-pos {
      font-size: 14px;
      color: #606266;

      .header-at {
        margin: 0 4px;
        color: #c0c4cc;
      }

      strong {
        color: #303133;
      }
    }
  }

  .header-bottom {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 14px;

    .header-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #606266;

      .el-icon {
        color: #909399;
      }
    }

    .header-tag {
      margin-left: 4px;
    }
  }
}

.header-actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;

  .el-button:not(:first-child) {
    margin-left: 0;
  }
}

/* ============ AI 摘要带（indigo accent，业界标准） ============ */
.ai-summary-bar {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #eef2ff;
  border-left: 3px solid #6366f1;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #303133;
  line-height: 1.7;

  .ai-icon {
    color: #6366f1;
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
    animation: ai-pulse 2.4s ease-in-out infinite;
  }

  .ai-summary-text {
    flex: 1;
  }
}

@keyframes ai-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}

/* ============ Main + Right ============ */
.parse-body {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.main-area {
  flex: 0 0 65%;
  height: 100%;
}

.right-panel {
  flex: 1;
  height: 100%;
  border-left: 1px solid #ebeef5;
  padding-left: 16px;
}

/* ============ 主区卡片 ============ */
.info-card {
  margin-bottom: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ebeef5;

  .card-icon {
    font-size: 16px;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .card-meta {
    font-size: 12px;
    color: #909399;
  }
}

.work-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #fafbfc;
  border-radius: 6px;
  border-left: 3px solid #c0c4cc;

  &.work-current {
    border-left-color: #e6a23c;
    background: #fdf8e8;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.work-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;

  .work-company {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .work-dept,
  .work-position {
    font-size: 13px;
    color: #606266;
  }

  .work-current-tag {
    margin-left: 6px;
  }
}

.work-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;

  .work-duration {
    margin-left: 4px;
  }
}

.work-achievements {
  margin: 0 0 8px;
  padding-left: 16px;
  font-size: 13px;
  color: #303133;
  line-height: 1.7;

  li {
    margin-bottom: 4px;
  }
}

.work-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;

  .kw-tag {
    font-size: 11px;
  }
}

.work-projects {
  margin-top: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px dashed #d9ecff;

  .work-projects-title {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #409eff;
    margin-bottom: 8px;

    .el-icon {
      font-size: 13px;
    }
  }
}

.project-mini {
  font-size: 12.5px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .project-mini-name {
    font-weight: 600;
    color: #303133;
    margin-right: 6px;
  }

  .project-mini-meta {
    font-size: 11px;
    color: #909399;
  }

  .project-mini-output {
    margin-top: 2px;
    color: #606266;
    line-height: 1.6;
  }
}

.edu-item {
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }

  .edu-main {
    color: #303133;

    .edu-degree {
      margin-left: 6px;
    }
  }

  .edu-time {
    font-size: 12px;
    color: #909399;
  }
}

.skill-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;

  .skill-label {
    flex-shrink: 0;
    width: 40px;
    font-size: 12px;
    color: #909399;
  }

  .skill-tag {
    font-size: 12px;
  }
}

.skill-hint {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;

  .el-icon {
    color: #6366f1;
    font-size: 13px;
  }
}

/* ============ Right Panel ============ */
.side-card {
  margin-bottom: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.side-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #303133;

  &:last-child {
    margin-bottom: 0;
  }

  .contact-icon {
    color: #909399;
    font-size: 14px;
    flex-shrink: 0;
  }
}

.salary-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  color: #303133;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }

  .salary-label {
    flex-shrink: 0;
    width: 40px;
    color: #909399;
    font-size: 12px;
  }

  .estimated {
    color: #67c23a;
    font-weight: 600;
  }
}

.side-collapse {
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;

  :deep(.el-collapse-item__header) {
    padding: 0 12px;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    height: 40px;
    display: flex;
    align-items: center;
  }

  :deep(.el-collapse-item__content) {
    padding: 12px 14px;
    background: #fafbfc;
  }

  .collapse-icon {
    margin-right: 6px;
    color: #606266;
  }

  .collapse-title {
    flex: 1;
  }

  .collapse-badge {
    margin-right: 8px;
  }
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;

  .check-ok {
    color: #67c23a;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .check-warn {
    color: #e6a23c;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .check-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .check-field {
      color: #303133;
      font-weight: 500;
    }

    .check-reason {
      color: #b88230;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
    }
  }
}

.insight-block {
  font-size: 12.5px;
  color: #303133;

  .insight-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .insight-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    color: #606266;

    .el-icon {
      font-size: 13px;
      color: #909399;
    }
  }

  .insight-label-block {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 8px;

    .el-icon {
      font-size: 13px;
      color: #909399;
    }
  }

  .insight-text {
    color: #606266;
    line-height: 1.6;
  }

  .insight-comment {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }
}

.skill-context-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-context-item {
  padding: 6px 8px;
  background: #fff;
  border-radius: 4px;
  border-left: 2px solid #d9ecff;

  .sc-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .sc-duration {
      font-size: 11px;
      color: #67c23a;
      font-weight: 500;
    }
  }

  .sc-scenarios {
    font-size: 11.5px;
    color: #606266;
    line-height: 1.5;
  }
}

.footer-hint {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fdf6ec;
  border-left: 3px solid #faad14;
  border-radius: 4px;
  font-size: 11.5px;
  color: #b88230;
  line-height: 1.6;

  .el-icon {
    color: #faad14;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

/* 简历原文 Dialog */
.raw-doc {
  padding: 0 4px;
}

.raw-section {
  margin-bottom: 16px;

  .raw-label {
    font-size: 12px;
    font-weight: 600;
    color: #909399;
    margin-bottom: 4px;
  }

  .raw-text {
    font-size: 13px;
    color: #303133;
    line-height: 1.7;

    &.muted {
      color: #909399;
      font-size: 12px;
    }
  }

  .raw-multiline {
    margin: 0;
    padding: 8px 10px;
    background: #fafbfc;
    border-radius: 4px;
    font-family: inherit;
    white-space: pre-wrap;
    font-size: 12.5px;
    color: #606266;
    line-height: 1.7;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
