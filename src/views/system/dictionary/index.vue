<template>
  <div class="page-container">
    <div class="split-layout">
      <!-- 左侧：字典分类树卡片 -->
      <el-card class="left-card">
        <div class="tree-header">
          <span class="tree-title">字典分类</span>
          <el-button type="primary" size="small" @click="handleAddCategory">
            新增分类
          </el-button>
        </div>
        <el-input
          v-model="categoryFilterText"
          placeholder="请输入分类名称"
          clearable
          class="tree-search"
        />
        <div class="tree-container">
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            :props="{ label: 'categoryName', children: 'children' }"
            :filter-node-method="filterNode"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleCategoryClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <span class="node-label">{{ node.label }}</span>
                <div class="node-actions">
                  <el-button
                    link
                    size="small"
                    @click.stop="handleEditCategory(data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click.stop="handleDeleteCategory(data)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </el-card>

      <!-- 右侧：字典项列表 -->
      <div class="right-content">
        <el-card v-if="selectedCategory" class="data-card">
          <div class="table-header">
            <div class="category-name">{{ selectedCategory.categoryName }}</div>
            <div class="header-buttons">
              <el-button type="primary" @click="handleAddItem">
                新增字典项
              </el-button>
            </div>
          </div>

          <div class="table-container">
            <el-table :data="itemList" height="100%">
              <el-table-column prop="dictLabel" label="字典标签" min-width="12%" />
              <el-table-column prop="dictValue" label="字典值" min-width="10%" />
              <el-table-column prop="sort" label="排序" min-width="8%" />
              <el-table-column label="状态" min-width="8%">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                    {{ row.status === 1 ? '启用' : '停用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="15%" show-overflow-tooltip />
              <el-table-column label="操作" min-width="15%" fixed="right">
                <template #default="{ row }">
                  <el-button link @click="handleEditItem(row)">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDeleteItem(row)">
                    删除
                  </el-button>
                  <el-button
                    v-if="row.status === 1"
                    link
                    type="warning"
                    @click="handleToggleItemStatus(row)"
                  >
                    停用
                  </el-button>
                  <el-button
                    v-else
                    link
                    type="success"
                    @click="handleToggleItemStatus(row)"
                  >
                    启用
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleQuery"
            @current-change="handleQuery"
          />
        </el-card>

        <el-card v-else class="empty-card">
          <el-empty description="请选择左侧字典分类" />
        </el-card>
      </div>
    </div>

    <!-- 分类编辑抽屉 -->
    <el-drawer
      v-model="categoryDrawerVisible"
      :title="categoryForm.id ? '编辑分类' : '新增分类'"
      size="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryForm.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="categoryCode">
          <el-input v-model="categoryForm.categoryCode" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="categoryForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="categoryDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCategorySubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 字典项编辑抽屉 -->
    <el-drawer
      v-model="itemDrawerVisible"
      :title="itemForm.id ? '编辑字典项' : '新增字典项'"
      size="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="itemFormRef"
        :model="itemForm"
        :rules="itemRules"
        label-width="100px"
      >
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="itemForm.dictLabel" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="itemForm.dictValue" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="itemForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="itemForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="itemForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="itemDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleItemSubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type ElTree } from 'element-plus'
import { dictCategoryApi, dictItemApi, getCategoryTree, getItemsByCategory } from '@/api/dictionary'
import type { DictCategory, DictItem, ListParams } from '@/types/system'

defineOptions({
  name: 'SystemDictionary'
})

// 分类树相关
const treeRef = ref<InstanceType<typeof ElTree>>()
const categoryFilterText = ref('')
const categoryTree = ref<DictCategory[]>([])
const selectedCategory = ref<DictCategory | null>(null)

// 字典项列表相关
const itemList = ref<DictItem[]>([])
const total = ref(0)
const queryParams = ref<ListParams>({
  page: 1,
  pageSize: 10
})

// 分类表单相关
const categoryDrawerVisible = ref(false)
const categoryFormRef = ref<FormInstance>()
const categoryForm = ref<Partial<DictCategory>>({
  categoryName: '',
  categoryCode: '',
  description: '',
  sort: 0,
  status: 1
})
const categoryRules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }]
}

// 字典项表单相关
const itemDrawerVisible = ref(false)
const itemFormRef = ref<FormInstance>()
const itemForm = ref<Partial<DictItem>>({
  dictLabel: '',
  dictValue: '',
  sort: 0,
  status: 1,
  remark: ''
})
const itemRules = {
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
}

// 加载分类树
const loadCategoryTree = async () => {
  try {
    const res = await getCategoryTree()
    categoryTree.value = res.data || []
  } catch (error) {
    ElMessage.error('加载分类树失败')
  }
}

// 过滤树节点
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.categoryName.includes(value)
}

// 监听搜索框变化
watch(categoryFilterText, (val) => {
  treeRef.value?.filter(val)
})

// 点击分类节点
const handleCategoryClick = (data: DictCategory) => {
  selectedCategory.value = data
  queryParams.value.page = 1
  loadItemList()
}

// 加载字典项列表
const loadItemList = async () => {
  if (!selectedCategory.value) return

  try {
    const res = await getItemsByCategory({
      categoryId: selectedCategory.value.id!,
      page: queryParams.value.page,
      pageSize: queryParams.value.pageSize
    })
    itemList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('加载字典项失败')
  }
}

// 查询
const handleQuery = () => {
  loadItemList()
}

// 新增分类
const handleAddCategory = () => {
  categoryForm.value = {
    categoryName: '',
    categoryCode: '',
    description: '',
    sort: 0,
    status: 1
  }
  categoryDrawerVisible.value = true
  nextTick(() => {
    categoryFormRef.value?.clearValidate()
  })
}

// 编辑分类
const handleEditCategory = (data: DictCategory) => {
  categoryForm.value = { ...data }
  categoryDrawerVisible.value = true
  nextTick(() => {
    categoryFormRef.value?.clearValidate()
  })
}

// 删除分类
const handleDeleteCategory = async (data: DictCategory) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      type: 'warning'
    })
    await dictCategoryApi.delete(data.id!)
    ElMessage.success('删除成功')
    loadCategoryTree()
    if (selectedCategory.value?.id === data.id) {
      selectedCategory.value = null
      itemList.value = []
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交分类表单
const handleCategorySubmit = async () => {
  try {
    await categoryFormRef.value?.validate()
    if (categoryForm.value.id) {
      await dictCategoryApi.update(categoryForm.value)
      ElMessage.success('更新成功')
    } else {
      await dictCategoryApi.add(categoryForm.value)
      ElMessage.success('添加成功')
    }
    categoryDrawerVisible.value = false
    loadCategoryTree()
  } catch (error) {
    console.error(error)
  }
}

// 新增字典项
const handleAddItem = () => {
  if (!selectedCategory.value) {
    ElMessage.warning('请先选择分类')
    return
  }
  itemForm.value = {
    categoryId: selectedCategory.value.id,
    dictLabel: '',
    dictValue: '',
    sort: 0,
    status: 1,
    remark: ''
  }
  itemDrawerVisible.value = true
  nextTick(() => {
    itemFormRef.value?.clearValidate()
  })
}

// 编辑字典项
const handleEditItem = (row: DictItem) => {
  itemForm.value = { ...row }
  itemDrawerVisible.value = true
  nextTick(() => {
    itemFormRef.value?.clearValidate()
  })
}

// 删除字典项
const handleDeleteItem = async (row: DictItem) => {
  try {
    await ElMessageBox.confirm('确定要删除该字典项吗？', '提示', {
      type: 'warning'
    })
    await dictItemApi.delete(row.id!)
    ElMessage.success('删除成功')
    loadItemList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 切换字典项状态
const handleToggleItemStatus = async (row: DictItem) => {
  try {
    await dictItemApi.update({
      id: row.id,
      status: row.status === 1 ? 0 : 1
    })
    ElMessage.success('状态更新成功')
    loadItemList()
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 提交字典项表单
const handleItemSubmit = async () => {
  try {
    await itemFormRef.value?.validate()
    if (itemForm.value.id) {
      await dictItemApi.update(itemForm.value)
      ElMessage.success('更新成功')
    } else {
      await dictItemApi.add(itemForm.value)
      ElMessage.success('添加成功')
    }
    itemDrawerVisible.value = false
    loadItemList()
  } catch (error) {
    console.error(error)
  }
}

// 初始化
loadCategoryTree()
</script>

<style scoped lang="scss">
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
}

// 左侧卡片
.left-card {
  width: 300px;
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tree-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .tree-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .tree-search {
    margin-bottom: 16px;
  }

  .tree-container {
    flex: 1;
    overflow: hidden;

    :deep(.el-tree) {
      height: 100%;
      overflow-y: auto;

      .el-tree-node__content {
        height: 40px;
        padding-right: 8px;

        &:hover {
          .node-actions {
            opacity: 1;
          }
        }
      }
    }
  }

  .tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;

    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-actions {
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      gap: 4px;
    }
  }
}

// 右侧内容
.right-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .category-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
    justify-content: flex-end;
  }
}

.empty-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.el-card__body) {
    padding: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 抽屉样式
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
