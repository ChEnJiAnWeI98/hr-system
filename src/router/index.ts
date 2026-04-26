import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './routes/staticRoutes'
import { asyncRoutes } from './routes/asyncRoutes'
import { configureNProgress } from './utils/utils'
import { setupBeforeEachGuard } from './guards/beforeEach'
import { setupAfterEachGuard } from './guards/afterEach'

// Mock 模式：合并静态路由和异步路由
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const allRoutes = USE_MOCK ? [...staticRoutes, ...asyncRoutes] : staticRoutes

// 创建路由实例
// history base 跟 vite base 保持一致(Vercel 是 /,GitHub Pages 是 /hr-system/)
// import.meta.env.BASE_URL 由 Vite 根据构建时的 base 配置自动注入
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes as any
})

// 初始化路由
export function initRouter(app: App<Element>): void {
  configureNProgress() // 顶部进度条
  setupBeforeEachGuard(router) // 路由前置守卫
  setupAfterEachGuard(router) // 路由后置守卫
  app.use(router)
}

// 主页路径，默认使用菜单第一个有效路径，配置后使用此路径
export const HOME_PAGE_PATH = '/workspace'
