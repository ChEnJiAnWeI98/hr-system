<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <el-button text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回模板列表
        </el-button>
        <span class="divider">|</span>
        <span class="page-info">{{ isEdit ? '编辑模板' : '新增模板' }}</span>
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
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入模板名称"
              maxlength="50"
              show-word-limit
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="合同类型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="请选择合同类型"
              style="width: 400px"
            >
              <el-option label="劳动合同" :value="1" />
              <el-option label="保密协议" :value="2" />
              <el-option label="竞业限制协议" :value="3" />
              <el-option label="培训协议" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="适用范围" prop="scope">
            <el-input
              v-model="formData.scope"
              placeholder="请输入适用范围"
              maxlength="100"
              show-word-limit
              style="width: 400px"
            />
          </el-form-item>

          <el-form-item label="模板内容" prop="content">
            <div style="width: 100%">
              <div class="variable-tips">
                <el-text type="info">
                  可使用以下变量：{'{{'}员工姓名{'}}'}、{'{{'}工号{'}}'}、{'{{'}身份证号{'}}'}、{'{{'}性别{'}}'}、{'{{'}出生日期{'}}'}、{'{{'}联系电话{'}}'}、{'{{'}电子邮箱{'}}'}、{'{{'}部门{'}}'}、{'{{'}岗位{'}}'}、{'{{'}入职日期{'}}'}、{'{{'}合同编号{'}}'}、{'{{'}签订日期{'}}'}、{'{{'}开始日期{'}}'}、{'{{'}结束日期{'}}'}、{'{{'}试用期{'}}'}、{'{{'}工作地点{'}}'}、{'{{'}薪资标准{'}}'}
                </el-text>
              </div>
              <el-input
                v-model="formData.content"
                type="textarea"
                :rows="15"
                placeholder="请输入模板内容"
              />
            </div>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
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
import { getTemplateDetail, addTemplate, updateTemplate } from '@/api/contract'
import type { ContractTemplate } from '@/types/contract'

defineOptions({
  name: 'ContractTemplateCreate'
})

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const isEdit = ref(false)
const templateId = ref<number>()

// 表单数据
const formData = reactive<Partial<ContractTemplate>>({
  name: '',
  type: undefined,
  scope: '',
  content: '',
  status: 1,
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择合同类型', trigger: 'change' }
  ],
  scope: [
    { required: true, message: '请输入适用范围', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入模板内容', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 返回列表
const handleBack = () => {
  router.push('/contract/template')
}

// 获取模板详情
const fetchDetail = async () => {
  try {
    const res = await getTemplateDetail(templateId.value!)
    Object.assign(formData, res.data)
  } catch (error) {
    ElMessage.error('获取模板详情失败')
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
        await updateTemplate({
          ...formData,
          id: templateId.value
        })
        ElMessage.success('更新成功')
      } else {
        await addTemplate(formData)
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
    templateId.value = parseInt(id)
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

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.variable-tips {
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #f4f4f5;
  border-radius: 4px;
}
</style>
