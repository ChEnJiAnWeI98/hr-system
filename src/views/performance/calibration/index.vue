<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="绩效周期">
            <el-input v-model="queryParams.cycleName" placeholder="请输入绩效周期" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px" clearable>
              <el-option label="待校准" :value="0" />
              <el-option label="已校准" :value="1" />
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
            新增校准配置
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
        >
          <el-table-column prop="cycleName" label="绩效周期" min-width="15%" />
          <el-table-column prop="departmentName" label="部门" min-width="12%" />
          <el-table-column prop="totalEmployees" label="总人数" min-width="8%" align="center" />
          <el-table-column label="优秀" min-width="10%" align="center">
            <template #default="{ row }">
              {{ formatRatioCount(row.excellentRatio, row.excellentCount) }}
            </template>
          </el-table-column>
          <el-table-column label="良好" min-width="10%" align="center">
            <template #default="{ row }">
              {{ formatRatioCount(row.goodRatio, row.goodCount) }}
            </template>
          </el-table-column>
          <el-table-column label="合格" min-width="10%" align="center">
            <template #default="{ row }">
              {{ formatRatioCount(row.qualifiedRatio, row.qualifiedCount) }}
            </template>
          </el-table-column>
          <el-table-column label="待改进" min-width="10%" align="center">
            <template #default="{ row }">
              {{ formatRatioCount(row.improveRatio, row.improveCount) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="warning">待校准</el-tag>
              <el-tag v-else type="success">已校准</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="calibrationDate" label="校准日期" min-width="12%" />
          <el-table-column label="操作" min-width="15%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="primary" :disabled="row.status === 1" @click="handleCalibrate(row)">
                执行校准
              </el-button>
              <el-button link type="primary" @click="handleView(row)">
                查看详情
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

    <!-- 校准配置弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="绩效周期" prop="cycleName">
          <el-input v-model="formData.cycleName" placeholder="请输入绩效周期" />
        </el-form-item>

        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="总人数" prop="totalEmployees">
          <el-input v-model="formData.totalEmployees" placeholder="请输入总人数" />
        </el-form-item>

        <el-divider content-position="left">等级比例设置</el-divider>

        <el-form-item label="优秀比例" prop="excellentRatio">
          <el-input v-model="formData.excellentRatio" placeholder="请输入优秀比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="良好比例" prop="goodRatio">
          <el-input v-model="formData.goodRatio" placeholder="请输入良好比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="合格比例" prop="qualifiedRatio">
          <el-input v-model="formData.qualifiedRatio" placeholder="请输入合格比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="待改进比例" prop="improveRatio">
          <el-input v-model="formData.improveRatio" placeholder="请输入待改进比例">
            <template #append>%</template>
          </el-input>
        </el-form-item>

        <el-alert
          v-if="totalRatio !== 100"
          title="提示：各等级比例总和必须为 100%"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-alert
          v-else
          title="各等级比例总和正确"
          type="success"
          :closable="false"
          style="margin-bottom: 20px"
        />
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getPerformanceCalibrationList,
  addPerformanceCalibration,
  updatePerformanceCalibration
} from '@/api/performanceCalibration'
import type { PerformanceCalibration, PerformanceCalibrationListParams } from '@/types/performanceCalibration'

defineOptions({
  name: 'PerformanceCalibration'
})

// 查询参数
const queryParams = reactive<PerformanceCalibrationListParams>({
  cycleName: '',
  departmentName: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<PerformanceCalibration[]>([])
const total = ref(0)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增校准配置')
const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  cycleName: '',
  departmentName: '',
  totalEmployees: '',
  excellentRatio: '',
  goodRatio: '',
  qualifiedRatio: '',
  improveRatio: ''
})

// 计算总比例
const totalRatio = computed(() => {
  const excellent = Number(formData.excellentRatio) || 0
  const good = Number(formData.goodRatio) || 0
  const qualified = Number(formData.qualifiedRatio) || 0
  const improve = Number(formData.improveRatio) || 0
  return excellent + good + qualified + improve
})

// 表单验证规则
const formRules: FormRules = {
  cycleName: [{ required: true, message: '请输入绩效周期', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  totalEmployees: [
    { required: true, message: '请输入总人数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && !/^\d+$/.test(value)) {
          callback(new Error('总人数必须为正整数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  excellentRatio: [
    { required: true, message: '请输入优秀比例', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && (!/^\d+(\.\d+)?$/.test(value) || Number(value) < 0 || Number(value) > 100)) {
          callback(new Error('比例必须为0-100之间的数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  goodRatio: [
    { required: true, message: '请输入良好比例', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && (!/^\d+(\.\d+)?$/.test(value) || Number(value) < 0 || Number(value) > 100)) {
          callback(new Error('比例必须为0-100之间的数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  qualifiedRatio: [
    { required: true, message: '请输入合格比例', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && (!/^\d+(\.\d+)?$/.test(value) || Number(value) < 0 || Number(value) > 100)) {
          callback(new Error('比例必须为0-100之间的数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  improveRatio: [
    { required: true, message: '请输入待改进比例', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && (!/^\d+(\.\d+)?$/.test(value) || Number(value) < 0 || Number(value) > 100)) {
          callback(new Error('比例必须为0-100之间的数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

/**
 * 格式化比例和人数显示
 */
const formatRatioCount = (ratio: number, count: number) => {
  if (ratio === 0 && count === 0) {
    return '-'
  }
  return `${ratio}%(${count}人)`
}

/**
 * 获取列表数据
 */
const getListData = async () => {
  try {
    const res = await getPerformanceCalibrationList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  getListData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.cycleName = ''
  queryParams.departmentName = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getListData()
}

/**
 * 新增
 */
const handleAdd = () => {
  dialogTitle.value = '新增校准配置'
  dialogVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: PerformanceCalibration) => {
  dialogTitle.value = '编辑校准配置'
  formData.id = row.id
  formData.cycleName = row.cycleName
  formData.departmentName = row.departmentName
  formData.totalEmployees = String(row.totalEmployees)
  formData.excellentRatio = String(row.excellentRatio)
  formData.goodRatio = String(row.goodRatio)
  formData.qualifiedRatio = String(row.qualifiedRatio)
  formData.improveRatio = String(row.improveRatio)
  dialogVisible.value = true
}

/**
 * 执行校准
 */
const handleCalibrate = async (row: PerformanceCalibration) => {
  try {
    await ElMessageBox.confirm('确定要执行校准吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const totalEmployees = row.totalEmployees
    const excellentCount = Math.round((totalEmployees * row.excellentRatio) / 100)
    const goodCount = Math.round((totalEmployees * row.goodRatio) / 100)
    const qualifiedCount = Math.round((totalEmployees * row.qualifiedRatio) / 100)
    const improveCount = totalEmployees - excellentCount - goodCount - qualifiedCount

    const res = await updatePerformanceCalibration({
      id: row.id,
      status: 1,
      excellentCount,
      goodCount,
      qualifiedCount,
      improveCount,
      calibrationDate: new Date().toISOString().split('T')[0]
    })

    if (res.code === 200) {
      ElMessage.success('校准成功')
      getListData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('校准失败:', error)
    }
  }
}

/**
 * 查看详情
 */
const handleView = (row: PerformanceCalibration) => {
  ElMessage.info('查看详情功能待开发')
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 验证总比例
    if (totalRatio.value !== 100) {
      ElMessage.warning('各等级比例总和必须为 100%')
      return
    }

    try {
      const data = {
        id: formData.id,
        cycleName: formData.cycleName,
        departmentName: formData.departmentName,
        totalEmployees: Number(formData.totalEmployees),
        excellentRatio: Number(formData.excellentRatio),
        goodRatio: Number(formData.goodRatio),
        qualifiedRatio: Number(formData.qualifiedRatio),
        improveRatio: Number(formData.improveRatio),
        status: 0,
        excellentCount: 0,
        goodCount: 0,
        qualifiedCount: 0,
        improveCount: 0,
        calibrationDate: ''
      }

      const res = formData.id
        ? await updatePerformanceCalibration(data)
        : await addPerformanceCalibration(data)

      if (res.code === 200) {
        ElMessage.success(formData.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getListData()
      }
    } catch (error) {
      console.error('提交失败:', error)
    }
  })
}

/**
 * 关闭弹窗
 */
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.id = 0
  formData.cycleName = ''
  formData.departmentName = ''
  formData.totalEmployees = ''
  formData.excellentRatio = ''
  formData.goodRatio = ''
  formData.qualifiedRatio = ''
  formData.improveRatio = ''
}

// 初始化
getListData()
</script>

<style scoped lang="scss">
.page-container {
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
