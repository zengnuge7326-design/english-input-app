import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'english_input_progress'
const DAILY_KEY = 'english_daily_stats'
const CHECKIN_KEY = 'english_checkin'
const ERROR_KEY = 'english_error_log'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadDaily() {
  try { return JSON.parse(localStorage.getItem(DAILY_KEY) || '{}') } catch { return {} }
}

function saveDaily(data) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(data))
}

function loadCheckins() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '[]') } catch { return [] }
}

function saveCheckins(data) {
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(data))
}

function loadErrors() {
  try { return JSON.parse(localStorage.getItem(ERROR_KEY) || '[]') } catch { return [] }
}

function saveErrors(data) {
  localStorage.setItem(ERROR_KEY, JSON.stringify(data))
}

// ── 错误记录 ──────────────────────────────────────────
export async function recordError(sentenceId, sentenceEn, word, userId) {
  // 本地
  const errors = loadErrors()
  errors.push({ sentenceId, sentenceEn, word, ts: Date.now() })
  if (errors.length > 500) errors.splice(0, errors.length - 500)
  saveErrors(errors)
  // 云端
  if (userId) {
    await supabase.from('error_log').insert({ user_id: userId, sentence_id: sentenceId, sentence_en: sentenceEn, word })
  }
}

export function getRecentErrors(days = 2) {
  const cutoff = Date.now() - days * 86400000
  const errors = loadErrors().filter(e => e.ts >= cutoff)
  const sentenceMap = {}
  const wordMap = {}
  for (const e of errors) {
    if (e.sentenceId != null) {
      const k = e.sentenceId
      if (!sentenceMap[k]) sentenceMap[k] = { sentenceId: e.sentenceId, sentenceEn: e.sentenceEn, count: 0 }
      sentenceMap[k].count++
    }
    if (e.word) {
      const w = e.word.toLowerCase()
      wordMap[w] = (wordMap[w] || 0) + 1
    }
  }
  const topSentences = Object.values(sentenceMap).sort((a, b) => b.count - a.count).slice(0, 10)
  const topWords = Object.entries(wordMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w, c]) => ({ word: w, count: c }))
  return { topSentences, topWords }
}

// ── 每日统计（本地）─────────────────────────────────────
function recordDailyAttempt() {
  const today = todayStr()
  const daily = loadDaily()
  if (!daily[today]) daily[today] = { attempts: 0, mastered: 0, review: 0 }
  daily[today].attempts = (daily[today].attempts || 0) + 1
  saveDaily(daily)
}

function recordDailyStatus(type) {
  const today = todayStr()
  const daily = loadDaily()
  if (!daily[today]) daily[today] = { attempts: 0, mastered: 0, review: 0 }
  daily[today][type] = (daily[today][type] || 0) + 1
  saveDaily(daily)
}

async function checkinToday(userId) {
  const today = todayStr()
  // 本地
  const checkins = loadCheckins()
  if (!checkins.includes(today)) {
    checkins.push(today)
    saveCheckins(checkins)
  }
  // 云端
  if (userId) {
    await supabase.from('checkins').upsert(
      { user_id: userId, date: today },
      { onConflict: 'user_id,date' }
    )
  }
}

// ── 云端进度同步工具 ──────────────────────────────────
async function upsertProgress(userId, sentenceId, patch) {
  await supabase.from('progress').upsert(
    { user_id: userId, sentence_id: sentenceId, ...patch },
    { onConflict: 'user_id,sentence_id' }
  )
}

// 登录时从云端拉取进度，合并到本地
async function pullCloudProgress() {
  const { data, error } = await supabase.from('progress').select('*')
  if (error || !data) return null
  const merged = load()
  for (const row of data) {
    const key = `sentence_${row.sentence_id}`
    const local = merged[key] || {}
    // 云端 status 优先（mastered > review > new），attempts 取最大值
    const cloudStatus = row.status || 'new'
    const localStatus = local.status || 'new'
    const statusPriority = { mastered: 2, review: 1, new: 0 }
    merged[key] = {
      status: statusPriority[cloudStatus] >= statusPriority[localStatus] ? cloudStatus : localStatus,
      attempts: Math.max(local.attempts || 0, row.attempts || 0)
    }
  }
  save(merged)
  return merged
}

// ── Hook ─────────────────────────────────────────────
export function useProgress(userId) {
  const [progress, setProgress] = useState(load)
  const [synced, setSynced] = useState(false)

  // 登录后从云端拉取进度
  useEffect(() => {
    if (!userId) { setSynced(false); return }
    pullCloudProgress().then(merged => {
      if (merged) setProgress(merged)
      setSynced(true)
    })
  }, [userId])

  const update = useCallback((id, patch) => {
    setProgress(prev => {
      const next = { ...prev, [`sentence_${id}`]: { ...prev[`sentence_${id}`], ...patch } }
      save(next)
      return next
    })
    if (userId) upsertProgress(userId, id, patch)
  }, [userId])

  const getStatus = useCallback((id) => {
    return progress[`sentence_${id}`] || { status: 'new', attempts: 0 }
  }, [progress])

  const markMastered = useCallback((id) => {
    update(id, { status: 'mastered' })
    recordDailyStatus('mastered')
  }, [update])

  const markReview = useCallback((id) => {
    update(id, { status: 'review' })
    recordDailyStatus('review')
  }, [update])

  const incrementAttempts = useCallback((id) => {
    setProgress(prev => {
      const key = `sentence_${id}`
      const next = { ...prev, [key]: { ...prev[key], attempts: (prev[key]?.attempts || 0) + 1 } }
      save(next)
      if (userId) upsertProgress(userId, id, { attempts: next[key].attempts })
      return next
    })
    recordDailyAttempt()
    checkinToday(userId)
  }, [userId])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress({})
  }, [])

  return { progress, getStatus, markMastered, markReview, incrementAttempts, reset, synced }
}
