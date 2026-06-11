#!/usr/bin/env node
/**
 * 切换岛屿按钮样式（单色水晶 ↔ 双层 puck 旧版）
 *
 *   npm run island:mono     — 启用单色水晶
 *   npm run island:legacy   — 回退旧版（默认）
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entryPath = join(__dirname, '../src/mobile/MobileLearnApp.tsx')

const MONO = "./styles/map-island-mono.css"
const LEGACY = "./styles/map-island-legacy.css"

const mode = process.argv[2] === 'mono' ? 'mono' : 'legacy'
const target = mode === 'mono' ? MONO : LEGACY

let src = readFileSync(entryPath, 'utf8')
const importRe = /import\s+['"]\.\/styles\/map-island-(?:mono|legacy)\.css['"]/

if (!importRe.test(src)) {
  console.error('未找到岛屿样式 import，请检查 MobileLearnApp.tsx')
  process.exit(1)
}

if (src.includes(`'${target}'`) || src.includes(`"${target}"`)) {
  console.log(`已是${mode === 'legacy' ? '旧版双层' : '单色水晶'}样式，无需切换`)
  process.exit(0)
}

src = src.replace(importRe, `import '${target}'`)
writeFileSync(entryPath, src)

console.log(mode === 'legacy'
  ? '已回退到旧版双层 puck 岛屿样式'
  : '已切换到单色水晶岛屿样式')
console.log(`当前：import '${target}'`)
console.log(`切换：npm run island:${mode === 'legacy' ? 'mono' : 'legacy'}`)
