<template>
  <div class="page-container">
    <!-- 面包屑 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <el-button text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回简历池
        </el-button>
        <span class="divider">|</span>
        <span class="page-info">候选人详情 · {{ resume?.candidateName || '—' }}</span>
        <div class="breadcrumb-spacer"></div>
        <el-button type="primary" plain :disabled="!resume" @click="aiParseVisible = true">
          <el-icon><ArtAiIcon /></el-icon>
          AI 简历解析
        </el-button>
      </div>
    </el-card>

    <!-- AI 简历解析 Drawer（与详情页并存，仅参考不污染候选人档案） -->
    <ResumeParseDrawer
      v-model="aiParseVisible"
      :context-input="buildResumeParseInput()"
      :candidate-name="resume?.candidateName || ''"
      :resume-raw="resume"
    />

    <!-- 主体 · 左候选人卡 + 右时间线 -->
    <div class="detail-layout" v-loading="loading">
      <!-- 左侧候选人信息卡 -->
      <el-card class="candidate-card">
        <div class="candidate-header">
          <div class="avatar" :style="{ background: avatarColor }">
            {{ firstChar }}
          </div>
          <div class="candidate-name">{{ resume?.candidateName || '—' }}</div>
          <div class="candidate-meta">
            {{ genderLabel }} · {{ resume?.age ?? '—' }} 岁 · {{ resume?.workYears ?? 0 }} 年经验
          </div>
          <el-tag :type="statusTagType" class="status-tag" effect="light">{{ statusLabel }}</el-tag>
        </div>

        <el-divider />

        <div class="info-section">
          <div class="section-title">基本信息</div>
          <div class="info-row">
            <span class="label">应聘岗位</span>
            <span class="value">{{ resume?.position || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">学历</span>
            <span class="value">{{ resume?.education || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">毕业院校</span>
            <span class="value">{{ resume?.school || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">期望薪资</span>
            <span class="value">{{ resume?.expectedSalary || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">来源渠道</span>
            <span class="value">{{ resume?.source || '—' }}</span>
          </div>
          <div class="info-row" v-if="resume?.jdMatchScore != null">
            <span class="label">JD 匹配度</span>
            <span class="value">
              <el-tag
                size="small"
                :type="resume.jdMatchScore >= 75 ? 'success' : resume.jdMatchScore >= 60 ? 'warning' : 'danger'"
              >
                {{ resume.jdMatchScore }} 分
              </el-tag>
            </span>
          </div>
        </div>

        <el-divider />

        <div class="info-section">
          <div class="section-title">联系方式</div>
          <div class="info-row">
            <span class="label">手机</span>
            <span class="value">{{ resume?.phone || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">邮箱</span>
            <span class="value email">{{ resume?.email || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="label">现居地</span>
            <span class="value">{{ resume?.location || '—' }}</span>
          </div>
        </div>

        <el-divider v-if="resume?.tags?.length" />

        <div class="info-section" v-if="resume?.tags?.length">
          <div class="section-title">标签</div>
          <div class="tags">
            <el-tag v-for="t in resume.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
          </div>
        </div>

        <el-divider />

        <div v-if="!stageActions.isTerminal" class="candidate-actions">
          <el-button v-if="stageActions.canScheduleInterview" type="primary" @click="handleScheduleInterview">安排面试</el-button>
          <el-button v-if="stageActions.canInitiateBGC" @click="handleInitiateBGC">发起背调</el-button>
          <el-button v-if="stageActions.canCreateOffer" type="success" @click="handleCreateOffer">发 Offer</el-button>
        </div>
        <el-alert
          v-else
          class="terminal-banner"
          :type="resume?.status === 4 ? 'success' : 'info'"
          :title="terminalBannerText"
          :closable="false"
          show-icon
        />
      </el-card>

      <!-- 右侧 Timeline -->
      <el-card class="timeline-card">
        <div class="timeline-header">
          <div class="section-title">候选人轨迹</div>
          <div class="section-hint">从投递到入职的关键节点</div>
        </div>
        <el-scrollbar class="timeline-scroll">
          <el-timeline class="candidate-timeline">
            <!-- 投递 -->
            <el-timeline-item
              :timestamp="resume?.createTime || '—'"
              placement="top"
              color="#909399"
              :icon="Document"
              size="large"
            >
              <div class="node-title">简历投递</div>
              <el-card class="node-body">
                <div class="node-grid">
                  <div class="info-row">
                    <span class="label">简历编号</span>
                    <span class="value">{{ resume?.resumeNo || '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">来源渠道</span>
                    <span class="value">{{ resume?.source || '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">JD 匹配度</span>
                    <span class="value">{{ resume?.jdMatchScore ?? '—' }} 分</span>
                  </div>
                  <div class="info-row">
                    <span class="label">解析状态</span>
                    <span class="value">
                      <el-tag v-if="resume?.parseStatus === 'success'" size="small" type="success">已解析</el-tag>
                      <el-tag v-else-if="resume?.parseStatus === 'manual'" size="small">人工修正</el-tag>
                      <el-tag v-else size="small" type="info">未解析</el-tag>
                    </span>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>

            <!-- 面试 -->
            <el-timeline-item placement="top" color="#409eff" :icon="ChatDotRound" size="large">
              <div class="node-title">
                面试<span v-if="interviews.length" class="node-count">· {{ interviews.length }} 轮</span>
              </div>
              <el-card v-if="interviews.length" class="node-body">
                <el-table :data="interviews" style="width: 100%" stripe>
                  <el-table-column label="轮次" min-width="150">
                    <template #default="{ row }">
                      第 {{ row.round }} 轮 · {{ interviewTypeLabel(row.interviewType || row.round) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="interviewTime" label="时间" min-width="160" />
                  <el-table-column label="面试官" min-width="110">
                    <template #default="{ row }">
                      {{ row.interviewer || row.interviewerNames || '—' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" min-width="90">
                    <template #default="{ row }">
                      <el-tag size="small" :type="interviewStatusMap[row.status]?.type || 'info'">
                        {{ interviewStatusMap[row.status]?.label || '—' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="结果" min-width="90">
                    <template #default="{ row }">
                      <el-tag v-if="row.result" size="small" :type="interviewResultMap[row.result]?.type || 'info'">
                        {{ interviewResultMap[row.result]?.label || '—' }}
                      </el-tag>
                      <span v-else class="text-muted">—</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评分" min-width="140">
                    <template #default="{ row }">
                      <el-rate
                        v-if="row.rating || row.score"
                        :model-value="(row.rating || row.score || 0) / 20"
                        disabled
                        size="small"
                      />
                      <span v-else class="text-muted">—</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
              <el-card v-else class="node-body empty">
                <el-empty :description="interviewEmptyDesc" :image-size="60">
                  <el-button
                    v-if="stageActions.canScheduleInterview"
                    type="primary"
                    size="small"
                    @click="handleScheduleInterview"
                  >
                    安排面试
                  </el-button>
                </el-empty>
              </el-card>
            </el-timeline-item>

            <!-- 背调 -->
            <el-timeline-item placement="top" color="#6f5ef9" :icon="Search" size="large">
              <div class="node-title">背景调查</div>
              <template v-if="bgChecks.length">
                <el-card v-for="bg in bgChecks" :key="bg.id" class="node-body">
                  <div class="node-grid">
                    <div class="info-row">
                      <span class="label">订单号</span>
                      <span class="value">{{ bg.orderNo }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">套餐</span>
                      <span class="value">{{ bg.packageName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">服务商</span>
                      <span class="value">{{ BG_VENDOR_MAP[bg.vendor as any] || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">订单状态</span>
                      <span class="value">
                        <el-tag size="small" :type="BG_STATUS_MAP[bg.status as any]?.type || 'info'">
                          {{ BG_STATUS_MAP[bg.status as any]?.label || '—' }}
                        </el-tag>
                      </span>
                    </div>
                    <div class="info-row" v-if="bg.conclusion !== undefined && bg.conclusion !== null">
                      <span class="label">结论</span>
                      <span class="value">
                        <el-tag size="small" :type="BG_CONCLUSION_MAP[bg.conclusion as any]?.type || 'info'">
                          {{ BG_CONCLUSION_MAP[bg.conclusion as any]?.label || '—' }}
                        </el-tag>
                      </span>
                    </div>
                    <div class="info-row" v-if="bg.riskLevel !== undefined && bg.riskLevel !== null">
                      <span class="label">风险等级</span>
                      <span class="value">
                        <el-tag size="small" :type="BG_RISK_LEVEL_MAP[bg.riskLevel as any]?.type || 'info'">
                          {{ BG_RISK_LEVEL_MAP[bg.riskLevel as any]?.label || '—' }}
                        </el-tag>
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="label">费用</span>
                      <span class="value">¥ {{ bg.cost }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">创建时间</span>
                      <span class="value">{{ bg.createTime }}</span>
                    </div>
                  </div>
                </el-card>
              </template>
              <el-card v-else class="node-body empty">
                <el-empty :description="bgcEmptyDesc" :image-size="60">
                  <el-button
                    v-if="stageActions.canInitiateBGC"
                    type="primary"
                    size="small"
                    @click="handleInitiateBGC"
                  >
                    发起背调
                  </el-button>
                </el-empty>
              </el-card>
            </el-timeline-item>

            <!-- Offer -->
            <el-timeline-item placement="top" color="#67c23a" :icon="Medal" size="large">
              <div class="node-title">Offer</div>
              <template v-if="offers.length">
                <el-card v-for="o in offers" :key="o.id" class="node-body">
                  <div class="node-grid">
                    <div class="info-row">
                      <span class="label">Offer 编号</span>
                      <span class="value">{{ o.offerNo }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">职位</span>
                      <span class="value">{{ o.positionName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">部门</span>
                      <span class="value">{{ o.departmentName || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">薪资</span>
                      <span class="value">{{ o.salary }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">期望入职</span>
                      <span class="value">{{ o.expectedJoinDate }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">状态</span>
                      <span class="value">
                        <el-tag size="small" :type="offerStatusMap[o.status]?.type || 'info'">
                          {{ offerStatusMap[o.status]?.label || '—' }}
                        </el-tag>
                      </span>
                    </div>
                  </div>
                </el-card>
              </template>
              <el-card v-else class="node-body empty">
                <el-empty :description="offerEmptyDesc" :image-size="60">
                  <el-button
                    v-if="stageActions.canCreateOffer"
                    type="primary"
                    size="small"
                    @click="handleCreateOffer"
                  >
                    发 Offer
                  </el-button>
                </el-empty>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Document, ChatDotRound, Search, Medal } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ResumeParseDrawer from './ResumeParseDrawer.vue'
import { getResumeDetail } from '@/api/recruitment/resume'
import { getInterviewsByCandidateName } from '@/api/recruitment/interview'
import { getBackgroundChecksByCandidateName } from '@/api/backgroundCheck'
import { getOffersByCandidateName } from '@/api/offer'
import { getJobPostingDetail } from '@/api/jobPosting'
import type { Resume, Interview, Offer } from '@/types/recruitment'
import type { BackgroundCheck } from '@/types/backgroundCheck'
import {
  BG_STATUS_MAP,
  BG_VENDOR_MAP,
  BG_CONCLUSION_MAP,
  BG_RISK_LEVEL_MAP
} from '@/types/backgroundCheck'

defineOptions({ name: 'RecruitmentResumeDetail' })

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const resume = ref<Resume | null>(null)
const interviews = ref<Interview[]>([])
const bgChecks = ref<BackgroundCheck[]>([])
const offers = ref<Offer[]>([])

// AI 简历解析（Drawer 抽屉，仅参考）
const aiParseVisible = ref(false)
const buildResumeParseInput = (): string => {
  if (!resume.value) return ''
  const r = resume.value
  // Mock 阶段：拼接 NER 输入；真接入 LLM 时由后端将原始简历文件文本传入
  return `姓名：${r.candidateName || '-'}
性别：${r.gender === 1 ? '男' : '女'}
年龄：${r.age || '-'} 岁
学历：${r.education || '-'} - ${r.school || '-'} ${r.major || ''}
工作经历：
${r.workExperience || '（暂无）'}

项目经历：
${r.projectExperience || '（暂无）'}

期望薪资：${r.expectedSalary || '-'}
应聘岗位：${r.position || '-'}
工作年限：${r.workYears || 0} 年`
}

// 面试类型 label
const interviewTypeLabel = (t: number | undefined) => {
  if (t === 1) return '初试'
  if (t === 2) return '复试'
  if (t === 3) return '终试'
  return '—'
}
const interviewStatusMap: Record<number, { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  1: { label: '待面试', type: 'warning' },
  2: { label: '已完成', type: 'success' },
  3: { label: '已取消', type: 'info' }
}
const interviewResultMap: Record<number, { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  1: { label: '通过', type: 'success' },
  2: { label: '待定', type: 'warning' },
  3: { label: '淘汰', type: 'danger' }
}

// Offer 状态 label
const offerStatusMap: Record<number, { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  1: { label: '待审批', type: 'warning' },
  2: { label: '已批准', type: 'primary' },
  3: { label: '审批拒绝', type: 'danger' },
  4: { label: '已发送', type: 'primary' },
  5: { label: '候选人接受', type: 'success' },
  6: { label: '候选人拒绝', type: 'danger' },
  7: { label: '已失效', type: 'info' }
}

const firstChar = computed(() => resume.value?.candidateName?.charAt(0) || '?')

const avatarColor = computed(() => {
  // 按姓名首字简单哈希映射到固定色板
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#6f5ef9', '#14c9c9', '#ff6b6b']
  const name = resume.value?.candidateName || ''
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % colors.length
  return colors[hash]
})

const genderLabel = computed(() => {
  const g = resume.value?.gender
  return g === 1 ? '男' : g === 2 ? '女' : '—'
})

type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
const statusMap: Record<number, { label: string; type: TagType }> = {
  1: { label: '待筛选', type: 'info' },
  2: { label: '待面试', type: 'warning' },
  3: { label: '面试中', type: 'primary' },
  4: { label: '已入库', type: 'success' },
  5: { label: '已淘汰', type: 'danger' }
}

const statusLabel = computed(() => statusMap[resume.value?.status || 0]?.label || '—')
const statusTagType = computed(() => statusMap[resume.value?.status || 0]?.type || 'info')

// 阶段门控 · 根据 resume.status 决定 3 个操作按钮的可用性
// 1 待筛选 / 2 待面试 / 3 面试中 / 4 已入库 / 5 已淘汰
const stageActions = computed(() => {
  const s = resume.value?.status || 0
  return {
    canScheduleInterview: s >= 1 && s <= 3,
    canInitiateBGC: s === 2 || s === 3,
    canCreateOffer: s === 3,
    isTerminal: s === 4 || s === 5
  }
})

const terminalBannerText = computed(() => {
  if (resume.value?.status === 4) return '候选人已入库 · 已加入人才库'
  if (resume.value?.status === 5) return '候选人已淘汰 · 流程已结束'
  return ''
})

const interviewEmptyDesc = computed(() => {
  const s = resume.value?.status
  if (s === 4 || s === 5) return '流程已结束，无面试记录'
  return '暂无面试记录'
})

const bgcEmptyDesc = computed(() => {
  const s = resume.value?.status
  if (s === 4 || s === 5) return '流程已结束，无背调记录'
  if (s === 1) return '请先完成面试后再发起背调'
  return '尚未发起背调'
})

const offerEmptyDesc = computed(() => {
  const s = resume.value?.status
  if (s === 4 || s === 5) return '流程已结束，无 Offer 记录'
  if (s === 1 || s === 2) return '请先完成面试后再发 Offer'
  return '尚未发送 Offer'
})

const load = async () => {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('无效的候选人 ID')
    return
  }
  loading.value = true
  try {
    const res = await getResumeDetail(id)
    if (res.code !== 200) {
      ElMessage.error(res.message || '加载失败')
      return
    }
    resume.value = res.data
    await loadRelated(res.data.candidateName)
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const loadRelated = async (candidateName: string) => {
  if (!candidateName) return
  const [ivRes, bgRes, ofRes] = await Promise.all([
    getInterviewsByCandidateName(candidateName).catch(() => ({ data: [] as Interview[] })),
    getBackgroundChecksByCandidateName(candidateName).catch(() => ({ data: [] as BackgroundCheck[] })),
    getOffersByCandidateName(candidateName).catch(() => ({ data: [] as Offer[] }))
  ])
  interviews.value = (ivRes as any).data || []
  bgChecks.value = (bgRes as any).data || []
  offers.value = (ofRes as any).data || []
}

const handleBack = () => {
  router.push('/recruit/resume')
}

const handleScheduleInterview = () => {
  if (!resume.value) return
  router.push({
    path: '/recruit/interview',
    query: {
      prefill: 'new',
      from: 'detail',
      candidateName: resume.value.candidateName,
      position: resume.value.position,
      resumeId: String(resume.value.id)
    }
  })
}

const handleInitiateBGC = () => {
  if (!resume.value) return
  router.push({
    path: '/recruit/ops-background-check',
    query: {
      prefill: 'new',
      from: 'detail',
      candidateName: resume.value.candidateName,
      position: resume.value.position,
      phone: resume.value.phone,
      email: resume.value.email,
      resumeId: String(resume.value.id)
    }
  })
}

const handleCreateOffer = async () => {
  if (!resume.value) return
  // 候选人 Resume 没有 departmentName 字段（关联 jobId → JobPosting 才有）
  // 真接入业务流：从 JobPosting 拉部门 + 工作地点 + 中位薪资等关联数据
  let departmentName = ''
  let workLocation = ''
  if (resume.value.jobId) {
    try {
      const res: any = await getJobPostingDetail(resume.value.jobId)
      departmentName = res?.data?.departmentName || ''
      workLocation = res?.data?.workLocation || ''
    } catch {
      // 拉不到不阻塞 Offer 创建，只是部门为空让 HR 手动确认
    }
  }
  router.push({
    path: '/recruit/offer',
    query: {
      prefill: 'new',
      from: 'detail',
      candidateName: resume.value.candidateName,
      positionName: resume.value.position,
      resumeId: String(resume.value.id),
      departmentName,
      workLocation
    }
  })
}

onMounted(() => {
  load()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    height: 60px;

    /* 返回按钮（text 类型）专属样式——不影响其他按钮 */
    & > .el-button.is-text {
      font-size: 14px;
      color: #606266;
      padding: 0;

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }

    .divider {
      color: #dcdfe6;
      font-size: 14px;
    }

    .page-info {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }

    .breadcrumb-spacer {
      flex: 1;
    }
  }
}

.detail-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  overflow: hidden;
}

.candidate-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 24px 20px;
    overflow-y: auto;
  }

  .candidate-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      color: #fff;
      font-size: 28px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .candidate-name {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .candidate-meta {
      font-size: 13px;
      color: #909399;
      margin-bottom: 10px;
    }

    .status-tag {
      font-size: 12px;
    }
  }

  :deep(.el-divider) {
    margin: 18px 0;
  }

  .info-section {
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      line-height: 1.8;
      padding: 3px 0;

      .label {
        color: #909399;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        text-align: right;
        word-break: break-all;

        &.email {
          font-size: 12px;
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  .candidate-actions {
    display: flex;
    flex-wrap: wrap;

    .el-button {
      flex: 1;
      min-width: 0;
    }

    .el-button:not(:first-child) {
      margin-left: 8px;
    }
  }

  .terminal-banner {
    flex-shrink: 0;
  }
}

.timeline-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .timeline-header {
    flex-shrink: 0;
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .section-hint {
      font-size: 12px;
      color: #909399;
    }
  }

  .timeline-scroll {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-right: 10px;
      padding-bottom: 20px;
    }
  }
}

.candidate-timeline {
  :deep(.el-timeline-item__timestamp) {
    font-size: 12px;
    color: #909399;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 24px;
  }

  .node-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;

    .node-count {
      margin-left: 8px;
      font-size: 12px;
      color: #909399;
      font-weight: 400;
    }
  }

  .text-muted {
    color: #c0c4cc;
  }

  .node-body {
    border: none !important;
    box-shadow: none !important;
    border-radius: 10px;
    background: #f7f9fc;

    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    &.empty {
      :deep(.el-card__body) {
        padding: 24px 20px;
      }

      :deep(.el-empty__description) {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .node-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 24px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;

      .label {
        color: #909399;
      }

      .value {
        color: #303133;
      }
    }
  }
}
</style>
