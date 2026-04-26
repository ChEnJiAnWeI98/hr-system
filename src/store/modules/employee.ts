/**
 * 员工档案 Store（Phase 1.4 核心）
 * 所有业务模块读取员工数据的统一入口
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, EmployeeStatus } from '@/types/employee/profile'
import { EMPLOYEES } from '@/mock/core/employeePool'
import { useOrganizationStore } from '@/store/modules/organization'

export const useEmployeeStore = defineStore(
  'employee',
  () => {
    const employees = ref<Employee[]>(JSON.parse(JSON.stringify(EMPLOYEES)))

    // ========== 基础查询 ==========

    /** 所有员工 */
    const getAll = () => employees.value

    /** 根据 ID 获取 */
    const getById = (id: number): Employee | undefined => {
      return employees.value.find((e) => e.id === id)
    }

    /** 根据员工编号获取 */
    const getByEmployeeNo = (no: string): Employee | undefined => {
      return employees.value.find((e) => e.employeeNo === no)
    }

    /** 按状态筛选 */
    const getByStatus = (status: EmployeeStatus): Employee[] => {
      return employees.value.filter((e) => e.status === status)
    }

    /** 按组织获取员工（默认含子组织） */
    const getByOrg = (orgId: number, includeSub = true): Employee[] => {
      if (!includeSub) {
        return employees.value.filter((e) => e.orgId === orgId)
      }
      const orgStore = useOrganizationStore()
      const descendantIds = orgStore.getDescendantIds(orgId)
      return employees.value.filter((e) => descendantIds.includes(e.orgId))
    }

    /** 获取某员工的直属下属 */
    const getSubordinates = (supervisorId: number): Employee[] => {
      return employees.value.filter((e) => e.supervisorId === supervisorId)
    }

    /** 递归获取所有下属（包含间接下属） */
    const getAllSubordinates = (supervisorId: number): Employee[] => {
      const direct = getSubordinates(supervisorId)
      const all = [...direct]
      direct.forEach((d) => {
        all.push(...getAllSubordinates(d.id))
      })
      return all
    }

    /** HRBP 分管的员工（根据 HRBP 的 managedOrgIds） */
    const getByHRBP = (hrbpId: number): Employee[] => {
      const hrbp = getById(hrbpId)
      if (!hrbp?.managedOrgIds?.length) return []
      return employees.value.filter((e) => hrbp.managedOrgIds!.includes(e.orgId))
    }

    /** 关键字搜索（姓名/员工号/手机/邮箱） */
    const search = (keyword: string): Employee[] => {
      if (!keyword) return employees.value
      const k = keyword.toLowerCase()
      return employees.value.filter(
        (e) =>
          e.nameZh.includes(keyword) ||
          e.employeeNo.toLowerCase().includes(k) ||
          e.mobile.includes(keyword) ||
          e.email.toLowerCase().includes(k)
      )
    }

    // ========== 数据权限过滤 ==========

    /**
     * 根据数据权限规则过滤可见员工
     * Phase 1.5 会补充完整规则，这里先占位
     */
    const getVisibleEmployees = (
      scope:
        | 'self'
        | 'subordinate'
        | 'self_and_subordinate'
        | 'department'
        | 'department_exclusive'
        | 'custom_org'
        | 'all',
      currentUserId: number
    ): Employee[] => {
      const me = getById(currentUserId)
      if (!me) return []
      switch (scope) {
        case 'self':
          return [me]
        case 'subordinate':
          return getAllSubordinates(currentUserId)
        case 'self_and_subordinate':
          return [me, ...getAllSubordinates(currentUserId)]
        case 'department':
          return getByOrg(me.orgId, true)
        case 'department_exclusive':
          return getByOrg(me.orgId, false)
        case 'custom_org':
          // HRBP 场景
          return getByHRBP(currentUserId)
        case 'all':
          return employees.value
        default:
          return [me]
      }
    }

    // ========== 统计 ==========

    const total = computed(() => employees.value.length)
    const activeCount = computed(() =>
      employees.value.filter(
        (e) => e.status === 'regular' || e.status === 'probation'
      ).length
    )

    /** 按岗位族分布 */
    const familyDistribution = computed(() => {
      const map: Record<string, number> = {}
      employees.value.forEach((e) => {
        map[e.jobFamily] = (map[e.jobFamily] || 0) + 1
      })
      return map
    })

    /** 按状态分布 */
    const statusDistribution = computed(() => {
      const map: Record<string, number> = {}
      employees.value.forEach((e) => {
        map[e.status] = (map[e.status] || 0) + 1
      })
      return map
    })

    // ========== CRUD ==========

    const addEmployee = (data: Partial<Employee>): Employee => {
      const newId = Math.max(...employees.value.map((e) => e.id)) + 1
      const newItem = {
        ...data,
        id: newId,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      } as Employee
      employees.value.push(newItem)
      return newItem
    }

    const updateEmployee = (id: number, patch: Partial<Employee>) => {
      const idx = employees.value.findIndex((e) => e.id === id)
      if (idx === -1) return null
      employees.value[idx] = {
        ...employees.value[idx],
        ...patch,
        updateTime: new Date().toLocaleString('zh-CN')
      }
      return employees.value[idx]
    }

    const updateStatus = (id: number, status: EmployeeStatus) => {
      return updateEmployee(id, { status })
    }

    return {
      employees,
      total,
      activeCount,
      familyDistribution,
      statusDistribution,
      getAll,
      getById,
      getByEmployeeNo,
      getByStatus,
      getByOrg,
      getSubordinates,
      getAllSubordinates,
      getByHRBP,
      search,
      getVisibleEmployees,
      addEmployee,
      updateEmployee,
      updateStatus
    }
  },
  {
    persist: false // 员工池是 Mock 基础数据，不持久化到 localStorage
  }
)
