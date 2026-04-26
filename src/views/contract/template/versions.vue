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
        <span class="page-info">版本管理：{{ templateName }}</span>
      </div>
    </el-card>

    <!-- 版本列表 -->
    <el-card class="data-card">
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="version" label="版本号" min-width="10%" />
          <el-table-column prop="changeLog" label="修改说明" min-width="25%" show-overflow-tooltip />
          <el-table-column prop="isCurrent" label="是否当前版本" min-width="12%">
            <template #default="{ row }">
              <el-tag :type="row.isCurrent ? 'success' : 'info'">
                {{ row.isCurrent ? '当前版本' : '历史版本' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateBy" label="修改人" min-width="12%" />
          <el-table-column prop="updateTime" label="修改时间" min-width="15%" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewContent(row)">
                查看内容
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 内容查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="版本内容"
      width="800px"
    >
      <div class="content-preview" v-html="currentContent"></div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getTemplateVersions, getTemplateDetail } from '@/api/contract'
import type { ContractTemplateVersion } from '@/types/contract'

defineOptions({
  name: 'ContractTemplateVersions'
})

const router = useRouter()
const route = useRoute()

const templateName = ref('')
const tableData = ref<ContractTemplateVersion[]>([])
const dialogVisible = ref(false)
const currentContent = ref('')

// 返回列表
const handleBack = () => {
  router.push('/contract/template')
}

// 查看内容
const handleViewContent = (row: ContractTemplateVersion) => {
  currentContent.value = row.content
  dialogVisible.value = true
}

// 获取模板名称
const fetchTemplateName = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getTemplateDetail(id)
    templateName.value = res.data.name
  } catch (error) {
    console.error('获取模板名称失败', error)
  }
}

// 获取版本列表
const fetchVersions = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getTemplateVersions(id)
    tableData.value = res.data
  } catch (error) {
    ElMessage.error('获取版本列表失败')
  }
}

onMounted(() => {
  fetchTemplateName()
  fetchVersions()
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

.data-card {
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

  .table-container {
    flex: 1;
    overflow: hidden;
  }
}

.content-preview {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 500px;
  overflow-y: auto;
}
</style>
