/**
 * useXP —— 激励系统核心：XP 经验值 + 每日目标 + 连续打卡 streak
 * 登录用户走服务器（权威），未登录走本地 localStorage，逻辑一致。
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const API = 'https://okenglish.site/api'
const XP_KEY = 'english_xp'              // { 'YYYY-MM-DD': xp }
const GOAL_KEY = 'english_goal'          // number
const STREAK_KEY = 'english_xp_streak'   // { streak, streakMax, lastGoalDate, freezes }

export const GOAL_OPTIONS = [
  { value: 10, label: '轻松' },
  { value: 20, label: '标准' },
  { value: 30, label: '认真' },
  { value: 50, label: '疯狂' },
]

function todayStr() { return new Date().toISOString().slice(0, 10) }
function ydayStr() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10) }
function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000)
}

function loadLocalXP() { try { return JSON.parse(localStorage.getItem(XP_KEY) || '{}') } catch { return {} } }
function loadLocalGoal() { return parseInt(localStorage.getItem(GOAL_KEY)) || 20 }
function loadLocalStreak() { try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch { return {} } }

// 达标日的 streak 推进逻辑（与后端保持一致）
function advanceStreak(s, today, yesterday) {
  let streak = s.streak || 0, streakMax = s.streakMax || 0
  let lastGoalDate = s.lastGoalDate || null, freezes = s.freezes ?? 2
  if (lastGoalDate === today) return { streak, streakMax, lastGoalDate, freezes }
  if (lastGoalDate === yesterday) streak += 1
  else if (lastGoalDate && daysBetween(lastGoalDate, today) === 2 && freezes > 0) { freezes -= 1; streak += 1 }
  else streak = 1
  lastGoalDate = today
  if (streak > streakMax) streakMax = streak
  if (freezes < 2) freezes += 1
  return { streak, streakMax, lastGoalDate, freezes }
}

// 展示用的"有效连续天数"
function effectiveStreak(s, today) {
  if (!s.lastGoalDate) return 0
  const gap = daysBetween(s.lastGoalDate, today)
  if (gap <= 1) return s.streak
  if (gap === 2 && (s.freezes ?? 0) > 0) return s.streak
  return 0
}

function buildLocalState() {
  const t = todayStr()
  const xp = loadLocalXP()
  const goal = loadLocalGoal()
  const s = loadLocalStreak()
  const todayXp = xp[t] || 0
  const vals = Object.values(xp).map(v => v || 0)
  const totalXp = vals.reduce((a, b) => a + b, 0)
  return {
    todayXp, goal,
    streak: effectiveStreak(s, t),
    streakMax: s.streakMax || 0,
    totalXp,
    freezes: s.freezes ?? 2,
    reachedGoalToday: todayXp >= goal,
    activeDays: vals.filter(v => v > 0).length,
    maxDailyXp: vals.length ? Math.max(...vals) : 0,
  }
}

const EMPTY = { todayXp: 0, goal: 20, streak: 0, streakMax: 0, totalXp: 0, freezes: 2, reachedGoalToday: false, activeDays: 0, maxDailyXp: 0 }

export function useXP(token, onGoalReached) {
  const [state, setState] = useState(() => (token ? EMPTY : buildLocalState()))
  const stateRef = useRef(state)
  stateRef.current = state
  const onGoalRef = useRef(onGoalReached)
  onGoalRef.current = onGoalReached

  // 登录态变化：拉取服务器状态，或重建本地状态
  useEffect(() => {
    let alive = true
    if (token) {
      fetch(`${API}/xp/state`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (alive && !d.error) setState(s => ({ ...s, ...d })) })
        .catch(() => {})
    } else {
      setState(buildLocalState())
    }
    return () => { alive = false }
  }, [token])

  // 服务器写入的防抖批量队列
  const pendingRef = useRef(0)
  const timerRef = useRef(null)

  const flushServer = useCallback(() => {
    const amount = pendingRef.current
    pendingRef.current = 0
    if (!amount || !token) return
    fetch(`${API}/xp/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount }),
    })
      .then(r => r.json())
      .then(d => { if (!d.error) setState(s => ({ ...s, todayXp: d.todayXp, streak: d.streak, streakMax: d.streakMax, totalXp: d.totalXp, freezes: d.freezes, reachedGoalToday: d.reachedGoalToday })) })
      .catch(() => {})
  }, [token])

  const addXP = useCallback((amount) => {
    amount = Math.max(0, Math.min(1000, Math.round(amount) || 0))
    if (!amount) return
    const prev = stateRef.current
    const wasReached = prev.reachedGoalToday
    const nowReached = (prev.todayXp + amount) >= prev.goal
    const justReached = !wasReached && nowReached

    if (token) {
      // 乐观更新数字 + 即时庆祝；streak 由服务器回执校准
      setState(s => ({ ...s, todayXp: s.todayXp + amount, totalXp: s.totalXp + amount, reachedGoalToday: (s.todayXp + amount) >= s.goal }))
      pendingRef.current += amount
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flushServer, 1200)
    } else {
      // 本地完整计算
      const t = todayStr()
      const xp = loadLocalXP()
      xp[t] = (xp[t] || 0) + amount
      localStorage.setItem(XP_KEY, JSON.stringify(xp))
      let streakState = loadLocalStreak()
      if (justReached) {
        streakState = advanceStreak(streakState, t, ydayStr())
        localStorage.setItem(STREAK_KEY, JSON.stringify(streakState))
      }
      setState(buildLocalState())
    }
    if (justReached) onGoalRef.current?.(nowReached)
  }, [token, flushServer])

  const setGoal = useCallback((goal) => {
    if (![10, 20, 30, 50].includes(goal)) return
    setState(s => ({ ...s, goal, reachedGoalToday: s.todayXp >= goal }))
    if (token) {
      fetch(`${API}/xp/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ goal }),
      }).catch(() => {})
    } else {
      localStorage.setItem(GOAL_KEY, String(goal))
    }
  }, [token])

  // 页面隐藏时立即提交未写入的 XP
  useEffect(() => {
    function onHide() { if (document.visibilityState === 'hidden') { clearTimeout(timerRef.current); flushServer() } }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [flushServer])

  return { ...state, addXP, setGoal }
}
