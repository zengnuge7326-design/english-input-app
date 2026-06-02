#!/usr/bin/env node
/**
 * 将 ~/Desktop/gutenberg_texts（或 --src）下的分级 .txt 转为
 * public/gutenberg/<Level>/…json，并生成 src/data/gutenberg/generated-manifest.json
 *
 * 用法：
 *   node scripts/import-gutenberg-desktop.mjs --src ~/Desktop/gutenberg_texts
 *   node scripts/import-gutenberg-desktop.mjs --dry-run
 *
 * 选项：
 *   --max-chunks=N   每本书最多收录 N 条练习句（默认 800，0=不限制）
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sanitizeGutenbergSentence } from '../src/utils/gutenbergTextCleanup.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const LEVEL_META = [
  {
    id: 'level1',
    dir: 'Level1_初级',
    label: 'Level 1 初级',
    gradeHint: 'FK Grade 0–6 · 儿童 / 简单散文',
  },
  {
    id: 'level2',
    dir: 'Level2_中初级',
    label: 'Level 2 中初级',
    gradeHint: 'Grade 6–9',
  },
  {
    id: 'level3',
    dir: 'Level3_中级',
    label: 'Level 3 中级',
    gradeHint: 'Grade 9–12',
  },
  {
    id: 'level4',
    dir: 'Level4_中高级',
    label: 'Level 4 中高级',
    gradeHint: 'Grade 12–16',
  },
  {
    id: 'level5',
    dir: 'Level5_高级',
    label: 'Level 5 高级',
    gradeHint: 'Grade 16+ · 学术 / 古典文学',
  },
]

function parseArgs(argv) {
  let src = path.join(process.env.HOME || '', 'Desktop/gutenberg_texts')
  let dryRun = false
  let maxChunks = 800
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') dryRun = true
    else if (a.startsWith('--src=')) src = path.resolve(a.slice('--src='.length))
    else if (a === '--src') src = path.resolve(argv[++i] || '')
    else if (a.startsWith('--max-chunks=')) maxChunks = Number(a.slice('--max-chunks='.length)) || 0
    else if (a === '--max-chunks') maxChunks = Number(argv[++i]) || 0
  }
  return { src, dryRun, maxChunks }
}

/** @param {string} raw */
function cleanGutenbergBoilerplate(raw) {
  const start = raw.match(/\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG/i)
  let body = raw
  if (start) body = body.slice(start.index + start[0].length)

  const endTriple = body.match(/\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG/i)
  if (endTriple) body = body.slice(0, endTriple.index)

  const lower = body.toLowerCase()
  const plainEnd = lower.lastIndexOf('end of the project gutenberg')
  if (plainEnd >= 0) body = body.slice(0, plainEnd)

  return body.trim()
}

/** 桌面脚本保存的正文有时仍带 PG 页眉一行（EBOOK id ***） */
function stripLeadingEbookLine(body) {
  return body.replace(/^\s*EBOOK\s+\d+\s*\*{0,3}\s*/i, '').trim()
}

/**
 * 解析 download.py 写入的本地头，返回 { title, body }
 * @param {string} fullText
 */
function stripLocalHeader(fullText) {
  const lines = fullText.split(/\r?\n/)
  let title = ''
  let i = 0
  for (; i < lines.length; i++) {
    const line = lines[i]
    const m = /^Title:\s*(.+)$/i.exec(line)
    if (m) title = m[1].trim()
    if (/^={10,}$/.test(line.trim())) {
      i++
      break
    }
  }
  let body = lines.slice(i).join('\n')
  body = cleanGutenbergBoilerplate(body)
  body = stripLeadingEbookLine(body)
  body = body.replace(/\[Illustration[^\]]*\]/gi, ' ')
  body = body.replace(/\*\*\*[^\n]*EBOOK[^\n]*/gi, ' ')
  // 软换行合并成空格，段间空行保留为 \n\n，便于按段拆分
  body = body
    .replace(/\r/g, '')
    .replace(/([^\n])\n([^\n])/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
  return { title: title || 'Untitled', body }
}

/** @param {string} base */
function safeFileBase(base) {
  return base
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-.]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 180) || 'article'
}

/**
 * @param {string} text
 * @param {{ maxChunks: number, maxWords: number, minWords: number }} opts
 */
function bodyToSentences(text, opts) {
  const maxWords = opts.maxWords ?? 72
  const maxChunks = opts.maxChunks

  const t = text.replace(/\r/g, '\n').trim()
  const paragraphs = t
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/[ \t\n]+/g, ' ').trim())
    .filter((p) => p.length > 0 && !/^\[[^\]]+\]$/.test(p))

  /** @type {string[]} */
  const rough = []
  const sentenceSplit = /(?<=[.!?…])\s+(?=[\s"'(\[]*[A-Za-z0-9"'])/
  for (const p of paragraphs) {
    const parts = p.split(sentenceSplit).map((s) => s.trim()).filter(Boolean)
    if (parts.length <= 1) rough.push(p)
    else rough.push(...parts)
  }

  /** @param {string} s */
  const wc = (s) => s.split(/\s+/).filter(Boolean).length

  /** @type {string[]} */
  const chunks = []
  let buf = ''
  let bufWords = 0
  function flush() {
    const s = buf.trim()
    if (s.length) chunks.push(s)
    buf = ''
    bufWords = 0
  }

  for (const piece of rough) {
    const w = wc(piece)
    if (!buf) {
      buf = piece
      bufWords = w
      continue
    }
    if (bufWords + w <= maxWords) {
      buf = `${buf} ${piece}`
      bufWords += w
      continue
    }
    flush()
    buf = piece
    bufWords = w
  }
  flush()

  const limited =
    maxChunks > 0 && chunks.length > maxChunks ? chunks.slice(0, maxChunks) : chunks

  return limited.map((en) => ({ en }))
}

async function main() {
  const { src, dryRun, maxChunks } = parseArgs(process.argv)
  const outPublic = path.join(ROOT, 'public', 'gutenberg')
  const outManifest = path.join(ROOT, 'src', 'data', 'gutenberg', 'generated-manifest.json')

  if (!fs.existsSync(src)) {
    console.error(`源目录不存在: ${src}`)
    process.exit(1)
  }

  /** @type {typeof LEVEL_META & { articles: Array<{ id: string, title: string, url: string, sentenceCount: number }> }>} */
  const levelsOut = LEVEL_META.map((m) => ({
    ...m,
    articles: [],
  }))

  let fileCount = 0
  let errCount = 0

  for (const level of levelsOut) {
    const dirPath = path.join(src, level.dir)
    if (!fs.existsSync(dirPath)) {
      console.warn(`跳过（无此文件夹）: ${dirPath}`)
      continue
    }
    const names = fs.readdirSync(dirPath).filter((n) => n.endsWith('.txt') && !n.startsWith('.'))
    names.sort((a, b) => a.localeCompare(b, 'en'))

    fs.mkdirSync(path.join(outPublic, level.dir), { recursive: true })

    for (const name of names) {
      const txtPath = path.join(dirPath, name)
      try {
        const fullText = fs.readFileSync(txtPath, 'utf8')
        const { title, body } = stripLocalHeader(fullText)
        const sentences = bodyToSentences(body, { maxChunks })
          .map((s) => ({ en: sanitizeGutenbergSentence(s.en) }))
          .filter((s) => s.en.length > 0)
        if (sentences.length === 0) {
          console.warn(`无句子，跳过: ${txtPath}`)
          errCount++
          continue
        }

        const stem = path.basename(name, '.txt')
        const jsonName = `${safeFileBase(stem)}.json`
        const jsonRelDir = path.posix.join('gutenberg', level.dir.replace(/\\/g, '/'))
        const urlPath = `${jsonRelDir}/${jsonName}`

        const payload = { title, sentences }
        const id = `${level.id}_${path.basename(jsonName, '.json')}`

        if (!dryRun) {
          const jsonAbs = path.join(outPublic, level.dir, jsonName)
          fs.writeFileSync(jsonAbs, JSON.stringify(payload), 'utf8')
        }

        level.articles.push({
          id,
          title,
          url: urlPath,
          sentenceCount: sentences.length,
        })
        fileCount++
      } catch (e) {
        console.error(`失败 ${txtPath}:`, e)
        errCount++
      }
    }
  }

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: src,
    maxChunksPerBook: maxChunks,
    levels: levelsOut,
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(outManifest), { recursive: true })
    fs.writeFileSync(outManifest, JSON.stringify(manifest, null, 2), 'utf8')
  }

  const totalArticles = levelsOut.reduce((n, l) => n + l.articles.length, 0)
  console.log(
    dryRun ? `[dry-run] 将写入 ${totalArticles} 篇（未写磁盘）` : `已写入 ${totalArticles} 篇 JSON → public/gutenberg/`,
  )
  console.log(`manifest → ${outManifest}`)
  console.log(`失败/跳过: ${errCount}, 处理 txt: ${fileCount}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
