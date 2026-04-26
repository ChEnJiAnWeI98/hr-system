<template>
  <div class="succession-container">
    <!-- 左侧：关键岗位列表 -->
    <el-card class="left-card">
      <div class="left-head">
        <div class="left-title">关键岗位（{{ positions.length }}）</div>
        <el-button size="small" type="primary" @click="handleAddPosition">
          <el-icon><Plus /></el-icon>新增
        </el-button>
      </div>

      <el-input
        v-model="positionSearch"
        placeholder="搜索岗位"
        size="small"
        clearable
        style="margin-bottom: 12px"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>

      <el-scrollbar class="position-list">
        <div
          v-for="p in filteredPositions"
          :key="p.id"
          class="position-item"
          :class="{ active: currentPosition?.id === p.id }"
          @click="selectPosition(p)"
        >
          <div class="position-head">
            <span class="position-name">{{ p.positionName }}</span>
            <el-tag
              size="small"
              :type="p.criticality === 'high' ? 'danger' : p.criticality === 'medium' ? 'warning' : 'info'"
            >
              {{ p.criticality === 'high' ? '高' : p.criticality === 'medium' ? '中' : '低' }}
            </el-tag>
          </div>
          <div class="position-sub">现任：{{ p.currentIncumbentName || '（空缺）' }}</div>
        </div>
        <div v-if="filteredPositions.length === 0" class="empty">暂无数据</div>
      </el-scrollbar>
    </el-card>

    <!-- 右侧：继任候选人 -->
    <el-card class="right-card">
      <template v-if="currentPosition">
        <div class="right-head">
          <div class="right-title">
            {{ currentPosition.positionName }}
            <el-tag
              size="small"
              :type="currentPosition.criticality === 'high' ? 'danger' : 'warning'"
              effect="plain"
            >
              {{ currentPosition.criticality === 'high' ? '关键等级 · 高' : currentPosition.criticality === 'medium' ? '关键等级 · 中' : '关键等级 · 低' }}
            </el-tag>
          </div>
          <div class="right-actions">
            <el-button type="primary" @click="openNineBoxPicker">
              <el-icon><Link /></el-icon>从 9-box 拉取候选人
            </el-button>
            <el-button @click="openManualAdd">
              <el-icon><Plus /></el-icon>手动添加
            </el-button>
            <el-button type="danger" plain @click="handleDeletePosition">删除岗位</el-button>
          </div>
        </div>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
          title="岗位说明"
          :description="currentPosition.description || '-'"
        />

        <!-- 候选人按准备度分组 -->
        <div v-if="candidates.length === 0" class="empty-state">
          <el-empty description="暂无继任候选人" :image-size="80" />
        </div>

        <div v-else class="candidate-sections">
          <div
            v-for="group in groupedCandidates"
            :key="group.key"
            class="candidate-section"
          >
            <div class="section-head">
              <el-tag :type="READINESS_TYPE[group.key as SuccessionReadiness]" size="small">
                {{ READINESS_LABEL[group.key as SuccessionReadiness] }}
              </el-tag>
              <span class="section-count">{{ group.list.length }} 人</span>
            </div>
            <div class="candidate-grid">
              <el-card
                v-for="c in group.list"
                :key="c.id"
                class="candidate-card"
                shadow="hover"
              >
                <div class="card-head">
                  <div class="avatar">{{ c.candidateName.charAt(0) }}</div>
                  <div class="card-main">
                    <div class="name">{{ c.candidateName }}</div>
                    <div class="sub">{{ c.candidateOrgName }} · {{ c.candidatePositionName }}</div>
                  </div>
                  <el-dropdown trigger="click" @command="(cmd) => handleCandidateCmd(cmd, c)">
                    <el-icon class="more"><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit">调整准备度</el-dropdown-item>
                        <el-dropdown-item command="delete" divided>移除候选人</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="card-meta">
                  <el-tag size="small" effect="plain">{{ c.candidateLevel }}</el-tag>
                  <el-tag
                    v-if="c.source === '9box'"
                    size="small"
                    type="primary"
                    effect="plain"
                  >
                    9-box · {{ c.nineBoxCell }}
                  </el-tag>
                  <el-tag v-else size="small" effect="plain">手动添加</el-tag>
                </div>
                <div class="card-comment">{{ c.comment }}</div>
                <div class="card-foot">提名人：{{ c.nominatorName }} · {{ c.nominationTime?.slice(0, 10) }}</div>
              </el-card>
            </div>
          </div>
        </div>
      </template>

      <el-empty v-else description="请从左侧选择关键岗位" :image-size="100" />
    </el-card>

    <!-- 新增关键岗位 Dialog -->
    <el-dialog
      v-model="positionDialogVisible"
      title="新增关键岗位"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="positionFormRef" :model="positionForm" :rules="positionRules" label-width="110px">
        <el-form-item label="岗位名称" prop="positionName">
          <el-input v-model="positionForm.positionName" placeholder="如：产品 VP" />
        </el-form-item>
        <el-form-item label="现任人" prop="currentIncumbentId">
          <EmployeeSelector v-model="positionForm.currentIncumbentId" width="100%" @change="onIncumbentChange" />
        </el-form-item>
        <el-form-item label="关键等级" prop="criticality">
          <el-radio-group v-model="positionForm.criticality">
            <el-radio value="high">高</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位说明">
          <el-input v-model="positionForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="positionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePosition">确定</el-button>
      </template>
    </el-dialog>

    <!-- 从 9-box 拉取候选人 Dialog -->
    <el-dialog
      v-model="nineBoxDialogVisible"
      title="从 9-box 拉取高潜候选人"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-alert
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 12px"
        description="以下是近期人才盘点会议中，位于 9-box 高潜格子（HH / MH / HM）的员工，且尚未成为本岗位的候选人。勾选后点「添加为候选人」。"
      />
      <el-table
        :data="nineBoxList"
        border
        max-height="420"
        style="width: 100%"
        @selection-change="onNineBoxSelection"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="employeeName" label="姓名" width="100" />
        <el-table-column prop="orgName" label="组织" min-width="160" show-overflow-tooltip />
        <el-table-column prop="positionName" label="当前岗位" min-width="160" show-overflow-tooltip />
        <el-table-column label="9-box 位置" width="110" align="center">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.nineBoxCell }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="meetingName" label="来源盘点会议" min-width="200" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button @click="nineBoxDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="nineBoxSelected.length === 0" @click="handleAddFromNineBox">
          添加为候选人（{{ nineBoxSelected.length }} 人）
        </el-button>
      </template>
    </el-dialog>

    <!-- 手动添加候选人 Dialog -->
    <el-dialog
      v-model="manualDialogVisible"
      title="手动添加候选人"
      width="540px"
      :close-on-click-modal="false"
    >
      <el-form ref="manualFormRef" :model="manualForm" :rules="manualRules" label-width="110px">
        <el-form-item label="候选人" prop="candidateEmployeeId">
          <EmployeeSelector v-model="manualForm.candidateEmployeeId" width="100%" />
        </el-form-item>
        <el-form-item label="准备度" prop="readiness">
          <el-radio-group v-model="manualForm.readiness">
            <el-radio value="ready">就绪（0~1 年）</el-radio>
            <el-radio value="developing">培养中（1~3 年）</el-radio>
            <el-radio value="long_term">长期（3~5 年）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评语">
          <el-input v-model="manualForm.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveManual">确定</el-button>
      </template>
    </el-dialog>

    <!-- 调整准备度 Dialog -->
    <el-dialog v-model="readinessDialogVisible" title="调整准备度" width="440px">
      <el-form label-width="100px">
        <el-form-item label="候选人">{{ editingCandidate?.candidateName }}</el-form-item>
        <el-form-item label="准备度">
          <el-radio-group v-model="editingReadiness">
            <el-radio value="ready">就绪（0~1 年）</el-radio>
            <el-radio value="developing">培养中（1~3 年）</el-radio>
            <el-radio value="long_term">长期（3~5 年）</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="readinessDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveReadiness">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Link, MoreFilled } from '@element-plus/icons-vue'
import {
  getKeyPositionList,
  addKeyPosition,
  deleteKeyPosition,
  getCandidatesByPositionApi,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getHighPotentialFromNineBoxApi
} from '@/api/training'
import type {
  KeyPosition,
  SuccessionCandidate,
  SuccessionReadiness
} from '@/types/training'
import { READINESS_LABEL, READINESS_TYPE } from '@/types/training'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'

defineOptions({ name: 'TrainingSuccession' })

const empStore = useEmployeeStore()

// === 关键岗位列表 ===
const positions = ref<KeyPosition[]>([])
const positionSearch = ref('')
const currentPosition = ref<KeyPosition | null>(null)

const filteredPositions = computed(() => {
  if (!positionSearch.value) return positions.value
  return positions.value.filter(
    (p) =>
      p.positionName.includes(positionSearch.value) ||
      p.currentIncumbentName.includes(positionSearch.value)
  )
})

const fetchPositions = async () => {
  const res: any = await getKeyPositionList({ page: 1, pageSize: 100 })
  positions.value = res.data.list
  if (!currentPosition.value && positions.value.length) {
    selectPosition(positions.value[0])
  }
}

const selectPosition = (p: KeyPosition) => {
  currentPosition.value = p
  fetchCandidates()
}

// === 候选人 ===
const candidates = ref<SuccessionCandidate[]>([])
const groupedCandidates = computed(() => {
  const groups: { key: SuccessionReadiness; list: SuccessionCandidate[] }[] = [
    { key: 'ready', list: [] },
    { key: 'developing', list: [] },
    { key: 'long_term', list: [] }
  ]
  candidates.value.forEach((c) => {
    groups.find((g) => g.key === c.readiness)?.list.push(c)
  })
  return groups.filter((g) => g.list.length > 0)
})

const fetchCandidates = async () => {
  if (!currentPosition.value) return
  const res: any = await getCandidatesByPositionApi(currentPosition.value.id)
  candidates.value = res.data
}

// === 新增关键岗位 ===
const positionDialogVisible = ref(false)
const positionFormRef = ref<FormInstance>()
const positionForm = reactive<Partial<KeyPosition>>({
  positionName: '',
  currentIncumbentId: undefined,
  currentIncumbentName: '',
  criticality: 'high',
  description: ''
})
const positionRules: FormRules = {
  positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  currentIncumbentId: [{ required: true, message: '请选择现任人', trigger: 'change' }],
  criticality: [{ required: true, message: '请选择关键等级', trigger: 'change' }]
}

const handleAddPosition = () => {
  Object.assign(positionForm, {
    positionName: '',
    currentIncumbentId: undefined,
    currentIncumbentName: '',
    criticality: 'high',
    description: ''
  })
  positionDialogVisible.value = true
}

const onIncumbentChange = (empId: number) => {
  const emp = empStore.getById(empId)
  if (emp) {
    positionForm.currentIncumbentName = emp.nameZh
    positionForm.positionId = emp.positionId
  }
}

const handleSavePosition = async () => {
  if (!positionFormRef.value) return
  await positionFormRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await addKeyPosition(positionForm as KeyPosition)
      ElMessage.success('已新增关键岗位')
      positionDialogVisible.value = false
      fetchPositions()
    } catch {
      ElMessage.error('新增失败')
    }
  })
}

const handleDeletePosition = async () => {
  if (!currentPosition.value) return
  try {
    await ElMessageBox.confirm(
      `确定删除关键岗位「${currentPosition.value.positionName}」？该岗位下的候选人关系会保留，但不再显示。`,
      '提示',
      { type: 'warning' }
    )
    await deleteKeyPosition(currentPosition.value.id)
    ElMessage.success('删除成功')
    currentPosition.value = null
    fetchPositions()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// === 从 9-box 拉取 ===
const nineBoxDialogVisible = ref(false)
const nineBoxList = ref<any[]>([])
const nineBoxSelected = ref<any[]>([])

const openNineBoxPicker = async () => {
  if (!currentPosition.value) return
  const res: any = await getHighPotentialFromNineBoxApi(currentPosition.value.id)
  nineBoxList.value = res.data
  nineBoxSelected.value = []
  nineBoxDialogVisible.value = true
}

const onNineBoxSelection = (sel: any[]) => {
  nineBoxSelected.value = sel
}

const handleAddFromNineBox = async () => {
  if (!currentPosition.value) return
  try {
    for (const emp of nineBoxSelected.value) {
      const payload: Partial<SuccessionCandidate> = {
        keyPositionId: currentPosition.value.id,
        candidateEmployeeId: emp.employeeId,
        candidateName: emp.employeeName,
        candidateOrgName: emp.orgName,
        candidatePositionName: emp.positionName,
        candidateLevel: emp.level,
        readiness: emp.nineBoxCell === 'HH' ? 'ready' : 'developing',
        source: '9box',
        nineBoxCell: emp.nineBoxCell,
        nominatorName: 'HR（批量拉取）',
        nominationTime: new Date().toLocaleString('zh-CN'),
        comment: `来源盘点会议：${emp.meetingName}`
      }
      await addCandidate(payload as SuccessionCandidate)
    }
    ElMessage.success(`已添加 ${nineBoxSelected.value.length} 位候选人`)
    nineBoxDialogVisible.value = false
    fetchCandidates()
  } catch {
    ElMessage.error('添加失败')
  }
}

// === 手动添加 ===
const manualDialogVisible = ref(false)
const manualFormRef = ref<FormInstance>()
const manualForm = reactive<Partial<SuccessionCandidate>>({
  candidateEmployeeId: undefined,
  readiness: 'developing',
  comment: ''
})
const manualRules: FormRules = {
  candidateEmployeeId: [{ required: true, message: '请选择候选人', trigger: 'change' }],
  readiness: [{ required: true, message: '请选择准备度', trigger: 'change' }]
}

const openManualAdd = () => {
  Object.assign(manualForm, {
    candidateEmployeeId: undefined,
    readiness: 'developing',
    comment: ''
  })
  manualDialogVisible.value = true
}

const handleSaveManual = async () => {
  if (!manualFormRef.value || !currentPosition.value) return
  await manualFormRef.value.validate(async (valid) => {
    if (!valid) return
    const emp = empStore.getById(manualForm.candidateEmployeeId!)
    if (!emp) return
    try {
      const payload: Partial<SuccessionCandidate> = {
        keyPositionId: currentPosition.value!.id,
        candidateEmployeeId: emp.id,
        candidateName: emp.nameZh,
        candidateOrgName: emp.orgName,
        candidatePositionName: emp.positionName,
        candidateLevel: emp.level,
        readiness: manualForm.readiness,
        source: 'manual',
        nominatorName: 'HR（手动）',
        nominationTime: new Date().toLocaleString('zh-CN'),
        comment: manualForm.comment
      }
      await addCandidate(payload as SuccessionCandidate)
      ElMessage.success('已添加候选人')
      manualDialogVisible.value = false
      fetchCandidates()
    } catch {
      ElMessage.error('添加失败')
    }
  })
}

// === 调整准备度 / 移除 ===
const readinessDialogVisible = ref(false)
const editingCandidate = ref<SuccessionCandidate | null>(null)
const editingReadiness = ref<SuccessionReadiness>('developing')

const handleCandidateCmd = (cmd: string, c: SuccessionCandidate) => {
  editingCandidate.value = c
  if (cmd === 'edit') {
    editingReadiness.value = c.readiness
    readinessDialogVisible.value = true
  } else if (cmd === 'delete') {
    ElMessageBox.confirm(`确定移除候选人「${c.candidateName}」？`, '提示', { type: 'warning' })
      .then(async () => {
        await deleteCandidate(c.id)
        ElMessage.success('已移除')
        fetchCandidates()
      })
      .catch(() => {})
  }
}

const handleSaveReadiness = async () => {
  if (!editingCandidate.value) return
  try {
    await updateCandidate({
      ...editingCandidate.value,
      readiness: editingReadiness.value
    })
    ElMessage.success('已更新')
    readinessDialogVisible.value = false
    fetchCandidates()
  } catch {
    ElMessage.error('更新失败')
  }
}

onMounted(fetchPositions)
</script>

<style scoped lang="scss">
.succession-container {
  height: 100%;
  display: flex;
  gap: 16px;
}

.left-card {
  width: 320px;
  flex-shrink: 0;
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

  .left-head {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .left-title {
      font-size: 15px;
      font-weight: 600;
    }
  }

  .position-list {
    flex: 1;
    overflow: hidden;
  }

  .position-item {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f5f7fa;
    }

    &.active {
      background: linear-gradient(135deg, #ecf5ff, #f0faff);
      border-left: 3px solid var(--el-color-primary);
    }

    .position-head {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .position-name {
        font-weight: 500;
        color: #303133;
      }
    }

    .position-sub {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  .empty {
    text-align: center;
    color: #c0c4cc;
    padding: 40px 0;
    font-size: 13px;
  }
}

.right-card {
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
    overflow: auto;
  }

  .right-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;

    .right-title {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .right-actions {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.candidate-section {
  margin-bottom: 24px;

  .section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .section-count {
      font-size: 13px;
      color: #909399;
    }
  }

  .candidate-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 12px;
  }

  .candidate-card {
    border: 1px solid #ebeef5 !important;
    box-shadow: none !important;
    border-radius: 10px;

    :deep(.el-card__body) {
      padding: 14px 16px;
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #409eff, #67c23a);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .card-main {
        flex: 1;
        overflow: hidden;

        .name {
          font-weight: 500;
          color: #303133;
        }

        .sub {
          font-size: 12px;
          color: #909399;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .more {
        font-size: 18px;
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .card-meta {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .card-comment {
      font-size: 13px;
      color: #606266;
      line-height: 1.6;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-foot {
      font-size: 12px;
      color: #909399;
      padding-top: 8px;
      border-top: 1px dashed #ebeef5;
    }
  }
}
</style>
