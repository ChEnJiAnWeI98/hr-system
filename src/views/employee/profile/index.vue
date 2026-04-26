<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名/工号">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入员工姓名或工号"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="所属部门">
            <el-select
              v-model="queryParams.departmentId"
              placeholder="请选择部门"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="岗位">
            <el-select
              v-model="queryParams.positionId"
              placeholder="请选择岗位"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="pos in positionList"
                :key="pos.id"
                :label="pos.name"
                :value="pos.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="员工状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="待入职" :value="0" />
              <el-option label="在职" :value="1" />
              <el-option label="试用期" :value="2" />
              <el-option label="已离职" :value="3" />
              <el-option label="停用" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="入职时间">
            <el-date-picker
              v-model="joinDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 220px"
            />
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
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增员工
          </el-button>
          <el-button @click="handleExport">
            导出
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
        >
          <el-table-column prop="employeeNo" label="员工工号" min-width="10%" />
          <el-table-column prop="name" label="员工姓名" min-width="10%" />
          <el-table-column prop="gender" label="性别" min-width="6%">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="所属部门" min-width="9%" />
          <el-table-column prop="positionName" label="岗位" min-width="11%" />
          <el-table-column prop="status" label="员工状态" min-width="7%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="info">待入职</el-tag>
              <el-tag v-else-if="row.status === 1" type="success">在职</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">试用期</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已离职</el-tag>
              <el-tag v-else-if="row.status === 4" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="joinDate" label="入职时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                link
                type="warning"
                :disabled="row.status !== 3"
                @click="handleDisable(row)"
              >
                停用
              </el-button>
              <el-button link type="primary" @click="handleView(row)">
                查看详情
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
import { getEmployeeList, updateEmployeeStatus } from '@/api/employee'
import { getDepartmentTree } from '@/api/department'
import type { Employee, EmployeeListParams } from '@/types/employee'
import type { Department } from '@/types/department'

defineOptions({
  name: 'EmployeeProfile'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<EmployeeListParams>({
  keyword: '',
  departmentId: null,
  positionId: null,
  status: null,
  joinDateStart: '',
  joinDateEnd: '',
  page: 1,
  pageSize: 10
})

// 入职时间范围
const joinDateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<Employee[]>([])
const total = ref(0)

// 部门列表
const departmentList = ref<Department[]>([])

// 岗位列表
const positionList = ref<any[]>([])

/**
 * 获取部门列表（扁平化）
 */
const loadDepartmentList = async () => {
  try {
    const res = await getDepartmentTree({ page: 1, pageSize: 1000 })
    if (res.code === 200) {
      // 将树形结构扁平化
      const flattenDepartments = (depts: Department[]): Department[] => {
        const result: Department[] = []
        const traverse = (items: Department[]) => {
          items.forEach(item => {
            result.push(item)
            if (item.children && item.children.length > 0) {
              traverse(item.children)
            }
          })
        }
        traverse(depts)
        return result
      }
      departmentList.value = flattenDepartments(res.data.list || [])
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
  }
}

/**
 * 获取岗位列表
 */
const loadPositionList = async () => {
  try {
    const { getPositionList } = await import('@/api/position')
    const res = await getPositionList({ page: 1, pageSize: 1000 })
    if (res.code === 200) {
      positionList.value = res.data.list
    }
  } catch (error) {
    console.error('获取岗位列表失败:', error)
  }
}

/**
 * 加载表格数据
 */
const loadData = async () => {
  try {
    // 处理入职时间范围
    if (joinDateRange.value) {
      queryParams.joinDateStart = joinDateRange.value[0]
      queryParams.joinDateEnd = joinDateRange.value[1]
    } else {
      queryParams.joinDateStart = ''
      queryParams.joinDateEnd = ''
    }

    const res = await getEmployeeList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取员工列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.departmentId = null
  queryParams.positionId = null
  queryParams.status = null
  joinDateRange.value = null
  queryParams.joinDateStart = ''
  queryParams.joinDateEnd = ''
  queryParams.page = 1
  loadData()
}

/**
 * 新增员工
 */
const handleAdd = () => {
  router.push('/employee/profile/create/new')
}

/**
 * 编辑员工
 */
const handleEdit = (row: Employee) => {
  router.push(`/employee/profile/edit/${row.id}`)
}

/**
 * 查看详情
 */
const handleView = (row: Employee) => {
  router.push(`/employee/profile/detail/${row.id}`)
}

/**
 * 停用员工
 */
const handleDisable = async (row: Employee) => {
  try {
    await ElMessageBox.confirm(
      `确定要停用员工"${row.name}"吗？停用后该员工将无法登录系统。`,
      '停用确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await updateEmployeeStatus(row.id, 4)
    if (res.code === 200) {
      ElMessage.success('停用成功')
      loadData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '停用失败')
    }
  }
}

/**
 * 导出
 */
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  loadDepartmentList()
  loadPositionList()
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

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
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
