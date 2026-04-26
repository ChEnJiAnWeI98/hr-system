<template>
  <div class="attendance-statistics-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentId" placeholder="请输入部门ID" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="统计月份">
            <el-date-picker
              v-model="queryParams.statisticsMonth"
              type="month"
              placeholder="请选择统计月份"
              value-format="YYYY-MM"
              style="width: 200px"
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

    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出统计
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
        >
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" fixed="left" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" fixed="left" />
          <el-table-column prop="statisticsMonth" label="统计月份" min-width="8%" />
          <el-table-column prop="workDays" label="应出勤天数" min-width="7%" />
          <el-table-column prop="actualWorkDays" label="实际出勤天数" min-width="10%" />
          <el-table-column prop="normalDays" label="正常天数" min-width="8%" />
          <el-table-column prop="lateDays" label="迟到天数" min-width="8%">
            <template #default="{ row }">
              <span :style="{ color: row.lateDays > 0 ? '#E6A23C' : '' }">{{ row.lateDays }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="earlyDays" label="早退天数" min-width="8%">
            <template #default="{ row }">
              <span :style="{ color: row.earlyDays > 0 ? '#E6A23C' : '' }">{{ row.earlyDays }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="absentDays" label="旷工天数" min-width="8%">
            <template #default="{ row }">
              <span :style="{ color: row.absentDays > 0 ? '#F56C6C' : '' }">{{ row.absentDays }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leaveDays" label="请假天数" min-width="8%" />
          <el-table-column prop="totalLateMinutes" label="累计迟到(分钟)" min-width="9%">
            <template #default="{ row }">
              <span :style="{ color: row.totalLateMinutes > 0 ? '#E6A23C' : '' }">{{ row.totalLateMinutes }}</span>
            </template>
          </el-table-column>
          <el-table-column label="累计早退(分钟)" min-width="9%">
            <template #default="{ row }">
              <span>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalWorkHours" label="总工作时长(小时)" min-width="9%" />
          <el-table-column prop="overtimeDays" label="加班天数" min-width="8%" />
          <el-table-column prop="totalOvertimeHours" label="加班时长(小时)" min-width="9%" />
          <el-table-column prop="fieldWorkDays" label="外勤天数" min-width="8%" />
          <el-table-column prop="makeupClockInCount" label="补卡次数" min-width="8%" />
          <el-table-column label="操作" min-width="12%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <el-dialog
      v-model="detailVisible"
      title="考勤统计详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ detailData.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="统计月份">{{ detailData.statisticsMonth }}</el-descriptions-item>
        <el-descriptions-item label="应出勤天数">{{ detailData.workDays }}</el-descriptions-item>
        <el-descriptions-item label="实际出勤天数">{{ detailData.actualWorkDays }}</el-descriptions-item>
        <el-descriptions-item label="正常天数">{{ detailData.normalDays }}</el-descriptions-item>
        <el-descriptions-item label="迟到天数">
          <span :style="{ color: detailData.lateDays > 0 ? '#E6A23C' : '' }">{{ detailData.lateDays }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="早退天数">
          <span :style="{ color: detailData.earlyDays > 0 ? '#E6A23C' : '' }">{{ detailData.earlyDays }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="旷工天数">
          <span :style="{ color: detailData.absentDays > 0 ? '#F56C6C' : '' }">{{ detailData.absentDays }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="请假天数">{{ detailData.leaveDays }}</el-descriptions-item>
        <el-descriptions-item label="累计迟到(分钟)">
          <span :style="{ color: detailData.totalLateMinutes > 0 ? '#E6A23C' : '' }">{{ detailData.totalLateMinutes }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="累计早退(分钟)">
          <span>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="总工作时长(小时)">{{ detailData.totalWorkHours }}</el-descriptions-item>
        <el-descriptions-item label="加班天数">{{ detailData.overtimeDays }}</el-descriptions-item>
        <el-descriptions-item label="加班时长(小时)">{{ detailData.totalOvertimeHours }}</el-descriptions-item>
        <el-descriptions-item label="外勤天数">{{ detailData.fieldWorkDays }}</el-descriptions-item>
        <el-descriptions-item label="补卡次数">{{ detailData.makeupClockInCount }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { AttendanceStatistics, AttendanceStatisticsListParams } from '@/types/attendance'
import { getAttendanceStatisticsList } from '@/api/attendanceStatistics'

defineOptions({
  name: 'AttendanceStatisticsTab'
})

const queryParams = reactive<AttendanceStatisticsListParams>({
  employeeName: '',
  departmentId: null,
  statisticsMonth: '',
  page: 1,
  pageSize: 10
})

const tableData = ref<AttendanceStatistics[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailData = ref<AttendanceStatistics>({} as AttendanceStatistics)

const fetchData = async () => {
  try {
    const res = await getAttendanceStatisticsList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取考勤统计失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentId = null
  queryParams.statisticsMonth = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchData()
}

const handleView = (row: AttendanceStatistics) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.attendance-statistics-tab {
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
