<template>
  <div class="insurance-config-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 200px" clearable />
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

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增配置
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
          <el-table-column prop="city" label="城市" min-width="8%" />
          <el-table-column prop="yearMonth" label="年月" min-width="10%" />
          <el-table-column prop="pensionBase" label="养老保险基数" min-width="9%" />
          <el-table-column prop="pensionCompanyRate" label="养老企业比例(%)" min-width="9%" />
          <el-table-column prop="pensionPersonalRate" label="养老个人比例(%)" min-width="9%" />
          <el-table-column prop="medicalBase" label="医疗保险基数" min-width="9%" />
          <el-table-column prop="medicalCompanyRate" label="医疗企业比例(%)" min-width="9%" />
          <el-table-column prop="medicalPersonalRate" label="医疗个人比例(%)" min-width="9%" />
          <el-table-column prop="unemploymentBase" label="失业保险基数" min-width="9%" />
          <el-table-column prop="injuryBase" label="工伤保险基数" min-width="9%" />
          <el-table-column prop="maternityBase" label="生育保险基数" min-width="9%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">启用</el-tag>
              <el-tag v-else type="info">停用</el-tag>
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
        @size-change="handleSearch"
        @current-change="handleSearch"
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
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="城市" prop="city">
              <el-input v-model="formData.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="月份" prop="month">
              <el-select v-model="formData.month" placeholder="请选择月份" style="width: 100%">
                <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">养老保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="基数" prop="pensionBase">
              <el-input v-model="formData.pensionBase" placeholder="请输入基数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业比例(%)" prop="pensionCompanyRate">
              <el-input v-model="formData.pensionCompanyRate" placeholder="请输入企业比例" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例(%)" prop="pensionPersonalRate">
              <el-input v-model="formData.pensionPersonalRate" placeholder="请输入个人比例" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">医疗保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="基数" prop="medicalBase">
              <el-input v-model="formData.medicalBase" placeholder="请输入基数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业比例(%)" prop="medicalCompanyRate">
              <el-input v-model="formData.medicalCompanyRate" placeholder="请输入企业比例" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例(%)" prop="medicalPersonalRate">
              <el-input v-model="formData.medicalPersonalRate" placeholder="请输入个人比例" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">失业保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="基数" prop="unemploymentBase">
              <el-input v-model="formData.unemploymentBase" placeholder="请输入基数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业比例(%)" prop="unemploymentCompanyRate">
              <el-input v-model="formData.unemploymentCompanyRate" placeholder="请输入企业比例" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例(%)" prop="unemploymentPersonalRate">
              <el-input v-model="formData.unemploymentPersonalRate" placeholder="请输入个人比例" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">工伤保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基数" prop="injuryBase">
              <el-input v-model="formData.injuryBase" placeholder="请输入基数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业比例(%)" prop="injuryCompanyRate">
              <el-input v-model="formData.injuryCompanyRate" placeholder="请输入企业比例" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">生育保险</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基数" prop="maternityBase">
              <el-input v-model="formData.maternityBase" placeholder="请输入基数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业比例(%)" prop="maternityCompanyRate">
              <el-input v-model="formData.maternityCompanyRate" placeholder="请输入企业比例" />
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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="配置详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="年月">{{ detailData.yearMonth }}</el-descriptions-item>
        <el-descriptions-item label="养老保险基数">{{ detailData.pensionBase }}</el-descriptions-item>
        <el-descriptions-item label="养老企业比例">{{ detailData.pensionCompanyRate }}%</el-descriptions-item>
        <el-descriptions-item label="养老个人比例">{{ detailData.pensionPersonalRate }}%</el-descriptions-item>
        <el-descriptions-item label="医疗保险基数">{{ detailData.medicalBase }}</el-descriptions-item>
        <el-descriptions-item label="医疗企业比例">{{ detailData.medicalCompanyRate }}%</el-descriptions-item>
        <el-descriptions-item label="医疗个人比例">{{ detailData.medicalPersonalRate }}%</el-descriptions-item>
        <el-descriptions-item label="失业保险基数">{{ detailData.unemploymentBase }}</el-descriptions-item>
        <el-descriptions-item label="失业企业比例">{{ detailData.unemploymentCompanyRate }}%</el-descriptions-item>
        <el-descriptions-item label="失业个人比例">{{ detailData.unemploymentPersonalRate }}%</el-descriptions-item>
        <el-descriptions-item label="工伤保险基数">{{ detailData.injuryBase }}</el-descriptions-item>
        <el-descriptions-item label="工伤企业比例">{{ detailData.injuryCompanyRate }}%</el-descriptions-item>
        <el-descriptions-item label="生育保险基数">{{ detailData.maternityBase }}</el-descriptions-item>
        <el-descriptions-item label="生育企业比例">{{ detailData.maternityCompanyRate }}%</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="info">停用</el-tag>
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
import type { InsuranceConfig, InsuranceConfigListParams } from '@/types/socialSecurity'
import {
  getInsuranceConfigList,
  getInsuranceConfigDetail,
  addInsuranceConfig,
  updateInsuranceConfig,
  removeInsuranceConfig,
  batchDeleteInsuranceConfig
} from '@/api/insuranceConfig'

defineOptions({
  name: 'InsuranceConfig'
})

// 查询参数
const queryParams = reactive<InsuranceConfigListParams>({
  city: '',
  year: null,
  month: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<InsuranceConfig[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<InsuranceConfig>>({
  city: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  pensionBase: 0,
  pensionCompanyRate: 0,
  pensionPersonalRate: 0,
  medicalBase: 0,
  medicalCompanyRate: 0,
  medicalPersonalRate: 0,
  unemploymentBase: 0,
  unemploymentCompanyRate: 0,
  unemploymentPersonalRate: 0,
  injuryBase: 0,
  injuryCompanyRate: 0,
  maternityBase: 0,
  maternityCompanyRate: 0,
  status: 1,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年度', trigger: 'change' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  pensionBase: [{ required: true, message: '请输入养老保险基数', trigger: 'blur' }],
  pensionCompanyRate: [{ required: true, message: '请输入养老企业比例', trigger: 'blur' }],
  pensionPersonalRate: [{ required: true, message: '请输入养老个人比例', trigger: 'blur' }],
  medicalBase: [{ required: true, message: '请输入医疗保险基数', trigger: 'blur' }],
  medicalCompanyRate: [{ required: true, message: '请输入医疗企业比例', trigger: 'blur' }],
  medicalPersonalRate: [{ required: true, message: '请输入医疗个人比例', trigger: 'blur' }],
  unemploymentBase: [{ required: true, message: '请输入失业保险基数', trigger: 'blur' }],
  unemploymentCompanyRate: [{ required: true, message: '请输入失业企业比例', trigger: 'blur' }],
  unemploymentPersonalRate: [{ required: true, message: '请输入失业个人比例', trigger: 'blur' }],
  injuryBase: [{ required: true, message: '请输入工伤保险基数', trigger: 'blur' }],
  injuryCompanyRate: [{ required: true, message: '请输入工伤企业比例', trigger: 'blur' }],
  maternityBase: [{ required: true, message: '请输入生育保险基数', trigger: 'blur' }],
  maternityCompanyRate: [{ required: true, message: '请输入生育企业比例', trigger: 'blur' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<InsuranceConfig>>({})

// 获取列表
const getList = async () => {
  try {
    const res = await getInsuranceConfigList(queryParams)
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
  queryParams.city = ''
  queryParams.year = null
  queryParams.month = null
  queryParams.status = null
  queryParams.page = 1
  getList()
}

// 表格选择
const handleSelectionChange = (selection: InsuranceConfig[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增配置'
  Object.assign(formData, {
    id: undefined,
    city: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    pensionBase: 0,
    pensionCompanyRate: 0,
    pensionPersonalRate: 0,
    medicalBase: 0,
    medicalCompanyRate: 0,
    medicalPersonalRate: 0,
    unemploymentBase: 0,
    unemploymentCompanyRate: 0,
    unemploymentPersonalRate: 0,
    injuryBase: 0,
    injuryCompanyRate: 0,
    maternityBase: 0,
    maternityCompanyRate: 0,
    status: 1,
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row: InsuranceConfig) => {
  dialogTitle.value = '编辑配置'
  try {
    const res = await getInsuranceConfigDetail(row.id)
    Object.assign(formData, res.data)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 查看详情
const handleView = async (row: InsuranceConfig) => {
  try {
    const res = await getInsuranceConfigDetail(row.id)
    detailData.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除
const handleDelete = (row: InsuranceConfig) => {
  ElMessageBox.confirm('确定要删除该配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await removeInsuranceConfig?.(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条配置吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteInsuranceConfig?.(selectedIds.value)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateInsuranceConfig(formData as InsuranceConfig)
          ElMessage.success('更新成功')
        } else {
          await addInsuranceConfig(formData as InsuranceConfig)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
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
.insurance-config-container {
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
