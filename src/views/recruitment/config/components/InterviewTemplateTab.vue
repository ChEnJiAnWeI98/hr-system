<template>
  <div class="tab-content">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索模板名称 / 适用岗位族"
        style="width: 280px"
        clearable
        @change="handleSearch"
      >
        <template #suffix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增模板
      </el-button>
    </div>

    <div class="tab-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="templateName" label="模板名称" min-width="18%" />
        <el-table-column prop="applicableJobFamily" label="适用岗位族" min-width="20%">
          <template #default="{ row }">{{ row.applicableJobFamily || '全岗位' }}</template>
        </el-table-column>
        <el-table-column label="评价维度" min-width="24%">
          <template #default="{ row }">
            <el-tag
              v-for="d in row.dimensions"
              :key="d.name"
              size="small"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ d.name }} ({{ d.weight }}%)
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scoreRule" label="计分规则" min-width="10%">
          <template #default="{ row }">
            {{ row.scoreRule === 'weighted' ? '加权平均' : '简单求和' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="8%">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="12%" />
        <el-table-column label="操作" min-width="8%" fixed="right">
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="780px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="如：技术岗通用评价模板" />
        </el-form-item>

        <el-form-item label="适用岗位族">
          <el-input v-model="formData.applicableJobFamily" placeholder="多个逗号分隔，留空表示全岗位适用" />
        </el-form-item>

        <el-form-item label="计分规则" prop="scoreRule">
          <el-radio-group v-model="formData.scoreRule">
            <el-radio value="weighted">加权平均</el-radio>
            <el-radio value="sum">简单求和</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="评价维度" required>
          <div class="dimensions-editor">
            <div v-for="(d, idx) in formData.dimensions" :key="idx" class="dim-row">
              <el-input v-model="d.name" placeholder="维度名称" style="width: 160px" />
              <el-input v-model.number="d.weight" placeholder="权重(%)" style="width: 100px">
                <template #suffix>%</template>
              </el-input>
              <el-input v-model.number="d.maxScore" placeholder="满分" style="width: 90px" />
              <el-input v-model="d.description" placeholder="说明（选填）" style="flex: 1" />
              <el-button link type="danger" @click="removeDimension(idx)">删除</el-button>
            </div>
            <el-button type="primary" text @click="addDimension">
              <el-icon><Plus /></el-icon> 添加维度
            </el-button>
            <div v-if="formData.scoreRule === 'weighted'" class="weight-hint">
              当前权重合计：
              <span :class="{ 'hint-ok': totalWeight === 100, 'hint-err': totalWeight !== 100 }">
                {{ totalWeight }}%
              </span>
              （加权平均模式下需等于 100%）
            </div>
          </div>
        </el-form-item>

        <el-form-item label="结果建议选项" prop="resultOptions">
          <el-select
            v-model="formData.resultOptions"
            multiple
            filterable
            allow-create
            placeholder="如：强烈推荐、通过、待定、不通过"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
          <span class="status-hint">{{ formData.status === 1 ? '启用' : '禁用' }}</span>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type {
  InterviewEvaluationTemplate,
  EvaluationDimension,
  ConfigListParams
} from '@/types/recruitmentConfig'
import { interviewEvaluationTemplateApi } from '@/api/recruitmentConfig'

const keyword = ref('')
const queryParams = reactive<ConfigListParams>({ keyword: '', page: 1, pageSize: 10 })
const tableData = ref<InterviewEvaluationTemplate[]>([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<InterviewEvaluationTemplate>>({
  templateName: '',
  applicableJobFamily: '',
  dimensions: [],
  scoreRule: 'weighted',
  resultOptions: ['强烈推荐', '通过', '待定', '不通过'],
  status: 1,
  remark: ''
})

const formRules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  scoreRule: [{ required: true, message: '请选择计分规则', trigger: 'change' }],
  resultOptions: [{ required: true, message: '请添加至少一个结果选项', trigger: 'change' }]
}

const totalWeight = computed(() =>
  (formData.dimensions || []).reduce((sum, d) => sum + (Number(d.weight) || 0), 0)
)

const loadData = async () => {
  try {
    queryParams.keyword = keyword.value
    const res = await interviewEvaluationTemplateApi.getList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('加载模板失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增面试评价模板'
  Object.assign(formData, {
    id: undefined,
    templateName: '',
    applicableJobFamily: '',
    dimensions: [
      { name: '专业能力', weight: 40, maxScore: 5, description: '' },
      { name: '沟通能力', weight: 30, maxScore: 5, description: '' },
      { name: '文化匹配度', weight: 30, maxScore: 5, description: '' }
    ],
    scoreRule: 'weighted',
    resultOptions: ['强烈推荐', '通过', '待定', '不通过'],
    status: 1,
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: InterviewEvaluationTemplate) => {
  dialogTitle.value = '编辑面试评价模板'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

const addDimension = () => {
  formData.dimensions!.push({ name: '', weight: 0, maxScore: 5, description: '' } as EvaluationDimension)
}

const removeDimension = (idx: number) => {
  formData.dimensions!.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (!formData.dimensions || formData.dimensions.length === 0) {
      ElMessage.warning('请至少添加一个评价维度')
      return
    }
    if (formData.scoreRule === 'weighted' && totalWeight.value !== 100) {
      ElMessage.warning('加权平均模式下，维度权重合计必须等于 100%')
      return
    }
    try {
      if (formData.id) {
        await interviewEvaluationTemplateApi.update(formData)
        ElMessage.success('更新成功')
      } else {
        await interviewEvaluationTemplateApi.add(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  })
}

const handleDelete = (row: InterviewEvaluationTemplate) => {
  ElMessageBox.confirm(`确定删除模板「${row.templateName}」吗？`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await interviewEvaluationTemplateApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(loadData)
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

.dimensions-editor {
  width: 100%;

  .dim-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .weight-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #606266;

    .hint-ok {
      color: #67c23a;
      font-weight: 600;
    }
    .hint-err {
      color: #f56c6c;
      font-weight: 600;
    }
  }
}

.status-hint {
  margin-left: 12px;
  font-size: 13px;
  color: #606266;
}
</style>
