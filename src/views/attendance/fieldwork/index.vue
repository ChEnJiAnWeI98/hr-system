<template>
  <div class="fieldwork-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentId" placeholder="请输入部门ID" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="外勤日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 280px"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="进行中" :value="0" />
              <el-option label="已结束" :value="1" />
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

    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增外勤记录
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="departmentName" label="部门" min-width="10%" />
          <el-table-column prop="fieldWorkDate" label="外勤日期" min-width="10%" />
          <el-table-column prop="startTime" label="开始时间" min-width="8%" />
          <el-table-column prop="endTime" label="结束时间" min-width="8%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="warning">进行中</el-tag>
              <el-tag v-else-if="row.status === 1" type="success">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="外勤地点" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="gpsCoordinates" label="GPS坐标" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="reason" label="外勤事由" min-width="15%" show-overflow-tooltip />
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link @click="handleEdit(row)" v-if="row.status === 0">
                编辑
              </el-button>
              <el-button link type="success" @click="handleEnd(row)" v-if="row.status === 0">
                结束外勤
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="员工" prop="employeeId">
          <el-input v-model="formData.employeeName" placeholder="请选择员工" readonly />
        </el-form-item>

        <el-form-item label="外勤日期" prop="fieldWorkDate">
          <el-date-picker
            v-model="formData.fieldWorkDate"
            type="date"
            placeholder="请选择外勤日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="formData.startTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择开始时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime" v-if="formData.status === 1">
          <el-time-picker
            v-model="formData.endTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择结束时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="外勤地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入外勤地点" />
        </el-form-item>

        <el-form-item label="GPS坐标" prop="gpsCoordinates">
          <el-input v-model="formData.gpsCoordinates" placeholder="请输入GPS坐标" />
        </el-form-item>

        <el-form-item label="外勤事由" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入外勤事由"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="endDialogVisible"
      title="结束外勤"
      width="500px"
    >
      <el-form ref="endFormRef" :model="endFormData" :rules="endFormRules" label-width="120px">
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="endFormData.endTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="endDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEndSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="外勤记录详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ viewData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="员工工号">{{ viewData.employeeCode }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ viewData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="外勤日期">{{ viewData.fieldWorkDate }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ viewData.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ viewData.endTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="viewData.status === 0" type="warning">进行中</el-tag>
          <el-tag v-else-if="viewData.status === 1" type="success">已结束</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="外勤地点" :span="2">{{ viewData.location }}</el-descriptions-item>
        <el-descriptions-item label="GPS坐标" :span="2">{{ viewData.gpsCoordinates }}</el-descriptions-item>
        <el-descriptions-item label="外勤事由" :span="2">{{ viewData.reason }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ viewData.createTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getFieldWorkRecordList,
  getFieldWorkRecordDetail,
  addFieldWorkRecord,
  updateFieldWorkRecord,
  deleteFieldWorkRecord,
  batchDeleteFieldWorkRecords,
  endFieldWork
} from '@/api/fieldWork'
import type { FieldWorkRecord, FieldWorkRecordListParams } from '@/types/attendance'

const queryParams = reactive<FieldWorkRecordListParams>({
  employeeName: '',
  departmentId: null,
  fieldWorkDateStart: '',
  fieldWorkDateEnd: '',
  status: null,
  page: 1,
  pageSize: 10
})

const dateRange = ref<[string, string]>()
const tableData = ref<FieldWorkRecord[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<FieldWorkRecord>>({
  employeeId: undefined,
  employeeName: '',
  fieldWorkDate: '',
  startTime: '',
  endTime: '',
  location: '',
  gpsCoordinates: '',
  reason: '',
  status: 0
})

const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  fieldWorkDate: [{ required: true, message: '请选择外勤日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入外勤地点', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入外勤事由', trigger: 'blur' }]
}

const endDialogVisible = ref(false)
const endFormRef = ref<FormInstance>()
const endFormData = reactive({
  id: 0,
  endTime: ''
})

const endFormRules: FormRules = {
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const viewDialogVisible = ref(false)
const viewData = ref<FieldWorkRecord>({} as FieldWorkRecord)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    if (dateRange.value) {
      queryParams.fieldWorkDateStart = dateRange.value[0]
      queryParams.fieldWorkDateEnd = dateRange.value[1]
    } else {
      queryParams.fieldWorkDateStart = ''
      queryParams.fieldWorkDateEnd = ''
    }

    const res = await getFieldWorkRecordList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentId = null
  queryParams.status = null
  dateRange.value = undefined
  queryParams.fieldWorkDateStart = ''
  queryParams.fieldWorkDateEnd = ''
  handleSearch()
}

const handleSelectionChange = (selection: FieldWorkRecord[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增外勤记录'
  Object.assign(formData, {
    id: undefined,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'E001',
    departmentName: '技术部',
    fieldWorkDate: '',
    startTime: '',
    endTime: '',
    location: '',
    gpsCoordinates: '',
    reason: '',
    status: 0
  })
  dialogVisible.value = true
}

const handleEdit = async (row: FieldWorkRecord) => {
  try {
    const res = await getFieldWorkRecordDetail(row.id)
    if (res.code === 200) {
      dialogTitle.value = '编辑外勤记录'
      Object.assign(formData, res.data)
      dialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleView = async (row: FieldWorkRecord) => {
  try {
    const res = await getFieldWorkRecordDetail(row.id)
    if (res.code === 200) {
      viewData.value = res.data
      viewDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleEnd = (row: FieldWorkRecord) => {
  endFormData.id = row.id
  endFormData.endTime = ''
  endDialogVisible.value = true
}

const handleEndSubmit = async () => {
  if (!endFormRef.value) return

  await endFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await endFieldWork(endFormData.id, { endTime: endFormData.endTime })
        if (res.code === 200) {
          ElMessage.success('外勤已结束')
          endDialogVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error('结束外勤失败')
      }
    }
  })
}

const handleDelete = (row: FieldWorkRecord) => {
  ElMessageBox.confirm('确定要删除该外勤记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteFieldWorkRecord(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要批量删除选中的外勤记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await batchDeleteFieldWorkRecords(selectedIds.value)
      if (res.code === 200) {
        ElMessage.success('批量删除成功')
        loadData()
      }
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = formData.id
          ? await updateFieldWorkRecord(formData as FieldWorkRecord)
          : await addFieldWorkRecord(formData)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '添加成功')
          dialogVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '添加失败')
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.fieldwork-tab {
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
