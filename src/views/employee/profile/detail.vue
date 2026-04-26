<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回员工档案
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">员工详情</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button @click="handleExport">导出PDF</el-button>
        </div>
      </div>
    </el-card>

    <!-- 详情卡片 -->
    <el-card class="detail-card">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="info-section">
            <div class="info-row">
              <div class="info-item">
                <span class="label">员工工号：</span>
                <span class="value">{{ employeeData.employeeNo }}</span>
              </div>
              <div class="info-item">
                <span class="label">员工姓名：</span>
                <span class="value">{{ employeeData.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ employeeData.gender === 1 ? '男' : '女' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">所属部门：</span>
                <span class="value">{{ employeeData.departmentName }}</span>
              </div>
              <div class="info-item">
                <span class="label">岗位：</span>
                <span class="value">{{ employeeData.positionName }}</span>
              </div>
              <div class="info-item">
                <span class="label">员工状态：</span>
                <el-tag v-if="employeeData.status === 1" type="success">在职</el-tag>
                <el-tag v-else-if="employeeData.status === 2" type="warning">试用期</el-tag>
                <el-tag v-else-if="employeeData.status === 3" type="info">已离职</el-tag>
                <el-tag v-else-if="employeeData.status === 4" type="danger">停用</el-tag>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">入职日期：</span>
                <span class="value">{{ employeeData.joinDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号：</span>
                <span class="value">{{ employeeData.phone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ employeeData.email || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">身份证号：</span>
                <span class="value">{{ employeeData.idCard || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">出生日期：</span>
                <span class="value">{{ employeeData.birthDate || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">民族：</span>
                <span class="value">{{ employeeData.nation || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">政治面貌：</span>
                <span class="value">{{ employeeData.politicalStatus || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">婚姻状况：</span>
                <span class="value">{{ getMaritalStatusText(employeeData.maritalStatus) }}</span>
              </div>
              <div class="info-item">
                <span class="label">籍贯：</span>
                <span class="value">{{ employeeData.hometown || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="label">户籍地址：</span>
                <span class="value">{{ employeeData.registeredAddress || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="label">现居住地址：</span>
                <span class="value">{{ employeeData.currentAddress || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="label">备注：</span>
                <span class="value">{{ employeeData.remark || '-' }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 教育经历 -->
        <el-tab-pane label="教育经历" name="education">
          <div v-if="employeeData.educationRecords && employeeData.educationRecords.length > 0" class="records-section">
            <div v-for="(record, index) in employeeData.educationRecords" :key="index" class="record-card">
              <div class="record-header">
                <span class="record-title">教育经历 {{ index + 1 }}</span>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">学校名称：</span>
                  <span class="value">{{ record.schoolName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">专业：</span>
                  <span class="value">{{ record.major }}</span>
                </div>
                <div class="info-item">
                  <span class="label">学历：</span>
                  <span class="value">{{ record.education }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">学位：</span>
                  <span class="value">{{ record.degree || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">是否全日制：</span>
                  <span class="value">{{ record.isFullTime === 1 ? '是' : '否' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">入学时间：</span>
                  <span class="value">{{ record.startDate }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">毕业时间：</span>
                  <span class="value">{{ record.endDate }}</span>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无教育经历" />
        </el-tab-pane>

        <!-- 工作经历 -->
        <el-tab-pane label="工作经历" name="work">
          <div v-if="employeeData.workRecords && employeeData.workRecords.length > 0" class="records-section">
            <div v-for="(record, index) in employeeData.workRecords" :key="index" class="record-card">
              <div class="record-header">
                <span class="record-title">工作经历 {{ index + 1 }}</span>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ record.companyName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">职位：</span>
                  <span class="value">{{ record.position }}</span>
                </div>
                <div class="info-item">
                  <span class="label">入职时间：</span>
                  <span class="value">{{ record.startDate }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">离职时间：</span>
                  <span class="value">{{ record.endDate }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item full-width">
                  <span class="label">工作描述：</span>
                  <span class="value">{{ record.description || '-' }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item full-width">
                  <span class="label">离职原因：</span>
                  <span class="value">{{ record.leaveReason || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无工作经历" />
        </el-tab-pane>

        <!-- 证件信息 -->
        <el-tab-pane label="证件信息" name="certificate">
          <div v-if="employeeData.certificateRecords && employeeData.certificateRecords.length > 0" class="records-section">
            <div v-for="(record, index) in employeeData.certificateRecords" :key="index" class="record-card">
              <div class="record-header">
                <span class="record-title">证件信息 {{ index + 1 }}</span>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">证件类型：</span>
                  <span class="value">{{ record.type }}</span>
                </div>
                <div class="info-item">
                  <span class="label">证件号码：</span>
                  <span class="value">{{ record.number }}</span>
                </div>
                <div class="info-item">
                  <span class="label">发证日期：</span>
                  <span class="value">{{ record.issueDate }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">有效期：</span>
                  <span class="value">{{ record.expiryDate }}</span>
                </div>
                <div class="info-item">
                  <span class="label">到期提醒：</span>
                  <el-tag v-if="isExpiringSoon(record.expiryDate)" type="warning">即将到期</el-tag>
                  <el-tag v-else-if="isExpired(record.expiryDate)" type="danger">已过期</el-tag>
                  <el-tag v-else type="success">正常</el-tag>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无证件信息" />
        </el-tab-pane>

        <!-- 紧急联系人 -->
        <el-tab-pane label="紧急联系人" name="emergency">
          <div v-if="employeeData.emergencyContacts && employeeData.emergencyContacts.length > 0" class="records-section">
            <div v-for="(contact, index) in employeeData.emergencyContacts" :key="index" class="record-card">
              <div class="record-header">
                <span class="record-title">紧急联系人 {{ index + 1 }}</span>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">姓名：</span>
                  <span class="value">{{ contact.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关系：</span>
                  <span class="value">{{ contact.relationship }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话：</span>
                  <span class="value">{{ contact.phone }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">工作单位：</span>
                  <span class="value">{{ contact.company || '-' }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item full-width">
                  <span class="label">备注：</span>
                  <span class="value">{{ contact.remark || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无紧急联系人" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getEmployeeDetail } from '@/api/employee'
import type { Employee } from '@/types/employee'

defineOptions({
  name: 'EmployeeProfileDetail'
})

const route = useRoute()
const router = useRouter()

const activeTab = ref('basic')
const employeeData = ref<Employee>({
  id: 0,
  employeeNo: '',
  name: '',
  gender: 1,
  departmentId: 0,
  departmentName: '',
  positionId: 0,
  positionName: '',
  status: 1,
  joinDate: '',
  createTime: '',
  updateTime: ''
})

/**
 * 获取婚姻状况文本
 */
const getMaritalStatusText = (status?: number) => {
  if (status === undefined || status === null) return '-'
  const map: Record<number, string> = {
    0: '未婚',
    1: '已婚',
    2: '离异',
    3: '丧偶'
  }
  return map[status] || '-'
}

/**
 * 判断证件是否即将到期（30天内）
 */
const isExpiringSoon = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 && diffDays <= 30
}

/**
 * 判断证件是否已过期
 */
const isExpired = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  return expiry < today
}

/**
 * 加载员工详情
 */
const loadEmployeeDetail = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getEmployeeDetail(id)
    if (res.code === 200) {
      employeeData.value = res.data
    }
  } catch (error) {
    ElMessage.error('获取员工详情失败')
  }
}

/**
 * 返回
 */
const handleBack = () => {
  router.push('/employee/profile')
}

/**
 * 导出PDF
 */
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  loadEmployeeDetail()
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

.detail-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .detail-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
      overflow-y: auto;
    }
  }
}

.info-section {
  padding: 20px;
}

.info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;

  &.full-width {
    flex: 3;
  }

  .label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    margin-right: 8px;
  }

  .value {
    font-size: 14px;
    color: #303133;
    word-break: break-all;
  }
}

.records-section {
  padding: 20px;
}

.record-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .record-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;

    .record-title {
      font-size: 15px;
      font-weight: 500;
      color: #303133;
    }
  }
}
</style>
