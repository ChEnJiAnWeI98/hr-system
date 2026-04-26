<template>
  <div class="declaration-export-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="城市">
            <el-select v-model="queryParams.city" placeholder="请选择城市" style="width: 150px" clearable>
              <el-option label="北京" value="北京" />
              <el-option label="上海" value="上海" />
              <el-option label="广州" value="广州" />
              <el-option label="深圳" value="深圳" />
              <el-option label="杭州" value="杭州" />
            </el-select>
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

          <el-form-item label="导出类型">
            <el-select v-model="queryParams.exportType" placeholder="请选择导出类型" style="width: 180px" clearable>
              <el-option label="社保申报" :value="1" />
              <el-option label="公积金汇缴" :value="2" />
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
          <el-button type="success" @click="handleExportExcel">
            <el-icon><Download /></el-icon>
            导出Excel
          </el-button>
          <el-button type="warning" @click="handleExportPDF">
            <el-icon><Download /></el-icon>
            导出PDF
          </el-button>
          <el-button type="primary" @click="handleValidate">
            <el-icon><CircleCheck /></el-icon>
            数据校验
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
          <el-table-column prop="departmentName" label="部门" min-width="12%" />
          <el-table-column prop="socialSecurityBase" label="社保基数" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.socialSecurityBase.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="providentFundBase" label="公积金基数" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.providentFundBase.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="pensionInsurance" label="养老保险" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.pensionInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="medicalInsurance" label="医疗保险" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.medicalInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="unemploymentInsurance" label="失业保险" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.unemploymentInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="workInjuryInsurance" label="工伤保险" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.workInjuryInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="maternityInsurance" label="生育保险" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.maternityInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="providentFund" label="公积金" min-width="10%" align="right">
            <template #default="{ row }">
              {{ row.providentFund.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="合计金额" min-width="10%" align="right" fixed="right">
            <template #default="{ row }">
              {{ row.totalAmount.toFixed(2) }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, CircleCheck } from '@element-plus/icons-vue'

defineOptions({
  name: 'DeclarationExport'
})

// 查询参数
const queryParams = reactive({
  city: '',
  year: 2026,
  month: 4,
  exportType: null as number | null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// Mock 数据
const mockData = [
  {
    id: 1,
    employeeName: '张三',
    idCard: '110101199001011234',
    departmentName: '技术部',
    city: '北京',
    year: 2026,
    month: 4,
    socialSecurityBase: 15000.00,
    providentFundBase: 15000.00,
    pensionInsurance: 1200.00,
    medicalInsurance: 300.00,
    unemploymentInsurance: 150.00,
    workInjuryInsurance: 75.00,
    maternityInsurance: 75.00,
    providentFund: 1800.00,
    totalAmount: 3600.00
  },
  {
    id: 2,
    employeeName: '李四',
    idCard: '110101199002021234',
    departmentName: '产品部',
    city: '北京',
    year: 2026,
    month: 4,
    socialSecurityBase: 12000.00,
    providentFundBase: 12000.00,
    pensionInsurance: 960.00,
    medicalInsurance: 240.00,
    unemploymentInsurance: 120.00,
    workInjuryInsurance: 60.00,
    maternityInsurance: 60.00,
    providentFund: 1440.00,
    totalAmount: 2880.00
  },
  {
    id: 3,
    employeeName: '王五',
    idCard: '110101199003031234',
    departmentName: '市场部',
    city: '上海',
    year: 2026,
    month: 4,
    socialSecurityBase: 18000.00,
    providentFundBase: 18000.00,
    pensionInsurance: 1440.00,
    medicalInsurance: 360.00,
    unemploymentInsurance: 180.00,
    workInjuryInsurance: 90.00,
    maternityInsurance: 90.00,
    providentFund: 2160.00,
    totalAmount: 4320.00
  },
  {
    id: 4,
    employeeName: '赵六',
    idCard: '110101199004041234',
    departmentName: '人力资源部',
    city: '北京',
    year: 2026,
    month: 4,
    socialSecurityBase: 10000.00,
    providentFundBase: 10000.00,
    pensionInsurance: 800.00,
    medicalInsurance: 200.00,
    unemploymentInsurance: 100.00,
    workInjuryInsurance: 50.00,
    maternityInsurance: 50.00,
    providentFund: 1200.00,
    totalAmount: 2400.00
  },
  {
    id: 5,
    employeeName: '孙七',
    idCard: '110101199005051234',
    departmentName: '财务部',
    city: '深圳',
    year: 2026,
    month: 4,
    socialSecurityBase: 16000.00,
    providentFundBase: 16000.00,
    pensionInsurance: 1280.00,
    medicalInsurance: 320.00,
    unemploymentInsurance: 160.00,
    workInjuryInsurance: 80.00,
    maternityInsurance: 80.00,
    providentFund: 1920.00,
    totalAmount: 3840.00
  },
  {
    id: 6,
    employeeName: '周八',
    idCard: '110101199006061234',
    departmentName: '技术部',
    city: '北京',
    year: 2026,
    month: 4,
    socialSecurityBase: 14000.00,
    providentFundBase: 14000.00,
    pensionInsurance: 1120.00,
    medicalInsurance: 280.00,
    unemploymentInsurance: 140.00,
    workInjuryInsurance: 70.00,
    maternityInsurance: 70.00,
    providentFund: 1680.00,
    totalAmount: 3360.00
  },
  {
    id: 7,
    employeeName: '吴九',
    idCard: '110101199007071234',
    departmentName: '运营部',
    city: '广州',
    year: 2026,
    month: 4,
    socialSecurityBase: 13000.00,
    providentFundBase: 13000.00,
    pensionInsurance: 1040.00,
    medicalInsurance: 260.00,
    unemploymentInsurance: 130.00,
    workInjuryInsurance: 65.00,
    maternityInsurance: 65.00,
    providentFund: 1560.00,
    totalAmount: 3120.00
  },
  {
    id: 8,
    employeeName: '郑十',
    idCard: '110101199008081234',
    departmentName: '客服部',
    city: '杭州',
    year: 2026,
    month: 4,
    socialSecurityBase: 11000.00,
    providentFundBase: 11000.00,
    pensionInsurance: 880.00,
    medicalInsurance: 220.00,
    unemploymentInsurance: 110.00,
    workInjuryInsurance: 55.00,
    maternityInsurance: 55.00,
    providentFund: 1320.00,
    totalAmount: 2640.00
  }
]

// 获取列表数据
const getList = () => {
  let filteredData = [...mockData]

  // 筛选
  if (queryParams.city) {
    filteredData = filteredData.filter(item => item.city === queryParams.city)
  }
  if (queryParams.year) {
    filteredData = filteredData.filter(item => item.year === queryParams.year)
  }
  if (queryParams.month) {
    filteredData = filteredData.filter(item => item.month === queryParams.month)
  }

  // 分页
  const start = (queryParams.page - 1) * queryParams.pageSize
  const end = start + queryParams.pageSize
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.city = ''
  queryParams.year = 2026
  queryParams.month = 4
  queryParams.exportType = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  queryParams.page = 1
  getList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 选择改变
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 导出Excel
const handleExportExcel = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据')
    return
  }

  ElMessage.success(`正在导出 ${selectedIds.value.length} 条数据到 Excel...`)

  // Mock 导出延迟
  setTimeout(() => {
    ElMessage.success('Excel 导出成功！')
  }, 1000)
}

// 导出PDF
const handleExportPDF = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据')
    return
  }

  ElMessage.success(`正在导出 ${selectedIds.value.length} 条数据到 PDF...`)

  // Mock 导出延迟
  setTimeout(() => {
    ElMessage.success('PDF 导出成功！')
  }, 1000)
}

// 数据校验
const handleValidate = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据')
    return
  }

  ElMessage.info('正在校验数据...')

  // Mock 校验延迟
  setTimeout(() => {
    ElMessage.success('数据校验通过，无异常数据！')
  }, 800)
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.declaration-export-container {
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
