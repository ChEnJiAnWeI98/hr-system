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
            <el-select v-model="queryParams.status" placeholder="全部" style="width: 140px" clearable>
              <el-option
                v-for="opt in statusFilterOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <!-- 状态 Tab 切换（单独一行，业界对标 Moka 设计）-->
      <PageTabs v-model="activeTab" class="status-tabs">
        <el-tab-pane name="active">
          <template #label>
            <span>进行中</span>
            <el-tag size="small" type="primary" effect="plain" round style="margin-left: 6px">
              {{ tabCounts.active }}
            </el-tag>
          </template>
        </el-tab-pane>
        <el-tab-pane name="completed">
          <template #label>
            <span>已结束</span>
            <el-tag size="small" type="info" effect="plain" round style="margin-left: 6px">
              {{ tabCounts.completed }}
            </el-tag>
          </template>
        </el-tab-pane>
      </PageTabs>

      <div class="table-header">
        <div class="header-buttons">
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="filteredTableData" height="100%" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="48" />
          <el-table-column prop="offerNo" label="Offer 编号" min-width="140" />
          <el-table-column prop="candidateName" label="候选人" min-width="100" />
          <el-table-column prop="positionName" label="入职岗位" min-width="160" show-overflow-tooltip />
          <el-table-column prop="departmentName" label="部门" min-width="140" show-overflow-tooltip />
          <el-table-column label="薪资/试用期" min-width="150">
            <template #default="{ row }">
              <div>{{ row.salary }}</div>
              <div class="sub">试用期 {{ row.probationPeriod }} 个月</div>
            </template>
          </el-table-column>
          <!-- 进行中 Tab 才显示：Compa-Ratio / 状态停留 / 预计入职 -->
          <el-table-column v-if="activeTab === 'active'" label="Compa-Ratio" min-width="120">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>
                  <div>Compa-Ratio = 候选人薪资 / 同岗中位数</div>
                  <div>1.0 = 中位 · &gt;1.1 偏高 · &gt;1.25 风险 · &lt;0.85 偏低</div>
                </template>
                <span :class="['compa-ratio', getCompaRatioClass(row)]">
                  {{ getCompaRatio(row) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTab === 'active'" label="状态停留" min-width="100">
            <template #default="{ row }">
              <span :class="['status-duration', getDurationClass(row)]">
                {{ getStatusDuration(row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTab === 'active'" label="预计入职" min-width="120">
            <template #default="{ row }">{{ row.expectedJoinDate }}</template>
          </el-table-column>

          <!-- 已结束 Tab 才显示：结束时间 -->
          <el-table-column v-if="activeTab === 'completed'" label="结束时间" min-width="180">
            <template #default="{ row }">{{ getEndTime(row) }}</template>
          </el-table-column>

          <el-table-column label="状态" min-width="120">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.status === 2" type="info">审批通过</el-tag>
              <el-tag v-else-if="row.status === 3" type="danger">审批拒绝</el-tag>
              <el-tag v-else-if="row.status === 4" type="primary">已发送</el-tag>
              <el-tag v-else-if="row.status === 5" type="success">已接受</el-tag>
              <el-tag v-else-if="row.status === 6" type="danger">候选人拒绝</el-tag>
              <el-tag v-else-if="row.status === 7" type="info">已撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
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
              <el-button v-if="isDeletable(row)" link type="danger" @click="handleDelete(row)">删除</el-button>
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
              <el-input v-model="formData.candidateName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职岗位" prop="positionName">
              <el-input v-model="formData.positionName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职部门" prop="departmentName">
              <el-input v-model="formData.departmentName" disabled />
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
          <el-tag v-else-if="detailData.status === 2" type="info">审批通过</el-tag>
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
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { Offer, OfferListParams } from '@/types/recruitment'
import { OFFER_REJECT_REASON_OPTIONS } from '@/types/recruitment'
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

/* ============ Offer 列表页 · 业界共识对齐改造 ============ */

/**
 * 岗位中位数映射（mock 阶段简化版 · 真接入由薪酬系统提供）
 * 单位：元/月
 */
const POSITION_MID_SALARY_MAP: Record<string, number> = {
  前端: 22000,
  Java: 25000,
  后端: 25000,
  UI: 18000,
  设计: 18000,
  产品: 23000,
  测试: 16000,
  运维: 18000,
  人力: 12000,
  人事: 12000,
  市场: 13000
}

const getMidSalary = (position: string): number => {
  if (!position) return 18000
  for (const key in POSITION_MID_SALARY_MAP) {
    if (position.includes(key)) return POSITION_MID_SALARY_MAP[key]
  }
  return 18000
}

const parseSalary = (salaryStr: string | number | undefined): number => {
  if (!salaryStr) return 0
  const n = Number(salaryStr)
  return isNaN(n) ? 0 : n
}

const getCompaRatio = (row: any): string => {
  const sal = parseSalary(row.offerSalary || row.salary)
  const mid = getMidSalary(row.position || row.positionName || '')
  if (!sal || !mid) return '—'
  return (sal / mid).toFixed(2)
}

const getCompaRatioClass = (row: any): string => {
  const sal = parseSalary(row.offerSalary || row.salary)
  const mid = getMidSalary(row.position || row.positionName || '')
  if (!sal || !mid) return ''
  const ratio = sal / mid
  if (ratio > 1.25) return 'compa-danger'
  if (ratio > 1.1) return 'compa-warning'
  if (ratio < 0.85) return 'compa-low'
  return 'compa-normal'
}

const getStatusDuration = (row: any): string => {
  const updateTime = row.updateTime || row.createTime
  if (!updateTime) return '—'
  const updated = new Date(String(updateTime).replace(/-/g, '/'))
  const days = Math.floor((Date.now() - updated.getTime()) / (24 * 3600 * 1000))
  if (days === 0) return '今日'
  if (days === 1) return '1 天'
  return `${days} 天`
}

const getDurationClass = (row: any): string => {
  const updateTime = row.updateTime || row.createTime
  if (!updateTime) return ''
  const updated = new Date(String(updateTime).replace(/-/g, '/'))
  const days = Math.floor((Date.now() - updated.getTime()) / (24 * 3600 * 1000))
  // 终态状态不警告（已接受/已拒绝/已撤回）
  if ([5, 6, 7].includes(row.status)) return ''
  if (days >= 7) return 'duration-danger'
  if (days >= 3) return 'duration-warning'
  return ''
}

/**
 * 已结束 Tab 的结束时间（按状态取不同字段，避免"预计入职"在未入职 Offer 上的语义错位）
 * - 已接受 (5)：实际入职日期 expectedJoinDate
 * - 候选人拒绝 (6)：候选人响应时间 responseTime
 * - 审批拒绝 (3)：审批时间 approveTime
 * - 已撤回 (7)：updateTime（撤回时间）
 */
const getEndTime = (row: any): string => {
  if (row.status === 5) return row.expectedJoinDate ? `${row.expectedJoinDate}（已入职）` : '—'
  if (row.status === 6) return row.responseTime || '—'
  if (row.status === 3) return row.approveTime || '—'
  if (row.status === 7) return row.updateTime || '—'
  return '—'
}


const queryParams = reactive<OfferListParams>({
  offerNo: '',
  candidateName: '',
  positionName: '',
  status: null,
  page: 1,
  pageSize: 10
})

/* 全量数据（前端过滤 + 前端分页 · 业界对标 Greenhouse Activity Report）*/
const allTableData = ref<Offer[]>([])
const selectedIds = ref<number[]>([])

/* ============ 状态 Tab 切换（业界对标 Workday Inbox 待办/已处理 2-Tab）============ */
const activeTab = ref<'active' | 'completed'>('active')

// Tab 切换重置到第 1 页 + 清空 status 下拉（避免跨 Tab 错位）
watch(activeTab, () => {
  queryParams.page = 1
  queryParams.status = null
})

/**
 * 进行中 = 状态 1/2/4（待审批 / 审批通过 / 已发送）
 * 已结束 = 状态 3/5/6/7（审批拒绝 / 已接受 / 候选人拒绝 / 已撤回）
 */
const ACTIVE_STATUSES = [1, 2, 4]
const COMPLETED_STATUSES = [3, 5, 6, 7]

/* 状态筛选下拉选项 · 按 Tab 收窄（业界 Greenhouse / Moka 一致）*/
const STATUS_LABELS: Record<number, string> = {
  1: '待审批',
  2: '审批通过',
  3: '审批拒绝',
  4: '已发送',
  5: '已接受',
  6: '候选人拒绝',
  7: '已撤回'
}
const statusFilterOptions = computed(() => {
  const arr = activeTab.value === 'active' ? ACTIVE_STATUSES : COMPLETED_STATUSES
  return arr.map((v) => ({ value: v, label: STATUS_LABELS[v] }))
})

/* 1. 按 Tab 过滤 */
const tabFilteredData = computed(() => {
  const statuses = activeTab.value === 'active' ? ACTIVE_STATUSES : COMPLETED_STATUSES
  return allTableData.value.filter((r) => statuses.includes(r.status))
})

/* 2. 按搜索条件过滤（前端实现 · 已无后端搜索）*/
const searchedData = computed(() => {
  let list = tabFilteredData.value
  if (queryParams.offerNo) {
    const kw = queryParams.offerNo.trim().toLowerCase()
    list = list.filter((r) => r.offerNo?.toLowerCase().includes(kw))
  }
  if (queryParams.candidateName) {
    const kw = queryParams.candidateName.trim()
    list = list.filter((r) => r.candidateName?.includes(kw))
  }
  if (queryParams.positionName) {
    const kw = queryParams.positionName.trim()
    list = list.filter((r) => r.positionName?.includes(kw))
  }
  if (queryParams.status != null && queryParams.status !== '') {
    list = list.filter((r) => r.status === Number(queryParams.status))
  }
  return list
})

/* 3. 按当前页切片 */
const filteredTableData = computed(() => {
  const start = (queryParams.page - 1) * queryParams.pageSize
  return searchedData.value.slice(start, start + queryParams.pageSize)
})

/* 总数（基于过滤后） */
const total = computed(() => searchedData.value.length)

/* Tab 计数（基于全量 · 不受搜索影响）*/
const tabCounts = computed(() => ({
  active: allTableData.value.filter((r) => ACTIVE_STATUSES.includes(r.status)).length,
  completed: allTableData.value.filter((r) => COMPLETED_STATUSES.includes(r.status)).length
}))

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

// 列表（前端过滤 + 分页：一次拉全量，避免后端分页与前端 Tab 过滤错位）
const getList = async () => {
  try {
    const res = await getOfferList({
      offerNo: '',
      candidateName: '',
      positionName: '',
      status: null,
      page: 1,
      pageSize: 10000 // 全量
    })
    if (res.code === 200) {
      allTableData.value = res.data.list
    }
  } catch {
    ElMessage.error('获取 Offer 列表失败')
  }
}

// 搜索/重置只是改 queryParams，computed 自动重新计算
const handleSearch = () => {
  queryParams.page = 1
}

const handleReset = () => {
  queryParams.offerNo = ''
  queryParams.candidateName = ''
  queryParams.positionName = ''
  queryParams.status = null
  queryParams.page = 1
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

// 删除（业界标准：仅 status 3/6/7（审批拒绝 / 候选人拒绝 / 已撤回）可删；其他状态是法务证据，应走"撤回"流程）
const isDeletable = (row: Offer): boolean => {
  return [3, 6, 7].includes(row.status)
}

const handleDelete = async (row: Offer) => {
  if (!isDeletable(row)) {
    ElMessage.warning('该 Offer 不可删除：仅"审批拒绝/候选人拒绝/已撤回"状态可删，待审批/审批通过/已发送/已接受 是法务证据，应走"撤回"流程')
    return
  }
  try {
    await ElMessageBox.confirm('确定删除该 Offer 吗？删除后不可恢复。', '提示', { type: 'warning' })
    await deleteOffer(row.id)
    ElMessage.success('已删除')
    getList()
  } catch {
    // 取消
  }
}

// 批量删除（业界标准：仅"审批拒绝/已撤回"等终态草稿性质 Offer 可删，已发送/已接受/待审批/审批通过 不允许删 — 法务证据）
const PROTECTED_STATUSES = [1, 2, 4, 5] // 待审批/审批通过/已发送/已接受 不允许删
const PROTECTED_STATUS_LABEL: Record<number, string> = {
  1: '待审批',
  2: '审批通过',
  4: '已发送',
  5: '已接受'
}

const handleBatchDelete = async () => {
  // 校验：选中的 Offer 是否含不可删除状态
  const selected = allTableData.value.filter((r) => selectedIds.value.includes(r.id))
  const protectedItems = selected.filter((r) => PROTECTED_STATUSES.includes(r.status))

  if (protectedItems.length > 0) {
    const lines = protectedItems
      .map((r) => `• ${r.offerNo} ${r.candidateName}（${PROTECTED_STATUS_LABEL[r.status]}）`)
      .join('\n')
    await ElMessageBox.alert(
      `以下 Offer 不可删除：\n\n${lines}\n\n业界标准：待审批/审批通过/已发送/已接受状态的 Offer 是法务证据，应通过"撤回"流程处理。仅"草稿/审批拒绝/候选人拒绝/已撤回"可删除。`,
      '批量删除受限',
      { type: 'warning', confirmButtonText: '我知道了' }
    )
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${selectedIds.value.length} 条 Offer 吗？删除后不可恢复。`,
      '提示',
      { type: 'warning' }
    )
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
    if (q.departmentName) formData.departmentName = String(q.departmentName)
    if (q.workLocation) formData.workLocation = String(q.workLocation)
    if (q.resumeId) formData.resumeId = Number(q.resumeId) || 0
    const from = route.query.from
    router.replace({ query: from ? { from: String(from) } : {} })
  }

  // 员工档案 → Offer 详情：用 offerNo 自动定位
  if (route.query.offerNo) {
    queryParams.offerNo = String(route.query.offerNo)
    activeTab.value = 'completed' // 来源 Offer 必然是已接受（已结束）
    getList()
    router.replace({ query: {} })
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

  .status-tabs {
    flex-shrink: 0;
    margin-bottom: 12px;

    :deep(.el-tabs__header) {
      margin: 0;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
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

/* Offer 流程业务规则改造 */
.compa-ratio {
  font-weight: 600;
  font-family: 'SF Mono', Menlo, monospace;

  &.compa-normal {
    color: #67c23a;
  }
  &.compa-warning {
    color: #e6a23c;
  }
  &.compa-danger {
    color: #f56c6c;
  }
  &.compa-low {
    color: #909399;
  }
}

.status-duration {
  font-size: 13px;
  color: #606266;

  &.duration-warning {
    color: #e6a23c;
    font-weight: 600;
  }
  &.duration-danger {
    color: #f56c6c;
    font-weight: 600;
  }
}
</style>
