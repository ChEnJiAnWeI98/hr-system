<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="模板名称">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入模板名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="合同类型">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择合同类型"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="劳动合同" :value="1" />
              <el-option label="保密协议" :value="2" />
              <el-option label="竞业限制协议" :value="3" />
              <el-option label="培训协议" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
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
              <el-option label="停用" :value="0" />
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
          新增模板
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="模板名称" min-width="15%" />
          <el-table-column prop="type" label="合同类型" min-width="12%">
            <template #default="{ row }">
              {{ getContractTypeName(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="适用范围" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="version" label="当前版本" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column prop="updateTime" label="更新时间" min-width="14%" />
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="primary" @click="handleViewVersions(row)">
                版本管理
              </el-button>
              <el-button link type="warning" @click="handleToggleStatus(row)">
                {{ row.status === 1 ? '停用' : '启用' }}
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
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入模板名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="合同类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择合同类型"
            style="width: 100%"
          >
            <el-option label="劳动合同" :value="1" />
            <el-option label="保密协议" :value="2" />
            <el-option label="竞业限制协议" :value="3" />
            <el-option label="培训协议" :value="4" />
            <el-option label="其他" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="适用范围" prop="scope">
          <el-input
            v-model="formData.scope"
            placeholder="请输入适用范围"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="模板内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="10"
            placeholder="请输入模板内容，可使用变量如：{{员工姓名}}、{{工号}}、{{部门}}等"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
            show-word-limit
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
  getTemplateList,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  batchDeleteTemplates,
  toggleTemplateStatus
} from '@/api/contract'
import type { ContractTemplate, ContractTemplateQueryParams } from '@/types/contract'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ContractTemplate'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<ContractTemplateQueryParams>({
  name: '',
  type: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<ContractTemplate[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  type: 1,
  scope: '',
  content: '',
  status: 1,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  scope: [{ required: true, message: '请输入适用范围', trigger: 'blur' }],
  content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
}

// 获取合同类型名称
const getContractTypeName = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '劳动合同',
    2: '保密协议',
    3: '竞业限制协议',
    4: '培训协议',
    5: '其他'
  }
  return typeMap[type] || '未知'
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
  queryParams.type = null
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增模板'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ContractTemplate) => {
  dialogTitle.value = '编辑模板'
  formData.id = row.id
  formData.name = row.name
  formData.type = row.type
  formData.scope = row.scope
  formData.content = row.content
  formData.status = row.status
  formData.remark = row.remark || ''
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: ContractTemplate) => {
  try {
    await ElMessageBox.confirm('确定要删除该模板吗？', '提示', {
      type: 'warning'
    })
    await deleteTemplate(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个模板吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteTemplates(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 启用/停用
const handleToggleStatus = async (row: ContractTemplate) => {
  try {
    await toggleTemplateStatus(row.id)
    ElMessage.success('操作成功')
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 版本管理
const handleViewVersions = (row: ContractTemplate) => {
  router.push(`/contract/template/versions/${row.id}`)
}

// 表格选择变化
const handleSelectionChange = (selection: ContractTemplate[]) => {
  selectedIds.value = selection.map(item => item.id)
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
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.name = ''
  formData.type = 1
  formData.scope = ''
  formData.content = ''
  formData.status = 1
  formData.remark = ''
}

onMounted(() => {
  fetchData()
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

    .el-button:not(:first-child) {
      margin-left: 12px;
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
