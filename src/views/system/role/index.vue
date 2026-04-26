<template>
  <div class="role-container">
    <el-card class="role-card">
      <div class="header">
        <div class="header-title">角色与权限管理</div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>

      <el-table :data="rbacStore.roles" border>
        <el-table-column prop="sortOrder" label="序号" width="70" align="center" />
        <el-table-column prop="roleCode" label="角色编码" width="140" />
        <el-table-column prop="roleName" label="角色名称" width="160">
          <template #default="{ row }">
            <span style="font-weight: 500">{{ row.roleName }}</span>
            <el-tag v-if="row.isSystem" size="small" type="info" effect="plain" style="margin-left: 6px">
              系统
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据权限范围" width="200" align="center">
          <template #default="{ row }">
            <el-tag :type="DATA_SCOPE_COLOR[row.dataScope as DataScope]" size="small">
              {{ DATA_SCOPE_LABEL[row.dataScope as DataScope] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="菜单权限" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.menuCodes.length }} 个菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="薪酬字段" width="110" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.fieldPermission.salaryFields === 'visible' ? 'success' : 'info'"
              size="small"
              effect="plain"
            >
              {{ FIELD_VISIBILITY_LABEL[row.fieldPermission.salaryFields as FieldVisibility] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="敏感字段" width="110" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.fieldPermission.sensitiveFields === 'visible' ? 'success' : 'warning'"
              size="small"
              effect="plain"
            >
              {{ FIELD_VISIBILITY_LABEL[row.fieldPermission.sensitiveFields as FieldVisibility] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="!row.isSystem"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色编辑 Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.id ? (editForm.isSystem ? '查看角色' : '编辑角色') : '新增角色'"
      width="900px"
      top="4vh"
    >
      <el-scrollbar max-height="70vh">
        <el-form :model="editForm" label-width="110px">
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称">
                <el-input v-model="editForm.roleName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色编码">
                <el-input v-model="editForm.roleCode" :disabled="!!editForm.id" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述">
                <el-input v-model="editForm.description" type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">数据权限</el-divider>
          <el-form-item label="数据范围">
            <el-radio-group v-model="editForm.dataScope">
              <el-radio
                v-for="(label, code) in DATA_SCOPE_LABEL"
                :key="code"
                :value="code"
                :disabled="editForm.isSystem"
              >
                {{ label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-divider content-position="left">字段权限</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="薪酬字段">
                <el-radio-group v-model="editForm.fieldPermission.salaryFields" :disabled="editForm.isSystem">
                  <el-radio value="visible">可见</el-radio>
                  <el-radio value="hidden">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="敏感字段">
                <el-radio-group v-model="editForm.fieldPermission.sensitiveFields" :disabled="editForm.isSystem">
                  <el-radio value="visible">可见原文</el-radio>
                  <el-radio value="masked">脱敏</el-radio>
                  <el-radio value="hidden">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">菜单权限</el-divider>
          <div style="margin-bottom: 10px">
            <el-button size="small" @click="toggleAllMenus(true)" :disabled="editForm.isSystem">
              全选
            </el-button>
            <el-button size="small" @click="toggleAllMenus(false)" :disabled="editForm.isSystem">
              全不选
            </el-button>
          </div>
          <div class="menu-groups">
            <div v-for="group in menuGroups" :key="group.code" class="menu-group">
              <div class="menu-group-head">
                <el-checkbox
                  :model-value="isGroupAllChecked(group.code)"
                  :indeterminate="isGroupIndeterminate(group.code)"
                  :disabled="editForm.isSystem"
                  @change="(v) => toggleGroup(group.code, v as boolean)"
                >
                  {{ group.name }}（{{ selectedCountInGroup(group.code) }}/{{ group.menus.length }}）
                </el-checkbox>
              </div>
              <div class="menu-group-body">
                <el-checkbox
                  v-for="m in group.menus"
                  :key="m.code"
                  :model-value="editForm.menuCodes.includes(m.code)"
                  :disabled="editForm.isSystem"
                  @change="(v) => toggleMenu(m.code, v as boolean)"
                >
                  {{ m.name }}
                </el-checkbox>
              </div>
            </div>
          </div>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ editForm.isSystem ? '关闭' : '取消' }}</el-button>
        <el-button v-if="!editForm.isSystem" type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRBACStore } from '@/store/modules/rbac'
import { MENU_DEFINITIONS } from '@/mock/system/roles'
import {
  DATA_SCOPE_LABEL,
  DATA_SCOPE_COLOR,
  FIELD_VISIBILITY_LABEL
} from '@/types/system/rbac'
import type { Role, DataScope, FieldVisibility } from '@/types/system/rbac'

defineOptions({ name: 'SystemRole' })

const rbacStore = useRBACStore()

// 菜单按一级分组
const menuGroups = computed(() => {
  const map = new Map<string, { code: string; name: string; menus: typeof MENU_DEFINITIONS }>()
  MENU_DEFINITIONS.forEach((m) => {
    if (!map.has(m.groupCode)) {
      map.set(m.groupCode, { code: m.groupCode, name: m.groupName, menus: [] })
    }
    map.get(m.groupCode)!.menus.push(m)
  })
  return Array.from(map.values())
})

// 编辑
const editDialogVisible = ref(false)
const editForm = reactive<Role>({
  id: 0,
  roleCode: '',
  roleName: '',
  description: '',
  isSystem: false,
  menuCodes: [],
  dataScope: 'self',
  fieldPermission: { sensitiveFields: 'masked', salaryFields: 'hidden' },
  sortOrder: 99,
  status: 1,
  createTime: '',
  updateTime: ''
})

const resetForm = () => {
  editForm.id = 0
  editForm.roleCode = ''
  editForm.roleName = ''
  editForm.description = ''
  editForm.isSystem = false
  editForm.menuCodes = []
  editForm.dataScope = 'self'
  editForm.fieldPermission = { sensitiveFields: 'masked', salaryFields: 'hidden' }
  editForm.sortOrder = 99
  editForm.status = 1
}

const handleAdd = () => {
  resetForm()
  editDialogVisible.value = true
}

const handleEdit = (row: Role) => {
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}

const handleView = (row: Role) => {
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editForm.isSystem = true // 查看模式强制只读
  editDialogVisible.value = true
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`确定删除角色"${row.roleName}"吗？`, '提示', { type: 'warning' }).then(() => {
    rbacStore.removeRole(row.id)
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  if (!editForm.roleName || !editForm.roleCode) {
    ElMessage.warning('角色名称/编码必填')
    return
  }
  if (editForm.id) {
    rbacStore.updateRole(editForm.id, editForm)
    ElMessage.success('更新成功')
  } else {
    rbacStore.addRole(editForm)
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
}

// 菜单操作
const toggleMenu = (code: string, checked: boolean) => {
  if (checked && !editForm.menuCodes.includes(code)) {
    editForm.menuCodes.push(code)
  } else if (!checked) {
    editForm.menuCodes = editForm.menuCodes.filter((c) => c !== code)
  }
}

const toggleGroup = (groupCode: string, checked: boolean) => {
  const menusInGroup = MENU_DEFINITIONS.filter((m) => m.groupCode === groupCode).map((m) => m.code)
  if (checked) {
    editForm.menuCodes = Array.from(new Set([...editForm.menuCodes, ...menusInGroup]))
  } else {
    editForm.menuCodes = editForm.menuCodes.filter((c) => !menusInGroup.includes(c))
  }
}

const toggleAllMenus = (checked: boolean) => {
  editForm.menuCodes = checked ? MENU_DEFINITIONS.map((m) => m.code) : []
}

const selectedCountInGroup = (groupCode: string) => {
  return MENU_DEFINITIONS.filter(
    (m) => m.groupCode === groupCode && editForm.menuCodes.includes(m.code)
  ).length
}

const isGroupAllChecked = (groupCode: string) => {
  const total = MENU_DEFINITIONS.filter((m) => m.groupCode === groupCode).length
  return selectedCountInGroup(groupCode) === total
}

const isGroupIndeterminate = (groupCode: string) => {
  const total = MENU_DEFINITIONS.filter((m) => m.groupCode === groupCode).length
  const selected = selectedCountInGroup(groupCode)
  return selected > 0 && selected < total
}

// 注：角色切换改为登录不同账号（admin/hr/hrbp/manager/leader/user/interviewer），不在此页提供切换
</script>

<style scoped lang="scss">
.role-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .role-card {
    flex: 1;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.menu-groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-group {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 10px 14px;

  .menu-group-head {
    padding-bottom: 8px;
    border-bottom: 1px dashed #ebeef5;
    margin-bottom: 10px;
    font-weight: 500;
  }

  .menu-group-body {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;

    :deep(.el-checkbox) {
      margin-right: 0;
    }
  }
}
</style>
