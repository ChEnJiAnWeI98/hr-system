<template>
  <div class="appeal-container">
    <!-- 统计卡片 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">申诉总数</div>
        <div class="stat-value">{{ analytics.total }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">处理中</div>
        <div class="stat-value warning">{{ analytics.inProgress }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">推翻原结果</div>
        <div class="stat-value danger">{{ analytics.overturned }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">推翻率</div>
        <div class="stat-value primary">{{ analytics.overturnRate }}%</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="申诉人">
            <el-input v-model="queryParams.appellantName" placeholder="姓名或编号" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="申诉类型">
            <el-select v-model="queryParams.appealType" placeholder="全部" style="width: 160px" clearable>
              <el-option
                v-for="k in APPEAL_TYPE_KEYS"
                :key="k"
                :label="APPEAL_TYPE_LABEL[k]"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" style="width: 160px" clearable>
              <el-option
                v-for="k in APPEAL_STATUS_KEYS"
                :key="k"
                :label="APPEAL_STATUS_LABEL[k]"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-title">申诉列表</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          发起申诉
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="appealNo" label="申诉编号" width="160" />
          <el-table-column prop="appellantName" label="申诉人" width="100" />
          <el-table-column prop="department" label="部门" min-width="160" />
          <el-table-column prop="cycleName" label="所属周期" min-width="200" />
          <el-table-column label="申诉类型" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="APPEAL_TYPE_TYPE[row.appealType as AppealType]" size="small">
                {{ APPEAL_TYPE_LABEL[row.appealType as AppealType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="原等级" width="90" align="center">
            <template #default="{ row }">
              <el-tag size="small" :type="gradeColor(row.originalGrade)">{{ row.originalGrade }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="新等级" width="90" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.newGrade" size="small" :type="gradeColor(row.newGrade)">
                {{ row.newGrade }}
              </el-tag>
              <span v-else style="color: #c0c4cc">-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150" align="center">
            <template #default="{ row }">
              <el-tag :type="APPEAL_STATUS_TYPE[row.status as AppealStatus]" size="small">
                {{ APPEAL_STATUS_LABEL[row.status as AppealStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="发起时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button
                v-if="getActiveStage(row.status as AppealStatus)"
                link
                type="warning"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="row.status === 'submitted'"
                link
                type="danger"
                @click="handleWithdraw(row)"
              >
                撤回
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 发起申诉 Dialog -->
    <el-dialog v-model="addDialogVisible" title="发起申诉" width="700px">
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
        title="申诉须知"
        description="1. 申诉窗口为评估结果公示后 5 个工作日；2. 申诉期间原结果将被锁定；3. 申诉需附有事实依据"
      />
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属周期" prop="cycleName">
              <el-select v-model="addForm.cycleName" style="width: 100%">
                <el-option label="2026 Q1 季度绩效" value="2026 Q1 季度绩效" />
                <el-option label="2025 Q4 季度绩效" value="2025 Q4 季度绩效" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原等级" prop="originalGrade">
              <el-select v-model="addForm.originalGrade" style="width: 100%">
                <el-option label="S" value="S" />
                <el-option label="A" value="A" />
                <el-option label="B" value="B" />
                <el-option label="C" value="C" />
                <el-option label="D" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申诉类型" prop="appealType">
              <el-radio-group v-model="addForm.appealType">
                <el-radio
                  v-for="k in APPEAL_TYPE_KEYS"
                  :key="k"
                  :value="k"
                >
                  {{ APPEAL_TYPE_LABEL[k] }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申诉事由" prop="reason">
              <el-input v-model="addForm.reason" type="textarea" :rows="3" placeholder="请描述原评估结果存在的问题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="期望诉求" prop="expectation">
              <el-input v-model="addForm.expectation" type="textarea" :rows="2" placeholder="请说明期望的处理方式" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证据材料">
              <el-input v-model="addForm.evidence" type="textarea" :rows="2" placeholder="可选：邮件/会议纪要/数据证明等" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAppeal">提交申诉</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Drawer -->
    <el-drawer v-model="detailDrawerVisible" :title="`申诉详情 ${detail?.appealNo}`" size="720px">
      <template v-if="detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="申诉人">{{ detail.appellantName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ detail.department }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ detail.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="申诉类型">
            <el-tag :type="APPEAL_TYPE_TYPE[detail.appealType]" size="small">
              {{ APPEAL_TYPE_LABEL[detail.appealType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原等级">
            <el-tag size="small" :type="gradeColor(detail.originalGrade)">
              {{ detail.originalGrade }} ({{ detail.originalScore }} 分)
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="APPEAL_STATUS_TYPE[detail.status]" size="small">
              {{ APPEAL_STATUS_LABEL[detail.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原结果锁定">
            <el-tag :type="detail.resultLocked ? 'danger' : 'info'" size="small">
              {{ detail.resultLocked ? '已锁定' : '未锁定' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发起时间">{{ detail.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="新等级" v-if="detail.newGrade">
            <el-tag size="small" :type="gradeColor(detail.newGrade)">
              {{ detail.newGrade }} ({{ detail.newScore }} 分)
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>申诉内容</el-divider>
        <div class="field-block">
          <div class="field-label">申诉事由</div>
          <div class="field-value">{{ detail.reason }}</div>
        </div>
        <div class="field-block">
          <div class="field-label">期望诉求</div>
          <div class="field-value">{{ detail.expectation }}</div>
        </div>
        <div class="field-block" v-if="detail.evidence">
          <div class="field-label">证据材料</div>
          <div class="field-value">{{ detail.evidence }}</div>
        </div>

        <el-divider>审批流水</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(rec, idx) in detail.approvalRecords"
            :key="idx"
            :type="getTimelineType(rec.result)"
            :timestamp="rec.approvalTime"
          >
            <div>
              <b>{{ stageLabel(rec.stage) }} · {{ rec.approverName }}</b>
              <el-tag size="small" :type="getTimelineType(rec.result)" style="margin-left: 8px">
                {{ resultLabel(rec.result) }}
              </el-tag>
            </div>
            <div style="margin-top: 4px; color: #606266">{{ rec.comment }}</div>
          </el-timeline-item>
          <el-timeline-item
            v-if="!detail.approvalRecords.length"
            type="info"
            timestamp="—"
          >
            <div style="color: #909399">暂无审批记录</div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>

    <!-- 审批 Dialog -->
    <el-dialog v-model="approveDialogVisible" :title="`审批申诉 ${approving?.appealNo || ''}`" width="600px">
      <el-alert
        :title="`当前审批层级：${stageLabel(activeStage || 'level1')}`"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-form ref="approveFormRef" :model="approveForm" label-width="110px">
        <el-form-item label="审批人">
          <el-input v-model="approveForm.approverName" />
        </el-form-item>
        <el-form-item label="审批结果" v-if="activeStage === 'committee'">
          <el-radio-group v-model="approveForm.action">
            <el-radio value="overturn">推翻原结果</el-radio>
            <el-radio value="maintain">维持原结果</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批结果" v-else>
          <el-radio-group v-model="approveForm.action">
            <el-radio value="approved">通过（进入下一级）</el-radio>
            <el-radio value="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="activeStage === 'committee' && approveForm.action === 'overturn'">
          <el-form-item label="新等级">
            <el-select v-model="approveForm.newGrade" style="width: 100%">
              <el-option label="S" value="S" />
              <el-option label="A" value="A" />
              <el-option label="B" value="B" />
              <el-option label="C" value="C" />
              <el-option label="D" value="D" />
            </el-select>
          </el-form-item>
          <el-form-item label="新分数">
            <el-input v-model.number="approveForm.newScore" placeholder="0~100" />
          </el-form-item>
        </template>

        <el-form-item label="审批意见">
          <el-input v-model="approveForm.comment" type="textarea" :rows="3" placeholder="请填写审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmApprove">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getAppealList,
  addAppeal,
  approveAppealApi,
  withdrawAppealApi,
  getAppealAnalyticsApi
} from '@/api/performanceAppeal'
import {
  APPEAL_TYPE_LABEL,
  APPEAL_TYPE_TYPE,
  APPEAL_STATUS_LABEL,
  APPEAL_STATUS_TYPE,
  getActiveStage
} from '@/types/performanceAppeal'
import type {
  PerformanceAppeal,
  AppealType,
  AppealStatus,
  AppealListParams
} from '@/types/performanceAppeal'

defineOptions({ name: 'PerformanceAppeal' })

const APPEAL_TYPE_KEYS: AppealType[] = [
  'performance_grade',
  'score',
  'process',
  '360_review',
  'other'
]
const APPEAL_STATUS_KEYS: AppealStatus[] = [
  'submitted',
  'level1_approved',
  'level1_rejected',
  'level2_approved',
  'level2_rejected',
  'committee_reviewing',
  'overturned',
  'final_rejected',
  'withdrawn'
]

const queryParams = reactive<AppealListParams>({
  appellantName: '',
  appealType: '',
  status: '',
  page: 1,
  pageSize: 20
})

const tableData = ref<PerformanceAppeal[]>([])
const total = ref(0)
const analytics = reactive({
  total: 0,
  inProgress: 0,
  overturned: 0,
  closed: 0,
  overturnRate: '0'
})

const fetchData = async () => {
  const res: any = await getAppealList(queryParams)
  tableData.value = res.data.list
  total.value = res.data.total
}

const fetchAnalytics = async () => {
  const res: any = await getAppealAnalyticsApi()
  Object.assign(analytics, res.data)
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.appellantName = ''
  queryParams.appealType = ''
  queryParams.status = ''
  queryParams.page = 1
  fetchData()
}

const gradeColor = (g: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const m: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    S: 'success',
    A: 'primary',
    B: 'info',
    C: 'warning',
    D: 'danger'
  }
  return m[g] || 'info'
}

// 发起申诉
const addDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  cycleName: '2026 Q1 季度绩效',
  cycleId: 1,
  originalGrade: 'C' as 'S' | 'A' | 'B' | 'C' | 'D',
  originalScore: 65,
  appealType: 'performance_grade' as AppealType,
  reason: '',
  expectation: '',
  evidence: ''
})
const addRules: FormRules = {
  cycleName: [{ required: true, message: '请选择周期', trigger: 'change' }],
  originalGrade: [{ required: true, message: '请选择原等级', trigger: 'change' }],
  appealType: [{ required: true, message: '请选择申诉类型', trigger: 'change' }],
  reason: [{ required: true, message: '请填写申诉事由', trigger: 'blur' }],
  expectation: [{ required: true, message: '请填写期望诉求', trigger: 'blur' }]
}

const handleAdd = () => {
  Object.assign(addForm, {
    cycleName: '2026 Q1 季度绩效',
    cycleId: 1,
    originalGrade: 'C',
    originalScore: 65,
    appealType: 'performance_grade',
    reason: '',
    expectation: '',
    evidence: ''
  })
  addDialogVisible.value = true
}

const handleSubmitAppeal = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate()

  const now = new Date()
  const deadline = new Date(now.getTime() + 5 * 24 * 3600 * 1000)
  const newItem: Partial<PerformanceAppeal> = {
    appealNo: `AP-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-3)}`,
    appellantName: '当前用户',
    appellantId: 9999,
    department: '当前部门',
    position: '当前岗位',
    cycleId: addForm.cycleId,
    cycleName: addForm.cycleName,
    originalGrade: addForm.originalGrade,
    originalScore: addForm.originalScore,
    appealType: addForm.appealType,
    reason: addForm.reason,
    expectation: addForm.expectation,
    evidence: addForm.evidence,
    status: 'submitted',
    resultLocked: true,
    submitTime: now.toLocaleString('zh-CN'),
    deadline: deadline.toLocaleString('zh-CN'),
    approvalRecords: []
  }
  await addAppeal(newItem as any)
  ElMessage.success('申诉已提交')
  addDialogVisible.value = false
  fetchData()
  fetchAnalytics()
}

// 查看
const detailDrawerVisible = ref(false)
const detail = ref<PerformanceAppeal | null>(null)
const handleView = (row: PerformanceAppeal) => {
  detail.value = row
  detailDrawerVisible.value = true
}

// 审批
const approveDialogVisible = ref(false)
const approving = ref<PerformanceAppeal | null>(null)
const activeStage = ref<'level1' | 'level2' | 'committee' | null>(null)
const approveForm = reactive({
  approverName: '',
  action: 'approved' as 'approved' | 'rejected' | 'overturn' | 'maintain',
  comment: '',
  newGrade: '' as '' | 'S' | 'A' | 'B' | 'C' | 'D',
  newScore: 0
})

const handleApprove = (row: PerformanceAppeal) => {
  approving.value = row
  activeStage.value = getActiveStage(row.status)
  const stageApprover =
    activeStage.value === 'level1'
      ? '部门负责人'
      : activeStage.value === 'level2'
      ? 'HR 主管'
      : '评议委员会'
  Object.assign(approveForm, {
    approverName: stageApprover,
    action: activeStage.value === 'committee' ? 'overturn' : 'approved',
    comment: '',
    newGrade: row.originalGrade,
    newScore: row.originalScore
  })
  approveDialogVisible.value = true
}

const handleConfirmApprove = async () => {
  if (!approving.value || !activeStage.value) return
  if (!approveForm.comment) {
    ElMessage.warning('请填写审批意见')
    return
  }
  await approveAppealApi(
    approving.value.id,
    activeStage.value,
    approveForm.action,
    approveForm.approverName,
    approveForm.comment,
    (approveForm.newGrade || undefined) as any,
    approveForm.newScore
  )
  ElMessage.success('审批成功')
  approveDialogVisible.value = false
  fetchData()
  fetchAnalytics()
}

const handleWithdraw = (row: PerformanceAppeal) => {
  ElMessageBox.confirm(`确定撤回申诉 ${row.appealNo} 吗？`, '提示', { type: 'warning' }).then(
    async () => {
      await withdrawAppealApi(row.id)
      ElMessage.success('已撤回')
      fetchData()
      fetchAnalytics()
    }
  )
}

// 辅助
const stageLabel = (stage: string) => {
  const m: Record<string, string> = {
    level1: '一级审批（部门负责人）',
    level2: '二级审批（HR + HRD）',
    committee: '二次评议会'
  }
  return m[stage] || stage
}
const resultLabel = (r: string) => {
  const m: Record<string, string> = {
    approved: '通过',
    rejected: '驳回',
    overturn: '推翻原结果',
    maintain: '维持原结果'
  }
  return m[r] || r
}
const getTimelineType = (r: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  if (r === 'approved' || r === 'overturn') return 'success'
  if (r === 'rejected' || r === 'maintain') return 'danger'
  return 'primary'
}

onMounted(() => {
  fetchData()
  fetchAnalytics()
})
</script>

<style scoped lang="scss">
.appeal-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .stat-row {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .stat-card,
  .filter-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .stat-card {
    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    .stat-label {
      font-size: 13px;
      color: #909399;
    }

    .stat-value {
      font-size: 26px;
      font-weight: 600;
      margin-top: 6px;
      color: #303133;

      &.primary {
        color: var(--el-color-primary);
      }
      &.warning {
        color: var(--el-color-warning);
      }
      &.danger {
        color: var(--el-color-danger);
      }
    }
  }

  .filter-card {
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 12px 20px;
    }
  }

  .filter-form-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .filter-buttons {
    display: flex;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }

  .data-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .header-title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .table-container {
      flex: 1;
      overflow: hidden;
    }

    .el-pagination {
      flex-shrink: 0;
      margin-top: 16px;
      justify-content: flex-end;
    }
  }
}

.field-block {
  margin-bottom: 14px;

  .field-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 4px;
  }

  .field-value {
    color: #303133;
    line-height: 1.6;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }
}
</style>
