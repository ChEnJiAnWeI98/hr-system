<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回试用期管理
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div v-if="showActions" class="breadcrumb-actions">
          <el-button v-if="mode === 'create' || mode === 'edit'" @click="handleSave">
            保存
          </el-button>
          <el-button v-if="mode === 'evaluate'" type="primary" @click="handleEvaluate">
            提交评估
          </el-button>
          <el-button v-if="mode === 'extend'" type="warning" @click="handleExtend">
            提交延长
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 内容区域 -->
    <el-scrollbar class="content-scrollbar">
      <!-- create/edit 模式 -->
      <template v-if="mode === 'create' || mode === 'edit'">
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
            label-width="140px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="员工" prop="employeeId">
                  <el-select
                    v-model="formData.employeeId"
                    placeholder="请选择员工"
                    filterable
                    style="width: 100%"
                    @change="handleEmployeeChange"
                  >
                    <el-option
                      v-for="emp in employeeList"
                      :key="emp.id"
                      :label="`${emp.name} (${emp.employeeNo})`"
                      :value="emp.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职日期" prop="entryDate">
                  <el-date-picker
                    v-model="formData.entryDate"
                    type="date"
                    placeholder="请选择入职日期"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                    @change="calculateRegularDate"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="试用期月数" prop="probationMonths">
                  <el-input
                    v-model.number="formData.probationMonths"
                    placeholder="请输入试用期月数"
                    @input="calculateRegularDate"
                  >
                    <template #append>月</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计转正日期">
                  <el-input v-model="regularDate" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remark"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </template>

      <!-- evaluate 模式 -->
      <template v-if="mode === 'evaluate'">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>员工信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工工号">{{ detail.employeeCode }}</el-descriptions-item>
            <el-descriptions-item label="员工姓名">{{ detail.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">{{ detail.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{ detail.positionName }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ detail.entryDate }}</el-descriptions-item>
            <el-descriptions-item label="试用期结束日期">{{ detail.regularDate }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>评估信息</span>
            </div>
          </template>
          <el-form
            ref="evaluateFormRef"
            :model="evaluateForm"
            :rules="evaluateRules"
            label-width="140px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="工作能力评分" prop="workAbilityScore">
                  <el-rate v-model="evaluateForm.workAbilityScore" :max="5" show-score />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作态度评分" prop="workAttitudeScore">
                  <el-rate v-model="evaluateForm.workAttitudeScore" :max="5" show-score />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="团队协作评分" prop="teamworkScore">
                  <el-rate v-model="evaluateForm.teamworkScore" :max="5" show-score />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="综合评分">
                  <el-input :value="overallScore" disabled>
                    <template #append>分</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="评估结果" prop="result">
                  <el-select v-model="evaluateForm.result" placeholder="请选择评估结果" style="width: 100%">
                    <el-option label="通过转正" :value="1" />
                    <el-option label="延长试用" :value="2" />
                    <el-option label="不合格" :value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="evaluateForm.result === 2" :span="12">
                <el-form-item label="延长月数" prop="extensionMonths">
                  <el-input v-model.number="evaluateForm.extensionMonths" placeholder="请输入延长月数">
                    <template #append>月</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="评估意见" prop="evaluationComment">
                  <el-input
                    v-model="evaluateForm.evaluationComment"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入评估意见"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="evaluateForm.result === 2" :gutter="20">
              <el-col :span="24">
                <el-form-item label="延长原因" prop="extensionReason">
                  <el-input
                    v-model="evaluateForm.extensionReason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入延长原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="evaluateForm.result === 3" :gutter="20">
              <el-col :span="24">
                <el-form-item label="不合格原因" prop="failureReason">
                  <el-input
                    v-model="evaluateForm.failureReason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入不合格原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </template>

      <!-- extend 模式 -->
      <template v-if="mode === 'extend'">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>员工信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工工号">{{ detail.employeeCode }}</el-descriptions-item>
            <el-descriptions-item label="员工姓名">{{ detail.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">{{ detail.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{ detail.positionName }}</el-descriptions-item>
            <el-descriptions-item label="原试用期结束日期">{{ detail.regularDate }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>延长信息</span>
            </div>
          </template>
          <el-form
            ref="extendFormRef"
            :model="extendForm"
            :rules="extendRules"
            label-width="140px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="延长月数" prop="extensionMonths">
                  <el-input
                    v-model.number="extendForm.extensionMonths"
                    placeholder="请输入延长月数（1-6个月）"
                    @input="calculateNewEndDate"
                  >
                    <template #append>月</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="新结束日期">
                  <el-input v-model="newEndDate" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="延长原因" prop="extensionReason">
                  <el-input
                    v-model="extendForm.extensionReason"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入延长原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="extendForm.remark"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </template>

      <!-- evaluationDetail 模式 -->
      <template v-if="mode === 'evaluationDetail'">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>员工信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工工号">{{ detail.employeeCode }}</el-descriptions-item>
            <el-descriptions-item label="员工姓名">{{ detail.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">{{ detail.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{ detail.positionName }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>评估信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="评估时间">{{ detail.evaluationTime }}</el-descriptions-item>
            <el-descriptions-item label="评估人">{{ detail.evaluatorName }}</el-descriptions-item>
            <el-descriptions-item label="工作能力评分">{{ detail.workAbilityScore || '-' }} 分</el-descriptions-item>
            <el-descriptions-item label="工作态度评分">{{ detail.workAttitudeScore || '-' }} 分</el-descriptions-item>
            <el-descriptions-item label="团队协作评分">{{ detail.teamworkScore || '-' }} 分</el-descriptions-item>
            <el-descriptions-item label="综合评分">{{ detail.evaluationScore }} 分</el-descriptions-item>
            <el-descriptions-item label="评估结果">
              <el-tag v-if="detail.status === 1" type="success">已转正</el-tag>
              <el-tag v-else-if="detail.status === 2" type="warning">延长试用</el-tag>
              <el-tag v-else-if="detail.status === 3" type="danger">不合格</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="评估意见" :span="2">{{ detail.evaluationComment }}</el-descriptions-item>
            <el-descriptions-item v-if="detail.status === 2" label="延长月数">{{ detail.extensionMonths }} 个月</el-descriptions-item>
            <el-descriptions-item v-if="detail.status === 2" label="延长原因" :span="2">{{ detail.extensionReason }}</el-descriptions-item>
            <el-descriptions-item v-if="detail.status === 3" label="不合格原因" :span="2">{{ detail.failureReason }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </template>

      <!-- extensionDetail 模式 -->
      <template v-if="mode === 'extensionDetail'">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>延长信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工工号">{{ detail.employeeCode }}</el-descriptions-item>
            <el-descriptions-item label="员工姓名">{{ detail.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">{{ detail.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{ detail.positionName }}</el-descriptions-item>
            <el-descriptions-item label="延长月数">{{ detail.extensionMonths }} 个月</el-descriptions-item>
            <el-descriptions-item label="延长原因" :span="2">{{ detail.extensionReason }}</el-descriptions-item>
            <el-descriptions-item v-if="detail.remark" label="备注" :span="2">{{ detail.remark }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getProbationDetail, addProbation, updateProbation, evaluateProbation } from '@/api/probation'
import { getEmployeeList } from '@/api/employee'
import { getDepartmentTree } from '@/api/department'
import { getPositionList } from '@/api/position'
import type { Probation, ProbationForm, RegularizationForm } from '@/types/probation'
import type { Employee } from '@/types/employee'

defineOptions({
  name: 'EmployeeProbationForm'
})

const router = useRouter()
const route = useRoute()

// 模式：create, edit, evaluate, extend, evaluationDetail, extensionDetail
const mode = ref<string>('')
const id = ref<number>(0)

// 页面标题
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    create: '新增试用期员工',
    edit: '编辑试用期员工',
    evaluate: '转正评估',
    extend: '延长试用期',
    evaluationDetail: '评估详情',
    extensionDetail: '延长详情'
  }
  return titles[mode.value] || ''
})

// 是否显示操作按钮
const showActions = computed(() => {
  return ['create', 'edit', 'evaluate', 'extend'].includes(mode.value)
})

// 表单数据
const formRef = ref()
const formData = reactive<ProbationForm>({
  employeeId: 0,
  entryDate: '',
  probationMonths: 3,
  remark: ''
})

const formRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  probationMonths: [
    { required: true, message: '请输入试用期月数', trigger: 'blur' },
    { type: 'number', min: 1, max: 12, message: '试用期月数范围为1-12个月', trigger: 'blur' }
  ]
}

// 评估表单
const evaluateFormRef = ref()
const evaluateForm = reactive<RegularizationForm & { workAbilityScore?: number; workAttitudeScore?: number; teamworkScore?: number }>({
  id: 0,
  evaluationScore: 0,
  evaluationComment: '',
  result: 1,
  workAbilityScore: 0,
  workAttitudeScore: 0,
  teamworkScore: 0
})

const evaluateRules = {
  workAbilityScore: [{ required: true, message: '请评分', trigger: 'change' }],
  workAttitudeScore: [{ required: true, message: '请评分', trigger: 'change' }],
  teamworkScore: [{ required: true, message: '请评分', trigger: 'change' }],
  result: [{ required: true, message: '请选择评估结果', trigger: 'change' }],
  evaluationComment: [{ required: true, message: '请输入评估意见', trigger: 'blur' }],
  extensionMonths: [
    { required: true, message: '请输入延长月数', trigger: 'blur' },
    { type: 'number', min: 1, max: 6, message: '延长月数范围为1-6个月', trigger: 'blur' }
  ],
  extensionReason: [{ required: true, message: '请输入延长原因', trigger: 'blur' }],
  failureReason: [{ required: true, message: '请输入不合格原因', trigger: 'blur' }]
}

// 延长表单
const extendFormRef = ref()
const extendForm = reactive({
  extensionMonths: 1,
  extensionReason: '',
  remark: ''
})

const extendRules = {
  extensionMonths: [
    { required: true, message: '请输入延长月数', trigger: 'blur' },
    { type: 'number', min: 1, max: 6, message: '延长月数范围为1-6个月', trigger: 'blur' }
  ],
  extensionReason: [{ required: true, message: '请输入延长原因', trigger: 'blur' }]
}

// 详情数据
const detail = ref<Probation>({} as Probation)

// 员工列表
const employeeList = ref<Employee[]>([])

// 预计转正日期
const regularDate = ref('')

// 综合评分
const overallScore = computed(() => {
  const scores = [
    evaluateForm.workAbilityScore || 0,
    evaluateForm.workAttitudeScore || 0,
    evaluateForm.teamworkScore || 0
  ]
  const sum = scores.reduce((a, b) => a + b, 0)
  return (sum / 3).toFixed(1)
})

// 新结束日期
const newEndDate = ref('')

/**
 * 初始化模式
 */
const initMode = () => {
  const routeName = route.name as string
  if (routeName === 'EmployeeProbationCreate') {
    mode.value = 'create'
  } else if (routeName === 'EmployeeProbationEdit') {
    mode.value = 'edit'
    id.value = Number(route.params.id)
  } else if (routeName === 'EmployeeProbationEvaluate') {
    mode.value = 'evaluate'
    id.value = Number(route.params.id)
  } else if (routeName === 'EmployeeProbationExtend') {
    mode.value = 'extend'
    id.value = Number(route.params.id)
  } else if (routeName === 'EmployeeProbationEvaluationDetail') {
    mode.value = 'evaluationDetail'
    id.value = Number(route.params.id)
  } else if (routeName === 'EmployeeProbationExtensionDetail') {
    mode.value = 'extensionDetail'
    id.value = Number(route.params.id)
  }
}

/**
 * 加载员工列表
 */
const loadEmployeeList = async () => {
  try {
    const res = await getEmployeeList({ page: 1, pageSize: 1000 })
    if (res.code === 200) {
      employeeList.value = res.data.list
    }
  } catch (error) {
    console.error('获取员工列表失败:', error)
  }
}

/**
 * 加载详情
 */
const loadDetail = async () => {
  try {
    const res = await getProbationDetail(id.value)
    if (res.code === 200) {
      detail.value = res.data

      if (mode.value === 'edit') {
        Object.assign(formData, {
          id: detail.value.id,
          employeeId: detail.value.employeeId,
          entryDate: detail.value.entryDate,
          probationMonths: detail.value.probationMonths,
          remark: detail.value.remark
        })
        calculateRegularDate()
      } else if (mode.value === 'evaluate') {
        evaluateForm.id = detail.value.id
      }
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

/**
 * 员工选择变化
 */
const handleEmployeeChange = (employeeId: number) => {
  const employee = employeeList.value.find(e => e.id === employeeId)
  if (employee && employee.joinDate) {
    formData.entryDate = employee.joinDate.split(' ')[0]
    calculateRegularDate()
  }
}

/**
 * 计算预计转正日期
 */
const calculateRegularDate = () => {
  if (formData.entryDate && formData.probationMonths) {
    const date = new Date(formData.entryDate)
    date.setMonth(date.getMonth() + formData.probationMonths)
    regularDate.value = date.toISOString().split('T')[0]
  }
}

/**
 * 计算新结束日期
 */
const calculateNewEndDate = () => {
  if (detail.value.regularDate && extendForm.extensionMonths) {
    const date = new Date(detail.value.regularDate)
    date.setMonth(date.getMonth() + extendForm.extensionMonths)
    newEndDate.value = date.toISOString().split('T')[0]
  }
}

/**
 * 保存
 */
const handleSave = async () => {
  try {
    await formRef.value.validate()

    const apiFunc = mode.value === 'create' ? addProbation : updateProbation
    const res = await apiFunc(formData)

    if (res.code === 200) {
      ElMessage.success(mode.value === 'create' ? '添加成功' : '更新成功')
      handleBack()
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

/**
 * 提交评估
 */
const handleEvaluate = async () => {
  try {
    await evaluateFormRef.value.validate()

    evaluateForm.evaluationScore = Number(overallScore.value)

    const res = await evaluateProbation(evaluateForm)
    if (res.code === 200) {
      ElMessage.success('评估成功')
      handleBack()
    }
  } catch (error) {
    console.error('评估失败:', error)
  }
}

/**
 * 提交延长
 */
const handleExtend = async () => {
  try {
    await extendFormRef.value.validate()

    const data: RegularizationForm = {
      id: id.value,
      evaluationScore: 0,
      evaluationComment: '延长试用期',
      result: 2,
      extensionMonths: extendForm.extensionMonths,
      extensionReason: extendForm.extensionReason
    }

    const res = await evaluateProbation(data)
    if (res.code === 200) {
      ElMessage.success('延长成功')
      handleBack()
    }
  } catch (error) {
    console.error('延长失败:', error)
  }
}

/**
 * 返回
 */
const handleBack = () => {
  router.push('/employee/probation')
}

onMounted(() => {
  initMode()
  loadEmployeeList()

  if (id.value) {
    loadDetail()
  }

  if (mode.value === 'extend') {
    calculateNewEndDate()
  }
})
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
}
</style>
