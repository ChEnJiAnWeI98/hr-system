<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回证件提醒列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div v-if="!isDetail" class="breadcrumb-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            保存
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 表单卡片 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="form-card">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          :disabled="isDetail"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工工号" prop="employeeId">
                <el-input v-model="formData.employeeId" placeholder="请输入员工ID" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employeeId">
                <el-input value="员工姓名" placeholder="请输入员工姓名" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属部门" prop="employeeId">
                <el-input value="所属部门" placeholder="请输入所属部门" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型" prop="certificateType">
                <el-select
                  v-model="formData.certificateType"
                  placeholder="请选择证件类型"
                  style="width: 100%"
                >
                  <el-option label="身份证" :value="1" />
                  <el-option label="劳动合同" :value="2" />
                  <el-option label="资质证书" :value="3" />
                  <el-option label="健康证" :value="4" />
                  <el-option label="其他" :value="5" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="证件号码" prop="newCertificateNumber">
                <el-input v-model="formData.newCertificateNumber" placeholder="请输入证件号码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期" prop="newExpiryDate">
                <el-date-picker
                  v-model="formData.newExpiryDate"
                  type="date"
                  placeholder="请选择有效期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="更新原因" prop="updateReason">
                <el-input
                  v-model="formData.updateReason"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入更新原因"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getCertificateReminderDetail, updateCertificate } from '@/api/certificate'
import type { CertificateUpdateForm } from '@/types/certificate'

defineOptions({
  name: 'CertificateForm'
})

const route = useRoute()
const router = useRouter()

// 表单引用
const formRef = ref<FormInstance>()

// 页面模式
const pageMode = computed(() => {
  const path = route.path
  if (path.includes('/create/')) return 'create'
  if (path.includes('/edit/')) return 'edit'
  if (path.includes('/detail/')) return 'detail'
  return 'create'
})

const isDetail = computed(() => pageMode.value === 'detail')
const pageTitle = computed(() => {
  if (pageMode.value === 'create') return '新增证件信息'
  if (pageMode.value === 'edit') return '编辑证件信息'
  return '证件信息详情'
})

// 表单数据
const formData = ref<CertificateUpdateForm>({
  id: undefined,
  employeeId: 0,
  certificateType: 0,
  newCertificateNumber: '',
  newExpiryDate: '',
  updateReason: '',
  attachment: ''
})

// 表单验证规则
const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  certificateType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  newCertificateNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
  newExpiryDate: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  updateReason: [{ required: true, message: '请输入更新原因', trigger: 'blur' }]
}

// 提交加载状态
const submitLoading = ref(false)

// 加载数据
const loadData = async () => {
  const id = route.params.id
  if (!id || pageMode.value === 'create') return

  try {
    const res = await getCertificateReminderDetail(Number(id))
    if (res.code === 200 && res.data) {
      const data = res.data
      formData.value = {
        id: data.id,
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        departmentName: data.departmentName,
        certificateType: data.certificateType,
        certificateNumber: data.certificateNumber,
        expiryDate: data.expiryDate,
        newCertificateNumber: '',
        newExpiryDate: '',
        updateReason: '',
        remark: data.remark || ''
      }
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('Load data error:', error)
  }
}

// 返回
const handleBack = () => {
  router.push('/certificate')
}

// 取消
const handleCancel = () => {
  handleBack()
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    const res = await updateCertificate(formData.value)
    if (res.code === 200) {
      ElMessage.success(pageMode.value === 'create' ? '新增成功' : '更新成功')
      handleBack()
    }
  } catch (error) {
    console.error('Submit error:', error)
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadData()
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
    justify-content: space-between;
    align-items: center;
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

.form-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}
</style>
