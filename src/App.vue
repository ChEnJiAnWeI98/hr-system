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
  })
</script>
