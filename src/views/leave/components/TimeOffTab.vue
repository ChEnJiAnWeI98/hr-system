<template>
  <div class="time-off-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="调休来源">
            <el-select v-model="queryParams.source" placeholder="请选择调休来源" style="width: 150px" clearable>
              <el-option label="加班调休" :value="0" />
              <el-option label="节假日加班调休" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="审批状态">
            <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="已批准" :value="1" />
              <el-option label="已拒绝" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="调休时间">
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
            申请调休
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
          <ArtExcelExport
            :data="tableData"
            :filename="exportFilename"
            :columns="exportColumns"
            :auto-index="true"
            index-column-title="序号"
            button-text="导出"
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
          <el-table-column prop="startTime" label="开始时间" min-width="12%" />
          <el-table-column prop="endTime" label="结束时间" min-width="12%" />
          <el-table-column prop="timeOffDays" label="调休天数" min-width="7%" />
          <el-table-column prop="source" label="来源" min-width="10%">
            <template #default="{ row }">
              <el-tag :type="row.source === 0 ? 'primary' : 'success'" size="small">
                {{ row.source === 0 ? '加班调休' : '节假日加班调休' }}
              </el-tag>
            </template>
          </el-table-column>
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
          <el-table-column prop="reason" label="调休原因" min-width="12%" show-overflow-tooltip />
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
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="calculateTimeOffDays"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="calculateTimeOffDays"
          />
        </el-form-item>
        <el-form-item label="调休天数" prop="timeOffDays">
          <el-input v-model.number="formData.timeOffDays" placeholder="自动计算" disabled />
        </el-form-item>
        <el-form-item label="调休来源" prop="source">
          <el-radio-group v-model="formData.source">
            <el-radio :value="0">加班调休</el-radio>
            <el-radio :value="1">节假日加班调休</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调休原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入调休原因"
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
      v-model="viewDialogVisible"
      title="调休详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ currentRow?.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ currentRow?.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentRow?.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="调休来源">
          <el-tag :type="currentRow?.source === 0 ? 'primary' : 'success'" size="small">
            {{ currentRow?.source === 0 ? '加班调休' : '节假日加班调休' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentRow?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentRow?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="调休天数">{{ currentRow?.timeOffDays }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag
            :type="currentRow?.approvalStatus === 0 ? 'warning' : currentRow?.approvalStatus === 1 ? 'success' : 'danger'"
            size="small"
          >
            {{ currentRow?.approvalStatus === 0 ? '待审批' : currentRow?.approvalStatus === 1 ? '已批准' : '已拒绝' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调休原因" :span="2">{{ currentRow?.reason }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="currentRow?.approver">{{ currentRow?.approver }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="currentRow?.approvalTime">{{ currentRow?.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="currentRow?.approvalComment">{{ currentRow?.approvalComment }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalType === 'approve' ? '批准调休' : '拒绝调休'"
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
            :placeholder="approvalType === 'approve' ? '请输入审批意见（可选）' : '请输入拒绝原因'"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { TimeOff, TimeOffListParams } from '@/types/leave'
import {
  getTimeOffList,
  addTimeOff,
  updateTimeOff,
  deleteTimeOff,
  batchDeleteTimeOffs,
  approveTimeOff,
  rejectTimeOff
} from '@/api/timeOff'
import ArtExcelExport from '@/components/core/forms/art-excel-export/index.vue'

defineOptions({
  name: 'TimeOffTab'
})

// 查询参数
const queryParams = reactive<TimeOffListParams>({
  employeeName: '',
  employeeCode: '',
  departmentName: '',
  source: null,
  approvalStatus: null,
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<TimeOff[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = computed(() => (formData.id ? '编辑调休' : '新增调休'))
const formRef = ref<FormInstance>()
const formData = reactive<Partial<TimeOff>>({
  employeeId: undefined,
  startTime: '',
  endTime: '',
  timeOffDays: 0,
  source: 0,
  reason: ''
})

// 表单验证规则
const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  source: [{ required: true, message: '请选择调休来源', trigger: 'change' }],
  reason: [{ required: true, message: '请输入调休原因', trigger: 'blur' }]
}

// 查看详情
const viewDialogVisible = ref(false)
const currentRow = ref<TimeOff | null>(null)

// 审批弹窗
const approvalDialogVisible = ref(false)
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalFormRef = ref<FormInstance>()
const approvalFormData = reactive({
  id: 0,
  approvalComment: ''
})

const approvalFormRules: FormRules = {
  approvalComment: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
}

// 员工列表（模拟数据）
const employeeList = ref([
  { id: 1, name: '张三', code: 'E001' },
  { id: 2, name: '李四', code: 'E002' },
  { id: 3, name: '王五', code: 'E003' }
])

// 导出文件名
const exportFilename = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `调休申请列表_${year}${month}${day}_${hours}${minutes}${seconds}`
})

// 导出列配置
const exportColumns = {
  employeeName: {
    title: '员工姓名',
    width: 120
  },
  departmentName: {
    title: '部门',
    width: 150
  },
  startTime: {
    title: '开始时间',
    width: 180
  },
  endTime: {
    title: '结束时间',
    width: 180
  },
  timeOffDays: {
    title: '调休天数',
    width: 100
  },
  source: {
    title: '来源',
    width: 150,
    formatter: (value: any) => {
      return value === 0 ? '加班调休' : '节假日加班调休'
    }
  },
  reason: {
    title: '调休原因',
    width: 200
  },
  approvalStatus: {
    title: '审批状态',
    width: 100,
    formatter: (value: any) => {
      return value === 0 ? '待审批' : value === 1 ? '已批准' : '已拒绝'
    }
  },
  createTime: {
    title: '申请时间',
    width: 180
  }
}

// 搜索
const handleSearch = async () => {
  if (dateRange.value) {
    queryParams.startDate = dateRange.value[0]
    queryParams.endDate = dateRange.value[1]
  } else {
    queryParams.startDate = ''
    queryParams.endDate = ''
  }

  try {
    const res = await getTimeOffList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.employeeCode = ''
  queryParams.departmentName = ''
  queryParams.source = null
  queryParams.approvalStatus = null
  queryParams.startDate = ''
  queryParams.endDate = ''
  dateRange.value = null
  queryParams.page = 1
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: TimeOff) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: TimeOff) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

// 删除
const handleDelete = async (row: TimeOff) => {
  try {
    await ElMessageBox.confirm('确定要删除这条调休记录吗？', '提示', {
      type: 'warning'
    })
    const res = await deleteTimeOff(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      handleSearch()
    }
  } catch (error) {
    // 取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      type: 'warning'
    })
    const res = await batchDeleteTimeOffs(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      selectedIds.value = []
      handleSearch()
    }
  } catch (error) {
    // 取消删除
  }
}

// 表格选择变化
const handleSelectionChange = (selection: TimeOff[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 计算调休天数
const calculateTimeOffDays = () => {
  if (formData.startTime && formData.endTime) {
    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)
    const diff = end.getTime() - start.getTime()
    formData.timeOffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = formData.id
          ? await updateTimeOff(formData as TimeOff)
          : await addTimeOff(formData)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '新增成功')
          dialogVisible.value = false
          handleSearch()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: undefined,
    employeeId: undefined,
    startTime: '',
    endTime: '',
    timeOffDays: 0,
    source: 0,
    reason: ''
  })
}

// 批准
const handleApprove = (row: TimeOff) => {
  currentRow.value = row
  approvalType.value = 'approve'
  approvalFormData.id = row.id
  approvalFormData.approvalComment = ''
  approvalDialogVisible.value = true
}

// 拒绝
const handleReject = (row: TimeOff) => {
  currentRow.value = row
  approvalType.value = 'reject'
  approvalFormData.id = row.id
  approvalFormData.approvalComment = ''
  approvalDialogVisible.value = true
}

// 提交审批
const handleApprovalSubmit = async () => {
  if (!approvalFormRef.value) return

  // 拒绝时需要验证审批意见
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

// 提交审批请求
const submitApproval = async () => {
  try {
    const res = approvalType.value === 'approve'
      ? await approveTimeOff({ id: approvalFormData.id, approvalComment: approvalFormData.approvalComment })
      : await rejectTimeOff({ id: approvalFormData.id, approvalComment: approvalFormData.approvalComment })

    if (res.code === 200) {
      ElMessage.success(approvalType.value === 'approve' ? '批准成功' : '拒绝成功')
      approvalDialogVisible.value = false
      handleSearch()
    }
  } catch (error) {
    ElMessage.error(approvalType.value === 'approve' ? '批准失败' : '拒绝失败')
  }
}

// 关闭审批弹窗
const handleApprovalDialogClose = () => {
  approvalFormRef.value?.resetFields()
  approvalFormData.id = 0
  approvalFormData.approvalComment = ''
}

// 初始化
onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.time-off-tab {
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
