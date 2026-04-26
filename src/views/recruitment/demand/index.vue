<template>
  <div class="recruitment-demand-container">
    <ModuleTabBar :tabs="demandGroupTabs" />
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

          <el-form-item label="紧急程度">
            <el-select v-model="queryParams.urgencyLevel" placeholder="请选择紧急程度" style="width: 150px" clearable>
              <el-option label="一般" :value="1" />
              <el-option label="紧急" :value="2" />
              <el-option label="非常紧急" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="审批状态">
            <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" style="width: 150px" clearable>
              <el-option label="审批中" :value="0" />
              <el-option label="已通过" :value="1" />
              <el-option label="已驳回" :value="2" />
              <el-option label="已关闭" :value="3" />
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
          <el-button
            v-if="canCreateDemand"
            type="primary"
            @click="handleAdd"
          >
            <el-icon><Plus /></el-icon>
            新增需求
          </el-button>
          <el-button
            v-if="isSuperAdmin"
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
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
          <el-table-column v-if="isSuperAdmin" type="selection" min-width="5%" />
          <el-table-column prop="demandNo" label="需求编号" min-width="11%" />
          <el-table-column prop="departmentName" label="申请部门" min-width="9%" />
          <el-table-column prop="positionName" label="招聘岗位" min-width="10%" />
          <el-table-column prop="hiringManagerName" label="发起人" min-width="8%">
            <template #default="{ row }">{{ row.hiringManagerName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="recruitCount" label="招聘人数" min-width="7%" />
          <el-table-column prop="urgencyLevel" label="紧急程度" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.urgencyLevel === 1" type="info">一般</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 2" type="warning">紧急</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 3" type="danger">非常紧急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salaryRange" label="薪资范围" min-width="9%" />
          <el-table-column label="审批进度" min-width="13%">
            <template #default="{ row }">
              <el-tag v-if="row.approvalStatus === 0" type="warning" size="small">审批中</el-tag>
              <el-tag v-else-if="row.approvalStatus === 1" type="success" size="small">已通过</el-tag>
              <el-tag v-else-if="row.approvalStatus === 2" type="danger" size="small">已驳回</el-tag>
              <el-tag v-else-if="row.approvalStatus === 3" type="info" size="small">已关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button
                v-if="canApprove(row)"
                link
                type="primary"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="canResubmit(row)"
                link
                type="warning"
                @click="handleResubmit(row)"
              >
                重新提交
              </el-button>
              <el-button
                v-if="canClose(row)"
                link
                type="info"
                @click="handleClose(row)"
              >
                关闭需求
              </el-button>
              <el-button
                v-if="isSuperAdmin"
                link
                type="danger"
                @click="handleDelete(row)"
              >
                删除
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

    <!-- 新增/重新提交弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-alert
        v-if="!formData.id"
        type="info"
        :closable="false"
        show-icon
        title="提交后系统将自动触发审批流（直属上级 → HRBP → HRD），无需额外操作。"
        style="margin-bottom: 16px"
      />
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item label="申请部门">
          <el-input :model-value="formData.hiringManagerDeptName" disabled />
          <div class="form-hint">申请部门默认为您所在部门，不可修改</div>
        </el-form-item>

        <el-form-item label="发起人">
          <el-input :model-value="formData.hiringManagerName" disabled />
        </el-form-item>

        <el-form-item label="招聘岗位" prop="positionName">
          <el-input v-model="formData.positionName" placeholder="请输入招聘岗位" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="recruitCount">
          <el-input v-model.number="formData.recruitCount" placeholder="请输入招聘人数" />
        </el-form-item>

        <el-form-item label="紧急程度" prop="urgencyLevel">
          <el-select v-model="formData.urgencyLevel" placeholder="请选择紧急程度" style="width: 100%">
            <el-option label="一般" :value="1" />
            <el-option label="紧急" :value="2" />
            <el-option label="非常紧急" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="薪资范围" prop="salaryRange">
          <el-input v-model="formData.salaryRange" placeholder="请输入薪资范围（如：8K-12K）" />
        </el-form-item>

        <el-form-item label="期望到岗日期" prop="expectedOnboardDate">
          <el-date-picker
            v-model="formData.expectedOnboardDate"
            type="date"
            placeholder="请选择期望到岗日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="需求原因" prop="demandReason">
          <el-input
            v-model="formData.demandReason"
            type="textarea"
            :rows="3"
            placeholder="请输入需求原因"
          />
        </el-form-item>

        <el-form-item label="任职要求" prop="jobRequirements">
          <el-input
            v-model="formData.jobRequirements"
            type="textarea"
            :rows="3"
            placeholder="请输入任职要求"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ formData.id ? '重新提交' : '提交并发起审批' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="需求详情"
      width="780px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="需求编号">{{ detailData.demandNo }}</el-descriptions-item>
        <el-descriptions-item label="申请部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="发起人">{{ detailData.hiringManagerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="招聘岗位">{{ detailData.positionName }}</el-descriptions-item>
        <el-descriptions-item label="招聘人数">{{ detailData.recruitCount }}</el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag v-if="detailData.urgencyLevel === 1" type="info">一般</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 2" type="warning">紧急</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 3" type="danger">非常紧急</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="薪资范围">{{ detailData.salaryRange }}</el-descriptions-item>
        <el-descriptions-item label="期望到岗日期">{{ detailData.expectedOnboardDate }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">审批中</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">已驳回</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 3" type="info">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="已发布职位">{{ detailData.publishedJobCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="需求原因" :span="2">{{ detailData.demandReason }}</el-descriptions-item>
        <el-descriptions-item label="任职要求" :span="2">{{ detailData.jobRequirements }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" v-if="detailData.createTime">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" v-if="detailData.updateTime">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="关闭原因" :span="2" v-if="detailData.closeReason">{{ detailData.closeReason }}</el-descriptions-item>
      </el-descriptions>

      <!-- 编制校验结果 -->
      <div class="establishment-section" v-if="detailData.establishmentCheck">
        <div class="section-title">编制联动校验结果</div>
        <el-alert
          :type="
            detailData.establishmentCheck.overstaffed === 0
              ? 'success'
              : detailData.establishmentCheck.overstaffed === 1
                ? 'warning'
                : 'info'
          "
          :closable="false"
          show-icon
          :title="detailData.establishmentCheck.message"
        />
      </div>

      <!-- 审批流进度 -->
      <div class="approval-flow-section" v-if="detailData.approvalNodes?.length">
        <div class="section-title">审批流进度</div>
        <el-steps
          :active="getActiveStep(detailData)"
          finish-status="success"
          :process-status="detailData.approvalStatus === 2 ? 'error' : 'process'"
          align-center
        >
          <el-step
            v-for="node in detailData.approvalNodes"
            :key="node.nodeIndex"
            :title="node.nodeName"
            :status="getNodeStatus(node, detailData)"
          >
            <template #description>
              <div class="node-desc">
                <div>{{ node.approverName }}</div>
                <div v-if="node.approveTime" class="node-time">{{ node.approveTime }}</div>
                <div v-if="node.opinion" class="node-opinion">"{{ node.opinion }}"</div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>

      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approvalVisible"
      title="审批需求"
      width="540px"
      @close="handleApprovalDialogClose"
    >
      <el-alert
        type="info"
        :closable="false"
        show-icon
        :title="`当前待审批节点：${currentApprovingNode?.nodeName || ''}（由 ${currentApprovingNode?.approverName || '-'} 审批）`"
        style="margin-bottom: 16px"
      />
      <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef" label-width="100px">
        <el-form-item label="审批结果" prop="approvalResult">
          <el-radio-group v-model="approvalForm.approvalResult">
            <el-radio :value="1">通过</el-radio>
            <el-radio :value="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见" prop="approvalOpinion">
          <el-input
            v-model="approvalForm.approvalOpinion"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApprovalSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 关闭需求弹窗 -->
    <el-dialog
      v-model="closeVisible"
      title="关闭招聘需求"
      width="480px"
    >
      <el-form :model="closeForm" :rules="closeRules" ref="closeFormRef" label-width="100px">
        <el-form-item label="关闭原因" prop="reason">
          <el-select v-model="closeForm.reason" placeholder="请选择关闭原因" style="width: 100%">
            <el-option label="已招满" value="已招满" />
            <el-option label="需求取消" value="需求取消" />
            <el-option label="业务变动" value="业务变动" />
            <el-option label="预算调整" value="预算调整" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCloseSubmit">确定关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import ModuleTabBar from '@/views/recruitment/_shared/ModuleTabBar.vue'
import type { RecruitmentDemand, RecruitmentDemandListParams, ApprovalNode } from '@/types/recruitmentDemand'

const demandGroupTabs = [
  { label: '我的招聘需求', path: '/recruit/demand' },
  { label: 'HR 招聘需求池', path: '/recruit/demand-pool/x' },
  { label: '完成率监控', path: '/recruit/demand-completion/x' }
]
import {
  getRecruitmentDemandList,
  getDetail,
  addRecruitmentDemand,
  removeRecruitmentDemand,
  batchDeleteRecruitmentDemand,
  approveDemandNode,
  rejectDemandNode,
  resubmitDemand,
  closeDemand,
  preCheckEstablishment
} from '@/api/recruitmentDemand'

defineOptions({
  name: 'RecruitmentDemand'
})

const userStore = useUserStore()
const isSuperAdmin = computed(() => userStore.isSuperAdmin)
const isHR = computed(() => userStore.isHR)
const isDeptManager = computed(() => userStore.isDeptManager)

// 发起需求权限：仅部门负责人
// 注意：超级管理员若需发起，应通过"角色组合"显式拥有 R_DEPT_MANAGER 角色
const canCreateDemand = computed(() => isDeptManager.value)

// 查询参数
const queryParams = reactive<RecruitmentDemandListParams>({
  demandNo: '',
  departmentName: '',
  positionName: '',
  urgencyLevel: null,
  approvalStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<RecruitmentDemand[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增需求')
const detailVisible = ref(false)
const approvalVisible = ref(false)
const closeVisible = ref(false)

// 表单数据
const formData = reactive<Partial<RecruitmentDemand>>({
  positionName: '',
  recruitCount: undefined,
  urgencyLevel: 1,
  salaryRange: '',
  expectedOnboardDate: '',
  demandReason: '',
  jobRequirements: '',
  remark: ''
})

// 详情数据
const detailData = ref<Partial<RecruitmentDemand>>({})

// 审批表单
const approvalForm = reactive({
  id: 0,
  approvalResult: 1,
  approvalOpinion: ''
})

// 当前审批的节点（用于展示提示）
const currentApprovingNode = ref<ApprovalNode | null>(null)

// 关闭表单
const closeForm = reactive({
  id: 0,
  reason: ''
})

// 表单引用
const formRef = ref()
const approvalFormRef = ref()
const closeFormRef = ref()

// 表单验证规则
const formRules = {
  positionName: [{ required: true, message: '请输入招聘岗位', trigger: 'blur' }],
  recruitCount: [{ required: true, message: '请输入招聘人数', trigger: 'blur' }],
  urgencyLevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  salaryRange: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }],
  expectedOnboardDate: [{ required: true, message: '请选择期望到岗日期', trigger: 'change' }],
  demandReason: [{ required: true, message: '请输入需求原因', trigger: 'blur' }],
  jobRequirements: [{ required: true, message: '请输入任职要求', trigger: 'blur' }]
}

const approvalRules = {
  approvalResult: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  approvalOpinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

const closeRules = {
  reason: [{ required: true, message: '请选择关闭原因', trigger: 'change' }]
}

// 加载数据
const loadData = async () => {
  try {
    const res = await getRecruitmentDemandList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
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
  queryParams.approvalStatus = null
  queryParams.page = 1
  queryParams.pageSize = 20
  loadData()
}

const handleSelectionChange = (selection: RecruitmentDemand[]) => {
  selectedIds.value = selection.map((item) => item.id!)
}

// 新增需求：发起表单
const handleAdd = () => {
  const u = userStore.getUserInfo
  dialogTitle.value = '新增招聘需求'
  Object.assign(formData, {
    id: undefined,
    hiringManagerId: u.id,
    hiringManagerName: u.nickname,
    hiringManagerDeptId: u.departmentId,
    hiringManagerDeptName: u.department?.departmentName,
    departmentId: u.departmentId,
    departmentName: u.department?.departmentName,
    positionName: '',
    recruitCount: undefined,
    urgencyLevel: 1,
    salaryRange: '',
    expectedOnboardDate: '',
    demandReason: '',
    jobRequirements: '',
    remark: ''
  })
  dialogVisible.value = true
}

const handleView = async (row: RecruitmentDemand) => {
  try {
    const res = await getDetail(row.id!)
    if (res.code === 200) {
      detailData.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

// 审批权限：
// 1. 需求必须处于"审批中"状态
// 2. 当前用户拥有当前节点要求的审批角色
// 3. 职责分离（SoD）：发起人不能审批自己发起的需求
const canApprove = (row: RecruitmentDemand): boolean => {
  if (row.approvalStatus !== 0) return false
  const currentIdx = row.currentNodeIndex ?? 0
  const currentNode = row.approvalNodes?.[currentIdx]
  if (!currentNode) return false
  if (!userStore.hasRole(currentNode.approverRole)) return false
  // SoD：发起人不能审批自己
  if (row.hiringManagerId === userStore.getUserInfo.id) return false
  return true
}

// 重新提交权限：发起人本人 或 HR 管理员（可代发起人操作，符合 REC-022）
const canResubmit = (row: RecruitmentDemand): boolean => {
  if (row.approvalStatus !== 2) return false
  if (isHR.value) return true
  return row.hiringManagerId === userStore.getUserInfo.id
}

// 关闭需求权限：仅 HR 管理员
const canClose = (row: RecruitmentDemand): boolean => {
  return row.approvalStatus === 1 && isHR.value
}

const handleApprove = (row: RecruitmentDemand) => {
  approvalForm.id = row.id!
  approvalForm.approvalResult = 1
  approvalForm.approvalOpinion = ''
  const currentIdx = row.currentNodeIndex ?? 0
  currentApprovingNode.value = row.approvalNodes?.[currentIdx] || null
  approvalVisible.value = true
}

const handleResubmit = (row: RecruitmentDemand) => {
  dialogTitle.value = '重新提交招聘需求'
  Object.assign(formData, {
    id: row.id,
    hiringManagerId: row.hiringManagerId,
    hiringManagerName: row.hiringManagerName,
    hiringManagerDeptId: row.hiringManagerDeptId,
    hiringManagerDeptName: row.hiringManagerDeptName,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    positionName: row.positionName,
    recruitCount: row.recruitCount,
    urgencyLevel: row.urgencyLevel,
    salaryRange: row.salaryRange,
    expectedOnboardDate: row.expectedOnboardDate,
    demandReason: row.demandReason,
    jobRequirements: row.jobRequirements,
    remark: row.remark
  })
  dialogVisible.value = true
}

const handleClose = (row: RecruitmentDemand) => {
  closeForm.id = row.id!
  closeForm.reason = ''
  closeVisible.value = true
}

const handleDelete = (row: RecruitmentDemand) => {
  ElMessageBox.confirm('确定要删除该需求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      if (removeRecruitmentDemand) {
        const res = await removeRecruitmentDemand(row.id!)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          loadData()
        }
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要删除选中的需求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteRecruitmentDemand(selectedIds.value)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单：新增走自动触发审批；重新提交走重置审批链
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    // 编制预校验
    try {
      const checkRes = await preCheckEstablishment(
        formData.hiringManagerDeptId,
        Number(formData.recruitCount) || 0
      )
      const result = checkRes?.data
      if (result?.overstaffed === 1) {
        const ok = await ElMessageBox.confirm(
          `${result.message}\n\n是否继续提交？提交后将自动触发包含 CEO 审批的完整流程。`,
          '编制超编提醒',
          {
            confirmButtonText: '继续提交',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(() => false)
        if (!ok) return
      } else if (result?.overstaffed === 2) {
        ElMessage.warning(result.message)
      }
    } catch (e) {
      // 校验失败不阻断提交
    }

    try {
      const res = formData.id
        ? await resubmitDemand(formData.id, formData)
        : await addRecruitmentDemand(formData)
      if (res.code === 200) {
        ElMessage.success(res.message || '操作成功')
        dialogVisible.value = false
        loadData()
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '操作失败')
    }
  })
}

const handleApprovalSubmit = async () => {
  if (!approvalFormRef.value) return
  await approvalFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const approverName = userStore.getUserInfo.nickname || '审批人'
      const res =
        approvalForm.approvalResult === 1
          ? await approveDemandNode(approvalForm.id, approvalForm.approvalOpinion, approverName)
          : await rejectDemandNode(approvalForm.id, approvalForm.approvalOpinion, approverName)
      if (res.code === 200) {
        ElMessage.success(res.message || '审批成功')
        approvalVisible.value = false
        loadData()
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '审批失败')
    }
  })
}

const handleCloseSubmit = async () => {
  if (!closeFormRef.value) return
  await closeFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const res = await closeDemand(closeForm.id, closeForm.reason)
      if (res.code === 200) {
        ElMessage.success('需求已关闭')
        closeVisible.value = false
        loadData()
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '关闭失败')
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleApprovalDialogClose = () => {
  approvalFormRef.value?.resetFields()
}

// el-steps 的 active 索引
const getActiveStep = (demand: Partial<RecruitmentDemand>): number => {
  if (demand.approvalStatus === 1) return demand.approvalNodes?.length || 0
  return demand.currentNodeIndex ?? 0
}

// el-step 单个节点状态
const getNodeStatus = (node: ApprovalNode, demand: Partial<RecruitmentDemand>) => {
  if (node.status === 1) return 'success'
  if (node.status === 2) return 'error'
  if (demand.approvalStatus === 0 && node.nodeIndex === (demand.currentNodeIndex ?? 0)) return 'process'
  return 'wait'
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.recruitment-demand-container {
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

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.establishment-section {
  margin-top: 20px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #303133;
  }
}

.approval-flow-section {
  margin-top: 20px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #303133;
  }

  .node-desc {
    font-size: 12px;
    color: #606266;

    .node-time {
      color: #909399;
      margin-top: 2px;
    }

    .node-opinion {
      color: #303133;
      margin-top: 4px;
      font-style: italic;
    }
  }
}
</style>
