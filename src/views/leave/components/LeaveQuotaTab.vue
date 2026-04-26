<template>
  <div class="leave-quota-tab">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="假期类型">
            <el-select v-model="queryParams.leaveTypeId" placeholder="请选择假期类型" style="width: 150px" clearable>
              <el-option
                v-for="item in leaveTypeList"
                :key="item.id"
                :label="item.leaveTypeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="年份">
            <el-date-picker
              v-model="queryParams.year"
              type="year"
              placeholder="请选择年份"
              value-format="YYYY"
              style="width: 150px"
              clearable
            />
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
          <el-button type="primary" @click="handleGrant">
            <el-icon><Plus /></el-icon>
            发放额度
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="employeeName" label="员工姓名" min-width="12%" />
          <el-table-column prop="departmentName" label="部门" min-width="12%" />
          <el-table-column prop="leaveTypeName" label="假期类型" min-width="12%" />
          <el-table-column prop="totalQuota" label="总额度" min-width="10%" />
          <el-table-column prop="usedQuota" label="已用额度" min-width="10%" />
          <el-table-column prop="remainingQuota" label="剩余额度" min-width="10%">
            <template #default="{ row }">
              <span :style="{ color: row.remainingQuota <= 0 ? '#f56c6c' : '#67c23a' }">
                {{ row.remainingQuota }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="year" label="年份" min-width="10%" />
          <el-table-column prop="createTime" label="创建时间" min-width="14%" />
          <el-table-column label="操作" min-width="14%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleAdjust(row)">
                调整额度
              </el-button>
              <el-button link type="primary" @click="handleViewDetail(row)">
                查看明细
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

    <!-- 发放额度弹窗 -->
    <el-dialog
      v-model="grantDialogVisible"
      title="发放额度"
      width="500px"
      @close="handleGrantDialogClose"
    >
      <el-form
        ref="grantFormRef"
        :model="grantFormData"
        :rules="grantFormRules"
        label-width="100px"
      >
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="grantFormData.employeeId" placeholder="请选择员工" style="width: 100%">
            <el-option
              v-for="item in employeeList"
              :key="item.id"
              :label="`${item.name} (${item.code})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="假期类型" prop="leaveTypeId">
          <el-select v-model="grantFormData.leaveTypeId" placeholder="请选择假期类型" style="width: 100%">
            <el-option
              v-for="item in leaveTypeList"
              :key="item.id"
              :label="item.leaveTypeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发放额度" prop="totalQuota">
          <el-input v-model.number="grantFormData.totalQuota" placeholder="请输入发放额度" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-date-picker
            v-model="grantFormData.year"
            type="year"
            placeholder="请选择年份"
            value-format="YYYY"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发放原因" prop="grantReason">
          <el-input
            v-model="grantFormData.grantReason"
            type="textarea"
            :rows="3"
            placeholder="请输入发放原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="grantDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGrantSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 调整额度弹窗 -->
    <el-dialog
      v-model="adjustDialogVisible"
      title="调整额度"
      width="500px"
      @close="handleAdjustDialogClose"
    >
      <el-form
        ref="adjustFormRef"
        :model="adjustFormData"
        :rules="adjustFormRules"
        label-width="100px"
      >
        <el-form-item label="员工姓名">
          <el-input :value="currentRow?.employeeName" disabled />
        </el-form-item>
        <el-form-item label="假期类型">
          <el-input :value="currentRow?.leaveTypeName" disabled />
        </el-form-item>
        <el-form-item label="当前额度">
          <el-input :value="currentRow?.totalQuota" disabled />
        </el-form-item>
        <el-form-item label="调整额度" prop="adjustQuota">
          <el-input
            v-model.number="adjustFormData.adjustQuota"
            placeholder="正数增加，负数减少"
          />
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            调整后额度：{{ (currentRow?.totalQuota || 0) + (adjustFormData.adjustQuota || 0) }}
          </div>
        </el-form-item>
        <el-form-item label="调整原因" prop="adjustReason">
          <el-input
            v-model="adjustFormData.adjustReason"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdjustSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="额度明细"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ detailData?.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData?.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="假期类型">{{ detailData?.leaveTypeName }}</el-descriptions-item>
        <el-descriptions-item label="年份">{{ detailData?.year }}</el-descriptions-item>
        <el-descriptions-item label="总额度">{{ detailData?.totalQuota }}</el-descriptions-item>
        <el-descriptions-item label="已用额度">{{ detailData?.usedQuota }}</el-descriptions-item>
        <el-descriptions-item label="剩余额度">
          <span :style="{ color: (detailData?.remainingQuota || 0) <= 0 ? '#f56c6c' : '#67c23a' }">
            {{ detailData?.remainingQuota }}
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">发放记录</el-divider>
      <el-table :data="detailData?.grantRecords || []" max-height="200">
        <el-table-column prop="grantDate" label="发放日期" min-width="14%" />
        <el-table-column prop="grantQuota" label="发放额度" min-width="8%" />
        <el-table-column prop="grantReason" label="发放原因" />
        <el-table-column prop="operator" label="操作人" min-width="10%" />
      </el-table>

      <el-divider content-position="left">使用记录</el-divider>
      <el-table :data="detailData?.usageRecords || []" max-height="200">
        <el-table-column prop="usageDate" label="使用日期" min-width="14%" />
        <el-table-column prop="usageQuota" label="使用额度" min-width="8%" />
        <el-table-column prop="usageReason" label="使用原因" />
        <el-table-column prop="applicationId" label="关联申请ID" min-width="10%" />
      </el-table>

      <el-divider content-position="left">调整记录</el-divider>
      <el-table :data="detailData?.adjustRecords || []" max-height="200">
        <el-table-column prop="adjustDate" label="调整日期" min-width="14%" />
        <el-table-column prop="adjustQuota" label="调整额度" min-width="8%">
          <template #default="{ row }">
            <span :style="{ color: row.adjustQuota > 0 ? '#67c23a' : '#f56c6c' }">
              {{ row.adjustQuota > 0 ? '+' : '' }}{{ row.adjustQuota }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustReason" label="调整原因" />
        <el-table-column prop="operator" label="操作人" min-width="10%" />
      </el-table>

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
import type { LeaveQuota, LeaveQuotaListParams, LeaveLedger } from '@/types/leave'
import {
  getLeaveQuotaList,
  grantLeaveQuota,
  adjustLeaveQuota
} from '@/api/leaveQuota'
import { getLeaveLedgerDetail } from '@/api/leaveLedger'
import { getLeaveTypeList } from '@/api/leaveType'

defineOptions({
  name: 'LeaveQuotaTab'
})

// 查询参数
const queryParams = reactive<LeaveQuotaListParams>({
  employeeName: '',
  departmentName: '',
  leaveTypeId: null,
  year: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<LeaveQuota[]>([])
const total = ref(0)

// 假期类型列表
const leaveTypeList = ref<any[]>([])

// 员工列表
const employeeList = ref<any[]>([])

// 发放额度弹窗
const grantDialogVisible = ref(false)
const grantFormRef = ref<FormInstance>()
const grantFormData = reactive({
  employeeId: null as number | null,
  leaveTypeId: null as number | null,
  totalQuota: null as number | null,
  year: new Date().getFullYear(),
  grantReason: ''
})

const grantFormRules: FormRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  leaveTypeId: [{ required: true, message: '请选择假期类型', trigger: 'change' }],
  totalQuota: [
    { required: true, message: '请输入发放额度', trigger: 'blur' },
    { type: 'number', min: 0.1, message: '发放额度必须大于0', trigger: 'blur' }
  ],
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  grantReason: [{ required: true, message: '请输入发放原因', trigger: 'blur' }]
}

// 调整额度弹窗
const adjustDialogVisible = ref(false)
const adjustFormRef = ref<FormInstance>()
const currentRow = ref<LeaveQuota | null>(null)
const adjustFormData = reactive({
  adjustQuota: null as number | null,
  adjustReason: ''
})

const adjustFormRules: FormRules = {
  adjustQuota: [
    { required: true, message: '请输入调整额度', trigger: 'blur' },
    { type: 'number', message: '调整额度必须是数字', trigger: 'blur' }
  ],
  adjustReason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

// 明细弹窗
const detailDialogVisible = ref(false)
const detailData = ref<LeaveLedger | null>(null)

// 获取列表数据
const getList = async () => {
  try {
    const res = await getLeaveQuotaList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取假期额度列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.leaveTypeId = null
  queryParams.year = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 发放额度
const handleGrant = () => {
  grantDialogVisible.value = true
}

// 发放额度提交
const handleGrantSubmit = async () => {
  if (!grantFormRef.value) return
  await grantFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 获取假期类型名称
        const leaveType = leaveTypeList.value.find(item => item.id === grantFormData.leaveTypeId)
        const leaveTypeName = leaveType?.leaveTypeName || ''

        const res = await grantLeaveQuota({
          employeeIds: [grantFormData.employeeId!],
          leaveTypeId: grantFormData.leaveTypeId!,
          leaveTypeName,
          totalQuota: grantFormData.totalQuota!,
          year: grantFormData.year,
          grantReason: grantFormData.grantReason
        })
        if (res.code === 200) {
          ElMessage.success('发放成功')
          grantDialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('发放额度失败:', error)
      }
    }
  })
}

// 发放弹窗关闭
const handleGrantDialogClose = () => {
  grantFormRef.value?.resetFields()
  Object.assign(grantFormData, {
    employeeId: null,
    leaveTypeId: null,
    totalQuota: null,
    year: new Date().getFullYear(),
    grantReason: ''
  })
}

// 调整额度
const handleAdjust = (row: LeaveQuota) => {
  currentRow.value = row
  adjustDialogVisible.value = true
}

// 调整额度提交
const handleAdjustSubmit = async () => {
  if (!adjustFormRef.value || !currentRow.value) return
  await adjustFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await adjustLeaveQuota({
          id: currentRow.value!.id,
          adjustType: adjustFormData.adjustQuota! > 0 ? 'increase' : 'decrease',
          adjustQuota: Math.abs(adjustFormData.adjustQuota!),
          adjustReason: adjustFormData.adjustReason
        })
        if (res.code === 200) {
          ElMessage.success('调整成功')
          adjustDialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('调整额度失败:', error)
      }
    }
  })
}

// 调整弹窗关闭
const handleAdjustDialogClose = () => {
  adjustFormRef.value?.resetFields()
  currentRow.value = null
  Object.assign(adjustFormData, {
    adjustQuota: null,
    adjustReason: ''
  })
}

// 查看明细
const handleViewDetail = async (row: LeaveQuota) => {
  try {
    const res = await getLeaveLedgerDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取明细失败:', error)
  }
}

// 加载假期类型列表
const loadLeaveTypes = async () => {
  try {
    const res = await getLeaveTypeList({ page: 1, pageSize: 100, status: 1 })
    leaveTypeList.value = res.data.list
  } catch (error) {
    ElMessage.error('加载假期类型失败')
  }
}

// 加载员工列表
const loadEmployees = async () => {
  // 模拟数据
  employeeList.value = [
    { id: 1, name: '张三', code: 'E001' },
    { id: 2, name: '李四', code: 'E002' },
    { id: 3, name: '王五', code: 'E003' }
  ]
}

onMounted(() => {
  getList()
  loadLeaveTypes()
  loadEmployees()
})
</script>

<style scoped lang="scss">
.leave-quota-tab {
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
