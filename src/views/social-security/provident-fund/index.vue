<template>
  <div class="provident-fund-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="身份证号">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.department" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="正常缴纳" :value="1" />
              <el-option label="已停缴" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="操作类型">
            <el-select v-model="queryParams.operationType" placeholder="请选择操作类型" style="width: 150px" clearable>
              <el-option label="汇缴" :value="1" />
              <el-option label="补缴" :value="2" />
              <el-option label="退缴" :value="3" />
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
            新增记录
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
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" fixed="left" />
          <el-table-column prop="idCard" label="身份证号" min-width="14%" />
          <el-table-column prop="department" label="部门" min-width="10%" />
          <el-table-column prop="city" label="城市" min-width="8%" />
          <el-table-column prop="fundBase" label="公积金基数" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.fundBase.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="companyRate" label="企业比例" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.companyRate }}%
            </template>
          </el-table-column>
          <el-table-column prop="personalRate" label="个人比例" min-width="8%" align="right">
            <template #default="{ row }">
              {{ row.personalRate }}%
            </template>
          </el-table-column>
          <el-table-column prop="companyAmount" label="企业缴纳" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.companyAmount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="personalAmount" label="个人缴纳" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.personalAmount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="合计金额" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.totalAmount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">正常缴纳</el-tag>
              <el-tag v-else-if="row.status === 2" type="info">已停缴</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operationType" label="操作类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.operationType === 1" type="primary">汇缴</el-tag>
              <el-tag v-else-if="row.operationType === 2" type="warning">补缴</el-tag>
              <el-tag v-else-if="row.operationType === 3" type="danger">退缴</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
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
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
        </el-form-item>

        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入部门" />
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="formData.city" placeholder="请输入城市" />
        </el-form-item>

        <el-form-item label="公积金基数" prop="fundBase">
          <el-input v-model="formData.fundBase" placeholder="请输入公积金基数" @input="calculateAmounts" />
        </el-form-item>

        <el-form-item label="企业比例" prop="companyRate">
          <el-input v-model="formData.companyRate" placeholder="请输入企业比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="个人比例" prop="personalRate">
          <el-input v-model="formData.personalRate" placeholder="请输入个人比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="企业缴纳" prop="companyAmount">
          <el-input v-model="formData.companyAmount" placeholder="自动计算" readonly />
        </el-form-item>

        <el-form-item label="个人缴纳" prop="personalAmount">
          <el-input v-model="formData.personalAmount" placeholder="自动计算" readonly />
        </el-form-item>

        <el-form-item label="合计金额" prop="totalAmount">
          <el-input v-model="formData.totalAmount" placeholder="自动计算" readonly />
        </el-form-item>

        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="正常缴纳" :value="1" />
            <el-option label="已停缴" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作类型" prop="operationType">
          <el-select v-model="formData.operationType" placeholder="请选择操作类型" style="width: 100%">
            <el-option label="汇缴" :value="1" />
            <el-option label="补缴" :value="2" />
            <el-option label="退缴" :value="3" />
          </el-select>
        </el-form-item>

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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="公积金详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ detailData.idCard }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.department }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="公积金基数">{{ detailData.fundBase?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="企业比例">{{ detailData.companyRate }}%</el-descriptions-item>
        <el-descriptions-item label="个人比例">{{ detailData.personalRate }}%</el-descriptions-item>
        <el-descriptions-item label="企业缴纳">{{ detailData.companyAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="个人缴纳">{{ detailData.personalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="合计金额">{{ detailData.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ detailData.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ detailData.endDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success">正常缴纳</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="info">已停缴</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag v-if="detailData.operationType === 1" type="primary">汇缴</el-tag>
          <el-tag v-else-if="detailData.operationType === 2" type="warning">补缴</el-tag>
          <el-tag v-else-if="detailData.operationType === 3" type="danger">退缴</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
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
import {
  getProvidentFundList,
  addProvidentFund,
  updateProvidentFund,
  deleteProvidentFund,
  batchDeleteProvidentFund
} from '@/api/providentFund'
import type { ProvidentFund, ProvidentFundListParams } from '@/types/socialSecurity'

defineOptions({
  name: 'ProvidentFund'
})

// 查询参数
const queryParams = reactive<ProvidentFundListParams>({
  employeeName: '',
  idCard: '',
  department: '',
  city: '',
  status: null,
  operationType: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<ProvidentFund[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<ProvidentFund>>({
  employeeId: 0,
  employeeName: '',
  idCard: '',
  department: '',
  city: '',
  fundBase: 0,
  companyRate: 12,
  personalRate: 12,
  companyAmount: 0,
  personalAmount: 0,
  totalAmount: 0,
  startDate: '',
  status: 1,
  operationType: 1,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  fundBase: [{ required: true, message: '请输入公积金基数', trigger: 'blur' }],
  companyRate: [{ required: true, message: '请输入企业比例', trigger: 'blur' }],
  personalRate: [{ required: true, message: '请输入个人比例', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  operationType: [{ required: true, message: '请选择操作类型', trigger: 'change' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<ProvidentFund>>({})

// 获取列表数据
const getList = async () => {
  try {
    const res = await getProvidentFundList(queryParams)
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
  getList()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.idCard = ''
  queryParams.department = ''
  queryParams.city = ''
  queryParams.status = null
  queryParams.operationType = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 表格选择
const handleSelectionChange = (selection: ProvidentFund[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 计算金额
const calculateAmounts = () => {
  const fundBase = Number(formData.fundBase) || 0
  const companyRate = Number(formData.companyRate) || 0
  const personalRate = Number(formData.personalRate) || 0

  formData.companyAmount = Number((fundBase * companyRate / 100).toFixed(2))
  formData.personalAmount = Number((fundBase * personalRate / 100).toFixed(2))
  formData.totalAmount = Number((formData.companyAmount + formData.personalAmount).toFixed(2))
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增公积金记录'
  Object.assign(formData, {
    id: undefined,
    employeeId: 0,
    employeeName: '',
    idCard: '',
    department: '',
    city: '',
    fundBase: 0,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 0,
    personalAmount: 0,
    totalAmount: 0,
    startDate: '',
    status: 1,
    operationType: 1,
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ProvidentFund) => {
  dialogTitle.value = '编辑公积金记录'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: ProvidentFund) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 删除
const handleDelete = (row: ProvidentFund) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteProvidentFund(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await batchDeleteProvidentFund(selectedIds.value)
      if (res && 'code' in res && res.code === 200) {
        ElMessage.success('批量删除成功')
        getList()
      }
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        calculateAmounts()
        const res = formData.id
          ? await updateProvidentFund(formData)
          : await addProvidentFund(formData)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '添加成功')
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '添加失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.provident-fund-container {
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
