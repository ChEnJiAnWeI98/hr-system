<template>
  <div class="tab-content">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索模板名称 / 适用岗位族"
        style="width: 280px"
        clearable
        @change="handleSearch"
      >
        <template #suffix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增模板
      </el-button>
    </div>

    <div class="tab-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="templateName" label="模板名称" min-width="22%" />
        <el-table-column prop="applicableJobFamily" label="适用岗位族" min-width="18%">
          <template #default="{ row }">{{ row.applicableJobFamily || '全岗位' }}</template>
        </el-table-column>
        <el-table-column label="填报字段数" min-width="11%">
          <template #default="{ row }">{{ row.formFields?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="附件数" min-width="10%">
          <template #default="{ row }">{{ row.attachments?.length || 0 }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="9%">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="14%" />
        <el-table-column label="操作" min-width="12%" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="loadData"
      @current-change="loadData"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="860px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="如：通用岗位入职资料清单" />
        </el-form-item>

        <el-form-item label="适用岗位族">
          <el-input v-model="formData.applicableJobFamily" placeholder="多个逗号分隔，留空表示全岗位适用" />
        </el-form-item>

        <el-divider content-position="left">填报字段</el-divider>

        <div class="items-editor">
          <div v-for="(f, idx) in formData.formFields" :key="'field-' + idx" class="item-row">
            <el-input v-model="f.name" placeholder="字段名称" style="width: 180px" />
            <el-select v-model="f.type" placeholder="类型" style="width: 140px">
              <el-option label="文本" value="text" />
              <el-option label="多行文本" value="textarea" />
              <el-option label="日期" value="date" />
              <el-option label="下拉选择" value="select" />
              <el-option label="文件上传" value="upload" />
            </el-select>
            <el-checkbox v-model="f.required">必填</el-checkbox>
            <el-input v-model="f.validation" placeholder="校验说明" style="flex: 1" />
            <el-button link type="danger" @click="removeField(idx)">删除</el-button>
          </div>
          <el-button type="primary" text @click="addField">
            <el-icon><Plus /></el-icon> 添加填报字段
          </el-button>
        </div>

        <el-divider content-position="left">附件清单</el-divider>

        <div class="items-editor">
          <div v-for="(a, idx) in formData.attachments" :key="'att-' + idx" class="item-row">
            <el-input v-model="a.name" placeholder="附件名称（如：身份证正反面）" style="width: 220px" />
            <el-checkbox v-model="a.required">必传</el-checkbox>
            <el-input v-model="a.example" placeholder="示例说明（选填）" style="flex: 1" />
            <el-button link type="danger" @click="removeAttachment(idx)">删除</el-button>
          </div>
          <el-button type="primary" text @click="addAttachment">
            <el-icon><Plus /></el-icon> 添加附件
          </el-button>
        </div>

        <el-form-item label="状态" style="margin-top: 16px">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type {
  OnboardingTemplate,
  OnboardingFormField,
  OnboardingAttachmentItem,
  ConfigListParams
} from '@/types/recruitmentConfig'
import { onboardingTemplateApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<OnboardingTemplate[]>([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<OnboardingTemplate>>({
  templateName: '',
  applicableJobFamily: '',
  formFields: [],
  attachments: [],
  status: 1
})

const formRules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
}

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await onboardingTemplateApi.getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载模板失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增入职资料模板'
  Object.assign(formData, {
    id: undefined,
    templateName: '',
    applicableJobFamily: '',
    formFields: [
      { name: '紧急联系人姓名', type: 'text', required: true },
      { name: '紧急联系人电话', type: 'text', required: true, validation: '11 位手机号' },
      { name: '工资卡账号', type: 'text', required: true }
    ] as OnboardingFormField[],
    attachments: [
      { name: '身份证正反面', required: true, example: '清晰、无遮挡' },
      { name: '学历证书', required: true, example: '毕业证 + 学位证' }
    ] as OnboardingAttachmentItem[],
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: OnboardingTemplate) => {
  dialogTitle.value = '编辑入职资料模板'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

const addField = () => {
  formData.formFields!.push({ name: '', type: 'text', required: false } as OnboardingFormField)
}

const removeField = (idx: number) => {
  formData.formFields!.splice(idx, 1)
}

const addAttachment = () => {
  formData.attachments!.push({ name: '', required: false } as OnboardingAttachmentItem)
}

const removeAttachment = (idx: number) => {
  formData.attachments!.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (formData.id) {
        await onboardingTemplateApi.update(formData)
        ElMessage.success('更新成功')
      } else {
        await onboardingTemplateApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: OnboardingTemplate) => {
  ElMessageBox.confirm(`确定删除模板「${row.templateName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await onboardingTemplateApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.tab-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-toolbar {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tab-table {
  flex: 1;
  overflow: hidden;
}

.el-pagination {
  flex-shrink: 0;
  justify-content: flex-end;
  margin-top: 12px;
}

.items-editor {
  .item-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }
}
</style>
