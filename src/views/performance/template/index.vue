<template>
  <div class="perf-template-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="模板名称">
            <el-input v-model="queryParams.templateName" placeholder="名称或编号" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="岗位族">
            <el-select v-model="queryParams.jobFamily" placeholder="全部" style="width: 150px" clearable>
              <el-option label="技术研发" value="技术研发" />
              <el-option label="产品设计" value="产品设计" />
              <el-option label="运营市场" value="运营市场" />
              <el-option label="职能支持" value="职能支持" />
              <el-option label="管理岗位" value="管理岗位" />
              <el-option label="全部" value="全部" />
            </el-select>
          </el-form-item>
          <el-form-item label="评估类型">
            <el-select v-model="queryParams.evalType" placeholder="全部" style="width: 130px" clearable>
              <el-option label="OKR" value="okr" />
              <el-option label="KPI" value="kpi" />
              <el-option label="混合" value="mixed" />
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
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增模板
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="templateNo" label="模板编号" width="160" />
          <el-table-column prop="templateName" label="模板名称" min-width="240" show-overflow-tooltip />
          <el-table-column prop="jobFamily" label="岗位族" width="110" />
          <el-table-column prop="level" label="适用职级" width="130" />
          <el-table-column label="评估类型" width="110" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.evalType === 'okr'" type="success" size="small">OKR</el-tag>
              <el-tag v-else-if="row.evalType === 'kpi'" type="warning" size="small">KPI</el-tag>
              <el-tag v-else size="small">混合</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="维度 / 节点" width="140" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.dimensions.length }} 维度</el-tag>
              <el-tag size="small" effect="plain" style="margin-left: 4px">{{ row.evalNodes.length }} 节点</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="版本" width="80" align="center">
            <template #default="{ row }">V{{ row.version }}</template>
          </el-table-column>
          <el-table-column label="使用中" width="90" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.inUse" type="info" size="small">已引用</el-tag>
              <span v-else style="color: #909399">—</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
              <el-button link :disabled="row.inUse" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="warning" @click="handleClone(row)">新版本</el-button>
              <el-button link @click="handleToggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
              <el-button link type="danger" :disabled="row.inUse" @click="handleDelete(row)">删除</el-button>
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

    <!-- 编辑弹窗（大表单）-->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑模板' : '新增模板'" width="960px" top="5vh">
      <el-scrollbar max-height="70vh">
        <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="130px">
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="模板名称" prop="templateName">
                <el-input v-model="editForm.templateName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模板编号">
                <el-input v-model="editForm.templateNo" placeholder="留空自动生成" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="岗位族" prop="jobFamily">
                <el-select v-model="editForm.jobFamily" style="width: 100%">
                  <el-option label="技术研发" value="技术研发" />
                  <el-option label="产品设计" value="产品设计" />
                  <el-option label="运营市场" value="运营市场" />
                  <el-option label="职能支持" value="职能支持" />
                  <el-option label="管理岗位" value="管理岗位" />
                  <el-option label="全部" value="全部" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="适用职级" prop="level">
                <el-input v-model="editForm.level" placeholder="如 P5-P7 / 全部" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评估类型" prop="evalType">
                <el-select v-model="editForm.evalType" style="width: 100%">
                  <el-option label="OKR 评估" value="okr" />
                  <el-option label="KPI 评估" value="kpi" />
                  <el-option label="混合评估" value="mixed" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">
            评估维度（总权重 = 100，当前：<span :class="dimSumClass">{{ dimSum }}</span>）
          </el-divider>
          <div v-for="(dim, idx) in editForm.dimensions" :key="idx" class="dim-block">
            <div class="dim-header">
              <el-input v-model="dim.name" placeholder="维度名（如 业绩成果）" style="flex: 1" />
              <el-input
                v-model.number="dim.weight"
                placeholder="权重 %"
                style="width: 120px; margin-left: 8px"
              >
                <template #append>%</template>
              </el-input>
              <el-button link type="danger" @click="removeDimension(idx)">删除</el-button>
            </div>
            <el-input
              v-model="dim.description"
              type="textarea"
              :rows="1"
              placeholder="维度描述（可选）"
              style="margin-top: 6px"
            />
            <div class="sub-block">
              <div class="sub-header">子指标（权重和 = 100）</div>
              <div v-for="(sub, sidx) in dim.subIndicators" :key="sidx" class="sub-row">
                <el-input v-model="sub.name" placeholder="子指标名" style="flex: 1" />
                <el-input v-model.number="sub.weight" placeholder="权重 %" style="width: 100px; margin-left: 6px">
                  <template #append>%</template>
                </el-input>
                <el-button link type="danger" @click="removeSubIndicator(idx, sidx)">删除</el-button>
              </div>
              <el-button size="small" link type="primary" @click="addSubIndicator(idx)">
                + 添加子指标
              </el-button>
            </div>
          </div>
          <el-button type="primary" plain size="small" @click="addDimension">
            <el-icon><Plus /></el-icon>
            添加维度
          </el-button>

          <el-divider content-position="left">
            评估节点（权重和 = 100，当前：<span :class="nodeSumClass">{{ nodeSum }}</span>）
          </el-divider>
          <div v-for="(node, idx) in editForm.evalNodes" :key="idx" class="node-row">
            <el-select v-model="node.nodeType" style="width: 130px">
              <el-option label="自评" value="self" />
              <el-option label="直属上级评" value="direct" />
              <el-option label="隔级上级评" value="skip" />
              <el-option label="HR 归档" value="hr" />
            </el-select>
            <el-input v-model="node.nodeName" placeholder="节点名称" style="width: 160px; margin-left: 8px" />
            <el-input v-model.number="node.weight" placeholder="权重 %" style="width: 110px; margin-left: 8px">
              <template #append>%</template>
            </el-input>
            <el-input
              v-model.number="node.deadlineDays"
              placeholder="截止天数"
              style="width: 110px; margin-left: 8px"
            >
              <template #append>天</template>
            </el-input>
            <el-button link type="danger" @click="removeNode(idx)">删除</el-button>
          </div>
          <el-button type="primary" plain size="small" @click="addNode">
            <el-icon><Plus /></el-icon>
            添加节点
          </el-button>

          <el-divider content-position="left">等级映射</el-divider>
          <el-table :data="editForm.gradeMapping" size="small">
            <el-table-column label="等级" width="100">
              <template #default="{ row }">
                <el-tag :class="`grade-${row.grade}`">{{ row.grade }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分数下限" width="140">
              <template #default="{ row }"><el-input v-model.number="row.minScore" size="small" /></template>
            </el-table-column>
            <el-table-column label="分数上限" width="140">
              <template #default="{ row }"><el-input v-model.number="row.maxScore" size="small" /></template>
            </el-table-column>
            <el-table-column label="等级描述">
              <template #default="{ row }"><el-input v-model="row.label" size="small" /></template>
            </el-table-column>
          </el-table>

          <el-divider content-position="left">备注</el-divider>
          <el-form-item label="备注">
            <el-input v-model="editForm.remark" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" :title="`预览：${previewData?.templateName || ''}`" width="780px" top="6vh">
      <el-scrollbar max-height="70vh">
        <el-descriptions v-if="previewData" :column="2" border>
          <el-descriptions-item label="模板编号">{{ previewData.templateNo }}</el-descriptions-item>
          <el-descriptions-item label="版本">V{{ previewData.version }}</el-descriptions-item>
          <el-descriptions-item label="岗位族">{{ previewData.jobFamily }}</el-descriptions-item>
          <el-descriptions-item label="职级">{{ previewData.level }}</el-descriptions-item>
          <el-descriptions-item label="评估类型" :span="2">
            {{ previewData.evalType === 'okr' ? 'OKR 评估' : previewData.evalType === 'kpi' ? 'KPI 评估' : '混合评估' }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="previewData" class="preview-section">
          <div class="preview-title">评估维度</div>
          <div v-for="(dim, idx) in previewData.dimensions" :key="idx" class="preview-dim">
            <div class="preview-dim-head">
              <span class="dim-name">{{ dim.name }}</span>
              <el-tag size="small">{{ dim.weight }}%</el-tag>
            </div>
            <div v-if="dim.description" class="dim-desc">{{ dim.description }}</div>
            <div class="sub-list">
              <div v-for="(sub, sidx) in dim.subIndicators" :key="sidx" class="sub-item">
                <span>{{ sub.name }}</span>
                <span class="sub-weight">权重 {{ sub.weight }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="previewData" class="preview-section">
          <div class="preview-title">评估节点链</div>
          <el-steps :space="160" simple finish-status="success">
            <el-step
              v-for="node in previewData.evalNodes"
              :key="node.order"
              :title="node.nodeName"
              :description="`权重 ${node.weight}% | ${node.deadlineDays || 5} 天`"
            />
          </el-steps>
        </div>

        <div v-if="previewData" class="preview-section">
          <div class="preview-title">等级映射</div>
          <el-table :data="previewData.gradeMapping" size="small">
            <el-table-column prop="grade" label="等级" width="100">
              <template #default="{ row }">
                <el-tag :class="`grade-${row.grade}`">{{ row.grade }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分数区间" width="160">
              <template #default="{ row }">{{ row.minScore }} ~ {{ row.maxScore }}</template>
            </el-table-column>
            <el-table-column prop="label" label="等级描述" />
          </el-table>
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  getTemplateList,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  cloneTemplate,
  toggleTemplateStatus
} from '@/api/performanceTemplate'
import type { PerformanceTemplate } from '@/types/performanceTemplate'
import {
  DEFAULT_EVAL_NODES,
  DEFAULT_GRADE_MAPPING
} from '@/types/performanceTemplate'
import { validateWeights } from '@/mock/performanceTemplate'

defineOptions({ name: 'PerformanceTemplate' })

const queryParams = reactive({
  templateName: '',
  jobFamily: '',
  evalType: '' as 'okr' | 'kpi' | 'mixed' | '',
  status: null as 0 | 1 | null,
  page: 1,
  pageSize: 10
})
const tableData = ref<PerformanceTemplate[]>([])
const total = ref(0)

const fetchData = async () => {
  const res = await getTemplateList(queryParams)
  tableData.value = res.data?.list || []
  total.value = res.data?.total || 0
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.templateName = ''
  queryParams.jobFamily = ''
  queryParams.evalType = ''
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

/* ========== 编辑 ========== */
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<PerformanceTemplate>>({
  id: undefined,
  templateNo: '',
  templateName: '',
  jobFamily: '技术研发',
  level: 'P5-P7',
  evalType: 'okr',
  dimensions: [],
  evalNodes: [],
  gradeMapping: [],
  status: 1,
  version: 1,
  remark: ''
})

const formRules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  jobFamily: [{ required: true, message: '请选择岗位族', trigger: 'change' }],
  level: [{ required: true, message: '请输入职级', trigger: 'blur' }],
  evalType: [{ required: true, message: '请选择评估类型', trigger: 'change' }]
}

const dimSum = computed(() =>
  (editForm.dimensions || []).reduce((s, d) => s + (Number(d.weight) || 0), 0)
)
const dimSumClass = computed(() => (dimSum.value === 100 ? 'weight-ok' : 'weight-err'))
const nodeSum = computed(() =>
  (editForm.evalNodes || []).reduce((s, n) => s + (Number(n.weight) || 0), 0)
)
const nodeSumClass = computed(() => (nodeSum.value === 100 ? 'weight-ok' : 'weight-err'))

const resetEditForm = () => {
  editForm.id = undefined
  editForm.templateNo = ''
  editForm.templateName = ''
  editForm.jobFamily = '技术研发'
  editForm.level = 'P5-P7'
  editForm.evalType = 'okr'
  editForm.dimensions = [
    {
      name: '业绩成果',
      weight: 40,
      subIndicators: [
        { name: 'OKR 完成度', weight: 60 },
        { name: '交付质量', weight: 40 }
      ]
    },
    {
      name: '专业能力',
      weight: 30,
      subIndicators: [{ name: '专业深度', weight: 100 }]
    },
    {
      name: '团队协作',
      weight: 20,
      subIndicators: [{ name: '团队协作', weight: 100 }]
    },
    {
      name: '创新突破',
      weight: 10,
      subIndicators: [{ name: '创新能力', weight: 100 }]
    }
  ]
  editForm.evalNodes = JSON.parse(JSON.stringify(DEFAULT_EVAL_NODES))
  editForm.gradeMapping = JSON.parse(JSON.stringify(DEFAULT_GRADE_MAPPING))
  editForm.status = 1
  editForm.version = 1
  editForm.remark = ''
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}

const handleEdit = (row: PerformanceTemplate) => {
  resetEditForm()
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}

const handleSave = async () => {
  await editFormRef.value?.validate()
  const err = validateWeights(editForm)
  if (err) {
    ElMessage.warning(err)
    return
  }
  if (editForm.id) {
    await updateTemplate(editForm)
    ElMessage.success('已更新')
  } else {
    if (!editForm.templateNo) {
      editForm.templateNo = `TPL${new Date().getFullYear()}${String(Date.now()).slice(-5)}`
    }
    await addTemplate(editForm)
    ElMessage.success('已新增')
  }
  editDialogVisible.value = false
  fetchData()
}

const addDimension = () => {
  editForm.dimensions!.push({
    name: '',
    weight: 0,
    subIndicators: [{ name: '', weight: 100 }]
  })
}
const removeDimension = (idx: number) => {
  editForm.dimensions!.splice(idx, 1)
}
const addSubIndicator = (dimIdx: number) => {
  editForm.dimensions![dimIdx].subIndicators.push({ name: '', weight: 0 })
}
const removeSubIndicator = (dimIdx: number, subIdx: number) => {
  editForm.dimensions![dimIdx].subIndicators.splice(subIdx, 1)
}
const addNode = () => {
  editForm.evalNodes!.push({
    nodeType: 'self',
    nodeName: '',
    weight: 0,
    order: editForm.evalNodes!.length + 1,
    deadlineDays: 5
  })
}
const removeNode = (idx: number) => {
  editForm.evalNodes!.splice(idx, 1)
}

/* ========== 预览 ========== */
const previewVisible = ref(false)
const previewData = ref<PerformanceTemplate | null>(null)
const handlePreview = (row: PerformanceTemplate) => {
  previewData.value = row
  previewVisible.value = true
}

/* ========== 新版本 / 启停 / 删除 ========== */
const handleClone = async (row: PerformanceTemplate) => {
  try {
    await ElMessageBox.confirm(
      `基于「${row.templateName}」（V${row.version}）复制出新版本？`,
      '新版本',
      { type: 'info' }
    )
    await cloneTemplate(row.id)
    ElMessage.success('已复制为新版本，可继续编辑')
    fetchData()
  } catch {}
}
const handleToggleStatus = async (row: PerformanceTemplate) => {
  await toggleTemplateStatus(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  fetchData()
}
const handleDelete = async (row: PerformanceTemplate) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.templateName}」？`, '确认', { type: 'warning' })
    await deleteTemplate(row.id)
    ElMessage.success('已删除')
    fetchData()
  } catch {}
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.perf-template-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
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
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
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
    margin-top: 16px;
  }
}

.dim-block {
  padding: 12px;
  background: #fafbfc;
  border-radius: 8px;
  margin-bottom: 12px;

  .dim-header {
    display: flex;
    align-items: center;
  }

  .sub-block {
    margin-top: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 6px;

    .sub-header {
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
    }

    .sub-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }
  }
}

.node-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.weight-ok {
  color: #67c23a;
  font-weight: 700;
}

.weight-err {
  color: #f56c6c;
  font-weight: 700;
}

.preview-section {
  margin-top: 18px;

  .preview-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #ebeef5;
  }

  .preview-dim {
    padding: 10px 14px;
    background: #fafbfc;
    border-radius: 6px;
    margin-bottom: 10px;

    .preview-dim-head {
      display: flex;
      align-items: center;
      gap: 10px;

      .dim-name {
        font-weight: 600;
        color: #303133;
      }
    }

    .dim-desc {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }

    .sub-list {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .sub-item {
        display: flex;
        justify-content: space-between;
        padding: 4px 10px;
        background: #fff;
        border-radius: 4px;
        font-size: 13px;

        .sub-weight {
          color: #909399;
          font-size: 12px;
        }
      }
    }
  }
}

.grade-S {
  background: #67c23a !important;
  color: #fff !important;
  border: none !important;
}
.grade-A {
  background: #409eff !important;
  color: #fff !important;
  border: none !important;
}
.grade-B {
  background: #909399 !important;
  color: #fff !important;
  border: none !important;
}
.grade-C {
  background: #e6a23c !important;
  color: #fff !important;
  border: none !important;
}
.grade-D {
  background: #f56c6c !important;
  color: #fff !important;
  border: none !important;
}
</style>
