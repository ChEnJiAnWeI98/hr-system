<template>
  <div class="employee-container">
    <!-- 统计卡片 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">员工总数</div>
        <div class="stat-value">{{ empStore.total }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">在职员工</div>
        <div class="stat-value success">{{ empStore.activeCount }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">试用期</div>
        <div class="stat-value warning">{{ empStore.statusDistribution.probation || 0 }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">离职中</div>
        <div class="stat-value danger">{{ empStore.statusDistribution.offboarding || 0 }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">已离职</div>
        <div class="stat-value info">{{ empStore.statusDistribution.terminated || 0 }}</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="关键字">
            <el-input
              v-model="queryParams.keyword"
              placeholder="姓名/员工号/手机/邮箱"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item label="组织">
            <OrgTreeSelect v-model="queryParams.orgId" width="200px" />
          </el-form-item>
          <el-form-item label="岗位族">
            <DictSelector v-model="queryParams.jobFamily" dict-code="JOB_FAMILY" width="140px" />
          </el-form-item>
          <el-form-item label="状态">
            <DictSelector v-model="queryParams.status" dict-code="EMP_STATUS" width="140px" />
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
        <div class="header-title">员工花名册（共 {{ total }} 人）</div>
        <div class="header-actions">
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增员工
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="pagedData" height="100%" style="width: 100%">
          <el-table-column prop="employeeNo" label="员工编号" width="130" fixed />
          <el-table-column prop="nameZh" label="姓名" width="100" fixed>
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">{{ row.nameZh }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="70" align="center">
            <template #default="{ row }">
              {{ dictStore.getLabel('GENDER', row.gender) }}
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="组织" min-width="160" show-overflow-tooltip />
          <el-table-column prop="positionName" label="岗位" min-width="180" show-overflow-tooltip />
          <el-table-column label="岗位族" width="90" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">
                {{ dictStore.getLabel('JOB_FAMILY', row.jobFamily) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="职级" width="80" align="center" />
          <el-table-column prop="entryDate" label="入职日期" width="110" />
          <el-table-column label="司龄" width="80" align="center">
            <template #default="{ row }">{{ row.seniority }} 年</template>
          </el-table-column>
          <el-table-column label="手机号" min-width="130">
            <template #default="{ row }">
              <span>{{ displayMobile(row.mobile) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="110" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getStatusTagType(row.status)"
                size="small"
              >
                {{ dictStore.getLabel('EMP_STATUS', row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button link @click="handleEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <!-- 导入提示 Dialog -->
    <el-dialog v-model="importDialogVisible" title="批量导入员工" width="560px">
      <el-alert
        type="info"
        show-icon
        :closable="false"
        title="Mock 环境提示"
        description="当前为原型演示，批量导入功能暂不实现真实 Excel 解析。实际使用时会提供 Excel 模板下载 + 上传 + 字段校验。"
      />
      <template #footer>
        <el-button type="primary" @click="importDialogVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useEmployeeStore } from '@/store/modules/employee'
import { useDictStore } from '@/store/modules/dict'
import { useRBACStore } from '@/store/modules/rbac'
import { maskMobile } from '@/utils/desensitize'
import OrgTreeSelect from '@/components/core/hr/org-tree-select.vue'
import DictSelector from '@/components/core/hr/dict-selector.vue'
import type { Employee, EmployeeStatus } from '@/types/employee/profile'

defineOptions({ name: 'HrmEmployee' })

const router = useRouter()
const empStore = useEmployeeStore()
const dictStore = useDictStore()
const rbacStore = useRBACStore()

const queryParams = reactive({
  keyword: '',
  orgId: null as number | null,
  jobFamily: '' as string | '',
  status: '' as EmployeeStatus | '',
  page: 1,
  pageSize: 20
})

const filteredList = computed<Employee[]>(() => {
  // 🔐 先走数据权限过滤（按当前登录角色的 dataScope 过滤可见员工）
  let list = rbacStore.filterEmployees()

  // 然后叠加用户筛选条件
  if (queryParams.keyword) {
    const k = queryParams.keyword.toLowerCase()
    list = list.filter(
      (e) =>
        e.nameZh.includes(queryParams.keyword) ||
        e.employeeNo.toLowerCase().includes(k) ||
        e.mobile.includes(queryParams.keyword) ||
        e.email.toLowerCase().includes(k)
    )
  }
  if (queryParams.orgId) {
    list = list.filter(
      (e) =>
        e.orgId === queryParams.orgId ||
        e.orgPath.includes(`/${queryParams.orgId}/`) ||
        e.orgPath.endsWith(`/${queryParams.orgId}`)
    )
  }
  if (queryParams.jobFamily) {
    list = list.filter((e) => e.jobFamily === queryParams.jobFamily)
  }
  if (queryParams.status) {
    list = list.filter((e) => e.status === queryParams.status)
  }
  return list
})

const total = computed(() => filteredList.value.length)

const pagedData = computed(() => {
  const start = (queryParams.page - 1) * queryParams.pageSize
  return filteredList.value.slice(start, start + queryParams.pageSize)
})

const handleSearch = () => {
  queryParams.page = 1
}
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.orgId = null
  queryParams.jobFamily = ''
  queryParams.status = ''
  queryParams.page = 1
}

const getStatusTagType = (status: EmployeeStatus) => {
  const map: Record<EmployeeStatus, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    pending_onboard: 'info',
    probation: 'warning',
    regular: 'success',
    transferring: 'primary',
    seconded: 'primary',
    offboarding: 'danger',
    terminated: 'info'
  }
  return map[status]
}

/** 手机号按字段权限脱敏 */
const displayMobile = (mobile: string) => {
  if (rbacStore.canViewSensitive) return mobile
  return maskMobile(mobile)
}

const handleView = (row: Employee) => {
  router.push(`/employee/profile/detail/${row.id}`)
}

const handleEdit = (row: Employee) => {
  router.push(`/employee/profile/edit/${row.id}`)
}

const handleAdd = () => {
  ElMessage.info('新增员工功能将在 Phase 3 "异动管理" 中接入"入职办理"流程')
}

const importDialogVisible = ref(false)
const handleImport = () => {
  importDialogVisible.value = true
}
</script>

<style scoped lang="scss">
.employee-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .stat-row {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  .stat-card,
  .filter-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .stat-card {
    :deep(.el-card__body) {
      padding: 14px 20px;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      margin-top: 4px;

      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
      &.primary {
        color: var(--el-color-primary);
      }
      &.danger {
        color: var(--el-color-danger);
      }
      &.info {
        color: var(--el-color-info);
      }
    }
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

      .header-actions .el-button:not(:first-child) {
        margin-left: 12px;
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
