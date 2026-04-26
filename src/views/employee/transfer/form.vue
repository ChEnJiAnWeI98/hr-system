<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回异动列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div v-if="mode !== 'detail'" class="breadcrumb-actions">
          <el-button v-if="mode === 'create' || mode === 'edit'" @click="handleSave">
            保存
          </el-button>
          <el-button v-if="mode === 'create' || mode === 'edit'" @click="handleBack">
            取消
          </el-button>
          <el-button v-if="mode === 'approve'" type="primary" @click="handleApprove(1)">
            通过
          </el-button>
          <el-button v-if="mode === 'approve'" type="danger" @click="handleApprove(2)">
            拒绝
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 内容区域 -->
    <el-scrollbar class="content-scrollbar">
      <!-- 基本信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          :disabled="mode === 'detail' || mode === 'approve'"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employeeId">
                <el-select
                  v-model="formData.employeeId"
                  placeholder="请选择员工"
                  style="width: 100%"
                  filterable
                  @change="handleEmployeeChange"
                >
                  <el-option
                    v-for="emp in employeeList"
                    :key="emp.id"
                    :label="emp.name"
                    :value="emp.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异动类型" prop="transferType">
                <el-select
                  v-model="formData.transferType"
                  placeholder="请选择异动类型"
                  style="width: 100%"
                  @change="handleTransferTypeChange"
                >
                  <el-option label="调岗" :value="1" />
                  <el-option label="晋升" :value="2" />
                  <el-option label="降职" :value="3" />
                  <el-option label="调薪" :value="4" />
                  <el-option label="转正" :value="5" />
                  <el-option label="试用期延长" :value="6" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请日期" prop="applyDate">
                <el-date-picker
                  v-model="formData.applyDate"
                  type="date"
                  placeholder="请选择申请日期"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生效日期" prop="effectiveDate">
                <el-date-picker
                  v-model="formData.effectiveDate"
                  type="date"
                  placeholder="请选择生效日期"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="异动原因" prop="reason">
                <el-input
                  v-model="formData.reason"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入异动原因"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 异动信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>异动信息</span>
          </div>
        </template>
        <el-form
          :model="formData"
          :rules="formRules"
          label-width="120px"
          :disabled="mode === 'detail' || mode === 'approve'"
        >
          <!-- 调岗 -->
          <template v-if="formData.transferType === 1">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="原部门" prop="oldDepartmentId">
                  <el-select
                    v-model="formData.oldDepartmentId"
                    placeholder="请选择原部门"
                    style="width: 100%"
                    disabled
                  >
                    <el-option
                      v-for="dept in departmentList"
                      :key="dept.id"
                      :label="dept.name"
                      :value="dept.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原岗位" prop="oldPositionId">
                  <el-select
                    v-model="formData.oldPositionId"
                    placeholder="请选择原岗位"
                    style="width: 100%"
                    disabled
                  >
                    <el-option
                      v-for="pos in positionList"
                      :key="pos.id"
                      :label="pos.name"
                      :value="pos.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="新部门" prop="newDepartmentId">
                  <el-select
                    v-model="formData.newDepartmentId"
                    placeholder="请选择新部门"
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
              </el-col>
              <el-col :span="12">
                <el-form-item label="新岗位" prop="newPositionId">
                  <el-select
                    v-model="formData.newPositionId"
                    placeholder="请选择新岗位"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="pos in positionList"
                      :key="pos.id"
                      :label="pos.name"
                      :value="pos.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 晋升/降职 -->
          <template v-if="formData.transferType === 2 || formData.transferType === 3">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="原岗位" prop="oldPositionId">
                  <el-select
                    v-model="formData.oldPositionId"
                    placeholder="请选择原岗位"
                    style="width: 100%"
                    disabled
                  >
                    <el-option
                      v-for="pos in positionList"
                      :key="pos.id"
                      :label="pos.name"
                      :value="pos.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="新岗位" prop="newPositionId">
                  <el-select
                    v-model="formData.newPositionId"
                    placeholder="请选择新岗位"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="pos in positionList"
                      :key="pos.id"
                      :label="pos.name"
                      :value="pos.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 调薪 -->
          <template v-if="formData.transferType === 4">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="原薪资" prop="oldSalary">
                  <el-input
                    v-model="formData.oldSalary"
                    placeholder="请输入原薪资"
                    disabled
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="新薪资" prop="newSalary">
                  <el-input
                    v-model="formData.newSalary"
                    placeholder="请输入新薪资"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="调整金额">
                  <el-input
                    :value="salaryDifference"
                    disabled
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调整幅度">
                  <el-input
                    :value="salaryPercentage"
                    disabled
                  >
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="调整原因" prop="salaryReason">
                  <el-input
                    v-model="formData.salaryReason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入调整原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 转正 -->
          <template v-if="formData.transferType === 5">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入职日期" prop="entryDate">
                  <el-date-picker
                    v-model="formData.entryDate"
                    type="date"
                    placeholder="请选择入职日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="试用期时长" prop="probationPeriod">
                  <el-input
                    v-model="formData.probationPeriod"
                    placeholder="请输入试用期时长"
                    disabled
                  >
                    <template #append>个月</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="转正评价" prop="conversionEvaluation">
                  <el-input
                    v-model="formData.conversionEvaluation"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入转正评价"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 试用期延长 -->
          <template v-if="formData.transferType === 6">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="原试用期" prop="probationPeriod">
                  <el-input
                    v-model="formData.probationPeriod"
                    placeholder="请输入原试用期"
                    disabled
                  >
                    <template #append>个月</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="延长时长" prop="extensionPeriod">
                  <el-input
                    v-model="formData.extensionPeriod"
                    placeholder="请输入延长时长"
                  >
                    <template #append>个月</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="延长原因" prop="extensionReason">
                  <el-input
                    v-model="formData.extensionReason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入延长原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
      </el-card>

      <!-- 审批信息卡片 -->
      <el-card v-if="mode === 'approve' || mode === 'detail'" class="info-card">
        <template #header>
          <div class="card-header">
            <span>审批信息</span>
          </div>
        </template>
        <el-form label-width="120px">
          <!-- 部门负责人审批 -->
          <div class="approval-section">
            <div class="approval-title">部门负责人审批</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审批人">
                  <el-input v-model="formData.deptApprover" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审批时间">
                  <el-input v-model="formData.deptApprovalTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="审批意见">
                  <el-input
                    v-model="formData.deptApprovalOpinion"
                    type="textarea"
                    :rows="2"
                    :disabled="mode === 'detail'"
                    placeholder="请输入审批意见"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- HR审核 -->
          <div class="approval-section">
            <div class="approval-title">HR审核</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核人">
                  <el-input v-model="formData.hrApprover" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核时间">
                  <el-input v-model="formData.hrApprovalTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="审核意见">
                  <el-input
                    v-model="formData.hrApprovalOpinion"
                    type="textarea"
                    :rows="2"
                    :disabled="mode === 'detail'"
                    placeholder="请输入审核意见"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

defineOptions({
  name: 'EmployeeTransferForm'
})

const route = useRoute()
const router = useRouter()

// 页面模式
const mode = ref<'create' | 'edit' | 'approve' | 'detail'>('create')
const transferId = ref<number | null>(null)

// 页面标题
const pageTitle = computed(() => {
  const titles = {
    create: '新增员工异动',
    edit: '编辑员工异动',
    approve: '审批员工异动',
    detail: '员工异动详情'
  }
  return titles[mode.value]
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref({
  employeeId: null as number | null,
  transferType: null as number | null,
  applyDate: '',
  effectiveDate: '',
  reason: '',
  // 调岗
  oldDepartmentId: null as number | null,
  oldPositionId: null as number | null,
  newDepartmentId: null as number | null,
  newPositionId: null as number | null,
  // 调薪
  oldSalary: '',
  newSalary: '',
  salaryReason: '',
  // 转正
  entryDate: '',
  probationPeriod: '',
  conversionEvaluation: '',
  // 试用期延长
  extensionPeriod: '',
  extensionReason: '',
  // 审批信息
  deptApprover: '',
  deptApprovalTime: '',
  deptApprovalOpinion: '',
  hrApprover: '',
  hrApprovalTime: '',
  hrApprovalOpinion: ''
})

// 表单验证规则
const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  transferType: [{ required: true, message: '请选择异动类型', trigger: 'change' }],
  applyDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  reason: [{ required: true, message: '请输入异动原因', trigger: 'blur' }],
  newDepartmentId: [{ required: true, message: '请选择新部门', trigger: 'change' }],
  newPositionId: [{ required: true, message: '请选择新岗位', trigger: 'change' }],
  newSalary: [{ required: true, message: '请输入新薪资', trigger: 'blur' }],
  salaryReason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }],
  conversionEvaluation: [{ required: true, message: '请输入转正评价', trigger: 'blur' }],
  extensionPeriod: [{ required: true, message: '请输入延长时长', trigger: 'blur' }],
  extensionReason: [{ required: true, message: '请输入延长原因', trigger: 'blur' }]
}

// 员工列表
const employeeList = ref([
  { id: 1, name: '张三', departmentId: 1, positionId: 1, salary: 10000 },
  { id: 2, name: '李四', departmentId: 2, positionId: 2, salary: 12000 },
  { id: 3, name: '王五', departmentId: 1, positionId: 3, salary: 15000 }
])

// 部门列表
const departmentList = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '产品部' },
  { id: 3, name: '市场部' }
])

// 岗位列表
const positionList = ref([
  { id: 1, name: '前端工程师' },
  { id: 2, name: '产品经理' },
  { id: 3, name: '技术总监' }
])

// 薪资差额
const salaryDifference = computed(() => {
  const oldSalary = parseFloat(formData.value.oldSalary) || 0
  const newSalary = parseFloat(formData.value.newSalary) || 0
  const diff = newSalary - oldSalary
  return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)
})

// 薪资调整幅度
const salaryPercentage = computed(() => {
  const oldSalary = parseFloat(formData.value.oldSalary) || 0
  const newSalary = parseFloat(formData.value.newSalary) || 0
  if (oldSalary === 0) return '0.00'
  const percentage = ((newSalary - oldSalary) / oldSalary) * 100
  return percentage > 0 ? `+${percentage.toFixed(2)}` : percentage.toFixed(2)
})

// 初始化页面
onMounted(() => {
  const routeName = route.name as string
  if (routeName === 'EmployeeTransferCreate') {
    mode.value = 'create'
    // 设置默认申请日期为今天
    formData.value.applyDate = new Date().toISOString().split('T')[0]
  } else if (routeName === 'EmployeeTransferEdit') {
    mode.value = 'edit'
    transferId.value = Number(route.params.id)
    loadTransferData()
  } else if (routeName === 'EmployeeTransferApprove') {
    mode.value = 'approve'
    transferId.value = Number(route.params.id)
    loadTransferData()
  } else if (routeName === 'EmployeeTransferDetail') {
    mode.value = 'detail'
    transferId.value = Number(route.params.id)
    loadTransferData()
  }
})

// 加载异动数据
const loadTransferData = () => {
  // Mock数据
  formData.value = {
    employeeId: 1,
    transferType: 1,
    applyDate: '2024-01-15',
    effectiveDate: '2024-02-01',
    reason: '因业务需要调整',
    oldDepartmentId: 1,
    oldPositionId: 1,
    newDepartmentId: 2,
    newPositionId: 2,
    oldSalary: '10000',
    newSalary: '12000',
    salaryReason: '',
    entryDate: '2023-07-01',
    probationPeriod: '3',
    conversionEvaluation: '',
    extensionPeriod: '',
    extensionReason: '',
    deptApprover: '部门经理',
    deptApprovalTime: '2024-01-16 10:30:00',
    deptApprovalOpinion: '同意调岗',
    hrApprover: 'HR主管',
    hrApprovalTime: '2024-01-17 14:20:00',
    hrApprovalOpinion: '审核通过'
  }
}

// 员工变更
const handleEmployeeChange = (employeeId: number) => {
  const employee = employeeList.value.find(emp => emp.id === employeeId)
  if (employee) {
    formData.value.oldDepartmentId = employee.departmentId
    formData.value.oldPositionId = employee.positionId
    formData.value.oldSalary = employee.salary.toString()
  }
}

// 异动类型变更
const handleTransferTypeChange = () => {
  // 清空异动信息
  formData.value.newDepartmentId = null
  formData.value.newPositionId = null
  formData.value.newSalary = ''
  formData.value.salaryReason = ''
  formData.value.conversionEvaluation = ''
  formData.value.extensionPeriod = ''
  formData.value.extensionReason = ''
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(mode.value === 'create' ? '新增成功' : '保存成功')
      handleBack()
    }
  })
}

// 审批
const handleApprove = async (status: number) => {
  const action = status === 1 ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定${action}该异动申请吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    ElMessage.success(`${action}成功`)
    handleBack()
  } catch {
    // 取消操作
  }
}

// 返回
const handleBack = () => {
  router.push('/employee/transfer')
}
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;

    .breadcrumb-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .el-button {
        font-size: 14px;
        color: #606266;
        padding: 0;

        &:hover {
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 16px;
        }
      }

      .divider {
        color: #dcdfe6;
        font-size: 14px;
      }

      .page-info {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }

    .breadcrumb-actions {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.info-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .card-header {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.approval-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .approval-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 3px solid var(--el-color-primary);
  }
}
</style>
