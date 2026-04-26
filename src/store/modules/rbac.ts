/**
 * RBAC 权限 Store（Phase 1.5 完整实现）
 *
 * 三层权限：
 *   - 菜单权限：hasMenu(code)
 *   - 数据权限：filterByScope(employees)
 *   - 字段权限：canViewSalary / canViewSensitive / sensitiveVisibility
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Role, DataScope, FieldVisibility } from '@/types/system/rbac'
import { PRESET_ROLES, MENU_DEFINITIONS } from '@/mock/system/roles'
import { useEmployeeStore } from '@/store/modules/employee'
import type { Employee } from '@/types/employee/profile'

export const useRBACStore = defineStore(
  'rbac',
  () => {
    /** 所有角色 */
    const roles = ref<Role[]>(JSON.parse(JSON.stringify(PRESET_ROLES)))

    /** 当前登录用户角色编码（从 auth 流程设置） */
    const currentRoleCode = ref<string>('super_admin')

    /** 当前登录用户绑定的员工 ID */
    const currentUserId = ref<number | null>(null)

    // ========== 角色信息 ==========

    const currentRole = computed<Role | undefined>(() =>
      roles.value.find((r) => r.roleCode === currentRoleCode.value)
    )

    const currentMenuCodes = computed<string[]>(() => currentRole.value?.menuCodes || [])

    const currentDataScope = computed<DataScope>(() => currentRole.value?.dataScope || 'self')

    // ========== 菜单权限 ==========

    /** 判断是否有某菜单的访问权 */
    const hasMenu = (code: string): boolean => currentMenuCodes.value.includes(code)

    // ========== 字段权限 ==========

    const canViewSalary = computed(() => {
      const rule = currentRole.value?.fieldPermission.salaryFields
      return rule === 'visible'
    })

    const canViewSensitive = computed(() => {
      const rule = currentRole.value?.fieldPermission.sensitiveFields
      return rule === 'visible'
    })

    const sensitiveVisibility = computed<FieldVisibility>(
      () => currentRole.value?.fieldPermission.sensitiveFields || 'masked'
    )

    const salaryVisibility = computed<FieldVisibility>(
      () => currentRole.value?.fieldPermission.salaryFields || 'hidden'
    )

    // ========== 数据权限 ==========

    /**
     * 按当前用户的数据范围过滤员工列表
     */
    const filterEmployees = (source?: Employee[]): Employee[] => {
      const empStore = useEmployeeStore()
      const all = source ?? empStore.employees
      const userId = currentUserId.value
      const me = userId ? empStore.getById(userId) : undefined

      switch (currentDataScope.value) {
        case 'self':
          return me ? [me] : []
        case 'subordinate':
          return userId ? empStore.getAllSubordinates(userId) : []
        case 'self_and_subordinate':
          return userId && me ? [me, ...empStore.getAllSubordinates(userId)] : []
        case 'department':
          return me ? empStore.getByOrg(me.orgId, true) : []
        case 'department_exclusive':
          return me ? empStore.getByOrg(me.orgId, false) : []
        case 'custom_org':
          return userId ? empStore.getByHRBP(userId) : []
        case 'all':
        default:
          return all
      }
    }

    // ========== 角色 CRUD ==========

    const addRole = (data: Partial<Role>): Role => {
      const newId = Math.max(...roles.value.map((r) => r.id)) + 1
      const newRole: Role = {
        id: newId,
        roleCode: data.roleCode || `role_${newId}`,
        roleName: data.roleName || '',
        description: data.description || '',
        isSystem: false,
        menuCodes: data.menuCodes || [],
        dataScope: data.dataScope || 'self',
        fieldPermission: data.fieldPermission || {
          sensitiveFields: 'masked',
          salaryFields: 'hidden'
        },
        sortOrder: data.sortOrder ?? 99,
        status: data.status ?? 1,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }
      roles.value.push(newRole)
      return newRole
    }

    const updateRole = (id: number, patch: Partial<Role>) => {
      const idx = roles.value.findIndex((r) => r.id === id)
      if (idx === -1) return null
      const old = roles.value[idx]
      if (old.isSystem && (patch.menuCodes || patch.dataScope || patch.fieldPermission)) {
        // 系统角色只允许改描述和排序
        roles.value[idx] = {
          ...old,
          description: patch.description ?? old.description,
          sortOrder: patch.sortOrder ?? old.sortOrder,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      } else {
        roles.value[idx] = {
          ...old,
          ...patch,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
      return roles.value[idx]
    }

    const removeRole = (id: number) => {
      const idx = roles.value.findIndex((r) => r.id === id)
      if (idx !== -1 && !roles.value[idx].isSystem) {
        roles.value.splice(idx, 1)
      }
    }

    // ========== 角色切换（测试/登录用） ==========

    const setRole = (code: string) => {
      currentRoleCode.value = code
    }

    const setUserId = (id: number | null) => {
      currentUserId.value = id
    }

    /**
     * 联合设置当前登录身份
     */
    const setLoginIdentity = (roleCode: string, userId: number | null) => {
      currentRoleCode.value = roleCode
      currentUserId.value = userId
    }

    return {
      roles,
      currentRoleCode,
      currentUserId,
      currentRole,
      currentMenuCodes,
      currentDataScope,
      canViewSalary,
      canViewSensitive,
      sensitiveVisibility,
      salaryVisibility,
      hasMenu,
      filterEmployees,
      addRole,
      updateRole,
      removeRole,
      setRole,
      setUserId,
      setLoginIdentity
    }
  },
  {
    persist: {
      key: 'hr-system-rbac',
      storage: localStorage,
      paths: ['currentRoleCode', 'currentUserId'],
      // 🔐 兜底：localStorage 里 currentRoleCode 被破坏时（undefined / null / 找不到对应角色），
      // 自动 fallback 到 super_admin，避免整站菜单异常
      afterRestore: (ctx: any) => {
        const store = ctx.store
        const codeValid = store.currentRoleCode && store.roles?.some?.((r: any) => r.roleCode === store.currentRoleCode)
        if (!codeValid) {
          store.currentRoleCode = 'super_admin'
        }
      }
    } as any
  }
)

// 辅助：导出菜单定义给其他模块使用
export { MENU_DEFINITIONS }
