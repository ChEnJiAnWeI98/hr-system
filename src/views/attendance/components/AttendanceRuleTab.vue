<template>
  <div class="attendance-rule-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="规则名称">
            <el-input v-model="queryParams.name" placeholder="请输入规则名称" style="width: 250px" clearable />
          </el-form-item>

          <el-form-item label="规则类型">
            <el-select v-model="queryParams.type" placeholder="请选择规则类型" style="width: 150px" clearable>
              <el-option label="固定班制" :value="1" />
              <el-option label="弹性工作制" :value="2" />
              <el-option label="排班制" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
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
            新增规则
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
          <el-table-column prop="name" label="规则名称" min-width="14%" />
          <el-table-column prop="type" label="规则类型" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.type === 1" type="success">固定班制</el-tag>
              <el-tag v-else-if="row.type === 2" type="warning">弹性工作制</el-tag>
              <el-tag v-else-if="row.type === 3" type="info">排班制</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="workStartTime" label="上班时间" min-width="8%" />
          <el-table-column prop="workEndTime" label="下班时间" min-width="8%" />
          <el-table-column prop="lateMinutes" label="迟到阈值(分钟)" min-width="9%" />
          <el-table-column prop="earlyMinutes" label="早退阈值(分钟)" min-width="9%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">启用</el-tag>
              <el-tag v-else type="info">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="规则类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择规则类型" style="width: 100%">
            <el-option label="固定班制" :value="1" />
            <el-option label="弹性工作制" :value="2" />
            <el-option label="排班制" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="上班时间" prop="workStartTime">
          <el-time-picker
            v-model="formData.workStartTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择上班时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="下班时间" prop="workEndTime">
          <el-time-picker
            v-model="formData.workEndTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择下班时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="迟到阈值" prop="lateMinutes">
          <el-input v-model="formData.lateMinutes" placeholder="请输入迟到阈值(分钟)" />
        </el-form-item>

        <el-form-item label="早退阈值" prop="earlyMinutes">
          <el-input v-model="formData.earlyMinutes" placeholder="请输入早退阈值(分钟)" />
        </el-form-item>

        <el-form-item label="旷工阈值" prop="absentHours">
          <el-input v-model="formData.absentHours" placeholder="请输入旷工阈值(小时)" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { AttendanceRule, AttendanceRuleListParams } from '@/types/attendance'
import {
  getAttendanceRuleList,
  addAttendanceRule,
  updateAttendanceRule,
  deleteAttendanceRule,
  batchDeleteAttendanceRules
} from '@/api/attendanceRule'

const queryParams = reactive<AttendanceRuleListParams>({
  name: '',
  type: null,
  status: null,
  page: 1,
  pageSize: 10
})

const tableData = ref<AttendanceRule[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<AttendanceRule>>({
  name: '',
  type: 1,
  workStartTime: '',
  workEndTime: '',
  lateMinutes: 0,
  earlyMinutes: 0,
  absentHours: 0,
  status: 1,
  remark: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  workStartTime: [{ required: true, message: '请选择上班时间', trigger: 'change' }],
  workEndTime: [{ required: true, message: '请选择下班时间', trigger: 'change' }]
}

const loadData = async () => {
  try {
    const res = await getAttendanceRuleList(queryParams)
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
  queryParams.name = ''
  queryParams.type = null
  queryParams.status = null
  queryParams.page = 1
  handleSearch()
}

const handleSelectionChange = (selection: AttendanceRule[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleAdd = () => {
  dialogTitle.value = '新增考勤规则'
  Object.assign(formData, {
    name: '',
    type: 1,
    workStartTime: '',
    workEndTime: '',
    lateMinutes: 0,
    earlyMinutes: 0,
    absentHours: 0,
    status: 1,
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: AttendanceRule) => {
  dialogTitle.value = '编辑考勤规则'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (row: AttendanceRule) => {
  try {
    await ElMessageBox.confirm('确定要删除该考勤规则吗？', '提示', {
      type: 'warning'
    })
    await deleteAttendanceRule(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      type: 'warning'
    })
    await batchDeleteAttendanceRules(selectedIds.value)
    ElMessage.success('批量删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateAttendanceRule(formData)
          ElMessage.success('更新成功')
        } else {
          await addAttendanceRule(formData)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '添加失败')
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.attendance-rule-tab {
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
