<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="用户名">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="真实姓名">
            <el-input
              v-model="queryParams.realName"
              placeholder="请输入真实姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                搜索
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="username" label="用户名" min-width="12%" />
          <el-table-column prop="realName" label="真实姓名" min-width="10%" />
          <el-table-column prop="phone" label="手机号" min-width="9%" />
          <el-table-column prop="email" label="邮箱" min-width="15%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column label="角色" min-width="12%">
            <template #default="{ row }">
              <el-tag
                v-for="(roleName, index) in row.roleNames"
                :key="index"
                size="small"
                style="margin-right: 4px"
              >
                {{ roleName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="14%" />
          <el-table-column label="操作" min-width="19%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="warning" @click="handleResetPassword(row)">
                重置密码
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="danger"
                @click="handleToggleStatus(row, 0)"
              >
                禁用
              </el-button>
              <el-button
                v-else
                link
                type="success"
                @click="handleToggleStatus(row, 1)"
              >
                启用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getList, deleteUserAccount, resetPassword, toggleStatus } from '@/api/user-account'
import type { UserAccount, ListParams } from '@/types/system'

defineOptions({
  name: 'UserAccountList'
})

const router = useRouter()

// 查询参数
const queryParams = ref<ListParams & { username?: string; realName?: string; status?: number | string | null }>({
  username: '',
  realName: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<UserAccount[]>([])
const total = ref(0)

/**
 * 加载数据
 */
const loadData = async () => {
  try {
    const res = await getList(queryParams.value)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.value.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.value = {
    username: '',
    realName: '',
    status: null,
    page: 1,
    pageSize: 10
  }
  loadData()
}

/**
 * 新增
 */
const handleAdd = () => {
  router.push('/system/user-account/create/new')
}

/**
 * 编辑
 */
const handleEdit = (row: UserAccount) => {
  router.push(`/system/user-account/edit/${row.id}`)
}

/**
 * 删除
 */
const handleDelete = async (row: UserAccount) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.realName}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteUserAccount(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 重置密码
 */
const handleResetPassword = async (row: UserAccount) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户"${row.realName}"的密码吗？重置后密码为：123456`,
      '重置密码确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await resetPassword(row.id)
    if (res.code === 200) {
      ElMessage.success(res.message || '密码重置成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    }
  }
}

/**
 * 启用/禁用
 */
const handleToggleStatus = async (row: UserAccount, status: number) => {
  try {
    const action = status === 1 ? '启用' : '禁用'
    await ElMessageBox.confirm(
      `确定要${action}用户"${row.realName}"吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await toggleStatus(row.id, status)
    if (res.code === 200) {
      ElMessage.success(res.message || `${action}成功`)
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
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
}

.data-card {
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
  }

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>
