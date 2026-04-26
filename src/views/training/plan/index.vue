<template>
  <div class="plan-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="计划编号">
            <el-input
              v-model="queryParams.planNo"
              placeholder="请输入计划编号"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item label="计划名称">
            <el-input
              v-model="queryParams.planName"
              placeholder="请输入计划名称"
              style="width: 220px"
              clearable
            />
          </el-form-item>

          <el-form-item label="关联课程">
            <el-select
              v-model="queryParams.courseId"
              placeholder="请选择课程"
              style="width: 220px"
              clearable
              filterable
            >
              <el-option
                v-for="c in courseOptions"
                :key="c.id"
                :label="`${c.courseCode} / ${c.courseName}`"
                :value="c.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              style="width: 140px"
              clearable
            >
              <el-option
                v-for="(label, key) in PLAN_STATUS_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增计划
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
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
          <el-table-column type="selection" width="50" />
          <el-table-column prop="planNo" label="计划编号" width="140" />
          <el-table-column prop="planName" label="计划名称" min-width="240" show-overflow-tooltip />
          <el-table-column prop="courseName" label="关联课程" min-width="200" show-overflow-tooltip />
          <el-table-column label="起止时间" width="200" align="center">
            <template #default="{ row }">
              {{ row.startDate }} ~ {{ row.endDate }}
            </template>
          </el-table-column>
          <el-table-column prop="location" label="地点/链接" min-width="180" show-overflow-tooltip />
          <el-table-column label="报名情况" width="130" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="getEnrolledPercent(row)"
                :stroke-width="6"
                :format="() => `${row.enrolledCount}/${row.capacity}`"
                :status="getEnrolledPercent(row) >= 100 ? 'success' : undefined"
              />
            </template>
          </el-table-column>
          <el-table-column prop="organizerName" label="组织者" width="100" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="PLAN_STATUS_TYPE[row.status as PlanStatus]" size="small">
                {{ PLAN_STATUS_LABEL[row.status as PlanStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情</el-button>
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
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 新增/编辑 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="720px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="计划编号" prop="planNo">
          <el-input v-model="formData.planNo" placeholder="如 TP20260515001" />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="formData.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="关联课程" prop="courseId">
          <el-select
            v-model="formData.courseId"
            placeholder="请选择课程"
            style="width: 100%"
            filterable
            @change="onCourseChange"
          >
            <el-option
              v-for="c in courseOptions"
              :key="c.id"
              :label="`${c.courseCode} / ${c.courseName}`"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="地点/链接" prop="location">
          <el-input v-model="formData.location" placeholder="线下地点或在线链接" />
        </el-form-item>
        <el-form-item label="容量" prop="capacity">
          <el-input v-model.number="formData.capacity" placeholder="如 30" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(label, key) in PLAN_STATUS_LABEL"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Drawer -->
    <el-drawer
      v-model="detailVisible"
      :title="detailData?.planName || '培训计划详情'"
      size="860px"
      direction="rtl"
    >
      <template v-if="detailData">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="计划编号">{{ detailData.planNo }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="PLAN_STATUS_TYPE[detailData.status as PlanStatus]" size="small">
              {{ PLAN_STATUS_LABEL[detailData.status as PlanStatus] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计划名称" :span="2">{{ detailData.planName }}</el-descriptions-item>
          <el-descriptions-item label="关联课程">{{ detailData.courseName }}</el-descriptions-item>
          <el-descriptions-item label="讲师">{{ detailData.instructorName }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ detailData.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ detailData.endDate }}</el-descriptions-item>
          <el-descriptions-item label="地点/链接" :span="2">{{ detailData.location }}</el-descriptions-item>
          <el-descriptions-item label="组织者">{{ detailData.organizerName }}</el-descriptions-item>
          <el-descriptions-item label="报名情况">
            {{ detailData.enrolledCount }} / {{ detailData.capacity }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ detailData.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="records-head">
          <div class="records-title">学员名单 / 签到情况</div>
          <el-tag type="info" effect="plain">共 {{ detailRecords.length }} 人</el-tag>
        </div>

        <el-table :data="detailRecords" border size="small" style="width: 100%" max-height="500">
          <el-table-column prop="employeeName" label="员工" width="100" />
          <el-table-column prop="orgName" label="组织" min-width="160" />
          <el-table-column label="签到" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.attended" type="success" size="small">已出勤</el-tag>
              <el-tag v-else type="danger" size="small">缺勤</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="成绩" width="80" align="center">
            <template #default="{ row }">
              <span v-if="row.score !== undefined" :style="{ color: row.score >= 75 ? '#67c23a' : '#f56c6c' }">
                {{ row.score }}
              </span>
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column label="结业状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="COMPLETION_STATUS_TYPE[row.completionStatus as TrainingRecord['completionStatus']]" size="small">
                {{ COMPLETION_STATUS_LABEL[row.completionStatus as TrainingRecord['completionStatus']] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="反馈" width="90" align="center">
            <template #default="{ row }">
              <el-rate v-if="row.feedback" :model-value="row.feedback" disabled size="small" />
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        </el-table>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getTrainingPlanList,
  addTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  batchDeleteTrainingPlan,
  getCourseList,
  getTrainingRecordsByPlanApi,
  rebuildTrainingRecords
} from '@/api/training'
import type { TrainingPlan, PlanStatus, Course, TrainingRecord } from '@/types/training'
import {
  PLAN_STATUS_LABEL,
  PLAN_STATUS_TYPE,
  COMPLETION_STATUS_LABEL,
  COMPLETION_STATUS_TYPE
} from '@/types/training'

defineOptions({ name: 'TrainingPlan' })

const queryParams = reactive<{
  planNo?: string
  planName?: string
  courseId?: number | null
  status?: PlanStatus | ''
  page: number
  pageSize: number
}>({
  planNo: '',
  planName: '',
  courseId: null,
  status: '',
  page: 1,
  pageSize: 10
})

const tableData = ref<TrainingPlan[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])
const courseOptions = ref<Course[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

type PlanForm = Partial<TrainingPlan> & { dateRange?: [string, string] }
const emptyForm = (): PlanForm => ({
  planNo: '',
  planName: '',
  courseId: undefined,
  courseName: '',
  instructorName: '',
  startDate: '',
  endDate: '',
  dateRange: undefined,
  location: '',
  organizerName: '',
  organizerId: 0,
  capacity: 30,
  enrolledEmployees: [],
  enrolledCount: 0,
  status: 'draft',
  description: ''
})
const formData = reactive<PlanForm>(emptyForm())

const formRules: FormRules = {
  planNo: [{ required: true, message: '请输入计划编号', trigger: 'blur' }],
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择起止日期', trigger: 'change' }],
  location: [{ required: true, message: '请输入地点或在线链接', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容量', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const detailVisible = ref(false)
const detailData = ref<TrainingPlan | null>(null)
const detailRecords = ref<TrainingRecord[]>([])

const fetchData = async () => {
  try {
    const res: any = await getTrainingPlanList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {
    ElMessage.error('获取培训计划失败')
  }
}

const fetchCourses = async () => {
  const res: any = await getCourseList({ page: 1, pageSize: 200 })
  courseOptions.value = res.data.list
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryParams, {
    planNo: '',
    planName: '',
    courseId: null,
    status: '',
    page: 1,
    pageSize: 10
  })
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增培训计划'
  Object.assign(formData, emptyForm(), { id: undefined })
  dialogVisible.value = true
}

const handleEdit = (row: TrainingPlan) => {
  dialogTitle.value = '编辑培训计划'
  Object.assign(formData, row, {
    dateRange: [row.startDate, row.endDate] as [string, string]
  })
  dialogVisible.value = true
}

const onCourseChange = (courseId: number) => {
  const c = courseOptions.value.find((x) => x.id === courseId)
  if (c) {
    formData.courseName = c.courseName
    formData.instructorName = c.instructorName
  }
}

const getEnrolledPercent = (row: TrainingPlan) => {
  if (!row.capacity) return 0
  return Math.round((row.enrolledCount / row.capacity) * 100)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (formData.dateRange) {
      formData.startDate = formData.dateRange[0]
      formData.endDate = formData.dateRange[1]
    }
    const payload = { ...formData } as Partial<TrainingPlan>
    delete (payload as any).dateRange
    try {
      if (formData.id) {
        await updateTrainingPlan(payload as TrainingPlan)
        ElMessage.success('更新成功')
      } else {
        await addTrainingPlan(payload as TrainingPlan)
        ElMessage.success('新增成功')
      }
      rebuildTrainingRecords()
      dialogVisible.value = false
      fetchData()
    } catch {
      ElMessage.error('操作失败')
    }
  })
}

const handleDelete = async (row: TrainingPlan) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.planName}」？`, '提示', { type: 'warning' })
    await deleteTrainingPlan(row.id)
    rebuildTrainingRecords()
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个计划？`, '提示', {
      type: 'warning'
    })
    await batchDeleteTrainingPlan(selectedIds.value)
    rebuildTrainingRecords()
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleView = async (row: TrainingPlan) => {
  detailData.value = row
  detailRecords.value = []
  detailVisible.value = true
  const res: any = await getTrainingRecordsByPlanApi(row.id)
  detailRecords.value = res.data || []
}

const handleSelectionChange = (selection: TrainingPlan[]) => {
  selectedIds.value = selection.map((s) => s.id)
}

onMounted(async () => {
  await fetchCourses()
  fetchData()
})
</script>

<style scoped lang="scss">
.plan-container {
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
  }
}

.records-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 12px;

  .records-title {
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
