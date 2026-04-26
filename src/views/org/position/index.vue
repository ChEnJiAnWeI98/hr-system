<template>
  <div class="position-container">
    <el-card class="position-card">
      <div class="header">
        <div class="header-title">岗位体系</div>
        <div class="header-actions">
          <el-segmented
            v-model="viewMode"
            :options="[
              { label: '矩阵视图', value: 'matrix' },
              { label: '岗位列表', value: 'list' }
            ]"
          />
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增岗位
          </el-button>
        </div>
      </div>

      <!-- 矩阵视图 -->
      <div v-if="viewMode === 'matrix'" class="matrix-view">
        <div class="family-tabs">
          <el-radio-group v-model="currentFamily" size="default">
            <el-radio-button
              v-for="f in JOB_FAMILIES"
              :key="f.code"
              :value="f.code"
            >
              {{ f.icon }} {{ f.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="matrix-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="corner">序列 \ 职级</th>
                <th v-for="l in matrix.levels" :key="l.code" class="level-head">
                  {{ l.code }}
                  <div class="level-name">{{ l.name.replace(/^\w+（(.+)）$/, '$1') }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in matrix.sequences" :key="s.code">
                <td class="seq-head">
                  <div class="seq-name">{{ s.name }}</div>
                  <div class="seq-code">{{ s.code }}</div>
                </td>
                <td
                  v-for="l in matrix.levels"
                  :key="s.code + '_' + l.code"
                  class="cell"
                >
                  <div class="cell-body">
                    <div
                      v-for="p in getPositionsInCell(s.code, l.code)"
                      :key="p.id"
                      class="position-chip"
                      @click="handleView(p)"
                    >
                      {{ p.positionName }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <div class="filter-row">
          <el-input
            v-model="keyword"
            placeholder="搜索岗位名称/编码"
            clearable
            style="width: 220px"
          />
          <el-select v-model="filterFamily" placeholder="岗位族" clearable style="width: 140px">
            <el-option v-for="f in JOB_FAMILIES" :key="f.code" :label="f.label" :value="f.code" />
          </el-select>
        </div>

        <el-table :data="filteredPositions" border>
          <el-table-column prop="positionCode" label="岗位编码" width="140" />
          <el-table-column prop="positionName" label="岗位名称" min-width="180" />
          <el-table-column label="岗位族" width="110" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ familyLabel(row.familyCode) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="序列" width="140">
            <template #default="{ row }">
              {{ sequenceLabel(row.sequenceCode) }}
            </template>
          </el-table-column>
          <el-table-column label="适用职级" width="130" align="center">
            <template #default="{ row }">
              <el-tag effect="plain" size="small">{{ row.levelMin }} ~ {{ row.levelMax }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="jobDescription" label="职责描述" min-width="280" show-overflow-tooltip />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">查看</el-button>
              <el-button link @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 编辑 Dialog -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑岗位' : '新增岗位'" width="720px">
      <el-form :model="editForm" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="岗位名称">
              <el-input v-model="editForm.positionName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位编码">
              <el-input v-model="editForm.positionCode" placeholder="留空自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位族">
              <el-select
                v-model="editForm.familyCode"
                @change="editForm.sequenceCode = ''"
                style="width: 100%"
              >
                <el-option
                  v-for="f in JOB_FAMILIES"
                  :key="f.code"
                  :label="`${f.icon} ${f.label}`"
                  :value="f.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位序列">
              <el-select v-model="editForm.sequenceCode" style="width: 100%">
                <el-option
                  v-for="s in availableSequences"
                  :key="s.code"
                  :label="s.name"
                  :value="s.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低职级">
              <el-select v-model="editForm.levelMin" style="width: 100%">
                <el-option
                  v-for="l in availableLevels"
                  :key="l.code"
                  :label="l.name"
                  :value="l.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高职级">
              <el-select v-model="editForm.levelMax" style="width: 100%">
                <el-option
                  v-for="l in availableLevels"
                  :key="l.code"
                  :label="l.name"
                  :value="l.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职责描述">
              <el-input v-model="editForm.jobDescription" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任职资格">
              <el-input v-model="editForm.qualification" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model.number="editForm.sortOrder" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch
                v-model="editForm.status"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 岗位说明书（只读 Drawer） -->
    <el-drawer v-model="viewDrawerVisible" :title="viewing?.positionName || '岗位说明书'" size="620px">
      <template v-if="viewing">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="岗位编码">{{ viewing.positionCode }}</el-descriptions-item>
          <el-descriptions-item label="岗位族">{{ familyLabel(viewing.familyCode) }}</el-descriptions-item>
          <el-descriptions-item label="岗位序列">{{ sequenceLabel(viewing.sequenceCode) }}</el-descriptions-item>
          <el-descriptions-item label="适用职级">{{ viewing.levelMin }} ~ {{ viewing.levelMax }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="viewing.status === 1 ? 'success' : 'info'" size="small">
              {{ viewing.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">{{ viewing.sortOrder }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>职责描述</el-divider>
        <div class="desc-block">{{ viewing.jobDescription || '（未填写）' }}</div>

        <el-divider>任职资格</el-divider>
        <div class="desc-block">{{ viewing.qualification || '（未填写）' }}</div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePositionStore } from '@/store/modules/position'
import { useDictStore } from '@/store/modules/dict'
import { genPositionCode } from '@/utils/code-generator'
import type { Position, JobFamilyCode } from '@/types/org/position'

defineOptions({ name: 'HrmPosition' })

const posStore = usePositionStore()
const dictStore = useDictStore()

const JOB_FAMILIES: { code: JobFamilyCode; label: string; icon: string }[] = [
  { code: 'TECH', label: '技术', icon: '💻' },
  { code: 'PROD', label: '产品', icon: '📋' },
  { code: 'SALES', label: '销售', icon: '💼' },
  { code: 'OPS', label: '运营', icon: '📣' },
  { code: 'FUNC', label: '职能', icon: '🏢' },
  { code: 'MGMT', label: '管理', icon: '👔' }
]

const viewMode = ref<'matrix' | 'list'>('matrix')

// 矩阵视图
const currentFamily = ref<JobFamilyCode>('TECH')
const matrix = computed(() => posStore.getMatrix(currentFamily.value))

const getPositionsInCell = (sequenceCode: string, levelCode: string): Position[] => {
  const all = posStore.getPositionsBySequence(sequenceCode)
  const levelRank = posStore.levels.find((l) => l.code === levelCode)?.rank ?? 0
  return all.filter((p) => {
    const minRank = posStore.levels.find((l) => l.code === p.levelMin)?.rank ?? 0
    const maxRank = posStore.levels.find((l) => l.code === p.levelMax)?.rank ?? 10
    return levelRank >= minRank && levelRank <= maxRank
  })
}

const familyLabel = (code: string) => JOB_FAMILIES.find((f) => f.code === code)?.label || code
const sequenceLabel = (code: string) =>
  posStore.sequences.find((s) => s.code === code)?.name || code

// 列表视图
const keyword = ref('')
const filterFamily = ref<JobFamilyCode | ''>('')
const filteredPositions = computed(() => {
  let list = [...posStore.positions]
  if (keyword.value) {
    list = list.filter(
      (p) =>
        p.positionName.includes(keyword.value) || p.positionCode.includes(keyword.value)
    )
  }
  if (filterFamily.value) {
    list = list.filter((p) => p.familyCode === filterFamily.value)
  }
  return list.sort((a, b) => a.sortOrder - b.sortOrder)
})

// 编辑
const editDialogVisible = ref(false)
const editForm = reactive<Partial<Position>>({})

const availableSequences = computed(() => {
  if (!editForm.familyCode) return []
  return posStore.getSequencesByFamily(editForm.familyCode as JobFamilyCode)
})

const availableLevels = computed(() => {
  if (editForm.familyCode === 'MGMT') return posStore.getLevelsByTrack('management')
  return posStore.getLevelsByTrack('professional')
})

const openEdit = (data?: Partial<Position>) => {
  Object.keys(editForm).forEach((k) => delete (editForm as any)[k])
  Object.assign(editForm, data || {})
  editDialogVisible.value = true
}

const handleAdd = () => {
  openEdit({
    familyCode: 'TECH',
    sequenceCode: '',
    levelMin: 'P3',
    levelMax: 'P5',
    status: 1,
    sortOrder: 99
  })
}

const handleEdit = (row: Position) => {
  openEdit({ ...row })
}

const handleSubmit = () => {
  if (!editForm.positionName) {
    ElMessage.warning('请填写岗位名称')
    return
  }
  if (!editForm.sequenceCode) {
    ElMessage.warning('请选择岗位序列')
    return
  }
  if (!editForm.positionCode) {
    editForm.positionCode = genPositionCode(editForm.familyCode || 'NEW')
  }
  if (editForm.id) {
    posStore.updatePosition(editForm.id, editForm)
    ElMessage.success('更新成功')
  } else {
    posStore.addPosition(editForm)
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
}

const handleDelete = (row: Position) => {
  ElMessageBox.confirm(`确定删除岗位"${row.positionName}"吗？`, '提示', { type: 'warning' }).then(
    () => {
      posStore.removePosition(row.id)
      ElMessage.success('删除成功')
    }
  )
}

// 查看（岗位说明书）
const viewDrawerVisible = ref(false)
const viewing = ref<Position | null>(null)
const handleView = (row: Position) => {
  viewing.value = row
  viewDrawerVisible.value = true
}
</script>

<style scoped lang="scss">
.position-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .position-card {
    flex: 1;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-shrink: 0;

    .header-title {
      font-size: 16px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .matrix-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .family-tabs {
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    .matrix-wrapper {
      flex: 1;
      overflow: auto;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;

      th,
      td {
        border: 1px solid #ebeef5;
        padding: 8px;
      }

      .corner {
        background: #f5f7fa;
        width: 140px;
        min-width: 140px;
        text-align: center;
        color: #909399;
        font-weight: 500;
      }

      .level-head {
        background: #f5f7fa;
        text-align: center;
        color: #303133;
        font-weight: 600;
        min-width: 110px;

        .level-name {
          font-size: 11px;
          color: #909399;
          font-weight: 400;
          margin-top: 2px;
        }
      }

      .seq-head {
        background: #fafafa;
        text-align: center;
        min-width: 140px;

        .seq-name {
          font-weight: 600;
          color: #303133;
        }

        .seq-code {
          font-size: 11px;
          color: #909399;
          margin-top: 2px;
        }
      }

      .cell {
        vertical-align: top;
        padding: 4px !important;
        min-height: 60px;
        background: #fff;

        .cell-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .position-chip {
          padding: 4px 8px;
          border-radius: 4px;
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
          cursor: pointer;
          font-size: 12px;
          border: 1px solid var(--el-color-primary-light-7);
          transition: all 0.15s;

          &:hover {
            background: var(--el-color-primary-light-8);
            transform: translateY(-1px);
          }
        }
      }
    }
  }

  .list-view {
    flex: 1;
    display: flex;
    flex-direction: column;

    .filter-row {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
  }
}

.desc-block {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
}
</style>
