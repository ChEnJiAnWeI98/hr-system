<template>
  <div class="payslip-container">
    <!-- 员工选择器（仅 HR 可见；员工只看自己） -->
    <el-card class="filter-card" v-if="isHR">
      <div class="filter-row">
        <span class="filter-label">查看员工：</span>
        <EmployeeSelector v-model="currentEmpId" width="240px" />
      </div>
    </el-card>

    <!-- 员工信息卡 -->
    <el-card class="emp-card" v-if="currentEmp">
      <div class="emp-head">
        <div class="emp-avatar">{{ currentEmp.nameZh.charAt(0) }}</div>
        <div>
          <div class="emp-name">
            {{ currentEmp.nameZh }}
            <el-tag size="small" style="margin-left: 8px">{{ currentEmp.employeeNo }}</el-tag>
          </div>
          <div class="emp-sub">
            {{ currentEmp.positionName }} · {{ currentEmp.orgName }} · {{ currentEmp.level }}
          </div>
        </div>
      </div>
    </el-card>

    <!-- 年度汇总 -->
    <div class="stat-row" v-if="payslips.length">
      <el-card class="stat-card">
        <div class="stat-label">发放月数</div>
        <div class="stat-value primary">{{ payslips.length }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">累计应发</div>
        <div class="stat-value">¥{{ formatAmount(totalGross) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">累计扣缴</div>
        <div class="stat-value warning">¥{{ formatAmount(totalDeduction) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">累计实发</div>
        <div class="stat-value success">¥{{ formatAmount(totalNet) }}</div>
      </el-card>
    </div>

    <!-- 工资条列表 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">工资条历史</div>
        <el-button v-if="payslips.length" plain @click="handleExportAll">
          <el-icon><Download /></el-icon>
          导出全部
        </el-button>
      </div>

      <el-table v-if="payslips.length" :data="payslips" border style="width: 100%">
        <el-table-column prop="period" label="核算周期" width="120" align="center" />
        <el-table-column label="绩效" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="gradeColor(row.performanceGrade)">
              {{ row.performanceGrade }} × {{ row.performanceCoefficient }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="应发" min-width="140" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.grossAmount) }}</template>
        </el-table-column>
        <el-table-column label="扣缴" min-width="140" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning)">-¥{{ formatAmount(row.deductionAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发" min-width="160" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-success); font-weight: 500">
              ¥{{ formatAmount(row.netAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发放时间" min-width="180" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
            <el-button link @click="handleExport(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else description="暂无工资条" :image-size="80" />
    </el-card>

    <!-- 工资条详情 Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`工资条 - ${currentRecord?.period}`"
      width="640px"
    >
      <template v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工">{{ currentRecord.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="编号">{{ currentRecord.employeeNo }}</el-descriptions-item>
          <el-descriptions-item label="组织">{{ currentRecord.orgName }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ currentRecord.positionName }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ currentRecord.period }}</el-descriptions-item>
          <el-descriptions-item label="绩效">
            <el-tag :type="gradeColor(currentRecord.performanceGrade)" size="small">
              {{ currentRecord.performanceGrade }} × {{ currentRecord.performanceCoefficient }}
            </el-tag>
          </el-descriptions-item>
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

        <el-divider>扣缴项</el-divider>
        <el-table :data="deductionItems" size="small" border>
          <el-table-column prop="name" label="薪资项" />
          <el-table-column label="金额" width="140" align="right">
            <template #default="{ row }">
              <span style="color: var(--el-color-warning)">-¥{{ formatAmount(row.amount) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="net-row">
          <span class="net-label">实发工资</span>
          <span class="net-amount">¥{{ formatAmount(currentRecord.netAmount) }}</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getEmployeePayslipsApi } from '@/api/comp'
import type { PayrollRecord } from '@/types/comp/payroll'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'
import { useRBACStore } from '@/store/modules/rbac'

defineOptions({ name: 'CompPayslip' })

const empStore = useEmployeeStore()
const rbacStore = useRBACStore()

/** 判断是否 HR 角色（可切换员工） */
const isHR = computed(() =>
  ['super_admin', 'hr_admin', 'hr_bp'].includes(rbacStore.currentRoleCode)
)

/** 当前查看的员工 ID */
const currentEmpId = ref<number | null>(null)

/** 初始化：HR 默认选第一个员工；员工只看自己 */
const initEmpId = () => {
  if (isHR.value) {
    currentEmpId.value = rbacStore.currentUserId || empStore.employees[0]?.id || null
  } else {
    currentEmpId.value = rbacStore.currentUserId
  }
}

const currentEmp = computed(() =>
  currentEmpId.value ? empStore.getById(currentEmpId.value) : null
)

const payslips = ref<PayrollRecord[]>([])

const fetchPayslips = async () => {
  if (!currentEmpId.value) {
    payslips.value = []
    return
  }
  const res: any = await getEmployeePayslipsApi(currentEmpId.value)
  payslips.value = res.data
}

watch(currentEmpId, fetchPayslips)

const totalGross = computed(() => payslips.value.reduce((s, r) => s + r.grossAmount, 0))
const totalDeduction = computed(() => payslips.value.reduce((s, r) => s + r.deductionAmount, 0))
const totalNet = computed(() => payslips.value.reduce((s, r) => s + r.netAmount, 0))

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

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

// === 详情 Dialog ===
const detailDialogVisible = ref(false)
const currentRecord = ref<PayrollRecord | null>(null)
const additionItems = computed(
  () => currentRecord.value?.items.filter((i) => i.direction === 'addition') || []
)
const deductionItems = computed(
  () => currentRecord.value?.items.filter((i) => i.direction === 'deduction') || []
)

const handleViewDetail = (row: PayrollRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const handleExport = (row: PayrollRecord) => {
  ElMessage.info(`Mock 环境：导出 ${row.period} 工资条 PDF（真实环境生成带公司抬头的 PDF 发送至员工邮箱）`)
}

const handleExportAll = () => {
  ElMessage.info(`Mock 环境：导出 ${currentEmp.value?.nameZh} 的 ${payslips.value.length} 张工资条 Excel`)
}

onMounted(() => {
  initEmpId()
  fetchPayslips()
})
</script>

<style scoped lang="scss">
.payslip-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-card,
  .emp-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .filter-card :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .filter-row {
    display: flex;
    align-items: center;
    .filter-label {
      margin-right: 12px;
      color: #606266;
    }
  }

  .emp-card {
    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    .emp-head {
      display: flex;
      align-items: center;
      gap: 16px;

      .emp-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #409eff, #67c23a);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 600;
      }

      .emp-name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .emp-sub {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }

  .stat-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .stat-card {
    :deep(.el-card__body) {
      padding: 14px 20px;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
    }
    .stat-value {
      font-size: 22px;
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
    :deep(.el-card__body) {
      padding: 20px;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .section-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}

.net-row {
  margin-top: 24px;
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
    font-size: 26px;
    font-weight: 700;
    color: var(--el-color-success);
  }
}
</style>
