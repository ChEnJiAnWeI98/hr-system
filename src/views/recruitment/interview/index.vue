<template>
  <div class="interview-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="面试编号">
            <el-input v-model="queryParams.interviewNo" placeholder="请输入面试编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="候选人姓名">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="应聘岗位">
            <el-input v-model="queryParams.position" placeholder="请输入应聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="面试类型">
            <el-select v-model="queryParams.interviewType" placeholder="请选择面试类型" style="width: 150px" clearable>
              <el-option label="初试" :value="1" />
              <el-option label="复试" :value="2" />
              <el-option label="终试" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="待面试" :value="1" />
              <el-option label="已完成" :value="2" />
              <el-option label="已取消" :value="3" />
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
            安排面试
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
          <el-table-column prop="interviewNo" label="面试编号" min-width="10%" />
          <el-table-column prop="candidateName" label="候选人姓名" min-width="10%" />
          <el-table-column prop="position" label="应聘岗位" min-width="10%" />
          <el-table-column prop="round" label="面试轮次" min-width="8%">
            <template #default="{ row }">
              第{{ row.round }}轮
            </template>
          </el-table-column>
          <el-table-column prop="interviewType" label="面试类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.interviewType === 1" type="primary">初试</el-tag>
              <el-tag v-else-if="row.interviewType === 2" type="success">复试</el-tag>
              <el-tag v-else-if="row.interviewType === 3" type="warning">终试</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="interviewTime" label="面试时间" min-width="12%" />
          <el-table-column prop="interviewer" label="面试官" min-width="10%" />
          <el-table-column prop="location" label="面试地点" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待面试</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已完成</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="primary" :disabled="row.status !== 1" @click="handleEvaluate(row)">
                填写评价
              </el-button>
              <el-button link type="danger" :disabled="row.status !== 1" @click="handleCancel(row)">
                取消面试
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 安排面试弹窗 -->
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
        <el-form-item label="候选人姓名" prop="candidateName">
          <el-input v-model="formData.candidateName" placeholder="请输入候选人姓名" />
        </el-form-item>

        <el-form-item label="应聘岗位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入应聘岗位" />
        </el-form-item>

        <el-form-item label="面试轮次" prop="round">
          <el-input v-model.number="formData.round" placeholder="请输入面试轮次" />
        </el-form-item>

        <el-form-item label="面试类型" prop="interviewType">
          <el-select v-model="formData.interviewType" placeholder="请选择面试类型" style="width: 100%">
            <el-option label="初试" :value="1" />
            <el-option label="复试" :value="2" />
            <el-option label="终试" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="面试时间" prop="interviewTime">
          <el-date-picker
            v-model="formData.interviewTime"
            type="datetime"
            placeholder="请选择面试时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="面试官" prop="interviewer">
          <el-input v-model="formData.interviewer" placeholder="请输入面试官" />
        </el-form-item>

        <el-form-item label="面试地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入面试地点" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 填写评价弹窗 -->
    <el-dialog
      v-model="evaluateDialogVisible"
      title="填写评价"
      width="600px"
      @close="handleEvaluateDialogClose"
    >
      <el-form
        ref="evaluateFormRef"
        :model="evaluateFormData"
        :rules="evaluateFormRules"
        label-width="100px"
      >
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="evaluateFormData.rating" :max="5" show-score />
        </el-form-item>

        <el-form-item label="评价内容" prop="evaluation">
          <el-input
            v-model="evaluateFormData.evaluation"
            type="textarea"
            :rows="5"
            placeholder="请输入评价内容"
          />
        </el-form-item>

        <el-form-item label="面试结果" prop="result">
          <el-select v-model="evaluateFormData.result" placeholder="请选择面试结果" style="width: 100%">
            <el-option label="通过" :value="1" />
            <el-option label="不通过" :value="2" />
            <el-option label="待定" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="evaluateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEvaluateSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="面试详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="面试编号">{{ detailData.interviewNo }}</el-descriptions-item>
        <el-descriptions-item label="候选人姓名">{{ detailData.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="应聘岗位">{{ detailData.position }}</el-descriptions-item>
        <el-descriptions-item label="面试轮次">第{{ detailData.round }}轮</el-descriptions-item>
        <el-descriptions-item label="面试类型">
          <el-tag v-if="detailData.interviewType === 1" type="primary">初试</el-tag>
          <el-tag v-else-if="detailData.interviewType === 2" type="success">复试</el-tag>
          <el-tag v-else-if="detailData.interviewType === 3" type="warning">终试</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="面试时间">{{ detailData.interviewTime }}</el-descriptions-item>
        <el-descriptions-item label="面试官">{{ detailData.interviewer }}</el-descriptions-item>
        <el-descriptions-item label="面试地点">{{ detailData.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待面试</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已完成</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="info">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评分" v-if="detailData.rating">
          <el-rate v-model="detailData.rating" :max="5" disabled show-score />
        </el-descriptions-item>
        <el-descriptions-item label="评价内容" :span="2" v-if="detailData.evaluation">
          {{ detailData.evaluation }}
        </el-descriptions-item>
        <el-descriptions-item label="面试结果" v-if="detailData.result">
          <el-tag v-if="detailData.result === 1" type="success">通过</el-tag>
          <el-tag v-else-if="detailData.result === 2" type="danger">不通过</el-tag>
          <el-tag v-else-if="detailData.result === 3" type="warning">待定</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Interview, InterviewListParams } from '@/types/recruitment'
import {
  getInterviewList,
  addInterview,
  updateInterview,
  batchDeleteInterview,
  cancelInterview,
  evaluateInterview
} from '@/api/recruitment/interview'

defineOptions({
  name: 'RecruitmentInterview'
})

// 查询参数
const queryParams = reactive<InterviewListParams>({
  interviewNo: '',
  candidateName: '',
  position: '',
  interviewType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Interview[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('安排面试')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<Interview>>({
  candidateName: '',
  position: '',
  round: 1,
  interviewType: 1,
  interviewTime: '',
  interviewer: '',
  location: ''
})

const formRules: FormRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入应聘岗位', trigger: 'blur' }],
  round: [{ required: true, message: '请输入面试轮次', trigger: 'blur' }],
  interviewType: [{ required: true, message: '请选择面试类型', trigger: 'change' }],
  interviewTime: [{ required: true, message: '请选择面试时间', trigger: 'change' }],
  interviewer: [{ required: true, message: '请输入面试官', trigger: 'blur' }],
  location: [{ required: true, message: '请输入面试地点', trigger: 'blur' }]
}

// 评价弹窗相关
const evaluateDialogVisible = ref(false)
const evaluateFormRef = ref<FormInstance>()
const evaluateFormData = reactive({
  id: 0,
  rating: 0,
  evaluation: '',
  result: 1
})

const evaluateFormRules: FormRules = {
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
  evaluation: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
  result: [{ required: true, message: '请选择面试结果', trigger: 'change' }]
}

// 详情弹窗相关
const detailDialogVisible = ref(false)
const detailData = ref<Interview>({} as Interview)

// 获取列表数据
const getList = async () => {
  try {
    const res = await getInterviewList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取面试列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.interviewNo = ''
  queryParams.candidateName = ''
  queryParams.position = ''
  queryParams.interviewType = null
  queryParams.status = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 表格选择
const handleSelectionChange = (selection: Interview[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '安排面试'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateInterview(formData)
          ElMessage.success('更新成功')
        } else {
          await addInterview(formData)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.candidateName = ''
  formData.position = ''
  formData.round = 1
  formData.interviewType = 1
  formData.interviewTime = ''
  formData.interviewer = ''
  formData.location = ''
}

// 批量删除
const handleBatchDelete = async () => {
  ElMessageBox.confirm('确定要删除选中的面试记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteInterview(selectedIds.value)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 查看详情
const handleView = (row: Interview) => {
  detailData.value = { ...row }
  detailDialogVisible.value = true
}

// 填写评价
const handleEvaluate = (row: Interview) => {
  evaluateFormData.id = row.id
  evaluateFormData.rating = row.rating || 0
  evaluateFormData.evaluation = row.evaluation || ''
  evaluateFormData.result = row.result || 1
  evaluateDialogVisible.value = true
}

// 提交评价
const handleEvaluateSubmit = async () => {
  if (!evaluateFormRef.value) return

  await evaluateFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await evaluateInterview(evaluateFormData)
        ElMessage.success('评价成功')
        evaluateDialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error('评价失败')
      }
    }
  })
}

// 关闭评价弹窗
const handleEvaluateDialogClose = () => {
  evaluateFormRef.value?.resetFields()
  evaluateFormData.id = 0
  evaluateFormData.rating = 0
  evaluateFormData.evaluation = ''
  evaluateFormData.result = 1
}

// 取消面试
const handleCancel = async (row: Interview) => {
  ElMessageBox.confirm('确定要取消该面试吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await cancelInterview(row.id)
      ElMessage.success('取消成功')
      getList()
    } catch (error) {
      ElMessage.error('取消失败')
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.interview-container {
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
