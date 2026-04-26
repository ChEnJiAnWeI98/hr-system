<template>
  <div class="resume-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="简历编号">
            <el-input v-model="queryParams.resumeNo" placeholder="请输入简历编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="候选人姓名">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="应聘岗位">
            <el-input v-model="queryParams.position" placeholder="请输入应聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="来源渠道">
            <el-input v-model="queryParams.source" placeholder="请输入来源渠道" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="待筛选" :value="1" />
              <el-option label="待面试" :value="2" />
              <el-option label="面试中" :value="3" />
              <el-option label="已入库" :value="4" />
              <el-option label="已淘汰" :value="5" />
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
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入简历
          </el-button>
          <el-button type="success" :disabled="selectedIds.length === 0" @click="handleBatchStore">
            批量入库
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
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="resumeNo" label="简历编号" min-width="10%" />
          <el-table-column prop="candidateName" label="候选人姓名" min-width="10%" />
          <el-table-column label="性别/年龄" min-width="8%">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }} / {{ row.age }}岁
            </template>
          </el-table-column>
          <el-table-column prop="position" label="应聘岗位" min-width="10%" />
          <el-table-column label="工作年限" min-width="8%">
            <template #default="{ row }">
              {{ row.workYears }}年
            </template>
          </el-table-column>
          <el-table-column prop="education" label="学历" min-width="8%" />
          <el-table-column prop="expectedSalary" label="期望薪资" min-width="10%" />
          <el-table-column label="标签" min-width="12%">
            <template #default="{ row }">
              <el-tag v-for="tag in row.tags" :key="tag" style="margin-right: 4px">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" min-width="8%" />
          <el-table-column label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="info">待筛选</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">待面试</el-tag>
              <el-tag v-else-if="row.status === 3" type="primary">面试中</el-tag>
              <el-tag v-else-if="row.status === 4" type="success">已入库</el-tag>
              <el-tag v-else-if="row.status === 5" type="danger">已淘汰</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="primary" :disabled="row.status === 2 || row.status === 3" @click="handleScheduleInterview(row)">
                安排面试
              </el-button>
              <el-button link type="success" :disabled="row.status === 4" @click="handleStore(row)">
                入库
              </el-button>
              <el-button link type="danger" :disabled="row.status === 5" @click="handleReject(row)">
                淘汰
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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="简历详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-scrollbar height="500px">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="简历编号">{{ currentResume?.resumeNo }}</el-descriptions-item>
          <el-descriptions-item label="候选人姓名">{{ currentResume?.candidateName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentResume?.gender === 1 ? '男' : '女' }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ currentResume?.age }}岁</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentResume?.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentResume?.email }}</el-descriptions-item>
          <el-descriptions-item label="现居地" :span="2">{{ currentResume?.location }}</el-descriptions-item>
          <el-descriptions-item label="应聘岗位">{{ currentResume?.position }}</el-descriptions-item>
          <el-descriptions-item label="工作年限">{{ currentResume?.workYears }}年</el-descriptions-item>
          <el-descriptions-item label="学历">{{ currentResume?.education }}</el-descriptions-item>
          <el-descriptions-item label="期望薪资">{{ currentResume?.expectedSalary }}</el-descriptions-item>
          <el-descriptions-item label="毕业院校">{{ currentResume?.school }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ currentResume?.major }}</el-descriptions-item>
          <el-descriptions-item label="来源渠道">{{ currentResume?.source }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag v-if="currentResume?.status === 1" type="info">待筛选</el-tag>
            <el-tag v-else-if="currentResume?.status === 2" type="warning">待面试</el-tag>
            <el-tag v-else-if="currentResume?.status === 3" type="primary">面试中</el-tag>
            <el-tag v-else-if="currentResume?.status === 4" type="success">已入库</el-tag>
            <el-tag v-else-if="currentResume?.status === 5" type="danger">已淘汰</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag v-for="tag in currentResume?.tags" :key="tag" style="margin-right: 4px">
              {{ tag }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="工作经历" :span="2">
            <div style="white-space: pre-wrap">{{ currentResume?.workExperience }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="项目经历" :span="2">
            <div style="white-space: pre-wrap">{{ currentResume?.projectExperience }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="自我评价" :span="2">
            <div style="white-space: pre-wrap">{{ currentResume?.selfEvaluation }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentResume?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentResume?.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </el-scrollbar>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 安排面试弹窗 -->
    <el-dialog
      v-model="interviewVisible"
      title="安排面试"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="interviewForm" label-width="100px">
        <el-form-item label="候选人">
          <el-input :model-value="currentResume?.candidateName" disabled />
        </el-form-item>
        <el-form-item label="应聘岗位">
          <el-input :model-value="currentResume?.position" disabled />
        </el-form-item>
        <el-form-item label="面试官" required>
          <el-input v-model="interviewForm.interviewer" placeholder="请输入面试官姓名" />
        </el-form-item>
        <el-form-item label="面试时间" required>
          <el-date-picker
            v-model="interviewForm.interviewTime"
            type="datetime"
            placeholder="请选择面试时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="面试地点" required>
          <el-input v-model="interviewForm.interviewLocation" placeholder="请输入面试地点" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="interviewForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="interviewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmInterview">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import type { Resume, ResumeListParams } from '@/types/recruitment'
import {
  getResumeList,
  getResumeDetail,
  batchStoreResume,
  batchDeleteResume,
  scheduleInterview,
  rejectResume
} from '@/api/recruitment/resume'

defineOptions({
  name: 'RecruitmentResume'
})

// 查询参数
const queryParams = reactive<ResumeListParams>({
  resumeNo: '',
  candidateName: '',
  position: '',
  source: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Resume[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 详情弹窗
const detailVisible = ref(false)
const currentResume = ref<Resume>()

// 安排面试弹窗
const interviewVisible = ref(false)
const interviewForm = reactive({
  interviewer: '',
  interviewTime: '',
  interviewLocation: '',
  remark: ''
})

// 获取列表数据
const fetchData = async () => {
  try {
    const res = await getResumeList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.resumeNo = ''
  queryParams.candidateName = ''
  queryParams.position = ''
  queryParams.source = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchData()
}

// 表格选择
const handleSelectionChange = (selection: Resume[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 导入简历
const handleImport = () => {
  ElMessage.info('导入简历功能开发中')
}

// 批量入库
const handleBatchStore = async () => {
  try {
    await ElMessageBox.confirm('确定要将选中的简历入库吗？', '提示', {
      type: 'warning'
    })
    const res = await batchStoreResume(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('入库成功')
      fetchData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('入库失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的简历吗？', '提示', {
      type: 'warning'
    })
    const res = await batchDeleteResume(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 查看详情
const handleView = async (row: Resume) => {
  try {
    const res = await getResumeDetail(row.id)
    if (res.code === 200) {
      currentResume.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 安排面试
const handleScheduleInterview = (row: Resume) => {
  currentResume.value = row
  interviewForm.interviewer = ''
  interviewForm.interviewTime = ''
  interviewForm.interviewLocation = ''
  interviewForm.remark = ''
  interviewVisible.value = true
}

// 确认安排面试
const handleConfirmInterview = async () => {
  if (!interviewForm.interviewer) {
    ElMessage.warning('请输入面试官姓名')
    return
  }
  if (!interviewForm.interviewTime) {
    ElMessage.warning('请选择面试时间')
    return
  }
  if (!interviewForm.interviewLocation) {
    ElMessage.warning('请输入面试地点')
    return
  }

  try {
    const res = await scheduleInterview({
      resumeId: currentResume.value!.id,
      ...interviewForm
    })
    if (res.code === 200) {
      ElMessage.success('安排面试成功')
      interviewVisible.value = false
      fetchData()
    }
  } catch (error) {
    ElMessage.error('安排面试失败')
  }
}

// 入库
const handleStore = async (row: Resume) => {
  try {
    await ElMessageBox.confirm('确定要将该简历入库吗？', '提示', {
      type: 'warning'
    })
    const res = await batchStoreResume([row.id])
    if (res.code === 200) {
      ElMessage.success('入库成功')
      fetchData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('入库失败')
    }
  }
}

// 淘汰
const handleReject = async (row: Resume) => {
  try {
    await ElMessageBox.confirm('确定要淘汰该简历吗？', '提示', {
      type: 'warning'
    })
    const res = await rejectResume(row.id)
    if (res.code === 200) {
      ElMessage.success('淘汰成功')
      fetchData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('淘汰失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.resume-container {
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
