const STORAGE_KEY = 'english_main_lesson_counts'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function mainLessonKey(bookId, unitLabel) {
  return `${bookId}|${unitLabel}`
}

/** 主练习（输入跟句）完成整单元的次数 */
export function getMainLessonCount(bookId, unitLabel) {
  if (!bookId || !unitLabel) return 0
  const data = load()
  const raw = data[mainLessonKey(bookId, unitLabel)]
  return typeof raw === 'number' ? raw : (raw?.count ?? 0)
}

/** 完成最后一句话后 +1（调用方须保证只调一次） */
export function incrementMainLessonCount(bookId, unitLabel) {
  if (!bookId || !unitLabel) return 0
  const data = load()
  const key = mainLessonKey(bookId, unitLabel)
  const next = getMainLessonCount(bookId, unitLabel) + 1
  data[key] = next
  save(data)
  return next
}
