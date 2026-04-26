<template>
  <div class="payment-record-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="缴纳记录编号">
            <el-input v-model="queryParams.recordNo" placeholder="请输入缴纳记录编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="缴纳月份">
            <el-date-picker
              v-model="queryParams.yearMonth"
              type="month"
              placeholder="请选择缴纳月份"
              style="width: 200px"
              clearable
              format="YYYY-MM"
              value-format="YYYY-MM"
            />
          </el-form-item>

          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="缴纳状态">
            <el-select v-model="queryParams.paymentStatus" placeholder="请选择缴纳状态" style="width: 150px" clearable>
              <el-option label="待缴纳" :value="1" />
              <el-option label="已缴纳" :value="2" />
              <el-option label="缴纳失败" :value="3" />
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
            新增缴纳记录
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
          <el-table-column type="selection" min-width="5%" fixed="left" />
          <el-table-column prop="recordNo" label="缴纳记录编号" min-width="12%" />
          <el-table-column prop="yearMonth" label="缴纳月份" min-width="10%" />
          <el-table-column prop="city" label="城市" min-width="8%" />
          <el-table-column prop="employeeCount" label="参保人数" min-width="8%" />
          <el-table-column prop="pensionAmount" label="养老保险" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.pensionAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="medicalAmount" label="医疗保险" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.medicalAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="unemploymentAmount" label="失业保险" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.unemploymentAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="injuryAmount" label="工伤保险" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.injuryAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="maternityAmount" label="生育保险" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.maternityAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="providentFundAmount" label="公积金" min-width="10%">
            <template #default="{ row }">
              ¥{{ row.providentFundAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总金额" min-width="12%">
            <template #default="{ row }">
              <span style="color: #f56c6c; font-weight: bold;">
                ¥{{ row.totalAmount.toLocaleString() }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentDate" label="缴纳日期" min-width="10%" />
          <el-table-column prop="paymentStatus" label="缴纳状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.paymentStatus === 1" type="warning">待缴纳</el-tag>
              <el-tag v-else-if="row.paymentStatus === 2" type="success">已缴纳</el-tag>
              <el-tag v-else-if="row.paymentStatus === 3" type="danger">缴纳失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleViewDetail(row)">
                查看明细
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
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

    <!-- 编辑对话框 -->
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缴纳记录编号" prop="recordNo">
              <el-input v-model="formData.recordNo" placeholder="请输入缴纳记录编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴纳月份" prop="yearMonth">
              <el-date-picker
                v-model="formData.yearMonth"
                type="month"
                placeholder="请选择缴纳月份"
                style="width: 100%"
                format="YYYY-MM"
                value-format="YYYY-MM"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="城市" prop="city">
              <el-input v-model="formData.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参保人数" prop="employeeCount">
              <el-input v-model="formData.employeeCount" placeholder="请输入参保人数" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="养老保险金额" prop="pensionAmount">
              <el-input v-model="formData.pensionAmount" placeholder="请输入养老保险金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医疗保险金额" prop="medicalAmount">
              <el-input v-model="formData.medicalAmount" placeholder="请输入医疗保险金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="失业保险金额" prop="unemploymentAmount">
              <el-input v-model="formData.unemploymentAmount" placeholder="请输入失业保险金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工伤保险金额" prop="injuryAmount">
              <el-input v-model="formData.injuryAmount" placeholder="请输入工伤保险金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生育保险金额" prop="maternityAmount">
              <el-input v-model="formData.maternityAmount" placeholder="请输入生育保险金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公积金金额" prop="providentFundAmount">
              <el-input v-model="formData.providentFundAmount" placeholder="请输入公积金金额">
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缴纳日期" prop="paymentDate">
              <el-date-picker
                v-model="formData.paymentDate"
                type="date"
                placeholder="请选择缴纳日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴纳状态" prop="paymentStatus">
              <el-select v-model="formData.paymentStatus" placeholder="请选择缴纳状态" style="width: 100%">
                <el-option label="待缴纳" :value="1" />
                <el-option label="已缴纳" :value="2" />
                <el-option label="缴纳失败" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 缴纳明细对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="缴纳明细"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="缴纳记录编号">{{ detailData.recordNo }}</el-descriptions-item>
        <el-descriptions-item label="缴纳月份">{{ detailData.yearMonth }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="参保人数">{{ detailData.employeeCount }}</el-descriptions-item>
        <el-descriptions-item label="养老保险金额">
          ¥{{ detailData.pensionAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="医疗保险金额">
          ¥{{ detailData.medicalAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="失业保险金额">
          ¥{{ detailData.unemploymentAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="工伤保险金额">
          ¥{{ detailData.injuryAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="生育保险金额">
          ¥{{ detailData.maternityAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="公积金金额">
          ¥{{ detailData.providentFundAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="总金额" :span="2">
          <span style="color: #f56c6c; font-weight: bold; font-size: 16px;">
            ¥{{ detailData.totalAmount?.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="缴纳日期">{{ detailData.paymentDate }}</el-descriptions-item>
        <el-descriptions-item label="缴纳状态">
          <el-tag v-if="detailData.paymentStatus === 1" type="warning">待缴纳</el-tag>
          <el-tag v-else-if="detailData.paymentStatus === 2" type="success">已缴纳</el-tag>
          <el-tag v-else-if="detailData.paymentStatus === 3" type="danger">缴纳失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { PaymentRecord, PaymentRecordListParams } from '@/types/socialSecurity'
import {
  getPaymentRecordList,
  getPaymentRecordDetail,
  addPaymentRecord,
  updatePaymentRecord,
  removePaymentRecord
} from '@/api/paymentRecord'

defineOptions({
  name: 'PaymentRecord'
})

// 查询参数
const queryParams = reactive<PaymentRecordListParams>({
  recordNo: '',
  yearMonth: '',
  city: '',
  paymentStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PaymentRecord[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<PaymentRecord>>({
  recordNo: '',
  yearMonth: '',
  city: '',
  employeeCount: 0,
  pensionAmount: 0,
  medicalAmount: 0,
  unemploymentAmount: 0,
  injuryAmount: 0,
  maternityAmount: 0,
  providentFundAmount: 0,
  paymentDate: '',
  paymentStatus: 1,
  remark: ''
})

// 明细对话框
const detailDialogVisible = ref(false)
const detailData = ref<Partial<PaymentRecord>>({})

// 表单验证规则
const formRules: FormRules = {
  recordNo: [{ required: true, message: '请输入缴纳记录编号', trigger: 'blur' }],
  yearMonth: [{ required: true, message: '请选择缴纳月份', trigger: 'change' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  employeeCount: [{ required: true, message: '请输入参保人数', trigger: 'blur' }],
  pensionAmount: [{ required: true, message: '请输入养老保险金额', trigger: 'blur' }],
  medicalAmount: [{ required: true, message: '请输入医疗保险金额', trigger: 'blur' }],
  unemploymentAmount: [{ required: true, message: '请输入失业保险金额', trigger: 'blur' }],
  injuryAmount: [{ required: true, message: '请输入工伤保险金额', trigger: 'blur' }],
  maternityAmount: [{ required: true, message: '请输入生育保险金额', trigger: 'blur' }],
  providentFundAmount: [{ required: true, message: '请输入公积金金额', trigger: 'blur' }],
  paymentStatus: [{ required: true, message: '请选择缴纳状态', trigger: 'change' }]
}

// 获取列表
const getList = async () => {
  try {
    const res = await getPaymentRecordList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
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
  queryParams.recordNo = ''
  queryParams.yearMonth = ''
  queryParams.city = ''
  queryParams.paymentStatus = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 选择变化
const handleSelectionChange = (selection: PaymentRecord[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增缴纳记录'
  Object.assign(formData, {
    recordNo: '',
    yearMonth: '',
    city: '',
    employeeCount: 0,
    pensionAmount: 0,
    medicalAmount: 0,
    unemploymentAmount: 0,
    injuryAmount: 0,
    maternityAmount: 0,
    providentFundAmount: 0,
    paymentDate: '',
    paymentStatus: 1,
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row: PaymentRecord) => {
  dialogTitle.value = '编辑缴纳记录'
  try {
    const res = await getPaymentRecordDetail(row.id)
    if (res.code === 200) {
      Object.assign(formData, res.data)
      dialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 查看明细
const handleViewDetail = async (row: PaymentRecord) => {
  try {
    const res = await getPaymentRecordDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除
const handleDelete = (row: PaymentRecord) => {
  ElMessageBox.confirm('确定要删除该缴纳记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await removePaymentRecord?.(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条缴纳记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await Promise.all(selectedIds.value.map(id => removePaymentRecord?.(id)))
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 计算总金额
        const totalAmount =
          Number(formData.pensionAmount) +
          Number(formData.medicalAmount) +
          Number(formData.unemploymentAmount) +
          Number(formData.injuryAmount) +
          Number(formData.maternityAmount) +
          Number(formData.providentFundAmount)

        const data = {
          ...formData,
          totalAmount
        }

        const res = formData.id
          ? await updatePaymentRecord(data as PaymentRecord)
          : await addPaymentRecord(data)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '新增成功')
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.payment-record-container {
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
</style>
