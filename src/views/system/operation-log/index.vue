<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="操作人">
            <el-input
              v-model="queryParams.operator"
              placeholder="请输入操作人"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="模块">
            <el-input
              v-model="queryParams.module"
              placeholder="请输入模块"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="操作类型">
            <el-select
              v-model="queryParams.operationType"
              placeholder="请选择操作类型"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="登录" value="登录" />
              <el-option label="新增" value="新增" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
              <el-option label="查询" value="查询" />
              <el-option label="登出" value="登出" />
            </el-select>
          </el-form-item>

          <el-form-item label="操作结果">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择操作结果"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="成功" :value="1" />
              <el-option label="失败" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 280px"
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
              <el-button @click="handleExport">
                导出
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
          <el-table-column prop="operatorName" label="操作人" min-width="10%" />
          <el-table-column prop="module" label="模块" min-width="12%" />
          <el-table-column prop="operationType" label="操作类型" min-width="8%" />
          <el-table-column prop="operationContent" label="操作内容" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="ipAddress" label="IP地址" min-width="9%" />
          <el-table-column prop="operationTime" label="操作时间" min-width="14%" />
          <el-table-column prop="executionTime" label="执行时长" min-width="8%">
            <template #default="{ row }">
              {{ row.executionTime }}ms
            </template>
          </el-table-column>
          <el-table-column prop="operationResult" label="操作结果" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.operationResult === 1" type="success">成功</el-tag>
              <el-tag v-else type="danger">失败</el-tag>
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getList, exportLog } from '@/api/operation-log'
import type { OperationLog, ListParams } from '@/types/system'

defineOptions({
  name: 'OperationLog'
})

// 查询参数
const queryParams = reactive<ListParams>({
  operator: '',
  module: '',
  operationType: null,
  status: null,
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<OperationLog[]>([])
const total = ref(0)

// 查询
const handleSearch = async () => {
  try {
    // 处理日期范围
    if (dateRange.value) {
      queryParams.startTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      queryParams.startTime = ''
      queryParams.endTime = ''
    }

    const res = await getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

// 重置
const handleReset = () => {
  queryParams.operator = ''
  queryParams.module = ''
  queryParams.operationType = null
  queryParams.status = null
  queryParams.startTime = ''
  queryParams.endTime = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  dateRange.value = null
  handleSearch()
}

// 导出
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确认导出操作日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 处理日期范围
    const exportParams = { ...queryParams }
    if (dateRange.value) {
      exportParams.startTime = dateRange.value[0]
      exportParams.endTime = dateRange.value[1]
    }

    await exportLog(exportParams)
    ElMessage.success('导出成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导出失败')
    }
  }
}

// 初始化加载数据
handleSearch()
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
