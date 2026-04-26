<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="实例标题">
            <el-input v-model="queryParams.title" placeholder="请输入实例标题" style="width: 250px" clearable />
          </el-form-item>

          <el-form-item label="申请人">
            <el-input v-model="queryParams.applicant" placeholder="请输入申请人" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="审批中" :value="1" />
              <el-option label="已通过" :value="2" />
              <el-option label="已驳回" :value="3" />
              <el-option label="已撤回" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="申请时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
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
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="id" label="实例ID" min-width="8%" />
          <el-table-column prop="title" label="实例标题" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="templateName" label="流程模板" min-width="12%" />
          <el-table-column prop="applicant" label="申请人" min-width="10%" />
          <el-table-column prop="currentNode" label="当前节点" min-width="12%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="info">待审批</el-tag>
              <el-tag v-else-if="row.status === 1" type="warning">审批中</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已通过</el-tag>
              <el-tag v-else-if="row.status === 3" type="danger">已驳回</el-tag>
              <el-tag v-else type="info">已撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" min-width="14%" />
          <el-table-column prop="finishTime" label="完成时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 0 || row.status === 1"
                link
                type="danger"
                @click="handleWithdraw(row)"
              >
                撤回
              </el-button>
              <el-button link @click="handleExport(row)">
                导出
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
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getInstanceList,
  withdrawInstance,
  exportInstance
} from '@/api/approval-engine'
import type { ApprovalInstance, ListParams } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalInstanceList'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ListParams>({
  title: '',
  applicant: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ApprovalInstance[]>([])
const total = ref(0)

// 获取数据
const fetchData = async () => {
  try {
    const params = { ...queryParams }
    if (dateRange.value) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }
    const res = await getInstanceList(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.title = ''
  queryParams.applicant = ''
  queryParams.status = null
  queryParams.page = 1
  dateRange.value = null
  fetchData()
}

// 查看详情
const handleView = (row: ApprovalInstance) => {
  router.push(`/approval-engine/instance/detail/${row.id}`)
}

// 撤回
const handleWithdraw = async (row: ApprovalInstance) => {
  try {
    await ElMessageBox.confirm('确定要撤回该审批实例吗？', '提示', {
      type: 'warning'
    })

    await withdrawInstance(row.id)
    ElMessage.success('撤回成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('撤回失败')
    }
  }
}

// 导出
const handleExport = async (row: ApprovalInstance) => {
  try {
    await exportInstance(row.id)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

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
