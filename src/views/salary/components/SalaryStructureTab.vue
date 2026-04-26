<template>
  <div class="salary-structure-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="结构名称">
            <el-input v-model="queryParams.structureName" placeholder="请输入结构名称" style="width: 250px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                搜索
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增结构
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="structureName" label="结构名称" min-width="25%" />
          <el-table-column prop="applicableScope" label="适用范围" min-width="25%" />
          <el-table-column prop="status" label="状态" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">启用</el-tag>
              <el-tag v-else type="info">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="15%" />
          <el-table-column label="操作" min-width="20%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="primary" @click="handleToggleStatus(row)">
                {{ row.status === 1 ? '停用' : '启用' }}
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="结构名称" prop="structureName">
          <el-input v-model="formData.structureName" placeholder="请输入结构名称" />
        </el-form-item>

        <el-form-item label="适用范围" prop="applicableScope">
          <el-input v-model="formData.applicableScope" placeholder="请输入适用范围" />
        </el-form-item>

        <el-form-item label="薪酬项目配置" prop="salaryItems">
          <div class="salary-items-container">
            <el-button type="primary" size="small" @click="handleAddItem" style="margin-bottom: 12px">
              <el-icon><Plus /></el-icon>
              添加项目
            </el-button>
            <el-table :data="formData.salaryItems" style="width: 100%">
              <el-table-column label="项目名称" min-width="12%">
                <template #default="{ row, $index }">
                  <el-input v-model="row.name" placeholder="请输入项目名称" />
                </template>
              </el-table-column>
              <el-table-column label="项目类型" min-width="10%">
                <template #default="{ row, $index }">
                  <el-select v-model="row.type" placeholder="请选择">
                    <el-option label="收入" :value="1" />
                    <el-option label="扣款" :value="2" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="计算方式" min-width="9%">
                <template #default="{ row, $index }">
                  <el-select v-model="row.calcMethod" placeholder="请选择">
                    <el-option label="固定金额" :value="1" />
                    <el-option label="公式计算" :value="2" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="参与个税" min-width="8%">
                <template #default="{ row, $index }">
                  <el-switch v-model="row.includeTax" />
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="6%" fixed="right">
                <template #default="{ row, $index }">
                  <el-button link type="danger" @click="handleRemoveItem($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="计算公式" prop="formula">
          <el-input
            v-model="formData.formula"
            type="textarea"
            :rows="4"
            placeholder="请输入计算公式，例如：实发工资 = 基本工资 + 绩效工资 - 社保 - 个税"
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
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { SalaryStructure, SalaryStructureListParams, SalaryItem } from '@/types/salary'
import {
  getSalaryStructureList,
  addSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,
  batchDeleteSalaryStructures
} from '@/api/salaryStructure'

defineOptions({
  name: 'SalaryStructureTab'
})

// 查询参数
const queryParams = reactive<SalaryStructureListParams>({
  structureName: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<SalaryStructure[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增薪资结构')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<SalaryStructure>>({
  structureName: '',
  salaryItems: [],
  formula: '',
  applicableScope: '',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  structureName: [
    { required: true, message: '请输入结构名称', trigger: 'blur' }
  ],
  applicableScope: [
    { required: true, message: '请输入适用范围', trigger: 'blur' }
  ],
  formula: [
    { required: true, message: '请输入计算公式', trigger: 'blur' }
  ],
  salaryItems: [
    { required: true, message: '请至少添加一个薪酬项目', trigger: 'change' }
  ]
}

/**
 * 获取列表数据
 */
const getList = async () => {
  try {
    const res = await getSalaryStructureList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取薪资结构列表失败:', error)
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.structureName = ''
  queryParams.status = null
  queryParams.page = 1
  getList()
}

/**
 * 分页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  getList()
}

/**
 * 当前页改变
 */
const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}

/**
 * 表格选择改变
 */
const handleSelectionChange = (selection: SalaryStructure[]) => {
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 新增
 */
const handleAdd = () => {
  dialogTitle.value = '新增薪资结构'
  resetForm()
  dialogVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: SalaryStructure) => {
  dialogTitle.value = '编辑薪资结构'
  Object.assign(formData, {
    id: row.id,
    structureName: row.structureName,
    salaryItems: JSON.parse(JSON.stringify(row.salaryItems)),
    formula: row.formula,
    applicableScope: row.applicableScope,
    status: row.status
  })
  dialogVisible.value = true
}

/**
 * 删除
 */
const handleDelete = async (row: SalaryStructure) => {
  try {
    await ElMessageBox.confirm('确定要删除该薪资结构吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteSalaryStructure(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getList()
    }
  } catch (error) {
    console.log('取消删除')
  }
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await batchDeleteSalaryStructures(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('批量删除成功')
      getList()
    }
  } catch (error) {
    console.log('取消删除')
  }
}

/**
 * 切换状态
 */
const handleToggleStatus = async (row: SalaryStructure) => {
  const newStatus = row.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${statusText}该薪资结构吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await updateSalaryStructure({
      id: row.id,
      status: newStatus
    })

    if (res.code === 200) {
      ElMessage.success(`${statusText}成功`)
      getList()
    }
  } catch (error) {
    console.log('取消操作')
  }
}

/**
 * 添加薪酬项目
 */
const handleAddItem = () => {
  if (!formData.salaryItems) {
    formData.salaryItems = []
  }
  formData.salaryItems.push({
    name: '',
    type: 1,
    calcMethod: 1,
    includeTax: true
  })
}

/**
 * 删除薪酬项目
 */
const handleRemoveItem = (index: number) => {
  formData.salaryItems?.splice(index, 1)
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          ...formData,
          salaryItems: formData.salaryItems || []
        }

        const res = formData.id
          ? await updateSalaryStructure(data)
          : await addSalaryStructure(data)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '添加成功')
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    structureName: '',
    salaryItems: [],
    formula: '',
    applicableScope: '',
    status: 1
  })
  formRef.value?.clearValidate()
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.salary-structure-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .filter-form-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .filter-buttons {
    display: flex;

    .el-button:not(:first-child) {
      margin-left: 12px;
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

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;

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
  }
}

.salary-items-container {
  width: 100%;

  :deep(.el-table) {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  .el-button:not(:first-child) {
    margin-left: 12px;
  }
}
</style>
