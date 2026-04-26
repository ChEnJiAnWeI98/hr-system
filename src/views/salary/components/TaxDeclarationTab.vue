<template>
  <div class="tax-declaration-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="申报月份">
            <el-date-picker
              v-model="queryParams.declarationMonth"
              type="month"
              placeholder="请选择申报月份"
              value-format="YYYY-MM"
              style="width: 200px"
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

    <el-card class="action-card">
      <div class="header-buttons">
        <el-button type="primary" @click="handleGenerate">
          <el-icon><DocumentAdd /></el-icon>
          生成申报
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出申报表
        </el-button>
      </div>
    </el-card>

    <el-card class="data-card">
      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="employeeName" label="员工姓名" min-width="12%" />
          <el-table-column prop="employeeNo" label="员工工号" min-width="12%" />
          <el-table-column prop="declarationMonth" label="申报月份" min-width="12%" />
          <el-table-column prop="currentIncome" label="本期收入" min-width="12%" align="right">
            <template #default="{ row }">
              {{ row.currentIncome.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="currentTaxPayable" label="本期应缴税额" min-width="14%" align="right">
            <template #default="{ row }">
              {{ row.currentTaxPayable.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="currentTaxPaid" label="本期实缴税额" min-width="14%" align="right">
            <template #default="{ row }">
              {{ row.currentTaxPaid.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="10%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看详情
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

    <!-- 生成申报弹窗 -->
    <el-dialog
      v-model="generateDialogVisible"
      title="生成个税申报"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="generateFormRef"
        :model="generateForm"
        :rules="generateRules"
        label-width="100px"
      >
        <el-form-item label="申报月份" prop="declarationMonth">
          <el-date-picker
            v-model="generateForm.declarationMonth"
            type="month"
            placeholder="请选择申报月份"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="员工范围" prop="rangeType">
          <el-radio-group v-model="generateForm.rangeType">
            <el-radio value="all">全部员工</el-radio>
            <el-radio value="department">指定部门</el-radio>
            <el-radio value="employee">指定员工</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="generateForm.rangeType === 'department'"
          label="选择部门"
          prop="departmentIds"
        >
          <el-select
            v-model="generateForm.departmentIds"
            multiple
            placeholder="请选择部门"
            style="width: 100%"
          >
            <el-option label="技术部" :value="1" />
            <el-option label="市场部" :value="2" />
            <el-option label="人事部" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="generateForm.rangeType === 'employee'"
          label="选择员工"
          prop="employeeIds"
        >
          <el-select
            v-model="generateForm.employeeIds"
            multiple
            placeholder="请选择员工"
            style="width: 100%"
          >
            <el-option label="张三" :value="1" />
            <el-option label="李四" :value="2" />
            <el-option label="王五" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmGenerate">确定</el-button>
      </template>
    </el-dialog>

    <!-- 申报详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="个税申报详情"
      width="800px"
    >
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions title="员工基本信息" :column="3" border>
          <el-descriptions-item label="员工姓名">{{ currentDetail.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="员工工号">{{ currentDetail.employeeNo }}</el-descriptions-item>
          <el-descriptions-item label="申报月份">{{ currentDetail.declarationMonth }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="本期数据" :column="2" border style="margin-top: 20px">
          <el-descriptions-item label="本期收入">{{ currentDetail.currentIncome.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="本期专项扣除">{{ currentDetail.currentSpecialDeduction.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="本期专项附加扣除">{{ currentDetail.currentAdditionalDeduction.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="本期应纳税所得额">{{ currentDetail.currentTaxableIncome.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="本期应缴税额">{{ currentDetail.currentTaxPayable.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="本期实缴税额">{{ currentDetail.currentTaxPaid.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="累计数据" :column="2" border style="margin-top: 20px">
          <el-descriptions-item label="累计收入">{{ currentDetail.accumulatedIncome.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="累计专项扣除">{{ currentDetail.accumulatedSpecialDeduction.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="累计专项附加扣除">{{ currentDetail.accumulatedAdditionalDeduction.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="累计应纳税所得额">{{ currentDetail.accumulatedTaxableIncome.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="累计已缴税额" :span="2">{{ currentDetail.accumulatedTaxPaid.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { DocumentAdd, Download } from '@element-plus/icons-vue'
import {
  getTaxDeclarationList,
  getTaxDeclarationDetail,
  generateTaxDeclaration
} from '@/api/taxDeclaration'
import type {
  TaxDeclaration,
  TaxDeclarationDetail,
  TaxDeclarationListParams,
  GenerateTaxDeclarationParams
} from '@/types/taxDeclaration'

defineOptions({
  name: 'TaxDeclarationTab'
})

// 查询参数
const queryParams = reactive<TaxDeclarationListParams>({
  employeeName: '',
  declarationMonth: '',
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<TaxDeclaration[]>([])
const total = ref(0)

// 生成申报弹窗
const generateDialogVisible = ref(false)
const generateFormRef = ref<FormInstance>()
const generateForm = reactive<GenerateTaxDeclarationParams>({
  declarationMonth: '',
  rangeType: 'all',
  departmentIds: [],
  employeeIds: []
})

const generateRules: FormRules = {
  declarationMonth: [
    { required: true, message: '请选择申报月份', trigger: 'change' }
  ],
  rangeType: [
    { required: true, message: '请选择员工范围', trigger: 'change' }
  ],
  departmentIds: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  employeeIds: [
    { required: true, message: '请选择员工', trigger: 'change' }
  ]
}

// 详情弹窗
const detailDialogVisible = ref(false)
const currentDetail = ref<TaxDeclarationDetail | null>(null)

/**
 * 获取列表数据
 */
const fetchList = async () => {
  try {
    const res = await getTaxDeclarationList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取个税申报列表失败:', error)
    ElMessage.error('获取列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  fetchList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.declarationMonth = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchList()
}

/**
 * 生成申报
 */
const handleGenerate = () => {
  generateForm.declarationMonth = ''
  generateForm.rangeType = 'all'
  generateForm.departmentIds = []
  generateForm.employeeIds = []
  generateDialogVisible.value = true
}

/**
 * 确认生成申报
 */
const handleConfirmGenerate = async () => {
  if (!generateFormRef.value) return

  await generateFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await generateTaxDeclaration(generateForm)
        if (res.code === 200) {
          ElMessage.success('生成申报成功')
          generateDialogVisible.value = false
          fetchList()
        }
      } catch (error) {
        console.error('生成申报失败:', error)
        ElMessage.error('生成申报失败')
      }
    }
  })
}

/**
 * 查看详情
 */
const handleViewDetail = async (row: TaxDeclaration) => {
  try {
    const res = await getTaxDeclarationDetail(row.id)
    if (res.code === 200) {
      currentDetail.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

/**
 * 导出申报表
 */
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.tax-declaration-tab {
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

.action-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .header-buttons {
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

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.detail-content {
  :deep(.el-descriptions__title) {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
}
</style>
