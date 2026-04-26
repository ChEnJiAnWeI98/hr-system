<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回编制列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ staffingInfo.departmentName }} - 编制管理</span>
        </div>
      </div>
    </el-card>

    <!-- 可滚动内容区域 -->
    <el-scrollbar class="content-scrollbar">
      <!-- 编制信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>当前编制信息</span>
          </div>
        </template>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">部门名称：</span>
            <span class="info-value">{{ staffingInfo.departmentName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">当前编制人数：</span>
            <span class="info-value">{{ staffingInfo.headcount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">在编人数：</span>
            <span class="info-value">{{ staffingInfo.currentCount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">编制状态：</span>
            <el-tag :type="getStatusType(staffingInfo.status || 0)">
              {{ getStatusText(staffingInfo.status || 0) }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- 编制调整卡片 -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>编制调整</span>
          </div>
        </template>
        <div class="form-wrapper">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="新编制人数" prop="newHeadcount">
              <el-input
                v-model="formData.newHeadcount"
                placeholder="请输入新编制人数"
                style="width: 300px"
              />
              <span class="form-tip">当前编制：{{ staffingInfo.headcount }} 人</span>
            </el-form-item>

            <el-form-item label="调整原因" prop="reason">
              <el-input
                v-model="formData.reason"
                type="textarea"
                :rows="4"
                placeholder="请输入调整原因"
                maxlength="500"
                show-word-limit
                style="width: 600px"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="loading">
                保存
              </el-button>
              <el-button @click="handleBack">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 调整历史卡片 -->
      <el-card class="history-card">
        <template #header>
          <div class="card-header">
            <span>调整历史</span>
          </div>
        </template>
        <div class="table-container">
          <el-table
            :data="historyList"
            height="100%"
          >
            <el-table-column prop="adjustTime" label="调整时间" min-width="14%" />
            <el-table-column prop="beforeCount" label="调整前人数" min-width="10%" align="center" />
            <el-table-column prop="afterCount" label="调整后人数" min-width="10%" align="center">
              <template #default="{ row }">
                <span :class="getChangeClass(row.beforeCount, row.afterCount)">
                  {{ row.afterCount }}
                  <span v-if="row.afterCount > row.beforeCount">
                    (+{{ row.afterCount - row.beforeCount }})
                  </span>
                  <span v-else-if="row.afterCount < row.beforeCount">
                    ({{ row.afterCount - row.beforeCount }})
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="调整原因" min-width="15%" show-overflow-tooltip />
            <el-table-column prop="operator" label="操作人" min-width="10%" />
          </el-table>
          <el-pagination
            v-model:current-page="historyParams.page"
            v-model:page-size="historyParams.pageSize"
            :total="historyTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadHistory"
            @current-change="loadHistory"
          />
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getStaffingDetail, updateStaffing, getAdjustmentRecords } from '@/api/staffing'
import type { Staffing, StaffingAdjustmentRecord } from '@/types/staffing'

const route = useRoute()
const router = useRouter()

// 编制信息
const staffingInfo = ref<Staffing>({
  id: 0,
  year: new Date().getFullYear(),
  departmentId: 0,
  departmentName: '',
  headcount: 0,
  currentCount: 0,
  shortage: 0,
  overstaffing: 0,
  status: 0
})

// 表单数据
const formData = reactive({
  newHeadcount: '',
  reason: ''
})

// 表单验证规则
const rules: FormRules = {
  newHeadcount: [
    { required: true, message: '请输入新编制人数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新编制人数'))
        } else if (!/^\d+$/.test(value)) {
          callback(new Error('请输入有效的数字'))
        } else {
          const num = parseInt(value)
          if (num < 1 || num > 9999) {
            callback(new Error('编制人数范围为 1-9999'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  reason: [
    { required: true, message: '请输入调整原因', trigger: 'blur' },
    { min: 1, max: 500, message: '调整原因长度为 1-500 个字符', trigger: 'blur' }
  ]
}

// 调整历史
const historyList = ref<StaffingAdjustmentRecord[]>([])
const historyTotal = ref(0)
const historyParams = reactive({
  departmentId: 0,
  page: 1,
  pageSize: 10
})

const formRef = ref<FormInstance>()
const loading = ref(false)

/**
 * 获取编制状态类型
 */
const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    0: 'success',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

/**
 * 获取编制状态文本
 */
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '正常',
    1: '缺编',
    2: '超编'
  }
  return textMap[status] || '未知'
}

/**
 * 获取变化样式类
 */
const getChangeClass = (before: number, after: number) => {
  if (after > before) return 'change-increase'
  if (after < before) return 'change-decrease'
  return ''
}

/**
 * 加载编制详情
 */
const loadDetail = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const res = await getStaffingDetail(id)
    if (res.code === 200) {
      staffingInfo.value = res.data
      historyParams.departmentId = res.data.departmentId
      loadHistory()
    }
  } catch (error) {
    ElMessage.error('加载编制信息失败')
  }
}

/**
 * 加载调整历史
 */
const loadHistory = async () => {
  try {
    const res = await getAdjustmentRecords(historyParams)
    if (res.code === 200) {
      historyList.value = res.data.list
      historyTotal.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载调整历史失败')
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    const newHeadcount = parseInt(formData.newHeadcount)
    if (newHeadcount === staffingInfo.value.headcount) {
      ElMessage.warning('新编制人数与当前编制人数相同，无需调整')
      return
    }

    try {
      await ElMessageBox.confirm(
        `确认将编制人数从 ${staffingInfo.value.headcount} 调整为 ${newHeadcount} 吗？`,
        '确认调整',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      loading.value = true

      const res = await updateStaffing({
        id: staffingInfo.value.id,
        headcount: newHeadcount
      })

      if (res.code === 200) {
        ElMessage.success('编制调整成功')
        // 重新加载数据
        await loadDetail()
        // 清空表单
        formData.newHeadcount = ''
        formData.reason = ''
        formRef.value?.resetFields()
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '编制调整失败')
      }
    } finally {
      loading.value = false
    }
  })
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.push('/organization/staffing')
}

onMounted(() => {
  loadDetail()
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

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.info-card,
.form-card,
.history-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  .card-header {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.info-card {
  .info-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .info-item {
    display: flex;
    align-items: center;

    .info-label {
      font-size: 14px;
      color: #606266;
      margin-right: 8px;
    }

    .info-value {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }
}

.form-card {
  .form-wrapper {
    max-width: 800px;
  }

  .form-tip {
    margin-left: 12px;
    font-size: 12px;
    color: #909399;
  }
}

.history-card {
  :deep(.el-card__body) {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 500px;
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .el-table {
    flex: 1;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
    justify-content: flex-end;
  }

  .change-increase {
    color: #67c23a;
  }

  .change-decrease {
    color: #f56c6c;
  }
}
</style>
