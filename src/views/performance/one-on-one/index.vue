<template>
  <div class="ooo-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">1on1 总数</div>
        <div class="kpi-value">{{ oooStats.total || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已完成</div>
        <div class="kpi-value" style="color: #67c23a">{{ oooStats.completedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待进行</div>
        <div class="kpi-value" style="color: #e6a23c">{{ oooStats.pendingCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">覆盖员工</div>
        <div class="kpi-value">{{ oooStats.uniqueEmployees || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">平均时长</div>
        <div class="kpi-value">{{ oooStats.avgDuration || 0 }} 分</div>
      </el-card>
    </div>

    <PageTabs v-model="activeTab" class="ooo-tabs">
      <!-- Tab 1: 1on1 列表 -->
      <el-tab-pane label="1on1 管理" name="list">
        <el-card class="data-card">
          <div class="table-header">
            <el-button type="primary" @click="openCreateDialog">
              <el-icon><Plus /></el-icon>
              发起 1on1
            </el-button>
          </div>
          <el-table :data="oooList" stripe style="width: 100%">
            <el-table-column prop="oneOnOneNo" label="编号" min-width="140" />
            <el-table-column prop="employeeName" label="员工" min-width="80" />
            <el-table-column prop="leaderName" label="Leader" min-width="120" />
            <el-table-column label="发起方" min-width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.initiator === 'employee' ? 'primary' : 'success'">
                  {{ row.initiator === 'employee' ? '员工发起' : 'Leader 发起' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="plannedTime" label="计划时间" min-width="170" />
            <el-table-column prop="duration" label="时长（分）" min-width="90" align="center" />
            <el-table-column label="状态" min-width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="OOO_STATUS_MAP[row.status].type" size="small">
                  {{ OOO_STATUS_MAP[row.status].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="viewOoo(row)">查看</el-button>
                <el-button v-if="row.status === 'pending'" link type="success" @click="openCompleteDialog(row)">
                  填写纪要
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 2: 即时反馈 -->
      <el-tab-pane label="即时反馈" name="feedback">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="反馈对象">
              <el-input v-model="fbFilters.toName" placeholder="姓名" style="width: 160px" clearable />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="fbFilters.type" placeholder="全部" style="width: 130px" clearable>
                <el-option v-for="(t, k) in FEEDBACK_TYPE_MAP" :key="k" :label="t.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="openFbDialog">
                <el-icon><Plus /></el-icon>
                发反馈
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="data-card">
          <el-table :data="filteredFeedbacks" stripe style="width: 100%">
            <el-table-column prop="createTime" label="时间" width="170" />
            <el-table-column label="类型" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="FEEDBACK_TYPE_MAP[row.type].type" size="small">
                  {{ FEEDBACK_TYPE_MAP[row.type].icon }} {{ FEEDBACK_TYPE_MAP[row.type].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="fromName" label="发起人" width="120" />
            <el-table-column prop="toName" label="反馈对象" width="120" />
            <el-table-column prop="content" label="反馈内容" min-width="280" show-overflow-tooltip />
            <el-table-column prop="context" label="相关项目" width="180" show-overflow-tooltip />
            <el-table-column label="可见" width="120" align="center">
              <template #default="{ row }">
                <span>{{ VISIBILITY_MAP[row.visibility] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 3: 徽章认可 -->
      <el-tab-pane label="徽章认可" name="badges">
        <div class="badge-layout">
          <!-- 左侧：徽章墙 -->
          <el-card class="badge-wall-card">
            <div class="section-header">
              <div class="section-title">徽章墙</div>
              <el-select v-model="wallEmployeeId" style="width: 180px" @change="loadBadgeWall">
                <el-option v-for="(e, i) in empOptions" :key="i" :label="e.label" :value="e.id" />
              </el-select>
            </div>
            <div v-if="badgeWall" class="wall-overview">
              <div class="wall-stat">
                <div class="wall-num">{{ badgeWall.totalBadges }}</div>
                <div class="wall-label">累计徽章</div>
              </div>
              <div class="wall-stat">
                <div class="wall-num" style="color: #e6a23c">{{ badgeWall.totalPoints }}</div>
                <div class="wall-label">总积分</div>
              </div>
            </div>
            <div v-if="badgeWall" class="wall-grid">
              <div v-for="b in badgeWall.groupedBadges" :key="b.code" class="wall-item">
                <div class="wall-icon">{{ b.icon }}</div>
                <div class="wall-name">{{ b.name }}</div>
                <div class="wall-count">× {{ b.count }}</div>
                <div class="wall-points">{{ b.totalPoints }} 分</div>
              </div>
            </div>
            <el-empty v-else description="请选择员工" :image-size="80" />
          </el-card>

          <!-- 右侧：排行榜 -->
          <el-card class="leaderboard-card">
            <div class="section-title">徽章积分排行榜</div>
            <el-table :data="leaderboard" size="small" stripe>
              <el-table-column label="名次" width="70" align="center">
                <template #default="{ $index }">
                  <span v-if="$index === 0">🥇</span>
                  <span v-else-if="$index === 1">🥈</span>
                  <span v-else-if="$index === 2">🥉</span>
                  <span v-else>#{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="employeeName" label="员工" width="100" />
              <el-table-column prop="department" label="部门" width="110" />
              <el-table-column prop="badges" label="徽章数" width="90" align="center" />
              <el-table-column prop="points" label="积分" align="right">
                <template #default="{ row }">
                  <strong style="color: #e6a23c">{{ row.points }}</strong>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <el-card class="data-card" style="margin-top: 16px">
          <div class="table-header">
            <div class="section-title">最近颁发记录</div>
            <el-button type="primary" @click="openRecognitionDialog">
              <el-icon><Plus /></el-icon>
              授予徽章
            </el-button>
          </div>
          <el-table :data="recognitions" stripe>
            <el-table-column prop="createTime" label="时间" width="170" />
            <el-table-column label="徽章" width="220">
              <template #default="{ row }">
                <span class="badge-name">{{ row.badgeIcon }} {{ row.badgeTypeName }}</span>
                <span class="badge-points">+{{ row.points }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fromName" label="授予人" width="120" />
            <el-table-column label="角色" width="90" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.fromRole === 'leader' ? 'warning' : row.fromRole === 'hr' ? 'primary' : 'info'">
                  {{ row.fromRole === 'peer' ? '同事' : row.fromRole === 'leader' ? 'Leader' : 'HR' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="toName" label="接收人" width="120" />
            <el-table-column prop="reason" label="理由" min-width="280" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-tab-pane>
    </PageTabs>

    <!-- 发起 1on1 弹窗 -->
    <el-dialog v-model="createVisible" title="发起 1on1" width="500px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="员工">
          <el-input v-model="createForm.employeeName" />
        </el-form-item>
        <el-form-item label="员工 ID">
          <el-input v-model.number="createForm.employeeId" />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="createForm.departmentName" />
        </el-form-item>
        <el-form-item label="Leader">
          <el-input v-model="createForm.leaderName" />
        </el-form-item>
        <el-form-item label="发起方">
          <el-radio-group v-model="createForm.initiator">
            <el-radio value="leader">Leader 发起</el-radio>
            <el-radio value="employee">员工发起</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker v-model="createForm.plannedTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="准备内容">
          <el-input
            v-model="createForm.prep"
            type="textarea"
            :rows="4"
            placeholder="本次 1on1 你想聊的话题，员工需要准备的材料等"
          />
          <div class="prep-toolbar">
            <el-button
              link
              type="primary"
              :disabled="!createForm.employeeName"
              @click="aiProfileVisible = true"
            >
              <el-icon><ArtAiIcon /></el-icon>
              查看员工资料卡（AI 辅助参考）
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">创建</el-button>
      </template>
    </el-dialog>

    <!-- 填写纪要弹窗 -->
    <el-dialog v-model="completeVisible" title="填写 1on1 纪要" width="680px" top="6vh">
      <el-form v-if="completeTarget" label-width="120px">
        <el-descriptions :column="2" border size="small" style="margin-bottom: 12px">
          <el-descriptions-item label="员工">{{ completeTarget.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="Leader">{{ completeTarget.leaderName }}</el-descriptions-item>
        </el-descriptions>
        <el-form-item label="实际时长">
          <el-input v-model.number="completeForm.duration"><template #append>分钟</template></el-input>
        </el-form-item>
        <el-form-item label="提纲模板">
          <el-select v-model="templateKey" placeholder="快速套用" style="width: 180px" @change="applyTemplate">
            <el-option label="职业发展" value="career" />
            <el-option label="工作反馈" value="work" />
            <el-option label="项目回顾" value="project" />
            <el-option label="个人议题" value="personal" />
            <el-option label="自由讨论" value="open" />
          </el-select>
        </el-form-item>
        <el-form-item label="会议纪要">
          <el-input v-model="completeForm.minutes" type="textarea" :rows="6" />
        </el-form-item>
        <el-form-item label="关键决定">
          <el-input v-model="completeForm.keyDecisions" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="后续待办">
          <el-input v-model="followUpInput" type="textarea" :rows="3" placeholder="每行一条，格式：内容|截止日期，如 提交架构师训练营申请|2026-06-30" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completeVisible = false">取消</el-button>
        <el-button type="primary" @click="submitComplete">提交纪要</el-button>
      </template>
    </el-dialog>

    <!-- 查看纪要弹窗 -->
    <el-dialog v-model="viewVisible" title="1on1 详情" width="640px">
      <el-scrollbar v-if="viewData" max-height="68vh">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工">{{ viewData.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="Leader">{{ viewData.leaderName }}</el-descriptions-item>
          <el-descriptions-item label="计划时间">{{ viewData.plannedTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="实际时间">{{ viewData.actualTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ viewData.duration ? viewData.duration + ' 分钟' : '—' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="OOO_STATUS_MAP[viewData.status].type">{{ OOO_STATUS_MAP[viewData.status].label }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="viewData.employeePrep" class="view-section">
          <div class="section-title">员工准备</div>
          <div class="view-body">{{ viewData.employeePrep }}</div>
        </div>
        <div v-if="viewData.leaderPrep" class="view-section">
          <div class="section-title">Leader 准备</div>
          <div class="view-body">{{ viewData.leaderPrep }}</div>
        </div>
        <div v-if="viewData.minutes" class="view-section">
          <div class="section-title">会议纪要</div>
          <div class="view-body">{{ viewData.minutes }}</div>
        </div>
        <div v-if="viewData.keyDecisions" class="view-section">
          <div class="section-title">关键决定</div>
          <div class="view-body">{{ viewData.keyDecisions }}</div>
        </div>
        <div v-if="viewData.followUpTasks && viewData.followUpTasks.length" class="view-section">
          <div class="section-title">后续待办</div>
          <ul>
            <li v-for="(t, i) in viewData.followUpTasks" :key="i">
              {{ t.content }}
              <span v-if="t.dueDate" class="muted">（{{ t.dueDate }}）</span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 发反馈弹窗 -->
    <el-dialog v-model="fbVisible" title="发送即时反馈" width="520px">
      <el-form :model="fbForm" label-width="100px">
        <el-form-item label="反馈对象">
          <el-input v-model="fbForm.toName" placeholder="员工姓名" />
        </el-form-item>
        <el-form-item label="对象部门">
          <el-input v-model="fbForm.toDepartment" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="fbForm.type">
            <el-radio value="appreciation">👏 赞赏</el-radio>
            <el-radio value="suggestion">💡 建议</el-radio>
            <el-radio value="correction">⚠ 纠偏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input v-model="fbForm.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="相关项目">
          <el-input v-model="fbForm.context" placeholder="可选" />
        </el-form-item>
        <el-form-item label="可见范围">
          <el-radio-group v-model="fbForm.visibility">
            <el-radio value="private">仅双方</el-radio>
            <el-radio value="with_leader">双方+Leader</el-radio>
            <el-radio value="public">团队公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="fbVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">发送</el-button>
      </template>
    </el-dialog>

    <!-- 授予徽章弹窗 -->
    <el-dialog v-model="recogVisible" title="授予徽章" width="560px">
      <el-form :model="recogForm" label-width="100px">
        <el-form-item label="徽章类型">
          <el-select v-model="recogForm.badgeTypeCode" style="width: 100%" @change="onBadgeChange">
            <el-option v-for="b in badgeTypes" :key="b.code" :value="b.code" :label="`${b.icon} ${b.name}（${b.points} 分）`" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="recogForm.toName" />
        </el-form-item>
        <el-form-item label="接收人部门">
          <el-input v-model="recogForm.toDepartment" />
        </el-form-item>
        <el-form-item label="授予人角色">
          <el-radio-group v-model="recogForm.fromRole">
            <el-radio value="peer">同事</el-radio>
            <el-radio value="leader">Leader</el-radio>
            <el-radio value="hr">HR</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="理由（具体事例）">
          <el-input v-model="recogForm.reason" type="textarea" :rows="3" placeholder="请描述具体事件或贡献" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRecognition">授予</el-button>
      </template>
    </el-dialog>

    <!-- AI 员工资料卡（Drawer 抽屉：与发起 1on1 弹窗并存，避免双层模态）-->
    <EmployeeProfileDrawer
      v-model="aiProfileVisible"
      :context-input="buildEmployeeProfileInput()"
      :target-employee="createForm.employeeName || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import EmployeeProfileDrawer from '@/views/performance/_shared/EmployeeProfileDrawer.vue'
import {
  getOneOnOneList,
  addOneOnOne,
  completeOneOnOne,
  getFeedbackList,
  addFeedback,
  getBadgeTypes,
  getRecognitions,
  addRecognition,
  getBadgeWall,
  getBadgeLeaderboard,
  getOneOnOneStats
} from '@/api/performanceOneOnOne'
import type { OneOnOne, FeedbackRecord, BadgeType, Recognition } from '@/types/performanceOneOnOne'
import {
  OOO_STATUS_MAP,
  FEEDBACK_TYPE_MAP,
  VISIBILITY_MAP,
  OOO_TEMPLATES
} from '@/types/performanceOneOnOne'

defineOptions({ name: 'PerformanceOneOnOne' })

const activeTab = ref<'list' | 'feedback' | 'badges'>('list')

/* ========== 1on1 ========== */
const oooList = ref<OneOnOne[]>([])
const oooStats = ref<any>({})

const loadOoo = async () => {
  const res = await getOneOnOneList({ pageSize: 100 })
  oooList.value = res.data?.list || []
  const s = await getOneOnOneStats()
  oooStats.value = s.data
}

const createVisible = ref(false)

const createForm = reactive({
  employeeId: 0,
  employeeName: '',
  departmentName: '',
  leaderId: 0,
  leaderName: '',
  initiator: 'leader' as 'leader' | 'employee',
  plannedTime: '',
  prep: ''
})

// AI 员工资料卡（仅参考，adoptable=false 不填入"准备内容"——Leader 自己写）
const aiProfileVisible = ref(false)
const buildEmployeeProfileInput = (): string => {
  if (!createForm.employeeName) return ''
  // Mock 阶段：拼接员工身份信息 + 数据获取请求；真接入 LLM 时此处由 RAG 层注入真实数据
  return `员工：${createForm.employeeName}（部门：${createForm.departmentName || '-'}）
1on1 Leader：${createForm.leaderName || '-'}
计划时间：${createForm.plannedTime || '-'}

请基于员工本季度 OKR 进度、360 评分趋势（脱敏）、出勤异常、代码活跃度、上次 1on1 议题，
生成"数据快照 + AI 智能洞察 + 重点关注"三段式资料卡。
仅做现状洞察，不替 Leader 设计对话或写提问。`
}

const openCreateDialog = () => {
  Object.assign(createForm, {
    employeeId: 0, employeeName: '', departmentName: '',
    leaderId: 0, leaderName: '', initiator: 'leader', plannedTime: '', prep: ''
  })
  createVisible.value = true
}

const submitCreate = async () => {
  const now = new Date()
  const no = `O2O${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`
  const prepField = createForm.initiator === 'employee' ? 'employeePrep' : 'leaderPrep'
  await addOneOnOne({
    oneOnOneNo: no,
    employeeId: createForm.employeeId,
    employeeName: createForm.employeeName,
    departmentName: createForm.departmentName,
    leaderId: createForm.leaderId,
    leaderName: createForm.leaderName,
    initiator: createForm.initiator,
    plannedTime: createForm.plannedTime,
    [prepField]: createForm.prep,
    status: 'pending'
  } as any)
  ElMessage.success('已创建')
  createVisible.value = false
  loadOoo()
}

/* ========== 完成纪要 ========== */
const completeVisible = ref(false)
const completeTarget = ref<OneOnOne | null>(null)
const completeForm = reactive({
  duration: 45,
  minutes: '',
  keyDecisions: ''
})
const followUpInput = ref('')
const templateKey = ref('')

const openCompleteDialog = (row: OneOnOne) => {
  completeTarget.value = row
  completeForm.duration = 45
  completeForm.minutes = ''
  completeForm.keyDecisions = ''
  followUpInput.value = ''
  templateKey.value = ''
  completeVisible.value = true
}

const applyTemplate = (key: string) => {
  const t = (OOO_TEMPLATES as any)[key]
  if (t) completeForm.minutes = completeForm.minutes ? completeForm.minutes + '\n\n' + t : t
}

const submitComplete = async () => {
  if (!completeTarget.value) return
  const tasks = followUpInput.value
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [content, dueDate] = s.split('|').map((x) => x.trim())
      return { content, dueDate }
    })
  await completeOneOnOne(completeTarget.value.id, {
    duration: completeForm.duration,
    minutes: completeForm.minutes,
    keyDecisions: completeForm.keyDecisions,
    followUpTasks: tasks
  })
  ElMessage.success('纪要已提交')
  completeVisible.value = false
  loadOoo()
}

/* ========== 查看纪要 ========== */
const viewVisible = ref(false)
const viewData = ref<OneOnOne | null>(null)
const viewOoo = (row: OneOnOne) => {
  viewData.value = row
  viewVisible.value = true
}

/* ========== 反馈 ========== */
const feedbacks = ref<FeedbackRecord[]>([])
const fbFilters = reactive({ toName: '', type: '' as string })

const filteredFeedbacks = computed(() =>
  feedbacks.value.filter(
    (f) =>
      (!fbFilters.toName || f.toName.includes(fbFilters.toName)) &&
      (!fbFilters.type || f.type === fbFilters.type)
  )
)

const loadFeedbacks = async () => {
  const res = await getFeedbackList({ pageSize: 200 })
  feedbacks.value = (res.data?.list || []).sort((a: FeedbackRecord, b: FeedbackRecord) =>
    b.createTime.localeCompare(a.createTime)
  )
}

const fbVisible = ref(false)
const fbForm = reactive({
  toName: '',
  toDepartment: '',
  toId: 0,
  type: 'appreciation' as any,
  content: '',
  context: '',
  visibility: 'private' as any
})

const openFbDialog = () => {
  Object.assign(fbForm, {
    toName: '', toDepartment: '', toId: 0, type: 'appreciation',
    content: '', context: '', visibility: 'private'
  })
  fbVisible.value = true
}

const submitFeedback = async () => {
  if (!fbForm.content) {
    ElMessage.warning('请填写反馈内容')
    return
  }
  const now = new Date()
  const no = `FB${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`
  await addFeedback({
    feedbackNo: no,
    fromId: 999,
    fromName: '当前用户',
    toId: fbForm.toId,
    toName: fbForm.toName,
    toDepartment: fbForm.toDepartment,
    type: fbForm.type,
    content: fbForm.content,
    context: fbForm.context,
    visibility: fbForm.visibility
  } as any)
  ElMessage.success('反馈已发送')
  fbVisible.value = false
  loadFeedbacks()
}

/* ========== 徽章 ========== */
const badgeTypes = ref<BadgeType[]>([])
const recognitions = ref<Recognition[]>([])
const leaderboard = ref<any[]>([])
const wallEmployeeId = ref<number | null>(201)
const badgeWall = ref<any>(null)

const empOptions = computed(() => {
  const map = new Map<number, { id: number; label: string }>()
  for (const r of recognitions.value) {
    if (!map.has(r.toId)) map.set(r.toId, { id: r.toId, label: `${r.toName}（${r.toDepartment}）` })
  }
  return [...map.values()]
})

const loadBadges = async () => {
  const bt = await getBadgeTypes({ pageSize: 100 })
  badgeTypes.value = bt.data?.list || []
  const rec = await getRecognitions({ pageSize: 200 })
  recognitions.value = (rec.data?.list || []).sort((a: Recognition, b: Recognition) =>
    b.createTime.localeCompare(a.createTime)
  )
  const lb = await getBadgeLeaderboard()
  leaderboard.value = lb.data || []
  loadBadgeWall()
}

const loadBadgeWall = async () => {
  if (!wallEmployeeId.value) return
  const res = await getBadgeWall(wallEmployeeId.value)
  badgeWall.value = res.data
}

const recogVisible = ref(false)
const recogForm = reactive({
  badgeTypeCode: '',
  badgeTypeName: '',
  badgeIcon: '',
  points: 0,
  toId: 999,
  toName: '',
  toDepartment: '',
  fromRole: 'peer' as any,
  reason: ''
})

const openRecognitionDialog = () => {
  Object.assign(recogForm, {
    badgeTypeCode: '', badgeTypeName: '', badgeIcon: '', points: 0,
    toId: 999, toName: '', toDepartment: '', fromRole: 'peer', reason: ''
  })
  recogVisible.value = true
}

const onBadgeChange = (code: string) => {
  const b = badgeTypes.value.find((x) => x.code === code)
  if (b) {
    recogForm.badgeTypeName = b.name
    recogForm.badgeIcon = b.icon
    recogForm.points = b.points
  }
}

const submitRecognition = async () => {
  if (!recogForm.badgeTypeCode || !recogForm.toName || !recogForm.reason) {
    ElMessage.warning('请完整填写')
    return
  }
  await addRecognition({
    badgeTypeCode: recogForm.badgeTypeCode,
    badgeTypeName: recogForm.badgeTypeName,
    badgeIcon: recogForm.badgeIcon,
    fromId: 999,
    fromName: '当前用户',
    fromRole: recogForm.fromRole,
    toId: recogForm.toId,
    toName: recogForm.toName,
    toDepartment: recogForm.toDepartment,
    reason: recogForm.reason,
    points: recogForm.points
  } as any)
  ElMessage.success('徽章已授予')
  recogVisible.value = false
  loadBadges()
}

/* ============ 来自 RiskAlertDrawer 的预填跳转 ============ */
const route = useRoute()
const router = useRouter()

const handleQueryPrefill = () => {
  const empId = route.query.createForEmployeeId
  const empName = route.query.createForEmployeeName
  const dept = route.query.createForDepartment
  if (empName && typeof empName === 'string') {
    Object.assign(createForm, {
      employeeId: empId ? Number(empId) : 0,
      employeeName: empName,
      departmentName: typeof dept === 'string' ? dept : '',
      leaderId: 0,
      leaderName: '',
      initiator: 'leader',
      plannedTime: '',
      prep: '风险预警触发的关怀 1on1 —— 请基于 AI 风险信号准备议题，HR 自行判断如何沟通。'
    })
    createVisible.value = true
    activeTab.value = 'list'
    // 清掉 query 防止刷新重复触发
    router.replace({ path: route.path, query: {} })
  }
}

onMounted(() => {
  loadOoo()
  loadFeedbacks()
  loadBadges()
  handleQueryPrefill()
})
</script>

<style scoped lang="scss">
.prep-toolbar {
  display: flex;
  align-items: center;
  margin-top: 6px;
  line-height: 1;
}

.ooo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.kpi-card,
.filter-card,
.data-card,
.badge-wall-card,
.leaderboard-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.ooo-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: auto;
  }
  :deep(.el-tab-pane) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.filter-card :deep(.el-card__body) {
  padding: 12px 20px;
}

.data-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.view-section {
  margin-top: 16px;

  .view-body {
    padding: 10px 14px;
    background: #fafbfc;
    border-radius: 6px;
    color: #606266;
    font-size: 13px;
    white-space: pre-line;
    line-height: 1.8;
  }
}

.muted {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

/* Badges */
.badge-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
}

.wall-overview {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(120deg, #fff8e1 0%, #fff3cd 100%);
  border-radius: 10px;

  .wall-stat {
    .wall-num {
      font-size: 28px;
      font-weight: 700;
      color: #303133;
    }

    .wall-label {
      font-size: 12px;
      color: #909399;
    }
  }
}

.wall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  .wall-item {
    padding: 14px;
    text-align: center;
    background: #fafbfc;
    border-radius: 10px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      background: #fdf6e3;
    }

    .wall-icon {
      font-size: 36px;
      margin-bottom: 6px;
    }

    .wall-name {
      font-size: 13px;
      font-weight: 600;
      color: #303133;
    }

    .wall-count {
      font-size: 12px;
      color: #606266;
      margin-top: 4px;
    }

    .wall-points {
      font-size: 12px;
      color: #e6a23c;
      font-weight: 600;
      margin-top: 2px;
    }
  }
}

.badge-name {
  font-weight: 500;
  color: #303133;
}

.badge-points {
  color: #e6a23c;
  font-weight: 600;
  margin-left: 8px;
}
</style>
