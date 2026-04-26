<template>
  <div class="training-course-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="课程编号">
            <el-input v-model="queryParams.courseNo" placeholder="请输入课程编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="课程名称">
            <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="课程类型">
            <el-select v-model="queryParams.courseType" placeholder="请选择课程类型" style="width: 150px" clearable>
              <el-option label="内部课程" :value="1" />
              <el-option label="外部课程" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="分类">
            <el-input v-model="queryParams.category" placeholder="请输入分类" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="讲师">
            <el-input v-model="queryParams.instructor" placeholder="请输入讲师" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="2" />
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
            新增课程
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
          <el-table-column prop="courseNo" label="课程编号" min-width="10%" />
          <el-table-column prop="courseName" label="课程名称" min-width="15%" />
          <el-table-column prop="courseType" label="课程类型" min-width="10%">
            <template #default="{ row }">
              <el-tag v-if="row.courseType === 1" type="primary">内部课程</el-tag>
              <el-tag v-else-if="row.courseType === 2" type="success">外部课程</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" min-width="10%" />
          <el-table-column prop="instructor" label="讲师" min-width="10%" />
          <el-table-column prop="duration" label="学时" min-width="8%" />
          <el-table-column prop="capacity" label="容纳人数" min-width="10%" />
          <el-table-column prop="credits" label="学分" min-width="8%" />
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success">启用</el-tag>
              <el-tag v-else-if="row.status === 2" type="info">停用</el-tag>
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
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="课程编号" prop="courseNo">
          <el-input v-model="formData.courseNo" placeholder="请输入课程编号" />
        </el-form-item>

        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model="formData.courseType" placeholder="请选择课程类型" style="width: 100%">
            <el-option label="内部课程" :value="1" />
            <el-option label="外部课程" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-input v-model="formData.category" placeholder="请输入分类" />
        </el-form-item>

        <el-form-item label="讲师" prop="instructor">
          <el-input v-model="formData.instructor" placeholder="请输入讲师" />
        </el-form-item>

        <el-form-item label="学时" prop="duration">
          <el-input v-model="formData.duration" placeholder="请输入学时" />
        </el-form-item>

        <el-form-item label="容纳人数" prop="capacity">
          <el-input v-model="formData.capacity" placeholder="请输入容纳人数" />
        </el-form-item>

        <el-form-item label="学分" prop="credits">
          <el-input v-model="formData.credits" placeholder="请输入学分" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="课程简介" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入课程简介"
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
      title="课程详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="课程编号">{{ detailData.courseNo }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ detailData.courseName }}</el-descriptions-item>
        <el-descriptions-item label="课程类型">
          <el-tag v-if="detailData.courseType === 1" type="primary">内部课程</el-tag>
          <el-tag v-else-if="detailData.courseType === 2" type="success">外部课程</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分类">{{ detailData.category }}</el-descriptions-item>
        <el-descriptions-item label="讲师">{{ detailData.instructor }}</el-descriptions-item>
        <el-descriptions-item label="学时">{{ detailData.duration }}</el-descriptions-item>
        <el-descriptions-item label="容纳人数">{{ detailData.capacity }}</el-descriptions-item>
        <el-descriptions-item label="学分">{{ detailData.credits }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success">启用</el-tag>
          <el-tag v-else-if="detailData.status === 2" type="info">停用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="课程简介" :span="2">{{ detailData.description }}</el-descriptions-item>
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
import { Plus } from '@element-plus/icons-vue'
import type { TrainingCourse, TrainingCourseListParams } from '@/types/training'
import {
  getTrainingCourseList,
  getTrainingCourseDetail,
  addTrainingCourse,
  updateTrainingCourse,
  removeTrainingCourse
} from '@/api/trainingCourse'

defineOptions({
  name: 'TrainingCourse'
})

// 查询参数
const queryParams = reactive<TrainingCourseListParams>({
  courseNo: '',
  courseName: '',
  courseType: null,
  category: '',
  instructor: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<TrainingCourse[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = reactive<Partial<TrainingCourse>>({
  courseNo: '',
  courseName: '',
  courseType: 1,
  category: '',
  instructor: '',
  duration: 0,
  capacity: 0,
  credits: 0,
  status: 1,
  description: ''
})

// 表单验证规则
const formRules: FormRules = {
  courseNo: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  courseType: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
  category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  instructor: [{ required: true, message: '请输入讲师', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入学时', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }],
  credits: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 详情弹窗
const detailVisible = ref(false)
const detailData = ref<Partial<TrainingCourse>>({})

/**
 * 获取列表数据
 */
const getList = async () => {
  try {
    const res = await getTrainingCourseList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.courseNo = ''
  queryParams.courseName = ''
  queryParams.courseType = null
  queryParams.category = ''
  queryParams.instructor = ''
  queryParams.status = null
  queryParams.page = 1
  getList()
}

/**
 * 表格选择变化
 */
const handleSelectionChange = (selection: TrainingCourse[]) => {
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 新增
 */
const handleAdd = () => {
  dialogTitle.value = '新增课程'
  dialogVisible.value = true
  Object.assign(formData, {
    id: undefined,
    courseNo: '',
    courseName: '',
    courseType: 1,
    category: '',
    instructor: '',
    duration: 0,
    capacity: 0,
    credits: 0,
    status: 1,
    description: ''
  })
  formRef.value?.clearValidate()
}

/**
 * 编辑
 */
const handleEdit = async (row: TrainingCourse) => {
  try {
    const res = await getTrainingCourseDetail(row.id)
    if (res.code === 200) {
      dialogTitle.value = '编辑课程'
      dialogVisible.value = true
      Object.assign(formData, res.data)
      formRef.value?.clearValidate()
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

/**
 * 查看详情
 */
const handleView = async (row: TrainingCourse) => {
  try {
    const res = await getTrainingCourseDetail(row.id)
    if (res.code === 200) {
      detailData.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          await updateTrainingCourse(formData as TrainingCourse)
          ElMessage.success('更新成功')
        } else {
          await addTrainingCourse(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '新增失败')
      }
    }
  })
}

/**
 * 删除
 */
const handleDelete = (row: TrainingCourse) => {
  ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await removeTrainingCourse?.(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

/**
 * 批量删除
 */
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await Promise.all(selectedIds.value.map(id => removeTrainingCourse?.(id)))
      ElMessage.success('批量删除成功')
      getList()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.training-course-container {
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
