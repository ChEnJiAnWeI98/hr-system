<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="实体类型">
            <el-select
              v-model="queryParams.entityTypeCode"
              placeholder="全部"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="(label, key) in ENTITY_TYPE_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="实体名称">
            <el-input
              v-model="queryParams.entityName"
              placeholder="姓名 / 组织名"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="字段">
            <el-input
              v-model="queryParams.fieldLabel"
              placeholder="如 基本工资"
              clearable
              style="width: 180px"
            />
          </el-form-item>

          <el-form-item label="操作人">
            <el-input
              v-model="queryParams.operatorName"
              placeholder="操作人姓名"
              clearable
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="变更来源">
            <el-select
              v-model="queryParams.source"
              placeholder="全部"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="(label, key) in CHANGE_SOURCE_LABEL"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="变更时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 260px"
            />
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button @click="handleExport">导出</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="data-card-header">
        <span class="data-card-title">变更记录（共 {{ total }} 条）</span>
        <span class="data-card-subtitle">
          记录员工档案 / 合同 / 组织 / 岗位 / 薪酬等关键字段的前后值，供合规审计与追溯
        </span>
      </div>
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%" height="100%" v-loading="loading">
          <el-table-column label="变更时间" width="160" prop="operateTime" />
          <el-table-column label="实体类型" width="100">
            <template #default="{ row }">
              <el-tag size="small" type="info">{{ row.entityType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="对象" min-width="140" prop="entityName" />
          <el-table-column label="变更字段" min-width="120" prop="fieldLabel" />
          <el-table-column label="变更前 → 变更后" min-width="260">
            <template #default="{ row }">
              <div class="diff-row">
                <span class="diff-old">{{ row.oldValue }}</span>
                <el-icon class="diff-arrow"><Right /></el-icon>
                <span class="diff-new">{{ row.newValue }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="130">
            <template #default="{ row }">
              <el-tag size="small" :type="(CHANGE_SOURCE_TYPE as any)[row.source]">
                {{ (CHANGE_SOURCE_LABEL as any)[row.source] }}
              </el-tag>
              <div v-if="row.sourceDocNo" class="source-doc">{{ row.sourceDocNo }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作人" width="120" prop="operatorName" />
          <el-table-column label="IP 地址" width="130" prop="ipAddress" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="变更详情" width="640px">
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border size="default">
          <el-descriptions-item label="实体类型">{{ currentRow.entityType }}</el-descriptions-item>
          <el-descriptions-item label="对象名称">{{ currentRow.entityName }}</el-descriptions-item>
          <el-descriptions-item label="变更字段" :span="2">{{ currentRow.fieldLabel }}（{{ currentRow.fieldName }}）</el-descriptions-item>
          <el-descriptions-item label="变更前" :span="2">
            <span class="diff-old-block">{{ currentRow.oldValue }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="变更后" :span="2">
            <span class="diff-new-block">{{ currentRow.newValue }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="变更原因" :span="2">{{ currentRow.changeReason || '—' }}</el-descriptions-item>
          <el-descriptions-item label="变更来源">
            <el-tag size="small" :type="CHANGE_SOURCE_TYPE[currentRow.source]">
              {{ CHANGE_SOURCE_LABEL[currentRow.source] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="来源单号">{{ currentRow.sourceDocNo || '—' }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRow.operatorName }}</el-descriptions-item>
          <el-descriptions-item label="操作角色">{{ currentRow.operatorRole }}</el-descriptions-item>
          <el-descriptions-item label="IP 地址">{{ currentRow.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="变更时间">{{ currentRow.operateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Right } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getList, exportLog } from '@/api/fieldChangeLog'
import type { FieldChangeLog, FieldChangeLogListParams } from '@/types/system/fieldChangeLog'
import {
  ENTITY_TYPE_LABEL,
  CHANGE_SOURCE_LABEL,
  CHANGE_SOURCE_TYPE
} from '@/types/system/fieldChangeLog'

defineOptions({ name: 'SystemFieldChangeLog' })

const queryParams = reactive<FieldChangeLogListParams>({
  entityTypeCode: '',
  entityName: '',
  fieldLabel: '',
  operatorName: '',
  source: '',
  dateStart: '',
  dateEnd: '',
  page: 1,
  pageSize: 20
})

const dateRange = ref<[string, string] | null>(null)
const tableData = ref<FieldChangeLog[]>([])
const total = ref(0)
const loading = ref(false)

const detailVisible = ref(false)
const currentRow = ref<FieldChangeLog | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.dateStart = dateRange.value[0]
      queryParams.dateEnd = dateRange.value[1]
    } else {
      queryParams.dateStart = ''
      queryParams.dateEnd = ''
    }
    const res: any = await getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.entityTypeCode = ''
  queryParams.entityName = ''
  queryParams.fieldLabel = ''
  queryParams.operatorName = ''
  queryParams.source = ''
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

const handleExport = async () => {
  await exportLog(queryParams)
  ElMessage.success('导出成功（演示模式）')
}

const handleViewDetail = (row: FieldChangeLog) => {
  currentRow.value = row
  detailVisible.value = true
}

onMounted(() => {
  loadData()
})
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

  .data-card-header {
    flex-shrink: 0;
    margin-bottom: 12px;
    display: flex;
    align-items: baseline;
    gap: 12px;

    .data-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .data-card-subtitle {
      font-size: 12px;
      color: #909399;
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    margin-top: 16px;
    justify-content: flex-end;
  }
}

.diff-row {
  display: flex;
  align-items: center;
  gap: 8px;

  .diff-old {
    padding: 2px 8px;
    background: #fef0f0;
    color: #f56c6c;
    border-radius: 4px;
    font-size: 13px;
    text-decoration: line-through;
  }

  .diff-arrow {
    color: #909399;
    font-size: 14px;
  }

  .diff-new {
    padding: 2px 8px;
    background: #f0f9eb;
    color: #67c23a;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
  }
}

.source-doc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.detail-content {
  .diff-old-block {
    display: inline-block;
    padding: 4px 12px;
    background: #fef0f0;
    color: #f56c6c;
    border-radius: 4px;
    text-decoration: line-through;
  }

  .diff-new-block {
    display: inline-block;
    padding: 4px 12px;
    background: #f0f9eb;
    color: #67c23a;
    border-radius: 4px;
    font-weight: 500;
  }
}
</style>
