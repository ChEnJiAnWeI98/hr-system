<template>
  <div class="training-evaluation-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="评估编号">
            <el-input v-model="queryParams.evaluationNo" placeholder="请输入评估编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="课程名称">
            <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待评估" :value="1" />
              <el-option label="已评估" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="评估日期">
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
            新增评估
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
          <el-table-column prop="evaluationNo" label="评估编号" min-width="10%" />
          <el-table-column prop="recordNo" label="记录编号" min-width="10%" />
          <el-table-column prop="courseName" label="课程名称" min-width="12%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="contentScore" label="内容评分" min-width="8%">
            <template #default="{ row }">
              <el-rate v-model="row.contentScore" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="instructorScore" label="讲师评分" min-width="8%">
            <template #default="{ row }">
              <el-rate v-model="row.instructorScore" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="organizationScore" label="组织评分" min-width="8%">
            <template #default="{ row }">
              <el-rate v-model="row.organizationScore" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="overallScore" label="综合评分" min-width="8%">
            <template #default="{ row }">
              <el-rate v-model="row.overallScore" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待评估</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已评估</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="evaluationDate" label="评估日期" min-width="10%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="评估编号" prop="evaluationNo">
          <el-input v-model="formData.evaluationNo" placeholder="请输入评估编号" />
        </el-form-item>

        <el-form-item label="记录编号" prop="recordNo">
          <el-input v-model="formData.recordNo" placeholder="请输入记录编号" />
        </el-form-item>

        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>

        <el-form-item label="内容评分" prop="contentScore">
          <el-rate v-model="formData.contentScore" :max="5" />
        </el-form-item>

        <el-form-item label="讲师评分" prop="instructorScore">
          <el-rate v-model="formData.instructorScore" :max="5" />
        </el-form-item>

        <el-form-item label="组织评分" prop="organizationScore">
          <el-rate v-model="formData.organizationScore" :max="5" />
        </el-form-item>

        <el-form-item label="综合评分" prop="overallScore">
          <el-rate v-model="formData.overallScore" :max="5" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待评估" :value="1" />
            <el-option label="已评估" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="评估日期" prop="evaluationDate">
          <el-date-picker
            v-model="formData.evaluationDate"
            type="date"
            placeholder="请选择评估日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="评估意见" prop="comments">
          <el-input
            v-model="formData.comments"
            type="textarea"
            :rows="4"
            placeholder="请输入评估意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="评估详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评估编号">
          {{ detailData.evaluationNo }}
        </el-descriptions-item>
        <el-descriptions-item label="记录编号">
          {{ detailData.recordNo }}
        </el-descriptions-item>
        <el-descriptions-item label="课程名称">
          {{ detailData.courseName }}
        </el-descriptions-item>
        <el-descriptions-item label="员工姓名">
          {{ detailData.employeeName }}
        </el-descriptions-item>
        <el-descriptions-item label="内容评分">
          <el-rate v-model="detailData.contentScore" disabled :max="5" />
        </el-descriptions-item>
        <el-descriptions-item label="讲师评分">
          <el-rate v-model="detailData.instructorScore" disabled :max="5" />
        </el-descriptions-item>
        <el-descriptions-item label="组织评分">
          <el-rate v-model="detailData.organizationScore" disabled :max="5" />
        </el-descriptions-item>
        <el-descriptions-item label="综合评分">
          <el-rate v-model="detailData.overallScore" disabled :max="5" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待评估</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已评估</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评估日期">
          {{ detailData.evaluationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="评估意见" :span="2">
          {{ detailData.comments }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getList,
  addItem,
  updateItem,
  deleteItem,
  batchDeleteItems
} from '@/api/trainingEvaluation'
import type { TrainingEvaluation, TrainingEvaluationQueryParams } from '@/types/training'

defineOptions({
  name: 'TrainingEvaluation'
})

// 查询参数
const queryParams = reactive<TrainingEvaluationQueryParams>({
  evaluationNo: '',
  courseName: '',
  employeeName: '',
  status: null,
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[Date, Date] | null>(null)

// 表格数据
const tableData = ref<TrainingEvaluation[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<TrainingEvaluation>>({
  evaluationNo: '',
  recordNo: '',
  courseName: '',
  employeeName: '',
  contentScore: 0,
  instructorScore: 0,
  organizationScore: 0,
  overallScore: 0,
  status: 1,
  evaluationDate: '',
  comments: ''
})

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<TrainingEvaluation>>({})

// 表单验证规则
const formRules: FormRules = {
  evaluationNo: [{ required: true, message: '请输入评估编号', trigger: 'blur' }],
  recordNo: [{ required: true, message: '请输入记录编号', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  contentScore: [{ required: true, message: '请选择内容评分', trigger: 'change' }],
  instructorScore: [{ required: true, message: '请选择讲师评分', trigger: 'change' }],
  organizationScore: [{ required: true, message: '请选择组织评分', trigger: 'change' }],
  overallScore: [{ required: true, message: '请选择综合评分', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  evaluationDate: [{ required: true, message: '请选择评估日期', trigger: 'change' }]
}

// 获取列表数据
const fetchData = async () => {
  try {
    // 处理日期范围
    if (dateRange.value) {
      queryParams.startDate = dateRange.value[0].toISOString().split('T')[0]
      queryParams.endDate = dateRange.value[1].toISOString().split('T')[0]
    } else {
      queryParams.startDate = ''
      queryParams.endDate = ''
    }

    const res = await getList(queryParams)
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
  queryParams.evaluationNo = ''
  queryParams.courseName = ''
  queryParams.employeeName = ''
  queryParams.status = null
  dateRange.value = null
  queryParams.startDate = ''
  queryParams.endDate = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchData()
}

// 表格选择变化
const handleSelectionChange = (selection: TrainingEvaluation[]) => {
  selectedIds.value = selection.map(item => item.id!)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增评估'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: TrainingEvaluation) => {
  dialogTitle.value = '编辑评估'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: TrainingEvaluation) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: TrainingEvaluation) => {
  try {
    await ElMessageBox.confirm('确定要删除该评估吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteItem?.(row.id!)
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

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条评估吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await batchDeleteItems?.(selectedIds.value)
    if (res && 'code' in res && res.code === 200) {
      ElMessage.success('批量删除成功')
      fetchData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 处理日期格式
        if (formData.evaluationDate && typeof formData.evaluationDate === 'object') {
          formData.evaluationDate = (formData.evaluationDate as Date).toISOString().split('T')[0]
        }

        const res = formData.id
          ? await updateItem(formData as TrainingEvaluation)
          : await addItem(formData)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '新增成功')
          dialogVisible.value = false
          fetchData()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    evaluationNo: '',
    recordNo: '',
    courseName: '',
    employeeName: '',
    contentScore: 0,
    instructorScore: 0,
    organizationScore: 0,
    overallScore: 0,
    status: 1,
    evaluationDate: '',
    comments: ''
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.training-evaluation-container {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  .el-button:not(:first-child) {
    margin-left: 12px;
  }
}
</style>
