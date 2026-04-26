<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="场景名称">
            <el-input
              v-model="queryParams.scenarioName"
              placeholder="请输入场景名称"
              clearable
              style="width: 250px"
            />
          </el-form-item>

          <el-form-item label="通知渠道">
            <el-select
              v-model="queryParams.channel"
              placeholder="请选择通知渠道"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="站内信" value="站内信" />
              <el-option label="邮件" value="邮件" />
              <el-option label="短信" value="短信" />
              <el-option label="企业微信" value="企业微信" />
              <el-option label="钉钉" value="钉钉" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
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
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          v-loading="loading"
        >
          <el-table-column prop="scenarioName" label="场景名称" min-width="12%" />
          <el-table-column prop="scenarioCode" label="场景编码" min-width="12%" />
          <el-table-column label="通知渠道" min-width="15%">
            <template #default="{ row }">
              <el-tag
                v-for="(channel, index) in row.channel.split('、')"
                :key="index"
                :type="getChannelType(channel)"
                size="small"
                style="margin-right: 8px"
              >
                {{ channel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="advanceDays" label="提前天数" min-width="8%" align="center">
            <template #default="{ row }">
              {{ row.advanceDays }} 天
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="8%" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="19%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button link type="primary" @click="handleTest(row)">
                测试通知
              </el-button>
              <el-button
                link
                :type="row.status === 1 ? 'warning' : 'success'"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 1 ? '禁用' : '启用' }}
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

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="场景名称" prop="scenarioName">
          <el-input
            v-model="formData.scenarioName"
            placeholder="请输入场景名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="场景编码" prop="scenarioCode">
          <el-input
            v-model="formData.scenarioCode"
            placeholder="请输入场景编码"
            clearable
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="通知渠道" prop="channel">
          <el-checkbox-group v-model="channelList">
            <el-checkbox label="站内信" />
            <el-checkbox label="邮件" />
            <el-checkbox label="短信" />
            <el-checkbox label="企业微信" />
            <el-checkbox label="钉钉" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="通知模板" prop="template">
          <el-input
            v-model="formData.template"
            type="textarea"
            :rows="6"
            placeholder="请输入通知模板内容"
          />
        </el-form-item>

        <el-form-item label="提前天数" prop="advanceDays">
          <el-input
            v-model="formData.advanceDays"
            placeholder="请输入提前天数"
            clearable
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getNotificationList,
  addNotification,
  updateNotification,
  deleteNotification,
  toggleNotificationStatus,
  testNotification
} from '@/api/notification'
import type { NotificationConfig, ListParams } from '@/types/system'

defineOptions({
  name: 'SystemNotification'
})

// 查询参数
const queryParams = reactive<ListParams & { scenarioName?: string; channel?: string; status?: number | string | null }>({
  scenarioName: '',
  channel: '',
  status: '',
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<NotificationConfig[]>([])
const total = ref(0)
const loading = ref(false)

// 抽屉
const drawerVisible = ref(false)
const drawerTitle = computed(() => (isEdit.value ? '编辑通知配置' : '新增通知配置'))
const isEdit = ref(false)
const submitLoading = ref(false)

// 表单
const formRef = ref<FormInstance>()
const formData = reactive<Partial<NotificationConfig>>({
  scenarioName: '',
  scenarioCode: '',
  channel: '',
  template: '',
  advanceDays: 0,
  status: 1
})

// 通知渠道列表（用于多选）
const channelList = ref<string[]>([])

// 表单验证规则
const formRules: FormRules = {
  scenarioName: [
    { required: true, message: '请输入场景名称', trigger: 'blur' }
  ],
  scenarioCode: [
    { required: true, message: '请输入场景编码', trigger: 'blur' }
  ],
  channel: [
    { required: true, message: '请选择通知渠道', trigger: 'change' }
  ],
  template: [
    { required: true, message: '请输入通知模板', trigger: 'blur' }
  ],
  advanceDays: [
    { required: true, message: '请输入提前天数', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * 获取通知渠道标签类型
 */
const getChannelType = (channel: string) => {
  const typeMap: Record<string, any> = {
    '站内信': 'primary',
    '邮件': 'success',
    '短信': 'warning',
    '企业微信': 'info',
    '钉钉': 'info'
  }
  return typeMap[channel] || ''
}

/**
 * 加载列表数据
 */
const loadData = async () => {
  loading.value = true
  try {
    const res = await getNotificationList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 查询
 */
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.scenarioName = ''
  queryParams.channel = ''
  queryParams.status = ''
  queryParams.page = 1
  queryParams.pageSize = 20
  loadData()
}

/**
 * 新增
 */
const handleAdd = () => {
  isEdit.value = false
  drawerVisible.value = true
  resetForm()
}

/**
 * 编辑
 */
const handleEdit = (row: NotificationConfig) => {
  isEdit.value = true
  drawerVisible.value = true
  Object.assign(formData, row)
  channelList.value = row.channel.split('、')
}

/**
 * 删除
 */
const handleDelete = async (row: NotificationConfig) => {
  try {
    await ElMessageBox.confirm('确定要删除该通知配置吗？', '提示', {
      type: 'warning'
    })
    await deleteNotification(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 测试通知
 */
const handleTest = async (row: NotificationConfig) => {
  try {
    const res = await testNotification(row.id)
    ElMessage.success(res.message || '测试通知已发送')
  } catch (error) {
    ElMessage.error('测试通知发送失败')
  }
}

/**
 * 启用/禁用
 */
const handleToggleStatus = async (row: NotificationConfig) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'

  try {
    await ElMessageBox.confirm(`确定要${action}该通知配置吗？`, '提示', {
      type: 'warning'
    })
    await toggleNotificationStatus(row.id, newStatus)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 将多选的渠道转换为字符串
    formData.channel = channelList.value.join('、')

    if (!formData.channel) {
      ElMessage.warning('请选择至少一个通知渠道')
      return
    }

    submitLoading.value = true
    try {
      if (isEdit.value) {
        await updateNotification(formData)
        ElMessage.success('更新成功')
      } else {
        await addNotification(formData)
        ElMessage.success('添加成功')
      }
      drawerVisible.value = false
      loadData()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    } finally {
      submitLoading.value = false
    }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  formData.scenarioName = ''
  formData.scenarioCode = ''
  formData.channel = ''
  formData.template = ''
  formData.advanceDays = 0
  formData.status = 1
  channelList.value = []
  formRef.value?.clearValidate()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page-container {
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

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
