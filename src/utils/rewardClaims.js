/**
 * 一次性奖励领取记录（localStorage）
 * 防止同步练习 / 测验重复刷宝石
 */
const STORAGE_KEY = 'english_reward_claims'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore quota */ }
}

/** @returns {boolean} true = 首次领取成功 */
export function tryClaimOnce(scopeKey, rewardId) {
  if (!scopeKey || !rewardId) return false
  const data = load()
  const scope = data[scopeKey] || {}
  if (scope[rewardId]) return false
  scope[rewardId] = Date.now()
  data[scopeKey] = scope
  save(data)
  return true
}

export function hasClaimed(scopeKey, rewardId) {
  if (!scopeKey || !rewardId) return false
  const data = load()
  return Boolean(data[scopeKey]?.[rewardId])
}

export function syncPartRewardScope(bookId, unitLabel, part) {
  return `sync::${bookId}::${unitLabel}::${part}`
}

export function quizRewardScope(title) {
  return `quiz::${title}`
}
