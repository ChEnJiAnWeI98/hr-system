<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <el-button text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回模板列表
        </el-button>
        <span class="divider">|</span>
        <span class="page-info">模板详情</span>
      </div>
    </el-card>

    <!-- 详情内容 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <div class="header-buttons">
              <el-button type="primary" @click="handleEdit">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="warning" @click="handleViewVersions">
                <el-icon><Document /></el-icon>
                版本管理
              </el-button>
            </div>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="模板名称">
            {{ detail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="合同类型">
            {{ getContractTypeName(detail.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="适用范围">
            {{ detail.scope }}
          </el-descriptions-item>
          <el-descriptions-item label="当前版本">
            {{ detail.version }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detail.status === 1 ? 'success' : 'danger'">
              {{ detail.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ detail.createBy }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detail.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ detail.updateTime || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ detail.remark || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <span>模板内容</span>
        </template>
        <div class="content-preview" v-html="detail.content"></div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Document } from '@element-plus/icons-vue'
import { getTemplateDetail } from '@/api/contract'
import type { ContractTemplate } from '@/types/contract'

defineOptions({
  name: 'ContractTemplateDetail'
})

const router = useRouter()
const route = useRoute()

const detail = ref<ContractTemplate>({} as ContractTemplate)

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
  router.push('/contract/template')
}

// 编辑
const handleEdit = () => {
  router.push(`/contract/template/edit/${detail.value.id}`)
}

// 版本管理
const handleViewVersions = () => {
  router.push(`/contract/template/versions/${detail.value.id}`)
}

// 获取详情
const fetchDetail = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getTemplateDetail(id)
    detail.value = res.data
  } catch (error) {
    ElMessage.error('获取模板详情失败')
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
}
</style>
