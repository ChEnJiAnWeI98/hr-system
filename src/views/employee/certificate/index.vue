<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工工号">
            <el-input
              v-model="queryParams.employeeCode"
              placeholder="请输入员工工号"
              clearable
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="员工姓名">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="请输入员工姓名"
              clearable
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="所属部门">
            <el-tree-select
              v-model="queryParams.departmentId"
              :data="departmentTree"
              :props="{ label: 'name', children: 'children' }"
              placeholder="请选择部门"
              clearable
              check-strictly
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="证件类型">
            <el-select
              v-model="queryParams.certificateType"
              placeholder="请选择证件类型"
              clearable
              style="width: 150px"
            >
              <el-option label="身份证" :value="1" />
              <el-option label="劳动合同" :value="2" />
              <el-option label="资质证书" :value="3" />
              <el-option label="健康证" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="紧急程度">
            <el-select
              v-model="queryParams.urgencyLevel"
              placeholder="请选择紧急程度"
              clearable
              style="width: 120px"
            >
              <el-option label="正常" :value="1" />
              <el-option label="提醒" :value="2" />
              <el-option label="警告" :value="3" />
              <el-option label="紧急" :value="4" />
              <el-option label="已过期" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="提醒状态">
            <el-select
              v-model="queryParams.reminderStatus"
              placeholder="请选择提醒状态"
              clearable
              style="width: 120px"
            >
              <el-option label="待处理" :value="1" />
              <el-option label="已提醒" :value="2" />
              <el-option label="已更新" :value="3" />
              <el-option label="已忽略" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="到期日期">
            <el-date-picker
              v-model="expiryDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 220px"
            />
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
          <el-button type="primary" @click="handleBatchRemind">
            批量提醒
          </el-button>
          <el-button @click="handleExport">
            导出
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="100%"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="employeeCode" label="员工工号" min-width="8%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="8%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column prop="certificateTypeName" label="证件类型" min-width="8%" />
          <el-table-column prop="certificateNumber" label="证件号码" min-width="12%" />
          <el-table-column prop="expiryDate" label="到期日期" min-width="8%" />
          <el-table-column prop="remainingDays" label="距离到期" min-width="8%">
            <template #default="{ row }">
              <span :style="{ color: getUrgencyColor(row.urgencyLevel) }">
                {{ getRemainingDaysText(row.remainingDays, row.urgencyLevel) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="urgencyLevel" label="紧急程度" min-width="7%">
            <template #default="{ row }">
              <el-tag :type="getUrgencyType(row.urgencyLevel)">
                {{ row.urgencyLevelName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reminderStatus" label="提醒状态" min-width="7%">
            <template #default="{ row }">
              <el-tag :type="getReminderStatusType(row.reminderStatus)">
                {{ row.reminderStatusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reminderCount" label="提醒次数" min-width="7%" />
          <el-table-column prop="lastReminderTime" label="最后提醒时间" min-width="12%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleRemind(row)">
                提醒
              </el-button>
              <el-button link @click="handleUpdate(row)">
                更新证件
              </el-button>
              <el-button link type="primary" @click="handleViewDetail(row)">
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
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCertificateReminderList, updateCertificateReminderStatus, batchRemind, getCertificateStatistics } from '@/api/certificate'
import { getDepartmentTree } from '@/api/department'
import type { CertificateReminderListParams } from '@/types/certificate'

defineOptions({
  name: 'EmployeeCertificate'
})

const router = useRouter()

// 查询参数
const queryParams = reactive<CertificateReminderListParams>({
  employeeCode: '',
  employeeName: '',
  departmentId: null,
  certificateType: null,
  urgencyLevel: null,
  reminderStatus: null,
  expiryDateStart: '',
  expiryDateEnd: '',
  page: 1,
  pageSize: 10
})

// 到期日期范围
const expiryDateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 部门树
const departmentTree = ref<any[]>([])

// 获取紧急程度标签类型
const getUrgencyType = (urgencyLevel: number) => {
  const types: Record<number, any> = {
    1: 'success',  // 正常
    2: 'info',     // 提醒
    3: 'warning',  // 警告
    4: 'danger',   // 紧急
    5: 'info'      // 已过期
  }
  return types[urgencyLevel] || 'info'
}

// 获取紧急程度颜色
const getUrgencyColor = (urgencyLevel: number) => {
  const colors: Record<number, string> = {
    1: '#67C23A',  // 正常 - 绿色
    2: '#909399',  // 提醒 - 灰色
    3: '#E6A23C',  // 警告 - 橙色
    4: '#F56C6C',  // 紧急 - 红色
    5: '#909399'   // 已过期 - 灰色
  }
  return colors[urgencyLevel] || '#303133'
}

// 获取距离到期天数文本
const getRemainingDaysText = (days: number, urgencyLevel: number) => {
  if (urgencyLevel === 5) {
    return '已过期'
  }
  return `${days}天`
}

// 获取提醒状态标签类型
const getReminderStatusType = (status: number) => {
  const types: Record<number, any> = {
    1: 'warning',  // 待处理
    2: 'primary',  // 已提醒
    3: 'success',  // 已更新
    4: 'info'      // 已忽略
  }
  return types[status] || 'info'
}

// 加载部门树
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree()
    if (res.code === 200) {
      departmentTree.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载部门树失败:', error)
  }
}

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (expiryDateRange.value && expiryDateRange.value.length === 2) {
      queryParams.expiryDateStart = expiryDateRange.value[0]
      queryParams.expiryDateEnd = expiryDateRange.value[1]
    } else {
      queryParams.expiryDateStart = ''
      queryParams.expiryDateEnd = ''
    }

    const res = await getCertificateReminderList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载列表失败')
    console.error('加载列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadList()
}

// 重置
const handleReset = () => {
  queryParams.employeeCode = ''
  queryParams.employeeName = ''
  queryParams.departmentId = null
  queryParams.certificateType = null
  queryParams.urgencyLevel = null
  queryParams.reminderStatus = null
  expiryDateRange.value = null
  queryParams.expiryDateStart = ''
  queryParams.expiryDateEnd = ''
  queryParams.page = 1
  loadList()
}

// 提醒
const handleRemind = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要发送提醒吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const res = await batchRemind({ ids: [row.id], reminderMethod: [1] })
    if (res.code === 200) {
      ElMessage.success('提醒成功')
      loadList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('提醒失败')
      console.error('提醒失败:', error)
    }
  } finally {
    loading.value = false
  }
}

// 批量提醒
const handleBatchRemind = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要提醒的记录')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要批量提醒选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const res = await batchRemind({ ids: selectedIds.value, reminderMethod: [1] })
    if (res.code === 200) {
      ElMessage.success('批量提醒成功')
      loadList()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量提醒失败')
      console.error('批量提醒失败:', error)
    }
  } finally {
    loading.value = false
  }
}

// 更新证件
const handleUpdate = (row: any) => {
  router.push(`/employee/certificate/edit/${row.id}`)
}

// 查看详情
const handleViewDetail = (row: any) => {
  router.push(`/employee/certificate/detail/${row.id}`)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 初始化
onMounted(() => {
  loadDepartmentTree()
  loadList()
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
