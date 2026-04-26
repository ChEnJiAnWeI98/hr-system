<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <el-button text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回合同列表
        </el-button>
        <span class="divider">|</span>
        <span class="page-info">合同续签</span>
      </div>
    </el-card>

    <!-- 表单内容 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="form-card">
        <template #header>
          <span>原合同信息</span>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同编号">
            {{ originalContract.contractNo }}
          </el-descriptions-item>
          <el-descriptions-item label="合同类型">
            {{ getContractTypeName(originalContract.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="员工姓名">
            {{ originalContract.employeeName }}
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            {{ originalContract.employeeNo }}
          </el-descriptions-item>
          <el-descriptions-item label="原合同期限">
            {{ originalContract.startDate }} 至 {{ originalContract.endDate }}
          </el-descriptions-item>
          <el-descriptions-item label="工作地点">
            {{ originalContract.workLocation }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <span>续签信息</span>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-divider content-position="left">基本信息</el-divider>

          <el-form-item label="新合同编号" prop="contractNo">
            <el-input
              v-model="formData.contractNo"
              placeholder="请输入新合同编号"
              maxlength="50"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="合同类型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="请选择合同类型"
              style="width: 400px"
            >
              <el-option label="劳动合同" :value="1" />
              <el-option label="保密协议" :value="2" />
              <el-option label="竞业限制协议" :value="3" />
              <el-option label="培训协议" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-divider content-position="left">合同期限</el-divider>

          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择开始日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="请选择结束日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="试用期" prop="probationPeriod">
            <el-input
              v-model="formData.probationPeriod"
              placeholder="请输入试用期（月）"
              style="width: 400px"
            >
              <template #append>月</template>
            </el-input>
          </el-form-item>

          <el-divider content-position="left">工作信息</el-divider>

          <el-form-item label="工作地点" prop="workLocation">
            <el-input
              v-model="formData.workLocation"
              placeholder="请输入工作地点"
              maxlength="100"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="工作内容" prop="workContent">
            <el-input
              v-model="formData.workContent"
              type="textarea"
              :rows="3"
              placeholder="请输入工作内容"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="薪资标准" prop="salary">
            <el-input
              v-model="formData.salary"
              placeholder="请输入薪资标准"
              maxlength="100"
              style="width: 400px"
            />
          </el-form-item>

          <el-divider content-position="left">续签说明</el-divider>

          <el-form-item label="续签原因" prop="renewReason">
            <el-input
              v-model="formData.renewReason"
              type="textarea"
              :rows="3"
              placeholder="请输入续签原因"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="变更说明" prop="changeDescription">
            <el-input
              v-model="formData.changeDescription"
              type="textarea"
              :rows="3"
              placeholder="如有变更内容，请说明"
              maxlength="200"
              show-word-limit
            />
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

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              提交续签
            </el-button>
            <el-button @click="handleBack">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getContractDetail, renewContract } from '@/api/contract'
import type { Contract } from '@/types/contract'

defineOptions({
  name: 'ContractRenew'
})

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const originalContract = ref<Contract>({} as Contract)

// 表单数据
const formData = reactive<Partial<Contract>>({
  contractNo: '',
  type: undefined,
  startDate: '',
  endDate: '',
  probationPeriod: undefined,
  workLocation: '',
  workContent: '',
  salary: '',
  renewReason: '',
  changeDescription: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  contractNo: [
    { required: true, message: '请输入新合同编号', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择合同类型', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ],
  workLocation: [
    { required: true, message: '请输入工作地点', trigger: 'blur' }
  ],
  workContent: [
    { required: true, message: '请输入工作内容', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '请输入薪资标准', trigger: 'blur' }
  ],
  renewReason: [
    { required: true, message: '请输入续签原因', trigger: 'blur' }
  ]
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
  return typeMap[type] || '-'
}

// 返回列表
const handleBack = () => {
  router.push('/contract/list')
}

// 获取原合同详情
const fetchDetail = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getContractDetail(id)
    originalContract.value = res.data

    // 初始化表单数据（继承原合同信息）
    formData.type = res.data.type
    formData.workLocation = res.data.workLocation
    formData.workContent = res.data.workContent
    formData.salary = res.data.salary
  } catch (error) {
    ElMessage.error('获取合同详情失败')
    handleBack()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const id = parseInt(route.params.id as string)
      await renewContract({
        id,
        contractNo: formData.contractNo!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        salary: formData.salary!,
        workLocation: formData.workLocation!,
        workContent: formData.workContent!,
        reason: formData.renewReason!,
        remark: formData.remark
      })
      ElMessage.success('续签成功')
      handleBack()
    } catch (error) {
      ElMessage.error('续签失败')
    }
  })
}

onMounted(() => {
  fetchDetail()
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
    gap: 12px;
    width: 100%;
    height: 60px;

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
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.form-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
