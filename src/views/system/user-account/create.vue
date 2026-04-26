<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回用户账号列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ isEdit ? '编辑用户' : '新增用户' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 表单卡片 -->
    <el-card class="form-card">
      <el-scrollbar class="form-scrollbar">
        <div class="form-wrapper">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <!-- 基本信息 -->
            <div class="form-section">
              <div class="section-title">基本信息</div>

              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="formData.username"
                  placeholder="请输入用户名"
                  maxlength="20"
                  show-word-limit
                  :disabled="isEdit"
                />
              </el-form-item>

              <el-form-item label="真实姓名" prop="realName">
                <el-input
                  v-model="formData.realName"
                  placeholder="请输入真实姓名"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="formData.phone"
                  placeholder="请输入手机号"
                  maxlength="11"
                />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="formData.email"
                  placeholder="请输入邮箱"
                  maxlength="50"
                />
              </el-form-item>
            </div>

            <!-- 角色分配 -->
            <div class="form-section">
              <div class="section-title">角色分配</div>

              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="formData.roleIds"
                  placeholder="请选择角色"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 100%"
                >
                  <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.roleName"
                    :value="role.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <!-- 账号状态 -->
            <div class="form-section">
              <div class="section-title">账号状态</div>

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
                <el-button type="primary" @click="handleSubmit">
                  保存
                </el-button>
                <el-button @click="handleBack">
                  取消
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { addUserAccount, updateUserAccount, getDetail } from '@/api/user-account'
import { getRoleList } from '@/api/role'
import type { UserAccount, Role } from '@/types/system'

const route = useRoute()
const router = useRouter()

// 是否为编辑模式
const isEdit = ref(false)
const editId = ref<number>(0)

// 表单引用
const formRef = ref<FormInstance>()

// 角色列表
const roleList = ref<Role[]>([])

// 表单数据
const formData = reactive<Partial<UserAccount>>({
  username: '',
  realName: '',
  phone: '',
  email: '',
  roleIds: [],
  status: 1
})

// 手机号验证
const validatePhone = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号格式'))
  } else {
    callback()
  }
}

// 邮箱验证
const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '真实姓名长度为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

/**
 * 获取角色列表
 */
const fetchRoleList = async () => {
  try {
    const res = await getRoleList({ page: 1, pageSize: 100, status: 1 })
    roleList.value = res.data.list || []
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

/**
 * 获取详情
 */
const fetchDetail = async (id: number) => {
  try {
    const res = await getDetail(id)
    Object.assign(formData, res.data)
  } catch (error) {
    ElMessage.error('获取详情失败')
    handleBack()
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateUserAccount({ ...formData, id: editId.value })
          ElMessage.success('更新成功')
        } else {
          await addUserAccount(formData)
          ElMessage.success('添加成功')
        }
        handleBack()
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
      }
    }
  })
}

/**
 * 返回列表页
 */
const handleBack = () => {
  router.push('/system/user-account')
}

/**
 * 初始化
 */
onMounted(async () => {
  // 获取角色列表
  await fetchRoleList()

  // 判断是否为编辑模式
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    editId.value = Number(id)
    await fetchDetail(editId.value)
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
  }

  .form-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      padding: 20px;
    }
  }

  .form-wrapper {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e4e7ed;
    }
  }

  .form-buttons {
    display: flex;
    justify-content: center;
    padding-top: 20px;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}
</style>
