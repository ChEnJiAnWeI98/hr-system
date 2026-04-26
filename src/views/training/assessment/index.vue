<template>
  <div class="assessment-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="姓名模糊搜索"
              style="width: 180px"
              clearable
            />
          </el-form-item>

          <el-form-item label="评估期">
            <el-select
              v-model="queryParams.assessmentPeriod"
              placeholder="请选择"
              style="width: 150px"
              clearable
            >
              <el-option label="2026 Q1" value="2026 Q1" />
              <el-option label="2026 H1" value="2026 H1" />
            </el-select>
          </el-form-item>

          <el-form-item label="评估类型">
            <el-select
              v-model="queryParams.assessmentType"
              placeholder="请选择"
              style="width: 140px"
              clearable
            >
              <el-option
                v-for="(label, key) in ASSESSMENT_TYPE_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              style="width: 120px"
              clearable
            >
              <el-option label="草稿" value="draft" />
              <el-option label="已提交" value="submitted" />
              <el-option label="已审批" value="approved" />
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
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增评估
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="employeeName" label="员工" width="100" />
          <el-table-column prop="orgName" label="组织" min-width="160" show-overflow-tooltip />
          <el-table-column prop="assessmentPeriod" label="评估期" width="120" align="center" />
          <el-table-column label="评估类型" width="120" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">
                {{ ASSESSMENT_TYPE_LABEL[row.assessmentType as AssessmentType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="能力项数" width="100" align="center">
            <template #default="{ row }">{{ row.items.length }}</template>
          </el-table-column>
          <el-table-column label="均分" width="100" align="center">
            <template #default="{ row }">
              <span :style="{ color: avg(row) >= 4 ? '#67c23a' : avg(row) >= 3.5 ? '#409eff' : '#f56c6c' }">
                {{ avg(row).toFixed(1) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="达标率" min-width="180" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="passRate(row)"
                :stroke-width="6"
                :status="passRate(row) >= 60 ? 'success' : 'warning'"
              />
            </template>
          </el-table-column>
          <el-table-column prop="assessorName" label="评估人" width="100" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'draft'" type="info" size="small">草稿</el-tag>
              <el-tag v-else-if="row.status === 'submitted'" type="primary" size="small">已提交</el-tag>
              <el-tag v-else-if="row.status === 'approved'" type="success" size="small">已审批</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情（雷达图）</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="新增能力评估"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="被评估员工" prop="employeeId">
          <EmployeeSelector v-model="formData.employeeId" width="100%" @change="onEmployeeChange" />
        </el-form-item>
        <el-form-item label="评估期" prop="assessmentPeriod">
          <el-select v-model="formData.assessmentPeriod" style="width: 100%">
            <el-option label="2026 Q1" value="2026 Q1" />
            <el-option label="2026 H1" value="2026 H1" />
            <el-option label="2026 Q3" value="2026 Q3" />
            <el-option label="2026 Q4" value="2026 Q4" />
          </el-select>
        </el-form-item>
        <el-form-item label="评估类型" prop="assessmentType">
          <el-radio-group v-model="formData.assessmentType">
            <el-radio value="self">自评</el-radio>
            <el-radio value="supervisor">上级评</el-radio>
            <el-radio value="hrbp">HRBP 评</el-radio>
            <el-radio value="synthesis">综合评估</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="能力项打分" v-if="formData.items && formData.items.length > 0">
          <el-table :data="formData.items" size="small" border style="width: 100%">
            <el-table-column prop="competencyName" label="能力项" min-width="160" />
            <el-table-column label="得分（1~5）" width="220">
              <template #default="{ row }">
                <el-slider v-model="row.score" :min="1" :max="5" :step="0.5" :format-tooltip="(v: number) => v.toFixed(1)" />
              </template>
            </el-table-column>
            <el-table-column label="目标" width="80" align="center">
              <template #default="{ row }">L{{ row.targetLevel }}</template>
            </el-table-column>
            <el-table-column label="差距" width="80" align="center">
              <template #default="{ row }">
                <span :style="{ color: row.targetLevel - row.score > 0 ? '#f56c6c' : '#67c23a' }">
                  {{ (row.targetLevel - row.score).toFixed(1) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="综合评语">
          <el-input v-model="formData.overallComment" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmitForm">提交</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Drawer（含雷达图） -->
    <el-drawer v-model="detailVisible" :title="detailTitle" size="720px">
      <template v-if="detailData">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工">{{ detailData.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="组织">{{ detailData.orgName }}</el-descriptions-item>
          <el-descriptions-item label="评估期">{{ detailData.assessmentPeriod }}</el-descriptions-item>
          <el-descriptions-item label="评估类型">
            {{ ASSESSMENT_TYPE_LABEL[detailData.assessmentType as AssessmentType] }}
          </el-descriptions-item>
          <el-descriptions-item label="评估人">{{ detailData.assessorName }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ detailData.submitTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="综合评语" :span="2">{{ detailData.overallComment }}</el-descriptions-item>
        </el-descriptions>

        <div class="chart-section">
          <div class="section-title">能力雷达图</div>
          <div ref="radarRef" class="radar-chart" />
        </div>

        <div class="items-section">
          <div class="section-title">能力项明细</div>
          <el-table :data="detailData.items" border size="small" style="width: 100%">
            <el-table-column prop="competencyName" label="能力项" min-width="140" />
            <el-table-column label="得分" width="80" align="center">
              <template #default="{ row }">
                <span :style="{ color: row.score >= 4 ? '#67c23a' : row.score >= 3.5 ? '#409eff' : '#f56c6c', fontWeight: 600 }">
                  {{ row.score.toFixed(1) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="目标" width="80" align="center">
              <template #default="{ row }">L{{ row.targetLevel }}</template>
            </el-table-column>
            <el-table-column label="差距" width="80" align="center">
              <template #default="{ row }">
                <span :style="{ color: row.gap > 0 ? '#f56c6c' : '#67c23a' }">
                  {{ row.gap.toFixed(1) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="评价" min-width="200" show-overflow-tooltip />
          </el-table>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  getAssessmentList,
  addAssessment,
  deleteAssessment,
  getDefaultAssessmentItemsApi
} from '@/api/training'
import type {
  CompetencyAssessment,
  CompetencyAssessmentItem
} from '@/types/training'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'

defineOptions({ name: 'TrainingAssessment' })

type AssessmentType = 'self' | 'supervisor' | 'hrbp' | 'synthesis'

const ASSESSMENT_TYPE_LABEL: Record<AssessmentType, string> = {
  self: '自评',
  supervisor: '上级评',
  hrbp: 'HRBP 评',
  synthesis: '综合评估'
}

const empStore = useEmployeeStore()

const queryParams = reactive<{
  employeeName?: string
  assessmentPeriod?: string
  assessmentType?: AssessmentType | ''
  status?: CompetencyAssessment['status'] | ''
  page: number
  pageSize: number
}>({
  employeeName: '',
  assessmentPeriod: '',
  assessmentType: '',
  status: '',
  page: 1,
  pageSize: 10
})

const tableData = ref<CompetencyAssessment[]>([])
const total = ref(0)

const avg = (row: CompetencyAssessment) => {
  if (!row.items?.length) return 0
  return row.items.reduce((s, i) => s + i.score, 0) / row.items.length
}

const passRate = (row: CompetencyAssessment) => {
  if (!row.items?.length) return 0
  const pass = row.items.filter((i) => i.score >= i.targetLevel).length
  return Math.round((pass / row.items.length) * 100)
}

const fetchData = async () => {
  try {
    const res: any = await getAssessmentList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {
    ElMessage.error('获取评估列表失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryParams, {
    employeeName: '',
    assessmentPeriod: '',
    assessmentType: '',
    status: '',
    page: 1,
    pageSize: 10
  })
  fetchData()
}

// === 新增 ===
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const emptyForm = (): Partial<CompetencyAssessment> => ({
  employeeId: undefined,
  employeeName: '',
  orgName: '',
  assessmentPeriod: '2026 H1',
  assessmentType: 'supervisor',
  items: [],
  overallComment: '',
  assessorId: 0,
  assessorName: '',
  status: 'draft'
})
const formData = reactive<Partial<CompetencyAssessment>>(emptyForm())

const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择被评估员工', trigger: 'change' }],
  assessmentPeriod: [{ required: true, message: '请选择评估期', trigger: 'change' }],
  assessmentType: [{ required: true, message: '请选择评估类型', trigger: 'change' }]
}

const handleAdd = () => {
  Object.assign(formData, emptyForm(), { id: undefined })
  dialogVisible.value = true
}

const onEmployeeChange = async (empId: number) => {
  const emp = empStore.getById(empId)
  if (emp) {
    formData.employeeName = emp.nameZh
    formData.orgName = emp.orgName
    // 默认上级做评估人
    if (emp.supervisorId) {
      const sup = empStore.getById(emp.supervisorId)
      formData.assessorId = sup?.id || 0
      formData.assessorName = sup?.nameZh || ''
    }
    // 按员工岗位族带出能力项
    const res: any = await getDefaultAssessmentItemsApi(empId)
    formData.items = res.data || []
  }
}

const handleSaveDraft = async () => {
  if (!formData.employeeId) {
    ElMessage.warning('请先选择员工')
    return
  }
  await submitForm('draft')
}

const handleSubmitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    await submitForm('submitted')
  })
}

const submitForm = async (status: 'draft' | 'submitted') => {
  // 更新 gap
  formData.items?.forEach((i) => {
    i.gap = Number((i.targetLevel - i.score).toFixed(1))
  })
  try {
    await addAssessment({
      ...formData,
      status,
      submitTime: status === 'submitted' ? new Date().toLocaleString('zh-CN') : undefined
    } as CompetencyAssessment)
    ElMessage.success(status === 'draft' ? '已保存草稿' : '提交成功')
    dialogVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row: CompetencyAssessment) => {
  try {
    await ElMessageBox.confirm(
      `确定删除 ${row.employeeName} 的 ${row.assessmentPeriod} 评估？`,
      '提示',
      { type: 'warning' }
    )
    await deleteAssessment(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// === 详情 + 雷达图 ===
const detailVisible = ref(false)
const detailData = ref<CompetencyAssessment | null>(null)
const radarRef = ref<HTMLDivElement>()
let radarChart: echarts.ECharts | null = null
const detailTitle = ref('评估详情')

const handleView = (row: CompetencyAssessment) => {
  detailData.value = row
  detailTitle.value = `${row.employeeName} · ${row.assessmentPeriod} 评估详情`
  detailVisible.value = true
  nextTick(() => renderRadar())
}

const renderRadar = () => {
  if (!radarRef.value || !detailData.value) return
  if (radarChart) radarChart.dispose()
  radarChart = echarts.init(radarRef.value)
  const items = detailData.value.items
  const option: EChartsOption = {
    tooltip: {},
    legend: {
      data: ['实际得分', '目标等级'],
      bottom: 0
    },
    radar: {
      indicator: items.map((i) => ({ name: i.competencyName, max: 5 })),
      radius: '65%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: items.map((i) => i.score),
            name: '实际得分',
            areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
            lineStyle: { color: '#409eff' },
            itemStyle: { color: '#409eff' }
          },
          {
            value: items.map((i) => i.targetLevel),
            name: '目标等级',
            lineStyle: { color: '#67c23a', type: 'dashed' },
            itemStyle: { color: '#67c23a' }
          }
        ]
      }
    ]
  }
  radarChart.setOption(option)
}

watch(detailVisible, (v) => {
  if (!v && radarChart) {
    radarChart.dispose()
    radarChart = null
  }
})

onMounted(fetchData)
</script>

<style scoped lang="scss">
.assessment-container {
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
  }
}

.chart-section,
.items-section {
  margin-top: 24px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #303133;
  }
}

.radar-chart {
  width: 100%;
  height: 380px;
}
</style>
