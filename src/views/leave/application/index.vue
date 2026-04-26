<template>
  <div class="leave-application-tab">
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

          <el-form-item label="审批状态">
            <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="已批准" :value="1" />
              <el-option label="已拒绝" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="请假时间">
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
            新增请假
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
          <ArtExcelExport
            :data="tableData"
            :filename="exportFilename"
            :columns="exportColumns"
            button-text="导出"
            :auto-index="true"
            index-column-title="序号"
          />
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
          <el-table-column prop="employeeName" label="员工姓名" min-width="8%" />
          <el-table-column prop="departmentName" label="部门" min-width="8%" />
          <el-table-column prop="leaveTypeName" label="假期类型" min-width="8%" />
          <el-table-column prop="startTime" label="开始时间" min-width="12%" />
          <el-table-column prop="endTime" label="结束时间" min-width="12%" />
          <el-table-column prop="leaveDays" label="请假天数" min-width="7%" />
          <el-table-column prop="approvalStatus" label="审批状态" min-width="8%">
            <template #default="{ row }">
              <el-tag
                :type="row.approvalStatus === 0 ? 'warning' : row.approvalStatus === 1 ? 'success' : 'danger'"
                size="small"
              >
                {{ row.approvalStatus === 0 ? '待审批' : row.approvalStatus === 1 ? '已批准' : '已拒绝' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="请假原因" min-width="12%" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" min-width="12%" />
          <el-table-column label="操作" min-width="19%" fixed="right">
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
              <el-button link type="warning" @click="handleRevoke(row)" v-if="row.approvalStatus === 0">
                撤回
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
        label-width="100px"
      >
        <el-form-item label="员工" prop="employeeId" v-if="!formData.id">
          <el-select v-model="formData.employeeId" placeholder="请选择员工" style="width: 100%">
            <el-option
              v-for="item in employeeList"
              :key="item.id"
              :label="`${item.name} (${item.code})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="假期类型" prop="leaveTypeId">
          <el-select v-model="formData.leaveTypeId" placeholder="请选择假期类型" style="width: 100%">
            <el-option
              v-for="item in leaveTypeList"
              :key="item.id"
              :label="item.leaveTypeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="calculateLeaveDays"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="calculateLeaveDays"
          />
        </el-form-item>
        <el-form-item label="请假天数" prop="leaveDays">
          <el-input v-model.number="formData.leaveDays" placeholder="自动计算" disabled />
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入请假原因"
          />
        </el-form-item>
        <el-form-item label="附件" prop="attachments">
          <el-input
            v-model="formData.attachments"
            placeholder="请输入附件URL（多个用逗号分隔）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="请假详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ currentRow?.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ currentRow?.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentRow?.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="假期类型">{{ currentRow?.leaveTypeName }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentRow?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentRow?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="请假天数">{{ currentRow?.leaveDays }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag
            :type="currentRow?.approvalStatus === 0 ? 'warning' : currentRow?.approvalStatus === 1 ? 'success' : 'danger'"
            size="small"
          >
            {{ currentRow?.approvalStatus === 0 ? '待审批' : currentRow?.approvalStatus === 1 ? '已批准' : '已拒绝' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请假原因" :span="2">{{ currentRow?.reason }}</el-descriptions-item>
        <el-descriptions-item label="附件" :span="2">{{ currentRow?.attachments || '无' }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="currentRow?.approver">{{ currentRow?.approver }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="currentRow?.approvalTime">{{ currentRow?.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="currentRow?.approvalComment">{{ currentRow?.approvalComment }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalType === 'approve' ? '批准请假' : '拒绝请假'"
      width="500px"
      @close="handleApprovalDialogClose"
    >
      <el-form
        ref="approvalFormRef"
        :model="approvalFormData"
        :rules="approvalFormRules"
        label-width="100px"
      >
        <el-form-item label="审批意见" :prop="approvalType === 'reject' ? 'approvalComment' : ''">
          <el-input
            v-model="approvalFormData.approvalComment"
            type="textarea"
            :rows="4"
            :placeholder="approvalType === 'approve' ? '请输入审批意见（可选）' : '请输入拒绝原因（必填）'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button
          :type="approvalType === 'approve' ? 'success' : 'danger'"
          @click="handleApprovalSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { LeaveApplication, LeaveApplicationListParams, LeaveType } from '@/types/leave'
import {
  getLeaveApplicationList,
  addLeaveApplication,
  updateLeaveApplication,
  deleteLeaveApplication,
  batchDeleteLeaveApplications,
  approveLeaveApplication,
  rejectLeaveApplication,
  withdrawLeaveApplication
} from '@/api/leaveApplication'
import { getLeaveTypeList } from '@/api/leaveType'
import ArtExcelExport from '@/components/core/forms/art-excel-export/index.vue'

defineOptions({
  name: 'LeaveApplicationTab'
})

// 查询参数
const queryParams = reactive<LeaveApplicationListParams>({
  employeeName: '',
  leaveTypeId: null,
  approvalStatus: null,
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<LeaveApplication[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 假期类型列表
const leaveTypeList = ref<LeaveType[]>([])

// 员工列表（模拟数据）
const employeeList = ref([
  { id: 1, name: '张三', code: 'E001' },
  { id: 2, name: '李四', code: 'E002' },
  { id: 3, name: '王五', code: 'E003' }
])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = ref<Partial<LeaveApplication>>({
  employeeId: undefined,
  leaveTypeId: undefined,
  startTime: '',
  endTime: '',
  leaveDays: 0,
  reason: '',
  attachments: ''
})

const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  leaveTypeId: [{ required: true, message: '请选择假期类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }]
}

// 详情弹窗
const detailDialogVisible = ref(false)
const currentRow = ref<LeaveApplication | null>(null)

// 审批弹窗
const approvalDialogVisible = ref(false)
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalFormRef = ref<FormInstance>()
const approvalFormData = ref({
  id: 0,
  approvalComment: ''
})

const approvalFormRules: FormRules = {
  approvalComment: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
}

// 加载假期类型列表
const loadLeaveTypes = async () => {
  try {
    const res = await getLeaveTypeList({ page: 1, pageSize: 100, status: 1 })
    if (res.code === 200) {
      leaveTypeList.value = res.data.list
    }
  } catch (error) {
    console.error('加载假期类型失败:', error)
  }
}

// 加载列表数据
const loadData = async () => {
  try {
    // 处理日期范围
    if (dateRange.value) {
      queryParams.startTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      queryParams.startTime = ''
      queryParams.endTime = ''
    }

    const res = await getLeaveApplicationList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.leaveTypeId = null
  queryParams.approvalStatus = null
  dateRange.value = null
  queryParams.startTime = ''
  queryParams.endTime = ''
  queryParams.page = 1
  loadData()
}

// 表格选择
const handleSelectionChange = (selection: LeaveApplication[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 计算请假天数
const calculateLeaveDays = () => {
  if (formData.value.startTime && formData.value.endTime) {
    const start = new Date(formData.value.startTime)
    const end = new Date(formData.value.endTime)
    const diff = end.getTime() - start.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    formData.value.leaveDays = days > 0 ? days : 0
  }
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增请假'
  formData.value = {
    employeeId: undefined,
    leaveTypeId: undefined,
    startTime: '',
    endTime: '',
    leaveDays: 0,
    reason: '',
    attachments: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: LeaveApplication) => {
  dialogTitle.value = '编辑请假'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: LeaveApplication) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await updateLeaveApplication(formData.value)
          ElMessage.success('更新成功')
        } else {
          await addLeaveApplication(formData.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 删除
const handleDelete = async (row: LeaveApplication) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      type: 'warning'
    })
    await deleteLeaveApplication(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteLeaveApplications(selectedIds.value)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批准
const handleApprove = (row: LeaveApplication) => {
  approvalType.value = 'approve'
  approvalFormData.value = {
    id: row.id,
    approvalComment: ''
  }
  approvalDialogVisible.value = true
}

// 拒绝
const handleReject = (row: LeaveApplication) => {
  approvalType.value = 'reject'
  approvalFormData.value = {
    id: row.id,
    approvalComment: ''
  }
  approvalDialogVisible.value = true
}

// 撤回
const handleRevoke = async (row: LeaveApplication) => {
  try {
    await ElMessageBox.confirm('确定要撤回这条申请吗？', '提示', {
      type: 'warning'
    })
    await withdrawLeaveApplication(row.id)
    ElMessage.success('撤回成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
    }
  }
}

// 提交审批
const handleApprovalSubmit = async () => {
  if (!approvalFormRef.value) return

  // 如果是拒绝，需要验证表单
  if (approvalType.value === 'reject') {
    await approvalFormRef.value.validate(async (valid) => {
      if (valid) {
        await submitApproval()
      }
    })
  } else {
    await submitApproval()
  }
}

// 提交审批逻辑
const submitApproval = async () => {
  try {
    if (approvalType.value === 'approve') {
      await approveLeaveApplication(approvalFormData.value.id, { approvalComment: approvalFormData.value.approvalComment })
      ElMessage.success('批准成功')
    } else {
      await rejectLeaveApplication(approvalFormData.value.id, { approvalComment: approvalFormData.value.approvalComment })
      ElMessage.success('拒绝成功')
    }
    approvalDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleApprovalDialogClose = () => {
  approvalFormRef.value?.resetFields()
}

// 导出配置
const exportFilename = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `请假申请列表_${year}${month}${day}_${hours}${minutes}${seconds}`
})

const exportColumns = {
  employeeName: { title: '员工姓名' },
  departmentName: { title: '部门' },
  leaveTypeName: { title: '假期类型' },
  startTime: { title: '开始时间' },
  endTime: { title: '结束时间' },
  leaveDays: { title: '请假天数' },
  reason: { title: '请假原因' },
  approvalStatus: {
    title: '审批状态',
    formatter: (value: any) => {
      if (value === 0) return '待审批'
      if (value === 1) return '已批准'
      if (value === 2) return '已拒绝'
      return ''
    }
  },
  createTime: { title: '申请时间' }
}

// 初始化
onMounted(() => {
  loadLeaveTypes()
  loadData()
})
</script>

<style scoped lang="scss">
.leave-application-tab {
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
