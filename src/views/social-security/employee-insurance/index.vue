<template>
  <div class="employee-insurance-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="身份证号">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.department" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="操作类型">
            <el-select v-model="queryParams.operationType" placeholder="请选择操作类型" style="width: 150px" clearable>
              <el-option label="参保" :value="1" />
              <el-option label="停保" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待办理" :value="1" />
              <el-option label="已办理" :value="2" />
              <el-option label="已取消" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
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
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增增减员
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
          <el-table-column prop="employeeName" label="员工姓名" min-width="8%" />
          <el-table-column prop="idCard" label="身份证号" min-width="12%" />
          <el-table-column prop="department" label="部门" min-width="10%" />
          <el-table-column label="操作类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.operationType === 1" type="success">参保</el-tag>
              <el-tag v-else-if="row.operationType === 2" type="warning">停保</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" min-width="8%" />
          <el-table-column label="参保险种" min-width="18%">
            <template #default="{ row }">
              <span>{{ row.insuranceTypes.join('、') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始日期" min-width="9%" />
          <el-table-column prop="endDate" label="结束日期" min-width="9%" />
          <el-table-column label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待办理</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已办理</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
        </el-form-item>

        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="操作类型" prop="operationType">
          <el-select v-model="formData.operationType" placeholder="请选择操作类型" style="width: 100%">
            <el-option label="参保" :value="1" />
            <el-option label="停保" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="formData.city" placeholder="请输入城市" />
        </el-form-item>

        <el-form-item label="参保险种" prop="insuranceTypes">
          <el-checkbox-group v-model="formData.insuranceTypes">
            <el-checkbox label="养老">养老</el-checkbox>
            <el-checkbox label="医疗">医疗</el-checkbox>
            <el-checkbox label="失业">失业</el-checkbox>
            <el-checkbox label="工伤">工伤</el-checkbox>
            <el-checkbox label="生育">生育</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="请选择结束日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待办理" :value="1" />
            <el-option label="已办理" :value="2" />
            <el-option label="已取消" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="增减员详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ detailData.idCard }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.department }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag v-if="detailData.operationType === 1" type="success">参保</el-tag>
          <el-tag v-else-if="detailData.operationType === 2" type="warning">停保</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="参保险种">
          {{ detailData.insuranceTypes?.join('、') }}
        </el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ detailData.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ detailData.endDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待办理</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已办理</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="info">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getEmployeeInsuranceList,
  addEmployeeInsurance,
  updateEmployeeInsurance,
  deleteEmployeeInsurance,
  batchDeleteEmployeeInsurance
} from '@/api/employeeInsurance'
import type { EmployeeInsurance, EmployeeInsuranceListParams } from '@/types/socialSecurity'

defineOptions({
  name: 'EmployeeInsurance'
})

// 查询参数
const queryParams = reactive<EmployeeInsuranceListParams>({
  employeeName: '',
  idCard: '',
  department: '',
  operationType: null,
  city: '',
  status: null,
  startDateStart: '',
  startDateEnd: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<EmployeeInsurance[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<EmployeeInsurance>>({
  employeeName: '',
  idCard: '',
  department: '',
  operationType: 1,
  city: '',
  insuranceTypes: [],
  startDate: '',
  endDate: '',
  status: 1,
  remark: ''
})

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<EmployeeInsurance>>({})

// 表单验证规则
const formRules: FormRules = {
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  operationType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  insuranceTypes: [{ required: true, message: '请选择参保险种', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取列表数据
const fetchData = async () => {
  try {
    const res = await getEmployeeInsuranceList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 日期范围变化
const handleDateChange = (value: [string, string] | null) => {
  if (value) {
    queryParams.startDateStart = value[0]
    queryParams.startDateEnd = value[1]
  } else {
    queryParams.startDateStart = ''
    queryParams.startDateEnd = ''
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.idCard = ''
  queryParams.department = ''
  queryParams.operationType = null
  queryParams.city = ''
  queryParams.status = null
  queryParams.startDateStart = ''
  queryParams.startDateEnd = ''
  dateRange.value = null
  queryParams.page = 1
  fetchData()
}

// 表格选择变化
const handleSelectionChange = (selection: EmployeeInsurance[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增增减员'
  Object.assign(formData, {
    employeeName: '',
    idCard: '',
    department: '',
    operationType: 1,
    city: '',
    insuranceTypes: [],
    startDate: '',
    endDate: '',
    status: 1,
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: EmployeeInsurance) => {
  dialogTitle.value = '编辑增减员'
  Object.assign(formData, {
    id: row.id,
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    idCard: row.idCard,
    department: row.department,
    operationType: row.operationType,
    city: row.city,
    insuranceTypes: [...row.insuranceTypes],
    startDate: row.startDate,
    endDate: row.endDate,
    status: row.status,
    remark: row.remark
  })
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: EmployeeInsurance) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: EmployeeInsurance) => {
  try {
    await ElMessageBox.confirm('确定要删除该增减员记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteEmployeeInsurance?.(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch (error) {
    // 取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await batchDeleteEmployeeInsurance?.(selectedIds.value)
    if (res && 'code' in res && res.code === 200) {
      ElMessage.success('批量删除成功')
      fetchData()
    }
  } catch (error) {
    // 取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          const res = await updateEmployeeInsurance(formData)
          if (res.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            fetchData()
          }
        } else {
          const res = await addEmployeeInsurance(formData)
          if (res.code === 200) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            fetchData()
          }
        }
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 弹窗关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  fetchData()
}

const handleCurrentChange = (page: number) => {
  queryParams.page = page
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.employee-insurance-container {
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
</style>
