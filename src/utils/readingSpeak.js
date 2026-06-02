/**
 * 输入阅读：按「整框 / 整句」解析要朗读的英文。
 */

/**
 * @param {string} en
 * @returns {{ text: string, wordStart: number, wordEnd: number }[]}
 */
export function splitEnglishIntoSentencesWithWordRange(en) {
  const normalized = en.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const words = normalized.split(/\s+/).filter(Boolean)
  const parts = normalized.split(/(?<=[.!?…])\s+(?=[\s"'“”(\[]*[A-Za-z0-9])/).filter(Boolean)

  let offset = 0
  /** @type {{ text: string, wordStart: number, wordEnd: number }[]} */
  const out = []
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const ws = trimmed.split(/\s+/).filter(Boolean)
    const len = ws.length
    out.push({
      text: trimmed,
      wordStart: offset,
      wordEnd: offset + len - 1,
    })
    offset += len
  }

  if (out.length === 0) {
    return [{ text: normalized, wordStart: 0, wordEnd: Math.max(0, words.length - 1) }]
  }
  return out
}

/**
 * @param {'box'|'sentence'} scope
 * @param {string} en 当前练习句全文（输入框显示的字符串）
 * @param {number} currentWordIdx ReadingParagraphInput 的全局词下标
 */
export function getSpeakTextForReading(scope, en, currentWordIdx = 0) {
  if (!en) return ''
  if (scope !== 'sentence') return en

  const segments = splitEnglishIntoSentencesWithWordRange(en)
  const idx = Number.isFinite(currentWordIdx) ? currentWordIdx : 0
  for (const seg of segments) {
    if (idx >= seg.wordStart && idx <= seg.wordEnd) return seg.text
  }
  return segments[0]?.text || en
}
