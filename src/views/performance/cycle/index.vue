<template>
  <div class="performance-cycle-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="周期名称">
            <el-input v-model="queryParams.cycleName" placeholder="请输入周期名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="周期类型">
            <el-select v-model="queryParams.cycleType" placeholder="请选择周期类型" style="width: 150px" clearable>
              <el-option label="年度" :value="1" />
              <el-option label="半年度" :value="2" />
              <el-option label="季度" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="未开始" :value="1" />
              <el-option label="进行中" :value="2" />
              <el-option label="已结束" :value="3" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增周期
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
          <el-table-column prop="cycleName" label="周期名称" min-width="20%" />
          <el-table-column prop="cycleType" label="周期类型" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.cycleType === 1" type="success">年度</el-tag>
              <el-tag v-else-if="row.cycleType === 2" type="primary">半年度</el-tag>
              <el-tag v-else-if="row.cycleType === 3" type="warning">季度</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始日期" min-width="12%" />
          <el-table-column prop="endDate" label="结束日期" min-width="12%" />
          <el-table-column prop="status" label="状态" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="info">未开始</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">进行中</el-tag>
              <el-tag v-else-if="row.status === 3">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="13%" />
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="primary" @click="handleView(row)">
                查看详情
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="周期名称" prop="cycleName">
          <el-input v-model="formData.cycleName" placeholder="请输入周期名称" />
        </el-form-item>

        <el-form-item label="周期类型" prop="cycleType">
          <el-radio-group v-model="formData.cycleType">
            <el-radio :value="1">年度</el-radio>
            <el-radio :value="2">半年度</el-radio>
            <el-radio :value="3">季度</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="日期范围" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getList, addItem, updateItem, deleteItem, batchDeleteItems } from '@/api/performanceCycle'
import type { PerformanceCycle, PerformanceCycleListParams } from '@/types/performance'

defineOptions({
  name: 'PerformanceCycle'
})

// 查询参数
const queryParams = reactive<PerformanceCycleListParams>({
  cycleName: '',
  cycleType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PerformanceCycle[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增周期')
const formRef = ref<FormInstance>()
const dateRange = ref<[string, string]>(['', ''])

// 表单数据
const formData = reactive<Partial<PerformanceCycle>>({
  id: undefined,
  cycleName: '',
  cycleType: 1,
  startDate: '',
  endDate: '',
  remark: '',
  participantCount: 0
})

// 表单验证规则
const formRules: FormRules = {
  cycleName: [
    { required: true, message: '请输入周期名称', trigger: 'blur' }
  ],
  cycleType: [
    { required: true, message: '请选择周期类型', trigger: 'change' }
  ],
  dateRange: [
    { required: true, message: '请选择日期范围', trigger: 'change' }
  ]
}

// 获取列表数据
const fetchData = async () => {
  try {
    const res = await getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.cycleName = ''
  queryParams.cycleType = null
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  fetchData()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.page = page
  fetchData()
}

// 表格选择改变
const handleSelectionChange = (selection: PerformanceCycle[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增周期'
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row: PerformanceCycle) => {
  dialogTitle.value = '编辑周期'
  dialogVisible.value = true
  Object.assign(formData, row)
  dateRange.value = [row.startDate, row.endDate]
}

// 删除
const handleDelete = async (row: PerformanceCycle) => {
  try {
    await ElMessageBox.confirm('确定要删除该周期吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteItem(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await batchDeleteItems(selectedIds.value)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      selectedIds.value = []
      fetchData()
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 查看详情
const handleView = (row: PerformanceCycle) => {
  ElMessage.info('查看详情功能待开发')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 设置日期范围
        if (dateRange.value && dateRange.value.length === 2) {
          formData.startDate = dateRange.value[0]
          formData.endDate = dateRange.value[1]
        }

        const res = formData.id
          ? await updateItem(formData as PerformanceCycle)
          : await addItem(formData)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '添加成功')
          dialogVisible.value = false
          fetchData()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '添加失败')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.id = undefined
  formData.cycleName = ''
  formData.cycleType = 1
  formData.startDate = ''
  formData.endDate = ''
  formData.remark = ''
  formData.participantCount = 0
  dateRange.value = ['', '']
  formRef.value?.clearValidate()
}

// 弹窗关闭
const handleDialogClose = () => {
  resetForm()
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.performance-cycle-container {
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

.action-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .header-buttons {
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
    justify-content: flex-end;
  }
}
</style>
