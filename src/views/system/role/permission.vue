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
          <span class="page-info">权限配置：{{ roleInfo?.roleName || '-' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 权限配置卡片 -->
    <el-card class="permission-card">
      <el-scrollbar class="content-scrollbar">
        <div class="tree-wrapper">
          <el-tree
            ref="treeRef"
            :data="menuTree"
            :props="{ children: 'children', label: 'menuName' }"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkedKeys"
          />
        </div>
        <div class="button-group">
          <el-button type="primary" @click="handleSave">
            保存
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElTree } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getRoleDetail, getMenuTree, updatePermission } from '@/api/role'
import type { Role, Menu } from '@/types/system'

defineOptions({
  name: 'RolePermission'
})

const router = useRouter()
const route = useRoute()

const roleInfo = ref<Role | null>(null)
const menuTree = ref<Menu[]>([])
const checkedKeys = ref<number[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

/**
 * 返回角色列表
 */
const handleBack = () => {
  router.push('/system/role')
}

/**
 * 加载角色详情
 */
const loadRoleDetail = async () => {
  try {
    const roleId = Number(route.params.id)
    if (!roleId) {
      ElMessage.error('角色ID不存在')
      handleBack()
      return
    }

    const res = await getRoleDetail(roleId)
    if (res.code === 200) {
      roleInfo.value = res.data
      // 设置已选中的菜单
      checkedKeys.value = res.data.menuIds || []
    }
  } catch (error) {
    console.error('加载角色详情失败:', error)
    ElMessage.error('加载角色详情失败')
  }
}

/**
 * 加载菜单树
 */
const loadMenuTree = async () => {
  try {
    const res = await getMenuTree()
    if (res.code === 200) {
      menuTree.value = res.data
    }
  } catch (error) {
    console.error('加载菜单树失败:', error)
    ElMessage.error('加载菜单树失败')
  }
}

/**
 * 保存权限配置
 */
const handleSave = async () => {
  try {
    if (!roleInfo.value) {
      ElMessage.error('角色信息不存在')
      return
    }

    // 获取选中的节点（包括半选中的父节点）
    const checkedNodes = treeRef.value?.getCheckedKeys() || []
    const halfCheckedNodes = treeRef.value?.getHalfCheckedKeys() || []
    const allMenuIds = [...checkedNodes, ...halfCheckedNodes] as number[]

    const res = await updatePermission(roleInfo.value.id, allMenuIds)
    if (res.code === 200) {
      ElMessage.success('权限配置成功')
      handleBack()
    }
  } catch (error) {
    console.error('保存权限配置失败:', error)
    ElMessage.error('保存权限配置失败')
  }
}

/**
 * 取消
 */
const handleCancel = () => {
  handleBack()
}

onMounted(() => {
  loadRoleDetail()
  loadMenuTree()
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

.permission-card {
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

  .content-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .tree-wrapper {
    width: 600px;
    margin-bottom: 24px;

    :deep(.el-tree) {
      background: transparent;
    }
  }

  .button-group {
    display: flex;
    justify-content: center;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}
</style>
