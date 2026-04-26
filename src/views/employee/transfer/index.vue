<template>
  <div class="transfer-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="异动单号">
            <el-input v-model="queryParams.transferNo" placeholder="请输入单号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="员工">
            <el-input v-model="queryParams.employeeName" placeholder="姓名" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="异动类型">
            <el-select v-model="queryParams.transferType" placeholder="全部" clearable style="width: 150px">
              <el-option
                v-for="(label, value) in TRANSFER_TYPE_LABEL"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 160px">
              <el-option
                v-for="(label, value) in TRANSFER_STATUS_LABEL"
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
        <div class="header-title">人员异动（共 {{ total }} 条）</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          发起异动
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="pagedData" height="100%" style="width: 100%">
          <el-table-column prop="transferNo" label="异动单号" width="160" fixed />
          <el-table-column prop="employeeName" label="员工" width="110" fixed />
          <el-table-column label="异动类型" width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="TRANSFER_TYPE_COLOR[row.transferType as TransferType]" size="small">
                {{ TRANSFER_TYPE_LABEL[row.transferType as TransferType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="变更" min-width="320">
            <template #default="{ row }">
              <div v-if="row.fromOrgName && row.toOrgName && row.fromOrgName !== row.toOrgName">
                <span style="color: #909399">{{ row.fromOrgName }}</span>
                <span style="margin: 0 6px">→</span>
                <span>{{ row.toOrgName }}</span>
              </div>
              <div v-if="row.fromPositionName && row.toPositionName && row.fromPositionName !== row.toPositionName">
                <span style="color: #909399; font-size: 12px">{{ row.fromPositionName }}</span>
                <span style="margin: 0 6px; font-size: 12px">→</span>
                <span style="font-size: 12px">{{ row.toPositionName }}</span>
              </div>
              <div v-if="row.fromLevel && row.toLevel && row.fromLevel !== row.toLevel">
                <el-tag size="small" effect="plain">{{ row.fromLevel }}</el-tag>
                <span style="margin: 0 6px">→</span>
                <el-tag size="small" type="success">{{ row.toLevel }}</el-tag>
              </div>
              <div v-if="row.fromSalary && row.toSalary && row.fromSalary !== row.toSalary">
                <span style="color: #909399; font-size: 12px">¥{{ row.fromSalary.toLocaleString() }}</span>
                <span style="margin: 0 6px; font-size: 12px">→</span>
                <span style="font-size: 12px; color: var(--el-color-success)">¥{{ row.toSalary.toLocaleString() }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="effectiveDate" label="生效日期" width="120" />
          <el-table-column label="状态" width="140" align="center">
            <template #default="{ row }">
              <el-tag :type="TRANSFER_STATUS_TYPE[row.status as TransferStatus]" size="small">
                {{ TRANSFER_STATUS_LABEL[row.status as TransferStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitterName" label="发起人" width="110" />
          <el-table-column prop="submitTime" label="提交时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情</el-button>
              <el-button
                v-if="canApprove(row)"
                link
                type="warning"
                @click="handleOpenApproval(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="row.status === 'pending_effect'"
                link
                type="success"
                @click="handleEffect(row)"
              >
                生效
              </el-button>
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

    <!-- 发起异动 Dialog -->
    <el-dialog v-model="addDialogVisible" title="发起异动" width="720px" top="5vh">
      <el-scrollbar max-height="70vh">
        <el-form :model="addForm" label-width="120px">
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工">
                <EmployeeSelector v-model="addForm.employeeId" @change="onEmployeeChange" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异动类型">
                <el-select v-model="addForm.transferType" style="width: 100%" @change="onTypeChange">
                  <el-option
                    v-for="(label, value) in TRANSFER_TYPE_LABEL"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生效日期">
                <el-date-picker
                  v-model="addForm.effectiveDate"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <template v-if="addForm.transferType && fieldsToShow.length > 0">
            <el-divider content-position="left">变更内容</el-divider>
            <el-row :gutter="20">
              <el-col :span="12" v-if="fieldsToShow.includes('org')">
                <el-form-item label="新组织">
                  <OrgTreeSelect v-model="addForm.toOrgId" @change="onOrgChange" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="fieldsToShow.includes('position')">
                <el-form-item label="新岗位">
                  <PositionSelector v-model="addForm.toPositionId" @change="onPositionChange" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="fieldsToShow.includes('level')">
                <el-form-item label="新职级">
                  <el-input v-model="addForm.toLevel" placeholder="如 P6 / M2" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="fieldsToShow.includes('salary')">
                <el-form-item label="新薪资（月）">
                  <el-input v-model.number="addForm.toSalary" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <el-divider content-position="left">流程</el-divider>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="异动原因">
                <el-input v-model="addForm.reason" type="textarea" :rows="3" placeholder="请填写详细的异动原因" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="addForm.remark" type="textarea" :rows="2" placeholder="可选" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmitTransfer">提交审批</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Drawer -->
    <el-drawer v-model="detailDrawerVisible" :title="`异动详情 ${detail?.transferNo || ''}`" size="720px">
      <template v-if="detail">
        <el-descriptions :column="2" border size="default">
          <el-descriptions-item label="员工">{{ detail.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="异动类型">
            <el-tag :type="TRANSFER_TYPE_COLOR[detail.transferType]" size="small">
              {{ TRANSFER_TYPE_LABEL[detail.transferType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="TRANSFER_STATUS_TYPE[detail.status]" size="small">
              {{ TRANSFER_STATUS_LABEL[detail.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="生效日期">{{ detail.effectiveDate }}</el-descriptions-item>
          <el-descriptions-item label="发起人">{{ detail.submitterName }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ detail.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="异动原因" :span="2">{{ detail.reason }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.remark" label="备注" :span="2">{{ detail.remark }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>变更对比</el-divider>
        <el-descriptions :column="2" border size="default">
          <el-descriptions-item v-if="detail.fromOrgName || detail.toOrgName" label="组织">
            <div>
              <span style="color: #909399">{{ detail.fromOrgName || '-' }}</span>
              <span style="margin: 0 8px">→</span>
              <span>{{ detail.toOrgName || '-' }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-if="detail.fromPositionName || detail.toPositionName" label="岗位">
            <div>
              <span style="color: #909399">{{ detail.fromPositionName || '-' }}</span>
              <span style="margin: 0 8px">→</span>
              <span>{{ detail.toPositionName || '-' }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-if="detail.fromLevel || detail.toLevel" label="职级">
            <div>
              <el-tag size="small" effect="plain">{{ detail.fromLevel || '-' }}</el-tag>
              <span style="margin: 0 8px">→</span>
              <el-tag size="small" type="success">{{ detail.toLevel || '-' }}</el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-if="detail.fromSalary || detail.toSalary" label="薪资">
            <div v-if="rbacStore.canViewSalary">
              <span style="color: #909399">¥{{ detail.fromSalary?.toLocaleString() || '-' }}</span>
              <span style="margin: 0 8px">→</span>
              <span style="color: var(--el-color-success)">¥{{ detail.toSalary?.toLocaleString() || '-' }}</span>
            </div>
            <div v-else style="color: #909399; font-size: 12px">（无权查看）</div>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>审批流水</el-divider>
        <el-timeline v-if="detail.approvals.length">
          <el-timeline-item
            v-for="(ap, idx) in detail.approvals"
            :key="idx"
            :type="timelineType(ap.result)"
            :timestamp="ap.approvalTime || '待审批'"
          >
            <div>
              <b>{{ stageLabel(ap.stage) }} · {{ ap.approverName }}</b>
              <el-tag size="small" :type="timelineType(ap.result)" style="margin-left: 8px">
                {{ resultLabel(ap.result) }}
              </el-tag>
            </div>
            <div v-if="ap.comment" style="margin-top: 4px; color: #606266">{{ ap.comment }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="尚未提交审批" :image-size="80" />
      </template>
    </el-drawer>

    <!-- 审批 Dialog -->
    <el-dialog v-model="approvalDialogVisible" :title="`审批 ${approving?.transferNo || ''}`" width="560px">
      <el-alert
        :title="`当前审批节点：${activeStage === 'level1' ? '一级审批（部门负责人）' : '二级审批（HR）'}`"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审批人">
          <el-input v-model="approvalForm.approverName" />
        </el-form-item>
        <el-form-item label="审批结果">
          <el-radio-group v-model="approvalForm.action">
            <el-radio value="approved">通过</el-radio>
            <el-radio value="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="approvalForm.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmApproval">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTransferList,
  addTransfer,
  approveTransferApi,
  effectTransferApi,
  cancelTransferApi
} from '@/api/employee/transfer'
import {
  TRANSFER_TYPE_LABEL,
  TRANSFER_TYPE_COLOR,
  TRANSFER_STATUS_LABEL,
  TRANSFER_STATUS_TYPE,
  TRANSFER_TYPE_FIELDS
} from '@/types/employee/transfer'
import type {
  EmployeeTransfer,
  TransferType,
  TransferStatus,
  TransferListParams
} from '@/types/employee/transfer'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import OrgTreeSelect from '@/components/core/hr/org-tree-select.vue'
import PositionSelector from '@/components/core/hr/position-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'
import { useOrganizationStore } from '@/store/modules/organization'
import { usePositionStore } from '@/store/modules/position'
import { useRBACStore } from '@/store/modules/rbac'

defineOptions({ name: 'HrmTransfer' })

const empStore = useEmployeeStore()
const orgStore = useOrganizationStore()
const posStore = usePositionStore()
const rbacStore = useRBACStore()

const queryParams = reactive<TransferListParams>({
  transferNo: '',
  employeeName: '',
  transferType: '',
  status: '',
  page: 1,
  pageSize: 20
})

const allData = ref<EmployeeTransfer[]>([])
const total = computed(() => filtered.value.length)

const filtered = computed<EmployeeTransfer[]>(() => {
  let list = [...allData.value]
  if (queryParams.transferNo) list = list.filter((t) => t.transferNo.includes(queryParams.transferNo!))
  if (queryParams.employeeName) list = list.filter((t) => t.employeeName.includes(queryParams.employeeName!))
  if (queryParams.transferType) list = list.filter((t) => t.transferType === queryParams.transferType)
  if (queryParams.status) list = list.filter((t) => t.status === queryParams.status)
  return list.sort((a, b) => b.submitTime.localeCompare(a.submitTime))
})

const pagedData = computed(() => {
  const start = (queryParams.page - 1) * queryParams.pageSize
  return filtered.value.slice(start, start + queryParams.pageSize)
})

const fetchList = async () => {
  const res: any = await getTransferList({ page: 1, pageSize: 1000 })
  allData.value = res.data.list
}

const handleSearch = () => (queryParams.page = 1)
const handleReset = () => {
  queryParams.transferNo = ''
  queryParams.employeeName = ''
  queryParams.transferType = ''
  queryParams.status = ''
  queryParams.page = 1
}

const canApprove = (row: EmployeeTransfer) => {
  return row.status === 'level1_reviewing' || row.status === 'level2_reviewing'
}
const isCancellable = (row: EmployeeTransfer) => {
  return (
    row.status === 'draft' ||
    row.status === 'level1_reviewing' ||
    row.status === 'level2_reviewing' ||
    row.status === 'pending_effect'
  )
}

// === 发起异动 ===
const addDialogVisible = ref(false)
const addForm = reactive<Partial<EmployeeTransfer>>({})
const fieldsToShow = computed(() => {
  if (!addForm.transferType) return []
  return TRANSFER_TYPE_FIELDS[addForm.transferType] || []
})

const resetAddForm = () => {
  Object.keys(addForm).forEach((k) => delete (addForm as any)[k])
  Object.assign(addForm, {
    employeeId: undefined,
    employeeName: '',
    transferType: 'transfer',
    effectiveDate: new Date().toISOString().slice(0, 10),
    reason: '',
    remark: '',
    approvals: []
  })
}

const onEmployeeChange = (id: number) => {
  const e = empStore.getById(id)
  if (!e) return
  addForm.employeeName = e.nameZh
  addForm.fromOrgId = e.orgId
  addForm.fromOrgName = e.orgName
  addForm.fromPositionId = e.positionId
  addForm.fromPositionName = e.positionName
  addForm.fromLevel = e.level
  addForm.fromSalary = e.baseSalary
}

const onTypeChange = () => {
  // 清空目标字段
  addForm.toOrgId = undefined
  addForm.toOrgName = ''
  addForm.toPositionId = undefined
  addForm.toPositionName = ''
  addForm.toLevel = ''
  addForm.toSalary = undefined
}

const onOrgChange = (id: number) => {
  addForm.toOrgName = orgStore.getById(id)?.orgName || ''
}
const onPositionChange = (id: number) => {
  const p = posStore.getPositionById(id)
  addForm.toPositionName = p?.positionName || ''
}

const handleAdd = () => {
  resetAddForm()
  addDialogVisible.value = true
}

const handleSaveDraft = async () => {
  if (!addForm.employeeId) {
    ElMessage.warning('请选择员工')
    return
  }
  const newT: Partial<EmployeeTransfer> = {
    ...addForm,
    transferNo: `TR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`,
    status: 'draft',
    submitTime: new Date().toLocaleString('zh-CN'),
    submitterId: rbacStore.currentUserId || 9001,
    submitterName: '当前用户',
    approvals: []
  }
  await addTransfer(newT as any)
  ElMessage.success('已保存草稿')
  addDialogVisible.value = false
  fetchList()
}

const handleSubmitTransfer = async () => {
  if (!addForm.employeeId || !addForm.reason) {
    ElMessage.warning('请填写员工和异动原因')
    return
  }
  const newT: Partial<EmployeeTransfer> = {
    ...addForm,
    transferNo: `TR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`,
    status: 'level1_reviewing',
    submitTime: new Date().toLocaleString('zh-CN'),
    submitterId: rbacStore.currentUserId || 9001,
    submitterName: '当前用户',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'pending' }
    ]
  }
  await addTransfer(newT as any)
  ElMessage.success('提交审批成功')
  addDialogVisible.value = false
  fetchList()
}

// === 详情 ===
const detailDrawerVisible = ref(false)
const detail = ref<EmployeeTransfer | null>(null)
const handleView = (row: EmployeeTransfer) => {
  detail.value = row
  detailDrawerVisible.value = true
}

// === 审批 ===
const approvalDialogVisible = ref(false)
const approving = ref<EmployeeTransfer | null>(null)
const activeStage = ref<'level1' | 'level2'>('level1')
const approvalForm = reactive({
  approverName: '',
  action: 'approved' as 'approved' | 'rejected',
  comment: ''
})

const handleOpenApproval = (row: EmployeeTransfer) => {
  approving.value = row
  activeStage.value = row.status === 'level1_reviewing' ? 'level1' : 'level2'
  approvalForm.approverName = activeStage.value === 'level1' ? '王总监' : 'HR-Lisa'
  approvalForm.action = 'approved'
  approvalForm.comment = ''
  approvalDialogVisible.value = true
}

const handleConfirmApproval = async () => {
  if (!approving.value) return
  await approveTransferApi(
    approving.value.id,
    activeStage.value,
    approvalForm.action,
    approvalForm.approverName,
    activeStage.value === 'level1' ? 1003 : 9001,
    approvalForm.comment
  )
  ElMessage.success('审批成功')
  approvalDialogVisible.value = false
  fetchList()
}

// === 生效 ===
const handleEffect = (row: EmployeeTransfer) => {
  ElMessageBox.confirm(`确认将异动"${row.transferNo}"生效？生效后员工档案将同步更新`, '确认生效', {
    type: 'warning'
  }).then(async () => {
    await effectTransferApi(row.id)
    // 联动员工档案
    applyTransferToEmployee(row)
    ElMessage.success('异动已生效，员工档案已更新')
    fetchList()
  })
}

/**
 * 异动生效时联动员工档案
 */
const applyTransferToEmployee = (t: EmployeeTransfer) => {
  const patch: any = {}
  if (t.toOrgId) {
    patch.orgId = t.toOrgId
    patch.orgName = t.toOrgName
    const org = orgStore.getById(t.toOrgId)
    if (org) patch.orgPath = org.path
  }
  if (t.toPositionId) {
    patch.positionId = t.toPositionId
    patch.positionName = t.toPositionName
    const p = posStore.getPositionById(t.toPositionId)
    if (p) {
      patch.jobFamily = p.familyCode
      patch.jobSequence = p.sequenceCode
    }
  }
  if (t.toLevel) patch.level = t.toLevel
  if (t.toSalary) patch.baseSalary = t.toSalary
  if (t.transferType === 'regularization') patch.status = 'regular'
  if (t.transferType === 'secondment') patch.status = 'seconded'
  // 注：离职由"离职管理"模块处理，异动不再包含 resign 类型
  empStore.updateEmployee(t.employeeId, patch)
}

// === 撤销 ===
const handleCancel = (row: EmployeeTransfer) => {
  ElMessageBox.confirm(`确认撤销异动"${row.transferNo}"?`, '提示', { type: 'warning' }).then(
    async () => {
      await cancelTransferApi(row.id)
      ElMessage.success('已撤销')
      fetchList()
    }
  )
}

// 辅助
const stageLabel = (stage: string) => (stage === 'level1' ? '一级审批（部门）' : '二级审批（HR）')
const resultLabel = (r: string) => {
  const m: Record<string, string> = { approved: '通过', rejected: '驳回', pending: '待审批' }
  return m[r] || r
}
const timelineType = (r: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  if (r === 'approved') return 'success'
  if (r === 'rejected') return 'danger'
  return 'warning'
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.transfer-container {
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
</style>
