<template>
  <div class="payslip-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="工资月份">
            <el-date-picker
              v-model="queryParams.salaryMonth"
              type="month"
              placeholder="请选择工资月份"
              value-format="YYYY-MM"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item label="发放状态">
            <el-select v-model="queryParams.payslipStatus" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="未发放" :value="1" />
              <el-option label="已发放" :value="2" />
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
          <el-button type="primary" @click="handleSendPayslip">
            <el-icon><Promotion /></el-icon>
            发放工资条
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出工资条
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="employeeName" label="员工姓名" min-width="12%" />
          <el-table-column prop="employeeNo" label="员工工号" min-width="12%" />
          <el-table-column prop="departmentName" label="部门" min-width="12%" />
          <el-table-column prop="salaryMonth" label="工资月份" min-width="10%" />
          <el-table-column prop="grossSalary" label="应发工资" min-width="12%" align="right">
            <template #default="{ row }">
              {{ row.grossSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="netSalary" label="实发工资" min-width="12%" align="right">
            <template #default="{ row }">
              {{ row.netSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="payslipStatus" label="发放状态" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.payslipStatus === 1" type="info">未发放</el-tag>
              <el-tag v-else-if="row.payslipStatus === 2" type="success">已发放</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime" label="发放时间" min-width="12%" />
          <el-table-column label="操作" min-width="8%" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">
                查看工资条
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

    <!-- 工资条详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工资条详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <div v-if="currentRecord" class="payslip-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工姓名">{{ currentRecord.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="员工工号">{{ currentRecord.employeeNo }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ currentRecord.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="工资月份">{{ currentRecord.salaryMonth }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">收入项目</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="基本工资">{{ currentRecord.basicSalary.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="绩效工资">{{ currentRecord.performanceSalary.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="岗位津贴">{{ currentRecord.positionAllowance.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="加班费">{{ currentRecord.overtimePay.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="其他收入">{{ currentRecord.otherIncome.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">扣款项目</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="社保个人缴纳">{{ currentRecord.socialSecurityPersonal.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="公积金个人缴纳">{{ currentRecord.housingFundPersonal.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="个税">{{ currentRecord.tax.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="其他扣款">{{ currentRecord.otherDeduction.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">工资汇总</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应发工资">
            <span style="color: #67c23a; font-weight: bold; font-size: 16px">
              {{ currentRecord.grossSalary.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="实发工资">
            <span style="color: #409eff; font-weight: bold; font-size: 16px">
              {{ currentRecord.netSalary.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="发放状态">
            <el-tag v-if="currentRecord.payslipStatus === 1" type="info">未发放</el-tag>
            <el-tag v-else-if="currentRecord.payslipStatus === 2" type="success">已发放</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发放时间">{{ currentRecord.sendTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 发放工资条弹窗 -->
    <el-dialog
      v-model="sendDialogVisible"
      title="发放工资条"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="sendForm" :rules="sendRules" ref="sendFormRef" label-width="100px">
        <el-form-item label="工资月份" prop="salaryMonth">
          <el-date-picker
            v-model="sendForm.salaryMonth"
            type="month"
            placeholder="请选择工资月份"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="发放方式" prop="sendMethod">
          <el-checkbox-group v-model="sendForm.sendMethod">
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="wechat">企业微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="发放范围" prop="sendScope">
          <el-radio-group v-model="sendForm.sendScope">
            <el-radio label="all">全部员工</el-radio>
            <el-radio label="department">指定部门</el-radio>
            <el-radio label="employee">指定员工</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="sendForm.sendScope === 'department'" label="选择部门" prop="departmentIds">
          <el-select v-model="sendForm.departmentIds" multiple placeholder="请选择部门" style="width: 100%">
            <el-option label="技术部" :value="1" />
            <el-option label="产品部" :value="2" />
            <el-option label="市场部" :value="3" />
            <el-option label="人事部" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="sendForm.sendScope === 'employee'" label="选择员工" prop="employeeIds">
          <el-select v-model="sendForm.employeeIds" multiple placeholder="请选择员工" style="width: 100%">
            <el-option label="张三" :value="1" />
            <el-option label="李四" :value="2" />
            <el-option label="王五" :value="3" />
            <el-option label="赵六" :value="4" />
            <el-option label="孙七" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="sendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmSend" :loading="sendLoading">确定发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Promotion, Download } from '@element-plus/icons-vue'
import { getSalaryRecordList, getSalaryRecordDetail, sendPayslip, exportPayslip } from '@/api/salary'
import type { SalaryRecord, SalaryRecordListParams } from '@/types/salary'

defineOptions({
  name: 'PayslipTab'
})

// 查询参数
const queryParams = reactive<SalaryRecordListParams>({
  employeeName: '',
  salaryMonth: '',
  payslipStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<SalaryRecord[]>([])
const total = ref(0)
const loading = ref(false)

// 详情弹窗
const detailDialogVisible = ref(false)
const currentRecord = ref<SalaryRecord | null>(null)

// 发放工资条弹窗
const sendDialogVisible = ref(false)
const sendFormRef = ref<FormInstance>()
const sendLoading = ref(false)
const sendForm = reactive({
  salaryMonth: '',
  sendMethod: [] as string[],
  sendScope: 'all',
  departmentIds: [] as number[],
  employeeIds: [] as number[]
})

const sendRules: FormRules = {
  salaryMonth: [{ required: true, message: '请选择工资月份', trigger: 'change' }],
  sendMethod: [{ required: true, message: '请选择发放方式', trigger: 'change' }],
  sendScope: [{ required: true, message: '请选择发放范围', trigger: 'change' }],
  departmentIds: [{ required: true, message: '请选择部门', trigger: 'change' }],
  employeeIds: [{ required: true, message: '请选择员工', trigger: 'change' }]
}

/**
 * 获取列表数据
 */
const getList = async () => {
  loading.value = true
  try {
    const res = await getSalaryRecordList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取工资记录列表失败:', error)
    ElMessage.error('获取工资记录列表失败')
  } finally {
    loading.value = false
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
  queryParams.employeeName = ''
  queryParams.salaryMonth = ''
  queryParams.payslipStatus = null
  queryParams.page = 1
  getList()
}

/**
 * 分页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
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
 * 查看工资条
 */
const handleView = async (row: SalaryRecord) => {
  try {
    const res = await getSalaryRecordDetail(row.id)
    if (res.code === 200) {
      currentRecord.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取工资记录详情失败:', error)
    ElMessage.error('获取工资记录详情失败')
  }
}

/**
 * 发放工资条
 */
const handleSendPayslip = () => {
  sendForm.salaryMonth = ''
  sendForm.sendMethod = []
  sendForm.sendScope = 'all'
  sendForm.departmentIds = []
  sendForm.employeeIds = []
  sendDialogVisible.value = true
}

/**
 * 确认发放
 */
const handleConfirmSend = async () => {
  if (!sendFormRef.value) return

  await sendFormRef.value.validate(async (valid) => {
    if (valid) {
      sendLoading.value = true
      try {
        const res = await sendPayslip(sendForm)
        if (res.code === 200) {
          ElMessage.success(`发放成功，共发放 ${res.data.count} 条工资条`)
          sendDialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('发放工资条失败:', error)
        ElMessage.error('发放工资条失败')
      } finally {
        sendLoading.value = false
      }
    }
  })
}

/**
 * 导出工资条
 */
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确定要导出工资条吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await exportPayslip(queryParams)
    if (res.code === 200) {
      ElMessage.success('导出成功')
      // 这里可以添加实际的导出逻辑，比如下载Excel文件
      console.log('导出数据:', res.data)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导出工资条失败:', error)
      ElMessage.error('导出工资条失败')
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.payslip-tab {
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

.payslip-detail {
  .el-divider {
    margin: 20px 0 16px;
  }
}
</style>
