<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回角色列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ isEdit ? '编辑角色' : '新增角色' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 表单卡片 -->
    <el-card class="form-card">
      <el-scrollbar class="form-scrollbar">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="role-form"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="formData.roleName"
                placeholder="请输入角色名称"
                clearable
              />
            </el-form-item>

            <el-form-item label="角色编码" prop="roleCode">
              <el-input
                v-model="formData.roleCode"
                placeholder="请输入角色编码"
                clearable
                :disabled="isEdit"
              />
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="4"
                placeholder="请输入角色描述"
                clearable
              />
            </el-form-item>
          </div>

          <!-- 角色状态 -->
          <div class="form-section">
            <div class="section-title">角色状态</div>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 底部按钮 -->
          <el-form-item>
            <div class="form-buttons">
              <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                保存
              </el-button>
              <el-button @click="handleBack">
                取消
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { addRole, updateRole, getRoleDetail } from '@/api/role'
import type { Role } from '@/types/system'

defineOptions({
  name: 'RoleCreate'
})

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const isEdit = ref(false)
const roleId = ref<number>()

// 表单数据
const formData = reactive<Partial<Role>>({
  roleName: '',
  roleCode: '',
  description: '',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 返回列表页
const handleBack = () => {
  router.push('/system/role')
}

// 获取角色详情
const fetchRoleDetail = async (id: number) => {
  try {
    const res = await getRoleDetail(id)
    if (res.code === 200) {
      Object.assign(formData, res.data)
    }
  } catch (error) {
    ElMessage.error('获取角色详情失败')
    handleBack()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value && roleId.value) {
        // 编辑模式
        const res = await updateRole({
          ...formData,
          id: roleId.value
        })
        if (res.code === 200) {
          ElMessage.success('更新成功')
          handleBack()
        }
      } else {
        // 新增模式
        const res = await addRole(formData)
        if (res.code === 200) {
          ElMessage.success('添加成功')
          handleBack()
        }
      }
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 初始化
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    roleId.value = Number(id)
    fetchRoleDetail(roleId.value)
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
}

.form-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding: 20px;
      display: flex;
      justify-content: center;
    }
  }
}

.role-form {
  width: 600px;

  .form-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e4e7ed;
    }
  }

  .form-buttons {
    display: flex;
    justify-content: center;
    margin-top: 32px;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}
</style>
