/**
 * v-field-permission 指令（Phase 1.4）
 *
 * 用法：
 *   1. 薪酬字段整列隐藏：
 *      <el-table-column v-field-permission="'salary'" />
 *
 *   2. 按敏感字段类型判断（用于查看）：
 *      <span v-field-permission="'salary'">{{ salary }}</span>
 *
 * 注意：
 *   - 当 RBAC 角色判断无权查看时，该元素不会渲染
 *   - 若要脱敏显示（而非隐藏），请使用 `mask()` 工具 + 计算属性
 */
import type { Directive } from 'vue'
import { useRBACStore } from '@/store/modules/rbac'

type PermissionType = 'salary' | 'sensitive'

function checkPermission(type: PermissionType): boolean {
  const rbacStore = useRBACStore()
  if (type === 'salary') {
    return rbacStore.canViewSalary
  }
  if (type === 'sensitive') {
    return rbacStore.canViewSensitive
  }
  return true
}

export const fieldPermission: Directive<HTMLElement, PermissionType> = {
  created(el, binding) {
    const type = binding.value || 'salary'
    const allowed = checkPermission(type)
    if (!allowed) {
      // 不渲染该元素（整列隐藏）
      el.style.display = 'none'
      el.setAttribute('data-field-hidden', 'true')
    }
  },
  updated(el, binding) {
    const type = binding.value || 'salary'
    const allowed = checkPermission(type)
    if (!allowed) {
      el.style.display = 'none'
      el.setAttribute('data-field-hidden', 'true')
    } else {
      el.style.display = ''
      el.removeAttribute('data-field-hidden')
    }
  }
}
