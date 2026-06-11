/**
 * 输入阅读 · Gutenberg 导入/展示：去掉非正文噪声并弱化「全书大写」排版。
 * 供 catalog 运行时与 import 脚本共用。
 */

/** Gutenberg 无译文时的占位文案（历史数据；不再用于词下对齐） */
export const GUTENBERG_ZH_PLACEHOLDER = '（阅读原文，可关闭中文提示）'

/** @param {string} zh */
export function hasRealSentenceZh(zh) {
  const z = String(zh || '').trim()
  return z.length > 0 && z !== GUTENBERG_ZH_PLACEHOLDER
}

/** PG 斜体标记：_word_ 或 _word */
function stripPgItalicMarkers(text) {
  let t = String(text || '')
  t = t.replace(/_([^_]+)_/g, '$1')
  t = t.replace(/(^|[\s(])_([A-Za-z])/g, '$1$2')
  return t
}

/** 去掉段首书名 + BY + 作者行（如 BRAINCHILD BY HENRY SLESAR） */
function stripLeadingTitleByAuthor(text) {
  let t = String(text || '').trim()
  let prev = ''
  while (t !== prev) {
    prev = t
    t = t.replace(
      /^[A-Z][A-Z0-9'&,. -]{2,90}\s+BY\s+[A-Z][A-Z0-9'., -]{2,70}\s+/,
      '',
    ).trim()
  }
  return t
}

/** @param {string} text */
export function stripNonBodyEnglishChunk(text) {
  let t = String(text || '')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return t

  // 行首 EBOOK … ***（中间可有书名、引号）
  t = t.replace(/^[\s]*EBOOK\s+[\s\S]*?\*{1,3}\s*/i, '')
  t = t.replace(/^[\s]*ebook\s+/i, '')
  t = t.replace(/\bE[_\s]*\d{1,3}\s*[_\s]*/gi, ' ')
  t = t.replace(/\*{2,}/g, ' ')
  // PG 有时重复印两遍书名引号
  t = t.replace(/"([^"]{4,140})"\s*"\1"/gi, '"$1"')
  const creditSnippets = [
    /\bProduced by[\s\S]*?pgdp\.net\s*/gi,
    // 仅匹配全大写书名 + BY（如 BRAINCHILD BY），避免误伤正文
    /\bProduced by[\s\S]*?(?=\s+[A-Z]{4,}\s+BY\s+)/gi,
    /\bProduced by.{0,220}[.!?](?=\s)/gi,
    /\bHTML version by[^.!?]+[.!?]/gi,
    /\bTranscribed by[^.!?]+[.!?]/gi,
    /\bProofread(?:ing|ers)?[^.!?]+[.!?]/gi,
    /\bDistributed Proofreading[^.!?]+[.!?]/gi,
    /\bUpdated editions will replace[^.!?]+[.!?]/gi,
  ]
  for (const re of creditSnippets) {
    t = t.replace(re, ' ')
  }

  t = t.replace(/https?:\/\/(?:www\.)?pgdp\.net\S*/gi, ' ')
  t = t.replace(/\b(?:www\.)?pgdp\.net\b/gi, ' ')

  t = stripLeadingTitleByAuthor(t)
  t = stripPgItalicMarkers(t)

  return t.replace(/\s+/g, ' ').trim()
}

/** 句内大小写修正：独立词 I */
function fixEnglishPronouns(s) {
  return s.replace(/\bi\b/g, 'I')
}

/**
 * 若字母中大写占比过高，按句子边界做 sentence case（避免朗读「全大写标题腔」）。
 * @param {string} text
 */
export function normalizeAllCapsProse(text) {
  const t = String(text || '')
  const letters = t.replace(/[^a-zA-Z]/g, '')
  if (letters.length < 16) return fixEnglishPronouns(t)

  const upperCount = (t.match(/[A-Z]/g) || []).length
  const ratio = upperCount / letters.length
  if (ratio < 0.55) return fixEnglishPronouns(t)

  let s = t.toLowerCase()
  s = s.replace(/(^|[.!?…]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase())
  s = s.charAt(0).toUpperCase() + s.slice(1)
  return fixEnglishPronouns(s)
}

/** @param {string} en */
export function sanitizeGutenbergSentence(en) {
  let t = stripNonBodyEnglishChunk(en)
  t = normalizeAllCapsProse(t)
  t = t.replace(/\s+/g, ' ').trim()
  t = t.replace(/^"([a-z])/g, (_, c) => `"${c.toUpperCase()}`)
  if (t.length && /^[a-z]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1)
  return t
}
