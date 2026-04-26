<template>
  <div class="salary-adjustment-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="调薪类型">
            <el-select v-model="queryParams.adjustmentType" placeholder="请选择调薪类型" style="width: 150px" clearable>
              <el-option label="晋升调薪" :value="1" />
              <el-option label="年度调薪" :value="2" />
              <el-option label="绩效调薪" :value="3" />
              <el-option label="市场调薪" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="审批状态">
            <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="已批准" :value="1" />
              <el-option label="已拒绝" :value="2" />
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

    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增申请
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="employeeCode" label="员工工号" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="adjustmentTypeName" label="调薪类型" min-width="10%" />
          <el-table-column prop="beforeSalary" label="调薪前薪资" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.beforeSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="afterSalary" label="调薪后薪资" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.afterSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="adjustmentRate" label="调薪幅度" min-width="8%">
            <template #default="{ row }">
              {{ row.adjustmentRate.toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="effectiveDate" label="生效日期" min-width="10%" />
          <el-table-column prop="approvalStatusName" label="审批状态" min-width="9%">
            <template #default="{ row }">
              <el-tag v-if="row.approvalStatus === 0" type="warning">{{ row.approvalStatusName }}</el-tag>
              <el-tag v-else-if="row.approvalStatus === 1" type="success">{{ row.approvalStatusName }}</el-tag>
              <el-tag v-else-if="row.approvalStatus === 2" type="danger">{{ row.approvalStatusName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button v-if="row.approvalStatus === 0" link type="primary" @click="handleApprove(row)">
                审批
              </el-button>
              <el-button v-if="row.approvalStatus === 0" link type="danger" @click="handleDelete(row)">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增申请弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增调薪申请"
      width="600px"
      @close="handleAddDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item label="员工" prop="employeeId">
          <el-select
            v-model="addForm.employeeId"
            placeholder="请选择员工"
            style="width: 100%"
            filterable
            @change="handleEmployeeChange"
          >
            <el-option
              v-for="emp in employeeList"
              :key="emp.id"
              :label="`${emp.name} (${emp.code})`"
              :value="emp.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="调薪类型" prop="adjustmentType">
          <el-radio-group v-model="addForm.adjustmentType">
            <el-radio :label="1">晋升调薪</el-radio>
            <el-radio :label="2">年度调薪</el-radio>
            <el-radio :label="3">绩效调薪</el-radio>
            <el-radio :label="4">市场调薪</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="调薪前薪资" prop="beforeSalary">
          <el-input
            v-model="addForm.beforeSalary"
            placeholder="请输入调薪前薪资"
            disabled
          >
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="调薪后薪资" prop="afterSalary">
          <el-input
            v-model="addForm.afterSalary"
            placeholder="请输入调薪后薪资"
            @input="calculateAdjustmentRate"
          >
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="调薪幅度">
          <el-input
            v-model="adjustmentRateDisplay"
            disabled
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="调薪原因" prop="reason">
          <el-input
            v-model="addForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入调薪原因"
          />
        </el-form-item>

        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="addForm.effectiveDate"
            type="date"
            placeholder="请选择生效日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="调薪申请详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ detailData.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="调薪类型">{{ detailData.adjustmentTypeName }}</el-descriptions-item>
        <el-descriptions-item label="调薪前薪资">¥{{ detailData.beforeSalary?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="调薪后薪资">¥{{ detailData.afterSalary?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="调薪幅度">{{ detailData.adjustmentRate?.toFixed(2) }}%</el-descriptions-item>
        <el-descriptions-item label="生效日期">{{ detailData.effectiveDate }}</el-descriptions-item>
        <el-descriptions-item label="调薪原因" :span="2">{{ detailData.reason }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">{{ detailData.approvalStatusName }}</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">{{ detailData.approvalStatusName }}</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">{{ detailData.approvalStatusName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批人">{{ detailData.approver || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" :span="2">{{ detailData.approvalTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2">{{ detailData.approvalComment || '-' }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="审批调薪申请"
      width="500px"
      @close="handleApproveDialogClose"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveFormRules"
        label-width="100px"
      >
        <el-form-item label="审批结果" prop="approvalResult">
          <el-radio-group v-model="approveForm.approvalResult">
            <el-radio :label="1">批准</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见" prop="approvalComment">
          <el-input
            v-model="approveForm.approvalComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { SalaryAdjustment, SalaryAdjustmentListParams } from '@/types/salary'
import {
  getSalaryAdjustmentList,
  getSalaryAdjustmentDetail,
  addSalaryAdjustment,
  deleteSalaryAdjustment,
  batchDeleteSalaryAdjustments,
  approveSalaryAdjustment
} from '@/api/salary'

defineOptions({
  name: 'SalaryAdjustmentTab'
})

// 查询参数
const queryParams = reactive<SalaryAdjustmentListParams>({
  employeeName: '',
  adjustmentType: null,
  approvalStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<SalaryAdjustment[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 模拟员工列表
const employeeList = ref([
  { id: 1, code: 'E001', name: '张三', department: '技术部', salary: 15000 },
  { id: 2, code: 'E002', name: '李四', department: '产品部', salary: 12000 },
  { id: 3, code: 'E003', name: '王五', department: '技术部', salary: 14000 },
  { id: 4, code: 'E004', name: '赵六', department: '市场部', salary: 10000 },
  { id: 5, code: 'E005', name: '孙七', department: '人事部', salary: 11000 }
])

// 新增申请弹窗
const addDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  employeeId: undefined as number | undefined,
  employeeCode: '',
  employeeName: '',
  departmentName: '',
  adjustmentType: 1,
  beforeSalary: '',
  afterSalary: '',
  adjustmentRate: 0,
  reason: '',
  effectiveDate: ''
})

const adjustmentRateDisplay = computed(() => {
  if (addForm.beforeSalary && addForm.afterSalary) {
    const before = parseFloat(addForm.beforeSalary)
    const after = parseFloat(addForm.afterSalary)
    if (before > 0) {
      const rate = ((after - before) / before) * 100
      return rate.toFixed(2)
    }
  }
  return '0.00'
})

const addFormRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调薪类型', trigger: 'change' }],
  beforeSalary: [{ required: true, message: '调薪前薪资不能为空', trigger: 'blur' }],
  afterSalary: [
    { required: true, message: '请输入调薪后薪资', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入调薪后薪资'))
        } else if (isNaN(Number(value))) {
          callback(new Error('请输入有效的数字'))
        } else if (Number(value) <= 0) {
          callback(new Error('调薪后薪资必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  reason: [{ required: true, message: '请输入调薪原因', trigger: 'blur' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
}

// 详情弹窗
const detailDialogVisible = ref(false)
const detailData = ref<Partial<SalaryAdjustment>>({})

// 审批弹窗
const approveDialogVisible = ref(false)
const approveFormRef = ref<FormInstance>()
const approveForm = reactive({
  id: 0,
  approvalResult: 1,
  approvalComment: ''
})

const approveFormRules: FormRules = {
  approvalResult: [{ required: true, message: '请选择审批结果', trigger: 'change' }]
}

// 获取列表
const getList = async () => {
  try {
    const res = await getSalaryAdjustmentList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
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
  queryParams.adjustmentType = null
  queryParams.approvalStatus = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  getList()
}

const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}

// 表格选择
const handleSelectionChange = (selection: SalaryAdjustment[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  addDialogVisible.value = true
}

// 员工选择变化
const handleEmployeeChange = (employeeId: number) => {
  const employee = employeeList.value.find(emp => emp.id === employeeId)
  if (employee) {
    addForm.employeeCode = employee.code
    addForm.employeeName = employee.name
    addForm.departmentName = employee.department
    addForm.beforeSalary = employee.salary.toString()
  }
}

// 计算调薪幅度
const calculateAdjustmentRate = () => {
  if (addForm.beforeSalary && addForm.afterSalary) {
    const before = parseFloat(addForm.beforeSalary)
    const after = parseFloat(addForm.afterSalary)
    if (before > 0) {
      addForm.adjustmentRate = ((after - before) / before) * 100
    }
  }
}

// 新增提交
const handleAddSubmit = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await addSalaryAdjustment({
          employeeId: addForm.employeeId,
          employeeCode: addForm.employeeCode,
          employeeName: addForm.employeeName,
          departmentName: addForm.departmentName,
          adjustmentType: addForm.adjustmentType,
          beforeSalary: parseFloat(addForm.beforeSalary),
          afterSalary: parseFloat(addForm.afterSalary),
          adjustmentRate: addForm.adjustmentRate,
          reason: addForm.reason,
          effectiveDate: addForm.effectiveDate
        })
        if (res.code === 200) {
          ElMessage.success('添加成功')
          addDialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('添加失败:', error)
        ElMessage.error('添加失败')
      }
    }
  })
}

// 新增弹窗关闭
const handleAddDialogClose = () => {
  addFormRef.value?.resetFields()
  addForm.employeeId = undefined
  addForm.employeeCode = ''
  addForm.employeeName = ''
  addForm.departmentName = ''
  addForm.adjustmentType = 1
  addForm.beforeSalary = ''
  addForm.afterSalary = ''
  addForm.adjustmentRate = 0
  addForm.reason = ''
  addForm.effectiveDate = ''
}

// 查看详情
const handleView = async (row: SalaryAdjustment) => {
  try {
    const res = await getSalaryAdjustmentDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 审批
const handleApprove = (row: SalaryAdjustment) => {
  approveForm.id = row.id
  approveForm.approvalResult = 1
  approveForm.approvalComment = ''
  approveDialogVisible.value = true
}

// 审批提交
const handleApproveSubmit = async () => {
  if (!approveFormRef.value) return

  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await approveSalaryAdjustment(approveForm.id, {
          approvalResult: approveForm.approvalResult,
          approvalComment: approveForm.approvalComment
        })
        if (res.code === 200) {
          ElMessage.success(res.message)
          approveDialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('审批失败:', error)
        ElMessage.error('审批失败')
      }
    }
  })
}

// 审批弹窗关闭
const handleApproveDialogClose = () => {
  approveFormRef.value?.resetFields()
}

// 删除
const handleDelete = (row: SalaryAdjustment) => {
  ElMessageBox.confirm('确定要删除该调薪申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteSalaryAdjustment(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条调薪申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await batchDeleteSalaryAdjustments(selectedIds.value)
      if (res.code === 200) {
        ElMessage.success('批量删除成功')
        getList()
      }
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.salary-adjustment-tab {
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
  }
}
</style>
