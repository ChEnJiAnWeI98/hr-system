/**
 * 清理开发环境缓存
 * 用法：pnpm clean:dev
 *
 * 清理项：
 * - node_modules/.vite  · Vite 依赖预打包缓存（大规模重命名/移动文件后必清）
 * - node_modules/.cache · 其它工具可能写的缓存目录
 */
import { rmSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

const targets = [
  'node_modules/.vite',
  'node_modules/.cache'
]

for (const t of targets) {
  const full = resolve(root, t)
  if (existsSync(full)) {
    try {
      rmSync(full, { recursive: true, force: true })
      console.log(`✓ 已清除：${t}`)
    } catch (err: any) {
      console.warn(`× 清除失败：${t}  ${err?.message || err}`)
    }
  } else {
    console.log(`· 不存在（跳过）：${t}`)
  }
}

console.log('\n开发缓存清理完成。建议重新启动 pnpm dev 并硬刷新浏览器（Cmd+Shift+R）。')
