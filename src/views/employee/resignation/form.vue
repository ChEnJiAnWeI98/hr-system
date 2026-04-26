<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回离职列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div v-if="pageMode !== 'detail'" class="breadcrumb-actions">
          <el-button v-if="pageMode === 'create'" type="primary" :loading="submitLoading" @click="handleSubmit">
            提交申请
          </el-button>
          <el-button v-if="pageMode === 'approve'" type="success" :loading="submitLoading" @click="handleApprove(1)">
            通过
          </el-button>
          <el-button v-if="pageMode === 'approve'" type="danger" :loading="submitLoading" @click="handleApprove(2)">
            拒绝
          </el-button>
          <el-button v-if="pageMode === 'handle'" type="primary" :loading="submitLoading" @click="handleComplete">
            完成办理
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
          :disabled="pageMode === 'detail'"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employeeName">
                <el-input v-if="pageMode === 'create'" v-model="formData.employeeName" placeholder="请输入员工姓名" />
                <span v-else>{{ formData.employeeName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工工号" prop="employeeNo">
                <span>{{ formData.employeeNo || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属部门" prop="departmentName">
                <span>{{ formData.departmentName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位" prop="positionName">
                <span>{{ formData.positionName || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="离职类型" prop="resignationType">
                <el-select
                  v-if="pageMode === 'create'"
                  v-model="formData.resignationType"
                  placeholder="请选择离职类型"
                  style="width: 100%"
                >
                  <el-option label="主动离职" :value="1" />
                  <el-option label="被动离职" :value="2" />
                  <el-option label="协商离职" :value="3" />
                  <el-option label="退休" :value="4" />
                </el-select>
                <span v-else>{{ getResignationTypeName(formData.resignationType) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望离职日期" prop="expectedResignationDate">
                <el-date-picker
                  v-if="pageMode === 'create'"
                  v-model="formData.expectedResignationDate"
                  type="date"
                  placeholder="请选择期望离职日期"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                  style="width: 100%"
                />
                <span v-else>{{ formData.expectedResignationDate }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工作交接人" prop="handoverPerson">
                <el-input
                  v-if="pageMode === 'create'"
                  v-model="formData.handoverPerson"
                  placeholder="请输入工作交接人"
                />
                <span v-else>{{ formData.handoverPerson || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期" prop="applyTime">
                <span>{{ formData.applyTime || new Date().toLocaleDateString('zh-CN') }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="离职原因" prop="resignationReason">
                <el-input
                  v-if="pageMode === 'create'"
                  v-model="formData.resignationReason"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入离职原因"
                  maxlength="500"
                  show-word-limit
                />
                <div v-else class="text-content">{{ formData.resignationReason }}</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="详细说明" prop="detailDescription">
                <el-input
                  v-if="pageMode === 'create'"
                  v-model="formData.detailDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入详细说明（选填）"
                  maxlength="500"
                  show-word-limit
                />
                <div v-else class="text-content">{{ formData.detailDescription || '-' }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 审批记录卡片 -->
      <el-card v-if="pageMode !== 'create'" class="info-card">
        <template #header>
          <div class="card-header">
            <span>审批记录</span>
          </div>
        </template>
        <el-form
          v-if="pageMode === 'approve'"
          ref="approvalFormRef"
          :model="approvalForm"
          :rules="approvalRules"
          label-width="120px"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="审批意见" prop="opinion">
                <el-input
                  v-model="approvalForm.opinion"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入审批意见"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-else class="approval-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="审批人">
              {{ getApproverName() || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="审批时间">
              {{ getApprovalTime() || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="审批结果" :span="2">
              <el-tag v-if="formData.status === 3" type="success">审批通过</el-tag>
              <el-tag v-else-if="formData.status === 4" type="danger">审批拒绝</el-tag>
              <el-tag v-else type="info">待审批</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="审批意见" :span="2">
              {{ getApprovalOpinion() || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>

      <!-- 交接清单卡片 -->
      <el-card v-if="pageMode === 'handle'" class="info-card">
        <template #header>
          <div class="card-header">
            <span>交接清单</span>
            <el-button type="primary" size="small" @click="handleAddHandover">
              <el-icon><Plus /></el-icon>
              添加交接项
            </el-button>
          </div>
        </template>
        <el-table :data="handoverList" border>
          <el-table-column label="交接类型" min-width="10%">
            <template #default="{ row }">
              <el-select v-model="row.type" placeholder="请选择" size="small">
                <el-option label="工作内容" :value="1" />
                <el-option label="项目资料" :value="2" />
                <el-option label="客户资源" :value="3" />
                <el-option label="办公用品" :value="4" />
                <el-option label="其他" :value="5" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="交接内容" min-width="15%">
            <template #default="{ row }">
              <el-input v-model="row.content" placeholder="请输入交接内容" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="交接人" min-width="10%">
            <template #default="{ row }">
              <el-input v-model="row.handoverPerson" placeholder="请输入交接人" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="交接时间" min-width="12%">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.handoverTime"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="交接说明" min-width="12%">
            <template #default="{ row }">
              <el-input v-model="row.remark" placeholder="请输入说明" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="6%" fixed="right">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" @click="handleDeleteHandover($index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 手续清单卡片 -->
      <el-card v-if="pageMode === 'handle'" class="info-card">
        <template #header>
          <div class="card-header">
            <span>手续清单</span>
            <el-button type="primary" size="small" @click="handleAddProcedure">
              <el-icon><Plus /></el-icon>
              添加手续项
            </el-button>
          </div>
        </template>
        <el-table :data="procedureList" border>
          <el-table-column label="手续项目" min-width="12%">
            <template #default="{ row }">
              <el-input v-model="row.name" placeholder="请输入手续项目" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="办理状态" min-width="10%">
            <template #default="{ row }">
              <el-select v-model="row.status" placeholder="请选择" size="small">
                <el-option label="未办理" :value="0" />
                <el-option label="办理中" :value="1" />
                <el-option label="已完成" :value="2" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="办理人" min-width="10%">
            <template #default="{ row }">
              <el-input v-model="row.handler" placeholder="请输入办理人" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="办理时间" min-width="12%">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.handleTime"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注说明" min-width="12%">
            <template #default="{ row }">
              <el-input v-model="row.remark" placeholder="请输入说明" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="6%" fixed="right">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" @click="handleDeleteProcedure($index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { getResignationDetail, addResignation, approveResignation, updateHandover, completeProcedures } from '@/api/resignation'
import type { Resignation, ApproveResignationParams, UpdateHandoverParams, CompleteProceduresParams } from '@/types/resignation'

defineOptions({
  name: 'ResignationForm'
})

const router = useRouter()
const route = useRoute()

// 页面模式：create-发起离职，approve-审批离职，handle-办理离职，detail-查看详情
const pageMode = computed(() => {
  const mode = route.query.mode as string
  return mode || 'detail'
})

// 页面标题
const pageTitle = computed(() => {
  const titles = {
    create: '发起离职',
    approve: '审批离职',
    handle: '办理离职',
    detail: '查看详情'
  }
  return titles[pageMode.value as keyof typeof titles] || '离职详情'
})

// 表单引用
const formRef = ref<FormInstance>()
const approvalFormRef = ref<FormInstance>()

// 提交加载状态
const submitLoading = ref(false)

// 表单数据
const formData = reactive<Partial<Resignation>>({
  employeeName: '',
  employeeNo: '',
  departmentName: '',
  positionName: '',
  resignationType: undefined,
  resignationReason: undefined,
  expectedResignationDate: '',
  handoverPerson: '',
  detailDescription: ''
})

// 审批表单数据
const approvalForm = reactive<Partial<ApproveResignationParams>>({
  id: undefined,
  result: undefined,
  opinion: ''
})

// 交接清单
const handoverList = ref<any[]>([])

// 手续清单
const procedureList = ref<any[]>([])

// 表单验证规则
const formRules: FormRules = {
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  resignationType: [{ required: true, message: '请选择离职类型', trigger: 'change' }],
  resignationReason: [{ required: true, message: '请输入离职原因', trigger: 'blur' }],
  expectedResignationDate: [{ required: true, message: '请选择期望离职日期', trigger: 'change' }]
}

// 审批表单验证规则
const approvalRules: FormRules = {
  opinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

// 禁用日期（不能早于当前日期）
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 获取离职类型名称
const getResignationTypeName = (type: number | undefined) => {
  const typeMap: Record<number, string> = {
    1: '主动离职',
    2: '被动离职',
    3: '协商离职',
    4: '退休'
  }
  return type ? typeMap[type] : '-'
}

// 获取审批人姓名
const getApproverName = () => {
  if (formData.approvalRecords && formData.approvalRecords.length > 0) {
    return formData.approvalRecords[formData.approvalRecords.length - 1].approver
  }
  return '-'
}

// 获取审批时间
const getApprovalTime = () => {
  if (formData.approvalRecords && formData.approvalRecords.length > 0) {
    return formData.approvalRecords[formData.approvalRecords.length - 1].approvalTime
  }
  return '-'
}

// 获取审批意见
const getApprovalOpinion = () => {
  if (formData.approvalRecords && formData.approvalRecords.length > 0) {
    return formData.approvalRecords[formData.approvalRecords.length - 1].opinion || '-'
  }
  return '-'
}

// 返回
const handleBack = () => {
  router.push('/employee/resignation')
}

// 提交申请
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        await addResignation(formData as Partial<Resignation>)
        ElMessage.success('提交成功')
        handleBack()
      } catch (error) {
        ElMessage.error('提交失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 审批
const handleApprove = async (result: number) => {
  if (!approvalFormRef.value) return

  await approvalFormRef.value.validate(async (valid) => {
    if (valid) {
      const action = result === 1 ? '通过' : '拒绝'
      try {
        await ElMessageBox.confirm(`确认${action}该离职申请吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        submitLoading.value = true
        approvalForm.result = result
        await approveResignation(approvalForm as ApproveResignationParams)
        ElMessage.success(`${action}成功`)
        handleBack()
      } catch (error: any) {
        if (error !== 'cancel') {
          ElMessage.error(`${action}失败`)
        }
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 完成办理
const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确认完成离职办理吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    submitLoading.value = true

    // 更新交接清单
    await updateHandover({
      id: Number(route.params.id),
      handoverChecklist: handoverList.value
    })

    // 完成手续清单
    await completeProcedures({
      id: Number(route.params.id),
      procedureChecklist: procedureList.value
    })

    ElMessage.success('办理完成')
    handleBack()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('办理失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 添加交接项
const handleAddHandover = () => {
  handoverList.value.push({
    type: undefined,
    content: '',
    handoverPerson: '',
    handoverTime: '',
    remark: ''
  })
}

// 删除交接项
const handleDeleteHandover = (index: number) => {
  handoverList.value.splice(index, 1)
}

// 添加手续项
const handleAddProcedure = () => {
  procedureList.value.push({
    name: '',
    status: 0,
    handler: '',
    handleTime: '',
    remark: ''
  })
}

// 删除手续项
const handleDeleteProcedure = (index: number) => {
  procedureList.value.splice(index, 1)
}

// 加载详情
const loadDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getResignationDetail(id)
    const data = res.data as Resignation
    Object.assign(formData, data)
    approvalForm.id = data.id

    // 如果是办理模式，初始化交接清单和手续清单
    if (pageMode.value === 'handle') {
      // 初始化默认交接清单
      handoverList.value = [
        { type: 1, content: '', handoverPerson: '', handoverTime: '', remark: '' }
      ]
      // 初始化默认手续清单
      procedureList.value = [
        { name: '工作交接确认', status: 0, handler: '', handleTime: '', remark: '' },
        { name: '办公用品归还', status: 0, handler: '', handleTime: '', remark: '' },
        { name: '离职证明开具', status: 0, handler: '', handleTime: '', remark: '' }
      ]
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

onMounted(() => {
  if (pageMode.value !== 'create') {
    loadDetail()
  } else {
    // 发起模式，设置默认申请日期
    formData.applyTime = new Date().toLocaleDateString('zh-CN')
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
  }

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 16px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  .text-content {
    line-height: 1.8;
    color: #606266;
    white-space: pre-wrap;
  }

  .approval-info {
    :deep(.el-descriptions__label) {
      width: 120px;
    }
  }
}
</style>
