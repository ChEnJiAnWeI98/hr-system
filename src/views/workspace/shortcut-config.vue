<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回工作台
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">快捷入口配置</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </div>
    </el-card>

    <!-- 配置卡片 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>已添加的快捷入口（拖动调整顺序）</span>
        </div>
      </template>
      <el-scrollbar class="config-scrollbar">
        <VueDraggable
          v-model="shortcutList"
          :animation="200"
          handle=".drag-handle"
          @end="handleDragEnd"
          class="draggable-container"
        >
          <div
            v-for="item in shortcutList"
            :key="item.id"
            class="shortcut-item"
          >
            <span class="drag-handle">☰</span>
            <i class="iconfont-sys" v-html="item.icon"></i>
            <span class="item-name">{{ item.name }}</span>
            <el-button
              link
              type="danger"
              @click="handleRemove(item.id)"
            >
              删除
            </el-button>
          </div>
        </VueDraggable>
        <el-empty v-if="shortcutList.length === 0" description="暂无快捷入口，请从下方添加" />
      </el-scrollbar>
    </el-card>

    <!-- 可添加功能列表卡片 -->
    <el-card class="available-card">
      <template #header>
        <div class="card-header">
          <span>可添加的功能</span>
        </div>
      </template>
      <div class="available-grid">
        <div
          v-for="item in availableFunctions"
          :key="item.id"
          class="available-item"
        >
          <div class="item-content">
            <i class="iconfont-sys" v-html="item.icon"></i>
            <span class="item-name">{{ item.name }}</span>
          </div>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd(item)"
          >
            添加
          </el-button>
        </div>
        <el-empty v-if="availableFunctions.length === 0" description="所有功能已添加" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getShortcutList, updateShortcutList } from '@/api/workspace'

defineOptions({
  name: 'ShortcutConfig'
})

const router = useRouter()

// 所有可用功能（Wave 3：对齐 V2.0 终态菜单）
const allFunctions = [
  { id: 1, name: '组织架构', icon: '&#xe88a;', path: '/org/organization' },
  { id: 2, name: '员工档案', icon: '&#xe88b;', path: '/employee/profile' },
  { id: 3, name: '合同列表', icon: '&#xe88c;', path: '/contract/list' },
  { id: 4, name: '考勤记录', icon: '&#xe88d;', path: '/attendance/record' },
  { id: 5, name: '请假申请', icon: '&#xe88e;', path: '/attendance/leave-application' },
  { id: 6, name: '薪酬带宽', icon: '&#xe88f;', path: '/comp/structure' },
  { id: 7, name: '绩效评估', icon: '&#xe890;', path: '/perf/evaluation' },
  { id: 8, name: '招聘需求', icon: '&#xe891;', path: '/recruit/demand' },
  { id: 9, name: '培训计划', icon: '&#xe892;', path: '/training/plan' },
  { id: 10, name: '社保公积金', icon: '&#xe893;', path: '/social/employee' },
  { id: 11, name: '审批待办', icon: '&#xe894;', path: '/system/approval-todo' },
  { id: 12, name: '用户账号', icon: '&#xe895;', path: '/system/user-account' }
]

// 当前快捷入口列表
const shortcutList = ref<any[]>([])

// 可添加的功能（过滤掉已添加的）
const availableFunctions = computed(() => {
  const addedIds = shortcutList.value.map(item => item.id)
  return allFunctions.filter(item => !addedIds.includes(item.id))
})

// 加载快捷入口列表
const loadShortcutList = async () => {
  try {
    const res = await getShortcutList()
    if (res.code === 200) {
      shortcutList.value = res.data || []
    }
  } catch (error) {
    console.error('加载快捷入口失败:', error)
  }
}

// 拖动结束
const handleDragEnd = () => {
  // 更新排序
  shortcutList.value.forEach((item, index) => {
    item.order = index + 1
  })
}

// 添加功能
const handleAdd = (item: any) => {
  const maxOrder = shortcutList.value.length > 0
    ? Math.max(...shortcutList.value.map(s => s.order || 0))
    : 0

  shortcutList.value.push({
    ...item,
    order: maxOrder + 1
  })

  ElMessage.success(`已添加 ${item.name}`)
}

// 删除功能
const handleRemove = (id: number) => {
  const index = shortcutList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    const name = shortcutList.value[index].name
    shortcutList.value.splice(index, 1)

    // 重新排序
    shortcutList.value.forEach((item, idx) => {
      item.order = idx + 1
    })

    ElMessage.success(`已移除 ${name}`)
  }
}

// 保存配置
const handleSave = async () => {
  try {
    const res = await updateShortcutList(shortcutList.value)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      setTimeout(() => {
        router.push('/workspace')
      }, 500)
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 返回工作台
const handleBack = () => {
  router.push('/workspace')
}

onMounted(() => {
  loadShortcutList()
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

.config-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  height: 400px;

  :deep(.el-card__body) {
    padding: 20px;
    height: calc(100% - 56px);
  }

  .card-header {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .config-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
    }
  }

  .draggable-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background-color: #e8edf3;
    }

    .drag-handle {
      cursor: move;
      color: #909399;
      font-size: 18px;
      user-select: none;

      &:hover {
        color: #606266;
      }
    }

    .iconfont-sys {
      font-size: 20px;
      color: var(--el-color-primary);
    }

    .item-name {
      flex: 1;
      font-size: 14px;
      color: #303133;
    }
  }
}

.available-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 20px;
    height: calc(100% - 56px);
    overflow-y: auto;
  }

  .card-header {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .available-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .available-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background-color: #e8edf3;
      transform: translateY(-2px);
    }

    .item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .iconfont-sys {
        font-size: 32px;
        color: var(--el-color-primary);
      }

      .item-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
}
</style>
