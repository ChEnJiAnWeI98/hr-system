<template>
  <ElConfigProvider size="default" :locale="locales[language]" :z-index="3000">
    <AccessGate>
      <RouterView></RouterView>
    </AccessGate>
  </ElConfigProvider>
</template>

<script setup lang="ts">
  import { useUserStore } from './store/modules/user'
  import { useMenuStore } from './store/modules/menu'
  import { router } from './router'
  import { buildMenuTreeFromRoutes } from './router/guards/beforeEach'
  import zh from 'element-plus/es/locale/lang/zh-cn'
  import en from 'element-plus/es/locale/lang/en'
  import { systemUpgrade } from './utils/sys'
  import AccessGate from '@/components/AccessGate.vue'

  import { setThemeTransitionClass } from './utils/theme/animation'
  import { checkStorageCompatibility } from './utils/storage'

  const userStore = useUserStore()
  const { language } = storeToRefs(userStore)

  const locales = {
    zh: zh,
    en: en
  }

  onBeforeMount(() => {
    setThemeTransitionClass(true)
  })

  onMounted(() => {
    // 检查存储兼容性
    checkStorageCompatibility()
    // 提升暗黑主题下页面刷新视觉体验
    setThemeTransitionClass(false)
    // 系统升级
    systemUpgrade()

    // 🔐 保险措施:App 挂载时主动注册菜单,避免依赖 beforeEach 时序
    // 配合 menuStore 关闭持久化,从根本上消除"首次登录菜单空白"的偶发问题
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const menuStore = useMenuStore()
      if (menuStore.menuList.length === 0) {
        const menuTree = buildMenuTreeFromRoutes(router)
        menuStore.setMenuList(menuTree)
      }
    }

    // ⚡ 性能优化:浏览器空闲时预加载所有懒加载路由 chunk
    // 目的:让后续菜单切换瞬间完成,避免跨境网络延迟造成的点击卡顿感
    preloadAllRouteChunks()
  })

  /**
   * 预加载所有路由的组件 chunk
   * 利用 requestIdleCallback 在浏览器空闲时段悄悄发起下载请求,
   * 让 Vercel 海外服务器的文件提前进入浏览器缓存,
   * 用户后续点菜单时直接从缓存读取,体感接近本地零延迟。
   */
  const preloadAllRouteChunks = (): void => {
    const trigger = () => {
      router.getRoutes().forEach((route) => {
        const comp = route.components?.default
        // 只对函数形式(动态 import)的组件预加载
        if (typeof comp === 'function') {
          // 调用函数触发 chunk 下载,静默捕获任何失败避免打扰用户
          try {
            const promise = (comp as () => Promise<unknown>)()
            if (promise && typeof promise.catch === 'function') {
              promise.catch(() => {})
            }
          } catch {
            // 忽略任何同步错误
          }
        }
      })
    }

    // 优先使用 requestIdleCallback(空闲时),降级用 setTimeout
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void
    }
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(trigger, { timeout: 3000 })
    } else {
      setTimeout(trigger, 2000)
    }
  }
</script>
