<template>
  <div class="profile-container">
    <!-- 个人信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑信息
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <!-- 头像区域 -->
        <div class="avatar-section">
          <el-avatar :size="120" :src="profileData.avatar || undefined">
            {{ profileData.name }}
          </el-avatar>
          <el-button type="primary" @click="handleUploadAvatar" style="margin-top: 16px">
            <el-icon><Upload /></el-icon>
            上传头像
          </el-button>
        </div>

        <!-- 信息区域 -->
        <div class="info-section">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">姓名：</span>
              <span class="info-value">{{ profileData.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">工号：</span>
              <span class="info-value">{{ profileData.employeeNo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">性别：</span>
              <span class="info-value">{{ profileData.gender }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">部门：</span>
              <span class="info-value">{{ profileData.department }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">职位：</span>
              <span class="info-value">{{ profileData.position }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">入职日期：</span>
              <span class="info-value">{{ profileData.hireDate }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">手机号：</span>
              <span class="info-value">{{ profileData.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱：</span>
              <span class="info-value">{{ profileData.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">出生日期：</span>
              <span class="info-value">{{ profileData.birthDate }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">身份证号：</span>
              <span class="info-value">{{ profileData.idCard }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">紧急联系人：</span>
              <span class="info-value">{{ profileData.emergencyContact || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">紧急联系电话：</span>
              <span class="info-value">{{ profileData.emergencyPhone || '-' }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item full-width">
              <span class="info-label">家庭住址：</span>
              <span class="info-value">{{ profileData.address || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑个人信息" width="600px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="紧急联系人">
          <el-input v-model="editForm.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系电话">
          <el-input v-model="editForm.emergencyPhone" placeholder="请输入紧急联系电话" />
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input
            v-model="editForm.address"
            type="textarea"
            :rows="3"
            placeholder="请输入家庭住址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 上传头像弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="上传头像" width="400px">
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAvatarChange"
      >
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAvatar">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Upload, Plus } from '@element-plus/icons-vue'
import { getProfile, updateProfile, uploadAvatar } from '@/api/employee-self-service'
import type { EmployeeProfile } from '@/types/employee-self-service'

defineOptions({
  name: 'EmployeeSelfServiceProfile'
})

// 个人信息数据
const profileData = ref<EmployeeProfile>({
  id: 0,
  employeeNo: '',
  name: '',
  avatar: '',
  department: '',
  position: '',
  phone: '',
  email: '',
  emergencyContact: '',
  emergencyPhone: '',
  address: '',
  hireDate: '',
  gender: '',
  birthDate: '',
  idCard: ''
})

// 编辑弹窗
const editDialogVisible = ref(false)
const editForm = reactive({
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  address: ''
})

// 头像上传
const avatarDialogVisible = ref(false)
const avatarUrl = ref('')
const avatarFile = ref<File | null>(null)

/**
 * 加载个人信息
 */
const loadProfile = async () => {
  try {
    const res = await getProfile()
    if (res.code === 200) {
      profileData.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  }
}

/**
 * 编辑信息
 */
const handleEdit = () => {
  editForm.phone = profileData.value.phone
  editForm.emergencyContact = profileData.value.emergencyContact || ''
  editForm.emergencyPhone = profileData.value.emergencyPhone || ''
  editForm.address = profileData.value.address || ''
  editDialogVisible.value = true
}

/**
 * 保存信息
 */
const handleSave = async () => {
  try {
    const res = await updateProfile(editForm)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      loadProfile()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

/**
 * 上传头像
 */
const handleUploadAvatar = () => {
  avatarUrl.value = profileData.value.avatar || ''
  avatarDialogVisible.value = true
}

/**
 * 头像文件改变
 */
const handleAvatarChange = (file: any) => {
  avatarFile.value = file.raw
  avatarUrl.value = URL.createObjectURL(file.raw)
}

/**
 * 保存头像
 */
const handleSaveAvatar = async () => {
  if (!avatarUrl.value) {
    ElMessage.warning('请选择头像')
    return
  }

  try {
    const res = await uploadAvatar(avatarUrl.value)
    if (res.code === 200) {
      ElMessage.success('上传成功')
      avatarDialogVisible.value = false
      loadProfile()
    }
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped lang="scss">
.profile-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
  }

  :deep(.el-card__body) {
    height: calc(100% - 56px);
    overflow: auto;
  }
}

.profile-content {
  display: flex;
  gap: 40px;
}

.avatar-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-row {
  display: flex;
  gap: 40px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;

  &.full-width {
    flex: 3;
  }

  .info-label {
    flex-shrink: 0;
    color: #909399;
    font-size: 14px;
  }

  .info-value {
    color: #303133;
    font-size: 14px;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar-preview {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
