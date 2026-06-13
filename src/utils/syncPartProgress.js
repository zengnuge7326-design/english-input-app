const STORAGE_KEY = 'english_sync_part_counts'

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

function normalizeEntry(raw) {
  if (typeof raw === 'number') return { count: raw }
  if (raw && typeof raw === 'object') return { count: raw.count ?? 0 }
  return { count: 0 }
}

export function syncPartKey(bookId, unitLabel, part) {
  return `${bookId}::${unitLabel}::${part}`
}

export function getSyncPartCount(bookId, unitLabel, part) {
  if (!bookId || !unitLabel || !part) return 0
  const data = load()
  return normalizeEntry(data[syncPartKey(bookId, unitLabel, part)]).count
}

/** 完成一整次同步练习后 +1（调用方须保证只调一次） */
export function incrementSyncPartCount(bookId, unitLabel, part) {
  if (!bookId || !unitLabel || !part) return 0
  const data = load()
  const key = syncPartKey(bookId, unitLabel, part)
  const entry = normalizeEntry(data[key])
  entry.count = (entry.count ?? 0) + 1
  data[key] = entry.count
  save(data)
  return entry.count
}
