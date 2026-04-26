<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="所属部门">
            <el-select
              v-model="queryParams.departmentId"
              placeholder="请选择部门"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="职级">
            <el-select
              v-model="queryParams.level"
              placeholder="请选择职级"
              clearable
              style="width: 150px"
            >
              <el-option label="P1" :value="1" />
              <el-option label="P2" :value="2" />
              <el-option label="P3" :value="3" />
              <el-option label="P4" :value="4" />
              <el-option label="P5" :value="5" />
              <el-option label="P6" :value="6" />
              <el-option label="P7" :value="7" />
              <el-option label="P8" :value="8" />
              <el-option label="P9" :value="9" />
              <el-option label="P10" :value="10" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="岗位名称">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入岗位名称"
              clearable
              style="width: 200px"
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
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增岗位
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="name" label="岗位名称" min-width="12%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column prop="category" label="岗位类别" min-width="8%">
            <template #default="{ row }">
              {{ getCategoryText(row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="职级" min-width="8%">
            <template #default="{ row }">
              {{ getLevelText(row.level) }}
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="职等" min-width="6%" />
          <el-table-column prop="employeeCount" label="在职人数" min-width="8%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="12%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="warning"
                @click="handleToggleStatus(row)"
              >
                停用
              </el-button>
              <el-button
                v-else
                link
                type="success"
                @click="handleToggleStatus(row)"
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入岗位名称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentId">
          <el-select
            v-model="formData.departmentId"
            placeholder="请选择部门"
            style="width: 100%"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="岗位类别" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择岗位类别"
            style="width: 100%"
          >
            <el-option label="管理类" :value="1" />
            <el-option label="技术类" :value="2" />
            <el-option label="业务类" :value="3" />
            <el-option label="职能类" :value="4" />
            <el-option label="销售类" :value="5" />
            <el-option label="客服类" :value="6" />
            <el-option label="其他" :value="7" />
          </el-select>
        </el-form-item>

        <el-form-item label="职级" prop="level">
          <el-select
            v-model="formData.level"
            placeholder="请选择职级"
            style="width: 100%"
          >
            <el-option label="P1" :value="1" />
            <el-option label="P2" :value="2" />
            <el-option label="P3" :value="3" />
            <el-option label="P4" :value="4" />
            <el-option label="P5" :value="5" />
            <el-option label="P6" :value="6" />
            <el-option label="P7" :value="7" />
            <el-option label="P8" :value="8" />
            <el-option label="P9" :value="9" />
            <el-option label="P10" :value="10" />
          </el-select>
        </el-form-item>

        <el-form-item label="职等" prop="grade">
          <el-select
            v-model="formData.grade"
            placeholder="请选择职等（1-20）"
            style="width: 100%"
          >
            <el-option
              v-for="i in 20"
              :key="i"
              :label="`${i}等`"
              :value="i"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="岗位说明书" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入岗位说明书"
          />
        </el-form-item>

        <el-form-item label="任职要求" prop="requirements">
          <el-input
            v-model="formData.requirements"
            type="textarea"
            :rows="3"
            placeholder="请输入任职要求"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getPositionList,
  addPosition,
  updatePosition,
  deletePosition,
  updatePositionStatus
} from '@/api/position'
import { getDepartmentTree } from '@/api/department'
import type { Position, PositionQueryParams } from '@/types/position'
import type { Department } from '@/types/department'

defineOptions({
  name: 'PositionManagement'
})

// 查询参数
const queryParams = reactive<PositionQueryParams>({
  name: '',
  departmentId: null,
  level: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Position[]>([])
const total = ref(0)

// 部门列表
const departmentList = ref<Department[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<Position>>({
  id: undefined,
  name: '',
  departmentId: undefined,
  category: undefined,
  level: undefined,
  grade: undefined,
  description: '',
  requirements: '',
  employeeCount: 0,
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  category: [{ required: true, message: '请选择岗位类别', trigger: 'change' }],
  level: [{ required: true, message: '请选择职级', trigger: 'change' }],
  grade: [
    { required: true, message: '请输入职等', trigger: 'blur' },
    { type: 'number', min: 1, max: 20, message: '职等范围为1-20', trigger: 'blur', transform: (value: any) => Number(value) }
  ]
}

/**
 * 获取岗位类别文本
 */
const getCategoryText = (category: number) => {
  const map: Record<number, string> = {
    1: '管理类',
    2: '技术类',
    3: '业务类',
    4: '职能类',
    5: '销售类',
    6: '客服类',
    7: '其他'
  }
  return map[category] || '-'
}

/**
 * 获取职级文本
 */
const getLevelText = (level: number) => {
  if (level >= 1 && level <= 10) {
    return `P${level}`
  }
  return '-'
}

/**
 * 加载部门列表
 */
const loadDepartmentList = async () => {
  try {
    const res = await getDepartmentTree({})
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
    console.error('加载部门列表失败:', error)
  }
}

/**
 * 加载岗位列表
 */
const loadPositionList = async () => {
  try {
    const res = await getPositionList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载岗位列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  loadPositionList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.name = ''
  queryParams.departmentId = null
  queryParams.level = null
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  loadPositionList()
}

/**
 * 新增
 */
const handleAdd = () => {
  dialogTitle.value = '新增岗位'
  dialogVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: Position) => {
  dialogTitle.value = '编辑岗位'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    departmentId: row.departmentId,
    category: row.category,
    level: row.level,
    grade: row.grade,
    description: row.description,
    requirements: row.requirements,
    employeeCount: row.employeeCount,
    status: row.status
  })
  dialogVisible.value = true
}

/**
 * 切换状态
 */
const handleToggleStatus = async (row: Position) => {
  const newStatus = row.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '启用' : '停用'

  // 停用时检查在职人数
  if (newStatus === 0 && row.employeeCount > 0) {
    ElMessage.warning(`该岗位下存在 ${row.employeeCount} 名在职员工，无法停用，请先调整员工岗位`)
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要${statusText}该岗位吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await updatePositionStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success(`${statusText}成功`)
      loadPositionList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || `${statusText}失败`)
    }
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const data = {
      ...formData,
      grade: Number(formData.grade)
    }

    const res = formData.id
      ? await updatePosition(data as Position)
      : await addPosition(data)

    if (res.code === 200) {
      ElMessage.success(formData.id ? '更新成功' : '新增成功')
      dialogVisible.value = false
      loadPositionList()
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 对话框关闭
 */
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: undefined,
    name: '',
    departmentId: undefined,
    category: undefined,
    level: undefined,
    grade: undefined,
    description: '',
    requirements: '',
    employeeCount: 0,
    status: 1
  })
}

// 初始化
onMounted(() => {
  loadDepartmentList()
  loadPositionList()
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
