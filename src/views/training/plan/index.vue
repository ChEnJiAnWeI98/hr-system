<template>
  <div class="training-plan-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="计划编号">
            <el-input v-model="queryParams.planNo" placeholder="请输入计划编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="计划名称">
            <el-input v-model="queryParams.planName" placeholder="请输入计划名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="年度">
            <el-select v-model="queryParams.year" placeholder="请选择年度" style="width: 150px" clearable>
              <el-option label="2024" :value="2024" />
              <el-option label="2025" :value="2025" />
              <el-option label="2026" :value="2026" />
              <el-option label="2027" :value="2027" />
            </el-select>
          </el-form-item>

          <el-form-item label="培训类型">
            <el-select v-model="queryParams.trainingType" placeholder="请选择培训类型" style="width: 150px" clearable>
              <el-option label="内训" :value="1" />
              <el-option label="外训" :value="2" />
              <el-option label="混合" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="草稿" :value="1" />
              <el-option label="待审批" :value="2" />
              <el-option label="已批准" :value="3" />
              <el-option label="已拒绝" :value="4" />
              <el-option label="执行中" :value="5" />
              <el-option label="已完成" :value="6" />
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
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增计划
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
          <el-table-column prop="planNo" label="计划编号" min-width="10%" />
          <el-table-column prop="planName" label="计划名称" min-width="15%" />
          <el-table-column prop="year" label="年度" min-width="8%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="trainingType" label="培训类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.trainingType === 1" type="primary">内训</el-tag>
              <el-tag v-else-if="row.trainingType === 2" type="success">外训</el-tag>
              <el-tag v-else-if="row.trainingType === 3" type="warning">混合</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="budget" label="预算（元）" min-width="10%">
            <template #default="{ row }">
              {{ row.budget.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="info">草稿</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.status === 3" type="success">已批准</el-tag>
              <el-tag v-else-if="row.status === 4" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="row.status === 5" type="primary">执行中</el-tag>
              <el-tag v-else-if="row.status === 6" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始日期" min-width="10%" />
          <el-table-column prop="endDate" label="结束日期" min-width="10%" />
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
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="计划编号" prop="planNo">
          <el-input v-model="formData.planNo" placeholder="请输入计划编号" />
        </el-form-item>

        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="formData.planName" placeholder="请输入计划名称" />
        </el-form-item>

        <el-form-item label="年度" prop="year">
          <el-select v-model="formData.year" placeholder="请选择年度" style="width: 100%">
            <el-option label="2024" :value="2024" />
            <el-option label="2025" :value="2025" />
            <el-option label="2026" :value="2026" />
            <el-option label="2027" :value="2027" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="培训类型" prop="trainingType">
          <el-select v-model="formData.trainingType" placeholder="请选择培训类型" style="width: 100%">
            <el-option label="内训" :value="1" />
            <el-option label="外训" :value="2" />
            <el-option label="混合" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="预算（元）" prop="budget">
          <el-input v-model="formData.budget" placeholder="请输入预算" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="草稿" :value="1" />
            <el-option label="待审批" :value="2" />
            <el-option label="已批准" :value="3" />
            <el-option label="已拒绝" :value="4" />
            <el-option label="执行中" :value="5" />
            <el-option label="已完成" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="请选择结束日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="培训目标" prop="trainingGoal">
          <el-input
            v-model="formData.trainingGoal"
            type="textarea"
            :rows="3"
            placeholder="请输入培训目标"
          />
        </el-form-item>

        <el-form-item label="培训内容" prop="trainingContent">
          <el-input
            v-model="formData.trainingContent"
            type="textarea"
            :rows="3"
            placeholder="请输入培训内容"
          />
        </el-form-item>

        <el-form-item label="参与人数" prop="participantCount">
          <el-input v-model="formData.participantCount" placeholder="请输入参与人数" />
        </el-form-item>

        <el-form-item label="负责人" prop="responsibleName">
          <el-input v-model="formData.responsibleName" placeholder="请输入负责人姓名" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
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
      title="培训计划详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="计划编号">{{ detailData.planNo }}</el-descriptions-item>
        <el-descriptions-item label="计划名称">{{ detailData.planName }}</el-descriptions-item>
        <el-descriptions-item label="年度">{{ detailData.year }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="培训类型">
          <el-tag v-if="detailData.trainingType === 1" type="primary">内训</el-tag>
          <el-tag v-else-if="detailData.trainingType === 2" type="success">外训</el-tag>
          <el-tag v-else-if="detailData.trainingType === 3" type="warning">混合</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预算（元）">{{ detailData.budget?.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="info">草稿</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="success">已批准</el-tag>
          <el-tag v-else-if="detailData.status === 4" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="detailData.status === 5" type="primary">执行中</el-tag>
          <el-tag v-else-if="detailData.status === 6" type="success">已完成</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ detailData.participantCount }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ detailData.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ detailData.endDate }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ detailData.responsibleName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="培训目标" :span="2">{{ detailData.trainingGoal }}</el-descriptions-item>
        <el-descriptions-item label="培训内容" :span="2">{{ detailData.trainingContent }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { TrainingPlan, TrainingPlanListParams } from '@/types/training'
import {
  getTrainingPlanList,
  addTrainingPlan,
  updateTrainingPlan,
  removeTrainingPlan,
  batchDeleteTrainingPlan
} from '@/api/trainingPlan'

defineOptions({
  name: 'TrainingPlan'
})

// 查询参数
const queryParams = reactive<TrainingPlanListParams>({
  planNo: '',
  planName: '',
  departmentName: '',
  year: null,
  trainingType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<TrainingPlan[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<TrainingPlan>>({
  planNo: '',
  planName: '',
  year: 2026,
  departmentId: 1,
  departmentName: '',
  trainingType: 1,
  budget: 0,
  status: 1,
  startDate: '',
  endDate: '',
  trainingGoal: '',
  trainingContent: '',
  participantCount: 0,
  responsibleId: 1,
  responsibleName: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  planNo: [{ required: true, message: '请输入计划编号', trigger: 'blur' }],
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年度', trigger: 'change' }],
  departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  trainingType: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  budget: [{ required: true, message: '请输入预算', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  trainingGoal: [{ required: true, message: '请输入培训目标', trigger: 'blur' }],
  trainingContent: [{ required: true, message: '请输入培训内容', trigger: 'blur' }],
  participantCount: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
  responsibleName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<TrainingPlan>>({})

// 获取列表数据
const fetchData = async () => {
  try {
    const res = await getTrainingPlanList(queryParams)
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
  queryParams.planNo = ''
  queryParams.planName = ''
  queryParams.departmentName = ''
  queryParams.year = null
  queryParams.trainingType = null
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增培训计划'
  Object.assign(formData, {
    planNo: '',
    planName: '',
    year: 2026,
    departmentId: 1,
    departmentName: '',
    trainingType: 1,
    budget: 0,
    status: 1,
    startDate: '',
    endDate: '',
    trainingGoal: '',
    trainingContent: '',
    participantCount: 0,
    responsibleId: 1,
    responsibleName: '',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: TrainingPlan) => {
  dialogTitle.value = '编辑培训计划'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateTrainingPlan(formData as TrainingPlan)
          ElMessage.success('更新成功')
        } else {
          await addTrainingPlan(formData as TrainingPlan)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 删除
const handleDelete = async (row: TrainingPlan) => {
  try {
    await ElMessageBox.confirm('确定要删除该培训计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await removeTrainingPlan?.(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await batchDeleteTrainingPlan?.(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 查看详情
const handleView = (row: TrainingPlan) => {
  detailData.value = row
  detailVisible.value = true
}

// 表格选择变化
const handleSelectionChange = (selection: TrainingPlan[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.training-plan-container {
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
