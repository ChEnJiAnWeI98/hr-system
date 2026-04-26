<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <el-button text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回合同列表
        </el-button>
        <span class="divider">|</span>
        <span class="page-info">{{ isEdit ? '编辑合同' : '新增合同' }}</span>
      </div>
    </el-card>

    <!-- 表单内容 -->
    <el-scrollbar class="content-scrollbar">
      <el-card class="form-card">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-divider content-position="left">基本信息</el-divider>

          <el-form-item label="合同编号" prop="contractNo">
            <el-input
              v-model="formData.contractNo"
              placeholder="请输入合同编号"
              maxlength="50"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="员工" prop="employeeId">
            <el-select
              v-model="formData.employeeId"
              placeholder="请选择员工"
              filterable
              style="width: 400px"
              @change="handleEmployeeChange"
            >
              <el-option
                v-for="emp in employeeList"
                :key="emp.id"
                :label="`${emp.name} (${emp.employeeNo})`"
                :value="emp.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="合同类型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="请选择合同类型"
              style="width: 400px"
              @change="handleTypeChange"
            >
              <el-option label="劳动合同" :value="1" />
              <el-option label="保密协议" :value="2" />
              <el-option label="竞业限制协议" :value="3" />
              <el-option label="培训协议" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="合同模板" prop="templateId">
            <el-select
              v-model="formData.templateId"
              placeholder="请选择合同模板"
              style="width: 400px"
              @change="handleTemplateChange"
            >
              <el-option
                v-for="tpl in templateList"
                :key="tpl.id"
                :label="tpl.name"
                :value="tpl.id"
              />
            </el-select>
          </el-form-item>

          <el-divider content-position="left">合同期限</el-divider>

          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择开始日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="请选择结束日期"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="试用期" prop="probationPeriod">
            <el-input
              v-model="formData.probationPeriod"
              placeholder="请输入试用期（月）"
              style="width: 400px"
            >
              <template #append>月</template>
            </el-input>
          </el-form-item>

          <el-divider content-position="left">工作信息</el-divider>

          <el-form-item label="工作地点" prop="workLocation">
            <el-input
              v-model="formData.workLocation"
              placeholder="请输入工作地点"
              maxlength="100"
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="工作内容" prop="workContent">
            <el-input
              v-model="formData.workContent"
              type="textarea"
              :rows="3"
              placeholder="请输入工作内容"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="薪资标准" prop="salary">
            <el-input
              v-model="formData.salary"
              placeholder="请输入薪资标准"
              maxlength="100"
              style="width: 400px"
            />
          </el-form-item>

          <el-divider content-position="left">合同内容</el-divider>

          <el-form-item label="合同内容" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="15"
              placeholder="合同内容将根据选择的模板自动填充"
            />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              保存
            </el-button>
            <el-button @click="handleBack">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getContractDetail, addContract, updateContract } from '@/api/contract'
import { getTemplateList } from '@/api/contract'
import type { Contract, ContractTemplate } from '@/types/contract'

defineOptions({
  name: 'ContractCreate'
})

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const isEdit = ref(false)
const contractId = ref<number>()

// 员工列表（模拟数据）
const employeeList = ref([
  { id: 1, name: '张三', employeeNo: 'EMP001', department: '技术部' },
  { id: 2, name: '李四', employeeNo: 'EMP002', department: '市场部' },
  { id: 3, name: '王五', employeeNo: 'EMP003', department: '人事部' },
  { id: 4, name: '赵六', employeeNo: 'EMP004', department: '财务部' },
  { id: 5, name: '钱七', employeeNo: 'EMP005', department: '技术部' }
])

// 模板列表
const templateList = ref<ContractTemplate[]>([])

// 表单数据
const formData = reactive<Partial<Contract>>({
  contractNo: '',
  employeeId: undefined,
  employeeName: '',
  employeeNo: '',
  department: '',
  type: undefined,
  templateId: undefined,
  templateName: '',
  content: '',
  startDate: '',
  endDate: '',
  probationPeriod: undefined,
  workLocation: '',
  workContent: '',
  salary: '',
  status: 1,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  contractNo: [
    { required: true, message: '请输入合同编号', trigger: 'blur' }
  ],
  employeeId: [
    { required: true, message: '请选择员工', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择合同类型', trigger: 'change' }
  ],
  templateId: [
    { required: true, message: '请选择合同模板', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ],
  workLocation: [
    { required: true, message: '请输入工作地点', trigger: 'blur' }
  ],
  workContent: [
    { required: true, message: '请输入工作内容', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '请输入薪资标准', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入合同内容', trigger: 'blur' }
  ]
}

// 返回列表
const handleBack = () => {
  router.push('/contract/list')
}

// 员工变更
const handleEmployeeChange = (employeeId: number) => {
  const employee = employeeList.value.find(emp => emp.id === employeeId)
  if (employee) {
    formData.employeeName = employee.name
    formData.employeeNo = employee.employeeNo
    formData.department = employee.department
  }
}

// 合同类型变更
const handleTypeChange = async (type: number) => {
  // 加载对应类型的模板
  await fetchTemplates(type)
  formData.templateId = undefined
  formData.content = ''
}

// 模板变更
const handleTemplateChange = (templateId: number) => {
  const template = templateList.value.find(tpl => tpl.id === templateId)
  if (template) {
    formData.templateName = template.name
    formData.content = template.content
  }
}

// 获取模板列表
const fetchTemplates = async (type?: number) => {
  try {
    const res = await getTemplateList({
      type: type || formData.type,
      status: 1,
      page: 1,
      pageSize: 100
    })
    templateList.value = res.data.list
  } catch (error) {
    console.error('获取模板列表失败', error)
  }
}

// 获取合同详情
const fetchDetail = async () => {
  try {
    const res = await getContractDetail(contractId.value!)
    Object.assign(formData, res.data)
    // 加载对应类型的模板
    await fetchTemplates(formData.type)
  } catch (error) {
    ElMessage.error('获取合同详情失败')
    handleBack()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        await updateContract({
          ...formData,
          id: contractId.value
        })
        ElMessage.success('更新成功')
      } else {
        await addContract(formData)
        ElMessage.success('添加成功')
      }
      handleBack()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    }
  })
}

onMounted(() => {
  const id = route.params.id as string
  if (id && id !== 'new') {
    isEdit.value = true
    contractId.value = parseInt(id)
    fetchDetail()
  }
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    height: 60px;

    .el-button {
      font-size: 14px;
      color: #606266;
      padding: 0;

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }

    .divider {
      color: #dcdfe6;
      font-size: 14px;
    }

    .page-info {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.form-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
}
</style>
