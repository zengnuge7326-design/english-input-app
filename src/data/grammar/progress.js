// 语法练习进度持久化
// 每个 (bookId, unitLabel, mode) 记一份 { correct, total, ts }

const KEY = 'grammar_progress'

export function loadGrammarProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function saveAll(p) { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch {} }

export function saveGrammarScore(bookId, unitLabel, mode, correct, total) {
  const all = loadGrammarProgress()
  const k = `${bookId}|${unitLabel}|${mode}`
  const prev = all[k]
  // 只保留最高分（避免再来一遍后把成绩刷低）
  if (!prev || (correct / Math.max(1, total)) > (prev.correct / Math.max(1, prev.total))) {
    all[k] = { correct, total, ts: Date.now() }
    saveAll(all)
  }
}

export function getGrammarPercent(bookId, unitLabel, mode) {
  const all = loadGrammarProgress()
  const k = `${bookId}|${unitLabel}|${mode}`
  const s = all[k]
  if (!s || !s.total) return 0
  return Math.max(0, Math.min(1, s.correct / s.total))
}
