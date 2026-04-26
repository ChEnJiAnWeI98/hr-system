<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回模板列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ templateName || '流程设计器' }}</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button @click="handleSave">
            <el-icon><FolderOpened /></el-icon>
            保存
          </el-button>
          <el-button type="primary" @click="handlePreview">
            <el-icon><View /></el-icon>
            预览
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 设计器主体 -->
    <el-card class="designer-card">
      <FlowDesigner v-model="flowData" @save="handleFlowSave" />
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, FolderOpened, View } from '@element-plus/icons-vue'
import { getTemplateDetail, updateTemplate } from '@/api/approval-engine'
import FlowDesigner from '@/components/approval-flow/FlowDesigner.vue'

defineOptions({
  name: 'ApprovalTemplateDesigner'
})

const router = useRouter()
const route = useRoute()

const templateId = computed(() => Number(route.params.id))
const templateName = ref('')
const flowData = ref<any>(null)

// 返回
const handleBack = () => {
  router.push('/approval-engine/template')
}

// 保存
const handleSave = async () => {
  if (!flowData.value || !flowData.value.nodes || flowData.value.nodes.length === 0) {
    ElMessage.warning('请至少添加一个节点')
    return
  }

  try {
    await updateTemplate({
      id: templateId.value,
      flowConfig: flowData.value
    })
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// FlowDesigner 保存事件
const handleFlowSave = (data: any) => {
  flowData.value = data
  handleSave()
}

// 预览
const handlePreview = () => {
  if (!flowData.value || !flowData.value.nodes || flowData.value.nodes.length === 0) {
    ElMessage.warning('请至少添加一个节点')
    return
  }
  ElMessage.info('预览功能将在后续版本中实现')
}

// 加载模板数据
const loadTemplate = async () => {
  try {
    const res = await getTemplateDetail(templateId.value)
    console.log('Template detail response:', res)
    console.log('Template flowConfig:', res.data.flowConfig)
    templateName.value = res.data.name
    if (res.data.flowConfig) {
      flowData.value = res.data.flowConfig
      console.log('FlowData set to:', flowData.value)
    } else {
      console.warn('No flowConfig found in template')
    }
  } catch (error) {
    console.error('Load template error:', error)
    ElMessage.error('加载模板失败')
  }
}

onMounted(() => {
  if (templateId.value) {
    loadTemplate()
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

.designer-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
  }
}
</style>
