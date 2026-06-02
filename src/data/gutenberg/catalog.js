/**
 * 输入式阅读 · 分级目录。
 * 1) `Level*` 下任意 *.json 会 eager 打包（适合少量样例，如 sample.json）。
 * 2) 由 `node scripts/import-gutenberg-desktop.mjs` 生成的 `generated-manifest.json`
 *    指向 public/gutenberg 下的大文件，运行时按需 fetch，不把全书打进 bundle。
 *
 * JSON 格式：{ "title": "...", "sentences": [ { "en": "..." , "zh?": "..." } ] }
 */
import generatedManifest from './generated-manifest.json'
import { sanitizeGutenbergSentence } from '../../utils/gutenbergTextCleanup.js'

const level1Glob = import.meta.glob('./Level1_初级/*.json', { eager: true })
const level2Glob = import.meta.glob('./Level2_中初级/*.json', { eager: true })
const level3Glob = import.meta.glob('./Level3_中级/*.json', { eager: true })
const level4Glob = import.meta.glob('./Level4_中高级/*.json', { eager: true })
const level5Glob = import.meta.glob('./Level5_高级/*.json', { eager: true })

const STATIC_LEVELS = [
  {
    id: 'level1',
    dir: 'Level1_初级',
    label: 'Level 1 初级',
    gradeHint: 'FK Grade 0–6 · 儿童 / 简单散文',
    glob: level1Glob,
  },
  {
    id: 'level2',
    dir: 'Level2_中初级',
    label: 'Level 2 中初级',
    gradeHint: 'Grade 6–9',
    glob: level2Glob,
  },
  {
    id: 'level3',
    dir: 'Level3_中级',
    label: 'Level 3 中级',
    gradeHint: 'Grade 9–12',
    glob: level3Glob,
  },
  {
    id: 'level4',
    dir: 'Level4_中高级',
    label: 'Level 4 中高级',
    gradeHint: 'Grade 12–16',
    glob: level4Glob,
  },
  {
    id: 'level5',
    dir: 'Level5_高级',
    label: 'Level 5 高级',
    gradeHint: 'Grade 16+ · 学术 / 古典文学',
    glob: level5Glob,
  },
]

/** @param {Record<string, unknown>} globMap import.meta.glob(..., { eager: true }) */
function articlesFromGlob(globMap, levelPrefix) {
  return Object.entries(globMap)
    .map(([path, mod]) => {
      const fileBase = path.replace(/^.*[/\\]/, '').replace(/\.json$/i, '')
      const data = mod?.default ?? mod
      if (!data || typeof data !== 'object' || !Array.isArray(data.sentences)) {
        return null
      }
      return {
        id: `${levelPrefix}_${fileBase}`,
        title: String(data.title || fileBase).trim() || fileBase,
        raw: data,
        url: undefined,
        sentenceCount: undefined,
      }
    })
    .filter(Boolean)
}

function mergeAndSort(fromGlob, fromManifest) {
  const seen = new Set()
  const merged = []
  for (const a of [...fromGlob, ...fromManifest]) {
    if (seen.has(a.id)) continue
    seen.add(a.id)
    merged.push(a)
  }
  return merged.sort((a, b) => {
    const pri = (id) => (/sample/i.test(id) ? 0 : 1)
    const d = pri(a.id) - pri(b.id)
    if (d !== 0) return d
    return a.title.localeCompare(b.title, 'zh-Hans-CN')
  })
}

function buildLevels() {
  const manifestLevels = generatedManifest.levels || []
  return STATIC_LEVELS.map((meta) => {
    const globArticles = articlesFromGlob(meta.glob, meta.id)
    const mLevel = manifestLevels.find((l) => l.id === meta.id)
    const manifestArticles = (mLevel?.articles ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      url: a.url,
      sentenceCount: a.sentenceCount,
      raw: undefined,
    }))
    const { glob, ...rest } = meta
    return {
      ...rest,
      articles: mergeAndSort(globArticles, manifestArticles),
    }
  })
}

export const GUTENBERG_LEVELS = buildLevels()

/** @param {string} articleId @param {{ sentences: Array<{ en: string, zh?: string, id?: number }> }} raw */
export function gutenbergToSentences(articleId, raw) {
  const list = raw.sentences || []
  return list.map((s, i) => {
    const en = sanitizeGutenbergSentence((s.en || '').trim())
    return {
      id: `gb_${articleId}_${s.id ?? i + 1}`,
      en,
      zh: (s.zh && String(s.zh).trim()) || '（阅读原文，可关闭中文提示）',
    }
  }).filter((s) => s.en.length > 0)
}
