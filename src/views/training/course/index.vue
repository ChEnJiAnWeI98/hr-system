<template>
  <div class="course-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="课程编号">
            <el-input
              v-model="queryParams.courseCode"
              placeholder="请输入课程编号"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item label="课程名称">
            <el-input
              v-model="queryParams.courseName"
              placeholder="请输入课程名称"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item label="课程分类">
            <el-select
              v-model="queryParams.category"
              placeholder="请选择"
              style="width: 150px"
              clearable
            >
              <el-option
                v-for="(label, key) in COURSE_CATEGORY_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="交付方式">
            <el-select
              v-model="queryParams.deliveryMode"
              placeholder="请选择"
              style="width: 120px"
              clearable
            >
              <el-option
                v-for="(label, key) in DELIVERY_MODE_LABEL"
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
              style="width: 120px"
              clearable
            >
              <el-option label="已上架" :value="1" />
              <el-option label="未上架" :value="0" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增课程
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
          <el-table-column prop="courseCode" label="课程编号" width="130" />
          <el-table-column prop="courseName" label="课程名称" min-width="220" show-overflow-tooltip />
          <el-table-column label="分类" width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="COURSE_CATEGORY_TYPE[row.category as CourseCategory]" size="small">
                {{ COURSE_CATEGORY_LABEL[row.category as CourseCategory] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="instructorName" label="讲师" width="100" />
          <el-table-column label="课时" width="80" align="center">
            <template #default="{ row }">{{ row.duration }}h</template>
          </el-table-column>
          <el-table-column label="参考费用" width="110" align="right">
            <template #default="{ row }">
              <span v-if="row.cost > 0">¥{{ row.cost.toLocaleString() }}</span>
              <span v-else style="color: #67c23a">免费</span>
            </template>
          </el-table-column>
          <el-table-column label="交付方式" width="90" align="center">
            <template #default="{ row }">
              {{ DELIVERY_MODE_LABEL[row.deliveryMode as CourseDeliveryMode] }}
            </template>
          </el-table-column>
          <el-table-column prop="targetAudience" label="目标学员" min-width="180" show-overflow-tooltip />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" size="small">已上架</el-tag>
              <el-tag v-else type="info" size="small">未上架</el-tag>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="课程编号" prop="courseCode">
          <el-input v-model="formData.courseCode" placeholder="如 COURSE-013" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(label, key) in COURSE_CATEGORY_LABEL"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交付方式" prop="deliveryMode">
          <el-radio-group v-model="formData.deliveryMode">
            <el-radio
              v-for="(label, key) in DELIVERY_MODE_LABEL"
              :key="key"
              :value="key"
            >
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="讲师" prop="instructorName">
          <el-input v-model="formData.instructorName" placeholder="讲师姓名" />
        </el-form-item>
        <el-form-item label="课时（h）" prop="duration">
          <el-input v-model.number="formData.duration" placeholder="如 16" />
        </el-form-item>
        <el-form-item label="参考费用" prop="cost">
          <el-input v-model.number="formData.cost" placeholder="单位：元" />
        </el-form-item>
        <el-form-item label="目标学员" prop="targetAudience">
          <el-input v-model="formData.targetAudience" placeholder="如 技术族 P4~P6" />
        </el-form-item>
        <el-form-item label="课程介绍" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="学习目标" prop="objectives">
          <el-input v-model="formData.objectives" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="课程详情" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="课程编号">{{ detailData.courseCode }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ detailData.courseName }}</el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-tag
            v-if="detailData.category"
            :type="COURSE_CATEGORY_TYPE[detailData.category as CourseCategory]"
            size="small"
          >
            {{ COURSE_CATEGORY_LABEL[detailData.category as CourseCategory] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="交付方式">
          {{ detailData.deliveryMode ? DELIVERY_MODE_LABEL[detailData.deliveryMode as CourseDeliveryMode] : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="讲师">{{ detailData.instructorName }}</el-descriptions-item>
        <el-descriptions-item label="课时">{{ detailData.duration }} 小时</el-descriptions-item>
        <el-descriptions-item label="参考费用">
          <span v-if="detailData.cost && detailData.cost > 0">¥{{ detailData.cost.toLocaleString() }}</span>
          <span v-else>免费</span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 1" type="success" size="small">已上架</el-tag>
          <el-tag v-else type="info" size="small">未上架</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="目标学员" :span="2">{{ detailData.targetAudience }}</el-descriptions-item>
        <el-descriptions-item label="课程介绍" :span="2">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="学习目标" :span="2">{{ detailData.objectives }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCourseList,
  addCourse,
  updateCourse,
  deleteCourse,
  batchDeleteCourse
} from '@/api/training'
import type { Course, CourseCategory, CourseDeliveryMode } from '@/types/training'
import {
  COURSE_CATEGORY_LABEL,
  COURSE_CATEGORY_TYPE,
  DELIVERY_MODE_LABEL
} from '@/types/training'

defineOptions({ name: 'TrainingCourse' })

const queryParams = reactive<{
  courseCode?: string
  courseName?: string
  category?: CourseCategory | ''
  deliveryMode?: CourseDeliveryMode | ''
  status?: number | null
  page: number
  pageSize: number
}>({
  courseCode: '',
  courseName: '',
  category: '',
  deliveryMode: '',
  status: null,
  page: 1,
  pageSize: 10
})

const tableData = ref<Course[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const emptyForm = (): Partial<Course> => ({
  courseCode: '',
  courseName: '',
  category: 'general',
  instructorName: '',
  duration: 8,
  cost: 0,
  deliveryMode: 'offline',
  targetAudience: '',
  description: '',
  objectives: '',
  status: 1,
  createdBy: 'HR 培训组'
})
const formData = reactive<Partial<Course>>(emptyForm())

const formRules: FormRules = {
  courseCode: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  deliveryMode: [{ required: true, message: '请选择交付方式', trigger: 'change' }],
  instructorName: [{ required: true, message: '请输入讲师姓名', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入课时', trigger: 'blur' }],
  targetAudience: [{ required: true, message: '请输入目标学员', trigger: 'blur' }]
}

const detailVisible = ref(false)
const detailData = ref<Partial<Course>>({})

const fetchData = async () => {
  try {
    const res: any = await getCourseList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch {
    ElMessage.error('获取课程列表失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryParams, {
    courseCode: '',
    courseName: '',
    category: '',
    deliveryMode: '',
    status: null,
    page: 1,
    pageSize: 10
  })
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增课程'
  Object.assign(formData, emptyForm(), { id: undefined })
  dialogVisible.value = true
}

const handleEdit = (row: Course) => {
  dialogTitle.value = '编辑课程'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (formData.id) {
        await updateCourse(formData as Course)
        ElMessage.success('更新成功')
      } else {
        await addCourse(formData as Course)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchData()
    } catch {
      ElMessage.error('操作失败')
    }
  })
}

const handleDelete = async (row: Course) => {
  try {
    await ElMessageBox.confirm(`确定删除课程「${row.courseName}」？`, '提示', {
      type: 'warning'
    })
    await deleteCourse(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 门课程？`, '提示', {
      type: 'warning'
    })
    await batchDeleteCourse(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleView = (row: Course) => {
  detailData.value = row
  detailVisible.value = true
}

const handleSelectionChange = (selection: Course[]) => {
  selectedIds.value = selection.map((s) => s.id)
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.course-container {
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
