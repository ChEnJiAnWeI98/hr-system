<template>
  <div class="ai-container">
    <el-alert
      type="info"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
      title="AI 能力管理中心（管理员视角）"
      description="本页是全系统 AI 能力的集中管理入口。每个能力的真实调用已内嵌到对应业务页面（评语优化在绩效评估里、简历解析在候选人详情里、薪酬检查在 Offer/调薪里……）。在这里你可以查看能力目录、跳转到业务入口、查询全员调用记录、审计采纳率。"
    />

    <el-scrollbar class="content-scrollbar">
      <!-- 7 个 AI 能力卡片 -->
      <el-card class="section-card">
        <div class="section-title">AI 能力目录</div>
        <div class="ability-grid">
          <div
            v-for="ab in abilities"
            :key="ab.code"
            class="ability-card"
          >
            <div class="ab-head">
              <div class="ab-icon">{{ ab.icon }}</div>
              <div class="ab-meta">
                <div class="ab-name">{{ ab.name }}</div>
                <el-tag :type="MATURITY_TYPE[ab.maturity]" size="small">
                  {{ MATURITY_LABEL[ab.maturity] }}
                </el-tag>
              </div>
            </div>
            <div class="ab-desc">{{ ab.description }}</div>
            <div class="ab-usecase">
              <span class="ab-usecase-label">适用场景</span>
              <span>{{ ab.useCase }}</span>
            </div>
            <div class="ab-entry">
              <span class="ab-entry-label">业务入口</span>
              <span class="ab-entry-path">{{ ABILITY_ENTRY[ab.code] || '—' }}</span>
            </div>
            <div class="ab-actions">
              <el-button size="small" @click="handleJumpEntry(ab)">
                跳转到业务入口
              </el-button>
              <el-button type="primary" size="small" @click="handleOpenDemo(ab)">
                演示调用
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 调用记录 -->
      <el-card class="section-card">
        <div class="section-title-row">
          <div class="section-title">AI 调用记录（留痕）</div>
          <div>
            <el-select v-model="recordFilter" size="small" style="width: 160px" placeholder="按能力筛选" clearable @change="fetchRecords">
              <el-option
                v-for="ab in abilities"
                :key="ab.code"
                :label="ab.name"
                :value="ab.code"
              />
            </el-select>
          </div>
        </div>
        <el-table :data="recordList" border>
          <el-table-column prop="callTime" label="调用时间" width="160" />
          <el-table-column label="能力" width="160">
            <template #default="{ row }">
              <span style="margin-right: 4px">{{ getIcon(row.abilityCode) }}</span>
              {{ row.abilityName }}
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="调用人" width="110" />
          <el-table-column prop="targetEmployee" label="目标员工" width="110">
            <template #default="{ row }">
              <span v-if="row.targetEmployee">{{ row.targetEmployee }}</span>
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="inputSummary" label="输入摘要" min-width="220" show-overflow-tooltip />
          <el-table-column prop="outputSummary" label="输出摘要" min-width="260" show-overflow-tooltip />
          <el-table-column label="采纳结果" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="ADOPTION_RESULT_TYPE[row.adoptionResult as AdoptionResult]" size="small">
                {{ ADOPTION_RESULT_LABEL[row.adoptionResult as AdoptionResult] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="修改程度" width="100" align="center">
            <template #default="{ row }">
              <span v-if="row.modificationDegree !== undefined && row.modificationDegree !== null">
                {{ row.modificationDegree }}%
              </span>
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>

    <!-- 演示 Dialog -->
    <el-dialog
      v-model="demoDialogVisible"
      :title="demoAbility?.name ? `${demoAbility.icon} ${demoAbility.name}` : 'AI 能力演示'"
      width="860px"
      top="4vh"
    >
      <el-alert
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
        title="AI 辅助提示"
        description="当前为 Mock 环境，返回的是预置示例输出。实际环境需配置 AI 凭证后调用真实模型。所有 AI 生成内容必须 Review 后才能采纳。"
      />

      <el-form label-width="100px">
        <el-form-item label="输入">
          <el-input
            v-model="demoInput"
            type="textarea"
            :rows="5"
            placeholder="输入要交给 AI 处理的内容"
          />
        </el-form-item>
        <el-form-item label="目标员工" v-if="needsTarget">
          <el-select v-model="demoTarget" placeholder="选择目标员工" style="width: 100%">
            <el-option label="张伟（技术 P6）" value="张伟" />
            <el-option label="李娜（技术 P6）" value="李娜" />
            <el-option label="徐红（产品 P7）" value="徐红" />
            <el-option label="王强（技术 P7）" value="王强" />
          </el-select>
        </el-form-item>
        <div style="text-align: right; margin-bottom: 12px">
          <el-button type="primary" :loading="calling" @click="handleInvoke">
            <el-icon v-if="!calling"><ArtAiIcon /></el-icon>
            调用 AI
          </el-button>
        </div>

        <template v-if="demoOutput">
          <el-divider>AI 输出（草稿，请 Review）</el-divider>
          <div class="ai-output">{{ demoOutput }}</div>

          <el-divider>采纳结果</el-divider>
          <el-radio-group v-model="demoAdoption">
            <el-radio value="adopted">原样采纳</el-radio>
            <el-radio value="modified_adopted">修改后采纳</el-radio>
            <el-radio value="rejected">放弃</el-radio>
          </el-radio-group>
          <div v-if="demoAdoption === 'modified_adopted'" style="margin-top: 12px">
            <el-form-item label="修改程度">
              <el-slider v-model="demoModDegree" :min="0" :max="100" show-input />
            </el-form-item>
          </div>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="demoDialogVisible = false">关闭</el-button>
        <el-button v-if="demoOutput" type="primary" @click="handleConfirmAdoption">确认采纳结果</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  getAIAbilityList,
  getAICallRecordList,
  invokeAIAbility,
  updateAIAdoption
} from '@/api/performanceAI'
import {
  MATURITY_LABEL,
  MATURITY_TYPE,
  ADOPTION_RESULT_LABEL,
  ADOPTION_RESULT_TYPE
} from '@/types/performanceAI'
import type { AIAbility, AICallRecord, AIAbilityCode, AdoptionResult } from '@/types/performanceAI'

defineOptions({ name: 'PerformanceAIAssistant' })

const router = useRouter()

/** 每个 AI 能力的业务入口说明 + 跳转路径 */
const ABILITY_ENTRY: Record<AIAbilityCode, string> = {
  okr_check: '目标管理 · 新建/编辑目标时',
  meeting_agenda: '1on1 管理 / 绩效面谈 · 准备内容旁',
  risk_alert: '人才盘点 · 顶部 AI 洞察',
  comment_polish: '绩效评估 · 写整体评语时',
  resume_parse: '简历管理 · 候选人详情的 AI 解析 Tab',
  salary_sanity_check: 'Offer 管理 / 调薪申请 · 填完薪资后检查'
}

/** 业务入口路径 */
const ABILITY_ROUTE: Record<AIAbilityCode, string> = {
  okr_check: '/perf/goal',
  meeting_agenda: '/perf/one-on-one',
  risk_alert: '/talent/review',
  comment_polish: '/perf/evaluation',
  resume_parse: '/recruit/resume',
  salary_sanity_check: '/recruit/offer'
}

const handleJumpEntry = (ab: AIAbility) => {
  const path = ABILITY_ROUTE[ab.code]
  if (path) {
    router.push(path)
    ElMessage.info(`已跳转到「${ab.name}」业务入口`)
  }
}

const abilities = ref<AIAbility[]>([])
const recordList = ref<AICallRecord[]>([])
const recordFilter = ref<AIAbilityCode | ''>('')

const fetchAbilities = async () => {
  const res: any = await getAIAbilityList({ page: 1, pageSize: 100 })
  abilities.value = res.data.list
}

const fetchRecords = async () => {
  const res: any = await getAICallRecordList({
    page: 1,
    pageSize: 50,
    abilityCode: recordFilter.value || undefined
  })
  recordList.value = res.data.list
}

const getIcon = (code: AIAbilityCode) => {
  return abilities.value.find((a) => a.code === code)?.icon || '🤖'
}

// 演示 Dialog
const demoDialogVisible = ref(false)
const demoAbility = ref<AIAbility | null>(null)
const demoInput = ref('')
const demoTarget = ref('')
const demoOutput = ref('')
const demoRecordId = ref<number | null>(null)
const demoAdoption = ref<AdoptionResult>('adopted')
const demoModDegree = ref(20)
const calling = ref(false)

const needsTarget = computed(() => {
  return (
    demoAbility.value?.code === 'meeting_agenda' ||
    demoAbility.value?.code === 'comment_polish'
  )
})

const handleOpenDemo = (ab: AIAbility) => {
  demoAbility.value = ab
  demoInput.value = ab.sampleInput
  demoTarget.value = needsTarget.value ? '张伟' : ''
  demoOutput.value = ''
  demoRecordId.value = null
  demoAdoption.value = 'adopted'
  demoModDegree.value = 20
  demoDialogVisible.value = true
}

const handleInvoke = async () => {
  if (!demoAbility.value) return
  if (!demoInput.value) {
    ElMessage.warning('请填写输入内容')
    return
  }
  calling.value = true
  try {
    const res: any = await invokeAIAbility(
      demoAbility.value.code,
      demoInput.value,
      '当前用户',
      demoTarget.value || undefined
    )
    demoOutput.value = res.data.output
    demoRecordId.value = res.data.recordId
    ElMessage.success('AI 已生成结果，请 Review 后采纳')
  } finally {
    calling.value = false
  }
}

const handleConfirmAdoption = async () => {
  if (!demoRecordId.value) return
  await updateAIAdoption(
    demoRecordId.value,
    demoAdoption.value as 'adopted' | 'modified_adopted' | 'rejected',
    demoAdoption.value === 'modified_adopted' ? demoModDegree.value : 0
  )
  ElMessage.success('采纳结果已记录')
  demoDialogVisible.value = false
  fetchRecords()
}

onMounted(() => {
  fetchAbilities()
  fetchRecords()
})
</script>

<style scoped lang="scss">
.ai-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  .section-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }

  .section-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.ability-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.12);
  }

  .ab-head {
    display: flex;
    gap: 12px;
    align-items: center;

    .ab-icon {
      font-size: 36px;
    }

    .ab-meta {
      flex: 1;

      .ab-name {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }
    }
  }

  .ab-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
  }

  .ab-usecase {
    font-size: 12px;
    color: #909399;
    background: #f5f7fa;
    padding: 6px 10px;
    border-radius: 4px;
    line-height: 1.5;

    .ab-usecase-label {
      color: #606266;
      margin-right: 6px;
      font-weight: 500;
    }
  }

  .ab-entry {
    font-size: 12px;
    color: #409eff;
    background: #ecf5ff;
    padding: 6px 10px;
    border-radius: 4px;
    line-height: 1.5;

    .ab-entry-label {
      color: #606266;
      margin-right: 6px;
      font-weight: 500;
    }

    .ab-entry-path {
      color: #409eff;
      font-weight: 500;
    }
  }

  .ab-actions {
    text-align: right;
    margin-top: auto;
    display: flex;
    justify-content: flex-end;

    .el-button:not(:first-child) {
      margin-left: 8px;
    }
  }
}

.ai-output {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 14px 18px;
  white-space: pre-wrap;
  font-family: 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #303133;
  max-height: 340px;
  overflow-y: auto;
}
</style>
