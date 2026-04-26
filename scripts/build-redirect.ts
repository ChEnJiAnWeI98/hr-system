/**
 * 构建跳转提示版 dist
 * 用法：pnpm build:redirect
 *
 * 用途：
 * - 生成只含一个静态 index.html 的 dist-redirect/ 目录
 * - 用于覆盖旧托管平台上的 dist，把已发出去的旧链接引导到新的 GitHub Pages 地址
 *
 * 输出：dist-redirect/index.html
 */
import { rmSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'redirect-page/index.html')
const outDir = resolve(root, 'dist-redirect')
const outFile = resolve(outDir, 'index.html')

if (!existsSync(src)) {
  console.error(`✗ 源文件不存在：${src}`)
  process.exit(1)
}

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true })
}
mkdirSync(outDir, { recursive: true })
copyFileSync(src, outFile)

console.log(`✓ 已生成：dist-redirect/index.html`)
console.log(`\n下一步：把 dist-redirect/ 整个目录上传到原型托管平台，覆盖原 dist 即可。`)
