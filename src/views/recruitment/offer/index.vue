<template>
  <div class="offer-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="Offer编号">
            <el-input v-model="queryParams.offerNo" placeholder="请输入Offer编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="候选人姓名">
            <el-input v-model="queryParams.candidateName" placeholder="请输入候选人姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="入职岗位">
            <el-input v-model="queryParams.positionName" placeholder="请输入入职岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="Offer状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="1" />
              <el-option label="已批准" :value="2" />
              <el-option label="已拒绝" :value="3" />
              <el-option label="已发送" :value="4" />
              <el-option label="已接受" :value="5" />
              <el-option label="已拒绝" :value="6" />
              <el-option label="已失效" :value="7" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            创建Offer
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
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%" />
          <el-table-column prop="offerNo" label="Offer编号" min-width="10%" />
          <el-table-column prop="candidateName" label="候选人姓名" min-width="10%" />
          <el-table-column prop="positionName" label="入职岗位" min-width="10%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column prop="salary" label="Offer薪资" min-width="10%" />
          <el-table-column prop="expectedJoinDate" label="期望入职日期" min-width="10%" />
          <el-table-column prop="status" label="状态" min-width="11%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.status === 2" type="success">已批准</el-tag>
              <el-tag v-else-if="row.status === 3" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="row.status === 4" type="primary">已发送</el-tag>
              <el-tag v-else-if="row.status === 5" type="success">已接受</el-tag>
              <el-tag v-else-if="row.status === 6" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="row.status === 7" type="info">已失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="24%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button
                link
                type="warning"
                :disabled="row.status !== 1"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                link
                type="primary"
                :disabled="row.status !== 2"
                @click="handleSend(row)"
              >
                发送Offer
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

    <!-- 创建/编辑Offer弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="候选人姓名" prop="candidateName">
              <el-input v-model="formData.candidateName" placeholder="请输入候选人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职岗位" prop="positionName">
              <el-input v-model="formData.positionName" placeholder="请输入入职岗位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentName">
              <el-input v-model="formData.departmentName" placeholder="请输入所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地点" prop="workLocation">
              <el-input v-model="formData.workLocation" placeholder="请输入工作地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="薪资待遇" prop="salary">
              <el-input v-model="formData.salary" placeholder="请输入薪资待遇" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试用期薪资" prop="probationSalary">
              <el-input v-model="formData.probationSalary" placeholder="请输入试用期薪资" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="试用期" prop="probationPeriod">
              <el-input v-model.number="formData.probationPeriod" placeholder="请输入试用期（月）">
                <template #append>月</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望入职日期" prop="expectedJoinDate">
              <el-date-picker
                v-model="formData.expectedJoinDate"
                type="date"
                placeholder="请选择期望入职日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="福利待遇">
          <el-input
            v-model="formData.benefits"
            type="textarea"
            :rows="3"
            placeholder="请输入福利待遇"
          />
        </el-form-item>

        <el-form-item label="其他说明">
          <el-input
            v-model="formData.otherInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入其他说明"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="Offer详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Offer编号">{{ detailData.offerNo }}</el-descriptions-item>
        <el-descriptions-item label="简历编号">{{ detailData.resumeNo }}</el-descriptions-item>
        <el-descriptions-item label="候选人姓名">{{ detailData.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="入职岗位">{{ detailData.positionName }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="工作地点">{{ detailData.workLocation }}</el-descriptions-item>
        <el-descriptions-item label="薪资待遇">{{ detailData.salary }}</el-descriptions-item>
        <el-descriptions-item label="试用期薪资">{{ detailData.probationSalary }}</el-descriptions-item>
        <el-descriptions-item label="试用期">{{ detailData.probationPeriod }}月</el-descriptions-item>
        <el-descriptions-item label="期望入职日期">{{ detailData.expectedJoinDate }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="success">已批准</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="detailData.status === 4" type="primary">已发送</el-tag>
          <el-tag v-else-if="detailData.status === 5" type="success">已接受</el-tag>
          <el-tag v-else-if="detailData.status === 6" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="detailData.status === 7" type="info">已失效</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="福利待遇" :span="2">{{ detailData.benefits || '-' }}</el-descriptions-item>
        <el-descriptions-item label="其他说明" :span="2">{{ detailData.otherInfo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="detailData.approverName">{{ detailData.approverName }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="detailData.approveTime">{{ detailData.approveTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="detailData.approveRemark">{{ detailData.approveRemark }}</el-descriptions-item>
        <el-descriptions-item label="发送时间" v-if="detailData.sendTime">{{ detailData.sendTime }}</el-descriptions-item>
        <el-descriptions-item label="响应时间" v-if="detailData.responseTime">{{ detailData.responseTime }}</el-descriptions-item>
        <el-descriptions-item label="响应意见" :span="2" v-if="detailData.responseRemark">{{ detailData.responseRemark }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approveVisible"
      title="审批Offer"
      width="600px"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveRules"
        label-width="100px"
      >
        <el-form-item label="审批结果" prop="status">
          <el-radio-group v-model="approveForm.status">
            <el-radio :label="2">批准</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见" prop="approveRemark">
          <el-input
            v-model="approveForm.approveRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Offer, OfferListParams } from '@/types/recruitment'

defineOptions({
  name: 'RecruitmentOffer'
})

// 查询参数
const queryParams = reactive<OfferListParams>({
  offerNo: '',
  candidateName: '',
  positionName: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Offer[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const detailVisible = ref(false)
const approveVisible = ref(false)

// 表单数据
const formRef = ref<FormInstance>()
const formData = reactive<Partial<Offer>>({
  candidateName: '',
  positionName: '',
  departmentName: '',
  workLocation: '',
  salary: '',
  probationSalary: '',
  probationPeriod: 3,
  expectedJoinDate: '',
  benefits: '',
  otherInfo: ''
})

// 详情数据
const detailData = ref<Partial<Offer>>({})

// 审批表单
const approveFormRef = ref<FormInstance>()
const approveForm = reactive({
  id: 0,
  status: 2,
  approveRemark: ''
})

// 表单验证规则
const formRules: FormRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入入职岗位', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资待遇', trigger: 'blur' }],
  probationSalary: [{ required: true, message: '请输入试用期薪资', trigger: 'blur' }],
  probationPeriod: [{ required: true, message: '请输入试用期', trigger: 'blur' }],
  expectedJoinDate: [{ required: true, message: '请选择期望入职日期', trigger: 'change' }]
}

// 审批表单验证规则
const approveRules: FormRules = {
  status: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  approveRemark: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

// 获取列表数据
const getList = async () => {
  // TODO: 调用API获取数据
  // const res = await getOfferList(queryParams)
  // tableData.value = res.data.list
  // total.value = res.data.total

  // Mock数据
  tableData.value = [
    {
      id: 1,
      offerNo: 'OF202401001',
      resumeId: 1,
      resumeNo: 'RS202401001',
      candidateName: '张三',
      positionName: '前端开发工程师',
      departmentName: '技术部',
      status: 1,
      salary: '15000-20000元/月',
      probationPeriod: 3,
      probationSalary: '12000元/月',
      expectedJoinDate: '2024-02-01',
      workLocation: '北京',
      benefits: '五险一金、带薪年假、节日福利',
      otherInfo: '',
      creatorId: 1,
      creatorName: '管理员',
      createTime: '2024-01-15 10:00:00',
      updateTime: '2024-01-15 10:00:00'
    },
    {
      id: 2,
      offerNo: 'OF202401002',
      resumeId: 2,
      resumeNo: 'RS202401002',
      candidateName: '李四',
      positionName: 'Java开发工程师',
      departmentName: '技术部',
      status: 2,
      salary: '18000-25000元/月',
      probationPeriod: 3,
      probationSalary: '15000元/月',
      expectedJoinDate: '2024-02-15',
      workLocation: '上海',
      benefits: '五险一金、带薪年假、节日福利、年终奖',
      otherInfo: '',
      approverName: '张经理',
      approveTime: '2024-01-16 14:30:00',
      approveRemark: '同意发放Offer',
      creatorId: 1,
      creatorName: '管理员',
      createTime: '2024-01-15 11:00:00',
      updateTime: '2024-01-16 14:30:00'
    },
    {
      id: 3,
      offerNo: 'OF202401003',
      resumeId: 3,
      resumeNo: 'RS202401003',
      candidateName: '王五',
      positionName: '产品经理',
      departmentName: '产品部',
      status: 4,
      salary: '20000-30000元/月',
      probationPeriod: 6,
      probationSalary: '18000元/月',
      expectedJoinDate: '2024-03-01',
      workLocation: '深圳',
      benefits: '五险一金、带薪年假、节日福利、年终奖、股权激励',
      otherInfo: '',
      approverName: '李总监',
      approveTime: '2024-01-17 09:00:00',
      approveRemark: '同意发放Offer',
      sendTime: '2024-01-17 10:00:00',
      creatorId: 1,
      creatorName: '管理员',
      createTime: '2024-01-16 15:00:00',
      updateTime: '2024-01-17 10:00:00'
    }
  ]
  total.value = 3
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.offerNo = ''
  queryParams.candidateName = ''
  queryParams.positionName = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 表格选择变化
const handleSelectionChange = (selection: Offer[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '创建Offer'
  Object.assign(formData, {
    candidateName: '',
    positionName: '',
    departmentName: '',
    workLocation: '',
    salary: '',
    probationSalary: '',
    probationPeriod: 3,
    expectedJoinDate: '',
    benefits: '',
    otherInfo: ''
  })
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: Offer) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 审批
const handleApprove = (row: Offer) => {
  approveForm.id = row.id
  approveForm.status = 2
  approveForm.approveRemark = ''
  approveVisible.value = true
}

// 审批提交
const handleApproveSubmit = async () => {
  if (!approveFormRef.value) return

  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      // TODO: 调用API提交审批
      // await approveOffer(approveForm)

      ElMessage.success('审批成功')
      approveVisible.value = false
      getList()
    }
  })
}

// 发送Offer
const handleSend = async (row: Offer) => {
  try {
    await ElMessageBox.confirm('确认发送Offer给候选人吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API发送Offer
    // await sendOffer(row.id)

    ElMessage.success('发送成功')
    getList()
  } catch {
    // 取消操作
  }
}

// 删除
const handleDelete = async (row: Offer) => {
  try {
    await ElMessageBox.confirm('确认删除该Offer吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API删除
    // await deleteOffer(row.id)

    ElMessage.success('删除成功')
    getList()
  } catch {
    // 取消操作
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条Offer吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API批量删除
    // await batchDeleteOffer(selectedIds.value)

    ElMessage.success('删除成功')
    getList()
  } catch {
    // 取消操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // TODO: 调用API提交
      // if (formData.id) {
      //   await updateOffer(formData)
      // } else {
      //   await addOffer(formData)
      // }

      ElMessage.success('操作成功')
      dialogVisible.value = false
      getList()
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.offer-container {
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
