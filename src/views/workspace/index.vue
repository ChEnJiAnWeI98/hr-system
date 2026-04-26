<template>
  <div class="workspace-wrapper">
    <el-scrollbar class="workspace-scrollbar">
      <div class="workspace-container">
        <!-- 顶部用户信息区域 -->
        <div class="user-header">
      <div class="user-info-left">
        <el-avatar :size="60" :src="userInfo.avatar" class="user-avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div class="user-details">
          <div class="greeting-text">{{ greeting }}！{{ userInfo.position || '系统管理员' }}，祝你开心每一天！</div>
          <div class="user-meta">
            {{ userInfo.userName || userInfo.realName }} | {{ userInfo.department || userInfo.departmentName }} | {{ userInfo.position || '系统管理员' }}
          </div>
        </div>
      </div>
      <div class="user-info-right">
        <div class="weather-text">
          今日天气　{{ weatherInfo.city }}，{{ weatherInfo.weather }}，{{ weatherInfo.temperature }}°C～{{ weatherInfo.temperature + 10 }}°C，{{ weatherInfo.windDirection || '东南风' }}
        </div>
        <div class="login-time">
          最近登录　{{ loginTime }}
        </div>
      </div>
    </div>

    <!-- 员工统计卡片 -->
    <div v-if="isAdmin" class="stats-section">
      <div class="stat-card" @click="handleStatClick('onJob')">
        <div class="stat-icon" style="background: #5b9aff;">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.onJobCount || 3 }}</div>
        <div class="stat-label">在职员工</div>
      </div>
      <div class="stat-card" @click="handleStatClick('toBeOnboarded')">
        <div class="stat-icon" style="background: #9b7dd4;">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.toBeOnboardCount || 0 }}</div>
        <div class="stat-label">待入职员工</div>
      </div>
      <div class="stat-card" @click="handleStatClick('probation')">
        <div class="stat-icon" style="background: #8bc34a;">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.probationCount || 0 }}</div>
        <div class="stat-label">试用期员工</div>
      </div>
      <div class="stat-card" @click="handleStatClick('formal')">
        <div class="stat-icon" style="background: #f08080;">
          <el-icon><Checked /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.formalCount || 3 }}</div>
        <div class="stat-label">正式员工</div>
      </div>
      <div class="stat-card" @click="handleStatClick('toBeOffboarded')">
        <div class="stat-icon" style="background: #f0c674;">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.toBeOffboardCount || 0 }}</div>
        <div class="stat-label">待离职员工</div>
      </div>
      <div class="stat-card" @click="handleStatClick('offboarded')">
        <div class="stat-icon" style="background: #b0b0b0;">
          <el-icon><Close /></el-icon>
        </div>
        <div class="stat-number">{{ employeeStats.offboardCount || 0 }}</div>
        <div class="stat-label">已离职员工</div>
      </div>
    </div>

    <!-- 三栏布局 -->
    <div class="main-content">
      <!-- 左侧：快捷入口 -->
      <div class="left-section">
        <div class="section-card">
          <div class="section-header">
            <span class="section-title">快捷入口</span>
            <span class="section-subtitle">仅展示当前账号可访问的模块</span>
            <el-button text type="primary" @click="handleCustomizeShortcut">自定义</el-button>
          </div>
          <div class="shortcut-grid">
            <div
              v-for="item in shortcutList"
              :key="item.id"
              class="shortcut-item"
              @click="handleShortcutClick(item.path)"
            >
              <div class="shortcut-icon" :style="{ background: item.color }">
                <i class="iconfont-sys" v-html="item.icon"></i>
              </div>
              <div class="shortcut-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：日程待办 -->
      <div class="middle-section">
        <div class="section-card">
          <div class="section-header">
            <span class="section-title">日程待办</span>
            <el-button text type="primary" @click="handleViewAllSchedule">全部日程 ></el-button>
          </div>
          <div class="calendar-wrapper">
            <div class="calendar-header">
              <el-button text @click="handlePrevMonth">
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <span class="calendar-title">{{ currentYear }}年{{ currentMonth }}月</span>
              <el-button text @click="handleNextMonth">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <div class="calendar-body">
              <div class="calendar-weekdays">
                <div class="weekday">日</div>
                <div class="weekday">一</div>
                <div class="weekday">二</div>
                <div class="weekday">三</div>
                <div class="weekday">四</div>
                <div class="weekday">五</div>
                <div class="weekday">六</div>
              </div>
              <div class="calendar-days">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="calendar-day"
                  :class="{
                    'is-today': day.isToday,
                    'is-selected': day.isSelected,
                    'is-empty': day.isEmpty,
                    'has-schedule': day.hasSchedule
                  }"
                  @click="handleDayClick(day)"
                >
                  <span v-if="!day.isEmpty" class="day-number">{{ day.day }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="schedule-list">
            <div
              v-for="item in todaySchedules"
              :key="item.id"
              class="schedule-item"
            >
              <div class="schedule-dot" :style="{ background: item.color }"></div>
              <span class="schedule-time">{{ item.time }}</span>
              <span class="schedule-title">{{ item.title }}</span>
              <div class="schedule-actions">
                <el-button link size="small" @click="handleEditSchedule(item)">
                  编辑
                </el-button>
                <el-button link size="small" type="danger" @click="handleDeleteSchedule(item.id)">
                  删除
                </el-button>
              </div>
            </div>
            <div v-if="todaySchedules.length === 0" class="empty-schedule">
              暂无日程
            </div>
          </div>
          <div class="schedule-footer">
            <el-button type="primary" size="small" @click="handleAddSchedule">
              新增日程
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧：审批概况 -->
      <div class="right-section">
        <div class="section-card">
          <div class="section-header">
            <span class="section-title">审批概况</span>
            <el-button text type="primary" @click="handleViewAllApproval">全部审批 ></el-button>
          </div>
          <div class="approval-stats">
            <div class="approval-stat-item">
              <div class="approval-number">{{ approvalStats.total || 246 }}</div>
              <div class="approval-label">全部审批</div>
            </div>
            <div class="approval-stat-item">
              <div class="approval-number">{{ approvalStats.pending || 187 }}</div>
              <div class="approval-label">审批中</div>
            </div>
            <div class="approval-stat-item">
              <div class="approval-number">{{ approvalStats.approved || 28 }}</div>
              <div class="approval-label">已完成</div>
            </div>
            <div class="approval-stat-item">
              <div class="approval-number">{{ approvalStats.rejected || 31 }}</div>
              <div class="approval-label">已驳回</div>
            </div>
          </div>
          <div class="approval-chart-title">各类型审批数量　（共 15 类）</div>
          <div class="approval-chart">
            <div
              v-for="item in approvalTypeStats"
              :key="item.type"
              class="chart-bar"
            >
              <div class="bar-label">{{ item.type }}</div>
              <div class="bar-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="bar-value">{{ item.count }}</div>
              <div class="bar-wrapper">
                <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
              </div>
              <div class="bar-number">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </el-scrollbar>

    <!-- 日程编辑弹窗 -->
    <el-dialog
      v-model="scheduleDialogVisible"
      :title="scheduleForm.id ? '编辑日程' : '新增日程'"
      width="500px"
    >
      <el-form :model="scheduleForm" :rules="scheduleRules" ref="scheduleFormRef" label-width="100px">
        <el-form-item label="日程标题" prop="title">
          <el-input v-model="scheduleForm.title" placeholder="请输入日程标题" maxlength="100" />
        </el-form-item>
        <el-form-item label="日程日期" prop="date">
          <el-date-picker
            v-model="scheduleForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="日程时间" prop="time">
          <el-time-picker
            v-model="scheduleForm.time"
            placeholder="选择时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="日程类型" prop="type">
          <el-select v-model="scheduleForm.type" placeholder="请选择日程类型" style="width: 100%">
            <el-option label="会议" :value="1" />
            <el-option label="培训" :value="2" />
            <el-option label="外出" :value="3" />
            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="日程描述" prop="description">
          <el-input
            v-model="scheduleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入日程描述"
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSchedule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 快捷入口自定义弹窗 -->
    <el-dialog
      v-model="shortcutDialogVisible"
      title="自定义快捷入口"
      width="700px"
    >
      <div class="shortcut-customize">
        <div class="customize-tips">
          <el-alert
            title="最多可添加12个快捷入口，拖拽可调整顺序"
            type="info"
            :closable="false"
          />
        </div>

        <div class="customize-content">
          <div class="selected-shortcuts">
            <div class="section-title">已添加的快捷入口（{{ customShortcutList.length }}/12）</div>
            <VueDraggable
              v-model="customShortcutList"
              :animation="200"
              handle=".drag-handle"
              class="shortcut-drag-list"
            >
              <div
                v-for="item in customShortcutList"
                :key="item.id"
                class="shortcut-drag-item"
              >
                <span class="drag-handle">☰</span>
                <div class="shortcut-icon-small" :style="{ background: item.color }">
                  <i class="iconfont-sys" v-html="item.icon"></i>
                </div>
                <span class="shortcut-name-text">{{ item.name }}</span>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleRemoveShortcut(item.id)"
                >
                  删除
                </el-button>
              </div>
            </VueDraggable>
            <div v-if="customShortcutList.length === 0" class="empty-tip">
              暂无快捷入口，请从右侧添加
            </div>
          </div>

          <div class="available-shortcuts">
            <div class="section-title">可添加的功能</div>
            <div class="available-list">
              <div
                v-for="item in availableShortcuts"
                :key="item.id"
                class="available-item"
                :class="{ disabled: isShortcutAdded(item.id) || customShortcutList.length >= 12 }"
                @click="handleAddShortcut(item)"
              >
                <div class="shortcut-icon-small" :style="{ background: item.color }">
                  <i class="iconfont-sys" v-html="item.icon"></i>
                </div>
                <span class="shortcut-name-text">{{ item.name }}</span>
                <el-icon v-if="!isShortcutAdded(item.id) && customShortcutList.length < 12">
                  <Plus />
                </el-icon>
                <span v-else class="added-tag">已添加</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="shortcutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveShortcut">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import {
  User,
  UserFilled,
  Clock,
  Checked,
  Warning,
  Close,
  ArrowLeft,
  ArrowRight,
  Bell,
  Document,
  Plus
} from '@element-plus/icons-vue'
import {
  getUserInfo,
  getWeatherInfo,
  getEmployeeStats,
  getShortcutList,
  getScheduleList,
  getApprovalStats,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  updateShortcutList
} from '@/api/workspace'

const router = useRouter()

// 用户信息
const userInfo = ref<any>({})
const weatherInfo = ref<any>({})
const employeeStats = ref<any>({})
const shortcutList = ref<any[]>([])
const scheduleList = ref<any[]>([])
const approvalStats = ref<any>({})

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '上午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 登录时间
const loginTime = ref('2026-04-07 15:23:49')

// 是否管理员（根据角色权限判断）
const isAdmin = computed(() => {
  // 从用户信息中获取角色
  const role = userInfo.value.roleName || userInfo.value.position || ''
  // 判断是否为管理员角色
  return role.includes('管理员') || role.includes('admin') || role.toLowerCase().includes('administrator')
})

// 日历相关
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const selectedDate = ref(new Date())

// 日程弹窗
const scheduleDialogVisible = ref(false)
const scheduleFormRef = ref<FormInstance>()
const scheduleForm = ref({
  id: 0,
  title: '',
  date: '',
  time: '',
  type: 1,
  status: 1,
  description: ''
})

// 日程表单验证规则
const scheduleRules: FormRules = {
  title: [
    { required: true, message: '请输入日程标题', trigger: 'blur' },
    { max: 100, message: '日程标题最多100个字符', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日程日期', trigger: 'change' }
  ],
  time: [
    { required: true, message: '请选择日程时间', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择日程类型', trigger: 'change' }
  ]
}

// 快捷入口自定义
const shortcutDialogVisible = ref(false)
const customShortcutList = ref<any[]>([])

// 所有可用的快捷入口
const availableShortcuts = ref([
  { id: 1, name: '组织管理', icon: '&#xe813;', path: '/organization/department', order: 1, color: '#5b9aff' },
  { id: 2, name: '员工管理', icon: '&#xe7ae;', path: '/employee/profile', order: 2, color: '#9b7dd4' },
  { id: 3, name: '考勤管理', icon: '&#xe88c;', path: '/attendance', order: 3, color: '#8bc34a' },
  { id: 4, name: '薪酬管理', icon: '&#xe88d;', path: '/salary', order: 4, color: '#f08080' },
  { id: 5, name: '绩效管理', icon: '&#xe88e;', path: '/performance', order: 5, color: '#f0c674' },
  { id: 6, name: '招聘管理', icon: '&#xe88f;', path: '/recruitment', order: 6, color: '#b0b0b0' },
  { id: 7, name: '培训管理', icon: '&#xe890;', path: '/training', order: 7, color: '#5b9aff' },
  { id: 8, name: '系统管理', icon: '&#xe891;', path: '/permission-template', order: 8, color: '#9b7dd4' },
  { id: 9, name: '岗位管理', icon: '&#xe7ae;', path: '/organization/position', order: 9, color: '#8bc34a' },
  { id: 10, name: '编制管理', icon: '&#xe813;', path: '/organization/staffing', order: 10, color: '#f08080' },
  { id: 11, name: '入职管理', icon: '&#xe7ae;', path: '/employee/onboarding', order: 11, color: '#f0c674' },
  { id: 12, name: '离职管理', icon: '&#xe7ae;', path: '/employee/offboarding', order: 12, color: '#b0b0b0' },
  { id: 13, name: '加班记录', icon: '&#xe88c;', path: '/attendance', order: 13, color: '#5b9aff' },
  { id: 14, name: '补卡申请', icon: '&#xe88c;', path: '/attendance', order: 14, color: '#9b7dd4' },
  { id: 15, name: '请假管理', icon: '&#xe88c;', path: '/leave', order: 15, color: '#8bc34a' },
  { id: 16, name: '合同管理', icon: '&#xe88d;', path: '/contract', order: 16, color: '#f08080' }
])

// 日历天数
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekday = firstDay.getDay()

  const days: any[] = []

  // 填充空白格子（上个月的位置）
  for (let i = 0; i < startWeekday; i++) {
    days.push({
      day: '',
      date: '',
      isEmpty: true,
      isToday: false,
      isSelected: false,
      hasSchedule: false
    })
  }

  // 当前月的日期
  const today = new Date()
  const selected = selectedDate.value
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && i === today.getDate()
    const isSelected = year === selected.getFullYear() && month === selected.getMonth() + 1 && i === selected.getDate()
    const hasSchedule = scheduleList.value.some(s => s.date === dateStr)
    days.push({
      day: i,
      date: dateStr,
      isEmpty: false,
      isToday,
      isSelected,
      hasSchedule
    })
  }

  return days
})

// 选中日期的日程
const todaySchedules = computed(() => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return scheduleList.value.filter(s => s.date === dateStr)
})

// 审批类型统计
const approvalTypeStats = ref([
  { type: '请假', count: 1, percentage: 2 },
  { type: '采购', count: 2, percentage: 4 },
  { type: '报销', count: 3, percentage: 6 },
  { type: '补卡', count: 5, percentage: 10 },
  { type: '领用', count: 6, percentage: 12 },
  { type: '合同', count: 8, percentage: 16 },
  { type: '出差', count: 10, percentage: 20 },
  { type: '加班', count: 16, percentage: 32 },
  { type: '外出', count: 20, percentage: 40 },
  { type: '离职', count: 21, percentage: 42 },
  { type: '入职', count: 30, percentage: 60 },
  { type: '转正', count: 32, percentage: 64 },
  { type: '调薪', count: 42, percentage: 84 },
  { type: '审批', count: 50, percentage: 100 }
])

// 处理统计卡片点击（根据权限跳转到对应页面）
const handleStatClick = (type: string) => {
  // 根据不同的统计类型跳转到对应的员工管理页面，并传递筛选参数
  router.push(`/employee/profile?status=${type}`)
}

// 处理快捷入口点击（根据权限判断是否可访问）
const handleShortcutClick = (path: string) => {
  // 直接跳转到对应路径，路由守卫会处理权限验证
  router.push(path)
}

// 处理日期点击
const handleDayClick = (day: any) => {
  if (!day.isEmpty) {
    selectedDate.value = new Date(day.date)
  }
}

// 上一月
const handlePrevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
}

// 下一月
const handleNextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
}

// 查看全部日程
const handleViewAllSchedule = () => {
  ElMessage.info('跳转到日程管理页面')
}

// 查看全部审批（跳转到审批待办页面）
const handleViewAllApproval = () => {
  // 跳转到审批引擎的待办列表页面
  router.push('/approval-engine/todo')
}

// 打开快捷入口自定义弹窗
const handleCustomizeShortcut = () => {
  customShortcutList.value = JSON.parse(JSON.stringify(shortcutList.value))
  shortcutDialogVisible.value = true
}

// 判断快捷入口是否已添加
const isShortcutAdded = (id: number) => {
  return customShortcutList.value.some(item => item.id === id)
}

// 添加快捷入口
const handleAddShortcut = (item: any) => {
  if (isShortcutAdded(item.id)) {
    ElMessage.warning('该快捷入口已添加')
    return
  }
  if (customShortcutList.value.length >= 12) {
    ElMessage.warning('最多只能添加12个快捷入口')
    return
  }
  customShortcutList.value.push({ ...item })
}

// 删除快捷入口
const handleRemoveShortcut = (id: number) => {
  const index = customShortcutList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    customShortcutList.value.splice(index, 1)
  }
}

// 保存快捷入口配置
const handleSaveShortcut = async () => {
  try {
    await updateShortcutList(customShortcutList.value)
    ElMessage.success('保存成功')
    shortcutDialogVisible.value = false

    // 重新加载快捷入口列表
    const shortcutRes = await getShortcutList()
    shortcutList.value = shortcutRes.data
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 新增日程
const handleAddSchedule = () => {
  scheduleForm.value = {
    id: 0,
    title: '',
    date: selectedDate.value.toISOString().split('T')[0],
    time: '',
    type: 1,
    status: 1,
    description: ''
  }
  scheduleDialogVisible.value = true
}

// 编辑日程
const handleEditSchedule = (item: any) => {
  scheduleForm.value = {
    id: item.id,
    title: item.title,
    date: item.date,
    time: item.time,
    type: item.type,
    status: item.status,
    description: item.description || ''
  }
  scheduleDialogVisible.value = true
}

// 删除日程
const handleDeleteSchedule = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条日程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteSchedule(id)
    ElMessage.success('删除成功')

    // 重新加载日程列表
    const scheduleRes = await getScheduleList({})
    scheduleList.value = scheduleRes.data
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存日程
const handleSaveSchedule = async () => {
  if (!scheduleFormRef.value) return

  await scheduleFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (scheduleForm.value.id) {
        // 编辑
        await updateSchedule(scheduleForm.value)
        ElMessage.success('更新成功')
      } else {
        // 新增
        await addSchedule(scheduleForm.value)
        ElMessage.success('新增成功')
      }

      scheduleDialogVisible.value = false

      // 重新加载日程列表
      const scheduleRes = await getScheduleList({})
      scheduleList.value = scheduleRes.data
    } catch (error) {
      ElMessage.error(scheduleForm.value.id ? '更新失败' : '新增失败')
    }
  })
}

// 加载数据
const loadData = async () => {
  try {
    const [userRes, weatherRes, statsRes, shortcutRes, scheduleRes, approvalRes] = await Promise.all([
      getUserInfo(),
      getWeatherInfo(),
      getEmployeeStats(),
      getShortcutList(),
      getScheduleList({}),
      getApprovalStats()
    ])

    userInfo.value = userRes.data
    weatherInfo.value = weatherRes.data
    employeeStats.value = statsRes.data
    shortcutList.value = shortcutRes.data
    scheduleList.value = scheduleRes.data
    approvalStats.value = approvalRes.data
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.workspace-wrapper {
  height: 100%;
  overflow: hidden;
}

.workspace-scrollbar {
  height: 100%;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.workspace-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
}

// 顶部用户信息
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
}

.user-info-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.greeting-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-meta {
  font-size: 14px;
  color: #909399;
}

.user-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.weather-text,
.login-time {
  font-size: 14px;
  color: #606266;
}

// 员工统计
.stats-section {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 24px;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

// 三栏布局
.main-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.left-section,
.middle-section,
.right-section {
  display: flex;
  flex-direction: column;
}

.section-card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 460px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-subtitle {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

// 快捷入口
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow-y: auto;
  align-content: start;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f7fa;
    border-radius: 8px;
  }
}

.shortcut-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 22px;

  .iconfont-sys {
    font-size: 22px;
  }
}

.shortcut-name {
  font-size: 13px;
  color: #606266;
}

// 日历
.calendar-wrapper {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calendar-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.calendar-body {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.weekday {
  padding: 4px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  &:nth-child(7n) {
    border-right: none;
  }

  &:not(.is-empty):hover {
    background: #ecf5ff;
  }

  &.is-empty {
    cursor: default;
    background: #fafafa;
  }

  &.is-today {
    .day-number {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #409eff;
      color: #fff;
      border-radius: 50%;
      font-weight: 600;
    }
  }

  &.is-selected:not(.is-today) {
    background: #ecf5ff;

    .day-number {
      color: #409eff;
      font-weight: 600;
    }
  }

  &.has-schedule::after {
    content: '';
    position: absolute;
    bottom: 2px;
    width: 4px;
    height: 4px;
    background: #409eff;
    border-radius: 50%;
  }
}

.day-number {
  font-size: 12px;
  color: #606266;
}

// 日程列表
.schedule-list {
  margin-top: 12px;
  flex: 1;
  overflow-y: auto;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 6px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ecf5ff;
  }
}

.schedule-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.schedule-time {
  font-size: 13px;
  color: #606266;
  flex-shrink: 0;
}

.schedule-title {
  flex: 1;
  font-size: 13px;
  color: #303133;
}

.schedule-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  .el-button {
    padding: 0;
  }
}

.empty-schedule {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 14px;
}

.schedule-footer {
  margin-top: 12px;
  text-align: center;
  flex-shrink: 0;
}

// 审批概况
.approval-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.approval-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.approval-number {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
}

.approval-label {
  font-size: 14px;
  color: #606266;
}

.approval-chart-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.approval-chart {
  flex: 1;
  overflow-y: auto;
}

.chart-bar {
  display: grid;
  grid-template-columns: 40px 24px 30px 1fr 40px;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.bar-label {
  font-size: 14px;
  color: #606266;
  text-align: right;
}

.bar-icon {
  color: #909399;
  font-size: 16px;
}

.bar-value {
  font-size: 12px;
  color: #909399;
}

.bar-wrapper {
  height: 20px;
  background: #f5f7fa;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.3s;
}

.bar-number {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  text-align: right;
}
</style>
