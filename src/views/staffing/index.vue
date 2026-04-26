<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="年度">
            <el-select
              v-model="queryParams.year"
              placeholder="请选择年度"
              clearable
              style="width: 150px"
            >
              <el-option label="2024年" :value="2024" />
              <el-option label="2025年" :value="2025" />
              <el-option label="2026年" :value="2026" />
            </el-select>
          </el-form-item>

          <el-form-item label="部门">
            <el-select
              v-model="queryParams.departmentId"
              placeholder="请选择部门"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="编制状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择编制状态"
              clearable
              style="width: 150px"
            >
              <el-option label="正常" :value="0" />
              <el-option label="缺编" :value="1" />
              <el-option label="超编" :value="2" />
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

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">总编制人数</div>
          <div class="stat-value">{{ statistics.totalHeadcount }}</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">在编人数</div>
          <div class="stat-value stat-current">{{ statistics.totalCurrentCount }}</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">缺编人数</div>
          <div class="stat-value stat-lack">{{ statistics.totalShortage }}</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">超编人数</div>
          <div class="stat-value stat-over">{{ statistics.totalOverstaffing }}</div>
        </div>
      </el-card>
    </div>

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增编制计划
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出编制报表
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="year" label="年度" min-width="10%" align="center" />
          <el-table-column prop="departmentName" label="部门名称" min-width="20%" />
          <el-table-column prop="headcount" label="编制人数" min-width="12%" align="center" />
          <el-table-column prop="currentCount" label="在编人数" min-width="12%" align="center" />
          <el-table-column label="缺编人数" min-width="12%" align="center">
            <template #default="{ row }">
              <span :class="{ 'text-warning': row.shortage > 0 }">
                {{ row.shortage }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="超编人数" min-width="12%" align="center">
            <template #default="{ row }">
              <span :class="{ 'text-danger': row.overstaffing > 0 }">
                {{ row.overstaffing }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="编制状态" min-width="10%" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="success">正常</el-tag>
              <el-tag v-else-if="row.status === 1" type="warning">缺编</el-tag>
              <el-tag v-else-if="row.status === 2" type="danger">超编</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right" align="center">
            <template #default="{ row }">
              <el-button
                link
                @click="handleEdit(row)"
                :disabled="row.year < 2026"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(row)"
                :disabled="row.year < 2026"
              >
                删除
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 新增/编辑编制对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="年度" prop="year">
          <el-select
            v-model="formData.year"
            placeholder="请选择年度"
            style="width: 100%"
            :disabled="!isAdd"
          >
            <el-option label="2024年" :value="2024" />
            <el-option label="2025年" :value="2025" />
            <el-option label="2026年" :value="2026" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="departmentId">
          <el-select
            v-model="formData.departmentId"
            placeholder="请选择部门"
            style="width: 100%"
            :disabled="!isAdd"
            @change="handleDepartmentChange"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="编制人数" prop="headcount">
          <el-input
            v-model.number="formData.headcount"
            placeholder="请输入编制人数"
            :disabled="!isAdd && !!formData.year && formData.year < 2026"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            :disabled="!isAdd && !!formData.year && formData.year < 2026"
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
import { Plus, Download } from '@element-plus/icons-vue'
import {
  getStaffingList,
  addStaffing,
  updateStaffing,
  deleteStaffing,
  getStaffingStatistics
} from '@/api/staffing'
import { getDepartmentTree } from '@/api/department'
import type { Staffing, StaffingQueryParams } from '@/types/staffing'
import type { Department } from '@/types/department'
import * as XLSX from 'xlsx'

defineOptions({
  name: 'StaffingManagement'
})

// 查询参数
const queryParams = reactive<StaffingQueryParams>({
  year: 2026,
  departmentId: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 部门列表
const departmentList = ref<Department[]>([])

// 表格数据
const tableData = ref<Staffing[]>([])
const total = ref(0)

// 统计数据
const statistics = reactive({
  totalHeadcount: 0,
  totalCurrentCount: 0,
  totalShortage: 0,
  totalOverstaffing: 0,
  normalCount: 0,
  shortageCount: 0,
  overstaffingCount: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isAdd = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<Partial<Staffing>>({
  id: undefined,
  year: undefined,
  departmentId: undefined,
  departmentName: '',
  headcount: undefined,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  year: [{ required: true, message: '请选择年度', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  headcount: [
    { required: true, message: '请输入编制人数', trigger: 'blur' },
    { type: 'number', min: 0, message: '编制人数不能小于0', trigger: 'blur' }
  ]
}

/**
 * 加载部门列表
 */
const loadDepartmentList = async () => {
  try {
    const res = await getDepartmentTree({})
    if (res.code === 200) {
      // 将树形结构扁平化
      const flattenDepartments = (depts: Department[]): Department[] => {
        const result: Department[] = []
        const traverse = (items: Department[]) => {
          items.forEach(item => {
            result.push(item)
            if (item.children && item.children.length > 0) {
              traverse(item.children)
            }
          })
        }
        traverse(depts)
        return result
      }
      departmentList.value = flattenDepartments(res.data.list || [])
    }
  } catch (error) {
    console.error('加载部门列表失败:', error)
  }
}

/**
 * 加载编制列表
 */
const loadStaffingList = async () => {
  try {
    const res = await getStaffingList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载编制列表失败')
  }
}

/**
 * 加载统计信息
 */
const loadStatistics = async () => {
  try {
    const res = await getStaffingStatistics({
      year: queryParams.year,
      departmentId: queryParams.departmentId,
      status: queryParams.status
    })
    if (res.code === 200) {
      Object.assign(statistics, res.data)
    }
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  loadStaffingList()
  loadStatistics()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.year = 2026
  queryParams.departmentId = null
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  loadStaffingList()
  loadStatistics()
}

/**
 * 新增
 */
const handleAdd = () => {
  dialogTitle.value = '新增编制计划'
  isAdd.value = true
  dialogVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: Staffing) => {
  dialogTitle.value = '编辑编制'
  isAdd.value = false
  Object.assign(formData, {
    id: row.id,
    year: row.year,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    headcount: row.headcount,
    remark: row.remark
  })
  dialogVisible.value = true
}

/**
 * 删除
 */
const handleDelete = async (row: Staffing) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${row.year}年 ${row.departmentName} 的编制计划吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteStaffing(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadStaffingList()
      loadStatistics()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

/**
 * 部门选择变化
 */
const handleDepartmentChange = (value: number) => {
  const dept = departmentList.value.find(d => d.id === value)
  if (dept) {
    formData.departmentName = dept.name
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 历史数据只读校验
    if (!isAdd.value && formData.year && formData.year < 2026) {
      ElMessage.warning('历史年度数据不可编辑')
      return
    }

    const data = {
      ...formData,
      headcount: Number(formData.headcount)
    }

    const res = isAdd.value
      ? await addStaffing(data)
      : await updateStaffing(data as Staffing)

    if (res.code === 200) {
      ElMessage.success(isAdd.value ? '新增成功' : '更新成功')
      dialogVisible.value = false
      loadStaffingList()
      loadStatistics()
    }
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      console.error('表单验证失败:', error)
    }
  }
}

/**
 * 对话框关闭
 */
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: undefined,
    year: undefined,
    departmentId: undefined,
    departmentName: '',
    headcount: undefined,
    remark: ''
  })
}

/**
 * 导出编制报表
 */
const handleExport = async () => {
  try {
    // 获取当前筛选条件下的所有数据（不分页）
    const exportParams = {
      ...queryParams,
      page: 1,
      pageSize: 9999
    }

    const res = await getStaffingList(exportParams)
    if (res.code !== 200 || !res.data.list || res.data.list.length === 0) {
      ElMessage.warning('暂无数据可导出')
      return
    }

    // 准备导出数据
    const exportData = res.data.list.map((item: Staffing) => ({
      '年度': item.year,
      '部门名称': item.departmentName,
      '计划编制人数': item.headcount,
      '在编人数': item.currentCount,
      '缺编人数': item.shortage,
      '超编人数': item.overstaffing,
      '编制状态': item.status === 0 ? '正常' : item.status === 1 ? '缺编' : '超编',
      '备注说明': item.remark || '',
      '创建时间': item.createTime || ''
    }))

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '编制管理报表')

    // 设置列宽
    worksheet['!cols'] = [
      { wch: 8 },  // 年度
      { wch: 20 }, // 部门名称
      { wch: 15 }, // 计划编制人数
      { wch: 12 }, // 在编人数
      { wch: 12 }, // 缺编人数
      { wch: 12 }, // 超编人数
      { wch: 12 }, // 编制状态
      { wch: 30 }, // 备注说明
      { wch: 20 }  // 创建时间
    ]

    // 生成文件名
    const now = new Date()
    const fileName = `编制管理报表_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.xlsx`

    // 导出文件
    XLSX.writeFile(workbook, fileName)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 初始化
onMounted(() => {
  loadDepartmentList()
  loadStaffingList()
  loadStatistics()
})
</script>

<style scoped lang="scss">
.page-container {
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

.stats-container {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .stat-content {
      text-align: center;

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 12px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;

        &.stat-current {
          color: #409eff;
        }

        &.stat-lack {
          color: #e6a23c;
        }

        &.stat-over {
          color: #f56c6c;
        }
      }
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
    display: flex;
    gap: 12px;
  }

  .table-container {
    flex: 1;
    overflow: hidden;

    .text-warning {
      color: #e6a23c;
      font-weight: 500;
    }

    .text-danger {
      color: #f56c6c;
      font-weight: 500;
    }
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>
