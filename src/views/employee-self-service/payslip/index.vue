<template>
  <div class="payslip-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="月份范围">
            <el-date-picker
              v-model="dateRange"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              format="YYYY-MM"
              value-format="YYYY-MM"
              style="width: 300px"
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleBatchExport">
            <el-icon><Download /></el-icon>
            批量导出
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="month" label="工资月份" min-width="10%" />
          <el-table-column prop="grossSalary" label="应发工资" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.grossSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="netSalary" label="实发工资" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.netSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="12%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看详情
              </el-button>
              <el-button link @click="handleDownload(row)">
                下载
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
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="工资条详情" width="600px">
      <div class="payslip-detail">
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <div class="detail-row">
            <span class="detail-label">工资月份：</span>
            <span class="detail-value">{{ currentPayslip.month }}</span>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">收入明细</div>
          <div class="detail-row">
            <span class="detail-label">基本工资：</span>
            <span class="detail-value">¥{{ currentPayslip.baseSalary?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">绩效工资：</span>
            <span class="detail-value">¥{{ currentPayslip.performanceSalary?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">岗位津贴：</span>
            <span class="detail-value">¥{{ currentPayslip.positionAllowance?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">交通补贴：</span>
            <span class="detail-value">¥{{ currentPayslip.transportAllowance?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">餐补：</span>
            <span class="detail-value">¥{{ currentPayslip.mealAllowance?.toFixed(2) }}</span>
          </div>
          <div class="detail-row total-row">
            <span class="detail-label">应发工资：</span>
            <span class="detail-value highlight">¥{{ currentPayslip.grossSalary?.toFixed(2) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">扣款明细</div>
          <div class="detail-row">
            <span class="detail-label">社保扣款：</span>
            <span class="detail-value">¥{{ currentPayslip.socialInsurance?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">公积金扣款：</span>
            <span class="detail-value">¥{{ currentPayslip.housingFund?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">个税：</span>
            <span class="detail-value">¥{{ currentPayslip.tax?.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">其他扣款：</span>
            <span class="detail-value">¥{{ currentPayslip.otherDeduction?.toFixed(2) }}</span>
          </div>
          <div class="detail-row total-row">
            <span class="detail-label">实发工资：</span>
            <span class="detail-value highlight">¥{{ currentPayslip.netSalary?.toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="currentPayslip.remark" class="detail-section">
          <div class="section-title">备注</div>
          <div class="detail-row">
            <span class="detail-value">{{ currentPayslip.remark }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentPayslip as Payslip)">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getPayslipList } from '@/api/employee-self-service'
import type { Payslip, PayslipQueryParams } from '@/types/employee-self-service'

defineOptions({
  name: 'EmployeePayslip'
})

// 查询参数
const queryParams = reactive<PayslipQueryParams>({
  startMonth: '',
  endMonth: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<Payslip[]>([])
const total = ref(0)

// 详情弹窗
const detailDialogVisible = ref(false)
const currentPayslip = ref<Partial<Payslip>>({})

/**
 * 加载数据
 */
const loadData = async () => {
  try {
    const res = await getPayslipList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  if (dateRange.value) {
    queryParams.startMonth = dateRange.value[0]
    queryParams.endMonth = dateRange.value[1]
  } else {
    queryParams.startMonth = ''
    queryParams.endMonth = ''
  }
  queryParams.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  dateRange.value = null
  queryParams.startMonth = ''
  queryParams.endMonth = ''
  queryParams.page = 1
  loadData()
}

/**
 * 查看详情
 */
const handleViewDetail = (row: Payslip) => {
  currentPayslip.value = row
  detailDialogVisible.value = true
}

/**
 * 下载
 */
const handleDownload = (row: Payslip) => {
  ElMessage.success(`正在下载 ${row.month} 工资条`)
}

/**
 * 批量导出
 */
const handleBatchExport = () => {
  ElMessage.success('正在导出工资条')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.payslip-container {
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

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
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

.payslip-detail {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;

      &.total-row {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;
        font-weight: 600;
      }

      .detail-label {
        color: #606266;
      }

      .detail-value {
        color: #303133;

        &.highlight {
          color: var(--el-color-primary);
          font-size: 16px;
        }
      }
    }
  }
}
</style>
