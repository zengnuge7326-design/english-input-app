import { useMemo, useState, useEffect, useRef } from 'react'
import { GOAL_OPTIONS } from '../hooks/useXP'
import { evaluateAchievements } from '../data/achievements'
import { getClassLeaderboard } from '../lib/teacher'

const SEEN_BADGES_KEY = 'english_seen_badges'

// 成就徽章卡
function AchievementsCard({ xp, isMember, isFounder }) {
  const badges = useMemo(
    () => evaluateAchievements({ ...xp, isMember, isFounder }),
    [xp, isMember, isFounder]
  )
  const earnedCount = badges.filter(b => b.earned).length

  // 检测新解锁（本地"已见"集合），轻量提示
  const [justEarned, setJustEarned] = useState([])
  useEffect(() => {
    let seen
    try { seen = new Set(JSON.parse(localStorage.getItem(SEEN_BADGES_KEY) || '[]')) } catch { seen = new Set() }
    const newly = badges.filter(b => b.earned && !seen.has(b.key)).map(b => b.key)
    if (newly.length) {
      const merged = [...new Set([...seen, ...badges.filter(b => b.earned).map(b => b.key)])]
      localStorage.setItem(SEEN_BADGES_KEY, JSON.stringify(merged))
      setJustEarned(newly)
      const t = setTimeout(() => setJustEarned([]), 4000)
      return () => clearTimeout(t)
    }
  }, [badges])

  return (
    <div className="lg-glass-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          <span>🏅</span>
          <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">成就徽章</span>
        </div>
        <span className="text-[10px] sm:text-xs text-[#707070]">{earnedCount} / {badges.length}</span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
        {badges.map(b => {
          const isNew = justEarned.includes(b.key)
          return (
            <div
              key={b.key}
              title={`${b.name}：${b.desc}${b.earned ? '' : '（未解锁）'}`}
              className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-0.5 transition-all
                ${b.earned ? 'border border-amber-300/50 bg-amber-50/80' : 'border border-transparent bg-white/40'}
                ${isNew ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
            >
              <span className={`text-lg leading-none ${b.earned ? '' : 'grayscale opacity-30'}`}>{b.icon}</span>
              <span className={`text-[9px] text-center leading-tight ${b.earned ? 'text-amber-800' : 'text-[#9ca3af]'}`}>{b.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 班级排行榜卡（学生端）
function ClassLeaderboardCard({ studentInfo }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!studentInfo?.classId) return
    getClassLeaderboard(studentInfo.classId, 7).then(d => { setData(d); setLoading(false) })
  }, [studentInfo?.classId])

  if (!studentInfo?.classId) return null
  const myId = String(studentInfo.studentId)
  const top = data?.students?.slice(0, 8) || []
  const myRow = data?.students?.find(s => String(s.id) === myId)
  const medal = (rank) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`

  return (
    <div className="lg-glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-sm font-semibold text-[#1a1a1a]">班级排行榜</span>
          <span className="text-xs text-[#707070]">· {studentInfo.className}</span>
        </div>
        {myRow && <span className="text-xs text-[#5b9bd5] font-medium">我排第 {myRow.rank} 名</span>}
      </div>
      {loading ? (
        <p className="text-[#707070] text-sm text-center py-4">加载中…</p>
      ) : top.length === 0 ? (
        <p className="text-[#707070] text-sm text-center py-4">本周还没有打卡记录，快来抢第一！</p>
      ) : (
        <div className="flex flex-col gap-1">
          {top.map(s => {
            const isMe = String(s.id) === myId
            return (
              <div key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${isMe ? 'border border-[#5b9bd5]/35 bg-[rgba(214,234,248,0.55)]' : ''}`}>
                <span className={`w-6 text-center font-bold ${s.rank <= 3 ? 'text-base' : 'text-[#9ca3af] text-xs'}`}>{medal(s.rank)}</span>
                <span className={`flex-1 truncate ${isMe ? 'text-[#1a1a1a] font-medium' : 'text-[#4a4a4a]'}`}>{s.name}{isMe ? '（我）' : ''}</span>
                <span className="text-amber-600 font-semibold tabular-nums">{s.points}</span>
                <span className="text-[#9ca3af] text-xs">分</span>
              </div>
            )
          })}
        </div>
      )}
      <div className="text-[11px] text-[#9ca3af] mt-3">积分 = 本周完成句数 × 2 + 单词数</div>
    </div>
  )
}

// 每日目标进度环
// 近 N 天日期 + 是否打卡 + 是否今天（用于顶部横向滚动连胜条）
function getRecentDays(checkinSet, todayKey, n = 21) {
  const WEEK_LABEL = ['日', '一', '二', '三', '四', '五', '六']
  const arr = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(todayKey)
    d.setDate(d.getDate() - i)
    const k = d.toISOString().slice(0, 10)
    arr.push({
      key: k,
      label: WEEK_LABEL[d.getDay()],
      dayNum: d.getDate(),
      isToday: k === todayKey,
      checked: checkinSet.has(k),
    })
  }
  return arr
}

// 顶部多邻国风：横向滚动连胜条，今天靠右
function StreakStripTop({ days, streak, streakMax }) {
  const scrollRef = useRef(null)
  // 进入时滚到最右（最新一天）
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [days.length])
  return (
    <div className="lg-glass-card flex items-center gap-3 px-3 py-2 border border-amber-200/40">
      <div className="shrink-0 flex items-center gap-1.5 pr-2 border-r border-amber-200/50">
        <span className="text-2xl leading-none">🔥</span>
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold text-amber-600 tabular-nums">{streak}</span>
          <span className="text-[9px] text-[#707070]">最高 {streakMax}</span>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto scrollbar-thin-amber pb-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {days.map(d => (
          <div
            key={d.key}
            className="flex flex-col items-center gap-0.5 shrink-0 w-7"
          >
            <div className={`text-[9px] font-medium leading-none ${d.isToday ? 'text-amber-600' : 'text-[#9ca3af]'}`}>{d.label}</div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] leading-none transition-all
                ${d.checked
                  ? 'bg-amber-400 text-white shadow-[0_0_8px_rgba(251,191,36,0.45)]'
                  : d.isToday
                    ? 'border-2 border-dashed border-amber-400/60 bg-white/70 text-amber-600'
                    : 'border border-black/5 bg-white/50 text-[#9ca3af]'}`}
            >
              {d.checked ? '🔥' : d.dayNum}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyGoalCard({ xp }) {
  if (!xp) return null
  const { todayXp, goal, streak, streakMax, totalXp, freezes, reachedGoalToday, setGoal } = xp
  const pct = Math.min(todayXp / goal, 1)
  const R = 34, C = 2 * Math.PI * R
  const remaining = Math.max(0, goal - todayXp)
  const sentencesLeft = Math.ceil(remaining / 2)
  return (
    <div className="lg-glass-card flex items-center gap-3 p-3">
      <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="7" />
          <circle
            cx="40" cy="40" r={R} fill="none"
            stroke={reachedGoalToday ? '#f59e0b' : '#5b9bd5'}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: 'stroke-dashoffset .6s ease, stroke .3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-lg font-bold leading-none ${reachedGoalToday ? 'text-amber-600' : 'text-[#1a1a1a]'}`}>{todayXp}</div>
          <div className="text-[9px] text-[#707070] mt-0.5">/{goal} XP</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-sm font-bold text-[#1a1a1a]">每日目标</span>
          {reachedGoalToday && <span className="text-amber-700 text-[10px] bg-amber-100 border border-amber-300/60 px-1.5 py-0.5 rounded-full">🎉 达成</span>}
        </div>
        <div className="text-[11px] text-[#707070] mb-1.5">
          {reachedGoalToday
            ? `已连续 ${streak} 天 · 最高 ${streakMax} 天`
            : `再练约 ${sentencesLeft} 句完成今日目标`}
        </div>
        <div className="flex items-center gap-1 flex-wrap min-w-0">
          {GOAL_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setGoal(o.value)}
              className={`shrink-0 px-1.5 py-0.5 rounded-lg text-[10px] font-medium transition-colors ${goal === o.value ? 'lg-tab-active' : 'lg-tab-inactive bg-white/50'}`}
            >
              {o.label}{o.value}
            </button>
          ))}
          <span className="ml-1 text-[10px] text-[#9ca3af] shrink-0">🏅 {totalXp} · ❄️ {freezes}</span>
        </div>
      </div>
    </div>
  )
}

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
  if (!secs) return 'bg-white/55 border border-black/5'
  if (secs < 300) return 'bg-sky-200'
  if (secs < 900) return 'bg-sky-400'
  if (secs < 1800) return 'bg-sky-500'
  return 'bg-sky-600'
}

export default function Dashboard({ sentences, progress, onStartExercise, onImport, onOpenGutenberg, changyongData, sampleData, xp, isMember, isFounder, studentInfo }) {
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

  const recentDays = getRecentDays(checkinSet, today, 21)

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 py-3 sm:py-5 flex flex-col gap-3 overflow-x-hidden">

      {/* ── 打卡连胜条（全宽） ── */}
      <StreakStripTop days={recentDays} streak={streak} streakMax={streakMax} />

      {/* ── 主网格：手机1列 / 平板2列 / 桌面3列 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* 每日目标进度环 */}
        <DailyGoalCard xp={xp} />

        {/* 快速开始 */}
        <div className="lg-glass-card flex flex-col gap-2.5 p-4">
          <div className="text-sm font-semibold text-[#1a1a1a]">快速开始</div>
          <button onClick={onStartExercise} className="lg-btn-primary w-full rounded-full py-2.5 text-sm font-semibold transition-colors">
            ▶ 继续练习
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onImport(changyongData.slice(0, 44), '常用句式 · 第 1 课')} className="lg-btn-secondary rounded-full py-2 text-xs font-medium transition-colors">
              📖 常用句式
            </button>
            <button onClick={() => onImport(sampleData, '示例句子')} className="lg-btn-secondary rounded-full py-2 text-xs font-medium transition-colors">
              📝 示例句子
            </button>
          </div>
          {onOpenGutenberg && (
            <button type="button" onClick={onOpenGutenberg} className="w-full rounded-full border border-[#b794f6]/40 bg-[rgba(235,222,240,0.5)] py-2 text-xs font-medium text-[#1a1a1a] transition-colors hover:bg-[rgba(235,222,240,0.75)]">
              📚 输入式阅读
            </button>
          )}
          <div className="mt-auto pt-2 border-t lg-divider">
            <div className="text-[10px] text-[#9ca3af]">当前课程：{sentences.length} 句 · 已完成 {totalStats.completed} 句</div>
          </div>
        </div>

        {/* 统计卡：平板跨2列（和前两卡合成2列），桌面单列 */}
        <div className="sm:col-span-2 lg:col-span-1 lg-glass-card flex flex-col gap-3 p-4">
          {/* Tab 切换 */}
          <div className="flex gap-1 flex-wrap">
            {[{ id: 'total', label: '总计' }, { id: 'today', label: '今天' }, { id: 'yesterday', label: '昨天' }, { id: 'week', label: '本周' }, { id: 'month', label: '本月' }].map(t => (
              <button key={t.id} onClick={() => setStatsTab(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statsTab === t.id ? 'lg-tab-active' : 'lg-tab-inactive'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {/* 主要数字 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="lg-stat-chip p-3">
              <div className="text-[11px] text-[#707070] mb-0.5">完成句子</div>
              <div className="text-2xl font-bold text-[#1a1a1a]">{s.completed}<span className="text-sm font-normal text-[#9ca3af] ml-1">个</span></div>
            </div>
            <div className="lg-stat-chip p-3">
              <div className="text-[11px] text-[#707070] mb-0.5">练习次数</div>
              <div className="text-2xl font-bold text-[#1a1a1a]">{s.attempts}<span className="text-sm font-normal text-[#9ca3af] ml-1">次</span></div>
            </div>
          </div>
          {/* 细分数据 */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[
              { label: '错题', val: s.errors },
              { label: '不熟', val: statsTab === 'total' ? s.notMastered : '-' },
              { label: '已掌握', val: s.mastered },
              { label: '复习', val: s.review },
              { label: statsTab === 'total' ? '总数' : '次数', val: statsTab === 'total' ? sentences.length : s.attempts },
            ].map(item => (
              <div key={item.label} className="lg-stat-chip py-2 px-0.5">
                <div className="text-[10px] text-[#707070] mb-0.5 leading-tight">{item.label}</div>
                <div className="text-sm sm:text-base font-bold text-[#1a1a1a]">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 班级排行榜（学生加入班级后显示） */}
      <ClassLeaderboardCard studentInfo={studentInfo} />

      {/* ── 次级网格：学习时长 + 打卡统计 + 成就（手机1列/平板2列/桌面3列） ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* 学习时长 */}
        <div className="lg-glass-card flex flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2">
            <span className="text-[#5b9bd5]">⏱</span>
            <span className="text-sm font-semibold text-[#1a1a1a]">学习时长</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: '累计', val: formatDuration(totalSeconds) },
              { label: '今日', val: formatDuration(todaySeconds) },
              { label: '本月', val: formatDuration(monthSeconds) },
            ].map(item => (
              <div key={item.label} className="lg-stat-chip py-2 px-1">
                <div className="text-[10px] text-[#707070] mb-0.5">{item.label}</div>
                <div className="text-[11px] font-bold text-[#1a1a1a] leading-snug">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 打卡统计 */}
        <div className="lg-glass-card flex flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span className="text-sm font-semibold text-[#1a1a1a]">打卡统计</span>
            {checkinSet.has(today) && (
              <span className="ml-auto text-[10px] text-emerald-700 bg-[rgba(232,248,245,0.9)] border border-emerald-200/70 px-2 py-0.5 rounded-full">今日✓</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: '当前连续', val: streak },
              { label: '最高连续', val: streakMax },
              { label: '累计打卡', val: checkins.length },
            ].map(item => (
              <div key={item.label} className="lg-stat-chip py-2">
                <div className="text-[10px] text-[#707070] mb-0.5">{item.label}</div>
                <div className="text-xl font-bold text-[#1a1a1a]">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 日历热力图（手机和平板跨全行，桌面单列） */}
        <div className="sm:col-span-2 lg:col-span-1 lg-glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📅</span>
              <span className="text-xs font-semibold text-[#1a1a1a]">{monthName}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month - 1, 1); return { year: d.getFullYear(), month: d.getMonth() } })}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/60 text-xs text-[#707070] hover:bg-white/90">‹</button>
              <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month + 1, 1); return { year: d.getFullYear(), month: d.getMonth() } })}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/60 text-xs text-[#707070] hover:bg-white/90">›</button>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {monthKeys.map((dateStr, i) => {
              const secs = studyTime[dateStr] || 0
              return (
                <div key={dateStr} title={`${dateStr}: ${formatDuration(secs)}${checkinSet.has(dateStr) ? ' ✓打卡' : ''}`}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium relative
                    ${dateStr === today ? 'ring-2 ring-[#5b9bd5]' : ''}
                    ${heatColor(secs)} ${secs > 0 ? 'text-white' : 'text-[#9ca3af]'}`}>
                  {i + 1}
                  {checkinSet.has(dateStr) && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-[#9ca3af]">少</span>
            {['bg-white/55', 'bg-sky-200', 'bg-sky-400', 'bg-sky-500', 'bg-sky-600'].map(c => (
              <div key={c} className={`w-3 h-3 rounded ${c}`} />
            ))}
            <span className="text-[10px] text-[#9ca3af]">多</span>
          </div>
        </div>
      </div>

      {/* 成就徽章（全宽） */}
      <AchievementsCard xp={xp} isMember={isMember} isFounder={isFounder} />

    </div>
  )
}
