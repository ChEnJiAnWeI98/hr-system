<template>
  <div class="salary-calculation-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="工资月份">
            <el-date-picker
              v-model="queryParams.salaryMonth"
              type="month"
              placeholder="请选择工资月份"
              value-format="YYYY-MM"
              style="width: 150px"
              clearable
            />
          </el-form-item>

          <el-form-item label="发放状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="未发放" :value="0" />
              <el-option label="已发放" :value="1" />
            </el-select>
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
          生成工资
        </el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
    </el-card>

    <el-card class="data-card">
      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="employeeNo" label="员工工号" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="12%" />
          <el-table-column prop="salaryMonth" label="工资月份" min-width="10%" />
          <el-table-column prop="grossSalary" label="应发工资" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.grossSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="netSalary" label="实发工资" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.netSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="发放状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="warning">未发放</el-tag>
              <el-tag v-else type="success">已发放</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="25%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleViewDetail(row)">
                查看明细
              </el-button>
              <el-button link @click="handleAdjust(row)" :disabled="row.status === 1">
                调整工资
              </el-button>
              <el-button link type="primary" @click="handleSendPayslip(row)" :disabled="row.status === 0">
                发放工资条
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
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

    <!-- 生成工资弹窗 -->
    <el-dialog
      v-model="generateDialogVisible"
      title="生成工资"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="generateForm" :rules="generateRules" ref="generateFormRef" label-width="100px">
        <el-form-item label="工资月份" prop="salaryMonth">
          <el-date-picker
            v-model="generateForm.salaryMonth"
            type="month"
            placeholder="请选择工资月份"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="员工范围" prop="rangeType">
          <el-radio-group v-model="generateForm.rangeType">
            <el-radio :value="1">全部员工</el-radio>
            <el-radio :value="2">指定部门</el-radio>
            <el-radio :value="3">指定员工</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择部门" prop="departmentIds" v-if="generateForm.rangeType === 2">
          <el-select
            v-model="generateForm.departmentIds"
            placeholder="请选择部门"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择员工" prop="employeeIds" v-if="generateForm.rangeType === 3">
          <el-select
            v-model="generateForm.employeeIds"
            placeholder="请选择员工"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="emp in employeeList"
              :key="emp.id"
              :label="`${emp.name} (${emp.employeeNo})`"
              :value="emp.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGenerateConfirm" :loading="generateLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 工资明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工资明细"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="salary-detail" v-if="currentDetail">
        <div class="detail-section">
          <h4>员工信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工姓名">{{ currentDetail.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="员工工号">{{ currentDetail.employeeNo }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ currentDetail.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="工资月份">{{ currentDetail.salaryMonth }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>收入项目</h4>
          <el-table :data="currentDetail.incomeItems" border>
            <el-table-column prop="name" label="项目名称" min-width="15%" />
            <el-table-column prop="amount" label="金额" align="right">
              <template #default="{ row }">
                <el-input
                  v-if="isAdjusting"
                  v-model.number="row.amount"
                  type="number"
                  style="width: 120px"
                />
                <span v-else>{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <h4>扣款项目</h4>
          <el-table :data="currentDetail.deductionItems" border>
            <el-table-column prop="name" label="项目名称" min-width="15%" />
            <el-table-column prop="amount" label="金额" align="right">
              <template #default="{ row }">
                <el-input
                  v-if="isAdjusting"
                  v-model.number="row.amount"
                  type="number"
                  style="width: 120px"
                />
                <span v-else>{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <h4>工资汇总</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="应发工资">
              <span class="amount-text">{{ calculateGrossSalary().toFixed(2) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="实发工资">
              <span class="amount-text primary">{{ calculateNetSalary().toFixed(2) }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button v-if="!isAdjusting && currentDetail?.status === 0" type="primary" @click="isAdjusting = true">
          调整工资
        </el-button>
        <el-button v-if="isAdjusting" @click="handleCancelAdjust">
          取消调整
        </el-button>
        <el-button v-if="isAdjusting" type="primary" @click="handleSaveAdjust" :loading="adjustLoading">
          保存调整
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { DocumentAdd, Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'SalaryCalculationTab'
})

// 查询参数
const queryParams = reactive({
  employeeName: '',
  salaryMonth: '',
  status: null as number | null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 生成工资弹窗
const generateDialogVisible = ref(false)
const generateLoading = ref(false)
const generateFormRef = ref<FormInstance>()
const generateForm = reactive({
  salaryMonth: '',
  rangeType: 1,
  departmentIds: [] as number[],
  employeeIds: [] as number[]
})

const generateRules: FormRules = {
  salaryMonth: [{ required: true, message: '请选择工资月份', trigger: 'change' }],
  rangeType: [{ required: true, message: '请选择员工范围', trigger: 'change' }],
  departmentIds: [{ required: true, message: '请选择部门', trigger: 'change' }],
  employeeIds: [{ required: true, message: '请选择员工', trigger: 'change' }]
}

// 部门和员工列表
const departmentList = ref<any[]>([])
const employeeList = ref<any[]>([])

// 工资明细弹窗
const detailDialogVisible = ref(false)
const currentDetail = ref<any>(null)
const isAdjusting = ref(false)
const adjustLoading = ref(false)
const originalDetail = ref<any>(null)

// 初始化数据
onMounted(() => {
  loadTableData()
  loadDepartmentList()
  loadEmployeeList()
})

// 加载表格数据
const loadTableData = async () => {
  try {
    // Mock 数据
    const mockData = [
      {
        id: 1,
        employeeName: '张三',
        employeeNo: 'EMP001',
        departmentName: '技术部',
        salaryMonth: '2024-03',
        grossSalary: 15000.00,
        netSalary: 13245.50,
        status: 1
      },
      {
        id: 2,
        employeeName: '李四',
        employeeNo: 'EMP002',
        departmentName: '产品部',
        salaryMonth: '2024-03',
        grossSalary: 12000.00,
        netSalary: 10680.00,
        status: 1
      },
      {
        id: 3,
        employeeName: '王五',
        employeeNo: 'EMP003',
        departmentName: '技术部',
        salaryMonth: '2024-04',
        grossSalary: 16000.00,
        netSalary: 14120.00,
        status: 0
      },
      {
        id: 4,
        employeeName: '赵六',
        employeeNo: 'EMP004',
        departmentName: '市场部',
        salaryMonth: '2024-04',
        grossSalary: 11000.00,
        netSalary: 9845.00,
        status: 0
      }
    ]

    // 筛选
    let filteredData = [...mockData]
    if (queryParams.employeeName) {
      filteredData = filteredData.filter(item => item.employeeName.includes(queryParams.employeeName))
    }
    if (queryParams.salaryMonth) {
      filteredData = filteredData.filter(item => item.salaryMonth === queryParams.salaryMonth)
    }
    if (queryParams.status !== null && queryParams.status !== undefined) {
      filteredData = filteredData.filter(item => item.status === queryParams.status)
    }

    // 分页
    const start = (queryParams.page - 1) * queryParams.pageSize
    const end = start + queryParams.pageSize
    tableData.value = filteredData.slice(start, end)
    total.value = filteredData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 加载部门列表
const loadDepartmentList = async () => {
  departmentList.value = [
    { id: 1, name: '技术部' },
    { id: 2, name: '产品部' },
    { id: 3, name: '市场部' },
    { id: 4, name: '人力资源部' }
  ]
}

// 加载员工列表
const loadEmployeeList = async () => {
  employeeList.value = [
    { id: 1, name: '张三', employeeNo: 'EMP001' },
    { id: 2, name: '李四', employeeNo: 'EMP002' },
    { id: 3, name: '王五', employeeNo: 'EMP003' },
    { id: 4, name: '赵六', employeeNo: 'EMP004' }
  ]
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadTableData()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.salaryMonth = ''
  queryParams.status = null
  queryParams.page = 1
  loadTableData()
}

// 表格选择
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 生成工资
const handleGenerate = () => {
  generateDialogVisible.value = true
  generateForm.salaryMonth = ''
  generateForm.rangeType = 1
  generateForm.departmentIds = []
  generateForm.employeeIds = []
}

// 确认生成工资
const handleGenerateConfirm = async () => {
  if (!generateFormRef.value) return

  await generateFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      generateLoading.value = true
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('工资生成成功')
      generateDialogVisible.value = false
      loadTableData()
    } catch (error) {
      ElMessage.error('工资生成失败')
    } finally {
      generateLoading.value = false
    }
  })
}

// 查看明细
const handleViewDetail = (row: any) => {
  currentDetail.value = {
    ...row,
    incomeItems: [
      { name: '基本工资', amount: 8000.00 },
      { name: '绩效工资', amount: 3000.00 },
      { name: '岗位津贴', amount: 2000.00 },
      { name: '加班费', amount: 1500.00 },
      { name: '其他收入', amount: 500.00 }
    ],
    deductionItems: [
      { name: '社保', amount: 800.00 },
      { name: '公积金', amount: 600.00 },
      { name: '个税', amount: 354.50 },
      { name: '其他扣款', amount: 0.00 }
    ]
  }
  originalDetail.value = JSON.parse(JSON.stringify(currentDetail.value))
  isAdjusting.value = false
  detailDialogVisible.value = true
}

// 调整工资
const handleAdjust = (row: any) => {
  handleViewDetail(row)
  isAdjusting.value = true
}

// 取消调整
const handleCancelAdjust = () => {
  currentDetail.value = JSON.parse(JSON.stringify(originalDetail.value))
  isAdjusting.value = false
}

// 保存调整
const handleSaveAdjust = async () => {
  try {
    adjustLoading.value = true
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('工资调整成功')
    isAdjusting.value = false
    detailDialogVisible.value = false
    loadTableData()
  } catch (error) {
    ElMessage.error('工资调整失败')
  } finally {
    adjustLoading.value = false
  }
}

// 计算应发工资
const calculateGrossSalary = () => {
  if (!currentDetail.value) return 0
  return currentDetail.value.incomeItems.reduce((sum: number, item: any) => sum + Number(item.amount), 0)
}

// 计算实发工资
const calculateNetSalary = () => {
  const gross = calculateGrossSalary()
  if (!currentDetail.value) return 0
  const deduction = currentDetail.value.deductionItems.reduce((sum: number, item: any) => sum + Number(item.amount), 0)
  return gross - deduction
}

// 发放工资条
const handleSendPayslip = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要发放 ${row.employeeName} 的工资条吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('工资条发放成功')
    loadTableData()
  } catch (error) {
    // 用户取消
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除 ${row.employeeName} 的工资记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('删除成功')
    loadTableData()
  } catch (error) {
    // 用户取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条工资记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadTableData()
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
.salary-calculation-tab {
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

.salary-detail {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .amount-text {
    font-size: 16px;
    font-weight: 600;
    color: #303133;

    &.primary {
      color: var(--el-color-primary);
    }
  }
}
</style>
