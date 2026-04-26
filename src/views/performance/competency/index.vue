<template>
  <div class="competency-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="能力名称">
            <el-input v-model="queryParams.competencyName" placeholder="名称或编号" style="width: 220px" clearable />
          </el-form-item>
          <el-form-item label="能力类别">
            <el-select v-model="queryParams.category" placeholder="全部" style="width: 150px" clearable>
              <el-option label="通用能力" value="general" />
              <el-option label="专业能力" value="professional" />
              <el-option label="管理能力" value="management" />
            </el-select>
          </el-form-item>
          <el-form-item label="适用岗位族">
            <el-select v-model="queryParams.jobFamily" placeholder="全部" style="width: 150px" clearable>
              <el-option
                v-for="opt in JOB_FAMILY_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" style="width: 110px" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
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
        <div class="header-title">能力字典</div>
        <div class="header-actions">
          <el-button type="success" @click="handleShowRadarDemo">
            <el-icon><DataAnalysis /></el-icon>
            能力雷达图演示
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增能力
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="competencyCode" label="能力编码" width="140" />
          <el-table-column prop="competencyName" label="能力名称" min-width="160" show-overflow-tooltip />
          <el-table-column label="类别" width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="COMPETENCY_CATEGORY_TYPE[row.category as CompetencyCategory]" size="small">
                {{ COMPETENCY_CATEGORY_LABEL[row.category as CompetencyCategory] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="适用岗位族" min-width="280" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag
                v-for="jf in row.jobFamilies"
                :key="jf"
                size="small"
                effect="plain"
                style="margin-right: 4px"
              >
                {{ jf }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="能力描述" min-width="260" show-overflow-tooltip />
          <el-table-column label="等级" width="90" align="center">
            <template #default="{ row }">
              <span style="color: #606266">L1~L{{ row.levels.length }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看等级</el-button>
              <el-button link @click="handleEdit(row)">编辑</el-button>
              <el-button link @click="handleToggleStatus(row)">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.id ? '编辑能力' : '新增能力'"
      width="900px"
      top="5vh"
    >
      <el-scrollbar max-height="70vh">
        <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="120px">
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="能力名称" prop="competencyName">
                <el-input v-model="editForm.competencyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="能力编码">
                <el-input v-model="editForm.competencyCode" placeholder="留空自动生成" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="能力类别" prop="category">
                <el-select v-model="editForm.category" style="width: 100%">
                  <el-option label="通用能力" value="general" />
                  <el-option label="专业能力" value="professional" />
                  <el-option label="管理能力" value="management" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="sortOrder">
                <el-input v-model.number="editForm.sortOrder" placeholder="数值越小越靠前" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="适用岗位族" prop="jobFamilies">
                <el-select
                  v-model="editForm.jobFamilies"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 100%"
                >
                  <el-option
                    v-for="opt in JOB_FAMILY_OPTIONS"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="能力描述" prop="description">
                <el-input v-model="editForm.description" type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">五级行为化描述（L1 ~ L5）</el-divider>
          <el-table :data="editForm.levels" border size="small">
            <el-table-column label="等级" width="80" align="center">
              <template #default="{ row }">
                <el-tag size="small">L{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="等级名" width="130">
              <template #default="{ row }">
                <el-input v-model="row.levelName" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="行为描述">
              <template #default="{ row }">
                <el-input
                  v-model="row.behavior"
                  type="textarea"
                  :rows="2"
                  size="small"
                  placeholder="请描述该等级的可观察行为"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看等级 Drawer -->
    <el-drawer v-model="viewDrawerVisible" :title="viewForm?.competencyName || '能力详情'" size="620px">
      <template v-if="viewForm">
        <div class="view-block">
          <div class="view-row">
            <span class="view-label">编码</span>
            <span>{{ viewForm.competencyCode }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">类别</span>
            <el-tag :type="COMPETENCY_CATEGORY_TYPE[viewForm.category]" size="small">
              {{ COMPETENCY_CATEGORY_LABEL[viewForm.category] }}
            </el-tag>
          </div>
          <div class="view-row">
            <span class="view-label">适用岗位族</span>
            <div>
              <el-tag
                v-for="jf in viewForm.jobFamilies"
                :key="jf"
                size="small"
                effect="plain"
                style="margin-right: 4px"
              >
                {{ jf }}
              </el-tag>
            </div>
          </div>
          <div class="view-row">
            <span class="view-label">描述</span>
            <span>{{ viewForm.description }}</span>
          </div>
        </div>
        <el-divider>五级行为化描述</el-divider>
        <div class="level-card" v-for="lv in viewForm.levels" :key="lv.level">
          <div class="level-card-head">
            <el-tag>L{{ lv.level }} · {{ lv.levelName }}</el-tag>
          </div>
          <div class="level-card-body">{{ lv.behavior || '（暂无描述）' }}</div>
        </div>
      </template>
    </el-drawer>

    <!-- 能力雷达图演示 Dialog -->
    <el-dialog v-model="radarDialogVisible" title="能力雷达图演示" width="720px">
      <div class="radar-demo">
        <div class="radar-bar">
          <span class="radar-label">选择演示员工</span>
          <el-select v-model="radarEmployeeId" style="width: 200px" @change="buildRadar">
            <el-option label="张伟（P6 技术）" :value="1" />
            <el-option label="李娜（P7 产品）" :value="2" />
            <el-option label="王强（M1 管理）" :value="3" />
          </el-select>
          <span class="radar-label" style="margin-left: 16px">能力类别</span>
          <el-select v-model="radarCategory" style="width: 140px" @change="buildRadar">
            <el-option label="通用能力" value="general" />
            <el-option label="专业能力" value="professional" />
            <el-option label="管理能力" value="management" />
          </el-select>
        </div>
        <div ref="radarChartRef" class="radar-chart" />
        <div class="radar-note">说明：实际实现会基于绩效档案的能力评估结果生成，这里为演示用确定性分数。</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Plus, DataAnalysis } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import * as echarts from 'echarts'
import {
  getCompetencyList,
  addCompetency,
  updateCompetency,
  deleteCompetency,
  updateCompetencyStatus,
  getCompetencyRadarData
} from '@/api/performanceCompetency'
import {
  COMPETENCY_CATEGORY_LABEL,
  COMPETENCY_CATEGORY_TYPE,
  JOB_FAMILY_OPTIONS,
  createDefaultLevels
} from '@/types/performanceCompetency'
import type {
  Competency,
  CompetencyCategory,
  CompetencyListParams
} from '@/types/performanceCompetency'

defineOptions({ name: 'PerformanceCompetency' })

const queryParams = reactive<CompetencyListParams>({
  competencyName: '',
  category: '',
  jobFamily: '',
  status: null,
  page: 1,
  pageSize: 20
})

const tableData = ref<Competency[]>([])
const total = ref(0)

const fetchData = async () => {
  const res: any = await getCompetencyList(queryParams)
  tableData.value = res.data.list
  total.value = res.data.total
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.competencyName = ''
  queryParams.category = ''
  queryParams.jobFamily = ''
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

// 编辑
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<Competency>>({
  id: undefined,
  competencyCode: '',
  competencyName: '',
  category: 'general',
  jobFamilies: [],
  description: '',
  levels: createDefaultLevels(),
  status: 1,
  sortOrder: 99
})
const formRules: FormRules = {
  competencyName: [{ required: true, message: '请输入能力名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择能力类别', trigger: 'change' }],
  jobFamilies: [
    { required: true, type: 'array', message: '至少选择一个岗位族', trigger: 'change' }
  ],
  description: [{ required: true, message: '请输入能力描述', trigger: 'blur' }]
}

const resetEditForm = () => {
  editForm.id = undefined
  editForm.competencyCode = ''
  editForm.competencyName = ''
  editForm.category = 'general'
  editForm.jobFamilies = []
  editForm.description = ''
  editForm.levels = createDefaultLevels()
  editForm.status = 1
  editForm.sortOrder = 99
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}

const handleEdit = (row: Competency) => {
  resetEditForm()
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}

const handleSubmit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate()

  // 自动生成编码
  if (!editForm.competencyCode) {
    const prefix =
      editForm.category === 'general'
        ? 'C-GEN'
        : editForm.category === 'management'
        ? 'C-MGMT'
        : 'C-PROF'
    editForm.competencyCode = `${prefix}-${String(Date.now()).slice(-4)}`
  }

  if (editForm.id) {
    await updateCompetency(editForm as any)
    ElMessage.success('更新成功')
  } else {
    await addCompetency(editForm as any)
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
  fetchData()
}

const handleToggleStatus = async (row: Competency) => {
  const next = row.status === 1 ? 0 : 1
  await updateCompetencyStatus(row.id, next)
  ElMessage.success('状态已更新')
  fetchData()
}

const handleDelete = (row: Competency) => {
  ElMessageBox.confirm(`确定删除能力"${row.competencyName}"吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteCompetency(row.id)
    ElMessage.success('删除成功')
    fetchData()
  })
}

// 查看
const viewDrawerVisible = ref(false)
const viewForm = ref<Competency | null>(null)
const handleView = (row: Competency) => {
  viewForm.value = row
  viewDrawerVisible.value = true
}

// 雷达图演示
const radarDialogVisible = ref(false)
const radarEmployeeId = ref<number>(1)
const radarCategory = ref<CompetencyCategory>('general')
const radarChartRef = ref<HTMLDivElement>()
let radarChart: echarts.ECharts | null = null

const handleShowRadarDemo = async () => {
  radarDialogVisible.value = true
  await nextTick()
  buildRadar()
}

const buildRadar = async () => {
  await nextTick()
  if (!radarChartRef.value) return
  if (!radarChart) {
    radarChart = echarts.init(radarChartRef.value)
  }

  const filtered = tableData.value.filter((c) => c.category === radarCategory.value).slice(0, 6)
  const ids = filtered.map((c) => c.id)
  const res: any = await getCompetencyRadarData(radarEmployeeId.value, ids)
  const scoreData: any[] = res.data || []

  const indicators = scoreData.map((s: any) => ({ name: s.competencyName, max: 5 }))
  const actual = scoreData.map((s: any) => s.score)
  const target = scoreData.map(() => 4)

  radarChart.setOption({
    tooltip: {},
    legend: { data: ['实际水平', '目标等级'], bottom: 0 },
    radar: { indicator: indicators, radius: '62%' },
    series: [
      {
        type: 'radar',
        data: [
          { value: actual, name: '实际水平', areaStyle: { opacity: 0.3 } },
          {
            value: target,
            name: '目标等级',
            lineStyle: { type: 'dashed' },
            areaStyle: { opacity: 0.08 }
          }
        ]
      }
    ]
  })
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.competency-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-card,
  .data-card {
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .filter-card :deep(.el-card__body) {
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

  .data-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .header-actions {
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
      margin-top: 16px;
      justify-content: flex-end;
    }
  }
}

.view-block {
  padding: 0 20px;

  .view-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 14px;

    .view-label {
      width: 90px;
      color: #909399;
      flex-shrink: 0;
    }
  }
}

.level-card {
  margin: 0 20px 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px 16px;

  .level-card-head {
    margin-bottom: 8px;
  }

  .level-card-body {
    color: #606266;
    font-size: 13px;
    line-height: 1.6;
  }
}

.radar-demo {
  .radar-bar {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .radar-label {
      margin-right: 8px;
      color: #606266;
    }
  }

  .radar-chart {
    width: 100%;
    height: 420px;
  }

  .radar-note {
    font-size: 12px;
    color: #909399;
    text-align: center;
    margin-top: 8px;
  }
}
</style>
