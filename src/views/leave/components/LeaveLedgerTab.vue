<template>
  <div class="leave-ledger-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="假期类型">
            <el-select v-model="queryParams.leaveTypeId" placeholder="请选择假期类型" style="width: 150px" clearable>
              <el-option
                v-for="item in leaveTypeList"
                :key="item.id"
                :label="item.leaveTypeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="年份">
            <el-date-picker
              v-model="queryParams.year"
              type="year"
              placeholder="请选择年份"
              value-format="YYYY"
              style="width: 150px"
              clearable
            />
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                搜索
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="operation-card">
      <div class="operation-buttons">
        <el-button type="primary" @click="handleOpenStatistics">
          统计报表
        </el-button>
        <ArtExcelExport
          :data="exportData"
          :filename="exportFilename"
          :columns="exportColumns"
          :auto-index="true"
          index-column-title="序号"
          button-text="导出台账"
          type="primary"
        />
      </div>
    </el-card>

    <el-card class="data-card">
      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="employeeName" label="员工姓名" min-width="14%" />
          <el-table-column prop="departmentName" label="部门" min-width="14%" />
          <el-table-column prop="leaveTypeName" label="假期类型" min-width="14%" />
          <el-table-column prop="year" label="年份" min-width="12%" />
          <el-table-column prop="totalQuota" label="总额度" min-width="12%" />
          <el-table-column prop="usedQuota" label="已用额度" min-width="12%" />
          <el-table-column prop="remainingQuota" label="剩余额度" min-width="12%">
            <template #default="{ row }">
              <span :style="{ color: row.remainingQuota <= 0 ? '#f56c6c' : '#67c23a' }">
                {{ row.remainingQuota }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="假期台账明细"
      width="900px"
    >
      <div class="detail-info">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="员工姓名">{{ currentRow?.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ currentRow?.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="假期类型">{{ currentRow?.leaveTypeName }}</el-descriptions-item>
          <el-descriptions-item label="年份">{{ currentRow?.year }}</el-descriptions-item>
          <el-descriptions-item label="总额度">{{ currentRow?.totalQuota }}</el-descriptions-item>
          <el-descriptions-item label="已用额度">{{ currentRow?.usedQuota }}</el-descriptions-item>
          <el-descriptions-item label="剩余额度">
            <span :style="{ color: currentRow && currentRow.remainingQuota <= 0 ? '#f56c6c' : '#67c23a' }">
              {{ currentRow?.remainingQuota }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-tabs v-model="activeDetailTab" class="detail-tabs">
        <el-tab-pane label="发放记录" name="grant">
          <el-table :data="currentRow?.grantRecords || []" max-height="300">
            <el-table-column prop="grantDate" label="发放日期" min-width="14%" />
            <el-table-column prop="grantQuota" label="发放额度" min-width="10%" />
            <el-table-column prop="grantReason" label="发放原因" show-overflow-tooltip />
            <el-table-column prop="operator" label="操作人" min-width="10%" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="使用记录" name="usage">
          <el-table :data="currentRow?.usageRecords || []" max-height="300">
            <el-table-column prop="usageDate" label="使用日期" min-width="14%" />
            <el-table-column prop="usageQuota" label="使用额度" min-width="10%" />
            <el-table-column prop="usageReason" label="使用原因" show-overflow-tooltip />
            <el-table-column prop="applicationId" label="关联申请ID" min-width="10%" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="调整记录" name="adjust">
          <el-table :data="currentRow?.adjustRecords || []" max-height="300">
            <el-table-column prop="adjustDate" label="调整日期" min-width="14%" />
            <el-table-column prop="adjustQuota" label="调整额度" min-width="10%">
              <template #default="{ row }">
                <span :style="{ color: row.adjustQuota > 0 ? '#67c23a' : '#f56c6c' }">
                  {{ row.adjustQuota > 0 ? '+' : '' }}{{ row.adjustQuota }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="adjustReason" label="调整原因" show-overflow-tooltip />
            <el-table-column prop="operator" label="操作人" min-width="10%" />
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 统计报表对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      title="假期统计报表"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeStatTab">
        <!-- 按部门统计 -->
        <el-tab-pane label="按部门统计" name="department">
          <el-table :data="departmentStatistics" border style="width: 100%">
            <el-table-column prop="departmentName" label="部门" min-width="15%" />
            <el-table-column prop="totalQuota" label="总额度" min-width="10%" align="right" />
            <el-table-column prop="usedQuota" label="已用额度" min-width="10%" align="right" />
            <el-table-column prop="remainingQuota" label="剩余额度" min-width="10%" align="right" />
            <el-table-column prop="usageRate" label="使用率" min-width="10%" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.usageRate >= 80 ? '#f56c6c' : row.usageRate >= 60 ? '#e6a23c' : '#67c23a' }">
                  {{ row.usageRate }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="employeeCount" label="员工数" min-width="8%" align="right" />
          </el-table>
        </el-tab-pane>

        <!-- 按假期类型统计 -->
        <el-tab-pane label="按假期类型统计" name="leaveType">
          <el-table :data="leaveTypeStatistics" border style="width: 100%">
            <el-table-column prop="leaveTypeName" label="假期类型" min-width="15%" />
            <el-table-column prop="totalQuota" label="总额度" min-width="10%" align="right" />
            <el-table-column prop="usedQuota" label="已用额度" min-width="10%" align="right" />
            <el-table-column prop="remainingQuota" label="剩余额度" min-width="10%" align="right" />
            <el-table-column prop="usageRate" label="使用率" min-width="10%" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.usageRate >= 80 ? '#f56c6c' : row.usageRate >= 60 ? '#e6a23c' : '#67c23a' }">
                  {{ row.usageRate }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="employeeCount" label="员工数" min-width="8%" align="right" />
          </el-table>
        </el-tab-pane>

        <!-- 综合统计 -->
        <el-tab-pane label="综合统计" name="comprehensive">
          <el-table :data="comprehensiveStatistics" border style="width: 100%">
            <el-table-column prop="departmentName" label="部门" min-width="12%" />
            <el-table-column prop="leaveTypeName" label="假期类型" min-width="12%" />
            <el-table-column prop="totalQuota" label="总额度" min-width="8%" align="right" />
            <el-table-column prop="usedQuota" label="已用额度" min-width="8%" align="right" />
            <el-table-column prop="remainingQuota" label="剩余额度" min-width="8%" align="right" />
            <el-table-column prop="usageRate" label="使用率" min-width="8%" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.usageRate >= 80 ? '#f56c6c' : row.usageRate >= 60 ? '#e6a23c' : '#67c23a' }">
                  {{ row.usageRate }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="employeeCount" label="员工数" min-width="8%" align="right" />
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="statisticsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { LeaveLedger, LeaveLedgerListParams, LeaveType } from '@/types/leave'
import { getLeaveLedgerList } from '@/api/leaveLedger'
import { getLeaveTypeList } from '@/api/leaveType'
import ArtExcelExport from '@/components/core/forms/art-excel-export/index.vue'

defineOptions({
  name: 'LeaveLedgerTab'
})

// 查询参数
const queryParams = reactive<LeaveLedgerListParams>({
  employeeName: '',
  leaveTypeId: null,
  year: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<LeaveLedger[]>([])
const total = ref(0)
const loading = ref(false)

// 假期类型列表
const leaveTypeList = ref<LeaveType[]>([])

// 明细弹窗
const detailDialogVisible = ref(false)
const currentRow = ref<LeaveLedger | null>(null)
const activeDetailTab = ref('grant')

// 统计报表弹窗
const statisticsDialogVisible = ref(false)
const activeStatTab = ref('department')

// 按部门统计
const departmentStatistics = computed(() => {
  const deptMap = new Map<string, {
    departmentName: string
    totalQuota: number
    usedQuota: number
    remainingQuota: number
    employeeCount: number
  }>()

  tableData.value.forEach(item => {
    const key = item.departmentName
    if (!deptMap.has(key)) {
      deptMap.set(key, {
        departmentName: item.departmentName,
        totalQuota: 0,
        usedQuota: 0,
        remainingQuota: 0,
        employeeCount: 0
      })
    }
    const stat = deptMap.get(key)!
    stat.totalQuota += item.totalQuota
    stat.usedQuota += item.usedQuota
    stat.remainingQuota += item.remainingQuota
    stat.employeeCount++
  })

  return Array.from(deptMap.values()).map(item => ({
    ...item,
    usageRate: item.totalQuota > 0 ? Number((item.usedQuota / item.totalQuota * 100).toFixed(2)) : 0
  }))
})

// 按假期类型统计
const leaveTypeStatistics = computed(() => {
  const typeMap = new Map<string, {
    leaveTypeName: string
    totalQuota: number
    usedQuota: number
    remainingQuota: number
    employeeCount: number
  }>()

  tableData.value.forEach(item => {
    const key = item.leaveTypeName
    if (!typeMap.has(key)) {
      typeMap.set(key, {
        leaveTypeName: item.leaveTypeName,
        totalQuota: 0,
        usedQuota: 0,
        remainingQuota: 0,
        employeeCount: 0
      })
    }
    const stat = typeMap.get(key)!
    stat.totalQuota += item.totalQuota
    stat.usedQuota += item.usedQuota
    stat.remainingQuota += item.remainingQuota
    stat.employeeCount++
  })

  return Array.from(typeMap.values()).map(item => ({
    ...item,
    usageRate: item.totalQuota > 0 ? Number((item.usedQuota / item.totalQuota * 100).toFixed(2)) : 0
  }))
})

// 综合统计
const comprehensiveStatistics = computed(() => {
  const compMap = new Map<string, {
    departmentName: string
    leaveTypeName: string
    totalQuota: number
    usedQuota: number
    remainingQuota: number
    employeeCount: number
  }>()

  tableData.value.forEach(item => {
    const key = `${item.departmentName}-${item.leaveTypeName}`
    if (!compMap.has(key)) {
      compMap.set(key, {
        departmentName: item.departmentName,
        leaveTypeName: item.leaveTypeName,
        totalQuota: 0,
        usedQuota: 0,
        remainingQuota: 0,
        employeeCount: 0
      })
    }
    const stat = compMap.get(key)!
    stat.totalQuota += item.totalQuota
    stat.usedQuota += item.usedQuota
    stat.remainingQuota += item.remainingQuota
    stat.employeeCount++
  })

  return Array.from(compMap.values()).map(item => ({
    ...item,
    usageRate: item.totalQuota > 0 ? Number((item.usedQuota / item.totalQuota * 100).toFixed(2)) : 0
  }))
})

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getLeaveLedgerList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取假期台账列表失败:', error)
    ElMessage.error('获取假期台账列表失败')
  } finally {
    loading.value = false
  }
}

// 获取假期类型列表
const getLeaveTypes = async () => {
  try {
    const res = await getLeaveTypeList({ page: 1, pageSize: 100, status: 1 })
    if (res.code === 200) {
      leaveTypeList.value = res.data.list
    }
  } catch (error) {
    console.error('获取假期类型列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.leaveTypeId = null
  queryParams.year = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 查看明细
const handleViewDetail = (row: LeaveLedger) => {
  currentRow.value = row
  activeDetailTab.value = 'grant'
  detailDialogVisible.value = true
}

// 打开统计报表
const handleOpenStatistics = () => {
  activeStatTab.value = 'department'
  statisticsDialogVisible.value = true
}

// 导出文件名
const exportFilename = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `假期台账_${year}${month}${day}_${hours}${minutes}${seconds}`
})

// 导出列配置
const exportColumns = {
  employeeName: { title: '员工姓名', width: 120 },
  departmentName: { title: '部门', width: 150 },
  leaveTypeName: { title: '假期类型', width: 120 },
  year: { title: '年份', width: 100 },
  totalQuota: { title: '总额度', width: 100 },
  usedQuota: { title: '已用额度', width: 100 },
  remainingQuota: { title: '剩余额度', width: 100 }
}

// 导出数据（移除不需要导出的字段）
const exportData = computed(() => {
  return tableData.value.map(item => ({
    employeeName: item.employeeName,
    departmentName: item.departmentName,
    leaveTypeName: item.leaveTypeName,
    year: item.year,
    totalQuota: item.totalQuota,
    usedQuota: item.usedQuota,
    remainingQuota: item.remainingQuota
  }))
})

onMounted(() => {
  getList()
  getLeaveTypes()
})
</script>

<style scoped lang="scss">
.leave-ledger-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
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
}

.operation-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .operation-buttons {
    display: flex;
  }
}

.data-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
    justify-content: flex-end;
  }
}

.detail-info {
  margin-bottom: 20px;
}

.detail-tabs {
  :deep(.el-tabs__content) {
    padding: 0;
  }
}
</style>
