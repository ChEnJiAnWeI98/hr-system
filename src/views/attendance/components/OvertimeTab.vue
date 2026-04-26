<template>
  <div class="overtime-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentId" placeholder="请输入部门ID" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="加班日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 280px"
            />
          </el-form-item>

          <el-form-item label="加班类型">
            <el-select v-model="queryParams.overtimeType" placeholder="请选择加班类型" style="width: 150px" clearable>
              <el-option label="工作日加班" :value="1" />
              <el-option label="周末加班" :value="2" />
              <el-option label="节假日加班" :value="3" />
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
            新增加班申请
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="overtimeDate" label="加班日期" min-width="10%" />
          <el-table-column prop="startTime" label="开始时间" min-width="8%" />
          <el-table-column prop="endTime" label="结束时间" min-width="8%" />
          <el-table-column prop="overtimeHours" label="加班时长(小时)" min-width="9%" />
          <el-table-column prop="overtimeType" label="加班类型" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.overtimeType === 1" type="success">工作日加班</el-tag>
              <el-tag v-else-if="row.overtimeType === 2" type="warning">周末加班</el-tag>
              <el-tag v-else-if="row.overtimeType === 3" type="danger">节假日加班</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="compensationType" label="补偿方式" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.compensationType === 1" type="success">加班费</el-tag>
              <el-tag v-else-if="row.compensationType === 2" type="info">调休</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.approvalStatus === 0" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.approvalStatus === 1" type="success">已批准</el-tag>
              <el-tag v-else-if="row.approvalStatus === 2" type="danger">已拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="加班原因" min-width="15%" show-overflow-tooltip />
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link @click="handleEdit(row)" v-if="row.approvalStatus === 0">
                编辑
              </el-button>
              <el-button link type="success" @click="handleApprove(row)" v-if="row.approvalStatus === 0">
                批准
              </el-button>
              <el-button link type="danger" @click="handleReject(row)" v-if="row.approvalStatus === 0">
                拒绝
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="员工" prop="employeeId">
          <el-input v-model="formData.employeeName" placeholder="请选择员工" readonly />
        </el-form-item>

        <el-form-item label="加班日期" prop="overtimeDate">
          <el-date-picker
            v-model="formData.overtimeDate"
            type="date"
            placeholder="请选择加班日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="formData.startTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择开始时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="formData.endTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择结束时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="加班时长" prop="overtimeHours">
          <el-input v-model="formData.overtimeHours" placeholder="请输入加班时长(小时)" />
        </el-form-item>

        <el-form-item label="加班类型" prop="overtimeType">
          <el-select v-model="formData.overtimeType" placeholder="请选择加班类型" style="width: 100%">
            <el-option label="工作日加班" :value="1" />
            <el-option label="周末加班" :value="2" />
            <el-option label="节假日加班" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="补偿方式" prop="compensationType">
          <el-radio-group v-model="formData.compensationType">
            <el-radio :value="1">加班费</el-radio>
            <el-radio :value="2">调休</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="加班原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入加班原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailDialogVisible"
      title="加班申请详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ detailData.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="加班日期">{{ detailData.overtimeDate }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ detailData.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ detailData.endTime }}</el-descriptions-item>
        <el-descriptions-item label="加班时长">{{ detailData.overtimeHours }} 小时</el-descriptions-item>
        <el-descriptions-item label="加班类型">
          <el-tag v-if="detailData.overtimeType === 1" type="success">工作日加班</el-tag>
          <el-tag v-else-if="detailData.overtimeType === 2" type="warning">周末加班</el-tag>
          <el-tag v-else-if="detailData.overtimeType === 3" type="danger">节假日加班</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="补偿方式">
          <el-tag v-if="detailData.compensationType === 1" type="success">加班费</el-tag>
          <el-tag v-else-if="detailData.compensationType === 2" type="info">调休</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">已批准</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">已拒绝</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="加班原因" :span="2">{{ detailData.reason }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="detailData.approver">{{ detailData.approver }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="detailData.approvalTime">{{ detailData.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="detailData.approvalComment">{{ detailData.approvalComment }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ detailData.createTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalDialogTitle"
      width="500px"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审批意见">
          <el-input
            v-model="approvalForm.approvalComment"
            type="textarea"
            :rows="4"
            :placeholder="approvalType === 'approve' ? '请输入批准意见(可选)' : '请输入拒绝原因'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button :type="approvalType === 'approve' ? 'success' : 'danger'" @click="handleApprovalSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getOvertimeApplicationList,
  getOvertimeApplicationDetail,
  addOvertimeApplication,
  updateOvertimeApplication,
  deleteOvertimeApplication,
  batchDeleteOvertimeApplications,
  approveOvertimeApplication,
  rejectOvertimeApplication
} from '@/api/overtime'
import type { OvertimeApplication, OvertimeApplicationListParams } from '@/types/attendance'

const queryParams = reactive<OvertimeApplicationListParams>({
  employeeName: '',
  departmentId: null,
  overtimeDateStart: '',
  overtimeDateEnd: '',
  overtimeType: null,
  approvalStatus: null,
  page: 1,
  pageSize: 10
})

const dateRange = ref<[string, string] | null>(null)
const tableData = ref<OvertimeApplication[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<OvertimeApplication>>({
  employeeId: 1,
  employeeName: '张三',
  employeeCode: 'E001',
  departmentName: '技术部',
  overtimeDate: '',
  startTime: '',
  endTime: '',
  overtimeHours: 0,
  overtimeType: 1,
  compensationType: 1,
  reason: ''
})

const formRules: FormRules = {
  overtimeDate: [{ required: true, message: '请选择加班日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  overtimeHours: [{ required: true, message: '请输入加班时长', trigger: 'blur' }],
  overtimeType: [{ required: true, message: '请选择加班类型', trigger: 'change' }],
  compensationType: [{ required: true, message: '请选择补偿方式', trigger: 'change' }],
  reason: [{ required: true, message: '请输入加班原因', trigger: 'blur' }]
}

const detailDialogVisible = ref(false)
const detailData = ref<OvertimeApplication>({} as OvertimeApplication)

const approvalDialogVisible = ref(false)
const approvalDialogTitle = ref('')
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalForm = reactive({
  id: 0,
  approvalComment: ''
})

const fetchData = async () => {
  try {
    if (dateRange.value) {
      queryParams.overtimeDateStart = dateRange.value[0]
      queryParams.overtimeDateEnd = dateRange.value[1]
    } else {
      queryParams.overtimeDateStart = ''
      queryParams.overtimeDateEnd = ''
    }

    const res = await getOvertimeApplicationList(queryParams)
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
  queryParams.employeeName = ''
  queryParams.departmentId = null
  queryParams.overtimeType = null
  queryParams.approvalStatus = null
  dateRange.value = null
  queryParams.overtimeDateStart = ''
  queryParams.overtimeDateEnd = ''
  handleSearch()
}

const handleSelectionChange = (selection: OvertimeApplication[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增加班申请'
  Object.assign(formData, {
    id: undefined,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'E001',
    departmentName: '技术部',
    overtimeDate: '',
    startTime: '',
    endTime: '',
    overtimeHours: 0,
    overtimeType: 1,
    compensationType: 1,
    reason: ''
  })
  dialogVisible.value = true
}

const handleEdit = async (row: OvertimeApplication) => {
  try {
    const res = await getOvertimeApplicationDetail(row.id)
    dialogTitle.value = '编辑加班申请'
    Object.assign(formData, res.data)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleView = async (row: OvertimeApplication) => {
  try {
    const res = await getOvertimeApplicationDetail(row.id)
    detailData.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleDelete = (row: OvertimeApplication) => {
  ElMessageBox.confirm('确定要删除该加班申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteOvertimeApplication(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要批量删除选中的加班申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteOvertimeApplications(selectedIds.value)
      ElMessage.success('批量删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

const handleApprove = (row: OvertimeApplication) => {
  approvalDialogTitle.value = '批准加班申请'
  approvalType.value = 'approve'
  approvalForm.id = row.id
  approvalForm.approvalComment = ''
  approvalDialogVisible.value = true
}

const handleReject = (row: OvertimeApplication) => {
  approvalDialogTitle.value = '拒绝加班申请'
  approvalType.value = 'reject'
  approvalForm.id = row.id
  approvalForm.approvalComment = ''
  approvalDialogVisible.value = true
}

const handleApprovalSubmit = async () => {
  if (approvalType.value === 'reject' && !approvalForm.approvalComment) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    if (approvalType.value === 'approve') {
      await approveOvertimeApplication(approvalForm.id, {
        approvalComment: approvalForm.approvalComment
      })
      ElMessage.success('批准成功')
    } else {
      await rejectOvertimeApplication(approvalForm.id, {
        approvalComment: approvalForm.approvalComment
      })
      ElMessage.success('已拒绝')
    }
    approvalDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateOvertimeApplication(formData as OvertimeApplication)
          ElMessage.success('更新成功')
        } else {
          await addOvertimeApplication(formData)
          ElMessage.success('添加成功')
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
.overtime-tab {
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
