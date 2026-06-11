import { useCallback, useEffect, useState } from 'react'

const API = 'https://okenglish.site/api'
const LS_KEY = 'english_unlocks'

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) || {}
  } catch { return {} }
}
function saveLocal(map) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)) } catch {}
}

/**
 * useUnlocks(token, isMember)
 *
 * 返回：
 *   isUnlocked(scope, itemId) → bool
 *   unlock(scope, itemId, cost, color='blue') → Promise<{ok, free?, reason?}>
 *   loading
 *   unlocks（原始 map）
 */
export default function useUnlocks(token, isMember) {
  const [unlocks, setUnlocks] = useState(loadLocal)
  const [loading, setLoading] = useState(false)

  // 拉取服务端状态（登录时）
  useEffect(() => {
    if (!token) {
      setUnlocks(loadLocal())
      return
    }
    let cancel = false
    setLoading(true)
    fetch(`${API}/unlock/state`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(j => {
        if (cancel) return
        const server = j.unlocks || {}
        const local = loadLocal()
        // 合并：服务端 ∪ 本地（保留早期未登录的解锁记录）
        const merged = { ...local }
        Object.keys(server).forEach(scope => {
          merged[scope] = { ...(merged[scope] || {}), ...server[scope] }
        })
        setUnlocks(merged)
        saveLocal(merged)
      })
      .catch(() => { /* 静默 */ })
      .finally(() => { if (!cancel) setLoading(false) })
    return () => { cancel = true }
  }, [token])

  const isUnlocked = useCallback((scope, itemId) => {
    if (isMember) return true
    return Boolean(unlocks?.[scope]?.[itemId])
  }, [unlocks, isMember])

  const unlock = useCallback(async (scope, itemId, cost, color = 'blue') => {
    // 本地乐观更新
    const localApply = () => {
      setUnlocks(prev => {
        const next = { ...prev, [scope]: { ...(prev[scope] || {}), [itemId]: { cost, color, at: Date.now() } } }
        saveLocal(next)
        return next
      })
    }

    if (!token) {
      // 未登录：仅本地记录（已扣的水晶走 useCrystal 本地）
      localApply()
      return { ok: true, free: false, local: true }
    }

    try {
      const r = await fetch(`${API}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scope, item_id: itemId, cost, color }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) {
        localApply()
        return { ok: true, free: !!j.free, cost: j.cost }
      }
      if (r.status === 402) {
        return { ok: false, reason: 'insufficient', need: j.need, have: j.have }
      }
      return { ok: false, reason: j.error || 'server_error' }
    } catch (e) {
      return { ok: false, reason: 'network' }
    }
  }, [token])

  return { isUnlocked, unlock, loading, unlocks }
}
