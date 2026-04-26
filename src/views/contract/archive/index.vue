<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="请输入员工姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="工号">
            <el-input
              v-model="queryParams.employeeNo"
              placeholder="请输入工号"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="合同类型">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择合同类型"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="劳动合同" :value="1" />
              <el-option label="保密协议" :value="2" />
              <el-option label="竞业限制协议" :value="3" />
              <el-option label="培训协议" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="归档日期">
            <el-date-picker
              v-model="archiveDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleDateChange"
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
      <div class="table-header">
        <el-button type="danger" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="contractNo" label="合同编号" min-width="12%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="employeeNo" label="工号" min-width="10%" />
          <el-table-column prop="department" label="部门" min-width="12%" show-overflow-tooltip />
          <el-table-column prop="type" label="合同类型" min-width="10%">
            <template #default="{ row }">
              {{ getContractTypeName(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始日期" min-width="10%" />
          <el-table-column prop="endDate" label="结束日期" min-width="10%" />
          <el-table-column prop="archiveDate" label="归档日期" min-width="10%" />
          <el-table-column prop="archiveReason" label="归档原因" min-width="12%" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看
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
import { getArchiveList, deleteArchive, batchDeleteArchive } from '@/api/contract'
import type { Contract, ContractQueryParams } from '@/types/contract'

defineOptions({
  name: 'ContractArchive'
})

const router = useRouter()

const tableData = ref<Contract[]>([])
const total = ref(0)
const archiveDateRange = ref<[Date, Date] | null>(null)
const selectedIds = ref<number[]>([])

// 查询参数
const queryParams = reactive<ContractQueryParams>({
  employeeName: '',
  employeeNo: '',
  type: null,
  status: null,
  archiveDateStart: '',
  archiveDateEnd: '',
  page: 1,
  pageSize: 10
})

// 获取合同类型名称
const getContractTypeName = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '劳动合同',
    2: '保密协议',
    3: '竞业限制协议',
    4: '培训协议',
    5: '其他'
  }
  return typeMap[type] || '-'
}

// 日期范围变化
const handleDateChange = (value: [Date, Date] | null) => {
  if (value) {
    queryParams.archiveDateStart = value[0].toISOString().split('T')[0]
    queryParams.archiveDateEnd = value[1].toISOString().split('T')[0]
  } else {
    queryParams.archiveDateStart = ''
    queryParams.archiveDateEnd = ''
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.employeeNo = ''
  queryParams.type = null
  queryParams.archiveDateStart = ''
  queryParams.archiveDateEnd = ''
  archiveDateRange.value = null
  queryParams.page = 1
  fetchData()
}

// 选择变化
const handleSelectionChange = (selection: Contract[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 查看
const handleView = (row: Contract) => {
  router.push(`/contract/list/detail/${row.id}`)
}

// 删除
const handleDelete = async (row: Contract) => {
  try {
    await ElMessageBox.confirm('确认删除该归档合同吗？删除后无法恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteArchive(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的归档合同')
    return
  }

  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条归档合同吗？删除后无法恢复。`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await batchDeleteArchive(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getArchiveList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
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

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;
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
