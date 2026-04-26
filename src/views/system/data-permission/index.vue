<template>
  <div class="dp-container">
    <el-alert
      type="info"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
      title="当前登录账号的权限效果预览"
      description="本页实时展示当前登录账号的 RBAC 权限效果（可见员工 / 可见菜单 / 字段权限）。切换权限请用不同账号登录（admin / hr / hrbp / manager / leader / user / interviewer，密码均为 123456）。"
    />

    <!-- 当前身份 -->
    <el-card class="identity-card">
      <div class="identity-row">
        <div>
          <div class="field-label">当前角色</div>
          <el-tag
            v-if="rbacStore.currentRole"
            :type="DATA_SCOPE_COLOR[rbacStore.currentDataScope as DataScope]"
            style="font-size: 14px; padding: 8px 14px"
          >
            {{ rbacStore.currentRole.roleName }}
          </el-tag>
          <el-tag v-else type="info">未登录</el-tag>
        </div>
        <div>
          <div class="field-label">绑定员工（数据权限基准）</div>
          <span v-if="currentEmp" style="font-size: 14px">
            <b>{{ currentEmp.nameZh }}</b>
            <span style="color: #909399; margin-left: 6px">
              {{ currentEmp.orgName }} · {{ currentEmp.positionName }} · {{ currentEmp.level }}
            </span>
          </span>
          <span v-else style="color: #c0c4cc">未绑定具体员工（超级管理员）</span>
        </div>
        <div>
          <div class="field-label">数据权限范围</div>
          <el-tag size="default" effect="plain">
            {{ DATA_SCOPE_LABEL[rbacStore.currentDataScope as DataScope] }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 测试账号提示 -->
    <el-card class="tip-card">
      <div class="section-head">
        <div class="section-title">7 个测试账号（密码均为 123456）</div>
      </div>
      <el-table :data="testAccounts" border size="small">
        <el-table-column prop="username" label="登录账号" width="130">
          <template #default="{ row }">
            <code style="background: #f5f7fa; padding: 2px 6px; border-radius: 4px">{{ row.username }}</code>
            <el-tag
              v-if="row.username === currentUsername"
              size="small"
              type="success"
              style="margin-left: 6px"
            >
              当前
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="140" />
        <el-table-column prop="scope" label="数据权限" width="180" />
        <el-table-column prop="salary" label="薪酬字段" width="110" align="center" />
        <el-table-column prop="sensitive" label="敏感字段" width="110" align="center" />
        <el-table-column prop="desc" label="说明" min-width="240" />
      </el-table>
      <div class="tip-note">💡 点击右上角头像 → "退出登录" → 用不同账号重新登录即可切换角色。</div>
    </el-card>

    <!-- 可见员工 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">当前账号可见员工数据</div>
        <el-tag type="primary" size="default">共 {{ visibleEmployees.length }} / {{ totalEmployees }} 人</el-tag>
      </div>
      <el-table :data="visibleEmployees.slice(0, 10)" border size="small">
        <el-table-column prop="employeeNo" label="编号" width="110" />
        <el-table-column prop="nameZh" label="姓名" width="90" />
        <el-table-column prop="orgName" label="组织" min-width="160" />
        <el-table-column prop="positionName" label="岗位" min-width="160" />
        <el-table-column prop="level" label="职级" width="80" align="center" />
        <el-table-column label="手机（字段权限）" width="160">
          <template #default="{ row }">
            {{ displayMobile(row.mobile) }}
          </template>
        </el-table-column>
        <el-table-column label="身份证（字段权限）" width="200">
          <template #default="{ row }">
            {{ displayCert(row.certificateNo) }}
          </template>
        </el-table-column>
        <el-table-column label="基本工资（字段权限）" width="150" v-if="rbacStore.canViewSalary">
          <template #default="{ row }">
            {{ row.baseSalary ? `¥${row.baseSalary.toLocaleString()}` : '-' }}
          </template>
        </el-table-column>
      </el-table>
      <div v-if="visibleEmployees.length > 10" style="text-align: center; padding: 10px; color: #909399">
        仅显示前 10 条，共 {{ visibleEmployees.length }} 条
      </div>
    </el-card>

    <!-- 可见菜单 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">当前账号可见菜单</div>
        <el-tag type="success" size="default">共 {{ rbacStore.currentMenuCodes.length }} / {{ totalMenus }} 个菜单</el-tag>
      </div>
      <div class="menu-preview">
        <div v-for="group in visibleMenuGroups" :key="group.code" class="menu-group-preview">
          <div class="group-name">{{ group.name }}（{{ group.menus.length }}）</div>
          <div class="menu-chips">
            <el-tag
              v-for="m in group.menus"
              :key="m.code"
              size="small"
              effect="plain"
              style="margin: 2px"
            >
              {{ m.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 字段权限 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">字段权限总览</div>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="薪酬字段">
          <el-tag :type="rbacStore.canViewSalary ? 'success' : 'danger'" size="small">
            {{ FIELD_VISIBILITY_LABEL[rbacStore.salaryVisibility as FieldVisibility] }}
          </el-tag>
          <span style="color: #909399; font-size: 12px; margin-left: 8px">
            包括 baseSalary / positionSalary / performanceBase / socialBase 等
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="敏感字段">
          <el-tag
            :type="rbacStore.sensitiveVisibility === 'visible' ? 'success' : rbacStore.sensitiveVisibility === 'masked' ? 'warning' : 'danger'"
            size="small"
          >
            {{ FIELD_VISIBILITY_LABEL[rbacStore.sensitiveVisibility as FieldVisibility] }}
          </el-tag>
          <span style="color: #909399; font-size: 12px; margin-left: 8px">
            手机号 / 身份证 / 住址 / 银行卡 / 紧急联系人
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRBACStore } from '@/store/modules/rbac'
import { useEmployeeStore } from '@/store/modules/employee'
import { useUserStore } from '@/store/modules/user'
import { MENU_DEFINITIONS } from '@/mock/system/roles'
import { maskMobile, maskCertificate } from '@/utils/desensitize'
import {
  DATA_SCOPE_LABEL,
  DATA_SCOPE_COLOR,
  FIELD_VISIBILITY_LABEL
} from '@/types/system/rbac'
import type { DataScope, FieldVisibility } from '@/types/system/rbac'

defineOptions({ name: 'SystemDataPermission' })

const rbacStore = useRBACStore()
const empStore = useEmployeeStore()
const userStore = useUserStore()

const totalEmployees = computed(() => empStore.total)
const totalMenus = computed(() => MENU_DEFINITIONS.length)

const currentEmp = computed(() =>
  rbacStore.currentUserId ? empStore.getById(rbacStore.currentUserId) : null
)

const currentUsername = computed(() => userStore.info?.username || '')

const visibleEmployees = computed(() => rbacStore.filterEmployees())

const visibleMenuGroups = computed(() => {
  const map = new Map<string, { code: string; name: string; menus: typeof MENU_DEFINITIONS }>()
  MENU_DEFINITIONS.filter((m) => rbacStore.hasMenu(m.code)).forEach((m) => {
    if (!map.has(m.groupCode)) {
      map.set(m.groupCode, { code: m.groupCode, name: m.groupName, menus: [] })
    }
    map.get(m.groupCode)!.menus.push(m)
  })
  return Array.from(map.values())
})

const displayMobile = (v: string) =>
  rbacStore.canViewSensitive ? v : maskMobile(v)

const displayCert = (v: string) =>
  rbacStore.canViewSensitive ? v : maskCertificate(v)

// 7 个测试账号展示
const testAccounts = [
  { username: 'admin', role: '超级管理员', scope: '全员', salary: '✓', sensitive: '✓', desc: '全部菜单 + 全部数据 + 全部字段' },
  { username: 'hr', role: 'HR 管理员', scope: '全员', salary: '✓', sensitive: '✓', desc: '除系统管理外的菜单 + 全员数据 + 全字段可见' },
  { username: 'hrbp', role: 'HRBP', scope: '分管事业部', salary: '✓', sensitive: '✓', desc: '按员工档案 managedOrgIds 分管组织' },
  { username: 'manager', role: '部门负责人', scope: '本部门（含子）', salary: '✗', sensitive: '脱敏', desc: '只看本部门员工，薪酬隐藏' },
  { username: 'leader', role: '直线经理', scope: '本人+直属下属', salary: '✗', sensitive: '脱敏', desc: '只看自己和直属下属' },
  { username: 'user', role: '普通员工', scope: '仅本人', salary: '仅本人', sensitive: '脱敏', desc: '只看自己档案/考勤/工资条/绩效' },
  { username: 'interviewer', role: '面试官', scope: '仅面试', salary: '✗', sensitive: '脱敏', desc: '临时角色，仅面试相关菜单' }
]
</script>

<style scoped lang="scss">
.dp-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;

  .identity-card,
  .tip-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .identity-row {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 24px;
    align-items: center;
  }

  .field-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
    }
  }

  .tip-note {
    margin-top: 12px;
    padding: 10px 14px;
    background: #fdf6ec;
    border-radius: 6px;
    font-size: 13px;
    color: #606266;
  }

  .menu-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .menu-group-preview {
    padding: 10px 14px;
    background: #f5f7fa;
    border-radius: 8px;

    .group-name {
      font-weight: 500;
      margin-bottom: 6px;
      color: #303133;
    }

    .menu-chips {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
