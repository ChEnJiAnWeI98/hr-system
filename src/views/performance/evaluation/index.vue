<template>
  <div class="performance-evaluation-page">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="绩效周期">
            <el-select v-model="queryParams.cycleId" placeholder="请选择绩效周期" style="width: 180px" clearable>
              <el-option label="2024年Q1" :value="1" />
              <el-option label="2024年Q2" :value="2" />
              <el-option label="2024年Q3" :value="3" />
              <el-option label="2024年Q4" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="评级">
            <el-select v-model="queryParams.rating" placeholder="请选择评级" style="width: 120px" clearable>
              <el-option label="优秀" value="优秀" />
              <el-option label="良好" value="良好" />
              <el-option label="合格" value="合格" />
              <el-option label="待改进" value="待改进" />
            </el-select>
          </el-form-item>

          <el-form-item label="评估状态">
            <el-select v-model="queryParams.evaluationStatus" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待自评" :value="0" />
              <el-option label="待上级评" :value="1" />
              <el-option label="待360度评" :value="2" />
              <el-option label="已完成" :value="3" />
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
          <el-button type="primary" :disabled="selectedIds.length === 0" @click="handleBatchEvaluate">
            批量评估
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
          <el-table-column prop="cycleName" label="绩效周期" min-width="12%" />
          <el-table-column prop="selfScore" label="自评分" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.selfScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="managerScore" label="上级评分" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.managerScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="peerScore" label="同级评分" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.peerScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="subordinateScore" label="下级评分" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.subordinateScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="finalScore" label="最终得分" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.finalScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="评级" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.rating === '优秀'" type="success">{{ row.rating }}</el-tag>
              <el-tag v-else-if="row.rating === '良好'" type="primary">{{ row.rating }}</el-tag>
              <el-tag v-else-if="row.rating === '合格'" type="info">{{ row.rating }}</el-tag>
              <el-tag v-else-if="row.rating === '待改进'" type="warning">{{ row.rating }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="evaluationStatusName" label="评估状态" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.evaluationStatus === 0" type="info">{{ row.evaluationStatusName }}</el-tag>
              <el-tag v-else-if="row.evaluationStatus === 1" type="warning">{{ row.evaluationStatusName }}</el-tag>
              <el-tag v-else-if="row.evaluationStatus === 2" type="primary">{{ row.evaluationStatusName }}</el-tag>
              <el-tag v-else-if="row.evaluationStatus === 3" type="success">{{ row.evaluationStatusName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEvaluate(row)">
                评估
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 评估弹窗 -->
    <el-dialog
      v-model="evaluateDialogVisible"
      :title="evaluateDialogTitle"
      width="600px"
      @close="handleEvaluateDialogClose"
    >
      <el-form :model="evaluateForm" label-width="100px">
        <el-form-item label="员工姓名">
          <el-input v-model="evaluateForm.employeeName" disabled />
        </el-form-item>

        <el-form-item label="部门">
          <el-input v-model="evaluateForm.departmentName" disabled />
        </el-form-item>

        <el-form-item label="绩效周期">
          <el-input v-model="evaluateForm.cycleName" disabled />
        </el-form-item>

        <el-form-item label="自评分">
          <el-input v-model="evaluateForm.selfScore" placeholder="请输入自评分（0-100）" />
        </el-form-item>

        <el-form-item label="上级评分">
          <el-input v-model="evaluateForm.managerScore" placeholder="请输入上级评分（0-100）" />
        </el-form-item>

        <el-form-item label="同级评分">
          <el-input v-model="evaluateForm.peerScore" placeholder="请输入同级评分（0-100）" />
        </el-form-item>

        <el-form-item label="下级评分">
          <el-input v-model="evaluateForm.subordinateScore" placeholder="请输入下级评分（0-100）" />
        </el-form-item>

        <el-form-item label="最终得分">
          <el-input v-model="evaluateForm.finalScore" placeholder="请输入最终得分（0-100）" />
        </el-form-item>

        <el-form-item label="评级">
          <el-select v-model="evaluateForm.rating" placeholder="请选择评级" style="width: 100%">
            <el-option label="优秀" value="优秀" />
            <el-option label="良好" value="良好" />
            <el-option label="合格" value="合格" />
            <el-option label="待改进" value="待改进" />
          </el-select>
        </el-form-item>

        <el-form-item label="评语">
          <el-input
            v-model="evaluateForm.comments"
            type="textarea"
            :rows="4"
            placeholder="请输入评语"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="evaluateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEvaluateSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="评估详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="绩效周期">{{ detailData.cycleName }}</el-descriptions-item>
        <el-descriptions-item label="评估状态">{{ detailData.evaluationStatusName }}</el-descriptions-item>
        <el-descriptions-item label="自评分">{{ detailData.selfScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="上级评分">{{ detailData.managerScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="同级评分">{{ detailData.peerScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="下级评分">{{ detailData.subordinateScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最终得分">{{ detailData.finalScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="评级">
          <el-tag v-if="detailData.rating === '优秀'" type="success">{{ detailData.rating }}</el-tag>
          <el-tag v-else-if="detailData.rating === '良好'" type="primary">{{ detailData.rating }}</el-tag>
          <el-tag v-else-if="detailData.rating === '合格'" type="info">{{ detailData.rating }}</el-tag>
          <el-tag v-else-if="detailData.rating === '待改进'" type="warning">{{ detailData.rating }}</el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="评语" :span="2">{{ detailData.comments || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPerformanceEvaluationList,
  getPerformanceEvaluationDetail,
  updatePerformanceEvaluation
} from '@/api/performanceEvaluation'
import type { PerformanceEvaluation, PerformanceEvaluationListParams } from '@/types/performanceEvaluation'

defineOptions({
  name: 'PerformanceEvaluation'
})

// 查询参数
const queryParams = reactive<PerformanceEvaluationListParams>({
  employeeName: '',
  departmentName: '',
  cycleId: null,
  rating: '',
  evaluationStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PerformanceEvaluation[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 评估弹窗
const evaluateDialogVisible = ref(false)
const evaluateDialogTitle = ref('评估')
const evaluateForm = reactive<Partial<PerformanceEvaluation>>({
  id: 0,
  employeeName: '',
  departmentName: '',
  cycleName: '',
  selfScore: 0,
  managerScore: 0,
  peerScore: 0,
  subordinateScore: 0,
  finalScore: 0,
  rating: '',
  comments: ''
})

// 详情弹窗
const detailDialogVisible = ref(false)
const detailData = ref<Partial<PerformanceEvaluation>>({})

// 获取列表
const fetchList = async () => {
  try {
    const res = await getPerformanceEvaluationList(queryParams)
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
  fetchList()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.cycleId = null
  queryParams.rating = ''
  queryParams.evaluationStatus = null
  queryParams.page = 1
  fetchList()
}

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  fetchList()
}

const handleCurrentChange = (page: number) => {
  queryParams.page = page
  fetchList()
}

// 表格选择
const handleSelectionChange = (selection: PerformanceEvaluation[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 评估
const handleEvaluate = async (row: PerformanceEvaluation) => {
  try {
    const res = await getPerformanceEvaluationDetail(row.id)
    if (res.code === 200) {
      Object.assign(evaluateForm, res.data)
      evaluateDialogTitle.value = '评估'
      evaluateDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 批量评估
const handleBatchEvaluate = () => {
  ElMessage.info('批量评估功能开发中')
}

// 评估提交
const handleEvaluateSubmit = async () => {
  try {
    const res = await updatePerformanceEvaluation(evaluateForm as PerformanceEvaluation)
    if (res.code === 200) {
      ElMessage.success('评估成功')
      evaluateDialogVisible.value = false
      fetchList()
    }
  } catch (error) {
    ElMessage.error('评估失败')
  }
}

// 评估弹窗关闭
const handleEvaluateDialogClose = () => {
  Object.assign(evaluateForm, {
    id: 0,
    employeeName: '',
    departmentName: '',
    cycleName: '',
    selfScore: 0,
    managerScore: 0,
    peerScore: 0,
    subordinateScore: 0,
    finalScore: 0,
    rating: '',
    comments: ''
  })
}

// 查看详情
const handleViewDetail = async (row: PerformanceEvaluation) => {
  try {
    const res = await getPerformanceEvaluationDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.performance-evaluation-page {
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
