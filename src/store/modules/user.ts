import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LanguageEnum } from '@/enums/appEnum'
import { router } from '@/router'
import { useSettingStore } from './setting'
import { useRBACStore } from './rbac'
import { useWorktabStore } from './worktab'
import { AppRouteRecord } from '@/types/router'
import { setPageTitle } from '@/router/utils/utils'
import { resetRouterState } from '@/router/guards/beforeEach'
import { useMenuStore } from './menu'

/**
 * 用户状态管理
 * 管理用户登录状态、个人信息、语言设置、搜索历史、锁屏状态等
 */
export const useUserStore = defineStore(
  'userStore',
  () => {
    // 语言设置
    const language = ref(LanguageEnum.ZH)
    // 登录状态
    const isLogin = ref(false)
    // 锁屏状态
    const isLock = ref(false)
    // 锁屏密码
    const lockPassword = ref('')
    // 用户信息
    const info = ref<Partial<Api.Auth.UserInfo>>({})
    // 搜索历史记录
    const searchHistory = ref<AppRouteRecord[]>([])
    // 访问令牌
    const accessToken = ref('')
    // 刷新令牌
    const refreshToken = ref('')

    // 计算属性：获取用户信息
    const getUserInfo = computed(() => info.value)
    // 计算属性：获取设置状态
    const getSettingState = computed(() => useSettingStore().$state)
    // 计算属性：获取工作台状态
    const getWorktabState = computed(() => useWorktabStore().$state)
    // 计算属性：用户角色代码数组（V1.0 风格）
    const roleCodes = computed(() => (info.value.roles || []).map((r) => r.code))

    /** 读取 V2.0 RBAC 当前角色 code（Pinia useXxxStore 懒加载，无循环依赖问题） */
    const v2RoleCode = () => {
      try {
        const rbacStore = useRBACStore()
        return rbacStore.currentRoleCode as string
      } catch {
        return ''
      }
    }

    // 计算属性：超级管理员（兼容 V1.0 R_SUPER + V2.0 super_admin）
    const isSuperAdmin = computed(
      () => roleCodes.value.includes('R_SUPER') || v2RoleCode() === 'super_admin'
    )
    // 计算属性：HR 管理员（兼容 V1.0 R_HR + V2.0 super_admin/hr_admin/hr_bp）
    const isHR = computed(() => {
      if (roleCodes.value.includes('R_HR')) return true
      const v2 = v2RoleCode()
      return v2 === 'super_admin' || v2 === 'hr_admin' || v2 === 'hr_bp'
    })
    // 计算属性：部门负责人（兼容 V1.0 R_DEPT_MANAGER + V2.0 dept_manager/line_manager）
    const isDeptManager = computed(() => {
      if (roleCodes.value.includes('R_DEPT_MANAGER')) return true
      const v2 = v2RoleCode()
      return v2 === 'dept_manager' || v2 === 'line_manager'
    })

    /**
     * 判断当前用户是否拥有指定角色（支持字符串或数组）
     * 注意：R_SUPER 不再自动继承其他角色，如需业务权限必须通过多角色组合显式授予
     */
    const hasRole = (role: string | string[]): boolean => {
      const required = Array.isArray(role) ? role : [role]
      return required.some((r) => roleCodes.value.includes(r))
    }

    /**
     * 设置用户信息
     * @param newInfo 新的用户信息
     */
    const setUserInfo = (newInfo: Api.Auth.UserInfo) => {
      info.value = newInfo
    }

    /**
     * 设置登录状态
     * @param status 登录状态
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status
    }

    /**
     * 设置语言
     * @param lang 语言枚举值
     */
    const setLanguage = (lang: LanguageEnum) => {
      setPageTitle(router.currentRoute.value)
      language.value = lang
    }

    /**
     * 设置搜索历史
     * @param list 搜索历史列表
     */
    const setSearchHistory = (list: AppRouteRecord[]) => {
      searchHistory.value = list
    }

    /**
     * 设置锁屏状态
     * @param status 锁屏状态
     */
    const setLockStatus = (status: boolean) => {
      isLock.value = status
    }

    /**
     * 设置锁屏密码
     * @param password 锁屏密码
     */
    const setLockPassword = (password: string) => {
      lockPassword.value = password
    }

    /**
     * 设置令牌
     * @param newAccessToken 访问令牌
     * @param newRefreshToken 刷新令牌（可选）
     */
    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
      }
    }

    /**
     * 退出登录
     * 清空所有用户相关状态并跳转到登录页
     */
    const logOut = () => {
      // 清空用户信息
      info.value = {}
      // 重置登录状态
      isLogin.value = false
      // 重置锁屏状态
      isLock.value = false
      // 清空锁屏密码
      lockPassword.value = ''
      // 清空访问令牌
      accessToken.value = ''
      // 清空刷新令牌
      refreshToken.value = ''
      // 清空工作台已打开页面
      useWorktabStore().opened = []
      // 移除iframe路由缓存
      sessionStorage.removeItem('iframeRoutes')
      // 清空主页路径
      useMenuStore().setHomePath('')
      // 🔐 清空 RBAC 状态（重登陆时会重新设置）
      useRBACStore().setLoginIdentity('super_admin', null)
      // 重置路由状态
      resetRouterState()
      // 跳转到登录页
      router.push({ name: 'Login' })
    }

    return {
      language,
      isLogin,
      isLock,
      lockPassword,
      info,
      searchHistory,
      accessToken,
      refreshToken,
      getUserInfo,
      getSettingState,
      getWorktabState,
      roleCodes,
      isSuperAdmin,
      isHR,
      isDeptManager,
      hasRole,
      setUserInfo,
      setLoginStatus,
      setLanguage,
      setSearchHistory,
      setLockStatus,
      setLockPassword,
      setToken,
      logOut
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
)
