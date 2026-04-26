<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名/工号">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入员工姓名或工号"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="所属部门">
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
              <el-option label="审批中" :value="2" />
              <el-option label="已通过" :value="3" />
              <el-option label="已拒绝" :value="4" />
              <el-option label="已完成" :value="5" />
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
            发起离职
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
          <el-table-column prop="employeeName" label="员工姓名" min-width="9%" />
          <el-table-column prop="employeeNo" label="员工工号" min-width="9%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column prop="positionName" label="岗位" min-width="10%" />
          <el-table-column prop="resignationType" label="离职类型" min-width="9%">
            <template #default="{ row }">
              {{ getResignationTypeText(row.resignationType) }}
            </template>
          </el-table-column>
          <el-table-column prop="resignationReason" label="离职原因" min-width="9%">
            <template #default="{ row }">
              {{ getResignationReasonText(row.resignationReason) }}
            </template>
          </el-table-column>
          <el-table-column prop="expectedDate" label="期望离职日期" min-width="10%" />
          <el-table-column prop="status" label="申请状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" min-width="12%" />
          <el-table-column label="操作" min-width="16%" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 1 || row.status === 2"
                link
                type="primary"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="row.status === 3"
                link
                type="success"
                @click="handleProcess(row)"
              >
                办理
              </el-button>
              <el-button
                link
                @click="handleView(row)"
              >
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
              <el-button
                link
                type="danger"
                @click="handleDelete(row)"
              >
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getResignationList, deleteResignation, withdrawResignation } from '@/api/resignation'
import { getDepartmentTree } from '@/api/department'
import type { Resignation, ResignationListParams } from '@/types/resignation'
import type { Department } from '@/types/department'

defineOptions({
  name: 'ResignationList'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ResignationListParams>({
  keyword: '',
  departmentId: null,
  status: null,
  applyTimeStart: '',
  applyTimeEnd: '',
  page: 1,
  pageSize: 10
})

// 申请时间范围
const applyDateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<Resignation[]>([])
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
const loadData = async () => {
  try {
    // 处理时间范围
    if (applyDateRange.value) {
      queryParams.applyTimeStart = applyDateRange.value[0]
      queryParams.applyTimeEnd = applyDateRange.value[1]
    } else {
      queryParams.applyTimeStart = ''
      queryParams.applyTimeEnd = ''
    }

    const res = await getResignationList(queryParams)
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.departmentId = null
  queryParams.status = null
  applyDateRange.value = null
  queryParams.applyTimeStart = ''
  queryParams.applyTimeEnd = ''
  queryParams.page = 1
  loadData()
}

// 发起离职
const handleCreate = () => {
  router.push('/employee/resignation/create/new')
}

// 审批
const handleApprove = (row: Resignation) => {
  router.push(`/employee/resignation/approve/${row.id}`)
}

// 办理
const handleProcess = (row: Resignation) => {
  router.push(`/employee/resignation/process/${row.id}`)
}

// 查看详情
const handleView = (row: Resignation) => {
  router.push(`/employee/resignation/detail/${row.id}`)
}

// 撤回
const handleWithdraw = async (row: Resignation) => {
  try {
    await ElMessageBox.confirm('确定要撤回该离职申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await withdrawResignation(row.id)
    ElMessage.success('撤回成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
    }
  }
}

// 删除
const handleDelete = async (row: Resignation) => {
  try {
    await ElMessageBox.confirm('确定要删除该离职申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteResignation(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条离职申请吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await Promise.all(selectedIds.value.map(id => deleteResignation(id)))
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection: Resignation[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: '待审批',
    2: '审批中',
    3: '已通过',
    4: '已拒绝',
    5: '已完成'
  }
  return statusMap[status] || '未知'
}

// 获取状态类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'danger',
    5: 'info'
  }
  return typeMap[status] || ''
}

// 获取离职类型文本
const getResignationTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '主动离职',
    2: '被动离职',
    3: '协商离职',
    4: '退休'
  }
  return typeMap[type] || '未知'
}

// 获取离职原因文本
const getResignationReasonText = (reason: number) => {
  const reasonMap: Record<number, string> = {
    1: '个人原因',
    2: '家庭原因',
    3: '薪资原因',
    4: '发展原因',
    5: '其他原因'
  }
  return reasonMap[reason] || '未知'
}

onMounted(() => {
  loadDepartmentTree()
  loadData()
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
