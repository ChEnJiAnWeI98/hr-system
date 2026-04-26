<template>
  <div class="makeup-clockin-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentId" placeholder="请输入部门ID" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="补卡日期">
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
            新增补卡申请
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
          <el-table-column prop="makeupDate" label="补卡日期" min-width="10%" />
          <el-table-column prop="makeupTime" label="补卡时间" min-width="8%" />
          <el-table-column prop="makeupType" label="补卡类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.makeupType === 1" type="success">上班卡</el-tag>
              <el-tag v-else-if="row.makeupType === 2" type="warning">下班卡</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.approvalStatus === 0" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.approvalStatus === 1" type="success">已批准</el-tag>
              <el-tag v-else-if="row.approvalStatus === 2" type="danger">已拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="补卡原因" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="createTime" label="申请时间" min-width="14%" />
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

        <el-form-item label="补卡日期" prop="makeupDate">
          <el-date-picker
            v-model="formData.makeupDate"
            type="date"
            placeholder="请选择补卡日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="补卡时间" prop="makeupTime">
          <el-time-picker
            v-model="formData.makeupTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择补卡时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="补卡类型" prop="makeupType">
          <el-radio-group v-model="formData.makeupType">
            <el-radio :value="1">上班卡</el-radio>
            <el-radio :value="2">下班卡</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="补卡原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入补卡原因"
          />
        </el-form-item>

        <el-form-item label="附件" prop="attachments">
          <el-input v-model="formData.attachments" placeholder="请输入附件URL，多个用逗号分隔" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailVisible"
      title="补卡申请详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ detailData.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="补卡日期">{{ detailData.makeupDate }}</el-descriptions-item>
        <el-descriptions-item label="补卡时间">{{ detailData.makeupTime }}</el-descriptions-item>
        <el-descriptions-item label="补卡类型">
          <el-tag v-if="detailData.makeupType === 1" type="success">上班卡</el-tag>
          <el-tag v-else-if="detailData.makeupType === 2" type="warning">下班卡</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">已批准</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">已拒绝</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间" :span="2">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="补卡原因" :span="2">{{ detailData.reason }}</el-descriptions-item>
        <el-descriptions-item label="附件" :span="2">{{ detailData.attachments || '无' }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="detailData.approvalStatus !== 0">{{ detailData.approver }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="detailData.approvalStatus !== 0">{{ detailData.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="detailData.approvalStatus !== 0">{{ detailData.approvalComment || '无' }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="approvalVisible"
      :title="approvalTitle"
      width="500px"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审批意见">
          <el-input
            v-model="approvalForm.approvalComment"
            type="textarea"
            :rows="4"
            :placeholder="approvalType === 'approve' ? '请输入审批意见（选填）' : '请输入拒绝原因（必填）'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approvalVisible = false">取消</el-button>
          <el-button type="primary" @click="handleApprovalSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { MakeupClockInApplication, MakeupClockInApplicationListParams } from '@/types/attendance'
import {
  getMakeupClockInApplicationList,
  getMakeupClockInApplicationDetail,
  addMakeupClockInApplication,
  updateMakeupClockInApplication,
  deleteMakeupClockInApplication,
  batchDeleteMakeupClockInApplications,
  approveMakeupClockInApplication,
  rejectMakeupClockInApplication
} from '@/api/makeupClockIn'

const queryParams = reactive<MakeupClockInApplicationListParams>({
  employeeName: '',
  departmentId: null,
  makeupDateStart: '',
  makeupDateEnd: '',
  approvalStatus: null,
  page: 1,
  pageSize: 10
})

const dateRange = ref<[string, string] | null>(null)
const tableData = ref<MakeupClockInApplication[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<MakeupClockInApplication>>({
  employeeId: 1,
  employeeName: '张三',
  makeupDate: '',
  makeupTime: '',
  makeupType: 1,
  reason: '',
  attachments: ''
})

const formRules: FormRules = {
  makeupDate: [{ required: true, message: '请选择补卡日期', trigger: 'change' }],
  makeupTime: [{ required: true, message: '请选择补卡时间', trigger: 'change' }],
  makeupType: [{ required: true, message: '请选择补卡类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入补卡原因', trigger: 'blur' }]
}

const detailVisible = ref(false)
const detailData = ref<MakeupClockInApplication>({} as MakeupClockInApplication)

const approvalVisible = ref(false)
const approvalTitle = ref('')
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalForm = reactive({
  id: 0,
  approvalComment: ''
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    if (dateRange.value) {
      queryParams.makeupDateStart = dateRange.value[0]
      queryParams.makeupDateEnd = dateRange.value[1]
    } else {
      queryParams.makeupDateStart = ''
      queryParams.makeupDateEnd = ''
    }

    const res = await getMakeupClockInApplicationList(queryParams)
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
  queryParams.approvalStatus = null
  dateRange.value = null
  queryParams.makeupDateStart = ''
  queryParams.makeupDateEnd = ''
  handleSearch()
}

const handleSelectionChange = (selection: MakeupClockInApplication[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增补卡申请'
  Object.assign(formData, {
    employeeId: 1,
    employeeName: '张三',
    makeupDate: '',
    makeupTime: '',
    makeupType: 1,
    reason: '',
    attachments: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: MakeupClockInApplication) => {
  dialogTitle.value = '编辑补卡申请'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleView = async (row: MakeupClockInApplication) => {
  try {
    const res = await getMakeupClockInApplicationDetail(row.id)
    detailData.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleDelete = async (row: MakeupClockInApplication) => {
  try {
    await ElMessageBox.confirm('确定要删除该补卡申请吗？', '提示', {
      type: 'warning'
    })
    await deleteMakeupClockInApplication(row.id)
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
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条补卡申请吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteMakeupClockInApplications(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleApprove = (row: MakeupClockInApplication) => {
  approvalTitle.value = '批准补卡申请'
  approvalType.value = 'approve'
  approvalForm.id = row.id
  approvalForm.approvalComment = ''
  approvalVisible.value = true
}

const handleReject = (row: MakeupClockInApplication) => {
  approvalTitle.value = '拒绝补卡申请'
  approvalType.value = 'reject'
  approvalForm.id = row.id
  approvalForm.approvalComment = ''
  approvalVisible.value = true
}

const handleApprovalSubmit = async () => {
  if (approvalType.value === 'reject' && !approvalForm.approvalComment) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    if (approvalType.value === 'approve') {
      await approveMakeupClockInApplication(approvalForm.id, {
        approvalComment: approvalForm.approvalComment
      })
      ElMessage.success('批准成功')
    } else {
      await rejectMakeupClockInApplication(approvalForm.id, {
        approvalComment: approvalForm.approvalComment
      })
      ElMessage.success('已拒绝')
    }
    approvalVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateMakeupClockInApplication(formData)
          ElMessage.success('更新成功')
        } else {
          await addMakeupClockInApplication(formData)
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
</script>

<style scoped lang="scss">
.makeup-clockin-tab {
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
