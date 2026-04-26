<template>
  <div class="page-container">
    <div class="split-layout">
      <!-- 左侧：部门树卡片 -->
      <el-card class="left-card">
        <div class="tree-header">
          <span class="tree-title">部门列表</span>
          <el-button type="primary" size="small" @click="handleAddRoot">
            新增根部门
          </el-button>
        </div>
        <el-input
          v-model="deptFilterText"
          placeholder="请输入部门名称"
          clearable
          class="tree-search"
        />
        <div class="tree-container">
          <el-tree
            ref="treeRef"
            :data="departmentTree"
            :props="{ label: 'name', children: 'children' }"
            :filter-node-method="filterNode"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleDeptClick"
          />
        </div>
      </el-card>

      <!-- 右侧：部门详情 -->
      <div class="right-content">
        <el-card v-if="selectedDept" class="detail-card">
          <div class="detail-header">
            <div class="dept-name">{{ selectedDept.name }}</div>
            <div class="header-buttons">
              <el-button @click="handleAddChild">
                新增子部门
              </el-button>
              <el-button @click="handleEdit">
                编辑
              </el-button>
              <el-button type="danger" @click="handleDelete">
                删除
              </el-button>
              <el-button
                v-if="selectedDept.status === 1"
                type="warning"
                @click="handleToggleStatus"
              >
                停用
              </el-button>
              <el-button
                v-else
                type="success"
                @click="handleToggleStatus"
              >
                启用
              </el-button>
            </div>
          </div>

          <div class="detail-content">
            <div class="info-row">
              <div class="info-item">
                <span class="label">部门编码：</span>
                <span class="value">{{ selectedDept.code }}</span>
              </div>
              <div class="info-item">
                <span class="label">上级部门：</span>
                <span class="value">{{ selectedDept.parentId ? getParentName(selectedDept.parentId) : '无' }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <span class="label">部门负责人：</span>
                <span class="value">{{ selectedDept.leaderName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">成立时间：</span>
                <span class="value">{{ selectedDept.establishDate }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item full-width">
                <span class="label">编制人数：</span>
                <div class="staff-info">
                  <span class="value">{{ selectedDept.currentCount }} / {{ selectedDept.headcount }}</span>
                  <el-progress
                    :percentage="staffPercentage"
                    :color="staffProgressColor"
                    :stroke-width="5"
                    style="flex: 1; margin-left: 16px"
                  />
                  <span :class="['staff-status', staffStatusClass]">
                    {{ staffStatusText }}
                  </span>
                </div>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item full-width">
                <span class="label">职能描述：</span>
                <span class="value">{{ selectedDept.description }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <span class="label">状态：</span>
                <el-tag :type="selectedDept.status === 1 ? 'success' : 'danger'">
                  {{ selectedDept.status === 1 ? '启用' : '停用' }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <el-card v-else class="empty-card">
          <el-empty description="请从左侧选择部门查看详情" />
        </el-card>
      </div>
    </div>

    <!-- 右侧边栏弹窗 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      direction="rtl"
      size="600px"
      :before-close="handleDrawerClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入部门名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入部门编码，如：DEPT-XXX"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="departmentTreeData"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            placeholder="请选择上级部门"
            clearable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="部门负责人" prop="leaderId">
          <el-select
            v-model="formData.leaderId"
            placeholder="请选择部门负责人"
            clearable
            filterable
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.name} - ${user.code}`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="编制人数" prop="headcount">
          <el-input
            v-model="formData.headcount"
            placeholder="请输入编制人数"
          />
        </el-form-item>

        <el-form-item label="成立时间" prop="establishDate">
          <el-date-picker
            v-model="formData.establishDate"
            type="date"
            placeholder="请选择成立时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="职能描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入职能描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序号" prop="sort">
          <el-input
            v-model="formData.sort"
            placeholder="请输入排序号"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <el-button @click="handleDrawerClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { Department } from '@/types/department'
import { getDepartmentTree, deleteDepartment, updateDepartmentStatus, addDepartment, updateDepartment, getDepartmentDetail } from '@/api/department'

defineOptions({ name: 'DepartmentManagement' })

// 部门树
const deptFilterText = ref('')
const treeRef = ref()
const departmentTree = ref<Department[]>([])
const selectedDept = ref<Department>()
const allDepartments = ref<Department[]>([])

// 抽屉相关
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'addChild' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<Department>>({
  name: '',
  code: '',
  parentId: null,
  leaderId: null,
  headcount: 1,
  establishDate: '',
  description: '',
  sort: 0,
  status: 1
})

// 部门树数据（用于上级部门选择）
const departmentTreeData = ref<Department[]>([])

// 用户列表（模拟数据）
const userList = ref([
  { id: 1, name: '张三', code: 'U001' },
  { id: 2, name: '李四', code: 'U002' },
  { id: 3, name: '王五', code: 'U003' },
  { id: 4, name: '赵六', code: 'U004' },
  { id: 5, name: '孙七', code: 'U005' },
  { id: 6, name: '周八', code: 'U006' },
  { id: 7, name: '吴九', code: 'U007' }
])

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  headcount: [{ required: true, message: '请输入编制人数', trigger: 'blur' }],
  establishDate: [{ required: true, message: '请选择成立时间', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 抽屉标题
const drawerTitle = computed(() => {
  if (drawerMode.value === 'add') return '新增根部门'
  if (drawerMode.value === 'addChild') return '新增子部门'
  return '编辑部门'
})

// 获取部门树
const fetchDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree({})
    if (res.code === 200) {
      departmentTree.value = res.data.list || []
      // 扁平化部门树，用于查找父部门名称
      flattenDepartments(departmentTree.value)
      // 默认选中第一个部门
      if (departmentTree.value.length > 0) {
        selectedDept.value = departmentTree.value[0]
      }
    }
  } catch (error) {
    console.error('获取部门树失败:', error)
    ElMessage.error('获取部门树失败')
  }
}

// 扁平化部门树
const flattenDepartments = (depts: Department[]) => {
  allDepartments.value = []
  const flatten = (list: Department[]) => {
    list.forEach(dept => {
      allDepartments.value.push(dept)
      if (dept.children && dept.children.length > 0) {
        flatten(dept.children)
      }
    })
  }
  flatten(depts)
}

// 获取父部门名称
const getParentName = (parentId: number) => {
  const parent = allDepartments.value.find(d => d.id === parentId)
  return parent?.name || '-'
}

// 部门节点点击
const handleDeptClick = (data: Department) => {
  selectedDept.value = data
}

// 树节点过滤
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

// 监听搜索文本变化
watch(deptFilterText, (val) => {
  treeRef.value?.filter(val)
})

// 编制人数百分比
const staffPercentage = computed(() => {
  if (!selectedDept.value) return 0
  const percentage = (selectedDept.value.currentCount / selectedDept.value.headcount) * 100
  return Math.min(percentage, 100)
})

// 编制人数进度条颜色
const staffProgressColor = computed(() => {
  const percentage = staffPercentage.value
  if (percentage < 80) return '#67c23a' // 绿色：正常
  if (percentage < 100) return '#e6a23c' // 橙色：接近满编
  return '#f56c6c' // 红色：超编
})

// 编制人数状态文本
const staffStatusText = computed(() => {
  if (!selectedDept.value) return ''
  const diff = selectedDept.value.headcount - selectedDept.value.currentCount
  if (diff > 0) return `缺编 ${diff} 人`
  if (diff < 0) return `超编 ${Math.abs(diff)} 人`
  return '满编'
})

// 编制人数状态样式类
const staffStatusClass = computed(() => {
  if (!selectedDept.value) return ''
  const diff = selectedDept.value.headcount - selectedDept.value.currentCount
  if (diff > 0) return 'status-lack'
  if (diff < 0) return 'status-over'
  return 'status-full'
})

// 新增根部门
const handleAddRoot = () => {
  drawerMode.value = 'add'
  resetForm()
  formData.parentId = null
  loadDepartmentTreeData()
  drawerVisible.value = true
}

// 新增子部门
const handleAddChild = () => {
  if (!selectedDept.value) return
  drawerMode.value = 'addChild'
  resetForm()
  formData.parentId = selectedDept.value.id
  loadDepartmentTreeData()
  drawerVisible.value = true
}

// 编辑部门
const handleEdit = async () => {
  if (!selectedDept.value) return
  drawerMode.value = 'edit'
  await loadDepartmentDetail(selectedDept.value.id)
  loadDepartmentTreeData(selectedDept.value.id)
  drawerVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    code: '',
    parentId: null,
    leaderId: null,
    headcount: 1,
    establishDate: '',
    description: '',
    sort: 0,
    status: 1
  })
  formRef.value?.clearValidate()
}

// 加载部门树数据（用于上级部门选择）
const loadDepartmentTreeData = async (excludeId?: number) => {
  try {
    const res = await getDepartmentTree({ status: 1 })
    let treeData = res.data.list || []

    // 如果是编辑模式，过滤掉自己和子部门
    if (excludeId) {
      treeData = filterDepartmentTree(treeData, excludeId)
    }

    departmentTreeData.value = treeData
  } catch (error) {
    console.error('加载部门树失败:', error)
  }
}

// 过滤部门树（移除指定部门及其子部门）
const filterDepartmentTree = (tree: Department[], excludeId: number): Department[] => {
  return tree
    .filter(item => item.id !== excludeId)
    .map(item => ({
      ...item,
      children: item.children ? filterDepartmentTree(item.children, excludeId) : undefined
    }))
}

// 加载部门详情
const loadDepartmentDetail = async (id: number) => {
  try {
    const res = await getDepartmentDetail(id)
    Object.assign(formData, res.data)
  } catch (error) {
    console.error('加载部门详情失败:', error)
    ElMessage.error('加载部门详情失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (drawerMode.value === 'edit') {
        await updateDepartment({ ...formData, id: selectedDept.value!.id })
        ElMessage.success('更新成功')
      } else {
        await addDepartment(formData)
        ElMessage.success('添加成功')
      }
      drawerVisible.value = false
      fetchDepartmentTree()
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error(drawerMode.value === 'edit' ? '更新失败' : '添加失败')
    }
  })
}

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
  resetForm()
}

// 删除部门
const handleDelete = async () => {
  if (!selectedDept.value) return

  // 检查是否有子部门
  if (selectedDept.value.children && selectedDept.value.children.length > 0) {
    ElMessage.warning('该部门下有子部门，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteDepartment(selectedDept.value.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      selectedDept.value = undefined
      fetchDepartmentTree()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除部门失败:', error)
      ElMessage.error('删除部门失败')
    }
  }
}

// 切换状态
const handleToggleStatus = async () => {
  if (!selectedDept.value) return

  const newStatus = selectedDept.value.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${statusText}该部门吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await updateDepartmentStatus(selectedDept.value.id, newStatus)
    if (res.code === 200) {
      ElMessage.success(`${statusText}成功`)
      selectedDept.value.status = newStatus
      fetchDepartmentTree()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error('更新状态失败')
    }
  }
}

// 初始化
onMounted(() => {
  fetchDepartmentTree()
})
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.split-layout {
  display: flex;
  gap: 16px;
  height: 100%;
  overflow: hidden;

  .left-card {
    width: 30%;
    min-width: 300px;
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .tree-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }

    .tree-search {
      margin-bottom: 12px;
    }

    .tree-container {
      flex: 1;
      overflow: auto;

      :deep(.el-tree-node__content) {
        height: 40px;

        &:hover {
          background-color: #f5f7fa;
        }
      }

      :deep(.el-tree-node.is-current > .el-tree-node__content) {
        background-color: #ecf5ff;
        color: var(--el-color-primary);
      }
    }
  }

  .right-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .detail-card,
    .empty-card {
      flex: 1;
      border: none !important;
      box-shadow: none !important;
      border-radius: 12px;
      overflow: hidden;

      :deep(.el-card__body) {
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    .detail-header {
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 20px;

      .dept-name {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
      }

      .header-buttons {
        display: flex;

        .el-button:not(:first-child) {
          margin-left: 12px;
        }
      }
    }

    .detail-content {
      flex: 1;
      overflow-y: auto;

      .info-row {
        display: flex;
        gap: 32px;
        margin-bottom: 20px;

        .info-item {
          flex: 1;
          display: flex;
          align-items: flex-start;

          &.full-width {
            flex: 1 1 100%;
          }

          .label {
            font-size: 14px;
            color: #909399;
            min-width: 80px;
            flex-shrink: 0;
          }

          .value {
            font-size: 14px;
            color: #303133;
            word-break: break-all;
          }

          .staff-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 16px;

            .staff-status {
              font-size: 14px;
              font-weight: 500;
              min-width: 80px;
              text-align: right;

              &.status-lack {
                color: #f56c6c;
              }

              &.status-over {
                color: #e6a23c;
              }

              &.status-full {
                color: #67c23a;
              }
            }
          }
        }
      }
    }
  }
}
</style>