<template>
  <div class="training-record-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="记录编号">
            <el-input v-model="queryParams.recordNo" placeholder="请输入记录编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="计划名称">
            <el-input v-model="queryParams.planName" placeholder="请输入计划名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="课程名称">
            <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="讲师">
            <el-input v-model="queryParams.instructor" placeholder="请输入讲师" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="签到状态">
            <el-select v-model="queryParams.checkInStatus" placeholder="请选择签到状态" style="width: 150px" clearable>
              <el-option label="未签到" :value="1" />
              <el-option label="已签到" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="计划中" :value="1" />
              <el-option label="进行中" :value="2" />
              <el-option label="已完成" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="培训日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              clearable
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
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增记录
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
          <el-table-column prop="recordNo" label="记录编号" min-width="10%" />
          <el-table-column prop="planName" label="计划名称" min-width="12%" />
          <el-table-column prop="courseName" label="课程名称" min-width="12%" />
          <el-table-column prop="trainingDate" label="培训日期" min-width="10%" />
          <el-table-column prop="location" label="地点" min-width="10%" />
          <el-table-column prop="instructor" label="讲师" min-width="8%" />
          <el-table-column prop="participantCount" label="参训人数" min-width="8%" />
          <el-table-column prop="actualHours" label="实际学时" min-width="8%" />
          <el-table-column prop="checkInStatus" label="签到状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.checkInStatus === 1" type="warning">未签到</el-tag>
              <el-tag v-else-if="row.checkInStatus === 2" type="success">已签到</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="examScore" label="考核成绩" min-width="8%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="info">计划中</el-tag>
              <el-tag v-else-if="row.status === 2" type="primary">进行中</el-tag>
              <el-tag v-else-if="row.status === 3" type="success">已完成</el-tag>
              <el-tag v-else-if="row.status === 4" type="danger">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">
                查看详情
              </el-button>
              <el-button v-if="row.checkInStatus === 1" link type="success" @click="handleCheckIn(row)">
                签到
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
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
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="记录编号" prop="recordNo">
              <el-input v-model="formData.recordNo" placeholder="请输入记录编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="planName">
              <el-input v-model="formData.planName" placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训日期" prop="trainingDate">
              <el-date-picker
                v-model="formData.trainingDate"
                type="date"
                placeholder="请选择培训日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地点" prop="location">
              <el-input v-model="formData.location" placeholder="请输入地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师" prop="instructor">
              <el-input v-model="formData.instructor" placeholder="请输入讲师" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参训人数" prop="participantCount">
              <el-input v-model="formData.participantCount" placeholder="请输入参训人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际学时" prop="actualHours">
              <el-input v-model="formData.actualHours" placeholder="请输入实际学时" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签到状态" prop="checkInStatus">
              <el-select v-model="formData.checkInStatus" placeholder="请选择签到状态" style="width: 100%">
                <el-option label="未签到" :value="1" />
                <el-option label="已签到" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核成绩" prop="examScore">
              <el-input v-model="formData.examScore" placeholder="请输入考核成绩" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="计划中" :value="1" />
                <el-option label="进行中" :value="2" />
                <el-option label="已完成" :value="3" />
                <el-option label="已取消" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="培训记录详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="记录编号">{{ detailData.recordNo }}</el-descriptions-item>
        <el-descriptions-item label="计划名称">{{ detailData.planName }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ detailData.courseName }}</el-descriptions-item>
        <el-descriptions-item label="培训日期">{{ detailData.trainingDate }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detailData.location }}</el-descriptions-item>
        <el-descriptions-item label="讲师">{{ detailData.instructor }}</el-descriptions-item>
        <el-descriptions-item label="参训人数">{{ detailData.participantCount }}</el-descriptions-item>
        <el-descriptions-item label="实际学时">{{ detailData.actualHours }}</el-descriptions-item>
        <el-descriptions-item label="签到状态">
          <el-tag v-if="detailData.checkInStatus === 1" type="warning">未签到</el-tag>
          <el-tag v-else-if="detailData.checkInStatus === 2" type="success">已签到</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="考核成绩">{{ detailData.examScore }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="info">计划中</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="primary">进行中</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="success">已完成</el-tag>
          <el-tag v-else-if="detailData.status === 4" type="danger">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getTrainingRecordList,
  addTrainingRecord,
  updateTrainingRecord,
  deleteTrainingRecord,
  batchDeleteTrainingRecords,
  checkInTrainingRecord
} from '@/api/trainingRecord'
import type { TrainingRecord, TrainingRecordQueryParams } from '@/types/training'

defineOptions({
  name: 'TrainingRecord'
})

// 查询参数
const queryParams = reactive<TrainingRecordQueryParams>({
  recordNo: '',
  planName: '',
  courseName: '',
  instructor: '',
  checkInStatus: null,
  status: null,
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[Date, Date] | null>(null)

// 表格数据
const tableData = ref<TrainingRecord[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<TrainingRecord>>({
  recordNo: '',
  planName: '',
  courseName: '',
  trainingDate: '',
  location: '',
  instructor: '',
  participantCount: 0,
  actualHours: 0,
  checkInStatus: 1,
  examScore: 0,
  status: 1,
  remark: ''
})

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<TrainingRecord>>({})

// 表单验证规则
const formRules: FormRules = {
  recordNo: [{ required: true, message: '请输入记录编号', trigger: 'blur' }],
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  trainingDate: [{ required: true, message: '请选择培训日期', trigger: 'change' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  instructor: [{ required: true, message: '请输入讲师', trigger: 'blur' }],
  participantCount: [{ required: true, message: '请输入参训人数', trigger: 'blur' }],
  actualHours: [{ required: true, message: '请输入实际学时', trigger: 'blur' }],
  checkInStatus: [{ required: true, message: '请选择签到状态', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取列表数据
const getList = async () => {
  try {
    // 处理日期范围
    if (dateRange.value) {
      queryParams.startDate = dateRange.value[0].toISOString().split('T')[0]
      queryParams.endDate = dateRange.value[1].toISOString().split('T')[0]
    } else {
      queryParams.startDate = ''
      queryParams.endDate = ''
    }

    const res = await getTrainingRecordList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.recordNo = ''
  queryParams.planName = ''
  queryParams.courseName = ''
  queryParams.instructor = ''
  queryParams.checkInStatus = null
  queryParams.status = null
  queryParams.startDate = ''
  queryParams.endDate = ''
  dateRange.value = null
  queryParams.page = 1
  getList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增培训记录'
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row: TrainingRecord) => {
  dialogTitle.value = '编辑培训记录'
  dialogVisible.value = true
  Object.assign(formData, row)
}

// 查看详情
const handleView = (row: TrainingRecord) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 签到
const handleCheckIn = async (row: TrainingRecord) => {
  try {
    await ElMessageBox.confirm('确认签到该培训记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await checkInTrainingRecord(row.id!)
    if (res.code === 200) {
      ElMessage.success('签到成功')
      getList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('签到失败')
    }
  }
}

// 删除
const handleDelete = async (row: TrainingRecord) => {
  try {
    await ElMessageBox.confirm('确认删除该培训记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteTrainingRecord?.(row.id!)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确认删除选中的培训记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await batchDeleteTrainingRecords?.(selectedIds.value)
    if (res && 'code' in res && res.code === 200) {
      ElMessage.success('删除成功')
      getList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection: TrainingRecord[]) => {
  selectedIds.value = selection.map(item => item.id!)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          const res = await updateTrainingRecord(formData as TrainingRecord)
          if (res.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            getList()
          }
        } else {
          const res = await addTrainingRecord(formData as TrainingRecord)
          if (res.code === 200) {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getList()
          }
        }
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.id = undefined
  formData.recordNo = ''
  formData.planName = ''
  formData.courseName = ''
  formData.trainingDate = ''
  formData.location = ''
  formData.instructor = ''
  formData.participantCount = 0
  formData.actualHours = 0
  formData.checkInStatus = 1
  formData.examScore = 0
  formData.status = 1
  formData.remark = ''
  formRef.value?.clearValidate()
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.training-record-container {
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
