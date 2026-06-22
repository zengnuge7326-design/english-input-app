/**
 * useCrystal —— 五色钻石系统
 * 登录用户走服务器（权威，防作弊），未登录走 localStorage（本地体验一致）
 *
 * 五色定义：
 *   blue   完成单元
 *   green  零错误
 *   red    错题坚持
 *   purple 连击
 *   gold   会员专属 / 大成就
 *
 * 钻石塔：每100颗升1层（total / 100，向下取整）
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const API = 'https://okenglish.site/api'
const STORAGE_KEY = 'english_crystal'
const LOG_KEY = 'english_crystal_log'

export const COLORS = ['blue', 'green', 'red', 'purple', 'gold']
export const COLOR_META = {
  blue:   { emoji: '💙', name: '蓝钻石', desc: '完成单元' },
  green:  { emoji: '💚', name: '绿钻石', desc: '零错误' },
  red:    { emoji: '❤️', name: '红钻石', desc: '错题坚持' },
  purple: { emoji: '💜', name: '紫钻石', desc: '连击' },
  gold:   { emoji: '💛', name: '金钻石', desc: '充值获得' },
}

const EMPTY = { blue: 0, green: 0, red: 0, purple: 0, gold: 0, total: 0, towerLevel: 0 }

function loadLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const blue = raw.blue | 0, green = raw.green | 0, red = raw.red | 0
    const purple = raw.purple | 0, gold = raw.gold | 0
    const total = blue + green + red + purple + gold
    return { blue, green, red, purple, gold, total, towerLevel: Math.floor(total / 100) }
  } catch { return { ...EMPTY } }
}
function saveLocal(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      blue: s.blue, green: s.green, red: s.red, purple: s.purple, gold: s.gold,
    }))
  } catch {}
}
function loadLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') } catch { return [] }
}
function appendLog(entry) {
  const arr = loadLog()
  arr.unshift(entry)
  if (arr.length > 100) arr.length = 100
  try { localStorage.setItem(LOG_KEY, JSON.stringify(arr)) } catch {}
}

export function useCrystal(token) {
  const [state, setState] = useState(() => (token ? EMPTY : loadLocal()))
  const stateRef = useRef(state)
  stateRef.current = state

  // 最近获得记录（用于飘字动画 / 通知）
  const [recent, setRecent] = useState(null)
  // 最近扣除记录（用于破碎动效）
  const [recentSpend, setRecentSpend] = useState(null)

  // 拉取服务器状态
  useEffect(() => {
    let alive = true
    if (token) {
      fetch(`${API}/crystal/state`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (alive && !d.error) setState(s => ({ ...s, ...d })) })
        .catch(() => {})
    } else {
      setState(loadLocal())
    }
    return () => { alive = false }
  }, [token])

  // 批量队列（连续 earn 时合并请求，1.2s 后提交）
  const queueRef = useRef([])
  const timerRef = useRef(null)

  const flushEarn = useCallback(() => {
    if (!token) return
    const queue = queueRef.current
    queueRef.current = []
    if (!queue.length) return
    // 依次提交（保留 reason 信息便于服务端审计）
    ;(async () => {
      let last = null
      for (const item of queue) {
        try {
          const r = await fetch(`${API}/crystal/earn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(item),
          })
          const d = await r.json()
          if (!d.error) last = d
        } catch {}
      }
      if (last) setState(s => ({ ...s, ...last }))
    })()
  }, [token])

  /**
   * 获得钻石（核心 API）
   * @param {'blue'|'green'|'red'|'purple'|'gold'} color
   * @param {number} amount
   * @param {string} reason
   * @param {object} meta
   */
  const earn = useCallback((color, amount = 1, reason = 'unknown', meta = null) => {
    if (!COLORS.includes(color)) return
    const a = Math.max(1, Math.min(50, parseInt(amount) || 0))
    if (!a) return

    // 乐观更新（立刻显示）
    setState(s => {
      const next = { ...s, [color]: s[color] + a }
      next.total = next.blue + next.green + next.red + next.purple + next.gold
      next.towerLevel = Math.floor(next.total / 100)
      if (!token) saveLocal(next)
      return next
    })
    // 飘字提示（颜色随机，仅作视觉效果；真实余额按 total 统一结算）
    const animColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setRecent({ color: animColor, amount: a, reason, ts: Date.now() })
    // 本地流水（无论登录与否都记，方便面板展示）
    appendLog({ color, delta: a, reason, ts: Date.now() })

    if (token) {
      queueRef.current.push({ color, amount: a, reason, meta })
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flushEarn, 1200)
    }
  }, [token, flushEarn])

  /**
   * 消耗钻石（兑换道具）
   * 返回 Promise<boolean>，true=成功
   */
  const spend = useCallback(async (color, amount, reason = 'redeem', meta = null) => {
    // 统一为「总数」消费：余额按 total 校验；实际从能覆盖的颜色扣（金色优先，
    // 兼容后端统一金币——迁移后 gold === total 必命中）。传入 color 仅作历史兼容。
    const a = Math.max(1, Math.min(500, parseInt(amount) || 0))
    if (!a) return false
    const s = stateRef.current
    if ((s.total || 0) < a) return false
    // 选择实际扣除颜色：金色够则用金色；否则用余额最多的颜色
    let useColor = 'gold'
    if ((s.gold || 0) < a) {
      const richest = [...COLORS].sort((x, y) => (s[y] || 0) - (s[x] || 0))[0]
      useColor = (s[richest] || 0) >= a ? richest : 'gold'
    }

    if (token) {
      try {
        const r = await fetch(`${API}/crystal/spend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ color: useColor, amount: a, reason, meta }),
        })
        const d = await r.json()
        if (d.error) return false
        setState(st => ({ ...st, ...d }))
        appendLog({ color: useColor, delta: -a, reason, ts: Date.now() })
        setRecentSpend({ color: useColor, amount: a, reason, ts: Date.now() })
        return true
      } catch { return false }
    } else {
      setState(st => {
        const next = { ...st, [useColor]: Math.max(0, (st[useColor] || 0) - a) }
        next.total = next.blue + next.green + next.red + next.purple + next.gold
        next.towerLevel = Math.floor(next.total / 100)
        saveLocal(next)
        return next
      })
      appendLog({ color: useColor, delta: -a, reason, ts: Date.now() })
      setRecentSpend({ color: useColor, amount: a, reason, ts: Date.now() })
      return true
    }
  }, [token])

  /**
   * 惩罚扣除（答错等）——立即从总余额扣减，随机色「减号」动效。
   * 与购物 spend 不同：spend 需指定颜色且校验该色余额；penalize 面向「统一总数」，
   * 从有余额的颜色里扣（金色最后扣，过渡期保护已充值金币；后端统一金币后即只扣金色）。
   * @returns {Promise<boolean>}
   */
  const penalize = useCallback(async (amount = 1, reason = 'penalty', meta = null) => {
    const a = Math.max(1, Math.min(50, parseInt(amount) || 0))
    if (!a) return false
    const s = stateRef.current
    if ((s.total || 0) <= 0) return false
    // 选择扣除颜色：非金色按余额从多到少，金色排最后
    const order = [...COLORS].sort((x, y) => {
      if (x === 'gold') return 1
      if (y === 'gold') return -1
      return (s[y] || 0) - (s[x] || 0)
    })
    const color = order.find(c => (s[c] || 0) > 0) || 'gold'
    const ded = Math.min(a, s[color] || 0)
    if (ded <= 0) return false

    // 乐观更新：总数立即减少
    setState(st => {
      const next = { ...st, [color]: Math.max(0, (st[color] || 0) - ded) }
      next.total = next.blue + next.green + next.red + next.purple + next.gold
      next.towerLevel = Math.floor(next.total / 100)
      if (!token) saveLocal(next)
      return next
    })
    // 随机色「减号」动效
    const animColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setRecentSpend({ color: animColor, amount: ded, reason, ts: Date.now(), penalty: true })
    appendLog({ color, delta: -ded, reason, ts: Date.now() })

    if (token) {
      try {
        const r = await fetch(`${API}/crystal/spend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ color, amount: ded, reason, meta }),
        })
        const d = await r.json()
        if (!d.error) setState(st => ({ ...st, ...d }))
      } catch { /* 网络失败保留乐观值，下次 refresh 校准 */ }
    }
    return true
  }, [token])

  // 获取流水（登录从 server，未登录从 local）
  const getLog = useCallback(async (limit = 20) => {
    if (token) {
      try {
        const r = await fetch(`${API}/crystal/log?limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const d = await r.json()
        if (!d.error) return d.items || []
      } catch {}
      return []
    }
    return loadLog().slice(0, limit).map(x => ({ ...x, created_at: new Date(x.ts).toISOString() }))
  }, [token])

  const clearRecent = useCallback(() => setRecent(null), [])
  const clearRecentSpend = useCallback(() => setRecentSpend(null), [])

  const refresh = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/crystal/state`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      if (!d.error) {
        setState(s => {
          const next = { ...s, blue: d.blue ?? s.blue, green: d.green ?? s.green, red: d.red ?? s.red, purple: d.purple ?? s.purple, gold: d.gold ?? s.gold }
          next.total = next.blue + next.green + next.red + next.purple + next.gold
          next.towerLevel = Math.floor(next.total / 100)
          return next
        })
      }
    } catch { /* ignore */ }
  }, [token])

  // 页面隐藏时强制 flush
  useEffect(() => {
    function onHide() { if (document.visibilityState === 'hidden') { clearTimeout(timerRef.current); flushEarn() } }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [flushEarn])

  return { ...state, earn, spend, penalize, getLog, recent, clearRecent, recentSpend, clearRecentSpend, refresh }
}
