<template>
  <div class="record-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="计划">
            <el-select
              v-model="queryParams.planId"
              placeholder="请选择计划"
              style="width: 260px"
              clearable
              filterable
            >
              <el-option
                v-for="p in planOptions"
                :key="p.id"
                :label="`${p.planNo} · ${p.planName}`"
                :value="p.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="员工">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="姓名模糊搜索"
              style="width: 160px"
              clearable
            />
          </el-form-item>

          <el-form-item label="课程分类">
            <el-select
              v-model="queryParams.courseCategory"
              placeholder="请选择"
              style="width: 140px"
              clearable
            >
              <el-option
                v-for="(label, key) in COURSE_CATEGORY_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="结业状态">
            <el-select
              v-model="queryParams.completionStatus"
              placeholder="请选择"
              style="width: 120px"
              clearable
            >
              <el-option
                v-for="(label, key) in COMPLETION_STATUS_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="是否出勤">
            <el-select
              v-model="queryParams.attended"
              placeholder="请选择"
              style="width: 110px"
              clearable
            >
              <el-option label="已出勤" value="true" />
              <el-option label="缺勤" value="false" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 数据汇总 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">记录总数</div>
        <div class="stat-value primary">{{ total }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">已通过</div>
        <div class="stat-value success">{{ stat.passed }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">未通过</div>
        <div class="stat-value warning">{{ stat.failed }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">进行中 / 未考核</div>
        <div class="stat-value">{{ stat.pending }}</div>
      </el-card>
    </div>

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="planName" label="培训计划" min-width="220" show-overflow-tooltip />
          <el-table-column prop="courseName" label="课程" min-width="180" show-overflow-tooltip />
          <el-table-column label="分类" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="COURSE_CATEGORY_TYPE[row.courseCategory as CourseCategory]"
                size="small"
              >
                {{ COURSE_CATEGORY_LABEL[row.courseCategory as CourseCategory] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="employeeName" label="员工" width="90" />
          <el-table-column prop="orgName" label="组织" min-width="150" show-overflow-tooltip />
          <el-table-column label="签到" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.attended" type="success" size="small">已出勤</el-tag>
              <el-tag v-else type="danger" size="small">缺勤</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="成绩" width="80" align="center">
            <template #default="{ row }">
              <span v-if="row.score !== undefined" :style="{ color: row.score >= 75 ? '#67c23a' : '#f56c6c' }">
                {{ row.score }}
              </span>
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column label="结业状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="COMPLETION_STATUS_TYPE[row.completionStatus as TrainingRecord['completionStatus']]"
                size="small"
              >
                {{ COMPLETION_STATUS_LABEL[row.completionStatus as TrainingRecord['completionStatus']] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="学习时长" width="90" align="center">
            <template #default="{ row }">
              {{ row.actualDuration || 0 }}h
            </template>
          </el-table-column>
          <el-table-column label="反馈" width="130" align="center">
            <template #default="{ row }">
              <el-rate v-if="row.feedback" :model-value="row.feedback" disabled size="small" />
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="completionTime" label="结业时间" width="170" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getTrainingRecordList,
  getTrainingPlanList
} from '@/api/training'
import type {
  TrainingRecord,
  TrainingPlan,
  CourseCategory
} from '@/types/training'
import {
  COURSE_CATEGORY_LABEL,
  COURSE_CATEGORY_TYPE,
  COMPLETION_STATUS_LABEL,
  COMPLETION_STATUS_TYPE
} from '@/types/training'

defineOptions({ name: 'TrainingRecord' })

const queryParams = reactive<{
  planId?: number | null
  employeeName?: string
  courseCategory?: CourseCategory | ''
  completionStatus?: TrainingRecord['completionStatus'] | ''
  attended?: string
  page: number
  pageSize: number
}>({
  planId: null,
  employeeName: '',
  courseCategory: '',
  completionStatus: '',
  attended: '',
  page: 1,
  pageSize: 20
})

const tableData = ref<TrainingRecord[]>([])
const total = ref(0)
const planOptions = ref<TrainingPlan[]>([])

const stat = computed(() => {
  const passed = tableData.value.filter((r) => r.completionStatus === 'passed').length
  const failed = tableData.value.filter((r) => r.completionStatus === 'failed').length
  const pending = tableData.value.filter((r) => r.completionStatus === 'pending').length
  return { passed, failed, pending }
})

const fetchData = async () => {
  try {
    const res: any = await getTrainingRecordList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {
    ElMessage.error('获取培训记录失败')
  }
}

const fetchPlans = async () => {
  const res: any = await getTrainingPlanList({ page: 1, pageSize: 100 })
  planOptions.value = res.data.list
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryParams, {
    planId: null,
    employeeName: '',
    courseCategory: '',
    completionStatus: '',
    attended: '',
    page: 1,
    pageSize: 20
  })
  fetchData()
}

onMounted(async () => {
  await fetchPlans()
  fetchData()
})
</script>

<style scoped lang="scss">
.record-container {
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

.stat-row {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 14px 20px;
    }

    .stat-label {
      font-size: 13px;
      color: #909399;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      margin-top: 4px;
      color: #303133;

      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
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
  }
}
</style>
