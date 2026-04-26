<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="实例标题">
            <el-input v-model="queryParams.title" placeholder="请输入实例标题" style="width: 250px" clearable />
          </el-form-item>

          <el-form-item label="申请人">
            <el-input v-model="queryParams.applicant" placeholder="请输入申请人" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="紧急程度">
            <el-select v-model="queryParams.priority" placeholder="请选择紧急程度" style="width: 150px" clearable>
              <el-option label="普通" :value="0" />
              <el-option label="紧急" :value="1" />
              <el-option label="非常紧急" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
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
          <el-button type="primary" @click="handleBatchApprove">
            批量通过
          </el-button>
          <el-button type="danger" @click="handleBatchReject">
            批量驳回
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
          <el-table-column prop="id" label="待办ID" min-width="8%" />
          <el-table-column prop="instanceTitle" label="实例标题" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="templateName" label="流程模板" min-width="12%" />
          <el-table-column prop="applicant" label="申请人" min-width="10%" />
          <el-table-column prop="nodeName" label="当前节点" min-width="12%" />
          <el-table-column prop="priority" label="紧急程度" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.priority === 0" type="info">普通</el-tag>
              <el-tag v-else-if="row.priority === 1" type="warning">紧急</el-tag>
              <el-tag v-else type="danger">非常紧急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="接收时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleApprove(row)">
                审批
              </el-button>
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="warning" @click="handleTransfer(row)">
                转交
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
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 审批对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      title="审批"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef" label-width="100px">
        <el-form-item label="实例标题">
          <el-input :value="currentTodo?.instanceTitle" disabled />
        </el-form-item>

        <el-form-item label="申请人">
          <el-input :value="currentTodo?.applicant" disabled />
        </el-form-item>

        <el-form-item label="当前节点">
          <el-input :value="currentTodo?.nodeName" disabled />
        </el-form-item>

        <el-form-item label="审批操作" prop="action">
          <el-radio-group v-model="approvalForm.action">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
            <el-radio :label="3">转交</el-radio>
            <el-radio :label="4">加签</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="approvalForm.action === 3"
          label="转交给"
          prop="transferTo"
        >
          <el-select
            v-model="approvalForm.transferTo"
            placeholder="请选择转交人"
            style="width: 100%"
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="approvalForm.action === 4"
          label="加签人"
          prop="addSignUsers"
        >
          <el-select
            v-model="approvalForm.addSignUsers"
            multiple
            placeholder="请选择加签人"
            style="width: 100%"
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="审批意见" prop="comment">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="抄送人">
          <el-select
            v-model="approvalForm.ccUsers"
            multiple
            placeholder="请选择抄送人（可选）"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
          <div style="font-size: 12px; color: #909399; margin-top: 4px">
            选择需要抄送的人员，他们将收到审批结果通知
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApproval">确定</el-button>
      </template>
    </el-dialog>

    <!-- 转交对话框 -->
    <el-dialog
      v-model="transferDialogVisible"
      title="转交"
      width="500px"
      @close="handleTransferDialogClose"
    >
      <el-form :model="transferForm" :rules="transferRules" ref="transferFormRef" label-width="100px">
        <el-form-item label="转交给" prop="transferTo">
          <el-select
            v-model="transferForm.transferTo"
            placeholder="请选择转交人"
            style="width: 100%"
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="转交原因" prop="reason">
          <el-input
            v-model="transferForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入转交原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitTransfer">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getTodoList,
  processApproval,
  transferApproval
} from '@/api/approval-engine'
import type { TodoItem, ListParams } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalTodoList'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ListParams>({
  title: '',
  applicant: '',
  priority: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<TodoItem[]>([])
const total = ref(0)
const selectedRows = ref<TodoItem[]>([])

// 审批对话框
const approvalDialogVisible = ref(false)
const approvalFormRef = ref<FormInstance>()
const currentTodo = ref<TodoItem | null>(null)
const approvalForm = reactive({
  action: 1,
  comment: '',
  transferTo: undefined as number | undefined,
  addSignUsers: [] as number[],
  ccUsers: [] as number[]
})

const approvalRules: FormRules = {
  action: [{ required: true, message: '请选择审批操作', trigger: 'change' }],
  comment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
  transferTo: [{ required: true, message: '请选择转交人', trigger: 'change' }],
  addSignUsers: [{ required: true, message: '请选择加签人', trigger: 'change' }]
}

// 转交对话框
const transferDialogVisible = ref(false)
const transferFormRef = ref<FormInstance>()
const transferForm = reactive({
  transferTo: undefined as number | undefined,
  reason: ''
})

const transferRules: FormRules = {
  transferTo: [{ required: true, message: '请选择转交人', trigger: 'change' }],
  reason: [{ required: true, message: '请输入转交原因', trigger: 'blur' }]
}

// Mock 用户数据
const mockUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
]

// 获取数据
const fetchData = async () => {
  try {
    const res = await getTodoList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.title = ''
  queryParams.applicant = ''
  queryParams.priority = null
  queryParams.page = 1
  fetchData()
}

// 选择变化
const handleSelectionChange = (rows: TodoItem[]) => {
  selectedRows.value = rows
}

// 审批
const handleApprove = (row: TodoItem) => {
  currentTodo.value = row
  approvalForm.action = 1
  approvalForm.comment = ''
  approvalForm.transferTo = undefined
  approvalForm.addSignUsers = []
  approvalDialogVisible.value = true
}

// 查看详情
const handleView = (row: TodoItem) => {
  router.push(`/system/approval-instance/detail/${row.instanceId}`)
}

// 转交
const handleTransfer = (row: TodoItem) => {
  currentTodo.value = row
  transferForm.transferTo = undefined
  transferForm.reason = ''
  transferDialogVisible.value = true
}

// 批量通过
const handleBatchApprove = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要审批的记录')
    return
  }

  try {
    await ElMessageBox.confirm('确定要批量通过选中的审批吗？', '提示', {
      type: 'warning'
    })

    for (const row of selectedRows.value) {
      if (!row.nodeId) continue
      await processApproval({
        todoId: row.id,
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        action: 1,
        comment: '批量通过'
      })
    }

    ElMessage.success('批量通过成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量通过失败')
    }
  }
}

// 批量驳回
const handleBatchReject = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要审批的记录')
    return
  }

  try {
    await ElMessageBox.confirm('确定要批量驳回选中的审批吗？', '提示', {
      type: 'warning'
    })

    for (const row of selectedRows.value) {
      if (!row.nodeId) continue
      await processApproval({
        todoId: row.id,
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        action: 2,
        comment: '批量驳回'
      })
    }

    ElMessage.success('批量驳回成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量驳回失败')
    }
  }
}

// 提交审批
const handleSubmitApproval = async () => {
  if (!approvalFormRef.value || !currentTodo.value) return

  await approvalFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!currentTodo.value?.nodeId) {
          ElMessage.error('节点信息缺失')
          return
        }
        await processApproval({
          todoId: currentTodo.value!.id,
          instanceId: currentTodo.value!.instanceId,
          nodeId: currentTodo.value.nodeId,
          action: approvalForm.action,
          comment: approvalForm.comment,
          transferTo: approvalForm.transferTo,
          addSignUsers: approvalForm.addSignUsers
        })

        ElMessage.success('审批成功')
        approvalDialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('审批失败')
      }
    }
  })
}

// 提交转交
const handleSubmitTransfer = async () => {
  if (!transferFormRef.value || !currentTodo.value) return

  await transferFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!currentTodo.value?.nodeId) {
          ElMessage.error('节点信息缺失')
          return
        }
        await transferApproval({
          todoId: currentTodo.value!.id,
          instanceId: currentTodo.value!.instanceId,
          nodeId: currentTodo.value.nodeId,
          transferTo: transferForm.transferTo!,
          reason: transferForm.reason
        })

        ElMessage.success('转交成功')
        transferDialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('转交失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  approvalFormRef.value?.resetFields()
}

const handleTransferDialogClose = () => {
  transferFormRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-container {
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
