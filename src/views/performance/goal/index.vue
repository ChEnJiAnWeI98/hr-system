<template>
  <div class="performance-goal-page">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-select v-model="queryParams.departmentId" placeholder="请选择部门" style="width: 150px" clearable>
              <el-option label="技术部" :value="1" />
              <el-option label="产品部" :value="2" />
              <el-option label="运营部" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="绩效周期">
            <el-date-picker
              v-model="queryParams.performancePeriod"
              type="month"
              placeholder="请选择绩效周期"
              value-format="YYYY-MM"
              style="width: 150px"
              clearable
            />
          </el-form-item>

          <el-form-item label="目标类型">
            <el-select v-model="queryParams.goalType" placeholder="请选择目标类型" style="width: 120px" clearable>
              <el-option label="OKR" :value="1" />
              <el-option label="KPI" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="未开始" :value="0" />
              <el-option label="进行中" :value="1" />
              <el-option label="已完成" :value="2" />
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

    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增目标
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
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="performancePeriod" label="绩效周期" min-width="12%" />
          <el-table-column prop="goalType" label="目标类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.goalType === 1" type="primary">OKR</el-tag>
              <el-tag v-else type="success">KPI</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="goalTitle" label="目标标题" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="weight" label="权重" min-width="8%" align="center">
            <template #default="{ row }">
              {{ row.weight }}%
            </template>
          </el-table-column>
          <el-table-column prop="targetValue" label="目标值" min-width="10%" align="right" />
          <el-table-column prop="currentValue" label="当前值" min-width="10%" align="right" />
          <el-table-column prop="progress" label="进度" min-width="8%">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :color="getProgressColor(row.progress)" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="info">未开始</el-tag>
              <el-tag v-else-if="row.status === 1" type="warning">进行中</el-tag>
              <el-tag v-else type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="16%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="primary" @click="handleUpdateProgress(row)">
                更新进度
              </el-button>
              <el-button link @click="handleViewDetail(row)">
                查看详情
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
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="formData.employeeId" placeholder="请选择员工" style="width: 100%">
            <el-option label="张三" :value="1" />
            <el-option label="李四" :value="2" />
            <el-option label="王五" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="绩效周期" prop="performancePeriod">
          <el-date-picker
            v-model="formData.performancePeriod"
            type="month"
            placeholder="请选择绩效周期"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="目标类型" prop="goalType">
          <el-radio-group v-model="formData.goalType">
            <el-radio :value="1">OKR</el-radio>
            <el-radio :value="2">KPI</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="目标标题" prop="goalTitle">
          <el-input v-model="formData.goalTitle" placeholder="请输入目标标题" />
        </el-form-item>

        <el-form-item label="目标描述" prop="goalDescription">
          <el-input
            v-model="formData.goalDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入目标描述"
          />
        </el-form-item>

        <el-form-item label="权重" prop="weight">
          <el-input v-model="formData.weight" placeholder="请输入权重（0-100）" style="width: 200px">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="目标值" prop="targetValue">
          <el-input v-model="formData.targetValue" placeholder="请输入目标值" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 更新进度弹窗 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="更新进度"
      width="500px"
      @close="handleProgressDialogClose"
    >
      <el-form
        ref="progressFormRef"
        :model="progressFormData"
        :rules="progressFormRules"
        label-width="100px"
      >
        <el-form-item label="当前值" prop="currentValue">
          <el-input v-model="progressFormData.currentValue" placeholder="请输入当前值" />
        </el-form-item>

        <el-form-item label="进度说明">
          <el-input
            v-model="progressFormData.progressNote"
            type="textarea"
            :rows="4"
            placeholder="请输入进度说明"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProgressSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="目标详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="绩效周期">{{ detailData.performancePeriod }}</el-descriptions-item>
        <el-descriptions-item label="目标类型">
          <el-tag v-if="detailData.goalType === 1" type="primary">OKR</el-tag>
          <el-tag v-else type="success">KPI</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="目标标题" :span="2">{{ detailData.goalTitle }}</el-descriptions-item>
        <el-descriptions-item label="目标描述" :span="2">{{ detailData.goalDescription }}</el-descriptions-item>
        <el-descriptions-item label="权重">{{ detailData.weight }}%</el-descriptions-item>
        <el-descriptions-item label="目标值">{{ detailData.targetValue }}</el-descriptions-item>
        <el-descriptions-item label="当前值">{{ detailData.currentValue }}</el-descriptions-item>
        <el-descriptions-item label="进度">
          <el-progress :percentage="detailData.progress || 0" :color="getProgressColor(detailData.progress || 0)" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 0" type="info">未开始</el-tag>
          <el-tag v-else-if="detailData.status === 1" type="warning">进行中</el-tag>
          <el-tag v-else type="success">已完成</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getList, addItem, updateItem, deleteItem } from '@/api/performanceGoal'
import type { PerformanceGoal, PerformanceGoalListParams } from '@/types/performance'

defineOptions({
  name: 'PerformanceGoal'
})

// 查询参数
const queryParams = reactive<PerformanceGoalListParams>({
  employeeName: '',
  departmentId: null,
  performancePeriod: '',
  goalType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PerformanceGoal[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增目标')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<PerformanceGoal>>({
  employeeId: undefined,
  performancePeriod: '',
  goalType: 1,
  goalTitle: '',
  goalDescription: '',
  weight: undefined,
  targetValue: ''
})

const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  performancePeriod: [{ required: true, message: '请选择绩效周期', trigger: 'change' }],
  goalType: [{ required: true, message: '请选择目标类型', trigger: 'change' }],
  goalTitle: [{ required: true, message: '请输入目标标题', trigger: 'blur' }],
  weight: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { pattern: /^(100|[1-9]?\d)$/, message: '权重必须在0-100之间', trigger: 'blur' }
  ],
  targetValue: [{ required: true, message: '请输入目标值', trigger: 'blur' }]
}

// 更新进度弹窗
const progressDialogVisible = ref(false)
const progressFormRef = ref<FormInstance>()
const progressFormData = reactive({
  id: 0,
  currentValue: '',
  progressNote: ''
})

const progressFormRules: FormRules = {
  currentValue: [{ required: true, message: '请输入当前值', trigger: 'blur' }]
}

// 详情弹窗
const detailDialogVisible = ref(false)
const detailData = ref<PerformanceGoal>({} as PerformanceGoal)

// 获取列表
const fetchList = async () => {
  try {
    const res = await getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchList()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentId = null
  queryParams.performancePeriod = ''
  queryParams.goalType = null
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchList()
}

// 表格选择
const handleSelectionChange = (selection: PerformanceGoal[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增目标'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: PerformanceGoal) => {
  dialogTitle.value = '编辑目标'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: PerformanceGoal) => {
  try {
    await ElMessageBox.confirm('确定要删除该目标吗？', '提示', {
      type: 'warning'
    })
    await deleteItem(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条目标吗？`, '提示', {
      type: 'warning'
    })
    // 这里应该调用批量删除接口，暂时循环调用单个删除
    for (const id of selectedIds.value) {
      await deleteItem(id)
    }
    ElMessage.success('批量删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 更新进度
const handleUpdateProgress = (row: PerformanceGoal) => {
  progressFormData.id = row.id
  progressFormData.currentValue = row.currentValue || ''
  progressFormData.progressNote = ''
  progressDialogVisible.value = true
}

// 查看详情
const handleViewDetail = (row: PerformanceGoal) => {
  detailData.value = { ...row }
  detailDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateItem(formData as PerformanceGoal)
          ElMessage.success('更新成功')
        } else {
          await addItem(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

// 提交进度更新
const handleProgressSubmit = async () => {
  if (!progressFormRef.value) return

  await progressFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateItem({
          id: progressFormData.id,
          currentValue: progressFormData.currentValue
        } as PerformanceGoal)
        ElMessage.success('进度更新成功')
        progressDialogVisible.value = false
        fetchList()
      } catch (error) {
        ElMessage.error('进度更新失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    employeeId: undefined,
    performancePeriod: '',
    goalType: 1,
    goalTitle: '',
    goalDescription: '',
    weight: undefined,
    targetValue: ''
  })
}

// 关闭进度弹窗
const handleProgressDialogClose = () => {
  progressFormRef.value?.resetFields()
  progressFormData.id = 0
  progressFormData.currentValue = ''
  progressFormData.progressNote = ''
}

// 获取进度颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.performance-goal-page {
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
