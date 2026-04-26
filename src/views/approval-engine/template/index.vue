<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="模板名称">
            <el-input v-model="queryParams.name" placeholder="请输入模板名称" style="width: 250px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="未启用" :value="0" />
              <el-option label="已启用" :value="1" />
              <el-option label="已停用" :value="2" />
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
        <div class="header-buttons">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增模板
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="id" label="ID" min-width="6%" />
          <el-table-column prop="name" label="模板名称" min-width="15%" />
          <el-table-column prop="scope" label="适用范围" min-width="10%" />
          <el-table-column prop="description" label="说明" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="info">未启用</el-tag>
              <el-tag v-else-if="row.status === 1" type="success">已启用</el-tag>
              <el-tag v-else type="danger">已停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" min-width="10%" />
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="19%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleDesign(row)">
                设计流程
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link @click="handleCopy(row)">
                复制
              </el-button>
              <el-button link type="primary" @click="handleToggleStatus(row)">
                {{ row.status === 1 ? '停用' : '启用' }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
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
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模板名称" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="适用范围" prop="scopeType">
          <el-select v-model="formData.scopeType" placeholder="请选择适用范围类型" style="width: 100%" @change="handleScopeTypeChange">
            <el-option label="全公司" value="all" />
            <el-option label="指定部门" value="dept" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.scopeType === 'dept'" label="选择部门" prop="scopeDepts">
          <el-select
            v-model="formData.scopeDepts"
            multiple
            placeholder="请选择部门（可多选）"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="dept in deptList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="抄送人" prop="ccUsers">
          <el-select
            v-model="formData.ccUsers"
            multiple
            placeholder="请选择抄送人（可选）"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
          <div style="font-size: 12px; color: #909399; margin-top: 4px">
            设置默认抄送人，用户提交时可以修改
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">未启用</el-radio>
            <el-radio :label="1">已启用</el-radio>
          </el-radio-group>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getTemplateList,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  copyTemplate,
  toggleTemplateStatus
} from '@/api/approval-engine'
import { getDepartmentTree } from '@/api/department'
import type { ApprovalTemplate, ListParams } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalTemplateList'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ListParams>({
  name: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<ApprovalTemplate[]>([])
const total = ref(0)

// 部门列表数据（扁平化）
const deptList = ref<Array<{ id: string; name: string }>>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<ApprovalTemplate> & { scopeType?: string; scopeDepts?: string[]; scopeUsers?: number[] }>({
  id: undefined,
  name: '',
  scope: '全公司',
  scopeType: 'all',
  scopeDepts: [],
  scopeUsers: [],
  description: '',
  ccUsers: [],
  status: 0
})

// Mock 用户数据
const mockUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '孙七' },
  { id: 6, name: '周八' }
]

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  scopeType: [{ required: true, message: '请选择适用范围类型', trigger: 'change' }]
}

// 获取部门树数据并扁平化
const fetchDeptTree = async () => {
  try {
    const res = await getDepartmentTree({})
    // getDepartmentTree 返回的是 { list: [], total: number } 格式
    if (res.code === 200 && res.data.list) {
      // 将树形结构扁平化为列表
      const flatList: Array<{ id: string; name: string }> = []
      res.data.list.forEach((dept: any) => {
        flatList.push(...flattenDeptTree(dept))
      })
      deptList.value = flatList
    }
  } catch (error) {
    console.error('获取部门数据失败:', error)
  }
}

// 将部门树扁平化为列表
const flattenDeptTree = (node: any, prefix = ''): Array<{ id: string; name: string }> => {
  if (!node) return []

  const result: Array<{ id: string; name: string }> = []
  const currentName = prefix ? `${prefix} / ${node.name}` : node.name

  // 添加当前节点
  result.push({
    id: String(node.id),
    name: currentName
  })

  // 递归处理子节点
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => {
      result.push(...flattenDeptTree(child, currentName))
    })
  }

  return result
}

// 转换组织架构数据格式为 el-tree-select 需要的格式
const convertOrgTreeToSelectTree = (node: any): any => {
  if (!node) return null

  const result: any = {
    value: String(node.id),
    label: node.name
  }

  if (node.children && node.children.length > 0) {
    result.children = node.children.map((child: any) => convertOrgTreeToSelectTree(child))
  }

  return result
}

// 适用范围类型变化
const handleScopeTypeChange = (value: string) => {
  // 清空之前的选择
  formData.scopeDepts = []
  formData.scopeUsers = []

  // 根据类型设置 scope 字段
  if (value === 'all') {
    formData.scope = '全公司'
  } else if (value === 'dept') {
    formData.scope = '指定部门'
  } else if (value === 'user') {
    formData.scope = '指定人员'
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getTemplateList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.name = ''
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

// 新增
const handleCreate = () => {
  dialogTitle.value = '新增模板'
  Object.assign(formData, {
    id: undefined,
    name: '',
    scope: '全公司',
    scopeType: 'all',
    scopeDepts: [],
    scopeUsers: [],
    description: '',
    ccUsers: [],
    status: 0
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ApprovalTemplate) => {
  dialogTitle.value = '编辑模板'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 设计流程
const handleDesign = (row: ApprovalTemplate) => {
  router.push(`/system/approval-template/designer/${row.id}`)
}

// 复制
const handleCopy = async (row: ApprovalTemplate) => {
  if (!row.id) return
  try {
    await copyTemplate(row.id)
    ElMessage.success('复制成功')
    fetchData()
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 切换状态
const handleToggleStatus = async (row: ApprovalTemplate) => {
  if (!row.id) return
  const newStatus = row.status === 1 ? 2 : 1
  const statusText = newStatus === 1 ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${statusText}该模板吗？`, '提示', {
      type: 'warning'
    })

    await toggleTemplateStatus(row.id, newStatus)
    ElMessage.success(`${statusText}成功`)
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${statusText}失败`)
    }
  }
}

// 删除
const handleDelete = async (row: ApprovalTemplate) => {
  if (!row.id) return
  try {
    await ElMessageBox.confirm('确定要删除该模板吗？', '提示', {
      type: 'warning'
    })

    await deleteTemplate(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateTemplate(formData)
          ElMessage.success('更新成功')
        } else {
          await addTemplate(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
  fetchDeptTree()
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
