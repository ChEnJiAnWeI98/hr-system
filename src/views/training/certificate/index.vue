<template>
  <div class="certificate-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="证书编号">
            <el-input
              v-model="queryParams.certificateNo"
              placeholder="证书编号"
              style="width: 180px"
              clearable
            />
          </el-form-item>

          <el-form-item label="证书名称">
            <el-input
              v-model="queryParams.certificateName"
              placeholder="证书名称"
              style="width: 220px"
              clearable
            />
          </el-form-item>

          <el-form-item label="持有人">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="员工姓名"
              style="width: 150px"
              clearable
            />
          </el-form-item>

          <el-form-item label="类型">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择"
              style="width: 140px"
              clearable
            >
              <el-option
                v-for="(label, key) in CERT_TYPE_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              style="width: 130px"
              clearable
            >
              <el-option
                v-for="(label, key) in CERT_STATUS_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">证书总数</div>
        <div class="stat-value primary">{{ total }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">有效证书</div>
        <div class="stat-value success">{{ stat.valid }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">即将到期</div>
        <div class="stat-value warning">{{ stat.expiring }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">已过期</div>
        <div class="stat-value danger">{{ stat.expired }}</div>
      </el-card>
    </div>

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            录入证书
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
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
          <el-table-column type="selection" width="50" />
          <el-table-column prop="certificateNo" label="证书编号" width="180" />
          <el-table-column prop="certificateName" label="证书名称" min-width="200" show-overflow-tooltip />
          <el-table-column label="类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ CERT_TYPE_LABEL[row.type as CertificateType] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="issuer" label="颁发机构" min-width="160" show-overflow-tooltip />
          <el-table-column prop="employeeName" label="持有人" width="100" />
          <el-table-column prop="orgName" label="组织" min-width="140" show-overflow-tooltip />
          <el-table-column prop="issueDate" label="颁发日期" width="120" />
          <el-table-column label="有效期" width="180">
            <template #default="{ row }">
              <span>{{ row.validFrom }}</span>
              <span v-if="row.validTo"> ~ {{ row.validTo }}</span>
              <span v-else style="color: #67c23a"> ~ 永久</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="CERT_STATUS_TYPE[row.status as Certificate['status']]"
                size="small"
              >
                {{ CERT_STATUS_LABEL[row.status as Certificate['status']] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情</el-button>
              <el-button link @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="680px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="证书编号" prop="certificateNo">
          <el-input v-model="formData.certificateNo" placeholder="如 CERT-20260422-001" />
        </el-form-item>
        <el-form-item label="证书名称" prop="certificateName">
          <el-input v-model="formData.certificateName" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio
              v-for="(label, key) in CERT_TYPE_LABEL"
              :key="key"
              :value="key"
            >
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="颁发机构" prop="issuer">
          <el-input v-model="formData.issuer" />
        </el-form-item>
        <el-form-item label="持有人" prop="employeeId">
          <EmployeeSelector v-model="formData.employeeId" width="100%" @change="onEmployeeChange" />
        </el-form-item>
        <el-form-item label="颁发日期" prop="issueDate">
          <el-date-picker
            v-model="formData.issueDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期开始" prop="validFrom">
          <el-date-picker
            v-model="formData.validFrom"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期结束">
          <el-date-picker
            v-model="formData.validTo"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="留空表示永久有效"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="附件 URL">
          <el-input v-model="formData.attachmentUrl" placeholder="证书扫描件链接" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情 Dialog -->
    <el-dialog v-model="detailVisible" title="证书详情" width="640px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="证书编号">{{ detailData.certificateNo }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          {{ detailData.type ? CERT_TYPE_LABEL[detailData.type as CertificateType] : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="证书名称" :span="2">{{ detailData.certificateName }}</el-descriptions-item>
        <el-descriptions-item label="颁发机构">{{ detailData.issuer }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            v-if="detailData.status"
            :type="CERT_STATUS_TYPE[detailData.status as Certificate['status']]"
            size="small"
          >
            {{ CERT_STATUS_LABEL[detailData.status as Certificate['status']] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="持有人">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="组织">{{ detailData.orgName }}</el-descriptions-item>
        <el-descriptions-item label="颁发日期">{{ detailData.issueDate }}</el-descriptions-item>
        <el-descriptions-item label="有效期">
          <span>{{ detailData.validFrom }}</span>
          <span v-if="detailData.validTo"> ~ {{ detailData.validTo }}</span>
          <span v-else style="color: #67c23a"> ~ 永久</span>
        </el-descriptions-item>
        <el-descriptions-item label="关联计划" :span="2">
          {{ detailData.planName || '（未关联）' }}
        </el-descriptions-item>
        <el-descriptions-item label="附件" :span="2">
          <a v-if="detailData.attachmentUrl" :href="detailData.attachmentUrl" target="_blank">
            {{ detailData.attachmentUrl }}
          </a>
          <span v-else>-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCertificateList,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  batchDeleteCertificate
} from '@/api/training'
import type { Certificate, CertificateType } from '@/types/training'
import {
  CERT_TYPE_LABEL,
  CERT_STATUS_LABEL,
  CERT_STATUS_TYPE
} from '@/types/training'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'

defineOptions({ name: 'TrainingCertificate' })

const empStore = useEmployeeStore()

const queryParams = reactive<{
  certificateNo?: string
  certificateName?: string
  employeeName?: string
  type?: CertificateType | ''
  status?: Certificate['status'] | ''
  page: number
  pageSize: number
}>({
  certificateNo: '',
  certificateName: '',
  employeeName: '',
  type: '',
  status: '',
  page: 1,
  pageSize: 10
})

const tableData = ref<Certificate[]>([])
const total = ref(0)
const allData = ref<Certificate[]>([])
const selectedIds = ref<number[]>([])

const stat = computed(() => ({
  valid: allData.value.filter((c) => c.status === 'valid').length,
  expiring: allData.value.filter((c) => c.status === 'expiring').length,
  expired: allData.value.filter((c) => c.status === 'expired').length
}))

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const emptyForm = (): Partial<Certificate> => ({
  certificateNo: '',
  certificateName: '',
  type: 'external',
  issuer: '',
  employeeId: undefined,
  employeeName: '',
  orgName: '',
  issueDate: '',
  validFrom: '',
  validTo: undefined,
  status: 'valid',
  attachmentUrl: ''
})
const formData = reactive<Partial<Certificate>>(emptyForm())

const formRules: FormRules = {
  certificateNo: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
  certificateName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  issuer: [{ required: true, message: '请输入颁发机构', trigger: 'blur' }],
  employeeId: [{ required: true, message: '请选择持有人', trigger: 'change' }],
  issueDate: [{ required: true, message: '请选择颁发日期', trigger: 'change' }],
  validFrom: [{ required: true, message: '请选择有效期开始', trigger: 'change' }]
}

const detailVisible = ref(false)
const detailData = ref<Partial<Certificate>>({})

const fetchData = async () => {
  try {
    const res: any = await getCertificateList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
    // 加载全量数据用于统计
    const resAll: any = await getCertificateList({ page: 1, pageSize: 999 })
    allData.value = resAll.data.list
  } catch {
    ElMessage.error('获取证书列表失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryParams, {
    certificateNo: '',
    certificateName: '',
    employeeName: '',
    type: '',
    status: '',
    page: 1,
    pageSize: 10
  })
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '录入证书'
  Object.assign(formData, emptyForm(), { id: undefined })
  dialogVisible.value = true
}

const handleEdit = (row: Certificate) => {
  dialogTitle.value = '编辑证书'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const onEmployeeChange = (empId: number) => {
  const emp = empStore.getById(empId)
  if (emp) {
    formData.employeeName = emp.nameZh
    formData.orgName = emp.orgName
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (formData.id) {
        await updateCertificate(formData as Certificate)
        ElMessage.success('更新成功')
      } else {
        await addCertificate(formData as Certificate)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchData()
    } catch {
      ElMessage.error('操作失败')
    }
  })
}

const handleDelete = async (row: Certificate) => {
  try {
    await ElMessageBox.confirm(`确定删除证书「${row.certificateName}」？`, '提示', {
      type: 'warning'
    })
    await deleteCertificate(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条证书？`, '提示', {
      type: 'warning'
    })
    await batchDeleteCertificate(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleView = (row: Certificate) => {
  detailData.value = row
  detailVisible.value = true
}

const handleSelectionChange = (selection: Certificate[]) => {
  selectedIds.value = selection.map((s) => s.id)
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.certificate-container {
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

.stat-row {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 14px 20px;
    }

    .stat-label {
      font-size: 13px;
      color: #909399;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      margin-top: 4px;
      color: #303133;

      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
      &.danger {
        color: var(--el-color-danger);
      }
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
