<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回部门列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ isEdit ? '编辑部门' : '新增部门' }}</span>
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
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入部门名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="部门编码" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入部门编码，如：DEPT-XXX"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="departmentTreeData"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                placeholder="请选择上级部门"
                clearable
                check-strictly
                :render-after-expand="false"
              />
            </el-form-item>

            <el-form-item label="部门负责人" prop="leaderId">
              <el-select
                v-model="formData.leaderId"
                placeholder="请选择部门负责人"
                clearable
                filterable
              >
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="`${user.name} - ${user.code}`"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="编制人数" prop="headcount">
              <el-input-number
                v-model="formData.headcount"
                :min="1"
                :max="9999"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item label="成立时间" prop="establishDate">
              <el-date-picker
                v-model="formData.establishDate"
                type="date"
                placeholder="请选择成立时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item label="职能描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="4"
                placeholder="请输入职能描述"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="排序号" prop="sort">
              <el-input-number
                v-model="formData.sort"
                :min="0"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit">
                保存
              </el-button>
              <el-button @click="handleBack">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import {
  getDepartmentTree,
  getDepartmentDetail,
  addDepartment,
  updateDepartment
} from '@/api/department'
import type { Department } from '@/types/department'

defineOptions({
  name: 'DepartmentCreate'
})

const route = useRoute()
const router = useRouter()

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<Department>>({
  name: '',
  code: '',
  parentId: null,
  leaderId: null,
  headcount: 1,
  establishDate: '',
  description: '',
  sort: 0,
  status: 1
})

// 部门树数据
const departmentTreeData = ref<Department[]>([])

// 用户列表（模拟数据，实际应该从 API 获取）
const userList = ref([
  { id: 1, name: '张三', code: 'U001' },
  { id: 2, name: '李四', code: 'U002' },
  { id: 3, name: '王五', code: 'U003' },
  { id: 4, name: '赵六', code: 'U004' },
  { id: 5, name: '孙七', code: 'U005' },
  { id: 6, name: '周八', code: 'U006' },
  { id: 7, name: '吴九', code: 'U007' }
])

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  headcount: [{ required: true, message: '请输入编制人数', trigger: 'blur' }],
  establishDate: [{ required: true, message: '请选择成立时间', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 加载部门树
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree({ status: 1 })
    departmentTreeData.value = res.data.list || []

    // 如果是编辑模式，需要过滤掉自己和子部门
    if (isEdit.value && route.params.id) {
      const currentId = Number(route.params.id)
      departmentTreeData.value = filterDepartmentTree(departmentTreeData.value, currentId)
    }
  } catch (error) {
    ElMessage.error('加载部门树失败')
  }
}

// 过滤部门树（移除自己和子部门）
const filterDepartmentTree = (tree: Department[], excludeId: number): Department[] => {
  return tree
    .filter(item => item.id !== excludeId)
    .map(item => ({
      ...item,
      children: item.children ? filterDepartmentTree(item.children, excludeId) : undefined
    }))
}

// 加载部门详情
const loadDepartmentDetail = async () => {
  if (!route.params.id) return

  try {
    const res = await getDepartmentDetail(Number(route.params.id))
    Object.assign(formData, res.data)
  } catch (error) {
    ElMessage.error('加载部门详情失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        await updateDepartment({ ...formData, id: Number(route.params.id) })
        ElMessage.success('更新成功')
      } else {
        await addDepartment(formData)
        ElMessage.success('添加成功')
      }
      handleBack()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    }
  })
}

// 返回列表页
const handleBack = () => {
  router.push('/organization/department')
}

// 页面加载
onMounted(() => {
  loadDepartmentTree()
  if (isEdit.value) {
    loadDepartmentDetail()
  }
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
