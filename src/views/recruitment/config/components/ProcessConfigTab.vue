<template>
  <div class="tab-content">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索流程名称 / 适用岗位族"
        style="width: 280px"
        clearable
        @change="handleSearch"
      >
        <template #suffix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增流程
      </el-button>
    </div>

    <div class="tab-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="processName" label="流程名称" min-width="18%" />
        <el-table-column prop="applicableJobFamily" label="适用岗位族" min-width="15%">
          <template #default="{ row }">{{ row.applicableJobFamily || '全岗位' }}</template>
        </el-table-column>
        <el-table-column label="流程阶段" min-width="32%">
          <template #default="{ row }">
            <el-tag
              v-for="(s, i) in row.stages"
              :key="i"
              size="small"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ i + 1 }}. {{ s.name }} ({{ s.slaDays }}天)
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="8%">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="13%" />
        <el-table-column label="操作" min-width="14%" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="loadData"
      @current-change="loadData"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="流程名称" prop="processName">
          <el-input v-model="formData.processName" placeholder="如：技术岗标准流程" />
        </el-form-item>

        <el-form-item label="适用岗位族">
          <el-input v-model="formData.applicableJobFamily" placeholder="多个逗号分隔，留空表示全岗位适用" />
        </el-form-item>

        <el-form-item label="流程阶段" required>
          <div class="items-editor">
            <div v-for="(s, idx) in formData.stages" :key="idx" class="item-row">
              <span class="stage-index">{{ idx + 1 }}.</span>
              <el-input v-model="s.name" placeholder="阶段名称（如：技术一面）" style="width: 180px" />
              <el-select
                v-model="s.defaultInterviewerRole"
                placeholder="默认面试官角色"
                style="width: 180px"
                clearable
              >
                <el-option label="HR" value="R_HR" />
                <el-option label="部门负责人" value="R_DEPT_MANAGER" />
                <el-option label="超级管理员/高层" value="R_SUPER" />
              </el-select>
              <el-input
                v-model.number="s.slaDays"
                placeholder="SLA 天数"
                style="width: 120px"
              >
                <template #suffix>天</template>
              </el-input>
              <el-select
                v-model="s.defaultEvaluationTemplateId"
                placeholder="默认评价模板（选填）"
                style="flex: 1"
                clearable
              >
                <el-option
                  v-for="t in evalTemplates"
                  :key="t.id"
                  :label="t.templateName"
                  :value="t.id"
                />
              </el-select>
              <el-button link type="danger" @click="removeStage(idx)">删除</el-button>
            </div>
            <el-button type="primary" text @click="addStage">
              <el-icon><Plus /></el-icon> 添加阶段
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type {
  RecruitmentProcessConfig,
  ProcessStage,
  InterviewEvaluationTemplate,
  ConfigListParams
} from '@/types/recruitmentConfig'
import { processConfigApi, interviewEvaluationTemplateApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<RecruitmentProcessConfig[]>([])
const total = ref(0)
const evalTemplates = ref<InterviewEvaluationTemplate[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<RecruitmentProcessConfig>>({
  processName: '',
  applicableJobFamily: '',
  stages: [],
  status: 1
})

const formRules = {
  processName: [{ required: true, message: '请输入流程名称', trigger: 'blur' }]
}

const loadEvalTemplates = async () => {
  const res = await interviewEvaluationTemplateApi.getList({ page: 1, pageSize: 100 })
  if (res.code === 200) evalTemplates.value = res.data.list
}

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await processConfigApi.getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载流程失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增招聘流程'
  Object.assign(formData, {
    id: undefined,
    processName: '',
    applicableJobFamily: '',
    stages: [
      { name: '简历初筛', defaultInterviewerRole: 'R_HR', slaDays: 2 },
      { name: '初面', defaultInterviewerRole: 'R_DEPT_MANAGER', slaDays: 5 },
      { name: 'HR 面', defaultInterviewerRole: 'R_HR', slaDays: 3 },
      { name: 'Offer 发放', defaultInterviewerRole: 'R_HR', slaDays: 3 }
    ] as ProcessStage[],
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: RecruitmentProcessConfig) => {
  dialogTitle.value = '编辑招聘流程'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

const addStage = () => {
  formData.stages!.push({ name: '', slaDays: 3 } as ProcessStage)
}

const removeStage = (idx: number) => {
  formData.stages!.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (!formData.stages || formData.stages.length === 0) {
      ElMessage.warning('请至少添加一个流程阶段')
      return
    }
    try {
      if (formData.id) {
        await processConfigApi.update(formData)
        ElMessage.success('更新成功')
      } else {
        await processConfigApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: RecruitmentProcessConfig) => {
  ElMessageBox.confirm(`确定删除流程「${row.processName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await processConfigApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadEvalTemplates()
  loadData()
})
</script>

<style scoped lang="scss">
.tab-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-toolbar {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tab-table {
  flex: 1;
  overflow: hidden;
}

.el-pagination {
  flex-shrink: 0;
  justify-content: flex-end;
  margin-top: 12px;
}

.items-editor {
  width: 100%;

  .item-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;

    .stage-index {
      color: #909399;
      font-size: 14px;
      width: 24px;
    }
  }
}
</style>
