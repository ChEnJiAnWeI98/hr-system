<template>
  <div class="job-posting-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="职位编号">
            <el-input v-model="queryParams.jobNo" placeholder="请输入职位编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="职位名称">
            <el-input v-model="queryParams.jobTitle" placeholder="请输入职位名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="所属部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="职位类型">
            <el-select v-model="queryParams.jobType" placeholder="请选择职位类型" style="width: 150px" clearable>
              <el-option label="全职" :value="1" />
              <el-option label="兼职" :value="2" />
              <el-option label="实习" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="招聘中" :value="1" />
              <el-option label="已暂停" :value="2" />
              <el-option label="已关闭" :value="3" />
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
            发布职位
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
          <el-table-column prop="jobNo" label="职位编号" min-width="10%" />
          <el-table-column prop="jobTitle" label="职位名称" min-width="12%" />
          <el-table-column prop="departmentName" label="所属部门" min-width="10%" />
          <el-table-column prop="recruitCount" label="招聘人数" min-width="8%" />
          <el-table-column prop="jobType" label="职位类型" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.jobType === 1" type="success">全职</el-tag>
              <el-tag v-else-if="row.jobType === 2" type="primary">兼职</el-tag>
              <el-tag v-else-if="row.jobType === 3" type="warning">实习</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salaryRange" label="薪资范围" min-width="10%" />
          <el-table-column prop="publishPlatforms" label="发布平台" min-width="12%">
            <template #default="{ row }">
              <el-tag
                v-for="platform in row.publishPlatforms"
                :key="platform"
                style="margin-right: 4px"
                size="small"
              >
                {{ platform }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="浏览/申请" min-width="8%">
            <template #default="{ row }">
              {{ row.viewCount }}/{{ row.applyCount }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">招聘中</el-tag>
              <el-tag v-else-if="row.status === 2" type="warning">已暂停</el-tag>
              <el-tag v-else-if="row.status === 3" type="info">已关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">
                查看详情
              </el-button>
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                v-if="row.status === 1"
                link
                type="warning"
                @click="handlePause(row)"
              >
                暂停
              </el-button>
              <el-button
                v-else-if="row.status === 2"
                link
                type="success"
                @click="handleResume(row)"
              >
                恢复
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
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="职位编号" prop="jobNo">
          <el-input v-model="formData.jobNo" placeholder="请输入职位编号" />
        </el-form-item>

        <el-form-item label="职位名称" prop="jobTitle">
          <el-input v-model="formData.jobTitle" placeholder="请输入职位名称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入所属部门" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="recruitCount">
          <el-input v-model="formData.recruitCount" placeholder="请输入招聘人数" />
        </el-form-item>

        <el-form-item label="职位类型" prop="jobType">
          <el-select v-model="formData.jobType" placeholder="请选择职位类型" style="width: 100%">
            <el-option label="全职" :value="1" />
            <el-option label="兼职" :value="2" />
            <el-option label="实习" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="工作地点" prop="workLocation">
          <el-input v-model="formData.workLocation" placeholder="请输入工作地点" />
        </el-form-item>

        <el-form-item label="薪资范围" prop="salaryRange">
          <el-input v-model="formData.salaryRange" placeholder="例如：10K-15K" />
        </el-form-item>

        <el-form-item label="职位描述" prop="jobDescription">
          <el-input
            v-model="formData.jobDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入职位描述"
          />
        </el-form-item>

        <el-form-item label="任职要求" prop="jobRequirements">
          <el-input
            v-model="formData.jobRequirements"
            type="textarea"
            :rows="4"
            placeholder="请输入任职要求"
          />
        </el-form-item>

        <el-form-item label="发布平台" prop="publishPlatforms">
          <el-checkbox-group v-model="formData.publishPlatforms">
            <el-checkbox label="智联招聘" />
            <el-checkbox label="前程无忧" />
            <el-checkbox label="Boss直聘" />
            <el-checkbox label="拉勾网" />
            <el-checkbox label="猎聘网" />
            <el-checkbox label="公司官网" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="招聘中" :value="1" />
            <el-option label="已暂停" :value="2" />
            <el-option label="已关闭" :value="3" />
          </el-select>
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
      title="职位详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="职位编号">
          {{ detailData.jobNo }}
        </el-descriptions-item>
        <el-descriptions-item label="职位名称">
          {{ detailData.jobTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="所属部门">
          {{ detailData.departmentName }}
        </el-descriptions-item>
        <el-descriptions-item label="招聘人数">
          {{ detailData.recruitCount }}
        </el-descriptions-item>
        <el-descriptions-item label="职位类型">
          <el-tag v-if="detailData.jobType === 1" type="success">全职</el-tag>
          <el-tag v-else-if="detailData.jobType === 2" type="primary">兼职</el-tag>
          <el-tag v-else-if="detailData.jobType === 3" type="warning">实习</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="工作地点">
          {{ detailData.workLocation }}
        </el-descriptions-item>
        <el-descriptions-item label="薪资范围">
          {{ detailData.salaryRange }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success">招聘中</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="warning">已暂停</el-tag>
          <el-tag v-else-if="detailData.status === 3" type="info">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="浏览次数">
          {{ detailData.viewCount }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人数">
          {{ detailData.applyCount }}
        </el-descriptions-item>
        <el-descriptions-item label="发布平台" :span="2">
          <el-tag
            v-for="platform in detailData.publishPlatforms"
            :key="platform"
            style="margin-right: 8px"
          >
            {{ platform }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="职位描述" :span="2">
          {{ detailData.jobDescription }}
        </el-descriptions-item>
        <el-descriptions-item label="任职要求" :span="2">
          {{ detailData.jobRequirements }}
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">
          {{ detailData.publishTime }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailData.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ detailData.updateTime }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { JobPosting, JobPostingListParams } from '@/types/jobPosting'

defineOptions({
  name: 'RecruitmentJobPosting'
})

// 查询参数
const queryParams = reactive<JobPostingListParams>({
  jobNo: '',
  jobTitle: '',
  departmentName: '',
  jobType: null,
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<JobPosting[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<JobPosting>>({
  jobNo: '',
  jobTitle: '',
  departmentName: '',
  recruitCount: 0,
  jobType: 1,
  workLocation: '',
  salaryRange: '',
  jobDescription: '',
  jobRequirements: '',
  publishPlatforms: [],
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  jobNo: [{ required: true, message: '请输入职位编号', trigger: 'blur' }],
  jobTitle: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
  recruitCount: [{ required: true, message: '请输入招聘人数', trigger: 'blur' }],
  jobType: [{ required: true, message: '请选择职位类型', trigger: 'change' }],
  workLocation: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salaryRange: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }],
  jobDescription: [{ required: true, message: '请输入职位描述', trigger: 'blur' }],
  jobRequirements: [{ required: true, message: '请输入任职要求', trigger: 'blur' }],
  publishPlatforms: [{ required: true, message: '请选择发布平台', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<JobPosting>>({})

// 获取列表数据
const getList = async () => {
  // TODO: 调用API获取数据
  // const res = await getJobPostingList(queryParams)
  // tableData.value = res.data.list
  // total.value = res.data.total

  // Mock数据
  tableData.value = [
    {
      id: 1,
      jobNo: 'JOB001',
      jobTitle: '前端开发工程师',
      departmentName: '技术部',
      recruitCount: 2,
      jobType: 1,
      workLocation: '北京',
      salaryRange: '15K-25K',
      jobDescription: '负责公司前端项目开发',
      jobRequirements: '3年以上前端开发经验',
      publishPlatforms: ['智联招聘', 'Boss直聘', '拉勾网'],
      status: 1,
      viewCount: 150,
      applyCount: 35,
      publishTime: '2024-04-01 10:00:00',
      createTime: '2024-04-01 09:00:00',
      updateTime: '2024-04-01 10:00:00'
    },
    {
      id: 2,
      jobNo: 'JOB002',
      jobTitle: 'Java开发工程师',
      departmentName: '技术部',
      recruitCount: 3,
      jobType: 1,
      workLocation: '上海',
      salaryRange: '18K-30K',
      jobDescription: '负责后端服务开发',
      jobRequirements: '5年以上Java开发经验',
      publishPlatforms: ['前程无忧', 'Boss直聘', '猎聘网'],
      status: 1,
      viewCount: 200,
      applyCount: 48,
      publishTime: '2024-04-02 10:00:00',
      createTime: '2024-04-02 09:00:00',
      updateTime: '2024-04-02 10:00:00'
    },
    {
      id: 3,
      jobNo: 'JOB003',
      jobTitle: 'UI设计师',
      departmentName: '设计部',
      recruitCount: 1,
      jobType: 2,
      workLocation: '深圳',
      salaryRange: '12K-18K',
      jobDescription: '负责产品UI设计',
      jobRequirements: '2年以上UI设计经验',
      publishPlatforms: ['智联招聘', '拉勾网', '公司官网'],
      status: 2,
      viewCount: 80,
      applyCount: 12,
      publishTime: '2024-03-28 10:00:00',
      createTime: '2024-03-28 09:00:00',
      updateTime: '2024-04-03 15:00:00'
    },
    {
      id: 4,
      jobNo: 'JOB004',
      jobTitle: '产品经理',
      departmentName: '产品部',
      recruitCount: 2,
      jobType: 1,
      workLocation: '北京',
      salaryRange: '20K-35K',
      jobDescription: '负责产品规划和设计',
      jobRequirements: '5年以上产品经验',
      publishPlatforms: ['Boss直聘', '猎聘网'],
      status: 3,
      viewCount: 120,
      applyCount: 28,
      publishTime: '2024-03-20 10:00:00',
      createTime: '2024-03-20 09:00:00',
      updateTime: '2024-03-30 16:00:00'
    },
    {
      id: 5,
      jobNo: 'JOB005',
      jobTitle: '测试工程师',
      departmentName: '技术部',
      recruitCount: 2,
      jobType: 3,
      workLocation: '杭州',
      salaryRange: '8K-12K',
      jobDescription: '负责软件测试工作',
      jobRequirements: '应届生或1年经验',
      publishPlatforms: ['智联招聘', '前程无忧', '公司官网'],
      status: 1,
      viewCount: 95,
      applyCount: 42,
      publishTime: '2024-04-05 10:00:00',
      createTime: '2024-04-05 09:00:00',
      updateTime: '2024-04-05 10:00:00'
    }
  ]
  total.value = 5
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.jobNo = ''
  queryParams.jobTitle = ''
  queryParams.departmentName = ''
  queryParams.jobType = null
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 表格选择变化
const handleSelectionChange = (selection: JobPosting[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '发布职位'
  Object.assign(formData, {
    jobNo: '',
    jobTitle: '',
    departmentName: '',
    recruitCount: 0,
    jobType: 1,
    workLocation: '',
    salaryRange: '',
    jobDescription: '',
    jobRequirements: '',
    publishPlatforms: [],
    status: 1
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: JobPosting) => {
  dialogTitle.value = '编辑职位'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: JobPosting) => {
  detailData.value = { ...row }
  detailVisible.value = true
}

// 暂停
const handlePause = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要暂停该职位招聘吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API暂停
    // await pauseJobPosting(row.id)

    ElMessage.success('暂停成功')
    getList()
  } catch (error) {
    // 取消操作
  }
}

// 恢复
const handleResume = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要恢复该职位招聘吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API恢复
    // await resumeJobPosting(row.id)

    ElMessage.success('恢复成功')
    getList()
  } catch (error) {
    // 取消操作
  }
}

// 删除
const handleDelete = async (row: JobPosting) => {
  try {
    await ElMessageBox.confirm('确定要删除该职位吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API删除
    // await deleteJobPosting(row.id)

    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    // 取消操作
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用API批量删除
    // await batchDeleteJobPosting(selectedIds.value)

    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    // 取消操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // TODO: 调用API保存
      // if (formData.id) {
      //   await updateJobPosting(formData)
      // } else {
      //   await addJobPosting(formData)
      // }

      ElMessage.success('保存成功')
      dialogVisible.value = false
      getList()
    }
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.job-posting-container {
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
