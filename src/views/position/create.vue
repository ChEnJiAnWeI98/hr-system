<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回岗位列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ isEdit ? '编辑岗位' : '新增岗位' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 表单卡片 -->
    <el-card class="form-card">
      <el-scrollbar class="form-scrollbar">
        <div class="form-wrapper">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="岗位名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入岗位名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="所属部门" prop="departmentId">
              <el-tree-select
                v-model="formData.departmentId"
                :data="departmentTreeData"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                placeholder="请选择所属部门"
                clearable
                check-strictly
                :render-after-expand="false"
              />
            </el-form-item>

            <el-form-item label="岗位类别" prop="category">
              <el-select
                v-model="formData.category"
                placeholder="请选择岗位类别"
                clearable
              >
                <el-option label="管理类" :value="1" />
                <el-option label="技术类" :value="2" />
                <el-option label="业务类" :value="3" />
                <el-option label="支持类" :value="4" />
              </el-select>
            </el-form-item>

            <el-form-item label="职级" prop="level">
              <el-select
                v-model="formData.level"
                placeholder="请选择职级"
                clearable
              >
                <el-option label="初级" :value="1" />
                <el-option label="中级" :value="2" />
                <el-option label="高级" :value="3" />
                <el-option label="专家" :value="4" />
              </el-select>
            </el-form-item>

            <el-form-item label="职等" prop="grade">
              <el-input
                v-model.number="formData.grade"
                placeholder="请输入职等（1-20）"
                type="number"
              />
            </el-form-item>

            <el-form-item label="岗位说明书" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="6"
                placeholder="请输入岗位说明书"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="任职要求" prop="requirements">
              <el-input
                v-model="formData.requirements"
                type="textarea"
                :rows="6"
                placeholder="请输入任职要求"
                maxlength="1000"
                show-word-limit
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="loading">
                保存
              </el-button>
              <el-button @click="handleBack">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getDepartmentTree } from '@/api/department'
import type { Position } from '@/types/position'
import type { Department } from '@/types/department'

defineOptions({
  name: 'PositionCreate'
})

const router = useRouter()
const route = useRoute()

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)
const positionId = computed(() => Number(route.params.id))

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 部门树数据
const departmentTreeData = ref<Department[]>([])

// 表单数据
const formData = reactive<Partial<Position>>({
  name: '',
  departmentId: undefined,
  category: undefined,
  level: undefined,
  grade: undefined,
  description: '',
  requirements: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { max: 50, message: '岗位名称不能超过50个字符', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择岗位类别', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择职级', trigger: 'change' }
  ],
  grade: [
    { required: true, message: '请输入职等', trigger: 'blur' },
    { type: 'number', min: 1, max: 20, message: '职等范围为1-20', trigger: 'blur' }
  ],
  description: [
    { max: 2000, message: '岗位说明书不能超过2000个字符', trigger: 'blur' }
  ],
  requirements: [
    { max: 1000, message: '任职要求不能超过1000个字符', trigger: 'blur' }
  ]
}

/**
 * 加载部门树数据
 */
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree({})
    if (res.code === 200) {
      departmentTreeData.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载部门树失败:', error)
  }
}

/**
 * 加载岗位详情（编辑模式）
 */
const loadPositionDetail = async () => {
  if (!isEdit.value) return

  try {
    loading.value = true
    // TODO: 调用获取岗位详情的 API
    // const res = await getPositionDetail(positionId.value)
    // if (res.code === 200) {
    //   Object.assign(formData, res.data)
    // }

    // 临时模拟数据
    Object.assign(formData, {
      name: '前端开发工程师',
      departmentId: 1,
      category: 2,
      level: 2,
      grade: 5,
      description: '负责公司前端项目的开发和维护',
      requirements: '1. 熟练掌握 Vue.js 框架\n2. 熟悉 TypeScript\n3. 有良好的代码规范'
    })
  } catch (error) {
    console.error('加载岗位详情失败:', error)
    ElMessage.error('加载岗位详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // TODO: 调用新增/更新岗位的 API
    // if (isEdit.value) {
    //   await updatePosition({ ...formData, id: positionId.value })
    // } else {
    //   await addPosition(formData)
    // }

    ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
    handleBack()
  } catch (error) {
    console.error('提交失败:', error)
    if (error !== false) {
      ElMessage.error('提交失败')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 返回列表页
 */
const handleBack = () => {
  router.push('/organization/position')
}

onMounted(() => {
  loadDepartmentTree()
  loadPositionDetail()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;

    .breadcrumb-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .el-button {
        font-size: 14px;
        color: #606266;
        padding: 0;

        &:hover {
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 16px;
        }
      }

      .divider {
        color: #dcdfe6;
        font-size: 14px;
      }

      .page-info {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
}

.form-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
  }

  .form-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      padding: 20px;
    }
  }

  .form-wrapper {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
