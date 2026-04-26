<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回实例列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ instanceData?.title || '实例详情' }}</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button
            v-if="instanceData?.status === 0 || instanceData?.status === 1"
            type="danger"
            @click="handleWithdraw"
          >
            <el-icon><Close /></el-icon>
            撤回
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 滚动内容区域 -->
    <el-scrollbar class="content-scrollbar">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 基本信息标签页 -->
        <el-tab-pane label="基本信息" name="basic">
          <!-- 基本信息卡片 -->
          <el-card class="info-card">
            <template #header>
              <span>基本信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="实例ID">
                {{ instanceData?.id }}
              </el-descriptions-item>
              <el-descriptions-item label="实例标题">
                {{ instanceData?.title }}
              </el-descriptions-item>
              <el-descriptions-item label="流程模板">
                {{ instanceData?.templateName }}
              </el-descriptions-item>
              <el-descriptions-item label="申请人">
                {{ instanceData?.applicant }}
              </el-descriptions-item>
              <el-descriptions-item label="当前节点">
                {{ instanceData?.currentNode }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag v-if="instanceData?.status === 0" type="info">待审批</el-tag>
                <el-tag v-else-if="instanceData?.status === 1" type="warning">审批中</el-tag>
                <el-tag v-else-if="instanceData?.status === 2" type="success">已通过</el-tag>
                <el-tag v-else-if="instanceData?.status === 3" type="danger">已驳回</el-tag>
                <el-tag v-else type="info">已撤回</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="申请时间">
                {{ instanceData?.applyTime }}
              </el-descriptions-item>
              <el-descriptions-item label="完成时间">
                {{ instanceData?.finishTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请说明" :span="2">
                {{ instanceData?.description || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 审批进度卡片 -->
          <el-card class="progress-card">
            <template #header>
              <span>审批进度</span>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="record in nodeRecords"
                :key="record.id"
                :timestamp="record.processTime"
                placement="top"
                :type="getTimelineType(record.status)"
                :icon="getTimelineIcon(record.status)"
              >
                <el-card>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="node-name">{{ record.nodeName }}</span>
                      <el-tag :type="getStatusTagType(record.status)" size="small">
                        {{ getStatusText(record.status) }}
                      </el-tag>
                    </div>
                    <div class="timeline-body">
                      <div class="timeline-row">
                        <span class="label">审批人：</span>
                        <span class="value">{{ record.approver }}</span>
                      </div>
                      <div v-if="record.action" class="timeline-row">
                        <span class="label">操作：</span>
                        <span class="value">{{ getActionText(record.action) }}</span>
                      </div>
                      <div v-if="record.comment" class="timeline-row">
                        <span class="label">审批意见：</span>
                        <span class="value">{{ record.comment }}</span>
                      </div>
                      <div v-if="record.transferTo" class="timeline-row">
                        <span class="label">转交给：</span>
                        <span class="value">{{ record.transferTo }}</span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>

          <!-- 表单数据卡片 -->
          <el-card v-if="instanceData?.formData" class="form-card">
            <template #header>
              <span>表单数据</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item
                v-for="(value, key) in instanceData.formData"
                :key="String(key)"
                :label="String(key)"
              >
                {{ value }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-tab-pane>

        <!-- 审批历史标签页 -->
        <el-tab-pane label="审批历史" name="history">
          <el-card class="history-card">
            <template #header>
              <div class="history-header">
                <span>审批历史记录</span>
                <el-button size="small" @click="handleExportHistory">
                  <el-icon><Download /></el-icon>
                  导出历史
                </el-button>
              </div>
            </template>
            <el-table :data="nodeRecords" border height="100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="nodeName" label="节点名称" min-width="12%" />
              <el-table-column prop="approver" label="审批人" min-width="10%" />
              <el-table-column prop="action" label="操作" min-width="8%">
                <template #default="{ row }">
                  {{ getActionText(row.action) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" min-width="8%">
                <template #default="{ row }">
                  <el-tag :type="getStatusTagType(row.status)" size="small">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="审批意见" min-width="20%" show-overflow-tooltip />
              <el-table-column prop="transferTo" label="转交给" min-width="10%" />
              <el-table-column prop="processTime" label="处理时间" min-width="14%" />
              <el-table-column label="耗时" min-width="10%">
                <template #default="{ row }">
                  {{ calculateDuration(row) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Close, Download, Check, CircleCheck, CircleClose, Clock } from '@element-plus/icons-vue'
import {
  getInstanceDetail,
  withdrawInstance,
  exportInstance
} from '@/api/approval-engine'
import type { ApprovalInstance, NodeRecord } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalInstanceDetail'
})

const router = useRouter()
const route = useRoute()

// 当前标签页
const activeTab = ref('basic')

// 实例数据
const instanceData = ref<ApprovalInstance | null>(null)
const nodeRecords = ref<NodeRecord[]>([])

// 获取详情
const fetchDetail = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getInstanceDetail(id)
    instanceData.value = res.data.instance
    nodeRecords.value = res.data.records
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 返回
const handleBack = () => {
  router.push('/system/approval-instance')
}

// 撤回
const handleWithdraw = async () => {
  try {
    await ElMessageBox.confirm('确定要撤回该审批实例吗？', '提示', {
      type: 'warning'
    })

    await withdrawInstance(instanceData.value!.id)
    ElMessage.success('撤回成功')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
    }
  }
}

// 导出
const handleExport = async () => {
  try {
    await exportInstance(instanceData.value!.id)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 导出历史
const handleExportHistory = async () => {
  try {
    await exportInstance(instanceData.value!.id)
    ElMessage.success('导出历史成功')
  } catch (error) {
    ElMessage.error('导出历史失败')
  }
}

// 计算耗时
const calculateDuration = (record: NodeRecord) => {
  if (!record.processTime || !record.receiveTime) return '-'

  const start = new Date(record.receiveTime).getTime()
  const end = new Date(record.processTime).getTime()
  const duration = end - start

  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

// 获取时间线类型
const getTimelineType = (status: number) => {
  if (status === 1) return 'success'
  if (status === 2) return 'danger'
  if (status === 3) return 'info'
  return 'primary'
}

// 获取时间线图标
const getTimelineIcon = (status: number) => {
  if (status === 1) return CircleCheck
  if (status === 2) return CircleClose
  if (status === 3) return Check
  return Clock
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  if (status === 1) return 'success'
  if (status === 2) return 'danger'
  if (status === 3) return 'info'
  return 'warning'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待处理',
    1: '已通过',
    2: '已驳回',
    3: '已转交'
  }
  return statusMap[status] || '未知'
}

// 获取操作文本
const getActionText = (action?: number) => {
  if (!action) return '-'
  const actionMap: Record<number, string> = {
    1: '同意',
    2: '驳回',
    3: '转交',
    4: '加签'
  }
  return actionMap[action] || '未知'
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
  }

  .breadcrumb-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      font-size: 14px;
      color: #606266;
      padding: 0;

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }

    .divider {
      color: #dcdfe6;
      font-size: 14px;
    }

    .page-info {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }

  .breadcrumb-actions {
    display: flex;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-tabs__content) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.info-card,
.progress-card,
.form-card,
.history-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 500;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.history-card {
  :deep(.el-card__body) {
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  :deep(.el-table) {
    flex: 1;
  }
}

.progress-card {
  :deep(.el-timeline) {
    padding-left: 0;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 32px;
  }

  :deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 13px;
  }

  .timeline-content {
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .node-name {
        font-size: 15px;
        font-weight: 500;
        color: #303133;
      }
    }

    .timeline-body {
      .timeline-row {
        display: flex;
        margin-bottom: 8px;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #909399;
          min-width: 80px;
          flex-shrink: 0;
        }

        .value {
          color: #606266;
          flex: 1;
        }
      }
    }
  }
}

.records-card {
  :deep(.el-table) {
    font-size: 14px;
  }
}
</style>
