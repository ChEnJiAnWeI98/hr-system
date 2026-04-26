<template>
  <div class="payroll-container">
    <!-- 统计 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">最近批次</div>
        <div class="stat-value primary">{{ latestBatch?.period || '—' }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">应发总额</div>
        <div class="stat-value">{{ formatAmount(latestBatch?.totalGross) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">扣缴总额</div>
        <div class="stat-value warning">{{ formatAmount(latestBatch?.totalDeduction) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">实发总额</div>
        <div class="stat-value success">{{ formatAmount(latestBatch?.totalNet) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">员工数</div>
        <div class="stat-value">{{ latestBatch?.totalEmployees || 0 }}</div>
      </el-card>
    </div>

    <!-- 批次列表 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-title">薪资核算批次</div>
        <el-button type="primary" @click="handleCreateBatch">
          <el-icon><Plus /></el-icon>
          新建核算批次
        </el-button>
      </div>
      <el-table :data="batches" border style="width: 100%">
        <el-table-column prop="batchNo" label="批次号" width="150" />
        <el-table-column prop="period" label="核算周期" width="110" align="center" />
        <el-table-column prop="orgNames" label="适用组织" min-width="140" show-overflow-tooltip />
        <el-table-column label="员工数" width="90" align="center">
          <template #default="{ row }">{{ row.totalEmployees }}</template>
        </el-table-column>
        <el-table-column label="应发" width="140" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.totalGross) }}</template>
        </el-table-column>
        <el-table-column label="扣缴" width="140" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning)">¥{{ formatAmount(row.totalDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发" width="140" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-success); font-weight: 500">
              ¥{{ formatAmount(row.totalNet) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="BATCH_STATUS_TYPE[row.status as PayrollBatchStatus]" size="small">
              {{ BATCH_STATUS_LABEL[row.status as PayrollBatchStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="发起人" width="110" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewRecords(row)">查看明细</el-button>
            <el-button
              v-if="row.status === 'draft'"
              link
              type="warning"
              @click="handleExecute(row)"
            >
              执行核算
            </el-button>
            <el-button
              v-if="row.status === 'calculated'"
              link
              type="primary"
              @click="handleApprove(row, 'hrbp')"
            >
              HRBP 审批
            </el-button>
            <el-button
              v-if="row.status === 'reviewing'"
              link
              type="primary"
              @click="handleApprove(row, 'hrd')"
            >
              HRD 审批
            </el-button>
            <el-button
              v-if="row.status === 'approved'"
              link
              type="success"
              @click="handleRelease(row)"
            >
              发放
            </el-button>
            <el-button
              v-if="row.status === 'approved' || row.status === 'released'"
              link
              type="primary"
              @click="handleExportBatch(row)"
            >
              导出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 核算明细 Drawer -->
    <el-drawer
      v-model="recordsDrawerVisible"
      :title="`核算明细 ${currentBatch?.batchNo || ''}（共 ${records.length} 人）`"
      size="1100px"
    >
      <div class="records-toolbar">
        <el-input
          v-model="recordKeyword"
          placeholder="搜索员工姓名/编号"
          clearable
          style="width: 260px"
        />
        <el-tag type="info" effect="plain">周期：{{ currentBatch?.period }}</el-tag>
        <el-tag :type="currentBatch ? BATCH_STATUS_TYPE[currentBatch.status] : 'info'">
          {{ currentBatch ? BATCH_STATUS_LABEL[currentBatch.status] : '-' }}
        </el-tag>
        <div style="flex: 1"></div>
        <el-button type="primary" plain @click="handleExportDetail">
          <el-icon><Download /></el-icon>
          导出当前明细
        </el-button>
      </div>
      <el-table :data="filteredRecords" border size="small" height="calc(100vh - 220px)">
        <el-table-column prop="employeeNo" label="编号" width="110" />
        <el-table-column prop="employeeName" label="姓名" width="90" />
        <el-table-column prop="orgName" label="组织" min-width="140" show-overflow-tooltip />
        <el-table-column prop="positionName" label="岗位" min-width="140" show-overflow-tooltip />
        <el-table-column prop="level" label="职级" width="70" align="center" />
        <el-table-column label="绩效" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="gradeColor(row.performanceGrade)">
              {{ row.performanceGrade }} × {{ row.performanceCoefficient }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="应发" width="110" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.grossAmount) }}</template>
        </el-table-column>
        <el-table-column label="扣缴" width="100" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning)">-¥{{ formatAmount(row.deductionAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发" width="120" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-success); font-weight: 500">
              ¥{{ formatAmount(row.netAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <!-- 单条记录详情 Dialog（薪资项明细） -->
    <el-dialog v-model="detailDialogVisible" :title="`工资条 - ${currentRecord?.employeeName} · ${currentRecord?.period}`" width="640px">
      <template v-if="currentRecord">
        <el-descriptions :column="2" border size="default">
          <el-descriptions-item label="员工">{{ currentRecord.employeeName }}（{{ currentRecord.employeeNo }}）</el-descriptions-item>
          <el-descriptions-item label="组织">{{ currentRecord.orgName }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ currentRecord.positionName }}</el-descriptions-item>
          <el-descriptions-item label="职级">{{ currentRecord.level }}</el-descriptions-item>
          <el-descriptions-item label="绩效等级">
            <el-tag :type="gradeColor(currentRecord.performanceGrade)" size="small">
              {{ currentRecord.performanceGrade }}（系数 × {{ currentRecord.performanceCoefficient }}）
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="核算周期">{{ currentRecord.period }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>应发项</el-divider>
        <el-table :data="additionItems" size="small" border>
          <el-table-column prop="name" label="薪资项" />
          <el-table-column label="金额" width="140" align="right">
            <template #default="{ row }">
              <span style="color: var(--el-color-success)">+¥{{ formatAmount(row.amount) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="sum-row">
          应发合计：
          <span class="sum-value">¥{{ formatAmount(currentRecord.grossAmount) }}</span>
        </div>

        <el-divider>扣缴项</el-divider>
        <el-table :data="deductionItems" size="small" border>
          <el-table-column prop="name" label="薪资项" />
          <el-table-column label="金额" width="140" align="right">
            <template #default="{ row }">
              <span style="color: var(--el-color-warning)">-¥{{ formatAmount(row.amount) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="sum-row">
          扣缴合计：
          <span class="sum-value warning">-¥{{ formatAmount(currentRecord.deductionAmount) }}</span>
        </div>

        <div class="net-row">
          <span class="net-label">实发工资</span>
          <span class="net-amount">¥{{ formatAmount(currentRecord.netAmount) }}</span>
        </div>
      </template>
    </el-dialog>

    <!-- 新建批次 Dialog -->
    <el-dialog v-model="createDialogVisible" title="新建核算批次" width="500px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="核算周期">
          <el-date-picker
            v-model="createForm.period"
            type="month"
            format="YYYY-MM"
            value-format="YYYY-MM"
            placeholder="选择月份"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="适用组织">
          <OrgTreeSelect v-model="createForm.orgId" placeholder="留空为全公司" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCreate">创建并执行核算</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPayrollBatchList,
  addPayrollBatch,
  getBatchRecordsApi,
  executePayrollApi,
  approvePayrollApi,
  releasePayrollApi
} from '@/api/comp'
import type { PayrollBatch, PayrollRecord, PayrollBatchStatus } from '@/types/comp/payroll'
import { BATCH_STATUS_LABEL, BATCH_STATUS_TYPE } from '@/types/comp/payroll'
import OrgTreeSelect from '@/components/core/hr/org-tree-select.vue'
import { useOrganizationStore } from '@/store/modules/organization'

defineOptions({ name: 'CompPayroll' })

const orgStore = useOrganizationStore()

const batches = ref<PayrollBatch[]>([])
const latestBatch = computed<PayrollBatch | null>(() => batches.value[0] || null)

const fetchBatches = async () => {
  const res: any = await getPayrollBatchList({ page: 1, pageSize: 100 })
  batches.value = res.data.list.sort((a: PayrollBatch, b: PayrollBatch) =>
    b.period.localeCompare(a.period)
  )
}

const formatAmount = (n?: number) => {
  if (n === undefined || n === null) return '—'
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 0 })
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

// === 核算明细 Drawer ===
const recordsDrawerVisible = ref(false)
const currentBatch = ref<PayrollBatch | null>(null)
const records = ref<PayrollRecord[]>([])
const recordKeyword = ref('')

const filteredRecords = computed(() => {
  if (!recordKeyword.value) return records.value
  const k = recordKeyword.value.toLowerCase()
  return records.value.filter(
    (r) =>
      r.employeeName.includes(recordKeyword.value) ||
      r.employeeNo.toLowerCase().includes(k)
  )
})

const handleViewRecords = async (row: PayrollBatch) => {
  currentBatch.value = row
  recordKeyword.value = ''
  const res: any = await getBatchRecordsApi(row.id)
  records.value = res.data
  recordsDrawerVisible.value = true
}

// === 详情 Dialog ===
const detailDialogVisible = ref(false)
const currentRecord = ref<PayrollRecord | null>(null)

const additionItems = computed(() => currentRecord.value?.items.filter((i) => i.direction === 'addition') || [])
const deductionItems = computed(() => currentRecord.value?.items.filter((i) => i.direction === 'deduction') || [])

const handleViewDetail = (row: PayrollRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// === 新建批次 ===
const createDialogVisible = ref(false)
const createForm = reactive({
  period: '',
  orgId: null as number | null
})

const handleCreateBatch = () => {
  const now = new Date()
  createForm.period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  createForm.orgId = null
  createDialogVisible.value = true
}

const handleConfirmCreate = async () => {
  if (!createForm.period) {
    ElMessage.warning('请选择核算周期')
    return
  }
  const orgName = createForm.orgId ? orgStore.getById(createForm.orgId)?.orgName || '—' : '全公司'
  const payload: Partial<PayrollBatch> = {
    batchNo: `PR${createForm.period.replace('-', '')}${String(Date.now()).slice(-3)}`,
    period: createForm.period,
    orgIds: createForm.orgId ? [createForm.orgId] : [],
    orgNames: orgName,
    status: 'draft',
    totalEmployees: 0,
    totalGross: 0,
    totalDeduction: 0,
    totalNet: 0,
    creatorName: '当前用户',
    creatorId: 9001
  }
  const res: any = await addPayrollBatch(payload as any)
  ElMessage.success('批次已创建')
  createDialogVisible.value = false
  // 自动执行核算
  if (res.data) {
    await executePayrollApi(res.data.id)
    ElMessage.success('核算完成')
  }
  fetchBatches()
}

// === 执行/审批/发放 ===
const handleExecute = (row: PayrollBatch) => {
  ElMessageBox.confirm(`确认对批次 ${row.batchNo} 执行核算？`, '提示', { type: 'warning' }).then(
    async () => {
      await executePayrollApi(row.id)
      ElMessage.success('核算完成')
      fetchBatches()
    }
  )
}

const handleApprove = (row: PayrollBatch, stage: 'hrbp' | 'hrd') => {
  const stageName = stage === 'hrbp' ? 'HRBP' : 'HRD'
  ElMessageBox.confirm(`${stageName} 审批通过批次 ${row.batchNo}？`, '审批', { type: 'warning' }).then(
    async () => {
      await approvePayrollApi(
        row.id,
        stage,
        'approved',
        stage === 'hrbp' ? 'HRBP 王' : 'HRD 陈',
        stage === 'hrbp' ? 9002 : 9003
      )
      ElMessage.success('审批完成')
      fetchBatches()
    }
  )
}

// === Excel 导出（Mock 占位）===
const handleExportBatch = (row: PayrollBatch) => {
  ElMessage.info(
    `Mock 环境：导出功能将在真实环境生成 Excel 文件（批次 ${row.batchNo}，${row.totalEmployees} 人，含应发项/扣缴项/实发/个税/社保）`
  )
}

const handleExportDetail = () => {
  if (!currentBatch.value) return
  ElMessage.info(
    `Mock 环境：导出功能将在真实环境生成 Excel 文件（批次 ${currentBatch.value.batchNo}，当前筛选 ${filteredRecords.value.length} 人的明细）`
  )
}

const handleRelease = (row: PayrollBatch) => {
  ElMessageBox.confirm(`确认发放批次 ${row.batchNo}？发放后员工工资条可见`, '发放', { type: 'warning' }).then(
    async () => {
      await releasePayrollApi(row.id)
      ElMessage.success('工资已发放')
      fetchBatches()
    }
  )
}

onMounted(fetchBatches)
</script>

<style scoped lang="scss">
.payroll-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;

  .stat-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .stat-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 14px 20px;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      margin-top: 4px;
      color: #303133;
      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
    }
  }

  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 20px;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .header-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}

.records-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.sum-row {
  margin-top: 10px;
  text-align: right;
  color: #606266;
  padding-right: 16px;

  .sum-value {
    font-weight: 600;
    color: var(--el-color-success);
    margin-left: 8px;
    font-size: 15px;

    &.warning {
      color: var(--el-color-warning);
    }
  }
}

.net-row {
  margin-top: 30px;
  padding: 16px;
  background: linear-gradient(135deg, #f0faff, #f0fff4);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #a1e6a1;

  .net-label {
    font-size: 16px;
    color: #303133;
  }

  .net-amount {
    font-size: 28px;
    font-weight: 700;
    color: var(--el-color-success);
  }
}
</style>
