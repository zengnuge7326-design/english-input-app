#!/usr/bin/env node
// prebuild-tts-mobile.mjs — pre-generate Edge Neural TTS for MOBILE content
//   • 教材句/词卡：src/mobile/textbook/data/{sections,secondaryBooks}.ts（TS → esbuild 打包后 import）
//   • 词汇单词：src/data/{pep_words,renai_junior_words,bsda_words}.json（嵌套 .word 字段）
// 复用桌面脚本同一产物：public/tts/<hash>.mp3 + src/data/ttsAudioMap.json
// Usage: node prebuild-tts-mobile.mjs [--voice en-US-AvaNeural] [--limit 99999] [--dry-run] [--only textbook|vocab]
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, unlinkSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'
import crypto from 'crypto'
import { build } from 'esbuild'

const execFileAsync = promisify(execFile)
const ROOT = new URL('.', import.meta.url).pathname
const OUT_DIR = join(ROOT, 'public/tts')
const MAP_FILE = join(ROOT, 'src/data/ttsAudioMap.json')
const EDGE_TTS = join(ROOT, '.venv-edgetts/bin/edge-tts')

const args = process.argv.slice(2)
const getArg = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }
const VOICE = getArg('--voice') || 'en-US-AvaNeural'
const LIMIT = parseInt(getArg('--limit') || '99999', 10)
const ONLY = getArg('--only') // textbook | vocab | null(both)
const DRY = args.includes('--dry-run')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

// 与运行时 src/utils/wordAudio.js 的 normalizeKey 完全一致
function normalizeKey(text = '') {
  return String(text).toLowerCase()
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}
function hashKey(text) {
  return crypto.createHash('sha256').update(normalizeKey(text)).digest('hex').slice(0, 16)
}

// 递归收集对象树里的 en / word 字符串
function collectStrings(node, sink) {
  if (node == null) return
  if (Array.isArray(node)) { for (const v of node) collectStrings(v, sink); return }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'en' || k === 'word') && typeof v === 'string' && v.trim()) sink.add(v.trim())
      else collectStrings(v, sink)
    }
  }
}

// 用 esbuild 把 TS 数据模块打包成临时 mjs 再动态 import
async function loadTextbookData() {
  const entry = join(tmpdir(), `tts-tb-entry-${Date.now()}.ts`)
  const outfile = join(tmpdir(), `tts-tb-bundle-${Date.now()}.mjs`)
  writeFileSync(entry, `
    export { TEXTBOOK_BOOKS } from ${JSON.stringify(join(ROOT, 'src/mobile/textbook/data/sections.ts'))}
    export { JUNIOR_TEXTBOOK_BOOKS, SENIOR_TEXTBOOK_BOOKS } from ${JSON.stringify(join(ROOT, 'src/mobile/textbook/data/secondaryBooks.ts'))}
  `)
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    loader: { '.json': 'json' },
    logLevel: 'silent',
  })
  const mod = await import(`file://${outfile}`)
  try { rmSync(entry); rmSync(outfile) } catch {}
  return mod
}

const sentences = new Set()

if (ONLY !== 'vocab') {
  const tb = await loadTextbookData()
  collectStrings(tb.TEXTBOOK_BOOKS, sentences)
  collectStrings(tb.JUNIOR_TEXTBOOK_BOOKS, sentences)
  collectStrings(tb.SENIOR_TEXTBOOK_BOOKS, sentences)
  console.log(`教材（含词卡）唯一英文条目: ${sentences.size}`)
}

if (ONLY !== 'textbook') {
  const before = sentences.size
  for (const f of ['pep_words.json', 'renai_junior_words.json', 'bsda_words.json']) {
    const p = join(ROOT, 'src/data', f)
    if (!existsSync(p)) continue
    try { collectStrings(JSON.parse(readFileSync(p, 'utf8')), sentences) } catch {}
  }
  console.log(`词汇单词新增唯一条目: ${sentences.size - before}`)
}

// 载入既有 map，过滤已覆盖
let audioMap = {}
try { audioMap = JSON.parse(readFileSync(MAP_FILE, 'utf8')) } catch {}

const todo = [...sentences].filter(s => !audioMap[normalizeKey(s)]).slice(0, LIMIT)

console.log(`\n合计唯一条目: ${sentences.size}`)
console.log(`已在 map 中: ${sentences.size - [...sentences].filter(s => !audioMap[normalizeKey(s)]).length}`)
console.log(`待生成: ${todo.length}（limit ${LIMIT}）`)
console.log(`音色: ${VOICE}`)
if (DRY) {
  console.log('\n[dry-run] 样例待生成:')
  for (const s of todo.slice(0, 15)) console.log('  ·', s)
  process.exit(0)
}
console.log()

let done = 0, failed = 0
for (const text of todo) {
  const key = normalizeKey(text)
  const fname = `${hashKey(text)}.mp3`
  const outPath = join(OUT_DIR, fname)

  if (existsSync(outPath) && statSync(outPath).size > 0) {
    audioMap[key] = fname; done++; continue
  }

  process.stdout.write(`[${done + 1}/${todo.length}] ${text.slice(0, 50)}... `)
  try {
    await execFileAsync(EDGE_TTS, ['--voice', VOICE, '--text', text, '--write-media', outPath], { timeout: 20000 })
    if (!existsSync(outPath) || statSync(outPath).size === 0) {
      try { if (existsSync(outPath)) unlinkSync(outPath) } catch {}
      throw new Error('empty output')
    }
    audioMap[key] = fname; done++
    process.stdout.write('✓\n')
  } catch (err) {
    failed++
    try { if (existsSync(outPath) && statSync(outPath).size === 0) unlinkSync(outPath) } catch {}
    process.stdout.write(`✗ ${err.message?.slice(0, 40)}\n`)
  }

  if ((done + failed) % 25 === 0) writeFileSync(MAP_FILE, JSON.stringify(audioMap, null, 2))
}

writeFileSync(MAP_FILE, JSON.stringify(audioMap, null, 2))
console.log(`\n✅ 完成。生成 ${done}，失败 ${failed}。map 已写入 ttsAudioMap.json`)
