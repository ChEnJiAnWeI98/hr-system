<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回入职列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div v-if="mode === 'create' || mode === 'approve' || mode === 'handle'" class="breadcrumb-actions">
          <el-button v-if="mode === 'create'" @click="handleSave">
            保存
          </el-button>
          <el-button v-if="mode === 'approve'" @click="handleApprove(1)">
            通过
          </el-button>
          <el-button v-if="mode === 'approve'" type="danger" @click="handleApprove(2)">
            拒绝
          </el-button>
          <el-button v-if="mode === 'handle'" type="primary" @click="handleComplete">
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
          :disabled="mode === 'detail'"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="候选人姓名" prop="candidateName">
                <el-input v-model="formData.candidateName" placeholder="请输入候选人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="idNumber">
                <el-input v-model="formData.idNumber" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应聘部门" prop="departmentId">
                <el-tree-select
                  v-model="formData.departmentId"
                  :data="departmentTree"
                  :props="{ label: 'name', children: 'children' }"
                  placeholder="请选择部门"
                  check-strictly
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应聘岗位" prop="positionId">
                <el-select v-model="formData.positionId" placeholder="请选择岗位" style="width: 100%">
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
              <el-form-item label="期望入职日期" prop="expectedDate">
                <el-date-picker
                  v-model="formData.expectedDate"
                  type="date"
                  placeholder="请选择期望入职日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学历" prop="education">
                <el-select v-model="formData.education" placeholder="请选择学历" style="width: 100%">
                  <el-option label="高中及以下" value="高中及以下" />
                  <el-option label="大专" value="大专" />
                  <el-option label="本科" value="本科" />
                  <el-option label="硕士" value="硕士" />
                  <el-option label="博士" value="博士" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毕业院校" prop="school">
                <el-input v-model="formData.school" placeholder="请输入毕业院校" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工作经验" prop="workExperience">
                <el-input v-model="formData.workExperience" placeholder="请输入工作经验（年）" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注说明" prop="remark">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入备注说明"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 审批记录卡片 -->
      <el-card v-if="mode !== 'create' && approvalRecords.length > 0" class="info-card">
        <template #header>
          <div class="card-header">
            <span>审批记录</span>
          </div>
        </template>
        <el-table :data="approvalRecords" border>
          <el-table-column label="审批人" prop="approver" min-width="10%" />
          <el-table-column label="审批时间" prop="approvalTime" min-width="14%" />
          <el-table-column label="审批结果" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.result === 1" type="success">通过</el-tag>
              <el-tag v-else-if="row.result === 2" type="danger">拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" prop="comment" />
        </el-table>
      </el-card>

      <!-- 审批意见卡片 -->
      <el-card v-if="mode === 'approve'" class="info-card">
        <template #header>
          <div class="card-header">
            <span>审批意见</span>
          </div>
        </template>
        <el-form label-width="120px">
          <el-form-item label="审批意见">
            <el-input
              v-model="approvalComment"
              type="textarea"
              :rows="4"
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 资料清单卡片 -->
      <el-card v-if="mode === 'handle' || (mode === 'detail' && documents.length > 0)" class="info-card">
        <template #header>
          <div class="card-header">
            <span>资料清单</span>
          </div>
        </template>
        <el-table :data="documents" border>
          <el-table-column label="资料项目" prop="name" />
          <el-table-column label="是否必须" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.required" type="danger">必须</el-tag>
              <el-tag v-else type="info">非必须</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提交状态" min-width="8%">
            <template #default="{ row }">
              <el-checkbox v-model="row.submitted" :disabled="mode === 'detail'" />
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="submitTime" min-width="14%" />
          <el-table-column label="备注说明" prop="remark">
            <template #default="{ row }">
              <el-input
                v-model="row.remark"
                placeholder="请输入备注"
                :disabled="mode === 'detail'"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 手续清单卡片 -->
      <el-card v-if="mode === 'handle' || (mode === 'detail' && procedures.length > 0)" class="info-card">
        <template #header>
          <div class="card-header">
            <span>手续清单</span>
          </div>
        </template>
        <el-table :data="procedures" border>
          <el-table-column label="手续项目" prop="name" />
          <el-table-column label="办理状态" min-width="8%">
            <template #default="{ row }">
              <el-checkbox v-model="row.completed" :disabled="mode === 'detail'" />
            </template>
          </el-table-column>
          <el-table-column label="办理人" prop="handler" min-width="10%" />
          <el-table-column label="办理时间" prop="handleTime" min-width="14%" />
          <el-table-column label="备注说明" prop="remark">
            <template #default="{ row }">
              <el-input
                v-model="row.remark"
                placeholder="请输入备注"
                :disabled="mode === 'detail'"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import {
  getOnboardingDetail,
  addOnboarding,
  approveOnboarding,
  updateDocuments,
  updateProcedures
} from '@/api/onboarding'
import type {
  OnboardingApplication,
  ApprovalRecord,
  DocumentItem,
  ProcedureItem
} from '@/types/onboarding'
import { getDepartmentTree } from '@/api/department'
import { getPositionList } from '@/api/position'

defineOptions({
  name: 'OnboardingForm'
})

const router = useRouter()
const route = useRoute()

// 页面模式：create-发起入职，approve-审批入职，handle-办理入职，detail-查看详情
const mode = computed(() => {
  const modeParam = route.query.mode as string
  return modeParam || 'detail'
})

// 页面标题
const pageTitle = computed(() => {
  switch (mode.value) {
    case 'create':
      return '发起入职'
    case 'approve':
      return '审批入职'
    case 'handle':
      return '办理入职'
    case 'detail':
      return '查看详情'
    default:
      return '入职管理'
  }
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<Partial<OnboardingApplication>>({
  candidateName: '',
  gender: undefined,
  phone: '',
  idNumber: '',
  email: '',
  departmentId: undefined,
  positionId: undefined,
  expectedDate: '',
  education: '',
  school: '',
  workExperience: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  departmentId: [{ required: true, message: '请选择应聘部门', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择应聘岗位', trigger: 'change' }],
  expectedDate: [
    { required: true, message: '请选择期望入职日期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && new Date(value) < new Date(new Date().toDateString())) {
          callback(new Error('期望入职日期不能早于当前日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 审批记录
const approvalRecords = ref<ApprovalRecord[]>([])

// 审批意见
const approvalComment = ref('')

// 资料清单
const documents = ref<DocumentItem[]>([])

// 手续清单
const procedures = ref<ProcedureItem[]>([])

// 部门树
const departmentTree = ref<any[]>([])

// 岗位列表
const positionList = ref<any[]>([])

// 返回
const handleBack = () => {
  router.push('/employee/onboarding')
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await addOnboarding(formData.value)
        ElMessage.success('保存成功')
        handleBack()
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 审批
const handleApprove = async (result: number) => {
  const resultText = result === 1 ? '通过' : '拒绝'

  try {
    await ElMessageBox.confirm(`确认${resultText}该入职申请吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const id = Number(route.params.id)
    await approveOnboarding({
      id,
      result,
      comment: approvalComment.value
    })

    ElMessage.success(`${resultText}成功`)
    handleBack()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${resultText}失败`)
    }
  }
}

// 完成办理
const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确认完成办理吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const id = Number(route.params.id)

    // 更新资料清单
    await updateDocuments({
      id,
      documents: documents.value.map((doc) => ({
        id: doc.id,
        submitted: doc.submitted,
        submitTime: doc.submitted ? new Date().toLocaleString('zh-CN') : '',
        remark: doc.remark
      }))
    })

    // 更新手续清单
    await updateProcedures({
      id,
      procedures: procedures.value.map((proc) => ({
        id: proc.id,
        completed: proc.completed,
        handler: proc.completed ? '当前用户' : '',
        handleTime: proc.completed ? new Date().toLocaleString('zh-CN') : '',
        remark: proc.remark
      }))
    })

    ElMessage.success('办理完成')
    handleBack()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('办理失败')
    }
  }
}

// 加载部门树
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree()
    departmentTree.value = res.data.list || []
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// 加载岗位列表
const loadPositionList = async () => {
  try {
    const res = await getPositionList({ page: 1, pageSize: 1000 })
    positionList.value = res.data?.list || []
  } catch (error) {
    console.error('加载岗位列表失败', error)
  }
}

// 加载详情
const loadDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getOnboardingDetail(id)
    const data = res.data

    formData.value = {
      candidateName: data.candidateName,
      gender: data.gender,
      phone: data.phone,
      idNumber: data.idNumber,
      email: data.email,
      departmentId: data.departmentId,
      positionId: data.positionId,
      expectedDate: data.expectedDate,
      education: data.education || '',
      school: data.school || '',
      workExperience: data.workExperience || '',
      remark: data.remark || ''
    }

    approvalRecords.value = data.approvalRecords || []
    documents.value = data.documents || []
    procedures.value = data.procedures || []
  } catch (error) {
    ElMessage.error('加载详情失败')
    handleBack()
  }
}

// 初始化
onMounted(async () => {
  await loadDepartmentTree()
  await loadPositionList()

  if (mode.value !== 'create') {
    await loadDetail()
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

  :deep(.el-card__body) {
    padding: 20px;
  }
}
</style>
