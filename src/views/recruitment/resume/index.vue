<template>
  <div class="resume-container">
    <ModuleTabBar :tabs="resumeGroupTabs" />
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="简历编号">
            <el-input v-model="queryParams.resumeNo" placeholder="请输入简历编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="候选人姓名">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="应聘岗位">
            <el-input v-model="queryParams.position" placeholder="请输入应聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="来源渠道">
            <el-input v-model="queryParams.source" placeholder="请输入来源渠道" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="待筛选" :value="1" />
              <el-option label="待面试" :value="2" />
              <el-option label="面试中" :value="3" />
              <el-option label="已入库" :value="4" />
              <el-option label="已淘汰" :value="5" />
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
          <el-button type="primary" @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入简历
          </el-button>
          <el-button type="success" :disabled="selectedIds.length === 0" @click="handleBatchStore">
            批量入库
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
          <el-table-column prop="resumeNo" label="简历编号" min-width="10%" />
          <el-table-column label="候选人" min-width="10%">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">{{ row.candidateName }}</el-button>
              <el-tag v-if="row.talentProfileId" size="small" type="success" style="margin-left: 4px">
                已入档案
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="性别/年龄" min-width="8%">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }} / {{ row.age }}岁
            </template>
          </el-table-column>
          <el-table-column prop="position" label="应聘岗位" min-width="10%" />
          <el-table-column label="工作年限" min-width="6%">
            <template #default="{ row }">{{ row.workYears }}年</template>
          </el-table-column>
          <el-table-column prop="education" label="学历" min-width="6%" />
          <el-table-column label="JD 匹配度" min-width="8%">
            <template #default="{ row }">
              <span v-if="row.jdMatchScore == null">-</span>
              <el-tag
                v-else
                :type="row.jdMatchScore >= 75 ? 'success' : row.jdMatchScore >= 60 ? 'warning' : 'danger'"
                size="small"
              >
                {{ row.jdMatchScore }} 分
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="解析" min-width="6%">
            <template #default="{ row }">
              <el-tag v-if="row.parseStatus === 'success'" size="small" type="success">已解析</el-tag>
              <el-tag v-else-if="row.parseStatus === 'manual'" size="small">人工修正</el-tag>
              <el-tag v-else-if="row.parseStatus === 'parsing'" size="small" type="info">解析中</el-tag>
              <el-tag v-else-if="row.parseStatus === 'failed'" size="small" type="danger">解析失败</el-tag>
              <el-tag v-else size="small" type="info">-</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" min-width="8%" />
          <el-table-column label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="info">待筛选</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">待面试</el-tag>
              <el-tag v-else-if="row.status === 3" type="primary">面试中</el-tag>
              <el-tag v-else-if="row.status === 4" type="success">已入库</el-tag>
              <el-tag v-else-if="row.status === 5" type="danger">已淘汰</el-tag>
              <el-tag v-else-if="row.status === 3 && row.rejectReasonText" type="danger">
                淘汰（{{ row.rejectReasonText }}）
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="16%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">详情</el-button>
              <el-button
                link
                type="primary"
                :disabled="row.status === 2 || row.status === 3"
                @click="handleScheduleInterview(row)"
              >
                安排面试
              </el-button>
              <el-button
                link
                type="success"
                :disabled="row.status === 4 || !!row.talentProfileId"
                @click="handleStore(row)"
              >
                入库
              </el-button>
              <el-button link type="danger" :disabled="row.status === 5" @click="handleReject(row)">
                淘汰
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

    <!-- 详情弹窗（改为 Tab 模式：基本信息 / 团队讨论） -->
    <el-dialog v-model="detailVisible" title="简历详情" width="860px" :close-on-click-modal="false">
      <el-tabs v-model="detailTab">
        <el-tab-pane label="基本信息" name="info">
          <el-scrollbar height="500px">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="简历编号">{{ currentResume?.resumeNo }}</el-descriptions-item>
              <el-descriptions-item label="候选人姓名">
                {{ currentResume?.candidateName }}
                <el-tag v-if="currentResume?.talentProfileId" size="small" type="success" style="margin-left: 6px">
                  档案ID: {{ currentResume.talentProfileId }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="性别">{{ currentResume?.gender === 1 ? '男' : '女' }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ currentResume?.age }}岁</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ currentResume?.phone }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ currentResume?.email }}</el-descriptions-item>
              <el-descriptions-item label="现居地" :span="2">{{ currentResume?.location }}</el-descriptions-item>
              <el-descriptions-item label="应聘岗位">{{ currentResume?.position }}</el-descriptions-item>
              <el-descriptions-item label="工作年限">{{ currentResume?.workYears }}年</el-descriptions-item>
              <el-descriptions-item label="学历">{{ currentResume?.education }}</el-descriptions-item>
              <el-descriptions-item label="期望薪资">{{ currentResume?.expectedSalary }}</el-descriptions-item>
              <el-descriptions-item label="毕业院校">{{ currentResume?.school }}</el-descriptions-item>
              <el-descriptions-item label="专业">{{ currentResume?.major }}</el-descriptions-item>
              <el-descriptions-item label="来源渠道">{{ currentResume?.source }}</el-descriptions-item>
              <el-descriptions-item label="JD 匹配度">
                <el-tag
                  v-if="currentResume?.jdMatchScore != null"
                  :type="currentResume.jdMatchScore >= 75 ? 'success' : currentResume.jdMatchScore >= 60 ? 'warning' : 'danger'"
                  size="small"
                >
                  {{ currentResume.jdMatchScore }} 分
                </el-tag>
                <span v-else>-</span>
              </el-descriptions-item>
              <el-descriptions-item label="解析状态">
                <el-tag v-if="currentResume?.parseStatus === 'success'" size="small" type="success">已解析</el-tag>
                <el-tag v-else-if="currentResume?.parseStatus === 'manual'" size="small">人工修正</el-tag>
                <el-tag v-else size="small" type="info">-</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag v-if="currentResume?.status === 1" type="info">待筛选</el-tag>
                <el-tag v-else-if="currentResume?.status === 2" type="warning">待面试</el-tag>
                <el-tag v-else-if="currentResume?.status === 3" type="primary">面试中</el-tag>
                <el-tag v-else-if="currentResume?.status === 4" type="success">已入库</el-tag>
                <el-tag v-else-if="currentResume?.status === 5" type="danger">已淘汰</el-tag>
              </el-descriptions-item>
              <el-descriptions-item v-if="currentResume?.rejectReasonText" label="淘汰原因" :span="2">
                <el-alert
                  type="error"
                  :closable="false"
                  show-icon
                  :title="`${currentResume.rejectReasonText}（${currentResume.rejectByName || '-'} ${currentResume.rejectTime || ''}）`"
                />
              </el-descriptions-item>
              <el-descriptions-item label="标签" :span="2">
                <el-tag v-for="tag in currentResume?.tags" :key="tag" style="margin-right: 4px">
                  {{ tag }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="工作经历" :span="2">
                <div style="white-space: pre-wrap">{{ currentResume?.workExperience }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="项目经历" :span="2">
                <div style="white-space: pre-wrap">{{ currentResume?.projectExperience }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="自我评价" :span="2">
                <div style="white-space: pre-wrap">{{ currentResume?.selfEvaluation }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentResume?.createTime }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ currentResume?.updateTime }}</el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="✨ AI 解析" name="ai-parse">
          <div class="ai-parse-panel">
            <el-alert
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 12px"
              title="AI 简历解析"
              description="AI 基于工作经历+期望薪资抽取结构化字段并分析岗位匹配度。结果为草稿参考，入库前请 HR 核对关键字段。"
            />
            <div v-if="aiParseLoading" class="ai-parse-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>AI 正在解析简历中…</span>
            </div>
            <el-scrollbar v-else-if="aiParseOutput" max-height="480px">
              <pre class="ai-parse-output">{{ aiParseOutput }}</pre>
              <div class="ai-parse-footer">
                <el-button size="small" @click="triggerResumeParse">重新解析</el-button>
              </div>
            </el-scrollbar>
            <div v-else class="ai-parse-empty">
              <span class="ai-parse-hint">切换到本 Tab 时将自动调用 AI 解析…</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`团队讨论（${notes.length}）`" name="notes">
          <div class="notes-panel">
            <div class="notes-list">
              <div v-if="notes.length === 0" class="notes-empty">
                暂无团队讨论，来发表第一条评论吧
              </div>
              <div v-for="n in notes" :key="n.id" class="note-item">
                <div class="note-head">
                  <span class="note-author">{{ n.authorName }}</span>
                  <span class="note-time">{{ n.createTime }}</span>
                  <el-button
                    v-if="n.authorId === userStore.getUserInfo.id"
                    link
                    type="danger"
                    @click="handleDeleteNote(n.id)"
                  >
                    删除
                  </el-button>
                </div>
                <div class="note-content" v-html="formatMention(n.content)"></div>
              </div>
            </div>
            <div class="notes-input">
              <el-input
                v-model="noteInput"
                type="textarea"
                :rows="3"
                placeholder="支持 @提醒他人（如 @张HR），按 Ctrl+Enter 发送"
                @keydown.ctrl.enter="handleSubmitNote"
              />
              <div class="notes-tip">
                <span class="hint">内部可见，候选人看不到</span>
                <el-button type="primary" :disabled="!noteInput.trim()" @click="handleSubmitNote">
                  发表评论
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 安排面试弹窗 -->
    <el-dialog v-model="interviewVisible" title="安排面试" width="600px" :close-on-click-modal="false">
      <el-form :model="interviewForm" label-width="100px">
        <el-form-item label="候选人">
          <el-input :model-value="currentResume?.candidateName" disabled />
        </el-form-item>
        <el-form-item label="应聘岗位">
          <el-input :model-value="currentResume?.position" disabled />
        </el-form-item>
        <el-form-item label="面试官" required>
          <el-input v-model="interviewForm.interviewer" placeholder="请输入面试官姓名" />
        </el-form-item>
        <el-form-item label="面试时间" required>
          <el-date-picker
            v-model="interviewForm.interviewTime"
            type="datetime"
            placeholder="请选择面试时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="面试地点" required>
          <el-input v-model="interviewForm.interviewLocation" placeholder="请输入面试地点" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="interviewForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="interviewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmInterview">确定</el-button>
      </template>
    </el-dialog>

    <!-- 淘汰简历弹窗（Phase 2.1 新增：选择标准化淘汰原因） -->
    <el-dialog v-model="rejectVisible" title="淘汰候选人" width="520px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="候选人">
          <el-input :model-value="currentResume?.candidateName" disabled />
        </el-form-item>
        <el-form-item label="淘汰原因" required>
          <el-select v-model="rejectForm.reasonCode" placeholder="请选择淘汰原因" style="width: 100%">
            <el-option
              v-for="r in REJECT_REASON_OPTIONS"
              :key="r.code"
              :label="r.label"
              :value="r.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input v-model="rejectForm.remark" type="textarea" :rows="3" placeholder="选填，补充说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="handleConfirmReject">确定淘汰</el-button>
      </template>
    </el-dialog>

    <!-- 批量上传简历弹窗 -->
    <el-dialog v-model="importVisible" title="批量上传简历" width="600px">
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="支持拖拽或点击上传 PDF / Word / 图片简历，系统将自动解析字段（准确率约 85%），解析后的简历可在列表中人工修正"
        style="margin-bottom: 12px"
      />
      <el-upload
        drag
        multiple
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".pdf,.doc,.docx,.jpg,.png"
      >
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">拖拽文件到此处，或<em>点击选择</em></div>
        <div class="upload-hint">支持 PDF / Word / 图片，单次最多 50 份</div>
      </el-upload>

      <div v-if="importFiles.length > 0" class="import-list">
        <div class="import-list-title">
          已选文件（{{ importFiles.length }}）
        </div>
        <div v-for="(f, idx) in importFiles" :key="idx" class="import-item">
          <el-icon class="file-icon"><Document /></el-icon>
          <span class="file-name">{{ f.name }}</span>
          <el-tag
            v-if="f.parseStatus === 'success'"
            size="small"
            type="success"
          >解析成功</el-tag>
          <el-tag
            v-else-if="f.parseStatus === 'parsing'"
            size="small"
            type="info"
          >解析中</el-tag>
          <el-tag
            v-else-if="f.parseStatus === 'failed'"
            size="small"
            type="danger"
          >失败</el-tag>
          <el-tag v-else size="small" type="info">待解析</el-tag>
          <el-button link type="danger" @click="importFiles.splice(idx, 1)">移除</el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="importFiles.length === 0 || importing"
          :loading="importing"
          @click="handleBatchParse"
        >
          {{ importing ? '解析中...' : `开始解析（${importFiles.length} 份）` }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 入库查重提示弹窗 -->
    <el-dialog v-model="dedupeVisible" title="候选人查重结果" width="520px">
      <el-alert
        v-if="dedupeResult.resumeMatch"
        type="warning"
        :closable="false"
        show-icon
        :title="`该候选人手机号/邮箱已在简历库中存在（${dedupeResult.resumeMatch.candidateName} / ${dedupeResult.resumeMatch.resumeNo}）`"
        style="margin-bottom: 12px"
      />
      <el-alert
        v-if="dedupeResult.talentMatch"
        type="warning"
        :closable="false"
        show-icon
        :title="`该候选人已在人才库中存在（${dedupeResult.talentMatch.name} / ${dedupeResult.talentMatch.talentNo}）`"
      />
      <template #footer>
        <el-button @click="dedupeVisible = false">取消入库</el-button>
        <el-button type="primary" @click="doConfirmStore">仍然入库</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Document, Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import ModuleTabBar from '@/views/recruitment/_shared/ModuleTabBar.vue'
import type { Resume, ResumeListParams, CandidateNote } from '@/types/recruitment'

const resumeGroupTabs = [
  { label: '简历库', path: '/recruit/resume' },
  { label: 'AI 智能匹配', path: '/recruit/ai-matching/x' }
]
import { REJECT_REASON_OPTIONS } from '@/types/recruitment'
import {
  getResumeList,
  getResumeDetail,
  importResume,
  batchStoreResume,
  batchDeleteResume,
  scheduleInterview,
  rejectResume,
  checkDuplicateResume,
  linkResumeToTalent,
  getCandidateNotes,
  addCandidateNote,
  deleteCandidateNote
} from '@/api/recruitment/resume'
import { dedupeCheck, talentProfileApi } from '@/api/talentPool'

defineOptions({
  name: 'RecruitmentResume'
})

const userStore = useUserStore()
const router = useRouter()

// 查询参数
const queryParams = reactive<ResumeListParams>({
  resumeNo: '',
  candidateName: '',
  position: '',
  source: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Resume[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 详情弹窗
const detailVisible = ref(false)
const detailTab = ref<'info' | 'ai-parse' | 'notes'>('info')
const currentResume = ref<Resume>()
// AI 简历解析
const aiParseOutput = ref('')
const aiParseLoading = ref(false)
const triggerResumeParse = async () => {
  if (!currentResume.value || aiParseLoading.value) return
  aiParseLoading.value = true
  try {
    const { invokeAIAbility } = await import('@/api/performanceAI')
    const input = `姓名：${currentResume.value.candidateName}\n学历：${currentResume.value.education} - ${currentResume.value.school} ${currentResume.value.major}\n工作经历：\n${currentResume.value.workExperience}\n期望薪资：${currentResume.value.expectedSalary}`
    const res: any = await invokeAIAbility('resume_parse', input, 'HR-Lisa', currentResume.value.candidateName)
    aiParseOutput.value = res.data.output
  } finally {
    aiParseLoading.value = false
  }
}

// 切到 AI 解析 Tab 时首次自动触发
watch(detailTab, (v) => {
  if (v === 'ai-parse' && !aiParseOutput.value && !aiParseLoading.value && currentResume.value) {
    triggerResumeParse()
  }
})
const notes = ref<CandidateNote[]>([])
const noteInput = ref('')

// 安排面试弹窗
const interviewVisible = ref(false)
const interviewForm = reactive({
  interviewer: '',
  interviewTime: '',
  interviewLocation: '',
  remark: ''
})

// 淘汰弹窗
const rejectVisible = ref(false)
const rejectForm = reactive({
  reasonCode: '',
  remark: ''
})

// 入库查重弹窗
const dedupeVisible = ref(false)
const dedupeResult = reactive<{
  resumeMatch: Resume | null
  talentMatch: any
  pendingResume: Resume | null
}>({
  resumeMatch: null,
  talentMatch: null,
  pendingResume: null
})

// 获取列表数据
const fetchData = async () => {
  try {
    const res = await getResumeList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.resumeNo = ''
  queryParams.candidateName = ''
  queryParams.position = ''
  queryParams.source = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  fetchData()
}

const handleSelectionChange = (selection: Resume[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 批量上传简历（Phase 2 任务B3）
interface ImportFileItem {
  name: string
  parseStatus: 'pending' | 'parsing' | 'success' | 'failed'
  file?: File
}
const importVisible = ref(false)
const importFiles = ref<ImportFileItem[]>([])
const importing = ref(false)

const handleImport = () => {
  importFiles.value = []
  importing.value = false
  importVisible.value = true
}

const handleFileChange = (uploadFile: any) => {
  if (importFiles.value.length >= 50) {
    ElMessage.warning('单次最多上传 50 份简历')
    return
  }
  importFiles.value.push({
    name: uploadFile.name,
    parseStatus: 'pending',
    file: uploadFile.raw
  })
}

const handleBatchParse = async () => {
  importing.value = true
  let success = 0
  let failed = 0
  for (let i = 0; i < importFiles.value.length; i++) {
    const item = importFiles.value[i]
    item.parseStatus = 'parsing'
    try {
      // Mock 解析（复用 Phase 2.1 的 importResume）
      await importResume({ name: item.name })
      // Mock 随机 10% 失败率
      if (Math.random() < 0.1) {
        item.parseStatus = 'failed'
        failed++
      } else {
        item.parseStatus = 'success'
        success++
      }
      // 延时展示进度感
      await new Promise((r) => setTimeout(r, 200))
    } catch {
      item.parseStatus = 'failed'
      failed++
    }
  }
  importing.value = false
  ElMessage.success(`解析完成：成功 ${success} 份 / 失败 ${failed} 份`)
  fetchData()
  // 3 秒后自动关闭
  setTimeout(() => {
    if (!importing.value) importVisible.value = false
  }, 2000)
}

// 批量入库
const handleBatchStore = async () => {
  try {
    await ElMessageBox.confirm('确定将选中的简历批量入库到人才库吗？', '提示', { type: 'warning' })
    const res = await batchStoreResume(selectedIds.value)
    if (res.code === 200) {
      // 逐条创建人才库档案并关联
      for (const id of selectedIds.value) {
        const r = tableData.value.find((x) => x.id === id)
        if (r && !r.talentProfileId) {
          await doCreateTalentFromResume(r)
        }
      }
      ElMessage.success('入库成功')
      fetchData()
    }
  } catch {
    // 取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定删除选中的简历吗？', '提示', { type: 'warning' })
    const res = await batchDeleteResume(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch {
    // 取消
  }
}

// 查看详情 · 跳转 360° 候选人详情页（#8 改造）
const handleView = (row: Resume) => {
  router.push(`/recruit/resume/detail/${row.id}`)
}

const loadNotes = async (resumeId: number) => {
  const res = await getCandidateNotes(resumeId)
  if (res.code === 200) notes.value = res.data
}

// 发表评论
const handleSubmitNote = async () => {
  if (!noteInput.value.trim() || !currentResume.value) return
  const u = userStore.getUserInfo
  await addCandidateNote({
    resumeId: currentResume.value.id,
    authorId: u.id,
    authorName: u.nickname,
    content: noteInput.value.trim()
  })
  noteInput.value = ''
  await loadNotes(currentResume.value.id)
  ElMessage.success('评论已发布')
}

const handleDeleteNote = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除这条评论吗？', '提示', { type: 'warning' })
    await deleteCandidateNote(id)
    if (currentResume.value) await loadNotes(currentResume.value.id)
    ElMessage.success('已删除')
  } catch {
    // 取消
  }
}

// 将 @姓名 格式化为高亮
const formatMention = (text: string) => {
  return text.replace(/@(\S+)/g, '<span style="color: var(--el-color-primary);">@$1</span>')
}

const handleScheduleInterview = (row: Resume) => {
  currentResume.value = row
  interviewForm.interviewer = ''
  interviewForm.interviewTime = ''
  interviewForm.interviewLocation = ''
  interviewForm.remark = ''
  interviewVisible.value = true
}

const handleConfirmInterview = async () => {
  if (!interviewForm.interviewer) {
    ElMessage.warning('请输入面试官姓名')
    return
  }
  if (!interviewForm.interviewTime) {
    ElMessage.warning('请选择面试时间')
    return
  }
  if (!interviewForm.interviewLocation) {
    ElMessage.warning('请输入面试地点')
    return
  }
  try {
    const res = await scheduleInterview({ resumeId: currentResume.value!.id, ...interviewForm })
    if (res.code === 200) {
      ElMessage.success('安排面试成功')
      interviewVisible.value = false
      fetchData()
    }
  } catch {
    ElMessage.error('安排面试失败')
  }
}

// 入库（Phase 2.1 增强：入库前自动查重，入库后创建人才档案并关联）
const handleStore = async (row: Resume) => {
  currentResume.value = row
  if (row.talentProfileId) {
    ElMessage.info('该简历已关联人才库档案，无需重复入库')
    return
  }
  // 查重
  const [resumeCheck, talentCheck] = await Promise.all([
    checkDuplicateResume(row.phone, row.email),
    dedupeCheck({ mobile: row.phone, email: row.email })
  ])
  const rm = resumeCheck?.data?.resumeMatch
  const tm = talentCheck?.data?.matched ? talentCheck.data.profile : null
  // 排除自身
  const resumeMatch = rm && rm.id !== row.id ? rm : null

  if (resumeMatch || tm) {
    dedupeResult.resumeMatch = resumeMatch
    dedupeResult.talentMatch = tm
    dedupeResult.pendingResume = row
    dedupeVisible.value = true
  } else {
    await doConfirmStore()
  }
}

const doConfirmStore = async () => {
  const row = dedupeResult.pendingResume || currentResume.value
  if (!row) return
  try {
    const res = await batchStoreResume([row.id])
    if (res.code === 200) {
      // 如果已有人才库档案（查重命中），直接关联
      if (dedupeResult.talentMatch) {
        await linkResumeToTalent(row.id, dedupeResult.talentMatch.id)
      } else {
        await doCreateTalentFromResume(row)
      }
      ElMessage.success('入库成功，已同步至人才库')
      dedupeVisible.value = false
      dedupeResult.resumeMatch = null
      dedupeResult.talentMatch = null
      dedupeResult.pendingResume = null
      fetchData()
    }
  } catch {
    ElMessage.error('入库失败')
  }
}

// 从简历创建人才库档案
const doCreateTalentFromResume = async (r: Resume) => {
  const u = userStore.getUserInfo
  const existCountRes = await talentProfileApi.getList({ page: 1, pageSize: 1 })
  const talentNo = `TP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(
    (existCountRes.data.total || 0) + 1
  ).padStart(3, '0')}`
  const addRes = await talentProfileApi.add({
    talentNo,
    name: r.candidateName,
    gender: r.gender === 1 ? 'male' : 'female',
    mobile: r.phone,
    email: r.email,
    currentCity: r.location,
    highestDegree: r.education,
    school: r.school,
    major: r.major,
    workYears: r.workYears,
    currentPosition: r.position,
    expectedSalary: r.expectedSalary,
    skills: r.tags?.join(','),
    tags: r.tags?.join(','),
    poolIds: '1', // 默认加入总人才库
    ownerId: u.id,
    ownerName: u.nickname,
    source: 'apply',
    sourceDetail: r.source,
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: new Date().toLocaleString('zh-CN'),
    applyHistory: [
      {
        applyDate: r.submitTime?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        positionName: r.position || '-',
        department: '-',
        status: '已入库'
      }
    ]
  })
  if (addRes.code === 200 && addRes.data?.id) {
    await linkResumeToTalent(r.id, addRes.data.id)
  }
}

// 淘汰（Phase 2.1 增强：选择标准化淘汰原因）
const handleReject = (row: Resume) => {
  currentResume.value = row
  rejectForm.reasonCode = ''
  rejectForm.remark = ''
  rejectVisible.value = true
}

const handleConfirmReject = async () => {
  if (!rejectForm.reasonCode) {
    ElMessage.warning('请选择淘汰原因')
    return
  }
  const reason = REJECT_REASON_OPTIONS.find((r) => r.code === rejectForm.reasonCode)
  const reasonText = reason ? reason.label + (rejectForm.remark ? `（${rejectForm.remark}）` : '') : rejectForm.remark
  try {
    const u = userStore.getUserInfo
    const res = await rejectResume(currentResume.value!.id, rejectForm.reasonCode, reasonText, u.nickname)
    if (res.code === 200) {
      ElMessage.success('已淘汰')
      rejectVisible.value = false
      fetchData()
    }
  } catch {
    ElMessage.error('淘汰失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.resume-container {
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

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 12px;
}

.upload-text {
  color: #606266;
  font-size: 14px;

  em {
    color: var(--el-color-primary);
    font-style: normal;
  }
}

.upload-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 6px;
}

.import-list {
  margin-top: 16px;

  .import-list-title {
    font-size: 13px;
    color: #303133;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .import-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 4px;

    .file-icon {
      color: #909399;
    }

    .file-name {
      flex: 1;
      font-size: 13px;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.notes-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .notes-list {
    max-height: 380px;
    overflow-y: auto;

    .notes-empty {
      text-align: center;
      color: #909399;
      padding: 60px 0;
      font-size: 13px;
    }

    .note-item {
      padding: 12px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .note-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;

        .note-author {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
        }

        .note-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .note-content {
        font-size: 13px;
        color: #606266;
        line-height: 1.6;
      }
    }
  }

  .notes-input {
    border-top: 1px solid #ebeef5;
    padding-top: 12px;

    .notes-tip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;

      .hint {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>
