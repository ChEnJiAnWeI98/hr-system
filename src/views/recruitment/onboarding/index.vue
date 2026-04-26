<template>
  <div class="onboarding-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="入职编号">
            <el-input v-model="queryParams.onboardingNo" placeholder="请输入入职编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="入职岗位">
            <el-input v-model="queryParams.position" placeholder="请输入入职岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待入职" :value="1" />
              <el-option label="材料准备中" :value="2" />
              <el-option label="已完成" :value="3" />
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
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增入职
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="onboardingNo" label="入职编号" min-width="10%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="position" label="入职岗位" min-width="10%" />
          <el-table-column prop="department" label="所属部门" min-width="10%" />
          <el-table-column prop="onboardingDate" label="入职日期" min-width="10%" />
          <el-table-column prop="mentor" label="导师" min-width="10%" />
          <el-table-column label="材料完成度" min-width="10%">
            <template #default="{ row }">
              {{ row.completedMaterials }}/{{ row.totalMaterials }}
            </template>
          </el-table-column>
          <el-table-column prop="accountStatus" label="账号状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.accountStatus === 1" type="warning">未开通</el-tag>
              <el-tag v-else-if="row.accountStatus === 2" type="success">已开通</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待入职</el-tag>
              <el-tag v-else-if="row.status === 2" type="primary">材料准备中</el-tag>
              <el-tag v-else-if="row.status === 3" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="primary" @click="handleManageMaterials(row)">
                材料管理
              </el-button>
              <el-button link type="success" :disabled="row.status === 3" @click="handleComplete(row)">
                完成入职
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

    <!-- 新增/编辑入职弹窗 -->
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
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>

        <el-form-item label="入职岗位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入入职岗位" />
        </el-form-item>

        <el-form-item label="所属部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入所属部门" />
        </el-form-item>

        <el-form-item label="入职日期" prop="onboardingDate">
          <el-date-picker
            v-model="formData.onboardingDate"
            type="date"
            placeholder="请选择入职日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="导师" prop="mentor">
          <el-input v-model="formData.mentor" placeholder="请输入导师姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="入职详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="入职编号">{{ detailData.onboardingNo }}</el-descriptions-item>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="入职岗位">{{ detailData.position }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ detailData.department }}</el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ detailData.onboardingDate }}</el-descriptions-item>
        <el-descriptions-item label="导师">{{ detailData.mentor }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
        <el-descriptions-item label="材料完成度">
          {{ detailData.completedMaterials }}/{{ detailData.totalMaterials }}
        </el-descriptions-item>
        <el-descriptions-item label="账号状态">
          <el-tag v-if="detailData.accountStatus === 1" type="warning">未开通</el-tag>
          <el-tag v-else-if="detailData.accountStatus === 2" type="success">已开通</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待入职</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="primary">材料准备中</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="success">已完成</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 材料管理弹窗 -->
    <el-dialog
      v-model="materialsVisible"
      title="材料管理"
      width="600px"
    >
      <div class="materials-content">
        <div class="materials-header">
          <span class="employee-name">{{ currentEmployee }}</span>
          <span class="materials-progress">
            完成度：{{ completedCount }}/{{ materialsList.length }}
          </span>
        </div>

        <el-divider />

        <div class="materials-list">
          <el-checkbox
            v-for="material in materialsList"
            :key="material.id"
            v-model="material.completed"
            :label="material.name"
            @change="handleMaterialChange"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="materialsVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMaterials">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Onboarding, OnboardingListParams } from '@/types/recruitment'
import { getOnboardingList, addOnboarding, updateOnboarding, deleteOnboarding, batchDeleteOnboarding } from '@/api/onboarding'

defineOptions({
  name: 'RecruitmentOnboarding'
})

// 查询参数
const queryParams = reactive<OnboardingListParams>({
  onboardingNo: '',
  employeeName: '',
  position: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Onboarding[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增入职')
const detailVisible = ref(false)
const materialsVisible = ref(false)

// 表单数据
const formRef = ref<FormInstance>()
const formData = ref<Partial<Onboarding>>({
  employeeName: '',
  position: '',
  department: '',
  onboardingDate: '',
  mentor: '',
  phone: '',
  email: ''
})

// 详情数据
const detailData = ref<Partial<Onboarding>>({})

// 材料管理
const currentEmployee = ref('')
const currentOnboardingId = ref<number>(0)
const materialsList = ref<Array<{ id: number; name: string; completed: boolean }>>([
  { id: 1, name: '身份证复印件', completed: false },
  { id: 2, name: '学历证明', completed: false },
  { id: 3, name: '劳动合同', completed: false },
  { id: 4, name: '银行卡信息', completed: false },
  { id: 5, name: '入职体检报告', completed: false }
])

const completedCount = computed(() => {
  return materialsList.value.filter(m => m.completed).length
})

// 表单验证规则
const formRules: FormRules = {
  employeeName: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入入职岗位', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入所属部门', trigger: 'blur' }
  ],
  onboardingDate: [
    { required: true, message: '请选择入职日期', trigger: 'change' }
  ],
  mentor: [
    { required: true, message: '请输入导师姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 获取列表
const getList = async () => {
  try {
    const res = await getOnboardingList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取入职列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.onboardingNo = ''
  queryParams.employeeName = ''
  queryParams.position = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 表格选择
const handleSelectionChange = (selection: Onboarding[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增入职'
  formData.value = {
    employeeName: '',
    position: '',
    department: '',
    onboardingDate: '',
    mentor: '',
    phone: '',
    email: ''
  }
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: Onboarding) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 材料管理
const handleManageMaterials = (row: Onboarding) => {
  currentEmployee.value = row.employeeName || ''
  currentOnboardingId.value = row.id

  // 根据完成度初始化材料列表
  const completed = row.completedMaterials || row.completed || 0
  materialsList.value.forEach((material, index) => {
    material.completed = index < completed
  })

  materialsVisible.value = true
}

// 材料状态变化
const handleMaterialChange = () => {
  // 材料状态变化时的处理逻辑
}

// 保存材料
const handleSaveMaterials = async () => {
  try {
    const completedMaterials = materialsList.value.filter(m => m.completed).length

    await updateOnboarding({
      id: currentOnboardingId.value,
      completedMaterials
    })

    ElMessage.success('保存成功')
    materialsVisible.value = false
    getList()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 完成入职
const handleComplete = async (row: Onboarding) => {
  try {
    await ElMessageBox.confirm('确认完成该员工的入职流程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateOnboarding({
      id: row.id,
      status: 3,
      accountStatus: 2
    })

    ElMessage.success('操作成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await updateOnboarding(formData.value)
          ElMessage.success('更新成功')
        } else {
          await addOnboarding(formData.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确认删除选中的入职记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await batchDeleteOnboarding(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 初始化
getList()
</script>

<style scoped lang="scss">
.onboarding-container {
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

.materials-content {
  .materials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .employee-name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .materials-progress {
      font-size: 14px;
      color: #606266;
    }
  }

  .materials-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
