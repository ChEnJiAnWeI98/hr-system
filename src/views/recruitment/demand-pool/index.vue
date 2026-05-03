<template>
  <div class="demand-pool-container">
    <ModuleTabBar :tabs="demandGroupTabs" />
    <!-- 顶部统计卡片 -->
    <el-card class="summary-card">
      <div class="summary-row">
        <div class="summary-item">
          <div class="summary-label">待发布职位需求</div>
          <div class="summary-value pending">{{ summary.pendingJob }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">已部分发布</div>
          <div class="summary-value partial">{{ summary.partial }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">已完全发布</div>
          <div class="summary-value done">{{ summary.fullyPublished }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">累计已通过需求</div>
          <div class="summary-value total">{{ summary.total }}</div>
        </div>
      </div>
    </el-card>

    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="需求编号">
            <el-input v-model="queryParams.demandNo" placeholder="请输入需求编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="申请部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入申请部门" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="招聘岗位">
            <el-input v-model="queryParams.positionName" placeholder="请输入招聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="发布进度">
            <el-select v-model="publishFilter" placeholder="请选择发布进度" style="width: 160px" clearable>
              <el-option label="待发布" value="pending" />
              <el-option label="部分发布" value="partial" />
              <el-option label="已完全发布" value="fully" />
            </el-select>
          </el-form-item>

          <el-form-item label="紧急程度">
            <el-select v-model="queryParams.urgencyLevel" placeholder="请选择紧急程度" style="width: 150px" clearable>
              <el-option label="一般" :value="1" />
              <el-option label="紧急" :value="2" />
              <el-option label="非常紧急" :value="3" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-container">
        <el-table :data="filteredTableData" height="100%" style="width: 100%">
          <el-table-column prop="demandNo" label="需求编号" min-width="11%" />
          <el-table-column prop="departmentName" label="申请部门" min-width="9%" />
          <el-table-column prop="positionName" label="招聘岗位" min-width="11%" />
          <el-table-column prop="hiringManagerName" label="发起人" min-width="8%">
            <template #default="{ row }">{{ row.hiringManagerName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="recruitCount" label="招聘人数" min-width="8%" />
          <el-table-column label="发布进度" min-width="14%">
            <template #default="{ row }">
              <div class="publish-progress">
                <div class="progress-text">
                  {{ row.publishedJobCount || 0 }} / {{ row.recruitCount }} 已发布
                </div>
                <el-progress
                  :percentage="Math.min(Math.round(((row.publishedJobCount || 0) / row.recruitCount) * 100), 100)"
                  :status="getPublishStatus(row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="urgencyLevel" label="紧急程度" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.urgencyLevel === 1" type="info">一般</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 2" type="warning">紧急</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 3" type="danger">非常紧急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salaryRange" label="薪资范围" min-width="9%" />
          <el-table-column prop="expectedOnboardDate" label="期望到岗日期" min-width="10%" />
          <el-table-column label="操作" min-width="16%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看需求</el-button>
              <el-button
                v-if="isHR && (row.publishedJobCount || 0) < row.recruitCount"
                link
                type="success"
                @click="handleCreateJob(row)"
              >
                发布职位
              </el-button>
              <el-button link @click="handleGoJobList(row)">已发布职位</el-button>
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

    <!-- 需求详情弹窗 -->
    <el-dialog v-model="detailVisible" title="招聘需求详情" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="需求编号">{{ detailData.demandNo }}</el-descriptions-item>
        <el-descriptions-item label="申请部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="发起人">{{ detailData.hiringManagerName }}</el-descriptions-item>
        <el-descriptions-item label="招聘岗位">{{ detailData.positionName }}</el-descriptions-item>
        <el-descriptions-item label="招聘人数">{{ detailData.recruitCount }}</el-descriptions-item>
        <el-descriptions-item label="已发布职位">{{ detailData.publishedJobCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag v-if="detailData.urgencyLevel === 1" type="info">一般</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 2" type="warning">紧急</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 3" type="danger">非常紧急</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="薪资范围">{{ detailData.salaryRange }}</el-descriptions-item>
        <el-descriptions-item label="期望到岗日期">{{ detailData.expectedOnboardDate }}</el-descriptions-item>
        <el-descriptions-item label="审批完成时间">{{ detailData.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="需求原因" :span="2">{{ detailData.demandReason }}</el-descriptions-item>
        <el-descriptions-item label="任职要求" :span="2">{{ detailData.jobRequirements }}</el-descriptions-item>
        <el-descriptions-item label="最终审批意见" :span="2">{{ detailData.approvalComment }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="isHR && detailData.id && (detailData.publishedJobCount || 0) < (detailData.recruitCount || 0)"
          type="primary"
          @click="handleCreateJob(detailData)"
        >
          立即发布职位
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import type { RecruitmentDemand, RecruitmentDemandListParams } from '@/types/recruitmentDemand'
import { getRecruitmentDemandList, getDetail } from '@/api/recruitmentDemand'

const demandGroupTabs = [
  { label: '我的招聘需求', path: '/recruit/demand' },
  { label: 'HR 招聘需求池', path: '/recruit/demand-pool' },
  { label: '完成率监控', path: '/recruit/demand-completion' }
]

defineOptions({
  name: 'RecruitmentDemandPool'
})

const userStore = useUserStore()
const isHR = computed(() => userStore.isHR)
const router = useRouter()

const queryParams = reactive<RecruitmentDemandListParams>({
  demandNo: '',
  departmentName: '',
  positionName: '',
  urgencyLevel: null,
  approvalStatus: 1, // 固定只查已通过
  page: 1,
  pageSize: 10
})

const publishFilter = ref<string>('')
const tableData = ref<RecruitmentDemand[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailData = ref<Partial<RecruitmentDemand>>({})

// 按发布进度筛选
const filteredTableData = computed(() => {
  if (!publishFilter.value) return tableData.value
  return tableData.value.filter((d) => {
    const published = d.publishedJobCount || 0
    const total = d.recruitCount || 0
    if (publishFilter.value === 'pending') return published === 0
    if (publishFilter.value === 'partial') return published > 0 && published < total
    if (publishFilter.value === 'fully') return published >= total
    return true
  })
})

// 头部统计
const summary = computed(() => {
  const list = tableData.value
  let pendingJob = 0
  let partial = 0
  let fullyPublished = 0
  for (const d of list) {
    const p = d.publishedJobCount || 0
    if (p === 0) pendingJob++
    else if (p < d.recruitCount) partial++
    else fullyPublished++
  }
  return { pendingJob, partial, fullyPublished, total: list.length }
})

const getPublishStatus = (row: RecruitmentDemand) => {
  const p = row.publishedJobCount || 0
  if (p === 0) return 'exception'
  if (p >= row.recruitCount) return 'success'
  return undefined
}

const loadData = async () => {
  try {
    const res = await getRecruitmentDemandList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载招聘需求池失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.demandNo = ''
  queryParams.departmentName = ''
  queryParams.positionName = ''
  queryParams.urgencyLevel = null
  queryParams.page = 1
  queryParams.pageSize = 10
  publishFilter.value = ''
  loadData()
}

const handleView = async (row: RecruitmentDemand) => {
  try {
    const res = await getDetail(row.id!)
    if (res.code === 200) {
      detailData.value = res.data
      detailVisible.value = true
    }
  } catch {
    detailData.value = { ...row }
    detailVisible.value = true
  }
}

const handleCreateJob = (row: Partial<RecruitmentDemand>) => {
  if (!isHR.value) {
    ElMessage.warning('仅 HR 可发布职位')
    return
  }
  router.push({
    path: '/recruit/job',
    query: { demandId: String(row.id), autoOpen: '1' }
  })
  detailVisible.value = false
}

const handleGoJobList = (row: RecruitmentDemand) => {
  router.push({
    path: '/recruit/job',
    query: { demandNo: row.demandNo }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.demand-pool-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .summary-row {
    display: flex;
    gap: 32px;

    .summary-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px 16px;
      border-right: 1px solid #ebeef5;

      &:last-child {
        border-right: none;
      }

      .summary-label {
        font-size: 13px;
        color: #909399;
      }

      .summary-value {
        font-size: 26px;
        font-weight: 600;
        color: #303133;

        &.pending {
          color: #e6a23c;
        }
        &.partial {
          color: #409eff;
        }
        &.done {
          color: #67c23a;
        }
      }
    }
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

  .table-container {
    flex: 1;
    overflow: hidden;

    .publish-progress {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .progress-text {
        font-size: 12px;
        color: #606266;
      }
    }
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
