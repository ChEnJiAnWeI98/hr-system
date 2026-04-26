<template>
  <div class="page-container">
    <!-- 标签页 -->
    <el-card class="tabs-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <!-- 标签页1：试用期员工 -->
        <el-tab-pane label="试用期员工" name="probation">
          <!-- 筛选卡片 -->
          <el-card class="filter-card">
            <el-form :model="probationQuery">
              <div class="filter-form-content">
                <el-form-item label="员工姓名/工号">
                  <el-input
                    v-model="probationQuery.keyword"
                    placeholder="请输入员工姓名或工号"
                    clearable
                    style="width: 200px"
                  />
                </el-form-item>

                <el-form-item label="所属部门">
                  <el-tree-select
                    v-model="probationQuery.departmentId"
                    :data="departmentTree"
                    :props="{ label: 'name', children: 'children' }"
                    placeholder="请选择部门"
                    clearable
                    check-strictly
                    style="width: 150px"
                  />
                </el-form-item>

                <el-form-item label="状态">
                  <el-select
                    v-model="probationQuery.status"
                    placeholder="请选择状态"
                    clearable
                    style="width: 120px"
                  >
                    <el-option label="试用中" :value="0" />
                    <el-option label="已转正" :value="1" />
                    <el-option label="延长试用" :value="2" />
                    <el-option label="不合格" :value="3" />
                  </el-select>
                </el-form-item>

                <el-form-item label="试用期结束日期">
                  <el-date-picker
                    v-model="probationEndDateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 220px"
                  />
                </el-form-item>

                <el-form-item label=" ">
                  <div class="filter-buttons">
                    <el-button type="primary" @click="handleProbationSearch">
                      搜索
                    </el-button>
                    <el-button @click="handleProbationReset">
                      重置
                    </el-button>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>

          <!-- 数据卡片 -->
          <el-card class="data-card">
            <template #header>
              <div class="table-header">
                <div class="header-buttons">
                  <el-button type="primary" @click="handleCreate">
                    <el-icon><Plus /></el-icon>
                    新增
                  </el-button>
                  <el-button type="danger" @click="handleBatchDelete">
                    批量删除
                  </el-button>
                  <el-button @click="handleExport">
                    导出
                  </el-button>
                </div>
              </div>
            </template>

            <div class="table-container">
              <el-table
                v-loading="loading"
                :data="probationList"
                height="100%"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" min-width="5%" />
                <el-table-column prop="employeeCode" label="员工工号" min-width="9%" />
                <el-table-column prop="employeeName" label="员工姓名" min-width="9%" />
                <el-table-column prop="departmentName" label="所属部门" min-width="11%" />
                <el-table-column prop="positionName" label="岗位" min-width="10%" />
                <el-table-column prop="entryDate" label="入职日期" min-width="9%" />
                <el-table-column prop="regularDate" label="转正日期" min-width="9%" />
                <el-table-column prop="probationMonths" label="试用期月数" min-width="9%" />
                <el-table-column label="状态" min-width="8%">
                  <template #default="{ row }">
                    <el-tag v-if="row.status === 0" type="primary">试用中</el-tag>
                    <el-tag v-else-if="row.status === 1" type="success">已转正</el-tag>
                    <el-tag v-else-if="row.status === 2" type="warning">延长试用</el-tag>
                    <el-tag v-else-if="row.status === 3" type="danger">不合格</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="19%" fixed="right">
                  <template #default="{ row }">
                    <el-button link @click="handleEdit(row)">
                      编辑
                    </el-button>
                    <el-button link type="danger" @click="handleDelete(row)">
                      删除
                    </el-button>
                    <el-button link type="primary" @click="handleEvaluate(row)">
                      转正评估
                    </el-button>
                    <el-button link type="warning" @click="handleExtend(row)">
                      延长试用期
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-pagination
              v-model:current-page="probationQuery.page"
              v-model:page-size="probationQuery.pageSize"
              :total="probationTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleProbationSearch"
              @current-change="handleProbationSearch"
            />
          </el-card>
        </el-tab-pane>

        <!-- 标签页2：转正评估 -->
        <el-tab-pane label="转正评估" name="evaluation">
          <!-- 筛选卡片 -->
          <el-card class="filter-card">
            <el-form :model="evaluationQuery">
              <div class="filter-form-content">
                <el-form-item label="员工姓名/工号">
                  <el-input
                    v-model="evaluationQuery.keyword"
                    placeholder="请输入员工姓名或工号"
                    clearable
                    style="width: 200px"
                  />
                </el-form-item>

                <el-form-item label="评估结果">
                  <el-select
                    v-model="evaluationQuery.result"
                    placeholder="请选择评估结果"
                    clearable
                    style="width: 120px"
                  >
                    <el-option label="优秀" :value="1" />
                    <el-option label="良好" :value="2" />
                    <el-option label="合格" :value="3" />
                    <el-option label="不合格" :value="4" />
                  </el-select>
                </el-form-item>

                <el-form-item label="评估日期">
                  <el-date-picker
                    v-model="evaluationDateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 220px"
                  />
                </el-form-item>

                <el-form-item label=" ">
                  <div class="filter-buttons">
                    <el-button type="primary" @click="handleEvaluationSearch">
                      搜索
                    </el-button>
                    <el-button @click="handleEvaluationReset">
                      重置
                    </el-button>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>

          <!-- 数据卡片 -->
          <el-card class="data-card">
            <template #header>
              <div class="table-header">
                <div class="header-buttons">
                  <el-button type="primary" @click="handleCreateEvaluation">
                    <el-icon><Plus /></el-icon>
                    新增评估
                  </el-button>
                  <el-button @click="handleExportEvaluation">
                    导出
                  </el-button>
                </div>
              </div>
            </template>

            <div class="table-container">
              <el-table
                :data="evaluationList"
                height="100%"
              >
                <el-table-column prop="evaluationNo" label="评估编号" min-width="9%" />
                <el-table-column prop="employeeNo" label="员工工号" min-width="10%" />
                <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
                <el-table-column prop="evaluationDate" label="评估日期" min-width="10%" />
                <el-table-column prop="workAbilityScore" label="工作能力评分" min-width="10%" />
                <el-table-column prop="workAttitudeScore" label="工作态度评分" min-width="10%" />
                <el-table-column prop="teamworkScore" label="团队协作评分" min-width="10%" />
                <el-table-column prop="totalScore" label="综合评分" min-width="8%" />
                <el-table-column label="评估结果" min-width="8%">
                  <template #default="{ row }">
                    <el-tag v-if="row.result === 1" type="success">优秀</el-tag>
                    <el-tag v-else-if="row.result === 2" type="primary">良好</el-tag>
                    <el-tag v-else-if="row.result === 3" type="warning">合格</el-tag>
                    <el-tag v-else-if="row.result === 4" type="danger">不合格</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="12%" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" @click="handleViewEvaluation(row)">
                      查看详情
                    </el-button>
                    <el-button link type="danger" @click="handleDeleteEvaluation(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-pagination
              v-model:current-page="evaluationQuery.page"
              v-model:page-size="evaluationQuery.pageSize"
              :total="evaluationTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleEvaluationSearch"
              @current-change="handleEvaluationSearch"
            />
          </el-card>
        </el-tab-pane>

        <!-- 标签页3：试用期延长 -->
        <el-tab-pane label="试用期延长" name="extension">
          <!-- 筛选卡片 -->
          <el-card class="filter-card">
            <el-form :model="extensionQuery">
              <div class="filter-form-content">
                <el-form-item label="员工姓名/工号">
                  <el-input
                    v-model="extensionQuery.keyword"
                    placeholder="请输入员工姓名或工号"
                    clearable
                    style="width: 200px"
                  />
                </el-form-item>

                <el-form-item label="延长日期">
                  <el-date-picker
                    v-model="extensionDateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 220px"
                  />
                </el-form-item>

                <el-form-item label=" ">
                  <div class="filter-buttons">
                    <el-button type="primary" @click="handleExtensionSearch">
                      搜索
                    </el-button>
                    <el-button @click="handleExtensionReset">
                      重置
                    </el-button>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>

          <!-- 数据卡片 -->
          <el-card class="data-card">
            <template #header>
              <div class="table-header">
                <div class="header-buttons">
                  <el-button type="primary" @click="handleCreateExtension">
                    <el-icon><Plus /></el-icon>
                    新增延长
                  </el-button>
                  <el-button @click="handleExportExtension">
                    导出
                  </el-button>
                </div>
              </div>
            </template>

            <div class="table-container">
              <el-table
                :data="extensionList"
                height="100%"
              >
                <el-table-column prop="extensionNo" label="延长编号" min-width="9%" />
                <el-table-column prop="employeeNo" label="员工工号" min-width="10%" />
                <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
                <el-table-column prop="originalEndDate" label="原结束日期" min-width="10%" />
                <el-table-column prop="newEndDate" label="新结束日期" min-width="10%" />
                <el-table-column prop="extensionMonths" label="延长月数" min-width="8%" />
                <el-table-column prop="reason" label="延长原因" min-width="15%" show-overflow-tooltip />
                <el-table-column prop="approverName" label="审批人" min-width="8%" />
                <el-table-column prop="approvalDate" label="审批日期" min-width="10%" />
                <el-table-column label="操作" min-width="12%" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" @click="handleViewExtension(row)">
                      查看详情
                    </el-button>
                    <el-button link type="danger" @click="handleDeleteExtension(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-pagination
              v-model:current-page="extensionQuery.page"
              v-model:page-size="extensionQuery.pageSize"
              :total="extensionTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleExtensionSearch"
              @current-change="handleExtensionSearch"
            />
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProbationList, deleteProbation } from '@/api/probation'
import { getDepartmentTree } from '@/api/department'

defineOptions({
  name: 'EmployeeProbation'
})

const router = useRouter()

// 加载状态
const loading = ref(false)

// 标签页
const activeTab = ref('probation')

// 部门树数据
const departmentTree = ref<any[]>([])

// 选中的行
const selectedRows = ref<any[]>([])

// 加载部门树
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree()
    departmentTree.value = res.data.list || []
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// ==================== 试用期员工 ====================
const probationQuery = ref({
  keyword: '',
  departmentId: null,
  status: null,
  page: 1,
  pageSize: 10
})

const probationEndDateRange = ref<[string, string] | null>(null)
const probationList = ref<any[]>([
  {
    id: 1,
    employeeNo: 'E001',
    employeeName: '张三',
    departmentName: '技术部-前端组',
    positionName: '前端工程师',
    joinDate: '2024-01-15',
    probationStartDate: '2024-01-15',
    probationEndDate: '2024-04-15',
    probationMonths: 3,
    status: 1
  },
  {
    id: 2,
    employeeNo: 'E002',
    employeeName: '李四',
    departmentName: '技术部-后端组',
    positionName: '后端工程师',
    joinDate: '2024-02-01',
    probationStartDate: '2024-02-01',
    probationEndDate: '2024-05-01',
    probationMonths: 3,
    status: 2
  },
  {
    id: 3,
    employeeNo: 'E003',
    employeeName: '王五',
    departmentName: '产品部-产品组',
    positionName: '产品经理',
    joinDate: '2023-12-01',
    probationStartDate: '2023-12-01',
    probationEndDate: '2024-03-01',
    probationMonths: 3,
    status: 3
  }
])
const probationTotal = ref(3)

const handleProbationSearch = async () => {
  try {
    loading.value = true
    const params: any = {
      page: probationQuery.value.page,
      pageSize: probationQuery.value.pageSize
    }

    if (probationQuery.value.keyword) {
      params.employeeName = probationQuery.value.keyword
      params.employeeCode = probationQuery.value.keyword
    }
    if (probationQuery.value.departmentId) {
      params.departmentId = probationQuery.value.departmentId
    }
    if (probationQuery.value.status !== null && probationQuery.value.status !== undefined) {
      params.status = probationQuery.value.status
    }
    if (probationEndDateRange.value && probationEndDateRange.value.length === 2) {
      params.regularDateStart = probationEndDateRange.value[0]
      params.regularDateEnd = probationEndDateRange.value[1]
    }

    const res = await getProbationList(params)
    if (res.code === 200) {
      probationList.value = res.data.list
      probationTotal.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleProbationReset = () => {
  probationQuery.value = {
    keyword: '',
    departmentId: null,
    status: null,
    page: 1,
    pageSize: 10
  }
  probationEndDateRange.value = null
  handleProbationSearch()
}

const handleCreate = () => {
  router.push('/employee/probation/create/new')
}

const handleEdit = (row: any) => {
  router.push(`/employee/probation/edit/${row.id}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该试用期员工吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteProbation(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      handleProbationSearch()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    for (const row of selectedRows.value) {
      await deleteProbation((row as any).id)
    }

    ElMessage.success('批量删除成功')
    selectedRows.value = []
    handleProbationSearch()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleEvaluate = (row: any) => {
  router.push(`/employee/probation/evaluate/${row.id}`)
}

const handleExtend = (row: any) => {
  router.push(`/employee/probation/extend/${row.id}`)
}

// ==================== 转正评估 ====================
const evaluationQuery = ref({
  keyword: '',
  result: null,
  page: 1,
  pageSize: 10
})

const evaluationDateRange = ref<[string, string] | null>(null)
const evaluationList = ref([
  {
    id: 1,
    evaluationNo: 'EV20240315001',
    employeeNo: 'E003',
    employeeName: '王五',
    evaluationDate: '2024-03-01',
    workAbilityScore: 90,
    workAttitudeScore: 88,
    teamworkScore: 92,
    totalScore: 90,
    result: 1
  },
  {
    id: 2,
    evaluationNo: 'EV20240320001',
    employeeNo: 'E004',
    employeeName: '赵六',
    evaluationDate: '2024-03-20',
    workAbilityScore: 85,
    workAttitudeScore: 82,
    teamworkScore: 88,
    totalScore: 85,
    result: 2
  }
])
const evaluationTotal = ref(2)

const handleEvaluationSearch = () => {
  console.log('搜索转正评估', evaluationQuery.value, evaluationDateRange.value)
}

const handleEvaluationReset = () => {
  evaluationQuery.value = {
    keyword: '',
    result: null,
    page: 1,
    pageSize: 10
  }
  evaluationDateRange.value = null
  handleEvaluationSearch()
}

const handleCreateEvaluation = () => {
  router.push('/employee/probation/evaluate/new')
}

const handleViewEvaluation = (row: any) => {
  router.push(`/employee/probation/evaluation/detail/${row.id}`)
}

const handleDeleteEvaluation = (row: any) => {
  ElMessageBox.confirm('确定要删除该评估记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    handleEvaluationSearch()
  })
}

const handleExportEvaluation = () => {
  ElMessage.success('导出成功')
}

// ==================== 试用期延长 ====================
const extensionQuery = ref({
  keyword: '',
  page: 1,
  pageSize: 10
})

const extensionDateRange = ref<[string, string] | null>(null)
const extensionList = ref([
  {
    id: 1,
    extensionNo: 'EX20240310001',
    employeeNo: 'E005',
    employeeName: '孙七',
    originalEndDate: '2024-03-15',
    newEndDate: '2024-05-15',
    extensionMonths: 2,
    reason: '工作表现需要进一步观察，延长试用期以便更全面评估',
    approverName: '张经理',
    approvalDate: '2024-03-10'
  },
  {
    id: 2,
    extensionNo: 'EX20240325001',
    employeeNo: 'E006',
    employeeName: '周八',
    originalEndDate: '2024-04-01',
    newEndDate: '2024-05-01',
    extensionMonths: 1,
    reason: '项目经验不足，需要更多时间适应岗位要求',
    approverName: '李总监',
    approvalDate: '2024-03-25'
  }
])
const extensionTotal = ref(2)

const handleExtensionSearch = () => {
  console.log('搜索试用期延长', extensionQuery.value, extensionDateRange.value)
}

const handleExtensionReset = () => {
  extensionQuery.value = {
    keyword: '',
    page: 1,
    pageSize: 10
  }
  extensionDateRange.value = null
  handleExtensionSearch()
}

const handleCreateExtension = () => {
  router.push('/employee/probation/extend/new')
}

const handleViewExtension = (row: any) => {
  router.push(`/employee/probation/extension/detail/${row.id}`)
}

const handleDeleteExtension = (row: any) => {
  ElMessageBox.confirm('确定要删除该延长记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    handleExtensionSearch()
  })
}

const handleExportExtension = () => {
  ElMessage.success('导出成功')
}

// 标签页切换
const handleTabChange = (tabName: string) => {
  console.log('切换标签页', tabName)
}

onMounted(async () => {
  await loadDepartmentTree()
  handleProbationSearch()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs-card {
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

  :deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
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
    display: flex;
    justify-content: space-between;
    align-items: center;

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
