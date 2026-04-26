<template>
  <div class="dict-container">
    <el-card class="dict-main-card">
      <div class="dict-layout">
        <!-- 左侧：字典分组 + 字典列表 -->
        <div class="dict-sidebar">
          <div class="sidebar-title">字典分组</div>
          <el-scrollbar class="sidebar-scroll">
            <div
              v-for="group in dictGroups"
              :key="group.code"
              class="group-section"
            >
              <div class="group-label">
                {{ group.label }}
                <span class="group-count">{{ group.dicts.length }}</span>
              </div>
              <div
                v-for="d in group.dicts"
                :key="d.dictCode"
                class="dict-row"
                :class="{ active: selectedDictCode === d.dictCode }"
                @click="handleSelect(d.dictCode)"
              >
                <span class="dict-row-name">{{ d.dictName }}</span>
                <el-tag size="small" effect="plain">{{ d.items.length }}</el-tag>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 右侧：字典项 CRUD -->
        <div class="dict-main">
          <template v-if="currentDict">
            <div class="main-header">
              <div>
                <div class="main-title">
                  {{ currentDict.dictName }}
                  <el-tag size="small" style="margin-left: 8px">{{ currentDict.dictCode }}</el-tag>
                  <el-tag
                    v-if="currentDict.isSystem"
                    type="info"
                    size="small"
                    effect="plain"
                    style="margin-left: 4px"
                  >
                    系统字典
                  </el-tag>
                </div>
                <div class="main-desc">
                  {{ currentDict.description || '无描述' }}
                </div>
              </div>
              <el-button
                v-if="currentDict.editable"
                type="primary"
                @click="handleAddItem"
              >
                <el-icon><Plus /></el-icon>
                新增字典项
              </el-button>
            </div>

            <el-table :data="currentItems" border>
              <el-table-column label="序号" width="70" align="center" type="index" />
              <el-table-column prop="value" label="字典值" width="180" />
              <el-table-column prop="label" label="显示名" min-width="200" />
              <el-table-column label="扩展字段" min-width="220">
                <template #default="{ row }">
                  <span v-if="row.extra" style="font-size: 12px; color: #606266">
                    {{ JSON.stringify(row.extra) }}
                  </span>
                  <span v-else style="color: #c0c4cc">-</span>
                </template>
              </el-table-column>
              <el-table-column label="排序" width="90" align="center">
                <template #default="{ row }">{{ row.sortOrder }}</template>
              </el-table-column>
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column v-if="currentDict.editable" label="操作" width="180" fixed="right">
                <template #default="{ row }">
                  <el-button link @click="handleEditItem(row)">编辑</el-button>
                  <el-button link type="danger" @click="handleRemoveItem(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <el-empty v-else description="请从左侧选择一个字典" />
        </div>
      </div>
    </el-card>

    <!-- 字典项编辑 Dialog -->
    <el-dialog
      v-model="itemDialogVisible"
      :title="itemForm.__editing ? '编辑字典项' : '新增字典项'"
      width="560px"
    >
      <el-form :model="itemForm" label-width="100px">
        <el-form-item label="字典值">
          <el-input v-model="itemForm.value" :disabled="itemForm.__editing" />
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="itemForm.label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="itemForm.sortOrder" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="itemForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扩展字段">
          <el-input
            v-model="itemForm.extraJson"
            type="textarea"
            :rows="3"
            placeholder='可选 JSON 格式，如 {"type":"success","icon":"💼"}'
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDictStore } from '@/store/modules/dict'
import { DICT_GROUP_LABEL } from '@/types/system/dictionary'
import type { DictItem, DictGroup } from '@/types/system/dictionary'

defineOptions({ name: 'SystemDictionary' })

const dictStore = useDictStore()

const selectedDictCode = ref<string>('GENDER')

const currentDict = computed(() => dictStore.getDict(selectedDictCode.value))
const currentItems = computed(() => {
  return currentDict.value
    ? [...currentDict.value.items].sort((a, b) => a.sortOrder - b.sortOrder)
    : []
})

const dictGroups = computed(() => {
  const groups: Array<{ code: DictGroup; label: string; dicts: any[] }> = []
  const groupOrder: DictGroup[] = [
    'basic',
    'org',
    'position',
    'employee',
    'attendance',
    'comp',
    'training',
    'system'
  ]
  for (const code of groupOrder) {
    const dicts = dictStore.getDictsByGroup(code)
    if (dicts.length) {
      groups.push({ code, label: DICT_GROUP_LABEL[code], dicts })
    }
  }
  return groups
})

const handleSelect = (code: string) => {
  selectedDictCode.value = code
}

const itemDialogVisible = ref(false)
const itemForm = reactive<{
  value: string | number
  label: string
  sortOrder: number
  status: 0 | 1
  extraJson: string
  __editing: boolean
  __originalValue?: string | number
}>({
  value: '',
  label: '',
  sortOrder: 1,
  status: 1,
  extraJson: '',
  __editing: false
})

const resetItemForm = () => {
  itemForm.value = ''
  itemForm.label = ''
  itemForm.sortOrder = (currentItems.value.length || 0) + 1
  itemForm.status = 1
  itemForm.extraJson = ''
  itemForm.__editing = false
  itemForm.__originalValue = undefined
}

const handleAddItem = () => {
  resetItemForm()
  itemDialogVisible.value = true
}

const handleEditItem = (row: DictItem) => {
  itemForm.value = row.value
  itemForm.label = row.label
  itemForm.sortOrder = row.sortOrder
  itemForm.status = row.status
  itemForm.extraJson = row.extra ? JSON.stringify(row.extra) : ''
  itemForm.__editing = true
  itemForm.__originalValue = row.value
  itemDialogVisible.value = true
}

const handleSubmitItem = () => {
  if (!currentDict.value) return
  if (!itemForm.value || !itemForm.label) {
    ElMessage.warning('字典值和显示名必填')
    return
  }
  let extra: any = undefined
  if (itemForm.extraJson) {
    try {
      extra = JSON.parse(itemForm.extraJson)
    } catch {
      ElMessage.error('扩展字段不是合法 JSON')
      return
    }
  }
  const payload: DictItem = {
    value: itemForm.value,
    label: itemForm.label,
    sortOrder: itemForm.sortOrder,
    status: itemForm.status,
    extra
  }
  if (itemForm.__editing && itemForm.__originalValue !== undefined) {
    dictStore.updateItem(currentDict.value.dictCode, itemForm.__originalValue, payload)
    ElMessage.success('更新成功')
  } else {
    dictStore.addItem(currentDict.value.dictCode, payload)
    ElMessage.success('新增成功')
  }
  itemDialogVisible.value = false
}

const handleRemoveItem = (row: DictItem) => {
  if (!currentDict.value) return
  ElMessageBox.confirm(`确定删除字典项"${row.label}"吗？`, '提示', { type: 'warning' }).then(() => {
    dictStore.removeItem(currentDict.value!.dictCode, row.value)
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped lang="scss">
.dict-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .dict-main-card {
    flex: 1;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
    }
  }

  .dict-layout {
    display: flex;
    height: 100%;
  }

  .dict-sidebar {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;

    .sidebar-title {
      padding: 16px 20px 12px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      border-bottom: 1px solid #f0f2f5;
    }

    .sidebar-scroll {
      flex: 1;
    }

    .group-section {
      padding: 10px 0;

      .group-label {
        padding: 6px 20px;
        font-size: 12px;
        color: #909399;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .group-count {
          font-size: 11px;
          color: #c0c4cc;
        }
      }

      .dict-row {
        padding: 8px 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.15s;
        font-size: 13px;

        &:hover {
          background: #f5f7fa;
        }

        &.active {
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
          font-weight: 500;
        }

        .dict-row-name {
          flex: 1;
        }
      }
    }
  }

  .dict-main {
    flex: 1;
    padding: 20px;
    overflow: auto;

    .main-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .main-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .main-desc {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}
</style>
