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

export function syncPartKey(bookId, unitLabel, part) {
  return `${bookId}::${unitLabel}::${part}`
}

export function getSyncPartCount(bookId, unitLabel, part) {
  if (!bookId || !unitLabel || !part) return 0
  const data = load()
  return data[syncPartKey(bookId, unitLabel, part)] ?? 0
}

export function incrementSyncPartCount(bookId, unitLabel, part) {
  if (!bookId || !unitLabel || !part) return 0
  const data = load()
  const key = syncPartKey(bookId, unitLabel, part)
  const next = (data[key] ?? 0) + 1
  data[key] = next
  save(data)
  return next
}
