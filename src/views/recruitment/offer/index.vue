<template>
  <div class="offer-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="Offer 编号">
            <el-input v-model="queryParams.offerNo" placeholder="请输入 Offer 编号" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="候选人">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="岗位">
            <el-input v-model="queryParams.positionName" placeholder="请输入岗位" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="选择状态" style="width: 140px" clearable>
              <el-option label="待审批" :value="1" />
              <el-option label="已批准" :value="2" />
              <el-option label="审批拒绝" :value="3" />
              <el-option label="已发送" :value="4" />
              <el-option label="候选人接受" :value="5" />
              <el-option label="候选人拒绝" :value="6" />
              <el-option label="已失效" :value="7" />
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
            创建 Offer
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="offerNo" label="Offer 编号" min-width="11%" />
          <el-table-column prop="candidateName" label="候选人" min-width="8%" />
          <el-table-column prop="positionName" label="入职岗位" min-width="12%" />
          <el-table-column prop="departmentName" label="部门" min-width="9%" />
          <el-table-column label="薪资/试用期" min-width="12%">
            <template #default="{ row }">
              <div>{{ row.salary }}</div>
              <div class="sub">试用期 {{ row.probationPeriod }} 个月</div>
            </template>
          </el-table-column>
          <el-table-column label="预计入职" min-width="10%">
            <template #default="{ row }">{{ row.expectedJoinDate }}</template>
          </el-table-column>
          <el-table-column label="版本" min-width="6%">
            <template #default="{ row }">v{{ row.version || 1 }}</template>
          </el-table-column>
          <el-table-column label="状态" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.status === 2" type="info">已批准</el-tag>
              <el-tag v-else-if="row.status === 3" type="danger">审批拒绝</el-tag>
              <el-tag v-else-if="row.status === 4" type="primary">已发送</el-tag>
              <el-tag v-else-if="row.status === 5" type="success">已接受</el-tag>
              <el-tag v-else-if="row.status === 6" type="danger">候选人拒绝</el-tag>
              <el-tag v-else-if="row.status === 7" type="info">已失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="24%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">详情</el-button>
              <el-button v-if="row.status === 1" link type="primary" @click="handleApprove(row)">审批</el-button>
              <el-button v-if="row.status === 2" link type="success" @click="handleSend(row)">发送</el-button>
              <el-button v-if="row.status === 4" link type="primary" @click="handleCandidateResponse(row)">
                候选人响应
              </el-button>
              <el-button v-if="row.status === 4" link type="warning" @click="handleWithdraw(row)">
                撤回
              </el-button>
              <el-button v-if="row.status === 4 || row.status === 6" link type="warning" @click="handleNewVersion(row)">
                新版本
              </el-button>
              <el-button v-if="row.status === 2" link type="success" @click="handleESign(row)">
                发起电子签
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
        @size-change="getList"
        @current-change="getList"
      />
    </el-card>

    <!-- 创建/编辑 Offer 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="候选人姓名" prop="candidateName">
              <CandidatePicker v-model="formData.candidateName" @select="onCandidatePick" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职岗位" prop="positionName">
              <el-input v-model="formData.positionName" placeholder="入职岗位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职部门" prop="departmentName">
              <el-input v-model="formData.departmentName" placeholder="入职部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地点" prop="workLocation">
              <el-input v-model="formData.workLocation" placeholder="工作地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary">
              <el-input v-model="formData.salary" placeholder="如：20K/月" />
              <AISalarySanityInline
                :context="buildSalaryCheckInput()"
                :required-fields="[formData.candidateName, formData.positionName, formData.salary]"
                :target-name="formData.candidateName || ''"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试用期薪资">
              <el-input v-model="formData.probationSalary" placeholder="如：16K/月" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试用期" prop="probationPeriod">
              <el-input v-model.number="formData.probationPeriod" placeholder="如：3">
                <template #suffix>个月</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计入职日期" prop="expectedJoinDate">
              <el-date-picker
                v-model="formData.expectedJoinDate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇报对象">
              <el-input v-model="formData.reportingTo" placeholder="如：张总监" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反馈截止">
              <el-date-picker
                v-model="formData.feedbackDeadline"
                type="date"
                placeholder="默认发放后 3 个工作日"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Offer 模板">
          <el-select
            v-model="formData.offerTemplateId"
            placeholder="选择 Offer 模板（选择后将自动渲染正文）"
            style="width: 100%"
            clearable
            @change="handleSelectTemplate"
          >
            <el-option
              v-for="t in offerTemplates"
              :key="t.id"
              :label="`${t.templateName} - ${t.language === 'zh' ? '中文' : t.language === 'en' ? '英文' : '双语'}`"
              :value="t.id"
            />
          </el-select>
          <div class="form-hint">
            变量将自动替换为：候选人姓名 / 入职岗位 / 入职部门 / 薪资 / 入职日期 / 工作地点 / 试用期 / 汇报对象
          </div>
        </el-form-item>

        <el-form-item label="福利待遇">
          <el-input v-model="formData.benefits" type="textarea" :rows="2" placeholder="福利待遇" />
        </el-form-item>

        <el-form-item label="其他说明">
          <el-input v-model="formData.otherInfo" type="textarea" :rows="2" placeholder="其他说明" />
        </el-form-item>

        <el-form-item label="Offer 正文预览">
          <div class="offer-preview" v-if="renderedContent">
            <pre>{{ renderedContent }}</pre>
          </div>
          <div v-else class="form-hint">选择模板后此处展示渲染后的完整 Offer 正文</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">{{ formData.id ? '保存' : '创建' }}</el-button>
      </template>
    </el-dialog>


    <!-- 审批弹窗 -->
    <el-dialog v-model="approveVisible" title="审批 Offer" width="520px">
      <el-form :model="approveForm" label-width="100px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approveForm.result">
            <el-radio :value="2">批准</el-radio>
            <el-radio :value="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="approveForm.remark" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 候选人响应弹窗 -->
    <el-dialog v-model="responseVisible" title="候选人响应" width="520px">
      <el-form :model="responseForm" label-width="100px">
        <el-form-item label="响应结果">
          <el-radio-group v-model="responseForm.accept">
            <el-radio :value="true">接受 Offer</el-radio>
            <el-radio :value="false">拒绝 Offer</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!responseForm.accept" label="拒绝原因" required>
          <el-select v-model="responseForm.reasonCode" placeholder="请选择拒绝原因" style="width: 100%">
            <el-option
              v-for="r in OFFER_REJECT_REASON_OPTIONS"
              :key="r.code"
              :label="r.label"
              :value="r.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!responseForm.accept" label="补充说明">
          <el-input v-model="responseForm.reasonRemark" type="textarea" :rows="3" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="responseVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResponseSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="Offer 详情" width="780px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Offer 编号">{{ detailData.offerNo }}</el-descriptions-item>
        <el-descriptions-item label="版本号">v{{ detailData.version || 1 }}</el-descriptions-item>
        <el-descriptions-item label="候选人">{{ detailData.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="入职岗位">{{ detailData.positionName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="工作地点">{{ detailData.workLocation }}</el-descriptions-item>
        <el-descriptions-item label="薪资">{{ detailData.salary }}</el-descriptions-item>
        <el-descriptions-item label="试用期">{{ detailData.probationPeriod }} 个月</el-descriptions-item>
        <el-descriptions-item label="试用期薪资">{{ detailData.probationSalary || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预计入职">{{ detailData.expectedJoinDate }}</el-descriptions-item>
        <el-descriptions-item label="汇报对象">{{ detailData.reportingTo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="反馈截止">{{ detailData.feedbackDeadline || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="info">已批准</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="danger">审批拒绝</el-tag>
          <el-tag v-else-if="detailData.status === 4" type="primary">已发送</el-tag>
          <el-tag v-else-if="detailData.status === 5" type="success">已接受</el-tag>
          <el-tag v-else-if="detailData.status === 6" type="danger">候选人拒绝</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="福利" :span="2">{{ detailData.benefits || '-' }}</el-descriptions-item>
        <el-descriptions-item label="其他说明" :span="2">{{ detailData.otherInfo || '-' }}</el-descriptions-item>
        <el-descriptions-item v-if="detailData.rejectReasonText" label="拒绝原因" :span="2">
          <el-alert type="error" :closable="false" show-icon :title="detailData.rejectReasonText" />
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="detailData.offerContent" class="offer-body-preview">
        <div class="body-title">Offer 正文</div>
        <pre>{{ detailData.offerContent }}</pre>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Offer, OfferListParams, Resume } from '@/types/recruitment'
import { OFFER_REJECT_REASON_OPTIONS } from '@/types/recruitment'
import CandidatePicker from '@/views/recruitment/_shared/CandidatePicker.vue'
import type { OfferTemplate } from '@/types/recruitmentConfig'
import {
  getOfferList,
  addOffer,
  updateOffer,
  updateOfferVersion,
  deleteOffer,
  batchDeleteOffers,
  candidateAcceptOffer,
  candidateRejectOffer,
  previewOfferRender,
  withdrawOffer
} from '@/api/offer'
import { offerTemplateApi } from '@/api/recruitmentConfig'
import { useUserStore } from '@/store/modules/user'
import AISalarySanityInline from '@/components/business/AISalarySanityInline.vue'

defineOptions({ name: 'RecruitmentOffer' })

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 选中简历池候选人 → 预填关联字段
const onCandidatePick = (r: Resume) => {
  formData.candidateName = r.candidateName
  if (r.position) formData.positionName = r.position
  formData.resumeId = r.id
  if (r.resumeNo) formData.resumeNo = r.resumeNo
}

const queryParams = reactive<OfferListParams>({
  offerNo: '',
  candidateName: '',
  positionName: '',
  status: null,
  page: 1,
  pageSize: 10
})

const tableData = ref<Offer[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 创建/编辑
const dialogVisible = ref(false)
const dialogTitle = ref('创建 Offer')
const formRef = ref<FormInstance>()
// AI 薪酬合理性检查（inline debounce 自动触发）
const buildSalaryCheckInput = () => {
  return `候选人：${formData.candidateName || '-'}（应聘岗位：${formData.positionName || '-'}）\n薪资方案：${formData.salary || '-'}\n试用期薪资：${formData.probationSalary || '-'}\n试用期：${formData.probationPeriod || '-'} 个月\n备注：请诊断该 Offer 薪资是否偏离公司带宽、是否存在与同岗位或 Leader 的倒挂风险，并给出调整建议。`
}

const formData = reactive<Partial<Offer>>({
  candidateName: '',
  positionName: '',
  departmentName: '',
  workLocation: '',
  salary: '',
  probationSalary: '',
  probationPeriod: 3,
  expectedJoinDate: '',
  benefits: '',
  otherInfo: '',
  reportingTo: '',
  feedbackDeadline: '',
  offerTemplateId: undefined,
  offerTemplateName: undefined,
  offerContent: ''
})
const formRules: FormRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入入职岗位', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入入职部门', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资', trigger: 'blur' }],
  probationPeriod: [{ required: true, message: '请输入试用期', trigger: 'blur' }],
  expectedJoinDate: [{ required: true, message: '请选择预计入职日期', trigger: 'change' }]
}

// 审批
const approveVisible = ref(false)
const approveForm = reactive({ id: 0, result: 2, remark: '' })

// 候选人响应
const responseVisible = ref(false)
const responseForm = reactive({
  id: 0,
  accept: true as boolean,
  reasonCode: '',
  reasonRemark: ''
})

// 详情
const detailVisible = ref(false)
const detailData = ref<Partial<Offer>>({})

// Offer 模板
const offerTemplates = ref<OfferTemplate[]>([])
const loadOfferTemplates = async () => {
  const res = await offerTemplateApi.getList({ page: 1, pageSize: 100 })
  if (res.code === 200) {
    offerTemplates.value = res.data.list.filter((t: any) => t.status === 1)
  }
}

// 变量渲染
const buildVariables = () => ({
  候选人姓名: formData.candidateName || '',
  入职岗位: formData.positionName || '',
  入职部门: formData.departmentName || '',
  薪资: formData.salary || '',
  入职日期: formData.expectedJoinDate || '',
  工作地点: formData.workLocation || '',
  试用期: formData.probationPeriod ? `${formData.probationPeriod}个月` : '',
  汇报对象: formData.reportingTo || ''
})

const renderedContent = computed(() => {
  if (!formData.offerTemplateId) return ''
  const t = offerTemplates.value.find((x) => x.id === formData.offerTemplateId)
  if (!t) return ''
  return previewOfferRender(t.content, buildVariables())
})

const handleSelectTemplate = (id: number | undefined) => {
  if (!id) {
    formData.offerTemplateName = undefined
    return
  }
  const t = offerTemplates.value.find((x) => x.id === id)
  formData.offerTemplateName = t?.templateName
}

// 列表
const getList = async () => {
  try {
    const res = await getOfferList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('获取 Offer 列表失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  getList()
}

const handleReset = () => {
  queryParams.offerNo = ''
  queryParams.candidateName = ''
  queryParams.positionName = ''
  queryParams.status = null
  queryParams.page = 1
  getList()
}

const handleSelectionChange = (selection: Offer[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '创建 Offer'
  Object.assign(formData, {
    id: undefined,
    candidateName: '',
    positionName: '',
    departmentName: '',
    workLocation: '',
    salary: '',
    probationSalary: '',
    probationPeriod: 3,
    expectedJoinDate: '',
    benefits: '',
    otherInfo: '',
    reportingTo: '',
    feedbackDeadline: '',
    offerTemplateId: undefined,
    offerTemplateName: undefined,
    offerContent: ''
  })
  dialogVisible.value = true
}

// 详情
const handleView = (row: Offer) => {
  detailData.value = row
  detailVisible.value = true
}

// 审批
const handleApprove = (row: Offer) => {
  approveForm.id = row.id
  approveForm.result = 2
  approveForm.remark = ''
  approveVisible.value = true
}

const handleApproveSubmit = async () => {
  try {
    const u = userStore.getUserInfo
    await updateOffer({
      id: approveForm.id,
      status: approveForm.result,
      approverId: u.id,
      approverName: u.nickname,
      approveTime: new Date().toLocaleString('zh-CN'),
      approveRemark: approveForm.remark
    } as any)
    ElMessage.success('审批完成')
    approveVisible.value = false
    getList()
  } catch {
    ElMessage.error('审批失败')
  }
}

// 发送
const handleSend = async (row: Offer) => {
  try {
    await ElMessageBox.confirm(`确定向候选人「${row.candidateName}」发送 Offer 吗？`, '提示', { type: 'warning' })
    await updateOffer({
      id: row.id,
      status: 4,
      sendTime: new Date().toLocaleString('zh-CN')
    } as any)
    ElMessage.success('Offer 已发送，等待候选人响应')
    getList()
  } catch {
    // 取消
  }
}

// 候选人响应
const handleCandidateResponse = (row: Offer) => {
  responseForm.id = row.id
  responseForm.accept = true
  responseForm.reasonCode = ''
  responseForm.reasonRemark = ''
  responseVisible.value = true
}

const handleResponseSubmit = async () => {
  try {
    if (responseForm.accept) {
      await candidateAcceptOffer(responseForm.id)
      ElMessage.success('候选人已接受 Offer')
    } else {
      if (!responseForm.reasonCode) {
        ElMessage.warning('请选择拒绝原因')
        return
      }
      const reason = OFFER_REJECT_REASON_OPTIONS.find((r) => r.code === responseForm.reasonCode)
      const reasonText = reason
        ? reason.label + (responseForm.reasonRemark ? `（${responseForm.reasonRemark}）` : '')
        : responseForm.reasonRemark
      await candidateRejectOffer(responseForm.id, responseForm.reasonCode, reasonText)
      ElMessage.success('已记录候选人拒绝原因')
    }
    responseVisible.value = false
    getList()
  } catch {
    ElMessage.error('操作失败')
  }
}

// 撤回 Offer（任务 B1）
const handleWithdraw = async (row: Offer) => {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      `确定撤回「${row.candidateName}」的 Offer 吗？请输入撤回原因：`,
      '撤回 Offer',
      {
        confirmButtonText: '确定撤回',
        cancelButtonText: '取消',
        type: 'warning',
        inputPlaceholder: '如：薪资方案调整 / 岗位需求变更',
        inputValidator: (v) => (v && v.trim() ? true : '请输入撤回原因')
      }
    )
    await withdrawOffer(row.id, reason)
    ElMessage.success('Offer 已撤回')
    getList()
  } catch {
    // 取消
  }
}

// 发起电子签（任务 C：外部依赖占位）
const handleESign = (row: Offer) => {
  ElMessageBox.alert(
    `Offer 编号：${row.offerNo}\n候选人：${row.candidateName}\n\n该功能需要对接第三方电子签服务（e签宝 / 法大大 / DocuSign），当前为占位按钮。后续接入后将自动发送签署链接给候选人。`,
    '电子签 - 接入开发中',
    {
      confirmButtonText: '我知道了',
      type: 'info'
    }
  )
}

// 生成新版本
const handleNewVersion = async (row: Offer) => {
  // 用当前数据填入 formData，提交时走 updateOfferVersion
  dialogTitle.value = '生成新版本（v' + ((row.version || 1) + 1) + '）'
  Object.assign(formData, {
    ...row,
    offerContent: ''
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Offer) => {
  try {
    await ElMessageBox.confirm('确定删除该 Offer 吗？', '提示', { type: 'warning' })
    await deleteOffer(row.id)
    ElMessage.success('已删除')
    getList()
  } catch {
    // 取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条 Offer 吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteOffers(selectedIds.value)
    ElMessage.success('已删除')
    getList()
  } catch {
    // 取消
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const content = renderedContent.value
      const u = userStore.getUserInfo
      if (formData.id) {
        // 版本升级
        await updateOfferVersion(formData.id, { ...formData, offerContent: content }, content)
        ElMessage.success('新版本已生成')
      } else {
        const now = new Date()
        const offerNo = `OF${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-4)}`
        await addOffer({
          ...formData,
          offerNo,
          offerContent: content,
          creatorId: u.id,
          creatorName: u.nickname,
          status: 1
        } as any)
        ElMessage.success('Offer 创建成功，待审批')
      }
      dialogVisible.value = false
      getList()
      // 从候选人详情页跳转来，提交成功后返回
      if (route.query.from === 'detail') {
        router.back()
      }
    } catch (e: any) {
      ElMessage.error(e?.message || '操作失败')
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(async () => {
  loadOfferTemplates()
  getList()
  // 候选人详情页跳转而来：自动打开新增 Dialog 并预填
  if (route.query.prefill === 'new') {
    await nextTick()
    handleAdd()
    const q = route.query
    if (q.candidateName) formData.candidateName = String(q.candidateName)
    if (q.positionName) formData.positionName = String(q.positionName)
    if (q.resumeId) formData.resumeId = Number(q.resumeId) || 0
    const from = route.query.from
    router.replace({ query: from ? { from: String(from) } : {} })
  }
})
</script>

<style scoped lang="scss">
.offer-container {
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

    .sub {
      font-size: 12px;
      color: #909399;
    }
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.offer-preview {
  max-height: 280px;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 12px;
  border-radius: 6px;
  width: 100%;

  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    line-height: 1.8;
    font-size: 13px;
    color: #303133;
  }
}

.offer-body-preview {
  margin-top: 20px;

  .body-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #303133;
  }

  pre {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
    line-height: 1.8;
    font-family: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
