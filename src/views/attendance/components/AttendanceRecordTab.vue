<template>
  <div class="attendance-record-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="打卡日期">
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

          <el-form-item label="打卡状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="正常" value="正常" />
              <el-option label="迟到" value="迟到" />
              <el-option label="早退" value="早退" />
              <el-option label="旷工" value="旷工" />
              <el-option label="请假" value="请假" />
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
            新增打卡记录
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
          <el-table-column prop="clockInDate" label="打卡日期" min-width="10%" />
          <el-table-column prop="clockInTime" label="上班打卡" min-width="8%" />
          <el-table-column prop="clockOutTime" label="下班打卡" min-width="8%" />
          <el-table-column prop="status" label="打卡状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === '正常'" type="success">正常</el-tag>
              <el-tag v-else-if="row.status === '迟到'" type="warning">迟到</el-tag>
              <el-tag v-else-if="row.status === '早退'" type="warning">早退</el-tag>
              <el-tag v-else-if="row.status === '旷工'" type="danger">旷工</el-tag>
              <el-tag v-else-if="row.status === '请假'" type="info">请假</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="workHours" label="工作时长(小时)" min-width="9%" />
          <el-table-column prop="clockInLocation" label="上班打卡位置" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="clockOutLocation" label="下班打卡位置" min-width="15%" show-overflow-tooltip />
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

        <el-form-item label="打卡日期" prop="attendanceDate">
          <el-date-picker
            v-model="formData.attendanceDate"
            type="date"
            placeholder="请选择打卡日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="上班打卡时间" prop="clockInTime">
          <el-time-picker
            v-model="formData.clockInTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择上班打卡时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="下班打卡时间" prop="clockOutTime">
          <el-time-picker
            v-model="formData.clockOutTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="请选择下班打卡时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="上班打卡位置" prop="clockInLocation">
          <el-input v-model="formData.clockInLocation" placeholder="请输入上班打卡位置" />
        </el-form-item>

        <el-form-item label="下班打卡位置" prop="clockOutLocation">
          <el-input v-model="formData.clockOutLocation" placeholder="请输入下班打卡位置" />
        </el-form-item>

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

    <el-dialog
      v-model="detailDialogVisible"
      title="打卡记录详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="打卡日期">{{ detailData.attendanceDate }}</el-descriptions-item>
        <el-descriptions-item label="打卡状态">
          <el-tag v-if="detailData.status === 1" type="success">正常</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="warning">迟到</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="warning">早退</el-tag>
          <el-tag v-else-if="detailData.status === 4" type="danger">旷工</el-tag>
          <el-tag v-else-if="detailData.status === 5" type="info">请假</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="上班打卡时间">{{ detailData.clockInTime }}</el-descriptions-item>
        <el-descriptions-item label="下班打卡时间">{{ detailData.clockOutTime }}</el-descriptions-item>
        <el-descriptions-item label="工作时长">{{ detailData.workHours }} 小时</el-descriptions-item>
        <el-descriptions-item label="迟到时长">{{ detailData.lateMinutes }} 分钟</el-descriptions-item>
        <el-descriptions-item label="早退时长">{{ detailData.earlyMinutes }} 分钟</el-descriptions-item>
        <el-descriptions-item label="上班打卡位置" :span="2">{{ detailData.clockInLocation }}</el-descriptions-item>
        <el-descriptions-item label="下班打卡位置" :span="2">{{ detailData.clockOutLocation }}</el-descriptions-item>
        <el-descriptions-item label="上班打卡照片" :span="2">
          <el-image
            v-if="detailData.clockInPhoto"
            :src="detailData.clockInPhoto"
            style="width: 100px; height: 100px"
            :preview-src-list="[detailData.clockInPhoto]"
          />
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="下班打卡照片" :span="2">
          <el-image
            v-if="detailData.clockOutPhoto"
            :src="detailData.clockOutPhoto"
            style="width: 100px; height: 100px"
            :preview-src-list="[detailData.clockOutPhoto]"
          />
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getAttendanceRecordList,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  batchDeleteAttendanceRecords,
  getAttendanceRecordDetail
} from '@/api/attendanceRecord'
import type { AttendanceRecord } from '@/types/attendance'

const queryParams = reactive({
  employeeName: '',
  departmentName: '',
  startDate: '',
  endDate: '',
  status: '',
  page: 1,
  pageSize: 10
})

const dateRange = ref<[string, string] | null>(null)

const tableData = ref<AttendanceRecord[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<AttendanceRecord>>({
  employeeId: undefined,
  employeeName: '',
  attendanceDate: '',
  clockInTime: '',
  clockOutTime: '',
  clockInLocation: '',
  clockOutLocation: '',
  remark: ''
})

const formRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  attendanceDate: [{ required: true, message: '请选择打卡日期', trigger: 'change' }],
  clockInTime: [{ required: true, message: '请选择上班打卡时间', trigger: 'change' }]
}

const detailDialogVisible = ref(false)
const detailData = ref<AttendanceRecord>({} as AttendanceRecord)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    if (dateRange.value) {
      queryParams.startDate = dateRange.value[0]
      queryParams.endDate = dateRange.value[1]
    } else {
      queryParams.startDate = ''
      queryParams.endDate = ''
    }

    const res = await getAttendanceRecordList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.status = ''
  dateRange.value = null
  queryParams.startDate = ''
  queryParams.endDate = ''
  handleSearch()
}

const handleSelectionChange = (selection: AttendanceRecord[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增打卡记录'
  Object.assign(formData, {
    employeeId: undefined,
    employeeName: '',
    attendanceDate: '',
    clockInTime: '',
    clockOutTime: '',
    clockInLocation: '',
    clockOutLocation: '',
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: AttendanceRecord) => {
  dialogTitle.value = '编辑打卡记录'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleView = async (row: AttendanceRecord) => {
  try {
    const res = await getAttendanceRecordDetail(row.id)
    detailData.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

const handleDelete = (row: AttendanceRecord) => {
  ElMessageBox.confirm('确定要删除该打卡记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAttendanceRecord(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要删除选中的打卡记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteAttendanceRecords(selectedIds.value)
      ElMessage.success('批量删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateAttendanceRecord(formData)
          ElMessage.success('更新成功')
        } else {
          await addAttendanceRecord(formData)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.attendance-record-tab {
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
