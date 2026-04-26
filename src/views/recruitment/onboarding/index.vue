<template>
  <div class="onboarding-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="入职编号">
            <el-input v-model="queryParams.onboardingNo" placeholder="请输入入职编号" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="入职岗位">
            <el-input v-model="queryParams.position" placeholder="请输入入职岗位" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px" clearable>
              <el-option label="待入职" :value="1" />
              <el-option label="材料准备中" :value="2" />
              <el-option label="已完成" :value="3" />
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
            新增入职
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
          <el-table-column prop="onboardingNo" label="入职编号" min-width="10%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="10%" />
          <el-table-column prop="position" label="入职岗位" min-width="10%" />
          <el-table-column prop="department" label="所属部门" min-width="10%" />
          <el-table-column prop="onboardingDate" label="入职日期" min-width="10%" />
          <el-table-column prop="mentor" label="导师" min-width="10%" />
          <el-table-column label="自助填报" min-width="10%">
            <template #default="{ row }">
              <div v-if="row.fillLink" class="fill-progress">
                <el-progress
                  :percentage="row.fillProgress || 0"
                  :status="(row.fillProgress || 0) >= 100 ? 'success' : undefined"
                  :stroke-width="8"
                />
              </div>
              <el-tag v-else size="small" type="info">未发送</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="accountStatus" label="账号状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.accountStatus === 1" type="warning">未开通</el-tag>
              <el-tag v-else-if="row.accountStatus === 2" type="success">已开通</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="8%">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="warning">待入职</el-tag>
              <el-tag v-else-if="row.status === 2" type="primary">材料准备中</el-tag>
              <el-tag v-else-if="row.status === 3" type="success">已完成</el-tag>
              <el-tag v-else-if="row.status === 6" type="info">爽约归档</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="预警" min-width="7%">
            <template #default="{ row }">
              <el-tag v-if="row.noShowAlert === 1" type="danger" size="small">🚨 鸽子风险</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20%" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleView(row)">详情</el-button>
              <el-button link type="primary" @click="handleSendFillLink(row)">
                {{ row.fillLink ? '重发链接' : '发送填报' }}
              </el-button>
              <el-dropdown trigger="click" @command="(cmd: string) => handleMoreCommand(cmd, row)">
                <el-button link type="primary">
                  更多
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="materials">材料管理</el-dropdown-item>
                    <el-dropdown-item command="complete" :disabled="row.status === 3 || row.status === 6">完成入职</el-dropdown-item>
                    <el-dropdown-item command="alert" :disabled="row.noShowAlert === 1">触发鸽子预警</el-dropdown-item>
                    <el-dropdown-item command="archive" :disabled="row.status === 3 || row.status === 6">爽约归档</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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

    <!-- 新增/编辑入职弹窗 -->
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
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>

        <el-form-item label="入职岗位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入入职岗位" />
        </el-form-item>

        <el-form-item label="所属部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入所属部门" />
        </el-form-item>

        <el-form-item label="入职日期" prop="onboardingDate">
          <el-date-picker
            v-model="formData.onboardingDate"
            type="date"
            placeholder="请选择入职日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="导师" prop="mentor">
          <el-input v-model="formData.mentor" placeholder="请输入导师姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗（Phase 2 任务B2：新增多部门任务 Tab） -->
    <el-dialog v-model="detailVisible" title="入职衔接详情" width="780px">
      <el-tabs v-model="detailTab">
        <el-tab-pane label="基本信息" name="info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="入职编号">{{ detailData.onboardingNo }}</el-descriptions-item>
            <el-descriptions-item label="员工姓名">{{ detailData.employeeName }}</el-descriptions-item>
            <el-descriptions-item label="入职岗位">{{ detailData.position }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">{{ detailData.department }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ detailData.onboardingDate }}</el-descriptions-item>
            <el-descriptions-item label="导师">{{ detailData.mentor }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
            <el-descriptions-item label="自助填报进度">
              <el-progress
                v-if="detailData.fillLink"
                :percentage="detailData.fillProgress || 0"
                :status="(detailData.fillProgress || 0) >= 100 ? 'success' : undefined"
              />
              <span v-else>未发送填报链接</span>
            </el-descriptions-item>
            <el-descriptions-item label="资料模板">
              {{ detailData.onboardingTemplateName || '未关联模板' }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag v-if="detailData.status === 1" type="warning">待入职</el-tag>
              <el-tag v-else-if="detailData.status === 2" type="primary">材料准备中</el-tag>
              <el-tag v-else-if="detailData.status === 3" type="success">已完成</el-tag>
              <el-tag v-else-if="detailData.status === 6" type="info">爽约归档</el-tag>
            </el-descriptions-item>
            <el-descriptions-item v-if="detailData.noShowReason" label="爽约原因" :span="2">
              <el-alert type="error" :closable="false" show-icon :title="detailData.noShowReason" />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane :label="`多部门任务（${deptTasks.length}）`" name="tasks">
          <div class="tasks-toolbar">
            <el-alert
              type="info"
              :closable="false"
              show-icon
              title="多部门协同：IT 开通账号 / 行政准备工位 / HRBP 安排导师 / 导师对接"
              style="margin-bottom: 12px"
            />
            <el-button type="primary" text @click="handleAddTask">
              <el-icon><Plus /></el-icon>
              添加任务
            </el-button>
            <el-button v-if="deptTasks.length === 0" type="success" text @click="handlePresetTasks">
              一键预置 4 项标准任务
            </el-button>
          </div>
          <el-table :data="deptTasks" border>
            <el-table-column label="任务名称" min-width="22%">
              <template #default="{ row, $index }">
                <el-input v-model="deptTasks[$index].name" size="small" placeholder="任务名称" />
              </template>
            </el-table-column>
            <el-table-column label="责任部门" min-width="14%">
              <template #default="{ $index }">
                <el-select v-model="deptTasks[$index].owner" size="small" style="width: 100%">
                  <el-option label="IT" value="IT" />
                  <el-option label="行政" value="行政" />
                  <el-option label="HRBP" value="HRBP" />
                  <el-option label="导师" value="导师" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="经办人" min-width="14%">
              <template #default="{ $index }">
                <el-input v-model="deptTasks[$index].assignee" size="small" placeholder="经办人" />
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="14%">
              <template #default="{ $index }">
                <el-select v-model="deptTasks[$index].status" size="small" style="width: 100%">
                  <el-option label="待处理" value="pending" />
                  <el-option label="进行中" value="doing" />
                  <el-option label="已完成" value="done" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="22%">
              <template #default="{ $index }">
                <el-input v-model="deptTasks[$index].remark" size="small" placeholder="备注" />
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="14%">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleRemoveTask($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="deptTasks.length === 0" description="暂无多部门任务" :image-size="80" />
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button
            v-if="detailTab === 'tasks'"
            type="primary"
            @click="handleSaveTasks"
          >
            保存多部门任务
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 材料管理弹窗 -->
    <el-dialog
      v-model="materialsVisible"
      title="材料管理"
      width="600px"
    >
      <div class="materials-content">
        <div class="materials-header">
          <span class="employee-name">{{ currentEmployee }}</span>
          <span class="materials-progress">
            完成度：{{ completedCount }}/{{ materialsList.length }}
          </span>
        </div>

        <el-divider />

        <div class="materials-list">
          <el-checkbox
            v-for="material in materialsList"
            :key="material.id"
            v-model="material.completed"
            :label="material.name"
            @change="handleMaterialChange"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="materialsVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMaterials">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Phase 2.4：发送候选人自助填报链接弹窗 -->
    <el-dialog v-model="fillDialogVisible" title="发送候选人自助填报链接" width="560px">
      <el-form label-width="120px">
        <el-form-item label="入职员工">
          <el-input :model-value="currentRow?.employeeName" disabled />
        </el-form-item>
        <el-form-item label="资料模板" required>
          <el-select v-model="fillForm.templateId" placeholder="请选择入职资料填报模板" style="width: 100%">
            <el-option
              v-for="t in onbTemplates"
              :key="t.id"
              :label="`${t.templateName}${t.applicableJobFamily ? ' - ' + t.applicableJobFamily : ''}`"
              :value="t.id"
            />
          </el-select>
          <div class="form-hint">选择后系统将生成专属链接，候选人可通过 H5 在线填写资料 + 上传附件</div>
        </el-form-item>
      </el-form>
      <el-alert
        v-if="currentRow?.fillLink"
        type="info"
        :closable="false"
        show-icon
        :title="`当前链接：${currentRow.fillLink}`"
        style="margin-top: 8px"
      />
      <template #footer>
        <el-button @click="fillDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSendFillSubmit">发送</el-button>
        <el-button
          v-if="currentRow?.fillLink"
          type="warning"
          @click="handleSimulateFillProgress"
        >
          Demo：模拟候选人填报
        </el-button>
      </template>
    </el-dialog>

    <!-- Phase 2.4：爽约归档弹窗 -->
    <el-dialog v-model="archiveDialogVisible" title="爽约归档" width="480px">
      <el-form label-width="100px">
        <el-form-item label="入职员工">
          <el-input :model-value="currentRow?.employeeName" disabled />
        </el-form-item>
        <el-form-item label="爽约原因" required>
          <el-select v-model="archiveForm.reasonCode" placeholder="请选择爽约原因" style="width: 100%">
            <el-option
              v-for="r in NO_SHOW_REASON_OPTIONS"
              :key="r.code"
              :label="r.label"
              :value="r.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input v-model="archiveForm.remark" type="textarea" :rows="3" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="archiveDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleArchiveSubmit">确定归档</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import type { Onboarding, OnboardingListParams } from '@/types/recruitment'
import { NO_SHOW_REASON_OPTIONS } from '@/types/recruitment'
import type { OnboardingTemplate } from '@/types/recruitmentConfig'
import {
  getOnboardingList,
  addOnboarding,
  updateOnboarding,
  deleteOnboarding,
  batchDeleteOnboarding,
  sendFillLink,
  simulateCandidateFill,
  triggerNoShowAlert,
  archiveNoShow,
  updateMultiDeptTasks
} from '@/api/onboarding-connection'
import type { MultiDeptTask } from '@/types/recruitment'
import { onboardingTemplateApi } from '@/api/recruitmentConfig'

defineOptions({
  name: 'RecruitmentOnboarding'
})

// 查询参数
const queryParams = reactive<OnboardingListParams>({
  onboardingNo: '',
  employeeName: '',
  position: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Onboarding[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增入职')
const detailVisible = ref(false)
const detailTab = ref<'info' | 'tasks'>('info')
const materialsVisible = ref(false)

// Phase 2 任务B2：多部门任务（从 detailData.multiDeptTasks JSON 解析）
const deptTasks = ref<MultiDeptTask[]>([])

// 表单数据
const formRef = ref<FormInstance>()
const formData = ref<Partial<Onboarding>>({
  employeeName: '',
  position: '',
  department: '',
  onboardingDate: '',
  mentor: '',
  phone: '',
  email: ''
})

// 详情数据
const detailData = ref<Partial<Onboarding>>({})

// 材料管理
const currentEmployee = ref('')
const currentOnboardingId = ref<number>(0)
const materialsList = ref<Array<{ id: number; name: string; completed: boolean }>>([
  { id: 1, name: '身份证复印件', completed: false },
  { id: 2, name: '学历证明', completed: false },
  { id: 3, name: '劳动合同', completed: false },
  { id: 4, name: '银行卡信息', completed: false },
  { id: 5, name: '入职体检报告', completed: false }
])

const completedCount = computed(() => {
  return materialsList.value.filter(m => m.completed).length
})

// 表单验证规则
const formRules: FormRules = {
  employeeName: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入入职岗位', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入所属部门', trigger: 'blur' }
  ],
  onboardingDate: [
    { required: true, message: '请选择入职日期', trigger: 'change' }
  ],
  mentor: [
    { required: true, message: '请输入导师姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 获取列表
const getList = async () => {
  try {
    const res = await getOnboardingList(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取入职列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.onboardingNo = ''
  queryParams.employeeName = ''
  queryParams.position = ''
  queryParams.status = null
  queryParams.page = 1
  queryParams.pageSize = 20
  getList()
}

// 表格选择
const handleSelectionChange = (selection: Onboarding[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增入职'
  formData.value = {
    employeeName: '',
    position: '',
    department: '',
    onboardingDate: '',
    mentor: '',
    phone: '',
    email: ''
  }
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: Onboarding) => {
  detailData.value = { ...row }
  detailTab.value = 'info'
  // 解析多部门任务
  try {
    deptTasks.value = row.multiDeptTasks ? JSON.parse(row.multiDeptTasks) : []
  } catch {
    deptTasks.value = []
  }
  detailVisible.value = true
}

// Phase 2 任务B2：多部门任务操作
const handleAddTask = () => {
  deptTasks.value.push({
    name: '',
    owner: 'IT',
    assignee: '',
    status: 'pending',
    remark: ''
  })
}

const handleRemoveTask = (idx: number) => {
  deptTasks.value.splice(idx, 1)
}

const handlePresetTasks = () => {
  deptTasks.value = [
    { name: '开通系统账号（OA/邮箱/钉钉）', owner: 'IT', assignee: '', status: 'pending', remark: '' },
    { name: '配发办公电脑及外设', owner: 'IT', assignee: '', status: 'pending', remark: '' },
    { name: '准备工位 + 门禁卡', owner: '行政', assignee: '', status: 'pending', remark: '' },
    { name: '安排入职导师对接', owner: 'HRBP', assignee: '', status: 'pending', remark: '' }
  ]
}

const handleSaveTasks = async () => {
  if (!detailData.value.id) return
  try {
    await updateMultiDeptTasks(detailData.value.id, JSON.stringify(deptTasks.value))
    ElMessage.success('多部门任务已保存')
    detailData.value = { ...detailData.value, multiDeptTasks: JSON.stringify(deptTasks.value) }
    getList()
  } catch {
    ElMessage.error('保存失败')
  }
}

// 材料管理
const handleManageMaterials = (row: Onboarding) => {
  currentEmployee.value = row.employeeName || ''
  currentOnboardingId.value = row.id

  // 根据完成度初始化材料列表
  const completed = row.completedMaterials || row.completed || 0
  materialsList.value.forEach((material, index) => {
    material.completed = index < completed
  })

  materialsVisible.value = true
}

// 材料状态变化
const handleMaterialChange = () => {
  // 材料状态变化时的处理逻辑
}

// 保存材料
const handleSaveMaterials = async () => {
  try {
    const completedMaterials = materialsList.value.filter(m => m.completed).length

    await updateOnboarding({
      id: currentOnboardingId.value,
      completedMaterials
    })

    ElMessage.success('保存成功')
    materialsVisible.value = false
    getList()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 完成入职
const handleComplete = async (row: Onboarding) => {
  try {
    await ElMessageBox.confirm('确认完成该员工的入职流程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateOnboarding({
      id: row.id,
      status: 3,
      accountStatus: 2
    })

    // 入职办理完成 → 自动创建试用期记录（对齐 Workday/SAP 业务流程）
    try {
      const { addProbationFromOnboarding } = await import('@/mock/probation')
      addProbationFromOnboarding({
        employeeId: row.id,
        employeeName: row.employeeName || row.candidateName,
        employeeCode: row.employeeNo || `EMP${String(row.id).padStart(4, '0')}`,
        departmentId: (row as any).departmentId || 0,
        departmentName: row.departmentName || row.department || '',
        positionId: (row as any).positionId || 0,
        positionName: row.positionName || row.position || '',
        entryDate: row.actualJoinDate || row.plannedJoinDate,
        probationMonths: 3
      })
    } catch (e) {
      console.warn('自动创建试用期记录失败（非关键）', e)
    }

    ElMessage.success('入职完成，试用期记录已自动创建')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await updateOnboarding(formData.value)
          ElMessage.success('更新成功')
        } else {
          await addOnboarding(formData.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确认删除选中的入职记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await batchDeleteOnboarding(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// ============ Phase 2.4 新增：自助填报 / 多部门任务 / 鸽子预警 / 爽约归档 ============

const currentRow = ref<Onboarding | null>(null)

// 入职资料模板
const onbTemplates = ref<OnboardingTemplate[]>([])
const loadOnbTemplates = async () => {
  const res = await onboardingTemplateApi.getList({ page: 1, pageSize: 100 })
  if (res.code === 200) {
    onbTemplates.value = res.data.list.filter((t: any) => t.status === 1)
  }
}

// 发送填报链接
const fillDialogVisible = ref(false)
const fillForm = reactive({ templateId: 0 })

const handleSendFillLink = (row: Onboarding) => {
  currentRow.value = row
  fillForm.templateId = row.onboardingTemplateId || onbTemplates.value[0]?.id || 0
  fillDialogVisible.value = true
}

const handleSendFillSubmit = async () => {
  if (!fillForm.templateId || !currentRow.value) {
    ElMessage.warning('请选择资料模板')
    return
  }
  const t = onbTemplates.value.find((x) => x.id === fillForm.templateId)
  try {
    await sendFillLink(currentRow.value.id, fillForm.templateId, t?.templateName || '')
    ElMessage.success('填报链接已生成并发送给候选人')
    fillDialogVisible.value = false
    getList()
  } catch {
    ElMessage.error('发送失败')
  }
}

// Demo：模拟候选人填报进度（渐增）
const handleSimulateFillProgress = async () => {
  if (!currentRow.value) return
  const current = currentRow.value.fillProgress || 0
  const next = Math.min(current + 25, 100)
  await simulateCandidateFill(currentRow.value.id, next)
  ElMessage.success(`候选人填报进度更新：${next}%`)
  getList()
  if (next >= 100) fillDialogVisible.value = false
}

// 更多操作
const handleMoreCommand = async (cmd: string, row: Onboarding) => {
  currentRow.value = row
  if (cmd === 'materials') {
    handleManageMaterials(row)
  } else if (cmd === 'complete') {
    await handleComplete(row)
  } else if (cmd === 'alert') {
    try {
      await ElMessageBox.confirm(`确认向「${row.employeeName}」及对接人发送鸽子预警通知？`, '预警确认', {
        type: 'warning'
      })
      await triggerNoShowAlert(row.id)
      ElMessage.success('已触发鸽子预警')
      getList()
    } catch {
      // 取消
    }
  } else if (cmd === 'archive') {
    archiveForm.reasonCode = ''
    archiveForm.remark = ''
    archiveDialogVisible.value = true
  }
}

// 爽约归档
const archiveDialogVisible = ref(false)
const archiveForm = reactive({ reasonCode: '', remark: '' })

const handleArchiveSubmit = async () => {
  if (!archiveForm.reasonCode || !currentRow.value) {
    ElMessage.warning('请选择爽约原因')
    return
  }
  const reason = NO_SHOW_REASON_OPTIONS.find((r) => r.code === archiveForm.reasonCode)
  const reasonText = reason
    ? reason.label + (archiveForm.remark ? `（${archiveForm.remark}）` : '')
    : archiveForm.remark
  try {
    await archiveNoShow(currentRow.value.id, reasonText)
    ElMessage.success('已归档')
    archiveDialogVisible.value = false
    getList()
  } catch {
    ElMessage.error('归档失败')
  }
}

// 初始化
onMounted(() => {
  loadOnbTemplates()
  getList()
})
</script>

<style scoped lang="scss">
.fill-progress {
  width: 100%;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.tasks-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>

<style scoped lang="scss">
.onboarding-container {
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

.materials-content {
  .materials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .employee-name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .materials-progress {
      font-size: 14px;
      color: #606266;
    }
  }

  .materials-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
