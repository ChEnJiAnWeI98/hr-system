<template>
  <div class="job-posting-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="职位编号">
            <el-input v-model="queryParams.jobNo" placeholder="请输入职位编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="职位名称">
            <el-input v-model="queryParams.jobTitle" placeholder="请输入职位名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="关联需求">
            <el-input
              v-model="queryParams.demandNo"
              placeholder="请输入需求单号（如 RD202604001）"
              style="width: 220px"
              clearable
            />
          </el-form-item>

          <el-form-item label="所属部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="职位类型">
            <el-select v-model="queryParams.jobType" placeholder="请选择职位类型" style="width: 150px" clearable>
              <el-option label="全职" :value="1" />
              <el-option label="兼职" :value="2" />
              <el-option label="实习" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="招聘中" :value="1" />
              <el-option label="已暂停" :value="2" />
              <el-option label="已关闭" :value="3" />
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
          <el-button v-if="isHR" type="primary" @click="() => handleAdd()">
            <el-icon><Plus /></el-icon>
            发布职位
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
          <el-table-column prop="jobNo" label="职位编号" min-width="10%" />
          <el-table-column prop="jobTitle" label="职位名称" min-width="12%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="9%" />
          <el-table-column prop="demandNo" label="关联需求" min-width="11%">
            <template #default="{ row }">{{ row.demandNo || '-' }}</template>
          </el-table-column>
          <el-table-column prop="recruitCount" label="招聘人数" min-width="7%" />
          <el-table-column prop="jobType" label="职位类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.jobType === 1" type="success">全职</el-tag>
              <el-tag v-else-if="row.jobType === 2" type="primary">兼职</el-tag>
              <el-tag v-else-if="row.jobType === 3" type="warning">实习</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salaryRange" label="薪资范围" min-width="9%" />
          <el-table-column prop="publisherName" label="发布人" min-width="8%">
            <template #default="{ row }">{{ row.publisherName || '-' }}</template>
          </el-table-column>
          <el-table-column label="浏览/申请" min-width="8%">
            <template #default="{ row }">{{ row.viewCount }}/{{ row.applyCount }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">招聘中</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">已暂停</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="内推" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.referralOpen === 1" type="success" size="small">已开启</el-tag>
              <el-tag v-else type="info" size="small">未开启</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">详情</el-button>
              <el-button v-if="isHR" link @click="handleEdit(row)">编辑</el-button>
              <el-button v-if="isHR" link type="primary" @click="handleClone(row)">克隆</el-button>
              <el-button
                v-if="isHR"
                link
                :type="row.referralOpen === 1 ? 'warning' : 'success'"
                @click="handleToggleReferral(row)"
              >
                {{ row.referralOpen === 1 ? '查看内推' : '开启内推' }}
              </el-button>
              <el-button v-if="isHR && row.status === 1" link type="primary" @click="handleSyncExternal(row)">
                同步外部渠道
              </el-button>
              <el-button v-if="isHR && row.status === 1" link type="warning" @click="handlePause(row)">
                暂停
              </el-button>
              <el-button v-else-if="isHR && row.status === 2" link type="success" @click="handleResume(row)">
                恢复
              </el-button>
              <el-button v-if="isSuperAdmin" link type="danger" @click="handleDelete(row)">
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" @close="handleDialogClose">
      <el-alert
        v-if="!formData.id"
        type="info"
        :closable="false"
        show-icon
        title="职位必须基于已审批通过的招聘需求创建。选择需求后，系统会自动预填部分字段。"
        style="margin-bottom: 16px"
      />
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- 招聘需求选择（新增时必填） -->
        <el-form-item label="关联招聘需求" prop="demandId" v-if="!formData.id">
          <el-select
            v-model="formData.demandId"
            filterable
            placeholder="请选择已审批通过的招聘需求"
            style="width: 100%"
            @change="handleDemandChange"
          >
            <el-option
              v-for="d in publishableDemands"
              :key="d.id"
              :label="`${d.demandNo} - ${d.departmentName} - ${d.positionName}（${d.recruitCount}人）`"
              :value="d.id"
            />
          </el-select>
          <div v-if="publishableDemands.length === 0" class="form-hint error">
            暂无已审批通过的招聘需求，请先通知用人部门提交需求并完成审批
          </div>
        </el-form-item>

        <el-form-item v-else label="关联招聘需求">
          <el-input :model-value="formData.demandNo" disabled />
          <div class="form-hint">职位创建后，关联需求不可修改</div>
        </el-form-item>

        <el-form-item label="职位名称" prop="jobTitle">
          <el-input v-model="formData.jobTitle" placeholder="请输入职位名称（可基于需求定制对外展示名称）" />
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入所属部门" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="recruitCount">
          <el-input v-model.number="formData.recruitCount" placeholder="请输入招聘人数" />
        </el-form-item>

        <el-form-item label="职位类型" prop="jobType">
          <el-select v-model="formData.jobType" placeholder="请选择职位类型" style="width: 100%">
            <el-option label="全职" :value="1" />
            <el-option label="兼职" :value="2" />
            <el-option label="实习" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="工作地点" prop="workLocation">
          <el-input v-model="formData.workLocation" placeholder="请输入工作地点" />
        </el-form-item>

        <el-form-item label="薪资范围" prop="salaryRange">
          <el-input v-model="formData.salaryRange" placeholder="例如：10K-15K" />
        </el-form-item>

        <el-form-item label="职位描述" prop="jobDescription">
          <el-input v-model="formData.jobDescription" type="textarea" :rows="4" placeholder="请输入职位描述（对外展示）" />
        </el-form-item>

        <el-form-item label="任职要求" prop="jobRequirements">
          <el-input v-model="formData.jobRequirements" type="textarea" :rows="4" placeholder="请输入任职要求" />
        </el-form-item>

        <el-form-item label="发布平台" prop="publishPlatforms">
          <el-checkbox-group v-model="formData.publishPlatforms">
            <el-checkbox value="智联招聘">智联招聘</el-checkbox>
            <el-checkbox value="前程无忧">前程无忧</el-checkbox>
            <el-checkbox value="Boss直聘">Boss直聘</el-checkbox>
            <el-checkbox value="拉勾网">拉勾网</el-checkbox>
            <el-checkbox value="猎聘网">猎聘网</el-checkbox>
            <el-checkbox value="公司官网">公司官网</el-checkbox>
            <el-checkbox value="内推">内推</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="招聘中" :value="1" />
            <el-option label="已暂停" :value="2" />
            <el-option label="已关闭" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="仅内部可见">
          <el-switch v-model="internalOnlyModel" :active-value="1" :inactive-value="0" />
          <span class="form-hint">开启后职位仅对公司在职员工可见（用于内部转岗/晋升）</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 内推管理弹窗 -->
    <el-dialog v-model="referralVisible" title="内推管理" width="560px">
      <div v-if="currentReferralJob" class="referral-panel">
        <div class="ref-title">{{ currentReferralJob.jobTitle }} · {{ currentReferralJob.jobNo }}</div>

        <el-alert
          v-if="currentReferralJob.referralOpen === 1"
          type="success"
          :closable="false"
          show-icon
          title="该职位内推已开启，全员可通过专属链接推荐候选人"
          style="margin-bottom: 16px"
        />
        <el-alert
          v-else
          type="info"
          :closable="false"
          show-icon
          title="开启内推后，系统将生成员工专属推广链接和海报"
          style="margin-bottom: 16px"
        />

        <el-form v-if="currentReferralJob.referralOpen === 1" label-width="100px">
          <el-form-item label="内推链接">
            <el-input :model-value="currentReferralJob.referralLink" readonly>
              <template #append>
                <el-button @click="copyReferralLink">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="海报 URL">
            <el-input :model-value="currentReferralJob.referralPoster" readonly />
            <div class="form-hint">员工可扫码分享海报（Demo 演示链接）</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="referralVisible = false">关闭</el-button>
        <el-button
          v-if="currentReferralJob?.referralOpen !== 1"
          type="primary"
          @click="handleEnableReferral"
        >
          开启内推
        </el-button>
        <el-button
          v-else
          type="warning"
          @click="handleDisableReferral"
        >
          关闭内推
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="职位详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="职位编号">{{ detailData.jobNo }}</el-descriptions-item>
        <el-descriptions-item label="关联需求">{{ detailData.demandNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="职位名称">{{ detailData.jobTitle }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="发布人">{{ detailData.publisherName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="招聘人数">{{ detailData.recruitCount }}</el-descriptions-item>
        <el-descriptions-item label="职位类型">
          <el-tag v-if="detailData.jobType === 1" type="success">全职</el-tag>
          <el-tag v-else-if="detailData.jobType === 2" type="primary">兼职</el-tag>
          <el-tag v-else-if="detailData.jobType === 3" type="warning">实习</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="工作地点">{{ detailData.workLocation }}</el-descriptions-item>
        <el-descriptions-item label="薪资范围">{{ detailData.salaryRange }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success">招聘中</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="warning">已暂停</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="info">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="浏览次数">{{ detailData.viewCount }}</el-descriptions-item>
        <el-descriptions-item label="申请人数">{{ detailData.applyCount }}</el-descriptions-item>
        <el-descriptions-item label="发布平台" :span="2">
          <el-tag v-for="p in detailData.publishPlatforms" :key="p" style="margin-right: 8px">
            {{ p }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="职位描述" :span="2">{{ detailData.jobDescription }}</el-descriptions-item>
        <el-descriptions-item label="任职要求" :span="2">{{ detailData.jobRequirements }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ detailData.publishTime }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import type { JobPosting, JobPostingListParams } from '@/types/jobPosting'
import type { RecruitmentDemand } from '@/types/recruitmentDemand'
import {
  getJobPostingList,
  getJobPostingDetail,
  addJobPosting,
  updateJobPosting,
  deleteJobPosting,
  batchDeleteJobPosting,
  getPublishableDemands,
  cloneJobPosting,
  enableJobReferral,
  disableJobReferral
} from '@/api/jobPosting'

defineOptions({
  name: 'RecruitmentJobPosting'
})

const userStore = useUserStore()
const isSuperAdmin = computed(() => userStore.isSuperAdmin)
const isHR = computed(() => userStore.isHR)
const route = useRoute()
const router = useRouter()

// 查询参数
const queryParams = reactive<JobPostingListParams>({
  jobNo: '',
  jobTitle: '',
  departmentName: '',
  jobType: null,
  status: null,
  demandNo: '',
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<JobPosting[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 可用于发布的招聘需求
const publishableDemands = ref<RecruitmentDemand[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<JobPosting>>({
  demandId: undefined,
  demandNo: '',
  jobTitle: '',
  departmentName: '',
  recruitCount: 0,
  jobType: 1,
  workLocation: '',
  salaryRange: '',
  jobDescription: '',
  jobRequirements: '',
  publishPlatforms: [],
  status: 1,
  internalOnly: 0
})

// Phase 2.5：仅内部可见（双向绑定）
const internalOnlyModel = computed({
  get: () => formData.internalOnly || 0,
  set: (v: number) => {
    formData.internalOnly = v
  }
})

// Phase 2.5：内推管理弹窗
const referralVisible = ref(false)
const currentReferralJob = ref<JobPosting | null>(null)

const handleToggleReferral = (row: JobPosting) => {
  currentReferralJob.value = { ...row }
  referralVisible.value = true
}

const handleEnableReferral = async () => {
  if (!currentReferralJob.value) return
  try {
    const res = await enableJobReferral(currentReferralJob.value.id)
    if (res.code === 200) {
      currentReferralJob.value = res.data
      ElMessage.success('内推已开启')
      loadData()
    }
  } catch {
    ElMessage.error('开启失败')
  }
}

const handleDisableReferral = async () => {
  if (!currentReferralJob.value) return
  try {
    await ElMessageBox.confirm('确定关闭该职位的内推吗？关闭后已生成的链接将失效。', '提示', {
      type: 'warning'
    })
    const res = await disableJobReferral(currentReferralJob.value.id)
    if (res.code === 200) {
      currentReferralJob.value = res.data
      ElMessage.success('内推已关闭')
      loadData()
    }
  } catch {
    // 取消
  }
}

const copyReferralLink = async () => {
  if (!currentReferralJob.value?.referralLink) return
  try {
    await navigator.clipboard.writeText(currentReferralJob.value.referralLink)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// 任务 C：同步外部渠道（占位按钮）
const handleSyncExternal = (row: JobPosting) => {
  ElMessageBox.alert(
    `职位：${row.jobTitle}（${row.jobNo}）\n\n当前发布平台：${(row.publishPlatforms || []).join('、') || '-'}\n\n该功能需要对接 Boss 直聘 / 猎聘 / 智联招聘等第三方平台的开放 API，当前为占位按钮。后续接入后将自动把职位推送到勾选的外部渠道。`,
    '同步外部渠道 - 接入开发中',
    { confirmButtonText: '我知道了', type: 'info' }
  )
}

// Phase 2.5：克隆职位
const handleClone = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm(
      `确定基于「${row.jobTitle}」克隆新职位吗？新职位将处于"已暂停"状态，请完善后再发布。`,
      '克隆职位',
      { type: 'info' }
    )
    const res = await cloneJobPosting(row.id)
    if (res.code === 200) {
      ElMessage.success('克隆成功，请在列表中找到副本并编辑')
      loadData()
    }
  } catch {
    // 取消
  }
}

const formRules: FormRules = {
  demandId: [{ required: true, message: '请选择关联招聘需求', trigger: 'change' }],
  jobTitle: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
  recruitCount: [{ required: true, message: '请输入招聘人数', trigger: 'blur' }],
  jobType: [{ required: true, message: '请选择职位类型', trigger: 'change' }],
  workLocation: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salaryRange: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }],
  jobDescription: [{ required: true, message: '请输入职位描述', trigger: 'blur' }],
  jobRequirements: [{ required: true, message: '请输入任职要求', trigger: 'blur' }],
  publishPlatforms: [{ required: true, message: '请选择发布平台', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<JobPosting>>({})

// 加载职位列表
const loadData = async () => {
  try {
    const res = await getJobPostingList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载职位列表失败')
  }
}

// 加载可发布需求列表（下拉）
const loadPublishableDemands = async () => {
  try {
    const res = await getPublishableDemands()
    if (res.code === 200) {
      // 仅保留未完全发布职位的需求（已发布 < 需求人数 的可继续发布）
      publishableDemands.value = (res.data.list || []).filter((d: RecruitmentDemand) => {
        return (d.publishedJobCount || 0) < (d.recruitCount || 0)
      })
    }
  } catch {
    publishableDemands.value = []
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.jobNo = ''
  queryParams.jobTitle = ''
  queryParams.departmentName = ''
  queryParams.jobType = null
  queryParams.status = null
  queryParams.demandNo = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  loadData()
}

const handleSelectionChange = (selection: JobPosting[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 新增
const handleAdd = async (preselectedDemandId?: number) => {
  if (!isHR.value) {
    ElMessage.warning('仅 HR 可发布职位')
    return
  }
  await loadPublishableDemands()
  if (publishableDemands.value.length === 0) {
    ElMessage.warning('暂无已审批通过且未完全发布的招聘需求')
    return
  }
  dialogTitle.value = '发布职位'
  Object.assign(formData, {
    id: undefined,
    demandId: preselectedDemandId || undefined,
    demandNo: '',
    jobTitle: '',
    departmentName: '',
    recruitCount: 0,
    jobType: 1,
    workLocation: '',
    salaryRange: '',
    jobDescription: '',
    jobRequirements: '',
    publishPlatforms: [],
    status: 1
  })
  // 如从需求池预选，自动填充
  if (preselectedDemandId) {
    handleDemandChange(preselectedDemandId)
  }
  dialogVisible.value = true
}

// 选择需求后自动预填
const handleDemandChange = (demandId: number) => {
  const d = publishableDemands.value.find((x) => x.id === demandId)
  if (!d) return
  formData.demandNo = d.demandNo
  formData.jobTitle = d.positionName
  formData.departmentName = d.departmentName
  formData.recruitCount = Math.max((d.recruitCount || 0) - (d.publishedJobCount || 0), 1)
  formData.salaryRange = d.salaryRange
  formData.jobRequirements = d.jobRequirements
  formData.jobDescription = d.demandReason
}

// 编辑
const handleEdit = (row: JobPosting) => {
  dialogTitle.value = '编辑职位'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = async (row: JobPosting) => {
  try {
    const res = await getJobPostingDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailVisible.value = true
    }
  } catch {
    detailData.value = { ...row }
    detailVisible.value = true
  }
}

// 暂停
const handlePause = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要暂停该职位招聘吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateJobPosting({ id: row.id, status: 2 } as any)
    ElMessage.success('已暂停')
    loadData()
  } catch {
    // 取消
  }
}

// 恢复
const handleResume = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要恢复该职位招聘吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateJobPosting({ id: row.id, status: 1 } as any)
    ElMessage.success('已恢复')
    loadData()
  } catch {
    // 取消
  }
}

// 删除
const handleDelete = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要删除该职位吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteJobPosting(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await batchDeleteJobPosting(selectedIds.value)
    ElMessage.success('删除成功')
    loadData()
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
      if (formData.id) {
        await updateJobPosting(formData as any)
        ElMessage.success('更新成功')
      } else {
        const u = userStore.getUserInfo
        const payload = {
          ...formData,
          publisherId: u.id,
          publisherName: u.nickname,
          jobNo: `JOB${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${Date.now().toString().slice(-4)}`,
          publishTime: new Date().toLocaleString('zh-CN'),
          viewCount: 0,
          applyCount: 0
        }
        await addJobPosting(payload)
        ElMessage.success('发布成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error: any) {
      ElMessage.error(error?.message || '操作失败')
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 支持从招聘需求池跳转带参：?demandId=xxx&autoOpen=1
watch(
  () => route.query,
  async (q) => {
    if (q.autoOpen === '1' && q.demandId) {
      const demandId = Number(q.demandId)
      await handleAdd(demandId)
      // 清除 query，避免刷新时反复触发
      router.replace({ query: {} })
    }
  },
  { immediate: true }
)

onMounted(() => {
  // 从 URL query 读取初始筛选条件（如从"HR 招聘需求池"点击"已发布职位"带参进来）
  if (route.query.demandNo) {
    queryParams.demandNo = String(route.query.demandNo)
  }
  loadData()
})
</script>

<style scoped lang="scss">
.job-posting-container {
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

  &.error {
    color: #f56c6c;
  }
}

.referral-panel {
  .ref-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #303133;
  }
}
</style>
