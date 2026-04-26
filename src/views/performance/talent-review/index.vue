<template>
  <div class="talent-review-container">
    <!-- AI 洞察入口 -->
    <el-card class="ai-insight-banner">
      <div class="ai-banner-left">
        <span class="ai-banner-icon">⚠️</span>
        <div>
          <div class="ai-banner-title">AI 洞察 · 高风险员工预警</div>
          <div class="ai-banner-desc">盘点会议前辅助识别风险关注对象，基于多维信号识别离职、绩效、心理异常风险</div>
        </div>
      </div>
      <el-button type="primary" @click="aiRiskAlertVisible = true">
        识别高风险员工
      </el-button>
    </el-card>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="会议名称">
            <el-input v-model="queryParams.meetingName" placeholder="名称或编号" style="width: 240px" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" style="width: 130px" clearable>
              <el-option label="筹备中" value="preparing" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已归档" value="archived" />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-title">盘点会议列表</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          发起盘点
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="meetingNo" label="会议编号" width="160" />
          <el-table-column prop="meetingName" label="会议名称" min-width="280" show-overflow-tooltip />
          <el-table-column prop="cycleName" label="所属周期" width="180" />
          <el-table-column label="适用部门" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag
                v-for="d in row.departments"
                :key="d"
                size="small"
                effect="plain"
                style="margin-right: 4px"
              >
                {{ d }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hostName" label="主持人" width="110" />
          <el-table-column prop="scheduledTime" label="计划时间" width="150" />
          <el-table-column label="参与人数" width="100" align="center">
            <template #default="{ row }">{{ row.entries?.length || 0 }}</template>
          </el-table-column>
          <el-table-column label="状态" width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="TALENT_STATUS_TYPE[row.status as TalentReviewStatus]" size="small">
                {{ TALENT_STATUS_LABEL[row.status as TalentReviewStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleOpenBoard(row)">进入盘点</el-button>
              <el-button link @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑盘点会议' : '发起盘点'" width="640px">
      <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="会议名称" prop="meetingName">
          <el-input v-model="editForm.meetingName" />
        </el-form-item>
        <el-form-item label="所属周期" prop="cycleName">
          <el-input v-model="editForm.cycleName" placeholder="如 2026 Q2 季度绩效" />
        </el-form-item>
        <el-form-item label="适用部门" prop="departments">
          <el-select v-model="editForm.departments" multiple style="width: 100%">
            <el-option label="技术研发中心" value="技术研发中心" />
            <el-option label="产品设计中心" value="产品设计中心" />
            <el-option label="运营市场中心" value="运营市场中心" />
            <el-option label="销售中心" value="销售中心" />
            <el-option label="职能中心" value="职能中心" />
          </el-select>
        </el-form-item>
        <el-form-item label="主持人" prop="hostName">
          <el-input v-model="editForm.hostName" />
        </el-form-item>
        <el-form-item label="计划时间" prop="scheduledTime">
          <el-date-picker
            v-model="editForm.scheduledTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- AI 高风险员工预警（诊断模式）-->
    <AIAssistDialog
      v-model="aiRiskAlertVisible"
      ability-code="risk_alert"
      mode="diagnose"
      initial-input="输入范围：当前盘点会议适用范围的员工，近 8 周数据"
      dialog-width="720px"
      dialog-title="高风险员工预警 · AI 分析"
      input-label="分析范围"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AIAssistDialog from '@/components/business/AIAssistDialog.vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getTalentMeetingList,
  addTalentMeeting,
  updateTalentMeeting,
  deleteTalentMeeting
} from '@/api/performanceTalentReview'
import {
  TALENT_STATUS_LABEL,
  TALENT_STATUS_TYPE
} from '@/types/performanceTalentReview'
import type {
  TalentReviewMeeting,
  TalentReviewMeetingListParams,
  TalentReviewStatus
} from '@/types/performanceTalentReview'

defineOptions({ name: 'PerformanceTalentReview' })

const router = useRouter()

const queryParams = reactive<TalentReviewMeetingListParams>({
  meetingName: '',
  status: '',
  page: 1,
  pageSize: 20
})

const tableData = ref<TalentReviewMeeting[]>([])
const total = ref(0)

const fetchData = async () => {
  const res: any = await getTalentMeetingList(queryParams)
  tableData.value = res.data.list
  total.value = res.data.total
}
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.meetingName = ''
  queryParams.status = ''
  queryParams.page = 1
  fetchData()
}

// 编辑
const editDialogVisible = ref(false)
const aiRiskAlertVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<TalentReviewMeeting>>({
  id: undefined,
  meetingName: '',
  cycleName: '',
  cycleId: 0,
  departments: [],
  hostName: '',
  scheduledTime: '',
  entries: [],
  status: 'preparing',
  remark: ''
})
const formRules: FormRules = {
  meetingName: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
  cycleName: [{ required: true, message: '请输入所属周期', trigger: 'blur' }],
  departments: [{ required: true, type: 'array', message: '请选择适用部门', trigger: 'change' }],
  hostName: [{ required: true, message: '请输入主持人', trigger: 'blur' }],
  scheduledTime: [{ required: true, message: '请选择计划时间', trigger: 'change' }]
}

const resetEditForm = () => {
  editForm.id = undefined
  editForm.meetingName = ''
  editForm.cycleName = ''
  editForm.cycleId = 0
  editForm.departments = []
  editForm.hostName = ''
  editForm.scheduledTime = ''
  editForm.entries = []
  editForm.status = 'preparing'
  editForm.remark = ''
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}
const handleEdit = (row: TalentReviewMeeting) => {
  resetEditForm()
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}
const handleSubmit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate()

  if (!editForm.meetingNo && !editForm.id) {
    editForm.meetingNo = `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      Date.now()
    ).slice(-3)}`
  }

  if (editForm.id) {
    await updateTalentMeeting(editForm as any)
    ElMessage.success('更新成功')
  } else {
    await addTalentMeeting(editForm as any)
    ElMessage.success('发起成功')
  }
  editDialogVisible.value = false
  fetchData()
}
const handleDelete = (row: TalentReviewMeeting) => {
  ElMessageBox.confirm(`确定删除会议"${row.meetingName}"吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteTalentMeeting(row.id)
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleOpenBoard = (row: TalentReviewMeeting) => {
  router.push(`/talent/board/${row.id}`)
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.ai-insight-banner {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0d3 100%);

  :deep(.el-card__body) {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ai-banner-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ai-banner-icon {
    font-size: 28px;
  }

  .ai-banner-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .ai-banner-desc {
    font-size: 12px;
    color: #606266;
    margin-top: 2px;
  }
}

.talent-review-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-card,
  .data-card {
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .filter-card :deep(.el-card__body) {
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

  .data-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .header-title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .table-container {
      flex: 1;
      overflow: hidden;
    }

    .el-pagination {
      flex-shrink: 0;
      margin-top: 16px;
      justify-content: flex-end;
    }
  }
}
</style>
