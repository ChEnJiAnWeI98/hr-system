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
        <span class="page-info">合同变更</span>
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
          <el-descriptions-item label="合同期限">
            {{ originalContract.startDate }} 至 {{ originalContract.endDate }}
          </el-descriptions-item>
          <el-descriptions-item label="工作地点">
            {{ originalContract.workLocation }}
          </el-descriptions-item>
          <el-descriptions-item label="薪资标准">
            {{ originalContract.salary }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">生效中</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <span>变更信息</span>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="变更类型" prop="changeType">
            <el-select
              v-model="formData.changeType"
              placeholder="请选择变更类型"
              style="width: 400px"
            >
              <el-option label="岗位变更" :value="1" />
              <el-option label="薪资变更" :value="2" />
              <el-option label="工作地点变更" :value="3" />
              <el-option label="工作内容变更" :value="4" />
              <el-option label="合同期限变更" :value="5" />
              <el-option label="其他变更" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="变更日期" prop="changeDate">
            <el-date-picker
              v-model="formData.changeDate"
              type="date"
              placeholder="请选择变更生效日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-divider content-position="left">变更内容</el-divider>

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

          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="如需变更合同期限，请选择新的结束日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-divider content-position="left">变更说明</el-divider>

          <el-form-item label="变更原因" prop="changeReason">
            <el-input
              v-model="formData.changeReason"
              type="textarea"
              :rows="3"
              placeholder="请输入变更原因"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="变更说明" prop="changeDescription">
            <el-input
              v-model="formData.changeDescription"
              type="textarea"
              :rows="3"
              placeholder="请详细说明变更内容"
              maxlength="500"
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
              提交变更
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
import { getContractDetail, changeContract } from '@/api/contract'
import type { Contract } from '@/types/contract'

defineOptions({
  name: 'ContractChange'
})

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const originalContract = ref<Contract>({} as Contract)

// 表单数据
const formData = reactive({
  changeType: undefined as number | undefined,
  changeDate: '',
  workLocation: '',
  workContent: '',
  salary: '',
  endDate: '',
  changeReason: '',
  changeDescription: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  changeType: [
    { required: true, message: '请选择变更类型', trigger: 'change' }
  ],
  changeDate: [
    { required: true, message: '请选择变更生效日期', trigger: 'change' }
  ],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' }
  ],
  changeDescription: [
    { required: true, message: '请详细说明变更内容', trigger: 'blur' }
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

// 获取合同详情
const fetchDetail = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getContractDetail(id)
    originalContract.value = res.data

    // 初始化表单数据为原合同数据
    formData.workLocation = res.data.workLocation
    formData.workContent = res.data.workContent
    formData.salary = res.data.salary
    formData.endDate = res.data.endDate
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

      // 构建变更前后信息
      let beforeChange = ''
      let afterChange = ''

      if (formData.changeType === 1) {
        // 薪资调整
        beforeChange = originalContract.value.salary || ''
        afterChange = formData.salary
      } else if (formData.changeType === 2) {
        // 岗位变动
        beforeChange = formData.changeDescription
        afterChange = formData.workContent
      } else if (formData.changeType === 3) {
        // 工作地点变更
        beforeChange = originalContract.value.workLocation || ''
        afterChange = formData.workLocation
      } else {
        // 其他
        beforeChange = formData.changeDescription
        afterChange = `工作地点：${formData.workLocation}，工作内容：${formData.workContent}，薪资：${formData.salary}`
      }

      await changeContract({
        id,
        changeType: formData.changeType!,
        beforeChange,
        afterChange,
        reason: formData.changeReason,
        effectiveDate: formData.changeDate,
        remark: formData.remark
      })
      ElMessage.success('合同变更提交成功')
      handleBack()
    } catch (error) {
      ElMessage.error('合同变更提交失败')
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
