<template>
  <div class="tab-content">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索平台 / 账号名称"
        style="width: 280px"
        clearable
        @change="handleSearch"
      >
        <template #suffix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增渠道账号
      </el-button>
    </div>

    <div class="tab-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="platformName" label="平台" min-width="14%">
          <template #default="{ row }">
            <el-tag>{{ row.platformName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号名称" min-width="22%" />
        <el-table-column label="账号状态" min-width="11%">
          <template #default="{ row }">
            <el-tag v-if="row.accountStatus === 1" type="success">正常</el-tag>
            <el-tag v-else-if="row.accountStatus === 2" type="warning">异常</el-tag>
            <el-tag v-else-if="row.accountStatus === 3" type="info">已过期</el-tag>
            <el-tag v-else type="danger">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账号余额" min-width="10%">
          <template #default="{ row }">
            <span :class="{ 'balance-warn': (row.balance || 0) < 1000 }">
              ¥ {{ row.balance?.toLocaleString() || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="publishCount" label="累计发布" min-width="10%">
          <template #default="{ row }">{{ row.publishCount || 0 }} 次</template>
        </el-table-column>
        <el-table-column prop="lastSyncTime" label="最后同步时间" min-width="15%">
          <template #default="{ row }">{{ row.lastSyncTime || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="18%" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleTestConnection(row)">测试连通</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="渠道平台" prop="platform">
          <el-select v-model="formData.platform" style="width: 100%" @change="handlePlatformChange">
            <el-option label="Boss直聘" value="boss" />
            <el-option label="猎聘网" value="liepin" />
            <el-option label="智联招聘" value="zhilian" />
            <el-option label="前程无忧" value="51job" />
            <el-option label="拉勾网" value="lagou" />
            <el-option label="LinkedIn" value="linkedin" />
            <el-option label="脉脉" value="maimai" />
          </el-select>
        </el-form-item>

        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="formData.accountName" placeholder="如：XX公司企业版" />
        </el-form-item>

        <el-form-item label="账号状态">
          <el-select v-model="formData.accountStatus" style="width: 100%">
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="异常" />
            <el-option :value="3" label="已过期" />
            <el-option :value="4" label="已禁用" />
          </el-select>
        </el-form-item>

        <el-form-item label="账号余额">
          <el-input v-model.number="formData.balance" placeholder="剩余余额" style="width: 100%">
            <template #suffix>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="选填" />
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
import type { ChannelAccount, ConfigListParams } from '@/types/recruitmentConfig'
import { channelAccountApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<ChannelAccount[]>([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<ChannelAccount>>({
  platform: '',
  platformName: '',
  accountName: '',
  accountStatus: 1,
  balance: 0,
  remark: ''
})

const formRules = {
  platform: [{ required: true, message: '请选择渠道平台', trigger: 'change' }],
  accountName: [{ required: true, message: '请输入账号名称', trigger: 'blur' }]
}

const platformLabelMap: Record<string, string> = {
  boss: 'Boss直聘',
  liepin: '猎聘网',
  zhilian: '智联招聘',
  '51job': '前程无忧',
  lagou: '拉勾网',
  linkedin: 'LinkedIn',
  maimai: '脉脉'
}

const handlePlatformChange = (val: string) => {
  formData.platformName = platformLabelMap[val] || val
}

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await channelAccountApi.getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载渠道账号失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增渠道账号'
  Object.assign(formData, {
    id: undefined,
    platform: '',
    platformName: '',
    accountName: '',
    accountStatus: 1,
    balance: 0,
    publishCount: 0,
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: ChannelAccount) => {
  dialogTitle.value = '编辑渠道账号'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleTestConnection = (row: ChannelAccount) => {
  ElMessage.info(`正在测试「${row.platformName}」连通性……`)
  setTimeout(() => {
    ElMessage.success(`连通正常（Mock 演示）`)
  }, 800)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (formData.id) {
        await channelAccountApi.update(formData)
        ElMessage.success('更新成功')
      } else {
        await channelAccountApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: ChannelAccount) => {
  ElMessageBox.confirm(`确定删除「${row.platformName} - ${row.accountName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await channelAccountApi.delete(row.id)
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

.balance-warn {
  color: #f56c6c;
  font-weight: 600;
}
</style>
