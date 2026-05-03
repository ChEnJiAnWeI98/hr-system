<template>
  <div class="interview-container">
    <ModuleTabBar :tabs="interviewGroupTabs" />
    <!-- 面试列表视图 -->
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="面试编号">
            <el-input v-model="queryParams.interviewNo" placeholder="请输入面试编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="候选人姓名">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="应聘岗位">
            <el-input v-model="queryParams.position" placeholder="请输入应聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="面试类型">
            <el-select v-model="queryParams.interviewType" placeholder="请选择面试类型" style="width: 150px" clearable>
              <el-option label="初试" :value="1" />
              <el-option label="复试" :value="2" />
              <el-option label="终试" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="待面试" :value="1" />
              <el-option label="已完成" :value="2" />
              <el-option label="已取消" :value="3" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            安排面试
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="interviewNo" label="面试编号" min-width="10%" />
          <el-table-column prop="candidateName" label="候选人姓名" min-width="10%" />
          <el-table-column prop="position" label="应聘岗位" min-width="10%" />
          <el-table-column prop="round" label="面试轮次" min-width="8%">
            <template #default="{ row }">
              第{{ row.round }}轮
            </template>
          </el-table-column>
          <el-table-column prop="interviewType" label="面试类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.interviewType === 1" type="primary">初试</el-tag>
              <el-tag v-else-if="row.interviewType === 2" type="success">复试</el-tag>
              <el-tag v-else-if="row.interviewType === 3" type="warning">终试</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="interviewTime" label="面试时间" min-width="12%" />
          <el-table-column prop="interviewer" label="面试官" min-width="10%" />
          <el-table-column prop="location" label="面试地点" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待面试</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已完成</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="primary" :disabled="row.status !== 1" @click="handleEvaluate(row)">
                填写评价
              </el-button>
              <el-button link type="danger" :disabled="row.status !== 1" @click="handleCancel(row)">
                取消面试
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 安排面试弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="候选人姓名" prop="candidateName">
          <CandidatePicker v-model="formData.candidateName" @select="onCandidatePick" />
        </el-form-item>

        <el-form-item label="应聘岗位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入应聘岗位" />
        </el-form-item>

        <el-form-item label="面试轮次" prop="round">
          <el-input v-model.number="formData.round" placeholder="请输入面试轮次" />
        </el-form-item>

        <el-form-item label="面试类型" prop="interviewType">
          <el-select v-model="formData.interviewType" placeholder="请选择面试类型" style="width: 100%">
            <el-option label="初试" :value="1" />
            <el-option label="复试" :value="2" />
            <el-option label="终试" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="面试时间" prop="interviewTime">
          <el-date-picker
            v-model="formData.interviewTime"
            type="datetime"
            placeholder="请选择面试时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="面试官" prop="interviewer">
          <el-input v-model="formData.interviewer" placeholder="请输入面试官" />
        </el-form-item>

        <el-form-item label="面试地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入面试地点" />
        </el-form-item>

        <el-form-item
          v-if="formData.interviewType === 2"
          label="视频面试链接"
          prop="videoLink"
        >
          <el-input v-model="formData.videoLink" placeholder="如腾讯会议 / Zoom 链接（选填）">
            <template #append>
              <el-button @click="handleGenerateVideoLink">一键生成腾讯会议</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="评价模板">
          <el-select
            v-model="formData.evaluationTemplateId"
            placeholder="选择面试评价模板（选填）"
            style="width: 100%"
            clearable
            @change="handleSelectTemplate"
          >
            <el-option
              v-for="t in evalTemplates"
              :key="t.id"
              :label="`${t.templateName}${t.applicableJobFamily ? ' - ' + t.applicableJobFamily : ''}`"
              :value="t.id"
            />
          </el-select>
          <div class="form-hint">选择后，面试官填写评价时会按该模板的维度打分</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 填写评价弹窗（Phase 2.2：按模板多维度打分） -->
    <el-dialog
      v-model="evaluateDialogVisible"
      title="填写面试评价"
      width="680px"
      @close="handleEvaluateDialogClose"
    >
      <el-alert
        v-if="!currentTemplate"
        type="warning"
        :closable="false"
        show-icon
        title="该面试未关联评价模板，将按通用方式打分。建议在安排面试时选择合适的评价模板。"
        style="margin-bottom: 12px"
      />
      <el-alert
        v-else
        type="info"
        :closable="false"
        show-icon
        :title="`当前模板：${currentTemplate.templateName}（${currentTemplate.scoreRule === 'weighted' ? '加权平均' : '简单求和'}）`"
        style="margin-bottom: 12px"
      />

      <!-- 按模板维度打分 -->
      <div v-if="currentTemplate" class="evaluation-form">
        <el-form :model="evalForm" label-width="120px">
          <el-form-item
            v-for="(d, idx) in evalForm.dimensions"
            :key="d.dimensionName"
            :label="d.dimensionName"
          >
            <div class="dim-row">
              <el-rate v-model="d.score" :max="d.maxScore" allow-half show-score />
              <span class="dim-weight">权重：{{ currentTemplate.dimensions[idx]?.weight }}%</span>
            </div>
            <div v-if="currentTemplate.dimensions[idx]?.description" class="dim-desc">
              {{ currentTemplate.dimensions[idx].description }}
            </div>
          </el-form-item>

          <el-form-item label="评语">
            <el-input v-model="evalForm.comment" type="textarea" :rows="4" placeholder="请输入评语，帮助团队共同决策" />
          </el-form-item>

          <el-form-item label="结果建议">
            <el-select v-model="evalForm.resultSuggestion" style="width: 100%">
              <el-option v-for="r in currentTemplate.resultOptions" :key="r" :label="r" :value="r" />
            </el-select>
          </el-form-item>

          <el-form-item label="总分">
            <div class="total-score">
              <el-tag size="large" :type="computedTotal >= 80 ? 'success' : computedTotal >= 60 ? 'warning' : 'danger'">
                {{ computedTotal }} 分
              </el-tag>
              <span class="hint">系统根据维度权重自动计算</span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 无模板时回退到简单打分 -->
      <div v-else>
        <el-form label-width="100px">
          <el-form-item label="综合评分">
            <el-rate v-model="evalForm.simpleRating" :max="5" show-score />
          </el-form-item>
          <el-form-item label="评价内容">
            <el-input v-model="evalForm.comment" type="textarea" :rows="5" placeholder="请输入评价内容" />
          </el-form-item>
          <el-form-item label="结果">
            <el-select v-model="evalForm.resultSuggestion" style="width: 100%">
              <el-option label="通过" value="通过" />
              <el-option label="待定" value="待定" />
              <el-option label="不通过" value="不通过" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 已提交的其他面试官评价预览 -->
      <div v-if="otherEvaluations.length > 0" class="other-evals">
        <div class="others-title">其他面试官评价（{{ otherEvaluations.length }} 位）</div>
        <div v-for="e in otherEvaluations" :key="e.id" class="other-eval-item">
          <div class="other-eval-head">
            <span class="other-name">{{ e.interviewerName }}</span>
            <el-tag size="small">{{ e.resultSuggestion }}</el-tag>
            <span class="other-score">{{ e.totalScore }} 分</span>
          </div>
          <div class="other-comment" v-if="e.comment">"{{ e.comment }}"</div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="evaluateDialogVisible = false">取消</el-button>
          <el-button @click="handleSaveEvalDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmitEval">
            提交评价（提交后其他面试官可见）
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="面试详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="面试编号">{{ detailData.interviewNo }}</el-descriptions-item>
        <el-descriptions-item label="候选人姓名">{{ detailData.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="应聘岗位">{{ detailData.position }}</el-descriptions-item>
        <el-descriptions-item label="面试轮次">第{{ detailData.round }}轮</el-descriptions-item>
        <el-descriptions-item label="面试类型">
          <el-tag v-if="detailData.interviewType === 1" type="primary">初试</el-tag>
          <el-tag v-else-if="detailData.interviewType === 2" type="success">复试</el-tag>
          <el-tag v-else-if="detailData.interviewType === 3" type="warning">终试</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="面试时间">{{ detailData.interviewTime }}</el-descriptions-item>
        <el-descriptions-item label="面试官">{{ detailData.interviewer }}</el-descriptions-item>
        <el-descriptions-item label="面试地点">{{ detailData.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待面试</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已完成</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="info">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评分" v-if="detailData.rating">
          <el-rate v-model="detailData.rating" :max="5" disabled show-score />
        </el-descriptions-item>
        <el-descriptions-item label="评价内容" :span="2" v-if="detailData.evaluation">
          {{ detailData.evaluation }}
        </el-descriptions-item>
        <el-descriptions-item label="面试结果" v-if="detailData.result">
          <el-tag v-if="detailData.result === 1" type="success">通过</el-tag>
          <el-tag v-else-if="detailData.result === 2" type="danger">不通过</el-tag>
          <el-tag v-else-if="detailData.result === 3" type="warning">待定</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import CandidatePicker from '@/views/recruitment/_shared/CandidatePicker.vue'

const interviewGroupTabs = [
  { label: '面试列表', path: '/recruit/interview' },
  { label: '面试官效率', path: '/recruit/interview-stats' }
]
import type { Resume, Interview, InterviewListParams } from '@/types/recruitment'
import {
  getInterviewList,
  addInterview,
  updateInterview,
  batchDeleteInterview,
  cancelInterview,
  evaluateInterview,
  getInterviewEvaluations,
  getMyEvaluation,
  saveInterviewEvaluation
} from '@/api/recruitment/interview'
import { interviewEvaluationTemplateApi } from '@/api/recruitmentConfig'
import type { InterviewEvaluationTemplate, EvaluationDimension } from '@/types/recruitmentConfig'
import type { InterviewEvaluation } from '@/types/recruitment'
import { useUserStore } from '@/store/modules/user'
import { computed } from 'vue'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 选中简历池候选人 → 预填关联字段
const onCandidatePick = (r: Resume) => {
  formData.candidateName = r.candidateName
  if (r.position) formData.position = r.position
  formData.resumeId = r.id
  if (r.resumeNo) formData.resumeNo = r.resumeNo
}

defineOptions({
  name: 'RecruitmentInterview'
})

// Phase 2.2：面试评价模板列表
const evalTemplates = ref<InterviewEvaluationTemplate[]>([])
const loadEvalTemplates = async () => {
  const res = await interviewEvaluationTemplateApi.getList({ page: 1, pageSize: 100 })
  if (res.code === 200) {
    evalTemplates.value = res.data.list.filter((t: any) => t.status === 1)
  }
}

// 选中模板时自动填入模板名（存入 formData.evaluationTemplateName）
const handleSelectTemplate = (id: number | undefined) => {
  if (!id) {
    formData.evaluationTemplateName = undefined
    return
  }
  const t = evalTemplates.value.find((x) => x.id === id)
  formData.evaluationTemplateName = t?.templateName
}

// 任务 C：一键生成腾讯会议链接（占位，外部依赖）
const handleGenerateVideoLink = () => {
  ElMessageBox.confirm(
    '该功能需要对接腾讯会议/Zoom 的开放 API，当前为占位操作。是否生成一个演示链接？',
    '视频面试 - 外部集成开发中',
    { confirmButtonText: '生成演示链接', cancelButtonText: '取消', type: 'info' }
  )
    .then(() => {
      const demoLink = `https://meeting.tencent.com/dm/${Math.random().toString(36).slice(2, 10)}`
      formData.videoLink = demoLink
      ElMessage.success('演示链接已生成（非真实会议，待正式接入）')
    })
    .catch(() => {})
}

// 查询参数
const queryParams = reactive<InterviewListParams>({
  interviewNo: '',
  candidateName: '',
  position: '',
  interviewType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Interview[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('安排面试')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<Interview>>({
  candidateName: '',
  position: '',
  round: 1,
  interviewType: 1,
  interviewTime: '',
  interviewer: '',
  location: '',
  videoLink: '',
  evaluationTemplateId: undefined,
  evaluationTemplateName: undefined
})

const formRules: FormRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入应聘岗位', trigger: 'blur' }],
  round: [{ required: true, message: '请输入面试轮次', trigger: 'blur' }],
  interviewType: [{ required: true, message: '请选择面试类型', trigger: 'change' }],
  interviewTime: [{ required: true, message: '请选择面试时间', trigger: 'change' }],
  interviewer: [{ required: true, message: '请输入面试官', trigger: 'blur' }],
  location: [{ required: true, message: '请输入面试地点', trigger: 'blur' }]
}

// Phase 2.2：评价弹窗（多维度动态模板）
const evaluateDialogVisible = ref(false)
const currentInterview = ref<Interview | null>(null)
const currentTemplate = ref<InterviewEvaluationTemplate | null>(null)
const evalForm = reactive({
  dimensions: [] as { dimensionName: string; score: number; maxScore: number }[],
  comment: '',
  resultSuggestion: '通过',
  simpleRating: 0 // 无模板时回退
})
const otherEvaluations = ref<InterviewEvaluation[]>([])

// 总分计算（根据模板的加权/求和规则）
const computedTotal = computed(() => {
  if (!currentTemplate.value) return evalForm.simpleRating * 20
  if (currentTemplate.value.scoreRule === 'weighted') {
    let sum = 0
    evalForm.dimensions.forEach((d, idx) => {
      const weight = currentTemplate.value!.dimensions[idx]?.weight || 0
      sum += (d.score / d.maxScore) * 100 * (weight / 100)
    })
    return Math.round(sum)
  }
  // 简单求和
  let sum = 0
  evalForm.dimensions.forEach((d) => {
    sum += (d.score / d.maxScore) * 100
  })
  return Math.round(sum / evalForm.dimensions.length)
})

// 详情弹窗相关
const detailDialogVisible = ref(false)
const detailData = ref<Interview>({} as Interview)

// 获取列表数据
const getList = async () => {
  try {
    const res = await getInterviewList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取面试列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.interviewNo = ''
  queryParams.candidateName = ''
  queryParams.position = ''
  queryParams.interviewType = null
  queryParams.status = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 表格选择
const handleSelectionChange = (selection: Interview[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '安排面试'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateInterview(formData)
          ElMessage.success('更新成功')
        } else {
          await addInterview(formData)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        getList()
        // 从候选人详情页跳转来，提交成功后返回详情页
        if (route.query.from === 'detail') {
          router.back()
        }
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.candidateName = ''
  formData.position = ''
  formData.round = 1
  formData.interviewType = 1
  formData.interviewTime = ''
  formData.interviewer = ''
  formData.location = ''
}

// 批量删除
const handleBatchDelete = async () => {
  ElMessageBox.confirm('确定要删除选中的面试记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteInterview(selectedIds.value)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 查看详情
const handleView = (row: Interview) => {
  detailData.value = { ...row }
  detailDialogVisible.value = true
}

// 填写评价（Phase 2.2：按模板动态渲染维度 + 加载他人评价）
const handleEvaluate = async (row: Interview) => {
  currentInterview.value = row

  // 加载关联的评价模板
  if (row.evaluationTemplateId) {
    const t = evalTemplates.value.find((x) => x.id === row.evaluationTemplateId)
    currentTemplate.value = t || null
  } else {
    currentTemplate.value = null
  }

  // 初始化维度数组
  if (currentTemplate.value) {
    evalForm.dimensions = currentTemplate.value.dimensions.map((d: EvaluationDimension) => ({
      dimensionName: d.name,
      score: 0,
      maxScore: d.maxScore
    }))
    evalForm.resultSuggestion = currentTemplate.value.resultOptions[0] || '通过'
  } else {
    evalForm.dimensions = []
    evalForm.simpleRating = row.rating || 0
    evalForm.resultSuggestion = row.result === 1 ? '通过' : row.result === 2 ? '不通过' : '待定'
  }
  evalForm.comment = ''

  // 加载当前用户已有的草稿/评价（如果有）
  const uid = userStore.getUserInfo.id as number
  const myRes = await getMyEvaluation(row.id, uid)
  if (myRes?.data) {
    const existing = myRes.data
    try {
      const parsedDims = JSON.parse(existing.dimensionScores || '[]')
      if (parsedDims.length > 0 && currentTemplate.value) {
        evalForm.dimensions = parsedDims
      }
    } catch {}
    evalForm.comment = existing.comment || ''
    evalForm.resultSuggestion = existing.resultSuggestion || '通过'
  }

  // 加载其他面试官已提交评价
  const othersRes = await getInterviewEvaluations(row.id, uid)
  if (othersRes?.data) {
    otherEvaluations.value = (othersRes.data || []).filter((e: InterviewEvaluation) => e.interviewerId !== uid)
  }

  evaluateDialogVisible.value = true
}

// 保存草稿
const handleSaveEvalDraft = async () => {
  await submitEvaluationInner(false)
}

// 提交评价
const handleSubmitEval = async () => {
  await submitEvaluationInner(true)
}

// 提交评价（内部）
const submitEvaluationInner = async (submit: boolean) => {
  if (!currentInterview.value) return
  const u = userStore.getUserInfo
  try {
    await saveInterviewEvaluation(
      {
        interviewId: currentInterview.value.id,
        interviewerId: u.id,
        interviewerName: u.nickname,
        dimensionScores: JSON.stringify(evalForm.dimensions),
        totalScore: computedTotal.value,
        comment: evalForm.comment,
        resultSuggestion: evalForm.resultSuggestion
      },
      submit
    )
    if (submit) {
      // 提交后也把面试状态改为"已完成"并写入汇总评价
      const resultEnum = evalForm.resultSuggestion.includes('不通过')
        ? 2
        : evalForm.resultSuggestion.includes('待定')
          ? 3
          : 1
      await evaluateInterview({
        id: currentInterview.value.id,
        rating: Math.round(computedTotal.value / 20), // 百分转 5 星
        evaluation: evalForm.comment || '',
        result: resultEnum
      })
      ElMessage.success('评价已提交')
      evaluateDialogVisible.value = false
      getList()
    } else {
      ElMessage.success('草稿已保存')
    }
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败')
  }
}

const handleEvaluateDialogClose = () => {
  currentInterview.value = null
  currentTemplate.value = null
  otherEvaluations.value = []
  evalForm.dimensions = []
  evalForm.comment = ''
  evalForm.resultSuggestion = '通过'
  evalForm.simpleRating = 0
}

// 取消面试
const handleCancel = async (row: Interview) => {
  ElMessageBox.confirm('确定要取消该面试吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await cancelInterview(row.id)
      ElMessage.success('取消成功')
      getList()
    } catch (error) {
      ElMessage.error('取消失败')
    }
  })
}

onMounted(async () => {
  getList()
  loadEvalTemplates()
  // 候选人详情页跳转而来：自动打开新增 Dialog 并预填
  if (route.query.prefill === 'new') {
    await nextTick()
    handleAdd()
    const q = route.query
    if (q.candidateName) formData.candidateName = String(q.candidateName)
    if (q.position) formData.position = String(q.position)
    if (q.resumeId) formData.resumeId = Number(q.resumeId) || 0
    // 保留 from 以便提交后回跳，清掉 prefill 防止重复触发
    const from = route.query.from
    router.replace({ query: from ? { from: String(from) } : {} })
  }
})
</script>

<style scoped lang="scss">
.interview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}


/* Phase 2.2 新增样式 */
.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.evaluation-form {
  .dim-row {
    display: flex;
    align-items: center;
    gap: 20px;

    .dim-weight {
      font-size: 12px;
      color: #909399;
    }
  }

  .dim-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  .total-score {
    display: flex;
    align-items: center;
    gap: 12px;

    .hint {
      font-size: 12px;
      color: #909399;
    }
  }
}

.other-evals {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;

  .others-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #303133;
  }

  .other-eval-item {
    padding: 8px 0;

    .other-eval-head {
      display: flex;
      align-items: center;
      gap: 12px;

      .other-name {
        font-size: 13px;
        font-weight: 500;
        color: #303133;
      }

      .other-score {
        font-size: 12px;
        color: #606266;
      }
    }

    .other-comment {
      font-size: 12px;
      color: #606266;
      margin-top: 4px;
      font-style: italic;
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
