<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="关键字">
            <el-input
              v-model="queryParams.keyword"
              placeholder="员工姓名/工号/异动编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="异动类型">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择异动类型"
              clearable
              style="width: 150px"
            >
              <el-option label="调岗" :value="1" />
              <el-option label="晋升" :value="2" />
              <el-option label="降职" :value="3" />
              <el-option label="调薪" :value="4" />
              <el-option label="转正" :value="5" />
              <el-option label="试用期延长" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
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
              <el-option label="已撤回" :value="5" />
              <el-option label="已生效" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="申请日期">
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

          <el-form-item label="生效日期">
            <el-date-picker
              v-model="effectiveDateRange"
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
            新增异动
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" fixed="left" />
          <el-table-column prop="transferNo" label="异动编号" min-width="12%" fixed="left" />
          <el-table-column prop="employeeNo" label="员工工号" min-width="10%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="8%" />
          <el-table-column prop="type" label="异动类型" min-width="10%">
            <template #default="{ row }">
              {{ getTransferTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="originalDepartmentName" label="原部门" min-width="12%" />
          <el-table-column prop="originalPositionName" label="原岗位" min-width="12%" />
          <el-table-column prop="newDepartmentName" label="新部门" min-width="12%" />
          <el-table-column prop="newPositionName" label="新岗位" min-width="12%" />
          <el-table-column prop="applyDate" label="申请日期" min-width="10%" />
          <el-table-column prop="effectiveDate" label="生效日期" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
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
              <el-button link type="primary" @click="handleView(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="success"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="row.status === 1 || row.status === 2"
                link
                type="warning"
                @click="handleWithdraw(row)"
              >
                撤回
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import { getTransferList, deleteTransfer, withdrawTransfer } from '@/api/transfer'
import type { TransferListParams } from '@/types/transfer'

defineOptions({
  name: 'EmployeeTransfer'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<TransferListParams>({
  keyword: '',
  type: null,
  status: null,
  applyDateStart: '',
  applyDateEnd: '',
  effectiveDateStart: '',
  effectiveDateEnd: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const applyDateRange = ref<string[]>([])
const effectiveDateRange = ref<string[]>([])

// 监听日期范围变化
watch(applyDateRange, (val) => {
  if (val && val.length === 2) {
    queryParams.applyDateStart = val[0]
    queryParams.applyDateEnd = val[1]
  } else {
    queryParams.applyDateStart = ''
    queryParams.applyDateEnd = ''
  }
})

watch(effectiveDateRange, (val) => {
  if (val && val.length === 2) {
    queryParams.effectiveDateStart = val[0]
    queryParams.effectiveDateEnd = val[1]
  } else {
    queryParams.effectiveDateStart = ''
    queryParams.effectiveDateEnd = ''
  }
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 获取异动类型文本
const getTransferTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '调岗',
    2: '晋升',
    3: '降职',
    4: '调薪',
    5: '转正',
    6: '试用期延长'
  }
  return typeMap[type] || '-'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: '待审批',
    2: '审批中',
    3: '已通过',
    4: '已拒绝',
    5: '已撤回',
    6: '已生效'
  }
  return statusMap[status] || '-'
}

// 获取状态标签类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'danger',
    5: 'info',
    6: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取列表数据
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getTransferList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.type = null
  queryParams.status = null
  applyDateRange.value = []
  effectiveDateRange.value = []
  queryParams.applyDateStart = ''
  queryParams.applyDateEnd = ''
  queryParams.effectiveDateStart = ''
  queryParams.effectiveDateEnd = ''
  queryParams.page = 1
  fetchData()
}

// 新增
const handleCreate = () => {
  router.push('/employee/transfer/create/new')
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/employee/transfer/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该异动记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteTransfer(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    for (const id of selectedIds.value) {
      await deleteTransfer(id)
    }

    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 查看详情
const handleView = (row: any) => {
  router.push(`/employee/transfer/detail/${row.id}`)
}

// 审批
const handleApprove = (row: any) => {
  router.push(`/employee/transfer/approve/${row.id}`)
}

// 撤回
const handleWithdraw = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要撤回该异动申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await withdrawTransfer(row.id)
    if (res.code === 200) {
      ElMessage.success('撤回成功')
      fetchData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '撤回失败')
    }
  }
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 初始化
onMounted(() => {
  fetchData()
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
