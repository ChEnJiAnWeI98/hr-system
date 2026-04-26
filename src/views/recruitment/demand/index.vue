<template>
  <div class="recruitment-demand-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="需求编号">
            <el-input v-model="queryParams.demandNo" placeholder="请输入需求编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="申请部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入申请部门" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="招聘岗位">
            <el-input v-model="queryParams.positionName" placeholder="请输入招聘岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="紧急程度">
            <el-select v-model="queryParams.urgencyLevel" placeholder="请选择紧急程度" style="width: 150px" clearable>
              <el-option label="一般" :value="1" />
              <el-option label="紧急" :value="2" />
              <el-option label="非常紧急" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="审批状态">
            <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" style="width: 150px" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="已批准" :value="1" />
              <el-option label="已拒绝" :value="2" />
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
            新增需求
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
          <el-table-column prop="demandNo" label="需求编号" min-width="10%" />
          <el-table-column prop="departmentName" label="申请部门" min-width="10%" />
          <el-table-column prop="positionName" label="招聘岗位" min-width="12%" />
          <el-table-column prop="recruitCount" label="招聘人数" min-width="8%" />
          <el-table-column prop="urgencyLevel" label="紧急程度" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.urgencyLevel === 1" type="info">一般</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 2" type="warning">紧急</el-tag>
              <el-tag v-else-if="row.urgencyLevel === 3" type="danger">非常紧急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salaryRange" label="薪资范围" min-width="10%" />
          <el-table-column prop="expectedOnboardDate" label="期望到岗日期" min-width="10%" />
          <el-table-column prop="approvalStatus" label="审批状态" min-width="9%">
            <template #default="{ row }">
              <el-tag v-if="row.approvalStatus === 0" type="warning">待审批</el-tag>
              <el-tag v-else-if="row.approvalStatus === 1" type="success">已批准</el-tag>
              <el-tag v-else-if="row.approvalStatus === 2" type="danger">已拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="18%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link type="primary" @click="handleApprove(row)" v-if="row.approvalStatus === 0">
                审批
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item label="需求编号" prop="demandNo">
          <el-input v-model="formData.demandNo" placeholder="请输入需求编号" />
        </el-form-item>

        <el-form-item label="申请部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入申请部门" />
        </el-form-item>

        <el-form-item label="招聘岗位" prop="positionName">
          <el-input v-model="formData.positionName" placeholder="请输入招聘岗位" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="recruitCount">
          <el-input v-model="formData.recruitCount" placeholder="请输入招聘人数" />
        </el-form-item>

        <el-form-item label="紧急程度" prop="urgencyLevel">
          <el-select v-model="formData.urgencyLevel" placeholder="请选择紧急程度" style="width: 100%">
            <el-option label="一般" :value="1" />
            <el-option label="紧急" :value="2" />
            <el-option label="非常紧急" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="薪资范围" prop="salaryRange">
          <el-input v-model="formData.salaryRange" placeholder="请输入薪资范围（如：8K-12K）" />
        </el-form-item>

        <el-form-item label="期望到岗日期" prop="expectedOnboardDate">
          <el-date-picker
            v-model="formData.expectedOnboardDate"
            type="date"
            placeholder="请选择期望到岗日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="需求原因" prop="demandReason">
          <el-input
            v-model="formData.demandReason"
            type="textarea"
            :rows="3"
            placeholder="请输入需求原因"
          />
        </el-form-item>

        <el-form-item label="任职要求" prop="jobRequirements">
          <el-input
            v-model="formData.jobRequirements"
            type="textarea"
            :rows="3"
            placeholder="请输入任职要求"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
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
      title="需求详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="需求编号">{{ detailData.demandNo }}</el-descriptions-item>
        <el-descriptions-item label="申请部门">{{ detailData.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="招聘岗位">{{ detailData.positionName }}</el-descriptions-item>
        <el-descriptions-item label="招聘人数">{{ detailData.recruitCount }}</el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag v-if="detailData.urgencyLevel === 1" type="info">一般</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 2" type="warning">紧急</el-tag>
          <el-tag v-else-if="detailData.urgencyLevel === 3" type="danger">非常紧急</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="薪资范围">{{ detailData.salaryRange }}</el-descriptions-item>
        <el-descriptions-item label="期望到岗日期">{{ detailData.expectedOnboardDate }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">已批准</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">已拒绝</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="需求原因" :span="2">{{ detailData.demandReason }}</el-descriptions-item>
        <el-descriptions-item label="任职要求" :span="2">{{ detailData.jobRequirements }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" v-if="detailData.createTime">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" v-if="detailData.updateTime">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="审批人" v-if="detailData.approver">{{ detailData.approver }}</el-descriptions-item>
        <el-descriptions-item label="审批时间" v-if="detailData.approvalTime">{{ detailData.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2" v-if="detailData.approvalComment">{{ detailData.approvalComment }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approvalVisible"
      title="审批需求"
      width="500px"
      @close="handleApprovalDialogClose"
    >
      <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef" label-width="100px">
        <el-form-item label="审批结果" prop="approvalResult">
          <el-radio-group v-model="approvalForm.approvalResult">
            <el-radio :value="2">批准</el-radio>
            <el-radio :value="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见" prop="approvalOpinion">
          <el-input
            v-model="approvalForm.approvalOpinion"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApprovalSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { RecruitmentDemand, RecruitmentDemandListParams } from '@/types/recruitmentDemand'
import {
  getRecruitmentDemandList,
  getRecruitmentDemandDetail,
  getDetail,
  addRecruitmentDemand,
  updateRecruitmentDemand,
  removeRecruitmentDemand,
  batchDeleteRecruitmentDemand,
  approveRecruitmentDemand
} from '@/api/recruitmentDemand'

defineOptions({
  name: 'RecruitmentDemand'
})

// 查询参数
const queryParams = reactive<RecruitmentDemandListParams>({
  demandNo: '',
  departmentName: '',
  positionName: '',
  urgencyLevel: null,
  approvalStatus: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<RecruitmentDemand[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增需求')
const detailVisible = ref(false)
const approvalVisible = ref(false)

// 表单数据
const formData = reactive<Partial<RecruitmentDemand>>({
  demandNo: '',
  departmentName: '',
  positionName: '',
  recruitCount: undefined,
  urgencyLevel: 1,
  salaryRange: '',
  expectedOnboardDate: '',
  demandReason: '',
  jobRequirements: '',
  remark: '',
  approvalStatus: 0
})

// 详情数据
const detailData = ref<Partial<RecruitmentDemand>>({})

// 审批表单
const approvalForm = reactive({
  id: 0,
  approvalResult: 2,
  approvalOpinion: ''
})

// 表单引用
const formRef = ref()
const approvalFormRef = ref()

// 表单验证规则
const formRules = {
  demandNo: [{ required: true, message: '请输入需求编号', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入申请部门', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入招聘岗位', trigger: 'blur' }],
  recruitCount: [{ required: true, message: '请输入招聘人数', trigger: 'blur' }],
  urgencyLevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  salaryRange: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }],
  expectedOnboardDate: [{ required: true, message: '请选择期望到岗日期', trigger: 'change' }]
}

// 审批表单验证规则
const approvalRules = {
  approvalResult: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  approvalOpinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

// 加载数据
const loadData = async () => {
  try {
    const res = await getRecruitmentDemandList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.demandNo = ''
  queryParams.departmentName = ''
  queryParams.positionName = ''
  queryParams.urgencyLevel = null
  queryParams.approvalStatus = null
  queryParams.page = 1
  queryParams.pageSize = 20
  loadData()
}

// 表格选择变化
const handleSelectionChange = (selection: RecruitmentDemand[]) => {
  selectedIds.value = selection.map(item => item.id!)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增需求'
  Object.assign(formData, {
    id: undefined,
    demandNo: '',
    departmentName: '',
    positionName: '',
    recruitCount: undefined,
    urgencyLevel: 1,
    salaryRange: '',
    expectedOnboardDate: '',
    demandReason: '',
    jobRequirements: '',
    approvalStatus: 0
  })
  dialogVisible.value = true
}

// 查看详情
const handleView = async (row: RecruitmentDemand) => {
  try {
    const res = await getDetail(row.id!)
    if (res.code === 200) {
      detailData.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

// 审批
const handleApprove = (row: RecruitmentDemand) => {
  approvalForm.id = row.id!
  approvalForm.approvalResult = 2
  approvalForm.approvalOpinion = ''
  approvalVisible.value = true
}

// 删除
const handleDelete = (row: RecruitmentDemand) => {
  ElMessageBox.confirm('确定要删除该需求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      if (removeRecruitmentDemand) {
        const res = await removeRecruitmentDemand(row.id!)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          loadData()
        }
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要删除选中的需求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteRecruitmentDemand(selectedIds.value)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = formData.id
          ? await updateRecruitmentDemand(formData as RecruitmentDemand)
          : await addRecruitmentDemand(formData as RecruitmentDemand)

        if (res.code === 200) {
          ElMessage.success(formData.id ? '更新成功' : '新增成功')
          dialogVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

// 提交审批
const handleApprovalSubmit = async () => {
  if (!approvalFormRef.value) return

  await approvalFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await approveRecruitmentDemand({
          id: approvalForm.id,
          approvalResult: approvalForm.approvalResult,
          approvalOpinion: approvalForm.approvalOpinion
        })

        if (res.code === 200) {
          ElMessage.success('审批成功')
          approvalVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error('审批失败')
      }
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 关闭审批弹窗
const handleApprovalDialogClose = () => {
  approvalFormRef.value?.resetFields()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.recruitment-demand-container {
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
