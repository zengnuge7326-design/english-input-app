/**
 * 输入阅读 · Gutenberg 导入/展示：去掉非正文噪声并弱化「全书大写」排版。
 * 供 catalog 运行时与 import 脚本共用。
 */

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
    /\bProduced by[^.!?]+[.!?]/gi,
    /\bHTML version by[^.!?]+[.!?]/gi,
    /\bTranscribed by[^.!?]+[.!?]/gi,
    /\bProofread(?:ing|ers)?[^.!?]+[.!?]/gi,
    /\bDistributed Proofreading[^.!?]+[.!?]/gi,
    /\bUpdated editions will replace[^.!?]+[.!?]/gi,
  ]
  for (const re of creditSnippets) {
    t = t.replace(re, ' ')
  }

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
