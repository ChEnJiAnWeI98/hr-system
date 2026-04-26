<template>
  <div class="tab-content">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索场景编码 / 场景名称"
        style="width: 280px"
        clearable
        @change="handleSearch"
      >
        <template #suffix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增通知模板
      </el-button>
    </div>

    <div class="tab-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="sceneCode" label="场景编码" min-width="15%" />
        <el-table-column prop="sceneName" label="场景名称" min-width="18%" />
        <el-table-column prop="channel" label="通知渠道" min-width="10%">
          <template #default="{ row }">
            <el-tag :type="channelTagType(row.channel)">
              {{ channelLabel(row.channel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="22%">
          <template #default="{ row }">{{ row.title || '-' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="8%">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="13%" />
        <el-table-column label="操作" min-width="14%" fixed="right">
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="780px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="场景编码" prop="sceneCode">
          <el-input v-model="formData.sceneCode" placeholder="如：interview_invite" />
        </el-form-item>

        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="formData.sceneName" placeholder="如：面试邀约通知" />
        </el-form-item>

        <el-form-item label="通知渠道" prop="channel">
          <el-select v-model="formData.channel" style="width: 100%">
            <el-option label="邮件" value="email" />
            <el-option label="短信" value="sms" />
            <el-option label="站内信" value="inner" />
            <el-option label="企业微信" value="wechat" />
            <el-option label="钉钉" value="dingtalk" />
            <el-option label="飞书" value="feishu" />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" v-if="['email', 'inner'].includes(formData.channel || '')">
          <el-input v-model="formData.title" placeholder="邮件/站内信标题" />
        </el-form-item>

        <el-form-item label="支持变量说明">
          <el-input
            v-model="formData.supportedVariables"
            placeholder="如：{{候选人姓名}}、{{职位名称}}、{{面试时间}}"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="10"
            placeholder="请输入通知内容，可使用 {{变量名}} 作为占位符"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="模板预览" width="640px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="场景">{{ previewData.sceneName }}</el-descriptions-item>
        <el-descriptions-item label="渠道">{{ channelLabel(previewData.channel || '') }}</el-descriptions-item>
        <el-descriptions-item label="标题" v-if="previewData.title">{{ previewData.title }}</el-descriptions-item>
      </el-descriptions>
      <div class="preview-box">
        <div class="preview-title">内容</div>
        <pre class="preview-content">{{ previewData.content }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { NotificationTemplate, ConfigListParams } from '@/types/recruitmentConfig'
import { notificationTemplateApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<NotificationTemplate[]>([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<NotificationTemplate>>({
  sceneCode: '',
  sceneName: '',
  channel: 'email',
  title: '',
  content: '',
  supportedVariables: '',
  status: 1
})

const formRules = {
  sceneCode: [{ required: true, message: '请输入场景编码', trigger: 'blur' }],
  sceneName: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择通知渠道', trigger: 'change' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }]
}

const previewVisible = ref(false)
const previewData = ref<Partial<NotificationTemplate>>({})

const channelLabel = (ch: string) => {
  const m: Record<string, string> = {
    email: '邮件',
    sms: '短信',
    inner: '站内信',
    wechat: '企业微信',
    dingtalk: '钉钉',
    feishu: '飞书'
  }
  return m[ch] || ch
}

const channelTagType = (ch: string): any => {
  const m: Record<string, string> = {
    email: 'primary',
    sms: 'warning',
    inner: 'info',
    wechat: 'success',
    dingtalk: 'success',
    feishu: 'success'
  }
  return m[ch] || 'info'
}

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await notificationTemplateApi.getList(queryParams)
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
  dialogTitle.value = '新增通知模板'
  Object.assign(formData, {
    id: undefined,
    sceneCode: '',
    sceneName: '',
    channel: 'email',
    title: '',
    content: '',
    supportedVariables: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: NotificationTemplate) => {
  dialogTitle.value = '编辑通知模板'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handlePreview = (row: NotificationTemplate) => {
  previewData.value = row
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (formData.id) {
        await notificationTemplateApi.update(formData)
        ElMessage.success('更新成功')
      } else {
        await notificationTemplateApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: NotificationTemplate) => {
  ElMessageBox.confirm(`确定删除模板「${row.sceneName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await notificationTemplateApi.delete(row.id)
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
