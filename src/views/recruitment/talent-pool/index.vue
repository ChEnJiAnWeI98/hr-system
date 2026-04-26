<template>
  <div class="talent-pool-container">
    <!-- 左侧人才池 -->
    <el-card class="pool-card">
      <div class="pool-header">
        <span class="pool-title">人才池</span>
        <el-button type="primary" text @click="handleAddPool">
          <el-icon><Plus /></el-icon>
          新建
        </el-button>
      </div>
      <div class="pool-list">
        <div
          class="pool-item"
          :class="{ active: activePoolId === null && activeStatus === '' }"
          @click="selectAll"
        >
          <span class="pool-name">全部候选人</span>
          <el-tag size="small">{{ totalCount }}</el-tag>
        </div>

        <div class="pool-group-title">按人才池</div>
        <div
          v-for="pool in pools"
          :key="pool.id"
          class="pool-item"
          :class="{ active: activePoolId === pool.id }"
          @click="selectPool(pool.id)"
        >
          <div class="pool-name-wrap">
            <span class="pool-name">{{ pool.poolName }}</span>
            <el-tag v-if="pool.poolType === 'system'" size="small" type="info">系统</el-tag>
          </div>
          <el-tag size="small">{{ pool.candidateCount || 0 }}</el-tag>
        </div>

        <div class="pool-group-title">按状态</div>
        <div
          class="pool-item"
          :class="{ active: activeStatus === 'redlist' }"
          @click="selectStatus('redlist')"
        >
          <span class="pool-name">🏆 红名单</span>
          <el-tag size="small" type="danger">{{ statusCounts.redlist }}</el-tag>
        </div>
        <div
          class="pool-item"
          :class="{ active: activeStatus === 'blacklist' }"
          @click="selectStatus('blacklist')"
        >
          <span class="pool-name">🚫 黑名单</span>
          <el-tag size="small" type="info">{{ statusCounts.blacklist }}</el-tag>
        </div>
        <div
          class="pool-item"
          :class="{ active: activeStatus === 'frozen' }"
          @click="selectStatus('frozen')"
        >
          <span class="pool-name">❄️ 冷冻</span>
          <el-tag size="small">{{ statusCounts.frozen }}</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <!-- 筛选 -->
      <el-card class="filter-card">
        <el-form :model="queryParams">
          <div class="filter-form-content">
            <el-form-item label="关键词">
              <el-input
                v-model="queryParams.keyword"
                placeholder="姓名 / 手机号 / 公司 / 技能 / 标签"
                style="width: 280px"
                clearable
              />
            </el-form-item>
            <el-form-item label="期望城市">
              <el-input v-model="queryParams.expectedCity" placeholder="如：北京" style="width: 160px" clearable />
            </el-form-item>
            <el-form-item label="学历">
              <el-select v-model="queryParams.minDegree" placeholder="最低学历" style="width: 140px" clearable>
                <el-option label="高中" value="高中" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>
            <el-form-item label="工作年限">
              <el-input
                v-model.number="queryParams.minWorkYears"
                placeholder="≥"
                style="width: 100px"
              >
                <template #suffix>年</template>
              </el-input>
            </el-form-item>
            <el-form-item label="来源">
              <el-select v-model="queryParams.source" placeholder="来源" style="width: 140px" clearable>
                <el-option label="投递" value="apply" />
                <el-option label="内推" value="refer" />
                <el-option label="猎头推荐" value="hunter" />
                <el-option label="主动搜寻" value="search" />
                <el-option label="招聘活动" value="activity" />
                <el-option label="其他" value="other" />
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
          <div class="header-info">
            <span class="current-scope">{{ currentScopeLabel }}</span>
            <span class="candidates-count">共 {{ total }} 位候选人</span>
          </div>
          <div class="header-buttons">
            <el-button type="primary" @click="handleAddCandidate">
              <el-icon><Plus /></el-icon>
              新增候选人
            </el-button>
          </div>
        </div>

        <div class="table-container">
          <el-table :data="tableData" height="100%" style="width: 100%">
            <el-table-column prop="talentNo" label="编号" min-width="10%" />
            <el-table-column label="姓名" min-width="8%">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewProfile(row)">{{ row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" min-width="5%">
              <template #default="{ row }">
                {{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="workYears" label="年限" min-width="5%">
              <template #default="{ row }">{{ row.workYears ?? '-' }} 年</template>
            </el-table-column>
            <el-table-column prop="highestDegree" label="学历" min-width="6%" />
            <el-table-column prop="currentPosition" label="当前职位" min-width="12%">
              <template #default="{ row }">
                <div class="current-position">
                  <div>{{ row.currentPosition || '-' }}</div>
                  <div class="sub">{{ row.currentCompany || '' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="currentCity" label="所在地" min-width="7%" />
            <el-table-column prop="tags" label="标签" min-width="14%">
              <template #default="{ row }">
                <el-tag
                  v-for="t in (row.tags || '').split(',').filter(Boolean)"
                  :key="t"
                  size="small"
                  style="margin-right: 4px; margin-bottom: 2px"
                >
                  {{ t }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" min-width="8%">
              <template #default="{ row }">{{ sourceLabel(row.source) }}</template>
            </el-table-column>
            <el-table-column label="档案状态" min-width="8%">
              <template #default="{ row }">
                <el-tag v-if="row.profileStatus === 'active'" type="success">活跃</el-tag>
                <el-tag v-else-if="row.profileStatus === 'redlist'" type="danger">🏆 红名单</el-tag>
                <el-tag v-else-if="row.profileStatus === 'blacklist'" type="info">🚫 黑名单</el-tag>
                <el-tag v-else-if="row.profileStatus === 'frozen'">❄️ 冷冻</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="投递数" min-width="6%">
              <template #default="{ row }">{{ row.applyCount ?? 0 }}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="15%" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewProfile(row)">详情</el-button>
                <el-dropdown trigger="click" @command="(cmd: string) => handleStatusCommand(cmd, row)">
                  <el-button link type="primary">
                    状态
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="active" :disabled="row.profileStatus === 'active'">恢复活跃</el-dropdown-item>
                      <el-dropdown-item command="redlist" :disabled="row.profileStatus === 'redlist'">加入红名单</el-dropdown-item>
                      <el-dropdown-item command="blacklist" :disabled="row.profileStatus === 'blacklist'">加入黑名单</el-dropdown-item>
                      <el-dropdown-item command="frozen" :disabled="row.profileStatus === 'frozen'">冷冻 6 个月</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadData"
          @current-change="loadData"
        />
      </el-card>
    </div>

    <!-- 候选人档案详情弹窗 -->
    <el-dialog v-model="profileVisible" title="候选人档案" width="800px">
      <el-tabs v-model="profileActiveTab" class="profile-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="编号">{{ currentProfile.talentNo }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ currentProfile.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ currentProfile.gender === 'male' ? '男' : currentProfile.gender === 'female' ? '女' : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ currentProfile.birthDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ currentProfile.mobile }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentProfile.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="所在城市">{{ currentProfile.currentCity || '-' }}</el-descriptions-item>
            <el-descriptions-item label="期望城市">{{ currentProfile.expectedCity || '-' }}</el-descriptions-item>
            <el-descriptions-item label="最高学历">{{ currentProfile.highestDegree || '-' }}</el-descriptions-item>
            <el-descriptions-item label="毕业院校">{{ currentProfile.school || '-' }}</el-descriptions-item>
            <el-descriptions-item label="专业">{{ currentProfile.major || '-' }}</el-descriptions-item>
            <el-descriptions-item label="工作年限">{{ currentProfile.workYears ?? '-' }} 年</el-descriptions-item>
            <el-descriptions-item label="当前公司">{{ currentProfile.currentCompany || '-' }}</el-descriptions-item>
            <el-descriptions-item label="当前职位">{{ currentProfile.currentPosition || '-' }}</el-descriptions-item>
            <el-descriptions-item label="期望薪资">{{ currentProfile.expectedSalary || '-' }}</el-descriptions-item>
            <el-descriptions-item label="来源">{{ sourceLabel(currentProfile.source) }}</el-descriptions-item>
          </el-descriptions>

          <div class="profile-section">
            <div class="section-title">技能</div>
            <div>
              <el-tag
                v-for="s in (currentProfile.skills || '').split(',').filter(Boolean)"
                :key="s"
                style="margin-right: 6px; margin-bottom: 4px"
              >
                {{ s }}
              </el-tag>
            </div>
          </div>

          <div class="profile-section">
            <div class="section-title">标签</div>
            <div>
              <el-tag
                v-for="t in (currentProfile.tags || '').split(',').filter(Boolean)"
                :key="t"
                type="info"
                style="margin-right: 6px; margin-bottom: 4px"
              >
                {{ t }}
              </el-tag>
            </div>
          </div>

          <div class="profile-section" v-if="currentProfile.statusReason">
            <div class="section-title">档案状态备注</div>
            <el-alert
              :type="currentProfile.profileStatus === 'blacklist' ? 'error' : currentProfile.profileStatus === 'redlist' ? 'warning' : 'info'"
              :closable="false"
              show-icon
              :title="currentProfile.statusReason"
            />
            <div v-if="currentProfile.frozenUntil" class="frozen-hint">冷冻到期：{{ currentProfile.frozenUntil }}</div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="投递历史" name="history">
          <el-table :data="currentProfile.applyHistory || []" style="width: 100%" :max-height="400">
            <el-table-column prop="applyDate" label="投递日期" width="120" />
            <el-table-column prop="positionName" label="职位" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="resultTime" label="结束时间" width="160" />
          </el-table>
          <el-empty
            v-if="!currentProfile.applyHistory?.length"
            description="暂无投递记录"
            :image-size="80"
          />
        </el-tab-pane>

        <el-tab-pane label="所属人才池" name="pools">
          <div class="pool-tags-wrap">
            <el-tag
              v-for="pid in (currentProfile.poolIds || '').split(',').filter(Boolean)"
              :key="pid"
              size="large"
              style="margin-right: 8px; margin-bottom: 8px"
            >
              {{ pools.find((p) => p.id === Number(pid))?.poolName || `池 #${pid}` }}
            </el-tag>
            <el-empty
              v-if="!currentProfile.poolIds"
              description="暂未归属任何人才池"
              :image-size="80"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 新增候选人弹窗（含查重） -->
    <el-dialog v-model="addDialogVisible" title="新增候选人" width="640px" @close="handleAddClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="候选人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="必填，系统会自动查重" @blur="handleDedupe" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email" placeholder="选填" @blur="handleDedupe" />
        </el-form-item>
        <el-form-item label="所在城市">
          <el-input v-model="addForm.currentCity" />
        </el-form-item>
        <el-form-item label="工作年限">
          <el-input v-model.number="addForm.workYears" placeholder="年" />
        </el-form-item>
        <el-form-item label="最高学历">
          <el-select v-model="addForm.highestDegree" style="width: 100%" clearable>
            <el-option label="高中" value="高中" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="addForm.source" style="width: 100%">
            <el-option label="主动搜寻" value="search" />
            <el-option label="内推" value="refer" />
            <el-option label="猎头推荐" value="hunter" />
            <el-option label="招聘活动" value="activity" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属人才池">
          <el-select v-model="addForm.poolIds" multiple placeholder="可多选" style="width: 100%">
            <el-option
              v-for="p in pools"
              :key="p.id"
              :label="p.poolName"
              :value="String(p.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="dedupeWarning"
        type="warning"
        :closable="false"
        show-icon
        :title="dedupeWarning"
        style="margin-top: 12px"
      />

      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新建人才池 -->
    <el-dialog v-model="poolDialogVisible" title="新建人才池" width="520px" @close="handlePoolDialogClose">
      <el-form ref="poolFormRef" :model="poolForm" :rules="poolRules" label-width="100px">
        <el-form-item label="池名称" prop="poolName">
          <el-input v-model="poolForm.poolName" placeholder="如：2026 秋招池" />
        </el-form-item>
        <el-form-item label="池类型" prop="poolType">
          <el-select v-model="poolForm.poolType" style="width: 100%">
            <el-option label="岗位族" value="jobFamily" />
            <el-option label="事业部" value="bu" />
            <el-option label="招聘活动" value="activity" />
            <el-option label="猎头专属" value="hunter" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="poolForm.description" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
        <el-form-item label="可见范围" prop="visibility">
          <el-select v-model="poolForm.visibility" style="width: 100%">
            <el-option label="全员可见" value="all" />
            <el-option label="本部门可见" value="department" />
            <el-option label="指定用户可见" value="users" />
            <el-option label="仅负责人可见" value="owner" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="poolDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePoolSubmit">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import type { TalentProfile, TalentPool, TalentProfileListParams } from '@/types/talentPool'
import {
  getTalentProfileList,
  talentProfileApi,
  talentPoolApi,
  getPoolsWithCount,
  dedupeCheck,
  updateProfileStatus
} from '@/api/talentPool'

defineOptions({
  name: 'RecruitmentTalentPool'
})

const userStore = useUserStore()

// 左侧状态
const pools = ref<TalentPool[]>([])
const activePoolId = ref<number | null>(null)
const activeStatus = ref<string>('')
const statusCounts = ref({ redlist: 0, blacklist: 0, frozen: 0 })
const totalCount = ref(0)

// 列表筛选
const queryParams = reactive<TalentProfileListParams>({
  keyword: '',
  poolId: null,
  profileStatus: '',
  expectedCity: '',
  minWorkYears: null,
  minDegree: '',
  source: '',
  page: 1,
  pageSize: 20
})

const tableData = ref<TalentProfile[]>([])
const total = ref(0)

// 详情
const profileVisible = ref(false)
const profileActiveTab = ref('basic')
const currentProfile = ref<Partial<TalentProfile>>({})

// 新增候选人（poolIds 在表单中是 string[]，保存时再转成逗号分隔字符串）
interface AddCandidateForm {
  id?: number
  name: string
  mobile: string
  email?: string
  currentCity?: string
  workYears?: number
  highestDegree?: string
  source: string
  poolIds: string[]
}
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive<AddCandidateForm>({
  name: '',
  mobile: '',
  email: '',
  currentCity: '',
  workYears: 0,
  highestDegree: '',
  source: 'search',
  poolIds: []
})
const addRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  source: [{ required: true, message: '请选择来源', trigger: 'change' }]
}
const dedupeWarning = ref('')

// 新建人才池
const poolDialogVisible = ref(false)
const poolFormRef = ref()
const poolForm = reactive<Partial<TalentPool>>({
  poolName: '',
  poolType: 'jobFamily',
  description: '',
  visibility: 'all',
  status: 1
})
const poolRules = {
  poolName: [{ required: true, message: '请输入池名称', trigger: 'blur' }],
  poolType: [{ required: true, message: '请选择池类型', trigger: 'change' }],
  visibility: [{ required: true, message: '请选择可见范围', trigger: 'change' }]
}

// 当前视图的标签
const currentScopeLabel = computed(() => {
  if (activePoolId.value) {
    return pools.value.find((p) => p.id === activePoolId.value)?.poolName || '人才池'
  }
  const s = activeStatus.value
  if (s === 'redlist') return '🏆 红名单'
  if (s === 'blacklist') return '🚫 黑名单'
  if (s === 'frozen') return '❄️ 冷冻候选人'
  return '全部候选人'
})

const sourceLabel = (s?: string) => {
  const m: Record<string, string> = {
    apply: '投递',
    refer: '内推',
    hunter: '猎头',
    search: '主动搜寻',
    activity: '招聘活动',
    other: '其他'
  }
  return m[s || ''] || '-'
}

const loadPools = async () => {
  const res = await getPoolsWithCount()
  if (res.code === 200) {
    pools.value = res.data
  }
}

const loadStatusCounts = async () => {
  // 3 次拉取分别拿 redlist/blacklist/frozen 计数
  const q = { page: 1, pageSize: 1 } as any
  const red = await getTalentProfileList({ ...q, profileStatus: 'redlist' })
  const black = await getTalentProfileList({ ...q, profileStatus: 'blacklist' })
  const frozen = await getTalentProfileList({ ...q, profileStatus: 'frozen' })
  const all = await getTalentProfileList({ ...q })
  statusCounts.value = {
    redlist: red.data?.total || 0,
    blacklist: black.data?.total || 0,
    frozen: frozen.data?.total || 0
  }
  totalCount.value = all.data?.total || 0
}

const loadData = async () => {
  try {
    const res = await getTalentProfileList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载候选人失败')
  }
}

const selectAll = () => {
  activePoolId.value = null
  activeStatus.value = ''
  queryParams.poolId = null
  queryParams.profileStatus = ''
  queryParams.page = 1
  loadData()
}

const selectPool = (id: number) => {
  activePoolId.value = id
  activeStatus.value = ''
  queryParams.poolId = id
  queryParams.profileStatus = ''
  queryParams.page = 1
  loadData()
}

const selectStatus = (s: string) => {
  activeStatus.value = s
  activePoolId.value = null
  queryParams.poolId = null
  queryParams.profileStatus = s as any
  queryParams.page = 1
  loadData()
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.expectedCity = ''
  queryParams.minWorkYears = null
  queryParams.minDegree = ''
  queryParams.source = ''
  queryParams.page = 1
  loadData()
}

const handleViewProfile = (row: TalentProfile) => {
  currentProfile.value = row
  profileActiveTab.value = 'basic'
  profileVisible.value = true
}

const handleStatusCommand = async (cmd: string, row: TalentProfile) => {
  let reason = ''
  if (cmd === 'blacklist' || cmd === 'redlist') {
    try {
      const r = await ElMessageBox.prompt(
        cmd === 'blacklist' ? '请输入拉黑原因' : '请输入加入红名单的原因',
        '备注',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (v) => !!v || '原因不能为空'
        }
      )
      reason = r.value
    } catch {
      return
    }
  }
  let frozenUntil = ''
  if (cmd === 'frozen') {
    const d = new Date()
    d.setMonth(d.getMonth() + 6)
    frozenUntil = d.toISOString().slice(0, 10)
  }
  await updateProfileStatus(row.id, cmd as any, reason, frozenUntil)
  ElMessage.success('状态更新成功')
  loadData()
  loadStatusCounts()
}

const handleDedupe = async () => {
  if (!addForm.mobile && !addForm.email) return
  const r = await dedupeCheck({ mobile: addForm.mobile, email: addForm.email })
  if (r.code === 200 && r.data?.matched) {
    const field = r.data.matchField === 'mobile' ? '手机号' : r.data.matchField === 'email' ? '邮箱' : '身份证号'
    dedupeWarning.value = `该${field}已在人才库中存在（${r.data.profile.name} / ${r.data.profile.talentNo}），请确认是否重复录入`
  } else {
    dedupeWarning.value = ''
  }
}

const handleAddCandidate = () => {
  Object.assign(addForm, {
    id: undefined,
    name: '',
    mobile: '',
    email: '',
    currentCity: '',
    workYears: 0,
    highestDegree: '',
    source: 'search',
    poolIds: activePoolId.value ? [String(activePoolId.value)] : []
  })
  dedupeWarning.value = ''
  addDialogVisible.value = true
}

const handleAddSubmit = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const u = userStore.getUserInfo
      const maxId = (await talentProfileApi.getList({ page: 1, pageSize: 1000 })).data.total
      const { poolIds, ...rest } = addForm
      const payload: Partial<TalentProfile> = {
        ...rest,
        poolIds: poolIds.join(','),
        talentNo: `TP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(maxId + 1).padStart(3, '0')}`,
        profileStatus: 'active',
        ownerId: u.id,
        ownerName: u.nickname,
        applyCount: 0,
        applyHistory: []
      }
      await talentProfileApi.add(payload)
      ElMessage.success('新增成功')
      addDialogVisible.value = false
      loadData()
      loadPools()
      loadStatusCounts()
    } catch (e: any) {
      ElMessage.error(e?.message || '新增失败')
    }
  })
}

const handleAddClose = () => {
  addFormRef.value?.resetFields()
  dedupeWarning.value = ''
}

const handleAddPool = () => {
  Object.assign(poolForm, {
    id: undefined,
    poolName: '',
    poolType: 'jobFamily',
    description: '',
    visibility: 'all',
    status: 1
  })
  poolDialogVisible.value = true
}

const handlePoolSubmit = async () => {
  if (!poolFormRef.value) return
  await poolFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const u = userStore.getUserInfo
      await talentPoolApi.add({
        ...poolForm,
        ownerId: u.id,
        ownerName: u.nickname
      })
      ElMessage.success('人才池创建成功')
      poolDialogVisible.value = false
      loadPools()
    } catch (e: any) {
      ElMessage.error(e?.message || '创建失败')
    }
  })
}

const handlePoolDialogClose = () => {
  poolFormRef.value?.resetFields()
}

onMounted(() => {
  loadPools()
  loadStatusCounts()
  loadData()
})
</script>

<style scoped lang="scss">
.talent-pool-container {
  height: 100%;
  display: flex;
  gap: 16px;
}

.pool-card {
  flex-shrink: 0;
  width: 260px;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .pool-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .pool-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }

  .pool-list {
    flex: 1;
    overflow-y: auto;

    .pool-group-title {
      font-size: 12px;
      color: #909399;
      margin: 12px 0 8px;
      padding-left: 8px;
    }

    .pool-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        background-color: #ecf5ff;

        .pool-name {
          color: var(--el-color-primary);
          font-weight: 500;
        }
      }

      .pool-name-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      .pool-name {
        font-size: 13px;
        color: #303133;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .current-scope {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .candidates-count {
        font-size: 13px;
        color: #909399;
      }
    }

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

    .current-position {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .sub {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.profile-tabs {
  .profile-section {
    margin-top: 16px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #303133;
    }

    .frozen-hint {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
  }

  .pool-tags-wrap {
    padding: 16px 0;
  }
}
</style>
