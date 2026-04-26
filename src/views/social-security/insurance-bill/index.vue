<template>
  <div class="insurance-bill-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="账单编号">
            <el-input v-model="queryParams.billNo" placeholder="请输入账单编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="年度">
            <el-select v-model="queryParams.year" placeholder="请选择年度" style="width: 150px" clearable>
              <el-option label="2024" :value="2024" />
              <el-option label="2025" :value="2025" />
              <el-option label="2026" :value="2026" />
              <el-option label="2027" :value="2027" />
            </el-select>
          </el-form-item>

          <el-form-item label="月份">
            <el-select v-model="queryParams.month" placeholder="请选择月份" style="width: 150px" clearable>
              <el-option label="1月" :value="1" />
              <el-option label="2月" :value="2" />
              <el-option label="3月" :value="3" />
              <el-option label="4月" :value="4" />
              <el-option label="5月" :value="5" />
              <el-option label="6月" :value="6" />
              <el-option label="7月" :value="7" />
              <el-option label="8月" :value="8" />
              <el-option label="9月" :value="9" />
              <el-option label="10月" :value="10" />
              <el-option label="11月" :value="11" />
              <el-option label="12月" :value="12" />
            </el-select>
          </el-form-item>

          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="未支付" :value="1" />
              <el-option label="已支付" :value="2" />
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
            新增账单
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button @click="handleExport">
            导出账单
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
          <el-table-column type="selection" min-width="5%" fixed="left" />
          <el-table-column prop="billNo" label="账单编号" min-width="12%" fixed="left" />
          <el-table-column label="年月" min-width="10%">
            <template #default="{ row }">
              {{ row.year }}年{{ row.month }}月
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" min-width="10%" />
          <el-table-column prop="employeeCount" label="参保人数" min-width="8%" />
          <el-table-column label="养老保险" min-width="14%">
            <template #default="{ row }">
              企业: {{ formatMoney(row.pensionCompany) }}<br>
              个人: {{ formatMoney(row.pensionPersonal) }}
            </template>
          </el-table-column>
          <el-table-column label="医疗保险" min-width="14%">
            <template #default="{ row }">
              企业: {{ formatMoney(row.medicalCompany) }}<br>
              个人: {{ formatMoney(row.medicalPersonal) }}
            </template>
          </el-table-column>
          <el-table-column label="失业保险" min-width="14%">
            <template #default="{ row }">
              企业: {{ formatMoney(row.unemploymentCompany) }}<br>
              个人: {{ formatMoney(row.unemploymentPersonal) }}
            </template>
          </el-table-column>
          <el-table-column label="工伤保险" min-width="10%">
            <template #default="{ row }">
              {{ formatMoney(row.injuryCompany) }}
            </template>
          </el-table-column>
          <el-table-column label="生育保险" min-width="10%">
            <template #default="{ row }">
              {{ formatMoney(row.maternityCompany) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalCompany" label="企业合计" min-width="10%">
            <template #default="{ row }">
              {{ formatMoney(row.totalCompany) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPersonal" label="个人合计" min-width="10%">
            <template #default="{ row }">
              {{ formatMoney(row.totalPersonal) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总计" min-width="10%">
            <template #default="{ row }">
              {{ formatMoney(row.totalAmount) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">未支付</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已支付</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="paymentDate" label="支付日期" min-width="10%" />
          <el-table-column label="操作" min-width="19%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button v-if="row.status === 1" link type="success" @click="handleMarkPaid(row)">
                标记已支付
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
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账单编号" prop="billNo">
              <el-input v-model="formData.billNo" placeholder="请输入账单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="city">
              <el-input v-model="formData.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-select v-model="formData.year" placeholder="请选择年度" style="width: 100%">
                <el-option label="2024" :value="2024" />
                <el-option label="2025" :value="2025" />
                <el-option label="2026" :value="2026" />
                <el-option label="2027" :value="2027" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月份" prop="month">
              <el-select v-model="formData.month" placeholder="请选择月份" style="width: 100%">
                <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参保人数" prop="employeeCount">
              <el-input v-model.number="formData.employeeCount" placeholder="请输入参保人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="未支付" :value="1" />
                <el-option label="已支付" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">养老保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业缴纳" prop="pensionCompany">
              <el-input v-model.number="formData.pensionCompany" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人缴纳" prop="pensionPersonal">
              <el-input v-model.number="formData.pensionPersonal" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">医疗保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业缴纳" prop="medicalCompany">
              <el-input v-model.number="formData.medicalCompany" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人缴纳" prop="medicalPersonal">
              <el-input v-model.number="formData.medicalPersonal" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">失业保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业缴纳" prop="unemploymentCompany">
              <el-input v-model.number="formData.unemploymentCompany" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人缴纳" prop="unemploymentPersonal">
              <el-input v-model.number="formData.unemploymentPersonal" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">其他保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工伤保险" prop="injuryCompany">
              <el-input v-model.number="formData.injuryCompany" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生育保险" prop="maternityCompany">
              <el-input v-model.number="formData.maternityCompany" placeholder="请输入金额" @input="calculateTotal" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">合计</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业合计">
              <el-input v-model="formData.totalCompany" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人合计">
              <el-input v-model="formData.totalPersonal" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总计">
              <el-input v-model="formData.totalAmount" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付日期" prop="paymentDate">
              <el-date-picker
                v-model="formData.paymentDate"
                type="date"
                placeholder="请选择支付日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="账单详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="账单编号">{{ detailData.billNo }}</el-descriptions-item>
        <el-descriptions-item label="年月">{{ detailData.year }}年{{ detailData.month }}月</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="参保人数">{{ detailData.employeeCount }}</el-descriptions-item>
        <el-descriptions-item label="养老保险-企业">{{ formatMoney(detailData.pensionCompany) }}</el-descriptions-item>
        <el-descriptions-item label="养老保险-个人">{{ formatMoney(detailData.pensionPersonal) }}</el-descriptions-item>
        <el-descriptions-item label="医疗保险-企业">{{ formatMoney(detailData.medicalCompany) }}</el-descriptions-item>
        <el-descriptions-item label="医疗保险-个人">{{ formatMoney(detailData.medicalPersonal) }}</el-descriptions-item>
        <el-descriptions-item label="失业保险-企业">{{ formatMoney(detailData.unemploymentCompany) }}</el-descriptions-item>
        <el-descriptions-item label="失业保险-个人">{{ formatMoney(detailData.unemploymentPersonal) }}</el-descriptions-item>
        <el-descriptions-item label="工伤保险">{{ formatMoney(detailData.injuryCompany) }}</el-descriptions-item>
        <el-descriptions-item label="生育保险">{{ formatMoney(detailData.maternityCompany) }}</el-descriptions-item>
        <el-descriptions-item label="企业合计">{{ formatMoney(detailData.totalCompany) }}</el-descriptions-item>
        <el-descriptions-item label="个人合计">{{ formatMoney(detailData.totalPersonal) }}</el-descriptions-item>
        <el-descriptions-item label="总计">{{ formatMoney(detailData.totalAmount) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">未支付</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已支付</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付日期">{{ detailData.paymentDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { InsuranceBill, InsuranceBillListParams } from '@/types/socialSecurity'
import {
  getInsuranceBillList,
  addInsuranceBill,
  updateInsuranceBill,
  removeInsuranceBill,
  batchDeleteInsuranceBill
} from '@/api/insuranceBill'

defineOptions({
  name: 'InsuranceBillList'
})

// 查询参数
const queryParams = reactive<InsuranceBillListParams>({
  billNo: '',
  year: null,
  month: null,
  city: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<InsuranceBill[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<InsuranceBill>>({
  billNo: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  city: '',
  employeeCount: 0,
  pensionCompany: 0,
  pensionPersonal: 0,
  medicalCompany: 0,
  medicalPersonal: 0,
  unemploymentCompany: 0,
  unemploymentPersonal: 0,
  injuryCompany: 0,
  maternityCompany: 0,
  totalCompany: 0,
  totalPersonal: 0,
  totalAmount: 0,
  status: 1,
  paymentDate: ''
})

// 表单验证规则
const formRules: FormRules = {
  billNo: [{ required: true, message: '请输入账单编号', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年度', trigger: 'change' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  employeeCount: [{ required: true, message: '请输入参保人数', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<InsuranceBill>>({})

// 获取列表数据
const getList = async () => {
  try {
    const res = await getInsuranceBillList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.billNo = ''
  queryParams.year = null
  queryParams.month = null
  queryParams.city = ''
  queryParams.status = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  getList()
}

const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}

// 表格选择
const handleSelectionChange = (selection: InsuranceBill[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增账单'
  Object.assign(formData, {
    billNo: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    city: '',
    employeeCount: 0,
    pensionCompany: 0,
    pensionPersonal: 0,
    medicalCompany: 0,
    medicalPersonal: 0,
    unemploymentCompany: 0,
    unemploymentPersonal: 0,
    injuryCompany: 0,
    maternityCompany: 0,
    totalCompany: 0,
    totalPersonal: 0,
    totalAmount: 0,
    status: 1,
    paymentDate: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: InsuranceBill) => {
  dialogTitle.value = '编辑账单'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: InsuranceBill) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: InsuranceBill) => {
  try {
    await ElMessageBox.confirm('确定要删除该账单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await removeInsuranceBill?.(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条账单吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await batchDeleteInsuranceBill?.(selectedIds.value)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 标记已支付
const handleMarkPaid = async (row: InsuranceBill) => {
  try {
    await ElMessageBox.confirm('确定要标记该账单为已支付吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    await updateInsuranceBill({
      ...row,
      status: 2,
      paymentDate: new Date().toISOString().split('T')[0]
    })
    ElMessage.success('标记成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('标记失败')
    }
  }
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 计算合计
const calculateTotal = () => {
  const pensionCompany = Number(formData.pensionCompany) || 0
  const pensionPersonal = Number(formData.pensionPersonal) || 0
  const medicalCompany = Number(formData.medicalCompany) || 0
  const medicalPersonal = Number(formData.medicalPersonal) || 0
  const unemploymentCompany = Number(formData.unemploymentCompany) || 0
  const unemploymentPersonal = Number(formData.unemploymentPersonal) || 0
  const injuryCompany = Number(formData.injuryCompany) || 0
  const maternityCompany = Number(formData.maternityCompany) || 0

  formData.totalCompany = pensionCompany + medicalCompany + unemploymentCompany + injuryCompany + maternityCompany
  formData.totalPersonal = pensionPersonal + medicalPersonal + unemploymentPersonal
  formData.totalAmount = formData.totalCompany + formData.totalPersonal
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateInsuranceBill(formData as InsuranceBill)
          ElMessage.success('更新成功')
        } else {
          await addInsuranceBill(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 格式化金额
const formatMoney = (value: number | undefined) => {
  if (value === undefined || value === null) return '0.00'
  return value.toFixed(2)
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.insurance-bill-container {
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
