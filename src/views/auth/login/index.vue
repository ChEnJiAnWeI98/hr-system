<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 左侧品牌区 -->
      <div class="brand-panel">
        <div class="brand-logo">
          <el-icon :size="48" color="#ffffff">
            <Grid />
          </el-icon>
        </div>
        <h2 class="brand-name">{{ systemName }}</h2>
        <p class="brand-desc">企业人力资源智能管理平台</p>
        <div class="brand-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="form-panel">
        <h3 class="form-title">{{ $t('login.title') }}</h3>
        <p class="form-subtitle">{{ $t('login.subTitle') }}</p>

        <ElForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          :key="formKey"
          @keyup.enter="handleSubmit"
          class="login-form"
        >
          <ElFormItem prop="username">
            <ElInput
              :placeholder="$t('login.placeholder.username')"
              v-model.trim="formData.username"
              :prefix-icon="User"
            />
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              :placeholder="$t('login.placeholder.password')"
              v-model.trim="formData.password"
              type="password"
              autocomplete="off"
              show-password
              :prefix-icon="Lock"
            />
          </ElFormItem>

          <div class="form-options">
            <ElCheckbox v-model="formData.rememberPassword">{{
              $t('login.rememberPwd')
            }}</ElCheckbox>
          </div>

          <ElButton class="login-btn" type="primary" @click="handleSubmit" :loading="loading">
            {{ $t('login.btnText') }}
          </ElButton>

          <p class="default-account">默认账号：admin / 123456</p>
        </ElForm>
      </div>
    </div>

    <p class="copyright">© 2026 人力资源系统 All Rights Reserved</p>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useUserStore } from '@/store/modules/user'
  import { useRBACStore } from '@/store/modules/rbac'
  import { useEmployeeStore } from '@/store/modules/employee'
  import { RBAC_ACCOUNT_MAP } from '@/mock/auth'
  import { useI18n } from 'vue-i18n'
  import { HttpError } from '@/utils/http/error'
  import { fetchLogin } from '@/api/auth'
  import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
  import { User, Lock, Grid } from '@element-plus/icons-vue'

  defineOptions({ name: 'Login' })

  const { t, locale } = useI18n()
  const formKey = ref(0)

  // 监听语言切换，重置表单
  watch(locale, () => {
    formKey.value++
  })

  const userStore = useUserStore()
  const rbacStore = useRBACStore()
  const empStore = useEmployeeStore()
  const router = useRouter()

  /**
   * 根据账号映射表找到对应员工池里的测试员工
   * 返回 employeeId（可能为 null，即超管不绑定）
   */
  const findEmployeeByFinder = (finder: string): number | null => {
    const all = empStore.employees
    switch (finder) {
      case 'none':
        return null
      case 'hr_lead':
        return (
          all.find((e) => e.orgId === 9 && e.level === 'P8')?.id ||
          all.find((e) => e.orgId === 9)?.id ||
          null
        )
      case 'hrbp_with_managed_orgs':
        return all.find((e) => e.managedOrgIds && e.managedOrgIds.length > 0)?.id || null
      case 'dept_manager_tech':
        return (
          all.find((e) => e.orgId === 6 && e.jobFamily === 'MGMT')?.id ||
          all.find((e) => e.orgId === 6)?.id ||
          null
        )
      case 'line_manager_with_subs': {
        const candidate = all.find(
          (e) => e.orgId === 10 && empStore.getSubordinates(e.id).length > 0
        )
        if (candidate) return candidate.id
        return all.find((e) => empStore.getSubordinates(e.id).length > 0)?.id || null
      }
      case 'regular_employee':
        return (
          all.find(
            (e) =>
              e.orgId === 10 &&
              e.status === 'regular' &&
              empStore.getSubordinates(e.id).length === 0
          )?.id ||
          all.find(
            (e) => e.status === 'regular' && empStore.getSubordinates(e.id).length === 0
          )?.id ||
          null
        )
      case 'any_interviewer':
        return all[0]?.id || null
      default:
        return null
    }
  }

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: 'admin',
    password: '123456',
    rememberPassword: true
  })

  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  // 登录
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // 表单验证
      const valid = await formRef.value.validate()
      if (!valid) return

      loading.value = true

      // 登录请求
      const { username, password } = formData

      const { code, data, message } = await fetchLogin({
        userName: username,
        password,
        captchaCode: '', // Mock 模式不需要验证码
        captchaId: ''
      })

      // 检查响应状态
      if (code === 200 && data) {
        const { token, refreshToken, user } = data

        // 验证token和用户信息
        if (!token) {
          throw new Error('Login failed - no token received')
        }
        if (!user) {
          throw new Error('Login failed - no user info received')
        }

        // 存储token和用户信息
        userStore.setToken(token, refreshToken)
        userStore.setUserInfo(user)
        userStore.setLoginStatus(true)

        // 🔐 V2.0 RBAC：联动设置当前登录角色 + 绑定员工 ID
        const rbacMap = RBAC_ACCOUNT_MAP[username]
        if (rbacMap) {
          const empId = findEmployeeByFinder(rbacMap.employeeFinder)
          rbacStore.setLoginIdentity(rbacMap.rbacRoleCode, empId)
        } else {
          // 未映射的账号默认降级为普通员工视图
          rbacStore.setLoginIdentity('employee', null)
        }

        // 登录成功处理
        showLoginSuccessNotice()
        // 使用硬刷新跳转(而非 router.push 软导航),
        // 确保所有 Pinia store 以登录态重新 hydrate,修复首次登录菜单不渲染的偶发问题
        window.location.href = '/workspace'
      } else {
        // 响应状态异常
        throw new Error(message || 'Login failed')
      }
    } catch (error) {
      // 处理 HttpError
      if (error instanceof HttpError) {
        console.error('[Login] Login failed:', error)
      } else {
        console.error('[Login] Unexpected error:', error)
      }
    } finally {
      loading.value = false
    }
  }

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 150)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
