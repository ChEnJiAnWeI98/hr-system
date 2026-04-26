<template>
  <div class="approval-engine-container">
    <el-card class="menu-card">
      <div class="menu-grid">
        <div class="menu-item" @click="navigateTo('/approval-engine/template/list')">
          <div class="menu-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="menu-title">流程模板</div>
          <div class="menu-desc">管理审批流程模板</div>
        </div>

        <div class="menu-item" @click="navigateTo('/approval-engine/instance/list')">
          <div class="menu-icon">
            <el-icon :size="32"><List /></el-icon>
          </div>
          <div class="menu-title">审批实例</div>
          <div class="menu-desc">查看所有审批实例</div>
        </div>

        <div class="menu-item" @click="navigateTo('/approval-engine/todo/list')">
          <div class="menu-icon">
            <el-icon :size="32"><Bell /></el-icon>
          </div>
          <div class="menu-title">待办审批</div>
          <div class="menu-desc">处理待审批事项</div>
        </div>

        <div class="menu-item" @click="navigateTo('/approval-engine/delegate/list')">
          <div class="menu-icon">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="menu-title">代理设置</div>
          <div class="menu-desc">配置审批代理人</div>
        </div>

        <div class="menu-item" @click="navigateTo('/approval-engine/statistics/view')">
          <div class="menu-icon">
            <el-icon :size="32"><DataAnalysis /></el-icon>
          </div>
          <div class="menu-title">统计分析</div>
          <div class="menu-desc">查看审批统计数据</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Document, List, Bell, User, DataAnalysis } from '@element-plus/icons-vue'

defineOptions({
  name: 'ApprovalEngineIndex'
})

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.approval-engine-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 40px;
    height: 100%;
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.menu-item {
  padding: 32px 24px;
  background: #f5f7fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    background: var(--el-color-primary-light-9);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .menu-icon {
      color: var(--el-color-primary);
    }
  }
}

.menu-icon {
  color: #909399;
  margin-bottom: 16px;
  transition: color 0.3s;
}

.menu-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.menu-desc {
  font-size: 14px;
  color: #909399;
}
</style>
