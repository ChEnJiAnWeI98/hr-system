<template>
  <div class="performance-archive-page">
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
            <el-input v-model="queryParams.cycleName" placeholder="请输入绩效周期" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="评级">
            <el-select v-model="queryParams.rating" placeholder="请选择评级" style="width: 120px" clearable>
              <el-option label="优秀" value="优秀" />
              <el-option label="良好" value="良好" />
              <el-option label="合格" value="合格" />
              <el-option label="待改进" value="待改进" />
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
          <el-button type="primary" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出档案
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="employeeCode" label="员工工号" min-width="8%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="positionName" label="岗位" min-width="10%" />
          <el-table-column prop="cycleName" label="绩效周期" min-width="12%" />
          <el-table-column prop="finalScore" label="最终得分" min-width="8%" align="right" />
          <el-table-column prop="rating" label="评级" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.rating === '优秀'" type="success">{{ row.rating }}</el-tag>
              <el-tag v-else-if="row.rating === '良好'" type="primary">{{ row.rating }}</el-tag>
              <el-tag v-else-if="row.rating === '合格'" type="info">{{ row.rating }}</el-tag>
              <el-tag v-else type="warning">{{ row.rating }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="部门排名" min-width="10%">
            <template #default="{ row }">
              {{ row.ranking }}/{{ row.totalInDepartment }}
            </template>
          </el-table-column>
          <el-table-column label="薪资调整" min-width="8%" align="right">
            <template #default="{ row }">
              <span :style="{ color: row.salaryAdjustment > 0 ? '#67C23A' : row.salaryAdjustment < 0 ? '#F56C6C' : '#909399' }">
                {{ row.salaryAdjustment > 0 ? '+' : '' }}{{ row.salaryAdjustment }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="promotion" label="晋升情况" min-width="10%">
            <template #default="{ row }">
              {{ row.promotion || '无' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="12%" />
          <el-table-column label="操作" min-width="14%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看详情
              </el-button>
              <el-button link type="primary" @click="handleViewTrend(row)">
                查看趋势图
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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="绩效档案详情"
      width="800px"
    >
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="员工工号">{{ currentDetail.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="员工姓名">{{ currentDetail.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentDetail.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="岗位">{{ currentDetail.positionName }}</el-descriptions-item>
        <el-descriptions-item label="绩效周期">{{ currentDetail.cycleName }}</el-descriptions-item>
        <el-descriptions-item label="最终得分">{{ currentDetail.finalScore }}</el-descriptions-item>
        <el-descriptions-item label="评级">
          <el-tag v-if="currentDetail.rating === '优秀'" type="success">{{ currentDetail.rating }}</el-tag>
          <el-tag v-else-if="currentDetail.rating === '良好'" type="primary">{{ currentDetail.rating }}</el-tag>
          <el-tag v-else-if="currentDetail.rating === '合格'" type="info">{{ currentDetail.rating }}</el-tag>
          <el-tag v-else type="warning">{{ currentDetail.rating }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="部门排名">
          {{ currentDetail.ranking }}/{{ currentDetail.totalInDepartment }}
        </el-descriptions-item>
        <el-descriptions-item label="薪资调整">
          <span :style="{ color: currentDetail.salaryAdjustment > 0 ? '#67C23A' : currentDetail.salaryAdjustment < 0 ? '#F56C6C' : '#909399' }">
            {{ currentDetail.salaryAdjustment > 0 ? '+' : '' }}{{ currentDetail.salaryAdjustment }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="晋升情况">{{ currentDetail.promotion || '无' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentDetail.createTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 趋势图弹窗 -->
    <el-dialog
      v-model="trendDialogVisible"
      title="绩效趋势图"
      width="900px"
    >
      <div ref="chartRef" style="width: 100%; height: 400px"></div>

      <template #footer>
        <el-button @click="trendDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getPerformanceArchiveList, getPerformanceArchiveDetail } from '@/api/performanceArchive'
import type { PerformanceArchive, PerformanceArchiveListParams } from '@/types/performanceArchive'
import * as echarts from 'echarts'

defineOptions({
  name: 'PerformanceArchive'
})

// 查询参数
const queryParams = reactive<PerformanceArchiveListParams>({
  employeeName: '',
  departmentName: '',
  cycleName: '',
  rating: '',
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PerformanceArchive[]>([])
const total = ref(0)

// 详情弹窗
const detailDialogVisible = ref(false)
const currentDetail = ref<PerformanceArchive | null>(null)

// 趋势图弹窗
const trendDialogVisible = ref(false)
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

/**
 * 获取列表数据
 */
const getList = async () => {
  try {
    const res = await getPerformanceArchiveList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.cycleName = ''
  queryParams.rating = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

/**
 * 导出档案
 */
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

/**
 * 查看详情
 */
const handleViewDetail = async (row: PerformanceArchive) => {
  try {
    const res = await getPerformanceArchiveDetail(row.id)
    if (res.code === 200) {
      currentDetail.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

/**
 * 查看趋势图
 */
const handleViewTrend = async (row: PerformanceArchive) => {
  trendDialogVisible.value = true

  await nextTick()

  // Mock 趋势数据
  const trendData = [
    { period: '2025-Q2', score: 85, rating: '良好' },
    { period: '2025-Q3', score: 88, rating: '良好' },
    { period: '2025-Q4', score: 90, rating: '优秀' },
    { period: '2026-Q1', score: row.finalScore, rating: row.rating }
  ]

  if (chartRef.value) {
    if (chartInstance) {
      chartInstance.dispose()
    }

    chartInstance = echarts.init(chartRef.value)

    const option = {
      title: {
        text: `${row.employeeName} 的绩效趋势`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0]
          const trend = trendData[data.dataIndex]
          return `${data.name}<br/>得分: ${data.value}<br/>评级: ${trend.rating}`
        }
      },
      xAxis: {
        type: 'category',
        data: trendData.map(item => item.period),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '得分'
      },
      series: [
        {
          name: '绩效得分',
          type: 'line',
          data: trendData.map(item => item.score),
          smooth: true,
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
              ]
            }
          },
          markLine: {
            data: [
              { yAxis: 90, name: '优秀线', lineStyle: { color: '#67C23A' } },
              { yAxis: 80, name: '良好线', lineStyle: { color: '#409EFF' } },
              { yAxis: 60, name: '合格线', lineStyle: { color: '#E6A23C' } }
            ],
            label: {
              formatter: '{b}'
            }
          }
        }
      ]
    }

    chartInstance.setOption(option)
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.performance-archive-page {
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
