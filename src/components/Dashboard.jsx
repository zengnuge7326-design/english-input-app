import { useMemo, useState } from 'react'

const STUDY_TIME_KEY = 'english_study_time'
const CHECKIN_KEY = 'english_checkin'
const DAILY_KEY = 'english_daily_stats'

function loadStudyTime() {
  try { return JSON.parse(localStorage.getItem(STUDY_TIME_KEY) || '{}') } catch { return {} }
}
function loadCheckins() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '[]') } catch { return [] }
}
function loadDaily() {
  try { return JSON.parse(localStorage.getItem(DAILY_KEY) || '{}') } catch { return {} }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
function dateOffset(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
function getWeekDates() {
  const d = new Date()
  const day = d.getDay()
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(d)
    dd.setDate(d.getDate() - day + i)
    return dd.toISOString().slice(0, 10)
  })
}
function getMonthDates(year, month) {
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(year, month, i + 1)
    return d.toISOString().slice(0, 10)
  })
}

function formatDuration(seconds) {
  if (!seconds) return '没有学习'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}小时${m}分钟${s}秒`
  if (m > 0) return `${m}分钟${s}秒`
  return `${s}秒`
}

function sumDaily(daily, dates) {
  return dates.reduce((acc, d) => {
    const day = daily[d] || {}
    return {
      attempts: acc.attempts + (day.attempts || 0),
      mastered: acc.mastered + (day.mastered || 0),
      review: acc.review + (day.review || 0),
    }
  }, { attempts: 0, mastered: 0, review: 0 })
}

function heatColor(secs) {
  if (!secs) return 'bg-gray-800'
  if (secs < 300) return 'bg-blue-900'
  if (secs < 900) return 'bg-blue-700'
  if (secs < 1800) return 'bg-blue-500'
  return 'bg-blue-400'
}

export default function Dashboard({ sentences, progress, onStartExercise, onImport, changyongData, sampleData }) {
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [statsTab, setStatsTab] = useState('total')

  const studyTime = loadStudyTime()
  const checkins = loadCheckins()
  const daily = loadDaily()
  const today = todayStr()

  // Total stats from progress
  const totalStats = useMemo(() => {
    const allKeys = Object.keys(progress)
    let mastered = 0, review = 0, totalAttempts = 0
    allKeys.forEach(k => {
      const p = progress[k]
      if (p.status === 'mastered') mastered++
      else if (p.status === 'review') review++
      totalAttempts += p.attempts || 0
    })
    return {
      completed: mastered + review,
      attempts: totalAttempts,
      mastered,
      review,
      notMastered: allKeys.length - mastered - review,
      errors: Math.max(0, totalAttempts - (mastered + review)),
    }
  }, [progress])

  // Per-period stats from daily log
  const periodStats = useMemo(() => {
    const now = new Date()
    const monthDates = getMonthDates(now.getFullYear(), now.getMonth())
    const weekDates = getWeekDates()
    return {
      today: sumDaily(daily, [today]),
      yesterday: sumDaily(daily, [dateOffset(-1)]),
      week: sumDaily(daily, weekDates),
      month: sumDaily(daily, monthDates),
    }
  }, [daily, today])

  function getStats() {
    if (statsTab === 'total') return {
      completed: totalStats.completed,
      attempts: totalStats.attempts,
      mastered: totalStats.mastered,
      review: totalStats.review,
      notMastered: totalStats.notMastered,
      errors: totalStats.errors,
    }
    const p = periodStats[statsTab] || { attempts: 0, mastered: 0, review: 0 }
    return {
      completed: p.mastered + p.review,
      attempts: p.attempts,
      mastered: p.mastered,
      review: p.review,
      notMastered: 0,
      errors: Math.max(0, p.attempts - p.mastered - p.review),
    }
  }
  const s = getStats()

  // Study time
  const totalSeconds = Object.values(studyTime).reduce((a, b) => a + b, 0)
  const todaySeconds = studyTime[today] || 0
  const monthKeys = getMonthDates(calMonth.year, calMonth.month)
  const monthSeconds = monthKeys.reduce((a, k) => a + (studyTime[k] || 0), 0)

  // Checkin streak
  const checkinSet = new Set(checkins)
  let streak = 0
  let streakMax = 0
  const sortedCheckins = [...checkinSet].sort()
  let cur = 0
  for (let i = 0; i < sortedCheckins.length; i++) {
    if (i === 0) { cur = 1 } else {
      const prev = new Date(sortedCheckins[i - 1])
      const curr = new Date(sortedCheckins[i])
      cur = (curr - prev) / 86400000 === 1 ? cur + 1 : 1
    }
    if (cur > streakMax) streakMax = cur
  }
  let d = new Date(today)
  while (checkinSet.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }

  const monthName = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}`

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

      {/* Stats + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Stats card */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex gap-1 flex-wrap">
            {[
              { id: 'total', label: '总计' },
              { id: 'today', label: '今天' },
              { id: 'yesterday', label: '昨天' },
              { id: 'week', label: '本周' },
              { id: 'month', label: '本月' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setStatsTab(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${statsTab === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">完成句子数量</div>
              <div className="text-3xl font-bold text-white">{s.completed} <span className="text-base font-normal text-gray-500">个</span></div>
            </div>
            <div className="flex-1 bg-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">练习次数</div>
              <div className="text-3xl font-bold text-white">{s.attempts} <span className="text-base font-normal text-gray-500">次</span></div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
            {[
              { label: '错题本', val: s.errors },
              { label: '不熟悉', val: statsTab === 'total' ? s.notMastered : '-' },
              { label: '已掌握', val: s.mastered },
              { label: '加入复习', val: s.review },
              { label: statsTab === 'total' ? '总句子数' : '练习次数', val: statsTab === 'total' ? sentences.length : s.attempts },
            ].map(item => (
              <div key={item.label} className="bg-gray-800/60 rounded-xl py-3 px-2">
                <div className="text-xs text-gray-500 mb-1 leading-tight">{item.label}</div>
                <div className="text-xl font-bold text-white">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="text-sm font-semibold text-gray-300">快速开始</div>
          <button
            onClick={onStartExercise}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-sm"
          >
            ▶ 继续练习
          </button>
          <button
            onClick={() => onImport(changyongData.slice(0, 44), '常用句式 · 第 1 课')}
            className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors text-sm"
          >
            📖 常用句式 第1课
          </button>
          <button
            onClick={() => onImport(sampleData, '示例句子')}
            className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors text-sm"
          >
            📝 示例句子
          </button>
          <div className="mt-auto pt-2 border-t border-gray-800">
            <div className="text-xs text-gray-600 mb-1">当前课程</div>
            <div className="text-sm text-gray-300">{sentences.length} 句 · 已完成 {totalStats.completed} 句</div>
          </div>
        </div>
      </div>

      {/* Study time + checkin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⏱</span>
            <span className="text-sm font-semibold text-gray-300">学习时长</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: '累计', val: formatDuration(totalSeconds) },
              { label: '今日', val: formatDuration(todaySeconds) },
              { label: '本月', val: formatDuration(monthSeconds) },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 rounded-xl py-3 px-2">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-xs font-bold text-white leading-snug">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm font-semibold text-gray-300">打卡统计</span>
            {checkinSet.has(today) && <span className="ml-auto text-xs text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full">今日已打卡</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: '当前连续', val: streak },
              { label: '最高连续', val: streakMax },
              { label: '累计打卡', val: checkins.length },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 rounded-xl py-3">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-2xl font-bold text-white">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">📅</span>
            <span className="text-sm font-semibold text-gray-300">{monthName} 学习记录</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month - 1, 1); return { year: d.getFullYear(), month: d.getMonth() } })}
              className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs flex items-center justify-center transition-colors"
            >‹</button>
            <button
              onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month + 1, 1); return { year: d.getFullYear(), month: d.getMonth() } })}
              className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs flex items-center justify-center transition-colors"
            >›</button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {monthKeys.map((dateStr, i) => {
            const secs = studyTime[dateStr] || 0
            const isToday = dateStr === today
            const hasCheckin = checkinSet.has(dateStr)
            return (
              <div
                key={dateStr}
                title={`${dateStr}: ${formatDuration(secs)}${hasCheckin ? ' ✓打卡' : ''}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors relative
                  ${isToday ? 'ring-2 ring-blue-400' : ''}
                  ${heatColor(secs)}
                  ${secs > 0 ? 'text-white' : 'text-gray-600'}
                `}
              >
                {i + 1}
                {hasCheckin && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full" />}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-600">少</span>
          {['bg-gray-800', 'bg-blue-900', 'bg-blue-700', 'bg-blue-500', 'bg-blue-400'].map(c => (
            <div key={c} className={`w-4 h-4 rounded ${c}`} />
          ))}
          <span className="text-xs text-gray-600">多</span>
          <span className="ml-3 flex items-center gap-1 text-xs text-gray-600">
            <span className="w-2 h-2 bg-orange-400 rounded-full inline-block" /> 打卡
          </span>
        </div>
      </div>

    </div>
  )
}
