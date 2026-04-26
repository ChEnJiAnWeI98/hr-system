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
        <el-table-column prop="applicableLevel" label="适用职级" min-width="12%">
          <template #default="{ row }">{{ row.applicableLevel || '-' }}</template>
        </el-table-column>
        <el-table-column prop="applicableJobFamily" label="适用岗位族" min-width="16%">
          <template #default="{ row }">{{ row.applicableJobFamily || '全岗位' }}</template>
        </el-table-column>
        <el-table-column prop="language" label="语言" min-width="10%">
          <template #default="{ row }">
            <el-tag v-if="row.language === 'zh'">中文</el-tag>
            <el-tag v-else-if="row.language === 'en'" type="warning">英文</el-tag>
            <el-tag v-else type="success">中英双语</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" min-width="7%">
          <template #default="{ row }">v{{ row.version }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="8%">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else-if="row.status === 2" type="info">已废弃</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="12%" />
        <el-table-column label="操作" min-width="13%" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="如：标准 Offer 模板（中文）" />
        </el-form-item>

        <el-form-item label="适用职级">
          <el-input v-model="formData.applicableLevel" placeholder="如：P4-P7" />
        </el-form-item>

        <el-form-item label="适用岗位族">
          <el-input v-model="formData.applicableJobFamily" placeholder="多个逗号分隔，留空表示全岗位适用" />
        </el-form-item>

        <el-form-item label="语言" prop="language">
          <el-radio-group v-model="formData.language">
            <el-radio value="zh">中文</el-radio>
            <el-radio value="en">英文</el-radio>
            <el-radio value="bilingual">中英双语</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
          title="支持变量占位符：{{候选人姓名}}、{{入职岗位}}、{{入职部门}}、{{薪资}}、{{入职日期}}、{{工作地点}}、{{试用期}}、{{汇报对象}}"
        />

        <el-form-item label="正文" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="14"
            placeholder="请输入 Offer 正文，可使用 {{变量名}} 作为占位符"
          />
        </el-form-item>

        <el-form-item label="版本号">
          <el-input v-model.number="formData.version" disabled placeholder="系统自动生成" style="width: 120px" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formData.status" style="width: 160px">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
            <el-option :value="2" label="已废弃" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="Offer 模板预览" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="模板名称">{{ previewData.templateName }}</el-descriptions-item>
        <el-descriptions-item label="版本">v{{ previewData.version }}</el-descriptions-item>
        <el-descriptions-item label="适用职级">{{ previewData.applicableLevel || '-' }}</el-descriptions-item>
        <el-descriptions-item label="适用岗位族">{{ previewData.applicableJobFamily || '全岗位' }}</el-descriptions-item>
      </el-descriptions>
      <div class="preview-box">
        <div class="preview-title">正文预览</div>
        <pre class="preview-content">{{ previewData.content }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { OfferTemplate, ConfigListParams } from '@/types/recruitmentConfig'
import { offerTemplateApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<OfferTemplate[]>([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<OfferTemplate>>({
  templateName: '',
  applicableLevel: '',
  applicableJobFamily: '',
  language: 'zh',
  content: '',
  version: 1,
  status: 1
})

const formRules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  language: [{ required: true, message: '请选择语言', trigger: 'change' }],
  content: [{ required: true, message: '请输入模板正文', trigger: 'blur' }]
}

const previewVisible = ref(false)
const previewData = ref<Partial<OfferTemplate>>({})

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await offerTemplateApi.getList(queryParams)
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
  dialogTitle.value = '新增 Offer 模板'
  Object.assign(formData, {
    id: undefined,
    templateName: '',
    applicableLevel: '',
    applicableJobFamily: '',
    language: 'zh',
    content: '',
    version: 1,
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: OfferTemplate) => {
  dialogTitle.value = '编辑 Offer 模板'
  // 编辑时版本号自动 +1
  Object.assign(formData, { ...row, version: row.version + 1 })
  dialogVisible.value = true
}

const handlePreview = (row: OfferTemplate) => {
  previewData.value = row
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (formData.id) {
        await offerTemplateApi.update(formData)
        ElMessage.success('更新成功（版本 +1）')
      } else {
        await offerTemplateApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: OfferTemplate) => {
  ElMessageBox.confirm(`确定删除模板「${row.templateName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await offerTemplateApi.delete(row.id)
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

.preview-box {
  margin-top: 16px;

  .preview-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #303133;
  }

  .preview-content {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
    line-height: 1.8;
    font-family: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
