<template>
  <div class="offb-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="离职单号">
            <el-input v-model="queryParams.offboardingNo" placeholder="请输入单号" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="员工">
            <el-input v-model="queryParams.employeeName" placeholder="姓名" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="离职类型">
            <el-select v-model="queryParams.offboardingType" placeholder="全部" clearable style="width: 150px">
              <el-option
                v-for="(label, value) in OFFBOARDING_TYPE_LABEL"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 160px">
              <el-option
                v-for="(label, value) in OFFBOARDING_STATUS_LABEL"
                :key="value"
                :label="label"
                :value="value"
              />
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

    <!-- 列表 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-title">离职申请（共 {{ total }} 条）</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          发起离职
        </el-button>
      </div>
      <div class="table-container">
        <el-table :data="pagedData" height="100%" style="width: 100%">
          <el-table-column prop="offboardingNo" label="离职单号" width="160" fixed />
          <el-table-column prop="employeeName" label="员工" width="100" fixed />
          <el-table-column prop="orgName" label="组织" min-width="160" show-overflow-tooltip />
          <el-table-column prop="positionName" label="岗位" min-width="160" show-overflow-tooltip />
          <el-table-column label="离职类型" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="OFFBOARDING_TYPE_COLOR[row.offboardingType as OffboardingType]" size="small">
                {{ OFFBOARDING_TYPE_LABEL[row.offboardingType as OffboardingType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expectedLastDay" label="预计离职日" width="120" align="center" />
          <el-table-column prop="actualLastDay" label="实际离职日" width="120" align="center">
            <template #default="{ row }">
              {{ row.actualLastDay || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="OFFBOARDING_STATUS_TYPE[row.status as OffboardingStatus]" size="small">
                {{ OFFBOARDING_STATUS_LABEL[row.status as OffboardingStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="交接进度" width="150" align="center">
            <template #default="{ row }">
              <el-progress
                v-if="row.handoverItems.length"
                :percentage="handoverProgress(row)"
                :stroke-width="6"
                status="success"
              />
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column label="证明" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.certificateIssued" type="success" size="small">已出具</el-tag>
              <span v-else style="color: #c0c4cc">—</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情</el-button>
              <el-button
                v-if="isCancellable(row)"
                link
                type="danger"
                @click="handleCancel(row)"
              >
                撤销
              </el-button>
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
      />
    </el-card>

    <!-- 发起离职 Dialog -->
    <el-dialog v-model="addDialogVisible" title="发起离职" width="680px">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="员工">
          <EmployeeSelector
            v-model="addForm.employeeId"
            :status-filter="['regular', 'probation']"
            @change="onEmployeeChange"
          />
        </el-form-item>
        <el-form-item label="离职类型">
          <el-select v-model="addForm.offboardingType" style="width: 100%">
            <el-option
              v-for="(label, value) in OFFBOARDING_TYPE_LABEL"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预计离职日">
          <el-date-picker
            v-model="addForm.expectedLastDay"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="离职原因">
          <el-input v-model="addForm.reason" type="textarea" :rows="3" placeholder="请详细说明离职原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitOffboarding">提交审批</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Drawer -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="`离职详情 ${detail?.offboardingNo || ''}`"
      size="900px"
    >
      <template v-if="detail">
        <!-- 基本信息 + 操作按钮 -->
        <el-descriptions :column="2" border size="default">
          <el-descriptions-item label="员工">{{ detail.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="组织">{{ detail.orgName }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ detail.positionName }}</el-descriptions-item>
          <el-descriptions-item label="离职类型">
            <el-tag :type="OFFBOARDING_TYPE_COLOR[detail.offboardingType]" size="small">
              {{ OFFBOARDING_TYPE_LABEL[detail.offboardingType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预计离职日">{{ detail.expectedLastDay }}</el-descriptions-item>
          <el-descriptions-item label="实际离职日">{{ detail.actualLastDay || '—' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="OFFBOARDING_STATUS_TYPE[detail.status]" size="small">
              {{ OFFBOARDING_STATUS_LABEL[detail.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发起时间">{{ detail.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="离职原因" :span="2">{{ detail.reason }}</el-descriptions-item>
        </el-descriptions>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <el-button
            v-if="detail.status === 'dept_reviewing'"
            type="warning"
            size="small"
            @click="handleDeptApprove('approved')"
          >
            部门审批通过
          </el-button>
          <el-button
            v-if="detail.status === 'dept_reviewing'"
            size="small"
            @click="handleDeptApprove('rejected')"
          >
            部门驳回
          </el-button>
          <el-button
            v-if="detail.status === 'hr_reviewing'"
            type="warning"
            size="small"
            @click="handleHRApprove('approved')"
          >
            HR 审批通过
          </el-button>
          <el-button
            v-if="detail.status === 'hr_reviewing'"
            size="small"
            @click="handleHRApprove('rejected')"
          >
            HR 驳回
          </el-button>
          <el-button
            v-if="detail.status === 'handover' && allHandoverCompleted(detail)"
            type="primary"
            size="small"
            @click="handleCompleteHandover"
          >
            交接完成
          </el-button>
          <el-button
            v-if="detail.status === 'pending_last_day'"
            type="success"
            size="small"
            @click="handleCompleteOffboarding"
          >
            完成离职（员工档案变更为"已离职"）
          </el-button>
          <el-button
            v-if="detail.status === 'completed' && !detail.certificateIssued"
            type="primary"
            size="small"
            @click="handleIssueCertificate"
          >
            出具离职证明
          </el-button>
          <el-button
            v-if="detail.certificateIssued"
            type="success"
            size="small"
            @click="certificateDialogVisible = true"
          >
            查看离职证明
          </el-button>
        </div>

        <!-- Tabs -->
        <el-tabs v-model="activeTab" style="margin-top: 20px">
          <!-- Tab 1 审批流水 -->
          <el-tab-pane label="审批流水" name="approval">
            <el-timeline>
              <el-timeline-item
                type="info"
                :timestamp="detail.submitTime"
              >
                <b>员工发起离职</b>
                <div style="color: #606266; margin-top: 4px">{{ detail.reason }}</div>
              </el-timeline-item>
              <el-timeline-item
                v-if="detail.deptApprovalTime"
                :type="detail.deptApprovalResult === 'approved' ? 'success' : 'danger'"
                :timestamp="detail.deptApprovalTime"
              >
                <b>部门审批 · {{ detail.deptApproverName }}</b>
                <el-tag
                  :type="detail.deptApprovalResult === 'approved' ? 'success' : 'danger'"
                  size="small"
                  style="margin-left: 8px"
                >
                  {{ detail.deptApprovalResult === 'approved' ? '通过' : '驳回' }}
                </el-tag>
                <div v-if="detail.deptApprovalComment" style="color: #606266; margin-top: 4px">
                  {{ detail.deptApprovalComment }}
                </div>
              </el-timeline-item>
              <el-timeline-item
                v-if="detail.hrApprovalTime"
                :type="detail.hrApprovalResult === 'approved' ? 'success' : 'danger'"
                :timestamp="detail.hrApprovalTime"
              >
                <b>HR 审批 · {{ detail.hrApproverName }}</b>
                <el-tag
                  :type="detail.hrApprovalResult === 'approved' ? 'success' : 'danger'"
                  size="small"
                  style="margin-left: 8px"
                >
                  {{ detail.hrApprovalResult === 'approved' ? '通过' : '驳回' }}
                </el-tag>
                <div v-if="detail.hrApprovalComment" style="color: #606266; margin-top: 4px">
                  {{ detail.hrApprovalComment }}
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>

          <!-- Tab 2 交接清单 -->
          <el-tab-pane label="交接清单" name="handover">
            <template v-if="detail.handoverItems.length">
              <div
                v-for="cat in handoverCategories"
                :key="cat.code"
                class="handover-group"
              >
                <div class="handover-group-title">{{ cat.label }}</div>
                <el-table :data="itemsByCategory(cat.code)" size="small" border>
                  <el-table-column prop="content" label="交接内容" min-width="260" />
                  <el-table-column label="接收人" width="140">
                    <template #default="{ row }">
                      <span v-if="row.receiverName">{{ row.receiverName }}</span>
                      <span v-else style="color: #c0c4cc">未指派</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                      <el-tag
                        :type="HANDOVER_STATUS_TYPE[row.status as HandoverItemStatus]"
                        size="small"
                      >
                        {{ HANDOVER_STATUS_LABEL[row.status as HandoverItemStatus] }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                      <el-select
                        v-model="row.status"
                        size="small"
                        :disabled="detail!.status !== 'handover'"
                        @change="onHandoverStatusChange(row)"
                      >
                        <el-option label="未开始" value="pending" />
                        <el-option label="进行中" value="in_progress" />
                        <el-option label="已完成" value="completed" />
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <el-empty v-else description="尚未生成交接清单（HR 审批通过后自动生成）" :image-size="80" />
          </el-tab-pane>

          <!-- Tab 3 离职面谈 -->
          <el-tab-pane label="离职面谈" name="interview">
            <div class="interview-form">
              <el-form :model="interviewForm" label-width="140px">
                <el-form-item label="面谈官">
                  <el-input v-model="interviewForm.interviewerName" />
                </el-form-item>
                <el-form-item label="面谈时间">
                  <el-date-picker
                    v-model="interviewForm.interviewTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:00"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="详细离职原因">
                  <el-input v-model="interviewForm.mainReason" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="公司满意度">
                  <el-rate v-model="interviewForm.satisfaction" :max="5" />
                </el-form-item>
                <el-form-item label="公司改进建议">
                  <el-input v-model="interviewForm.suggestions" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="愿意推荐公司">
                  <el-radio-group v-model="interviewForm.wouldRecommend">
                    <el-radio :value="true">是</el-radio>
                    <el-radio :value="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="接受返聘">
                  <el-radio-group v-model="interviewForm.openToRehire">
                    <el-radio :value="true">是</el-radio>
                    <el-radio :value="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="interviewForm.remark" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSaveInterview">保存面谈记录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>

    <!-- 离职证明预览 Dialog -->
    <el-dialog
      v-model="certificateDialogVisible"
      title="离职证明（预览）"
      width="720px"
    >
      <div class="certificate-preview" v-if="detail">
        <div class="cert-title">离 职 证 明</div>
        <div class="cert-body">
          <p>兹证明 <b>{{ detail.employeeName }}</b>（员工编号：{{ currentEmpNo }}）曾于本公司任职，详情如下：</p>
          <p>入职时间：{{ currentEmpEntry }}</p>
          <p>离职时间：{{ detail.actualLastDay }}</p>
          <p>所在部门：{{ detail.orgName }}</p>
          <p>担任岗位：{{ detail.positionName }}</p>
          <p>离职原因：{{ OFFBOARDING_TYPE_LABEL[detail.offboardingType] }}</p>
          <p style="margin-top: 30px">在职期间，{{ detail.employeeName }} 工作认真，遵守公司各项规章制度。经双方确认，劳动合同已于 {{ detail.actualLastDay }} 依法解除/终止，双方再无其他劳动争议。</p>
          <p style="margin-top: 30px">特此证明。</p>
          <div class="cert-footer">
            <div>星河集团 人力资源部</div>
            <div>{{ detail.certificateIssueTime?.slice(0, 10) }}</div>
            <div class="cert-seal">（此处加盖公章）</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="certificateDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePrintCert">打印</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOffboardingList,
  addOffboarding,
  approveOffboardingApi,
  updateHandoverItemApi,
  completeHandoverApi,
  completeOffboardingApi,
  cancelOffboardingApi,
  saveExitInterviewApi,
  issueCertificateApi
} from '@/api/employee/offboarding'
import {
  OFFBOARDING_TYPE_LABEL,
  OFFBOARDING_TYPE_COLOR,
  OFFBOARDING_STATUS_LABEL,
  OFFBOARDING_STATUS_TYPE,
  HANDOVER_CATEGORY_LABEL,
  HANDOVER_STATUS_LABEL,
  HANDOVER_STATUS_TYPE
} from '@/types/employee/offboarding'
import type {
  EmployeeOffboarding,
  OffboardingType,
  OffboardingStatus,
  HandoverCategory,
  HandoverItem,
  HandoverItemStatus,
  OffboardingListParams,
  ExitInterview
} from '@/types/employee/offboarding'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'
import { useRBACStore } from '@/store/modules/rbac'

defineOptions({ name: 'HrmOffboarding' })

const empStore = useEmployeeStore()
const rbacStore = useRBACStore()

const queryParams = reactive<OffboardingListParams>({
  offboardingNo: '',
  employeeName: '',
  offboardingType: '',
  status: '',
  page: 1,
  pageSize: 20
})

const allData = ref<EmployeeOffboarding[]>([])
const filtered = computed<EmployeeOffboarding[]>(() => {
  let list = [...allData.value]
  if (queryParams.offboardingNo) list = list.filter((o) => o.offboardingNo.includes(queryParams.offboardingNo!))
  if (queryParams.employeeName) list = list.filter((o) => o.employeeName.includes(queryParams.employeeName!))
  if (queryParams.offboardingType) list = list.filter((o) => o.offboardingType === queryParams.offboardingType)
  if (queryParams.status) list = list.filter((o) => o.status === queryParams.status)
  return list.sort((a, b) => b.submitTime.localeCompare(a.submitTime))
})
const total = computed(() => filtered.value.length)
const pagedData = computed(() => {
  const start = (queryParams.page - 1) * queryParams.pageSize
  return filtered.value.slice(start, start + queryParams.pageSize)
})

const fetchList = async () => {
  const res: any = await getOffboardingList({ page: 1, pageSize: 1000 })
  allData.value = res.data.list
}

const handleSearch = () => (queryParams.page = 1)
const handleReset = () => {
  queryParams.offboardingNo = ''
  queryParams.employeeName = ''
  queryParams.offboardingType = ''
  queryParams.status = ''
  queryParams.page = 1
}

const isCancellable = (o: EmployeeOffboarding) => {
  return (
    o.status === 'draft' ||
    o.status === 'dept_reviewing' ||
    o.status === 'hr_reviewing' ||
    o.status === 'handover' ||
    o.status === 'pending_last_day'
  )
}

const handoverProgress = (o: EmployeeOffboarding) => {
  if (!o.handoverItems.length) return 0
  const done = o.handoverItems.filter((i) => i.status === 'completed').length
  return Math.round((done / o.handoverItems.length) * 100)
}

// === 发起离职 ===
const addDialogVisible = ref(false)
const addForm = reactive<Partial<EmployeeOffboarding>>({
  employeeId: undefined,
  offboardingType: 'voluntary',
  reason: '',
  expectedLastDay: ''
})

const onEmployeeChange = (id: number) => {
  const e = empStore.getById(id)
  if (!e) return
  addForm.employeeName = e.nameZh
  addForm.orgName = e.orgName
  addForm.positionName = e.positionName
}

const handleAdd = () => {
  Object.assign(addForm, {
    employeeId: undefined,
    employeeName: '',
    orgName: '',
    positionName: '',
    offboardingType: 'voluntary',
    reason: '',
    expectedLastDay: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  })
  addDialogVisible.value = true
}

const handleSubmitOffboarding = async () => {
  if (!addForm.employeeId || !addForm.reason) {
    ElMessage.warning('请选择员工并填写离职原因')
    return
  }
  const now = new Date()
  const payload: Partial<EmployeeOffboarding> = {
    ...addForm,
    offboardingNo: `OFF${now.toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`,
    status: 'dept_reviewing',
    handoverItems: [],
    certificateIssued: false,
    submitTime: now.toLocaleString('zh-CN')
  }
  await addOffboarding(payload as any)
  ElMessage.success('离职申请已提交部门审批')
  addDialogVisible.value = false
  fetchList()
}

// === 详情 ===
const detailDrawerVisible = ref(false)
const detail = ref<EmployeeOffboarding | null>(null)
const activeTab = ref('approval')
const interviewForm = reactive<ExitInterview>({
  interviewerName: 'HR-Lisa',
  interviewerId: 9001,
  interviewTime: '',
  mainReason: '',
  satisfaction: 5,
  suggestions: '',
  wouldRecommend: true,
  openToRehire: true,
  remark: ''
})

const currentEmpNo = computed(() =>
  detail.value ? empStore.getById(detail.value.employeeId)?.employeeNo || '-' : '-'
)
const currentEmpEntry = computed(() =>
  detail.value ? empStore.getById(detail.value.employeeId)?.entryDate || '-' : '-'
)

const handleView = (row: EmployeeOffboarding) => {
  detail.value = row
  activeTab.value = 'approval'
  // 填充面谈记录表单
  if (row.exitInterview) {
    Object.assign(interviewForm, row.exitInterview)
  } else {
    Object.assign(interviewForm, {
      interviewerName: 'HR-Lisa',
      interviewerId: 9001,
      interviewTime: new Date().toISOString().slice(0, 16).replace('T', ' ') + ':00',
      mainReason: row.reason,
      satisfaction: 5,
      suggestions: '',
      wouldRecommend: true,
      openToRehire: true,
      remark: ''
    })
  }
  detailDrawerVisible.value = true
}

// === 审批 ===
const handleDeptApprove = async (action: 'approved' | 'rejected') => {
  if (!detail.value) return
  const comment = await askComment(action === 'approved' ? '部门审批通过意见（可选）' : '部门驳回原因')
  if (comment === null) return
  await approveOffboardingApi(detail.value.id, 'dept', action, '部门负责人', 1003, comment)
  ElMessage.success('审批完成')
  await refreshDetail()
}

const handleHRApprove = async (action: 'approved' | 'rejected') => {
  if (!detail.value) return
  const comment = await askComment(action === 'approved' ? 'HR 审批意见（可选）' : 'HR 驳回原因')
  if (comment === null) return
  await approveOffboardingApi(detail.value.id, 'hr', action, 'HR-Lisa', 9001, comment)
  ElMessage.success('审批完成')
  await refreshDetail()
}

const askComment = async (prompt: string): Promise<string | null> => {
  try {
    const { value } = await ElMessageBox.prompt(prompt, '审批意见', {
      inputType: 'textarea',
      inputPlaceholder: '请输入',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    return value || ''
  } catch {
    return null
  }
}

// === 交接 ===
const handoverCategories: { code: HandoverCategory; label: string }[] = [
  { code: 'work', label: HANDOVER_CATEGORY_LABEL.work },
  { code: 'asset', label: HANDOVER_CATEGORY_LABEL.asset },
  { code: 'access', label: HANDOVER_CATEGORY_LABEL.access },
  { code: 'finance', label: HANDOVER_CATEGORY_LABEL.finance }
]

const itemsByCategory = (cat: HandoverCategory): HandoverItem[] => {
  return detail.value?.handoverItems.filter((i) => i.category === cat) || []
}

const allHandoverCompleted = (o: EmployeeOffboarding) => {
  return o.handoverItems.length > 0 && o.handoverItems.every((i) => i.status === 'completed')
}

const onHandoverStatusChange = async (item: HandoverItem) => {
  if (!detail.value) return
  await updateHandoverItemApi(detail.value.id, item.id, item.status)
  ElMessage.success('交接状态已更新')
}

const handleCompleteHandover = async () => {
  if (!detail.value) return
  await completeHandoverApi(detail.value.id)
  ElMessage.success('交接完成，等待离职日')
  await refreshDetail()
}

const handleCompleteOffboarding = async () => {
  if (!detail.value) return
  ElMessageBox.confirm(
    `确认员工 ${detail.value.employeeName} 已完成所有离职手续？员工档案状态将变为"已离职"`,
    '完成离职',
    { type: 'warning' }
  ).then(async () => {
    await completeOffboardingApi(detail.value!.id)
    // 联动员工档案
    empStore.updateEmployee(detail.value!.employeeId, { status: 'terminated' })
    ElMessage.success('离职完成，员工档案已更新')
    await refreshDetail()
  })
}

// === 面谈 ===
const handleSaveInterview = async () => {
  if (!detail.value) return
  await saveExitInterviewApi(detail.value.id, { ...interviewForm })
  ElMessage.success('面谈记录已保存')
  await refreshDetail()
}

// === 离职证明 ===
const certificateDialogVisible = ref(false)
const handleIssueCertificate = async () => {
  if (!detail.value) return
  await issueCertificateApi(detail.value.id)
  ElMessage.success('离职证明已出具')
  await refreshDetail()
  certificateDialogVisible.value = true
}
const handlePrintCert = () => {
  ElMessage.info('Mock 环境：打印功能在真实环境接入打印机或 PDF 导出')
}

// === 撤销 ===
const handleCancel = (row: EmployeeOffboarding) => {
  ElMessageBox.confirm(`确认撤销"${row.offboardingNo}"?`, '提示', { type: 'warning' }).then(async () => {
    await cancelOffboardingApi(row.id)
    ElMessage.success('已撤销')
    fetchList()
  })
}

const refreshDetail = async () => {
  await fetchList()
  if (detail.value) {
    const updated = allData.value.find((o) => o.id === detail.value!.id)
    if (updated) detail.value = updated
  }
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.offb-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }
  .filter-card {
    flex-shrink: 0;
    :deep(.el-card__body) {
      padding: 12px 20px;
    }
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
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .header-title {
        font-size: 16px;
        font-weight: 600;
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

.action-bar {
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  .el-button:not(:first-child) {
    margin-left: 12px;
  }
}

.handover-group {
  margin-bottom: 20px;
  .handover-group-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: #303133;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
  }
}

.interview-form {
  max-width: 640px;
}

.certificate-preview {
  padding: 40px 60px;
  background: #fff;
  border: 1px solid #e4e7ed;
  min-height: 540px;

  .cert-title {
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 32px;
    letter-spacing: 8px;
    color: #303133;
  }

  .cert-body {
    font-size: 15px;
    line-height: 2.2;
    color: #303133;

    p {
      margin: 4px 0;
    }
  }

  .cert-footer {
    margin-top: 60px;
    text-align: right;

    div {
      line-height: 2;
    }

    .cert-seal {
      color: #f56c6c;
      font-weight: 500;
      margin-top: 16px;
    }
  }
}
</style>
