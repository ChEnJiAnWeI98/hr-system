<template>
  <div class="leave-type-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="假期名称">
            <el-input v-model="queryParams.leaveTypeName" placeholder="请输入假期名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="禁用" :value="0" />
              <el-option label="启用" :value="1" />
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
            新增假期类型
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
          <el-table-column type="selection" min-width="5%" fixed="left" />
          <el-table-column prop="leaveTypeName" label="假期名称" min-width="10%" />
          <el-table-column prop="leaveTypeCode" label="假期代码" min-width="12%" />
          <el-table-column prop="unit" label="单位" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.unit === 0 ? 'primary' : 'success'" size="small">
                {{ row.unit === 0 ? '天' : '小时' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="needApproval" label="需要审批" min-width="10%">
            <template #default="{ row }">
              <el-tag :type="row.needApproval === 1 ? 'success' : 'info'" size="small">
                {{ row.needApproval === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deductSalary" label="扣工资" min-width="9%">
            <template #default="{ row }">
              <el-tag :type="row.deductSalary === 1 ? 'danger' : 'success'" size="small">
                {{ row.deductSalary === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="countAsAttendance" label="计入出勤" min-width="10%">
            <template #default="{ row }">
              <el-tag :type="row.countAsAttendance === 1 ? 'success' : 'info'" size="small">
                {{ row.countAsAttendance === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maxDays" label="最大天数" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="15%" />
          <el-table-column label="操作" min-width="12%" fixed="right">
            <template #default="{ row }">
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="假期名称" prop="leaveTypeName">
          <el-input v-model="formData.leaveTypeName" placeholder="请输入假期名称" />
        </el-form-item>
        <el-form-item label="假期代码" prop="leaveTypeCode">
          <el-input v-model="formData.leaveTypeCode" placeholder="请输入假期代码" />
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-radio-group v-model="formData.unit">
            <el-radio :value="0">天</el-radio>
            <el-radio :value="1">小时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否需要审批" prop="needApproval">
          <el-radio-group v-model="formData.needApproval">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否扣薪" prop="deductSalary">
          <el-radio-group v-model="formData.deductSalary">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否计入出勤" prop="countAsAttendance">
          <el-radio-group v-model="formData.countAsAttendance">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最小请假单位" prop="minUnit">
          <el-input v-model="formData.minUnit" placeholder="请输入最小请假单位" />
        </el-form-item>
        <el-form-item label="最大请假天数" prop="maxDays">
          <el-input v-model="formData.maxDays" placeholder="请输入最大请假天数" />
        </el-form-item>
        <el-form-item label="是否允许跨年" prop="allowCrossYear">
          <el-radio-group v-model="formData.allowCrossYear">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否允许累积" prop="allowAccumulate">
          <el-radio-group v-model="formData.allowAccumulate">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期(月)" prop="validityPeriod">
          <el-input v-model="formData.validityPeriod" placeholder="请输入有效期" />
        </el-form-item>
        <el-form-item label="规则说明" prop="ruleDescription">
          <el-input
            v-model="formData.ruleDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入规则说明"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { LeaveType, LeaveTypeListParams } from '@/types/leave'
import { getLeaveTypeList, addLeaveType, updateLeaveType, deleteLeaveType, batchDeleteLeaveTypes } from '@/api/leaveType'

const queryParams = reactive<LeaveTypeListParams>({
  leaveTypeName: '',
  status: null,
  page: 1,
  pageSize: 10
})

const tableData = ref<LeaveType[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<LeaveType>>({
  leaveTypeName: '',
  leaveTypeCode: '',
  unit: 0,
  needApproval: 1,
  deductSalary: 0,
  countAsAttendance: 1,
  minUnit: 0.5,
  maxDays: 0,
  allowCrossYear: 0,
  allowAccumulate: 0,
  validityPeriod: 12,
  ruleDescription: '',
  status: 1
})

const formRules: FormRules = {
  leaveTypeName: [{ required: true, message: '请输入假期名称', trigger: 'blur' }],
  leaveTypeCode: [{ required: true, message: '请输入假期代码', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择计量单位', trigger: 'change' }],
  needApproval: [{ required: true, message: '请选择是否需要审批', trigger: 'change' }],
  deductSalary: [{ required: true, message: '请选择是否扣薪', trigger: 'change' }],
  countAsAttendance: [{ required: true, message: '请选择是否计入出勤', trigger: 'change' }],
  minUnit: [{ required: true, message: '请输入最小请假单位', trigger: 'blur' }],
  maxDays: [{ required: true, message: '请输入最大请假天数', trigger: 'blur' }],
  allowCrossYear: [{ required: true, message: '请选择是否允许跨年', trigger: 'change' }],
  allowAccumulate: [{ required: true, message: '请选择是否允许累积', trigger: 'change' }],
  validityPeriod: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const fetchData = async () => {
  try {
    const res = await getLeaveTypeList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.leaveTypeName = ''
  queryParams.status = null
  handleSearch()
}

const handleSelectionChange = (selection: LeaveType[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增假期类型'
  Object.assign(formData, {
    leaveTypeName: '',
    leaveTypeCode: '',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 0.5,
    maxDays: 0,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: LeaveType) => {
  dialogTitle.value = '编辑假期类型'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (row: LeaveType) => {
  try {
    await ElMessageBox.confirm('确定要删除该假期类型吗？', '提示', {
      type: 'warning'
    })
    await deleteLeaveType(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteLeaveTypes(selectedIds.value)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateLeaveType(formData)
          ElMessage.success('更新成功')
        } else {
          await addLeaveType(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.leave-type-tab {
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
