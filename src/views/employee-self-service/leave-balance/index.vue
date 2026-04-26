<template>
  <div class="leave-balance-container">
    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="name" label="假期类型" min-width="10%" />
          <el-table-column prop="totalQuota" label="总额度" min-width="8%">
            <template #default="{ row }">
              {{ row.totalQuota }}{{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column prop="usedQuota" label="已使用" min-width="8%">
            <template #default="{ row }">
              {{ row.usedQuota }}{{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column prop="remainingQuota" label="剩余额度" min-width="8%">
            <template #default="{ row }">
              <span :class="{ 'low-balance': row.remainingQuota < 3 }">
                {{ row.remainingQuota }}{{ row.unit }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validUntil" label="有效期" min-width="10%" />
          <el-table-column label="操作" min-width="20%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看明细
              </el-button>
              <el-button link @click="handleViewLeaveRecords(row)">
                查看请假记录
              </el-button>
              <el-button link @click="handleApplyLeave(row)">
                申请请假
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="假期明细" width="800px">
      <el-table :data="detailData" max-height="400">
        <el-table-column prop="leaveType" label="假期类型" min-width="10%" />
        <el-table-column prop="operationType" label="操作类型" min-width="8%" />
        <el-table-column prop="amount" label="数量" min-width="8%">
          <template #default="{ row }">
            <span :class="{ 'positive': row.amount > 0, 'negative': row.amount < 0 }">
              {{ row.amount > 0 ? '+' : '' }}{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" min-width="14%" />
        <el-table-column prop="remark" label="备注" min-width="12%" />
      </el-table>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 请假记录弹窗 -->
    <el-dialog v-model="leaveRecordsDialogVisible" title="请假记录" width="1000px">
      <el-table :data="leaveRecordsData" max-height="400">
        <el-table-column prop="title" label="申请标题" min-width="12%" />
        <el-table-column prop="applyTime" label="申请时间" min-width="14%" />
        <el-table-column prop="content" label="请假内容" min-width="15%" show-overflow-tooltip />
        <el-table-column prop="statusName" label="状态" min-width="8%">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 2 ? 'success' : row.status === 3 ? 'danger' : row.status === 4 ? 'info' : 'warning'"
            >
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="10%" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewLeaveRecordDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="leaveRecordsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 请假记录详情弹窗 -->
    <el-dialog v-model="leaveRecordDetailDialogVisible" title="请假记录详情" width="700px">
      <div class="record-detail">
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <div class="detail-row">
            <span class="detail-label">申请标题：</span>
            <span class="detail-value">{{ currentLeaveRecord.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">申请时间：</span>
            <span class="detail-value">{{ currentLeaveRecord.applyTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">申请状态：</span>
            <span class="detail-value">
              <el-tag
                :type="currentLeaveRecord.status === 2 ? 'success' : currentLeaveRecord.status === 3 ? 'danger' : currentLeaveRecord.status === 4 ? 'info' : 'warning'"
              >
                {{ currentLeaveRecord.statusName }}
              </el-tag>
            </span>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">请假内容</div>
          <div class="detail-row">
            <span class="detail-label">请假内容：</span>
            <span class="detail-value">{{ currentLeaveRecord.content }}</span>
          </div>
        </div>

        <div class="detail-section" v-if="currentLeaveRecord.approvalProgress && currentLeaveRecord.approvalProgress.length > 0">
          <div class="section-title">审批进度</div>
          <el-timeline>
            <el-timeline-item
              v-for="item in currentLeaveRecord.approvalProgress"
              :key="item.id"
              :timestamp="item.approvalTime"
              placement="top"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ item.approver }}</div>
                <div class="timeline-status">
                  <el-tag :type="item.status === '已通过' ? 'success' : item.status === '已拒绝' ? 'danger' : 'warning'" size="small">
                    {{ item.status }}
                  </el-tag>
                </div>
                <div class="timeline-opinion" v-if="item.opinion">意见：{{ item.opinion }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <el-button @click="leaveRecordDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 申请请假弹窗 -->
    <el-dialog v-model="applyDialogVisible" title="申请请假" width="600px">
      <el-form :model="applyForm" label-width="100px">
        <el-form-item label="假期类型">
          <el-input v-model="currentLeaveType.name" disabled />
        </el-form-item>
        <el-form-item label="剩余额度">
          <el-input :value="`${currentLeaveType.remainingQuota}${currentLeaveType.unit}`" disabled />
        </el-form-item>
        <el-form-item label="请假时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="请假天数">
          <el-input v-model="applyForm.days" disabled />
        </el-form-item>
        <el-form-item label="请假事由">
          <el-input
            v-model="applyForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入请假事由"
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
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApply">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { getLeaveBalanceList, getLeaveDetailList, applyLeave } from '@/api/employee-self-service'
import type { LeaveType, LeaveDetail, LeaveApplication } from '@/types/employee-self-service'
import type { UploadFile } from 'element-plus'

defineOptions({
  name: 'LeaveBalance'
})

// 表格数据
const tableData = ref<LeaveType[]>([])

// 明细弹窗
const detailDialogVisible = ref(false)
const detailData = ref<LeaveDetail[]>([])

// 请假记录弹窗
const leaveRecordsDialogVisible = ref(false)
const leaveRecordsData = ref<any[]>([])

// 请假记录详情弹窗
const leaveRecordDetailDialogVisible = ref(false)
const currentLeaveRecord = ref<any>({
  title: '',
  applyTime: '',
  status: 0,
  statusName: '',
  content: '',
  approvalProgress: []
})

// 申请请假弹窗
const applyDialogVisible = ref(false)
const currentLeaveType = ref<LeaveType>({
  id: 0,
  name: '',
  totalQuota: 0,
  usedQuota: 0,
  remainingQuota: 0,
  validUntil: '',
  unit: '天'
})

const dateRange = ref<[string, string]>(['', ''])
const applyForm = reactive<LeaveApplication>({
  leaveTypeId: 0,
  startTime: '',
  endTime: '',
  days: 0,
  reason: '',
  attachments: []
})

const fileList = ref<UploadFile[]>([])

/**
 * 加载数据
 */
const loadData = async () => {
  try {
    const res = await getLeaveBalanceList()
    if (res.code === 200) {
      tableData.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

/**
 * 查看明细
 */
const handleViewDetail = async (row: LeaveType) => {
  try {
    const res = await getLeaveDetailList(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载明细失败')
  }
}

/**
 * 查看请假记录
 */
const handleViewLeaveRecords = async (row: LeaveType) => {
  try {
    // 调用申请管理 API，筛选该假期类型的请假申请
    const { getApplicationList } = await import('@/api/employee-self-service')
    const res = await getApplicationList({
      type: 1, // 1-请假申请
      status: null,
      startTime: '',
      endTime: '',
      page: 1,
      pageSize: 100
    })
    if (res.code === 200) {
      // 筛选包含该假期类型名称的申请
      leaveRecordsData.value = res.data.list.filter((item: any) =>
        item.title.includes(row.name) || item.content.includes(row.name)
      )
      leaveRecordsDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载请假记录失败')
  }
}

/**
 * 查看请假记录详情
 */
const handleViewLeaveRecordDetail = (row: any) => {
  currentLeaveRecord.value = row
  leaveRecordDetailDialogVisible.value = true
}

/**
 * 申请请假
 */
const handleApplyLeave = (row: LeaveType) => {
  currentLeaveType.value = row
  dateRange.value = ['', '']
  applyForm.leaveTypeId = row.id
  applyForm.startTime = ''
  applyForm.endTime = ''
  applyForm.days = 0
  applyForm.reason = ''
  applyForm.attachments = []
  fileList.value = []
  applyDialogVisible.value = true
}

/**
 * 日期变化
 */
const handleDateChange = (value: [string, string] | null) => {
  if (value && value[0] && value[1]) {
    applyForm.startTime = value[0]
    applyForm.endTime = value[1]

    // 计算请假天数
    const start = new Date(value[0])
    const end = new Date(value[1])
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    applyForm.days = days
  } else {
    applyForm.startTime = ''
    applyForm.endTime = ''
    applyForm.days = 0
  }
}

/**
 * 文件变化
 */
const handleFileChange = (file: UploadFile) => {
  if (!applyForm.attachments) {
    applyForm.attachments = []
  }
  applyForm.attachments.push(file.name)
}

/**
 * 移除文件
 */
const handleFileRemove = (file: UploadFile) => {
  if (applyForm.attachments) {
    const index = applyForm.attachments.indexOf(file.name)
    if (index > -1) {
      applyForm.attachments.splice(index, 1)
    }
  }
}

/**
 * 提交申请
 */
const handleSubmitApply = async () => {
  if (!applyForm.startTime || !applyForm.endTime) {
    ElMessage.warning('请选择请假时间')
    return
  }
  if (!applyForm.reason) {
    ElMessage.warning('请输入请假事由')
    return
  }
  if (applyForm.days > currentLeaveType.value.remainingQuota) {
    ElMessage.warning('请假天数超过剩余额度')
    return
  }

  try {
    const res = await applyLeave(applyForm)
    if (res.code === 200) {
      ElMessage.success('申请成功')
      applyDialogVisible.value = false
      loadData()
    }
  } catch (error) {
    ElMessage.error('申请失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.leave-balance-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.low-balance {
  color: #f56c6c;
  font-weight: bold;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}

.payslip-detail {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-row {
      display: flex;
      align-items: center;
      padding: 8px 0;

      .detail-label {
        width: 120px;
        color: #909399;
        font-size: 14px;
      }

      .detail-value {
        flex: 1;
        color: #606266;
        font-size: 14px;

        &.highlight {
          color: #409eff;
          font-weight: bold;
          font-size: 16px;
        }
      }

      &.total-row {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px dashed #ebeef5;
      }
    }
  }
}

.record-detail {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-row {
      display: flex;
      align-items: center;
      padding: 8px 0;

      .detail-label {
        width: 120px;
        color: #909399;
        font-size: 14px;
      }

      .detail-value {
        flex: 1;
        color: #606266;
        font-size: 14px;

        &.highlight {
          color: #409eff;
          font-weight: bold;
          font-size: 16px;
        }
      }

      &.total-row {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px dashed #ebeef5;
      }
    }

    .timeline-content {
      .timeline-title {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 4px;
      }

      .timeline-status {
        margin-bottom: 4px;
      }

      .timeline-opinion {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
