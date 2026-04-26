<template>
  <div class="todo-task-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="任务类型">
            <el-select v-model="queryParams.type" placeholder="请选择任务类型" style="width: 150px" clearable>
              <el-option label="审批" :value="1" />
              <el-option label="通知" :value="2" />
              <el-option label="提醒" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="任务状态">
            <el-select v-model="queryParams.status" placeholder="请选择任务状态" style="width: 150px" clearable>
              <el-option label="未读" :value="0" />
              <el-option label="已读" :value="1" />
              <el-option label="已处理" :value="2" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="title" label="任务标题" min-width="18%" />
          <el-table-column prop="typeName" label="任务类型" min-width="8%" />
          <el-table-column prop="statusName" label="任务状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ row.statusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.type === 1 && row.status !== 2"
                link
                type="primary"
                @click="handleProcess(row)"
              >
                处理
              </el-button>
              <el-button link @click="handleViewDetail(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 0"
                link
                @click="handleMarkRead(row)"
              >
                标记已读
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
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-card>

    <!-- 处理弹窗 -->
    <el-dialog v-model="processDialogVisible" title="处理任务" width="600px">
      <div class="task-detail">
        <div class="detail-section">
          <div class="section-title">任务信息</div>
          <div class="detail-row">
            <span class="detail-label">任务标题：</span>
            <span class="detail-value">{{ currentTask.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">任务类型：</span>
            <span class="detail-value">{{ currentTask.typeName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ currentTask.createTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">任务内容：</span>
            <span class="detail-value">{{ currentTask.content }}</span>
          </div>
        </div>

        <el-form :model="processForm" label-width="100px" style="margin-top: 20px">
          <el-form-item label="处理意见">
            <el-input
              v-model="processForm.opinion"
              type="textarea"
              :rows="4"
              placeholder="请输入处理意见"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProcess">提交</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="任务详情" width="600px">
      <div class="task-detail">
        <div class="detail-section">
          <div class="section-title">任务信息</div>
          <div class="detail-row">
            <span class="detail-label">任务标题：</span>
            <span class="detail-value">{{ currentTask.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">任务类型：</span>
            <span class="detail-value">{{ currentTask.typeName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">任务状态：</span>
            <span class="detail-value">
              <el-tag :type="getStatusType(currentTask.status)">
                {{ currentTask.statusName }}
              </el-tag>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ currentTask.createTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">任务内容：</span>
            <span class="detail-value">{{ currentTask.content }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodoTaskList, processTodoTask, markTodoTaskRead } from '@/api/employee-self-service'
import type { TodoTask, TodoTaskQueryParams, ProcessTodoTask } from '@/types/employee-self-service'

defineOptions({
  name: 'TodoTask'
})

// 查询参数
const queryParams = reactive<TodoTaskQueryParams>({
  type: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<TodoTask[]>([])
const total = ref(0)

// 处理弹窗
const processDialogVisible = ref(false)
const currentTask = ref<TodoTask>({
  id: 0,
  title: '',
  type: 1,
  typeName: '',
  status: 0,
  statusName: '',
  createTime: '',
  content: '',
  relatedId: 0
})

const processForm = reactive<ProcessTodoTask>({
  id: 0,
  opinion: ''
})

// 详情弹窗
const detailDialogVisible = ref(false)

/**
 * 加载数据
 */
const loadData = async () => {
  try {
    const res = await getTodoTaskList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.type = null
  queryParams.status = null
  queryParams.page = 1
  loadData()
}

/**
 * 处理任务
 */
const handleProcess = (row: TodoTask) => {
  currentTask.value = row
  processForm.id = row.id
  processForm.opinion = ''
  processDialogVisible.value = true
}

/**
 * 提交处理
 */
const handleSubmitProcess = async () => {
  if (!processForm.opinion.trim()) {
    ElMessage.warning('请输入处理意见')
    return
  }

  try {
    const res = await processTodoTask(processForm)
    if (res.code === 200) {
      ElMessage.success('处理成功')
      processDialogVisible.value = false
      loadData()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '处理失败')
  }
}

/**
 * 查看详情
 */
const handleViewDetail = (row: TodoTask) => {
  currentTask.value = row
  detailDialogVisible.value = true
}

/**
 * 标记已读
 */
const handleMarkRead = async (row: TodoTask) => {
  try {
    const res = await markTodoTaskRead(row.id)
    if (res.code === 200) {
      ElMessage.success('已标记为已读')
      loadData()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

/**
 * 获取状态类型
 */
const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    0: 'danger',
    1: 'warning',
    2: 'success'
  }
  return typeMap[status] || ''
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.todo-task-container {
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

.task-detail {
  .detail-section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-row {
      display: flex;
      margin-bottom: 12px;
      line-height: 1.8;

      &:last-child {
        margin-bottom: 0;
      }

      .detail-label {
        flex-shrink: 0;
        width: 100px;
        color: #909399;
        font-size: 14px;
      }

      .detail-value {
        flex: 1;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
      }
    }
  }
}
</style>
