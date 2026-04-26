<template>
  <div class="application-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="申请类型">
            <el-select v-model="queryParams.type" placeholder="请选择申请类型" style="width: 150px" clearable>
              <el-option label="请假申请" :value="1" />
              <el-option label="加班申请" :value="2" />
              <el-option label="出差申请" :value="3" />
              <el-option label="报销申请" :value="4" />
              <el-option label="离职申请" :value="5" />
              <el-option label="其他申请" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="申请状态">
            <el-select v-model="queryParams.status" placeholder="请选择申请状态" style="width: 150px" clearable>
              <el-option label="草稿" :value="0" />
              <el-option label="审批中" :value="1" />
              <el-option label="已通过" :value="2" />
              <el-option label="已驳回" :value="3" />
              <el-option label="已撤回" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 360px"
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
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建申请
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="title" label="申请标题" min-width="15%" />
          <el-table-column prop="typeName" label="申请类型" min-width="10%" />
          <el-table-column prop="applyTime" label="申请时间" min-width="14%" />
          <el-table-column prop="statusName" label="申请状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ row.statusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批进度" min-width="12%">
            <template #default="{ row }">
              {{ getApprovalProgress(row) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="danger"
                @click="handleCancel(row)"
              >
                撤回
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

    <!-- 新建申请弹窗 -->
    <el-dialog v-model="createDialogVisible" title="新建申请" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="申请类型">
          <el-select v-model="createForm.type" placeholder="请选择申请类型" style="width: 100%">
            <el-option label="请假申请" :value="1" />
            <el-option label="加班申请" :value="2" />
            <el-option label="出差申请" :value="3" />
            <el-option label="报销申请" :value="4" />
            <el-option label="离职申请" :value="5" />
            <el-option label="其他申请" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请标题">
          <el-input v-model="createForm.title" placeholder="请输入申请标题" />
        </el-form-item>
        <el-form-item label="申请内容">
          <el-input
            v-model="createForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入申请内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :auto-upload="false"
          >
            <el-button>
              <el-icon><Upload /></el-icon>
              上传附件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitCreate">提交申请</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="申请详情" width="700px">
      <div class="application-detail">
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <div class="detail-row">
            <span class="detail-label">申请标题：</span>
            <span class="detail-value">{{ currentApplication.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">申请类型：</span>
            <span class="detail-value">{{ currentApplication.typeName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">申请时间：</span>
            <span class="detail-value">{{ currentApplication.applyTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">申请状态：</span>
            <el-tag :type="getStatusType(currentApplication.status)">
              {{ currentApplication.statusName }}
            </el-tag>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">申请内容</div>
          <div class="detail-content">
            {{ currentApplication.content }}
          </div>
        </div>

        <div v-if="currentApplication.attachments && currentApplication.attachments.length > 0" class="detail-section">
          <div class="section-title">附件</div>
          <div class="attachment-list">
            <div v-for="(file, index) in currentApplication.attachments" :key="index" class="attachment-item">
              <el-link type="primary" :href="file" target="_blank">{{ file }}</el-link>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">审批进度</div>
          <el-timeline>
            <el-timeline-item
              v-for="node in currentApplication.approvalProgress"
              :key="node.id"
              :timestamp="node.approvalTime || '待审批'"
              placement="top"
            >
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="approver">{{ node.approver }}</span>
                  <el-tag :type="getApprovalStatusType(node.status)" size="small">
                    {{ node.status }}
                  </el-tag>
                </div>
                <div v-if="node.opinion" class="timeline-opinion">
                  审批意见：{{ node.opinion }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
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
import { Plus, Upload } from '@element-plus/icons-vue'
import { getApplicationList, createApplication, cancelApplication } from '@/api/employee-self-service'
import type { Application, ApplicationQueryParams, CreateApplication } from '@/types/employee-self-service'
import type { UploadFile } from 'element-plus'

defineOptions({
  name: 'ApplicationManagement'
})

// 查询参数
const queryParams = reactive<ApplicationQueryParams>({
  type: null,
  status: null,
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10
})

const dateRange = ref<[string, string]>(['', ''])

// 表格数据
const tableData = ref<Application[]>([])
const total = ref(0)

// 新建申请弹窗
const createDialogVisible = ref(false)
const createForm = reactive<CreateApplication>({
  type: 1,
  title: '',
  content: '',
  attachments: []
})

const fileList = ref<UploadFile[]>([])

// 详情弹窗
const detailDialogVisible = ref(false)
const currentApplication = ref<Application>({
  id: 0,
  title: '',
  type: 1,
  typeName: '',
  status: 0,
  statusName: '',
  applyTime: '',
  content: '',
  attachments: [],
  approvalProgress: []
})

/**
 * 加载数据
 */
const loadData = async () => {
  try {
    const res = await getApplicationList(queryParams)
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
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.startTime = dateRange.value[0]
    queryParams.endTime = dateRange.value[1]
  } else {
    queryParams.startTime = ''
    queryParams.endTime = ''
  }
  queryParams.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.type = null
  queryParams.status = null
  queryParams.startTime = ''
  queryParams.endTime = ''
  dateRange.value = ['', '']
  queryParams.page = 1
  loadData()
}

/**
 * 新建申请
 */
const handleCreate = () => {
  createForm.type = 1
  createForm.title = ''
  createForm.content = ''
  createForm.attachments = []
  fileList.value = []
  createDialogVisible.value = true
}

/**
 * 文件变化
 */
const handleFileChange = (file: UploadFile) => {
  // 模拟文件上传，实际应该调用上传接口
  if (!createForm.attachments) {
    createForm.attachments = []
  }
  createForm.attachments.push(file.name)
}

/**
 * 移除文件
 */
const handleFileRemove = (file: UploadFile) => {
  if (createForm.attachments) {
    const index = createForm.attachments.indexOf(file.name)
    if (index > -1) {
      createForm.attachments.splice(index, 1)
    }
  }
}

/**
 * 提交新建
 */
const handleSubmitCreate = async () => {
  if (!createForm.title) {
    ElMessage.warning('请输入申请标题')
    return
  }
  if (!createForm.content) {
    ElMessage.warning('请输入申请内容')
    return
  }

  try {
    const res = await createApplication(createForm)
    if (res.code === 200) {
      ElMessage.success('创建成功')
      createDialogVisible.value = false
      loadData()
    }
  } catch (error) {
    ElMessage.error('创建失败')
  }
}

/**
 * 查看详情
 */
const handleViewDetail = (row: Application) => {
  currentApplication.value = row
  detailDialogVisible.value = true
}

/**
 * 撤回申请
 */
const handleCancel = async (row: Application) => {
  try {
    await ElMessageBox.confirm('确定要撤回该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await cancelApplication(row.id)
    if (res.code === 200) {
      ElMessage.success('撤回成功')
      loadData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
    }
  }
}

/**
 * 获取状态类型
 */
const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    0: 'info',
    1: 'warning',
    2: 'success',
    3: 'danger',
    4: 'info'
  }
  return typeMap[status] || 'info'
}

/**
 * 获取审批进度
 */
const getApprovalProgress = (row: Application) => {
  if (!row.approvalProgress || row.approvalProgress.length === 0) {
    return '-'
  }
  const approved = row.approvalProgress.filter(node => node.status === '已通过').length
  const total = row.approvalProgress.length
  return `${approved}/${total}`
}

/**
 * 获取审批状态类型
 */
const getApprovalStatusType = (status: string) => {
  if (status === '已通过') return 'success'
  if (status === '已驳回') return 'danger'
  if (status === '待审批') return 'warning'
  return 'info'
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.application-container {
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

.application-detail {
  .detail-section {
    margin-bottom: 24px;

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
      align-items: center;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .detail-label {
        width: 100px;
        color: #909399;
        font-size: 14px;
      }

      .detail-value {
        flex: 1;
        color: #606266;
        font-size: 14px;
      }
    }

    .detail-content {
      color: #606266;
      font-size: 14px;
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .attachment-list {
      .attachment-item {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .timeline-content {
      .timeline-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .approver {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
        }
      }

      .timeline-opinion {
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
      }
    }
  }
}
</style>
