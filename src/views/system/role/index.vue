<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="角色名称">
            <el-input
              v-model="queryParams.roleName"
              placeholder="请输入角色名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="角色编码">
            <el-input
              v-model="queryParams.roleCode"
              placeholder="请输入角色编码"
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
              <el-option label="全部" value="" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
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
          新增角色
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="roleName" label="角色名称" min-width="12%" />
          <el-table-column prop="roleCode" label="角色编码" min-width="12%" />
          <el-table-column prop="description" label="描述" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isSystem" label="是否系统内置" min-width="10%">
            <template #default="{ row }">
              <el-tag :type="row.isSystem === 1 ? 'warning' : 'info'">
                {{ row.isSystem === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                v-if="row.isSystem !== 1"
                link
                type="danger"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
              <el-button link type="primary" @click="handlePermission(row)">
                权限配置
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getRoleList, deleteRole } from '@/api/role'
import type { Role, ListParams } from '@/types/system'

defineOptions({
  name: 'SystemRole'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ListParams & { roleName?: string; roleCode?: string; status?: number | null }>({
  roleName: '',
  roleCode: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Role[]>([])
const total = ref(0)
const loading = ref(false)

/**
 * 获取列表数据
 */
const getList = async () => {
  try {
    loading.value = true
    const params = {
      ...queryParams,
      status: queryParams.status === null ? undefined : queryParams.status
    }
    const res = await getRoleList(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 查询
 */
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.roleName = ''
  queryParams.roleCode = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

/**
 * 新增
 */
const handleAdd = () => {
  router.push('/system/role/create/new')
}

/**
 * 编辑
 */
const handleEdit = (row: Role) => {
  router.push(`/system/role/edit/${row.id}`)
}

/**
 * 删除
 */
const handleDelete = async (row: Role) => {
  if (row.isSystem === 1) {
    ElMessage.warning('系统内置角色不可删除')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${row.roleName}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteRole(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 权限配置
 */
const handlePermission = (row: Role) => {
  router.push(`/system/role/permission/${row.id}`)
}

onMounted(() => {
  getList()
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
