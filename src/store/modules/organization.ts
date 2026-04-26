/**
 * 组织架构 Store（Phase 1.2）
 * 统一管理组织树，为其他模块提供组织数据
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Organization, OrgEvent, OrgMoveParams } from '@/types/org/organization'
import { ORGANIZATIONS, ORG_EVENTS } from '@/mock/core/organizationTree'

export const useOrganizationStore = defineStore(
  'organization',
  () => {
    const orgs = ref<Organization[]>(JSON.parse(JSON.stringify(ORGANIZATIONS)))
    const events = ref<OrgEvent[]>(JSON.parse(JSON.stringify(ORG_EVENTS)))

    /** 获取扁平列表 */
    const getAll = () => orgs.value

    /** 根据 ID 获取 */
    const getById = (id: number): Organization | undefined => {
      return orgs.value.find((o) => o.id === id)
    }

    /** 根据编码获取 */
    const getByCode = (code: string): Organization | undefined => {
      return orgs.value.find((o) => o.orgCode === code)
    }

    /** 获取树形结构 */
    const getTree = computed<Organization[]>(() => {
      const map = new Map<number, Organization>()
      const list = JSON.parse(JSON.stringify(orgs.value)) as Organization[]
      list.forEach((o) => {
        o.children = []
        map.set(o.id, o)
      })
      const tree: Organization[] = []
      list.forEach((o) => {
        if (o.parentId === null) {
          tree.push(o)
        } else {
          const p = map.get(o.parentId)
          if (p) p.children!.push(o)
        }
      })
      // 按 sortOrder 排序
      const sortRecursive = (nodes: Organization[]) => {
        nodes.sort((a, b) => a.sortOrder - b.sortOrder)
        nodes.forEach((n) => n.children?.length && sortRecursive(n.children))
      }
      sortRecursive(tree)
      return tree
    })

    /** 获取直接子节点 */
    const getChildren = (parentId: number): Organization[] => {
      return orgs.value
        .filter((o) => o.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }

    /** 获取全部后代节点 ID（含自己） */
    const getDescendantIds = (id: number): number[] => {
      const org = getById(id)
      if (!org) return []
      const ids = [id]
      const collect = (pid: number) => {
        orgs.value
          .filter((o) => o.parentId === pid)
          .forEach((c) => {
            ids.push(c.id)
            collect(c.id)
          })
      }
      collect(id)
      return ids
    }

    /** 获取路径（从根到自己） */
    const getPath = (id: number): Organization[] => {
      const result: Organization[] = []
      let current = getById(id)
      while (current) {
        result.unshift(current)
        current = current.parentId ? getById(current.parentId) : undefined
      }
      return result
    }

    /** 新增组织 */
    const addOrg = (data: Partial<Organization>) => {
      const parent = data.parentId ? getById(data.parentId) : null
      const newId = Math.max(...orgs.value.map((o) => o.id)) + 1
      const level = parent ? parent.level + 1 : 1
      const path = parent ? `${parent.path}/${newId}` : `/${newId}`
      const newOrg: Organization = {
        id: newId,
        orgCode: data.orgCode || `G01-NEW${String(newId).padStart(3, '0')}`,
        orgName: data.orgName || '',
        parentId: data.parentId ?? null,
        path,
        level,
        nodeType: data.nodeType || 'department',
        orgNature: data.orgNature,
        managerId: data.managerId,
        managerName: data.managerName,
        hrbpId: data.hrbpId,
        hrbpName: data.hrbpName,
        costCenter: data.costCenter,
        headcount: data.headcount || 0,
        actualCount: 0,
        startDate: data.startDate || new Date().toISOString().slice(0, 10),
        endDate: data.endDate,
        status: data.status || 'active',
        sortOrder: data.sortOrder ?? 99,
        description: data.description,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }
      orgs.value.push(newOrg)
      // 追加事件
      events.value.push({
        id: Math.max(...events.value.map((e) => e.id)) + 1,
        eventType: 'establish',
        orgId: newId,
        orgName: newOrg.orgName,
        eventDate: newOrg.startDate,
        operator: '当前用户',
        description: `新建组织 ${newOrg.orgName}`,
        createTime: new Date().toLocaleString('zh-CN')
      })
      return newOrg
    }

    /** 更新组织 */
    const updateOrg = (id: number, patch: Partial<Organization>, addRenameEvent = false) => {
      const idx = orgs.value.findIndex((o) => o.id === id)
      if (idx === -1) return null
      const old = orgs.value[idx]
      const updated = {
        ...old,
        ...patch,
        updateTime: new Date().toLocaleString('zh-CN')
      }
      orgs.value[idx] = updated
      if (addRenameEvent && patch.orgName && patch.orgName !== old.orgName) {
        events.value.push({
          id: Math.max(...events.value.map((e) => e.id)) + 1,
          eventType: 'rename',
          orgId: id,
          orgName: patch.orgName,
          eventDate: new Date().toISOString().slice(0, 10),
          operator: '当前用户',
          description: `由"${old.orgName}"更名为"${patch.orgName}"`,
          createTime: new Date().toLocaleString('zh-CN')
        })
      }
      return updated
    }

    /** 组织迁移（带子组织） */
    const moveOrg = (params: OrgMoveParams) => {
      const org = getById(params.orgId)
      const newParent = getById(params.newParentId)
      if (!org || !newParent) throw new Error('组织不存在')
      if (getDescendantIds(params.orgId).includes(params.newParentId)) {
        throw new Error('不能迁移到自己的子节点下')
      }

      const oldParent = org.parentId ? getById(org.parentId) : null

      // 更新目标组织的 parentId、path、level
      const updateTree = (nodeId: number, parentPath: string, parentLevel: number) => {
        const node = getById(nodeId)
        if (!node) return
        node.parentId = nodeId === params.orgId ? params.newParentId : node.parentId
        node.path = `${parentPath}/${nodeId}`
        node.level = parentLevel + 1
        // 递归更新子节点
        orgs.value
          .filter((o) => o.parentId === nodeId)
          .forEach((c) => updateTree(c.id, node.path, node.level))
      }

      if (params.withChildren) {
        updateTree(params.orgId, newParent.path, newParent.level)
      } else {
        // 不带子组织：子组织悬挂到原父下
        orgs.value
          .filter((o) => o.parentId === params.orgId)
          .forEach((c) => {
            c.parentId = oldParent?.id ?? null
            const oldParentPath = oldParent?.path || ''
            c.path = `${oldParentPath}/${c.id}`
            c.level = (oldParent?.level ?? 0) + 1
          })
        const targetOrg = getById(params.orgId)!
        targetOrg.parentId = params.newParentId
        targetOrg.path = `${newParent.path}/${params.orgId}`
        targetOrg.level = newParent.level + 1
      }

      // 追加事件
      events.value.push({
        id: Math.max(...events.value.map((e) => e.id)) + 1,
        eventType: 'move',
        orgId: params.orgId,
        orgName: org.orgName,
        targetOrgId: params.newParentId,
        targetOrgName: newParent.orgName,
        eventDate: new Date().toISOString().slice(0, 10),
        operator: '当前用户',
        description: `${org.orgName} 迁移至 ${newParent.orgName}${params.withChildren ? '（含子组织）' : ''}`,
        createTime: new Date().toLocaleString('zh-CN')
      })
    }

    /** 撤销组织 */
    const dissolveOrg = (id: number, reason?: string) => {
      const org = getById(id)
      if (!org) return
      const children = getChildren(id)
      if (children.length > 0) {
        throw new Error('存在子组织，请先迁移或撤销子组织')
      }
      org.status = 'dissolved'
      org.endDate = new Date().toISOString().slice(0, 10)
      org.updateTime = new Date().toLocaleString('zh-CN')
      events.value.push({
        id: Math.max(...events.value.map((e) => e.id)) + 1,
        eventType: 'dissolve',
        orgId: id,
        orgName: org.orgName,
        eventDate: org.endDate,
        operator: '当前用户',
        description: reason || `撤销 ${org.orgName}`,
        createTime: new Date().toLocaleString('zh-CN')
      })
    }

    /** 按时间倒序获取演进事件 */
    const getEvents = (orgId?: number) => {
      let list = [...events.value]
      if (orgId !== undefined) list = list.filter((e) => e.orgId === orgId)
      return list.sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    }

    return {
      orgs,
      events,
      getAll,
      getById,
      getByCode,
      getTree,
      getChildren,
      getDescendantIds,
      getPath,
      addOrg,
      updateOrg,
      moveOrg,
      dissolveOrg,
      getEvents
    }
  },
  {
    persist: {
      key: 'hr-system-organization',
      storage: localStorage
    }
  }
)
