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
        <span class="page-info">合同详情</span>
      </div>
    </el-card>

    <!-- 详情内容 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <div class="header-buttons">
              <el-button
                v-if="detail.status === 1"
                type="primary"
                @click="handleSubmit"
              >
                提交审批
              </el-button>
              <el-button
                v-if="detail.status === 1"
                @click="handleEdit"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                v-if="detail.status === 2"
                type="success"
                @click="handleApprove"
              >
                审批
              </el-button>
              <el-button
                v-if="detail.status === 3"
                type="warning"
                @click="handleSign"
              >
                签订
              </el-button>
              <el-button
                v-if="detail.status === 4"
                type="primary"
                @click="handleRenew"
              >
                续签
              </el-button>
              <el-button
                v-if="detail.status === 4"
                @click="handleChange"
              >
                变更
              </el-button>
              <el-button
                v-if="detail.status === 4"
                type="danger"
                @click="handleTerminate"
              >
                终止
              </el-button>
            </div>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同编号">
            {{ detail.contractNo }}
          </el-descriptions-item>
          <el-descriptions-item label="合同类型">
            {{ getContractTypeName(detail.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="员工姓名">
            {{ detail.employeeName }}
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            {{ detail.employeeNo }}
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ detail.department }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(detail.status)">
              {{ getStatusName(detail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="使用模板">
            {{ detail.templateName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detail.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <span>合同期限</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="开始日期">
            {{ detail.startDate }}
          </el-descriptions-item>
          <el-descriptions-item label="结束日期">
            {{ detail.endDate }}
          </el-descriptions-item>
          <el-descriptions-item label="试用期">
            {{ detail.probationPeriod ? `${detail.probationPeriod}个月` : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="签订日期">
            {{ detail.signDate || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <span>工作信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工作地点">
            {{ detail.workLocation }}
          </el-descriptions-item>
          <el-descriptions-item label="薪资标准">
            {{ detail.salary }}
          </el-descriptions-item>
          <el-descriptions-item label="工作内容" :span="2">
            {{ detail.workContent }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <span>合同内容</span>
        </template>
        <div class="content-preview">{{ detail.content }}</div>
      </el-card>

      <el-card class="detail-card" v-if="detail.remark">
        <template #header>
          <span>备注</span>
        </template>
        <div class="remark-content">{{ detail.remark }}</div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { getContractDetail, submitContract } from '@/api/contract'
import type { Contract } from '@/types/contract'

defineOptions({
  name: 'ContractDetail'
})

const router = useRouter()
const route = useRoute()

const detail = ref<Contract>({} as Contract)

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

// 获取状态名称
const getStatusName = (status: number) => {
  const statusMap: Record<number, string> = {
    1: '草稿',
    2: '待审批',
    3: '待签订',
    4: '生效中',
    5: '已续签',
    6: '已终止',
    7: '已到期',
    8: '已归档'
  }
  return statusMap[status] || '-'
}

// 获取状态类型
const getStatusType = (status: number): 'success' | 'info' | 'warning' | 'danger' | 'primary' => {
  const typeMap: Record<number, 'success' | 'info' | 'warning' | 'danger' | 'primary'> = {
    1: 'info',
    2: 'warning',
    3: 'primary',
    4: 'success',
    5: 'success',
    6: 'danger',
    7: 'info',
    8: 'info'
  }
  return typeMap[status] || 'info'
}

// 返回列表
const handleBack = () => {
  router.push('/contract/list')
}

// 编辑
const handleEdit = () => {
  router.push(`/contract/list/edit/${detail.value.id}`)
}

// 提交审批
const handleSubmit = async () => {
  try {
    await ElMessageBox.confirm('确认提交该合同进行审批吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await submitContract(detail.value.id)
    ElMessage.success('提交成功')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败')
    }
  }
}

// 审批
const handleApprove = () => {
  router.push(`/contract/list/approve/${detail.value.id}`)
}

// 签订
const handleSign = () => {
  router.push(`/contract/list/sign/${detail.value.id}`)
}

// 续签
const handleRenew = () => {
  router.push(`/contract/list/renew/${detail.value.id}`)
}

// 变更
const handleChange = () => {
  router.push(`/contract/list/change/${detail.value.id}`)
}

// 终止
const handleTerminate = () => {
  router.push(`/contract/list/terminate/${detail.value.id}`)
}

// 获取详情
const fetchDetail = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getContractDetail(id)
    detail.value = res.data
  } catch (error) {
    ElMessage.error('获取合同详情失败')
    handleBack()
  }
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

.detail-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .content-preview {
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .remark-content {
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    line-height: 1.8;
  }
}
</style>
