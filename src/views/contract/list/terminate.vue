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
        <span class="page-info">合同终止</span>
      </div>
    </el-card>

    <!-- 表单内容 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="form-card">
        <template #header>
          <span>合同信息</span>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同编号">
            {{ contractDetail.contractNo }}
          </el-descriptions-item>
          <el-descriptions-item label="合同类型">
            {{ getContractTypeName(contractDetail.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="员工姓名">
            {{ contractDetail.employeeName }}
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            {{ contractDetail.employeeNo }}
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ contractDetail.department }}
          </el-descriptions-item>
          <el-descriptions-item label="合同期限">
            {{ contractDetail.startDate }} 至 {{ contractDetail.endDate }}
          </el-descriptions-item>
          <el-descriptions-item label="工作地点">
            {{ contractDetail.workLocation }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">生效中</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <span>终止信息</span>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="终止类型" prop="terminateType">
            <el-select
              v-model="formData.terminateType"
              placeholder="请选择终止类型"
              style="width: 400px"
            >
              <el-option label="协商解除" :value="1" />
              <el-option label="员工提出" :value="2" />
              <el-option label="公司提出" :value="3" />
              <el-option label="合同到期" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="终止日期" prop="terminateDate">
            <el-date-picker
              v-model="formData.terminateDate"
              type="date"
              placeholder="请选择终止日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="终止原因" prop="terminateReason">
            <el-input
              v-model="formData.terminateReason"
              type="textarea"
              :rows="4"
              placeholder="请输入终止原因"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="经济补偿" prop="compensation">
            <el-input
              v-model="formData.compensation"
              placeholder="请输入经济补偿金额（元）"
              style="width: 400px"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="工作交接" prop="handover">
            <el-radio-group v-model="formData.handover">
              <el-radio :label="1">已完成</el-radio>
              <el-radio :label="0">未完成</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="交接说明" prop="handoverDescription">
            <el-input
              v-model="formData.handoverDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入工作交接说明"
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
            <el-button type="danger" @click="handleSubmit">
              确认终止
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getContractDetail, terminateContract } from '@/api/contract'
import type { Contract } from '@/types/contract'

defineOptions({
  name: 'ContractTerminate'
})

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const contractDetail = ref<Contract>({} as Contract)

// 表单数据
const formData = reactive({
  terminateType: undefined as number | undefined,
  terminateDate: '',
  terminateReason: '',
  compensation: '',
  handover: 1,
  handoverDescription: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  terminateType: [
    { required: true, message: '请选择终止类型', trigger: 'change' }
  ],
  terminateDate: [
    { required: true, message: '请选择终止日期', trigger: 'change' }
  ],
  terminateReason: [
    { required: true, message: '请输入终止原因', trigger: 'blur' }
  ],
  handover: [
    { required: true, message: '请选择工作交接状态', trigger: 'change' }
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
    contractDetail.value = res.data
  } catch (error) {
    ElMessage.error('获取合同详情失败')
    handleBack()
  }
}

// 提交终止
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await ElMessageBox.confirm(
        '终止合同后将无法恢复，确认终止该合同吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      const id = parseInt(route.params.id as string)

      // 解析补偿金额
      const compensationAmount = formData.compensation ? parseFloat(formData.compensation) : undefined

      await terminateContract({
        id,
        terminateType: formData.terminateType!,
        reason: formData.terminateReason,
        terminateDate: formData.terminateDate,
        hasCompensation: !!formData.compensation,
        compensationAmount,
        remark: formData.remark
      })
      ElMessage.success('合同终止成功')
      handleBack()
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error('合同终止失败')
      }
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
