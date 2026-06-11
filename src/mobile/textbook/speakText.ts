/**
 * 课文朗读文本规范化：去 PDF 重复行、提取可 TTS 的英文
 */

/** 去掉 PDF 排版导致的整句/整段重复（如 "Nice to meet you. Nice to meet you."） */
export function dedupeDisplayText(en: string, zh?: string): { en: string; zh: string } {
  const cleanEn = dedupePhrase(en)
  const cleanZh = zh ? dedupePhraseZh(zh) : zh ?? ''
  return { en: cleanEn, zh: cleanZh }
}

function dedupePhrase(text: string): string {
  const t = text.trim()
  if (!t) return t

  // 整句重复两遍：「A? A?」「A. A.」「A! A!」
  const twin = t.match(/^(.+?)([.!?])\s+\1\2?$/)
  if (twin) return `${twin[1]}${twin[2]}`

  // 同一短句重复多遍（歌谣排版）
  for (const end of ['!', '?', '.'] as const) {
    if (!t.includes(end)) continue
    const parts = t.split(end).map(p => p.trim()).filter(Boolean)
    if (parts.length >= 2 && parts.every(p => p === parts[0])) {
      return `${parts[0]}${end}`
    }
  }

  return t
}

function dedupePhraseZh(text: string): string {
  const t = text.trim()
  if (!t) return t

  for (const end of ['。', '！', '？'] as const) {
    if (!t.includes(end)) continue
    const parts = t.split(end).map(p => p.trim()).filter(Boolean)
    if (parts.length >= 2 && parts.every(p => p === parts[0])) {
      return `${parts[0]}${end}`
    }
  }

  const twin = t.match(/^(.+?)([。！？])\s*\1\2?$/)
  if (twin) return `${twin[1]}${twin[2]}`

  return t
}

/** 供 TTS 使用的英文：去掉 IPA、括号注释、多余空白 */
export function toSpeakableText(en: string): string {
  let s = en
    .replace(/\/[^/]+\//g, ' ')
    .replace(/\([^)]*\)/g, '')
    .replace(/[""]/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()

  s = dedupePhrase(s)
  return s
}
