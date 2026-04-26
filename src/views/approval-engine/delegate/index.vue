<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="委托人">
            <el-input v-model="queryParams.delegator" placeholder="请输入委托人" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="受托人">
            <el-input v-model="queryParams.delegatee" placeholder="请输入受托人" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
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
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增代理
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="id" label="ID" min-width="6%" />
          <el-table-column prop="delegator" label="委托人" min-width="10%" />
          <el-table-column prop="delegatee" label="受托人" min-width="10%" />
          <el-table-column prop="scope" label="代理范围" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.scope === 1" type="primary">全部</el-tag>
              <el-tag v-else type="info">指定流程</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="templateNames" label="指定流程" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="startTime" label="开始时间" min-width="14%" />
          <el-table-column prop="endTime" label="结束时间" min-width="14%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">启用</el-tag>
              <el-tag v-else type="info">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="代理原因" min-width="12%" show-overflow-tooltip />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="primary" @click="handleToggleStatus(row)">
                {{ row.status === 1 ? '禁用' : '启用' }}
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
        <el-form-item label="委托人" prop="delegatorId">
          <el-select
            v-model="formData.delegatorId"
            placeholder="请选择委托人"
            style="width: 100%"
            :disabled="!!formData.id"
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="受托人" prop="delegateeId">
          <el-select
            v-model="formData.delegateeId"
            placeholder="请选择受托人"
            style="width: 100%"
          >
            <el-option
              v-for="user in mockUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="代理范围" prop="scope">
          <el-radio-group v-model="formData.scope">
            <el-radio :label="1">全部流程</el-radio>
            <el-radio :label="2">指定流程</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.scope === 2"
          label="指定流程"
          prop="templateIds"
        >
          <el-select
            v-model="formData.templateIds"
            multiple
            placeholder="请选择流程模板"
            style="width: 100%"
          >
            <el-option
              v-for="template in mockTemplates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="代理原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入代理原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getDelegateList,
  addDelegate,
  updateDelegate,
  deleteDelegate,
  toggleDelegateStatus
} from '@/api/approval-engine'
import type { ApprovalDelegate, ListParams } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalDelegateList'
})

// Mock 数据
const mockUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
]

const mockTemplates = [
  { id: 1, name: '请假审批' },
  { id: 2, name: '报销审批' },
  { id: 3, name: '采购审批' }
]

// 查询参数
const queryParams = reactive<ListParams>({
  delegator: '',
  delegatee: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<ApprovalDelegate[]>([])
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = computed(() => (formData.id ? '编辑代理' : '新增代理'))
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<ApprovalDelegate>>({
  delegatorId: undefined,
  delegateeId: undefined,
  scope: 1,
  templateIds: [],
  startTime: '',
  endTime: '',
  reason: '',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  delegatorId: [{ required: true, message: '请选择委托人', trigger: 'change' }],
  delegateeId: [{ required: true, message: '请选择受托人', trigger: 'change' }],
  scope: [{ required: true, message: '请选择代理范围', trigger: 'change' }],
  templateIds: [
    {
      validator: (rule, value, callback) => {
        if (formData.scope === 2 && (!value || value.length === 0)) {
          callback(new Error('请选择流程模板'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getDelegateList(queryParams)
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
  queryParams.delegator = ''
  queryParams.delegatee = ''
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  Object.assign(formData, {
    id: undefined,
    delegatorId: undefined,
    delegateeId: undefined,
    scope: 1,
    templateIds: [],
    startTime: '',
    endTime: '',
    reason: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ApprovalDelegate) => {
  Object.assign(formData, {
    id: row.id,
    delegatorId: row.delegatorId,
    delegateeId: row.delegateeId,
    scope: row.scope,
    templateIds: row.templateIds || [],
    startTime: row.startTime,
    endTime: row.endTime,
    reason: row.reason,
    status: row.status
  })
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: ApprovalDelegate) => {
  if (!row.id) return
  try {
    await toggleDelegateStatus(row.id)
    ElMessage.success('操作成功')
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除
const handleDelete = async (row: ApprovalDelegate) => {
  if (!row.id) return
  try {
    await ElMessageBox.confirm('确定要删除该代理设置吗？', '提示', {
      type: 'warning'
    })

    await deleteDelegate(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (formData.id) {
        await updateDelegate(formData as ApprovalDelegate)
        ElMessage.success('更新成功')
      } else {
        await addDelegate(formData as Partial<ApprovalDelegate>)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      fetchData()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
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
