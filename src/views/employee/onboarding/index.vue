<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="候选人姓名">
            <el-input
              v-model="queryParams.candidateName"
              placeholder="请输入候选人姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="应聘部门">
            <el-tree-select
              v-model="queryParams.departmentId"
              :data="departmentTree"
              :props="{ label: 'name', children: 'children' }"
              placeholder="请选择部门"
              clearable
              check-strictly
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="申请状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="待审批" :value="1" />
              <el-option label="已拒绝" :value="2" />
              <el-option label="待办理" :value="3" />
              <el-option label="待入职" :value="4" />
              <el-option label="已完成" :value="5" />
              <el-option label="已撤回" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="申请时间">
            <el-date-picker
              v-model="applyDateRange"
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
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            发起入职
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
          <el-table-column type="selection" min-width="5%" fixed="left" />
          <el-table-column prop="candidateName" label="候选人姓名" min-width="9%" />
          <el-table-column prop="gender" label="性别" min-width="6%">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="10%" />
          <el-table-column prop="departmentName" label="应聘部门" min-width="10%" />
          <el-table-column prop="positionName" label="应聘岗位" min-width="11%" />
          <el-table-column prop="expectedJoinDate" label="期望入职日期" min-width="10%" />
          <el-table-column prop="status" label="申请状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.status === 2" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">待办理</el-tag>
              <el-tag v-else-if="row.status === 4" type="primary">待入职</el-tag>
              <el-tag v-else-if="row.status === 5" type="success">已完成</el-tag>
              <el-tag v-else-if="row.status === 6" type="info">已撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" min-width="12%" />
          <el-table-column label="操作" min-width="16%" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 1"
                link
                type="primary"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="row.status === 3 || row.status === 4"
                link
                type="primary"
                @click="handleProcess(row)"
              >
                办理
              </el-button>
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="warning"
                @click="handleWithdraw(row)"
              >
                撤回
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getOnboardingList, deleteOnboarding, withdrawOnboarding } from '@/api/onboarding'
import { getDepartmentTree } from '@/api/department'
import type { OnboardingApplication, OnboardingListParams } from '@/types/onboarding'
import type { Department } from '@/types/department'

defineOptions({
  name: 'OnboardingList'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<OnboardingListParams>({
  candidateName: '',
  departmentId: null,
  status: null,
  expectedDateStart: '',
  expectedDateEnd: '',
  page: 1,
  pageSize: 10
})

// 申请时间范围
const applyDateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<OnboardingApplication[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 部门树
const departmentTree = ref<Department[]>([])

// 获取部门树
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree()
    departmentTree.value = res.data.list || []
  } catch (error) {
    console.error('获取部门树失败:', error)
  }
}

// 获取列表数据
const loadTableData = async () => {
  try {
    // 处理时间范围
    if (applyDateRange.value) {
      queryParams.expectedDateStart = applyDateRange.value[0]
      queryParams.expectedDateEnd = applyDateRange.value[1]
    } else {
      queryParams.expectedDateStart = ''
      queryParams.expectedDateEnd = ''
    }

    const res = await getOnboardingList(queryParams)
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error('获取列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadTableData()
}

// 重置
const handleReset = () => {
  queryParams.candidateName = ''
  queryParams.departmentId = null
  queryParams.status = null
  applyDateRange.value = null
  queryParams.expectedDateStart = ''
  queryParams.expectedDateEnd = ''
  queryParams.page = 1
  loadTableData()
}

// 发起入职
const handleCreate = () => {
  router.push('/employee/onboarding/create/new')
}

// 审批
const handleApprove = (row: OnboardingApplication) => {
  router.push(`/employee/onboarding/approve/${row.id}`)
}

// 办理
const handleProcess = (row: OnboardingApplication) => {
  router.push(`/employee/onboarding/process/${row.id}`)
}

// 查看详情
const handleView = (row: OnboardingApplication) => {
  router.push(`/employee/onboarding/detail/${row.id}`)
}

// 撤回
const handleWithdraw = async (row: OnboardingApplication) => {
  try {
    await ElMessageBox.confirm('确认撤回该入职申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await withdrawOnboarding(row.id)
    ElMessage.success('撤回成功')
    loadTableData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
      console.error('撤回失败:', error)
    }
  }
}

// 删除
const handleDelete = async (row: OnboardingApplication) => {
  try {
    await ElMessageBox.confirm('确认删除该入职申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteOnboarding(row.id)
    ElMessage.success('删除成功')
    loadTableData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条入职申请吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 批量删除逻辑
    await Promise.all(selectedIds.value.map(id => deleteOnboarding(id)))
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadTableData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection: OnboardingApplication[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 初始化
onMounted(() => {
  loadDepartmentTree()
  loadTableData()
})
</script>

<style scoped lang="scss">
.page-container {
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
