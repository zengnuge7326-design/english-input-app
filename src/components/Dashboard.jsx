import { useMemo, useState, useEffect } from 'react'
import { evaluateAchievements } from '../data/achievements'
import BadgeIcon from './BadgeIcons'
import { getClassLeaderboard } from '../lib/teacher'

const SEEN_BADGES_KEY = 'english_seen_badges'
const DAILY_KEY = 'english_daily_stats'
const CHECKIN_KEY = 'english_checkin'

function todayStr() { return new Date().toISOString().slice(0, 10) }
function dateOffset(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
function getWeekDates() {
  const d = new Date(), day = d.getDay()
  return Array.from({ length: 7 }, (_, i) => { const dd = new Date(d); dd.setDate(d.getDate() - day + i); return dd.toISOString().slice(0, 10) })
}
function getMonthDates(year, month) {
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1).toISOString().slice(0, 10))
}
function sumDaily(daily, dates) {
  return dates.reduce((acc, d) => {
    const day = daily[d] || {}
    return { attempts: acc.attempts + (day.attempts || 0), mastered: acc.mastered + (day.mastered || 0), review: acc.review + (day.review || 0) }
  }, { attempts: 0, mastered: 0, review: 0 })
}
function loadJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback } }

// ─── 连胜火焰条（7天，饱满橙色火球）─────────────────────────────────────────
function StreakRow({ checkinSet, streak, streakMax, today, xp }) {
  const WEEK = ['日', '一', '二', '三', '四', '五', '六']
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 6 + i)
    const k = d.toISOString().slice(0, 10)
    return { key: k, label: WEEK[d.getDay()], dayNum: d.getDate(), isToday: k === today, checked: checkinSet.has(k) }
  })
  return (
    <div className="lg-home-panel flex items-center gap-3 sm:gap-4 px-4 py-4 sm:py-5">
      {/* 连胜数字 */}
      <div className="shrink-0 flex items-center gap-2 pr-3 sm:pr-4 border-r border-amber-300/40">
        <span className="text-4xl sm:text-5xl leading-none drop-shadow-[0_2px_8px_rgba(255,159,67,0.55)]">🔥</span>
        <div className="flex flex-col leading-none gap-1">
          <span className="text-3xl font-extrabold bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent tabular-nums">{streak}</span>
          <span className="text-[10px] text-[#9ca3af]">最高 {streakMax}</span>
          {xp != null && (
            <span className="text-[10px] text-[#6b7280] tabular-nums">今日 {xp.todayXp}/{xp.goal} XP</span>
          )}
          {xp?.isDoubleXp && (
            <span className="inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg animate-pulse">
              ⚡ 双倍 XP 生效中
            </span>
          )}
        </div>
      </div>
      {/* 7 个火球，自适应等分，更大 */}
      <div className="flex-1 grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map(d => (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <span className={`text-[10px] font-semibold ${d.isToday ? 'text-amber-500' : 'text-[#b8b5c4]'}`}>{d.label}</span>
            <div className={`w-full aspect-square max-w-[52px] mx-auto text-base sm:text-lg font-bold lg-fire
              ${d.checked ? 'lg-fire-on' : d.isToday ? 'lg-fire-today' : 'lg-fire-off'}`}>
              {d.checked ? '🔥' : d.dayNum}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 统计面板 ────────────────────────────────────────────────────────────────
function StatsCard({ progress, sentences, daily, today }) {
  const [tab, setTab] = useState('total')
  const totalStats = useMemo(() => {
    const allKeys = Object.keys(progress)
    let mastered = 0, review = 0, totalAttempts = 0
    allKeys.forEach(k => {
      const p = progress[k]
      if (p.status === 'mastered') mastered++
      else if (p.status === 'review') review++
      totalAttempts += p.attempts || 0
    })
    return { completed: mastered + review, attempts: totalAttempts, mastered, review, notMastered: allKeys.length - mastered - review }
  }, [progress])

  const periodStats = useMemo(() => {
    const now = new Date()
    const weekDates = getWeekDates()
    const monthDates = getMonthDates(now.getFullYear(), now.getMonth())
    return {
      today: sumDaily(daily, [today]),
      yesterday: sumDaily(daily, [dateOffset(-1)]),
      week: sumDaily(daily, weekDates),
      month: sumDaily(daily, monthDates),
    }
  }, [daily, today])

  const s = tab === 'total' ? { ...totalStats, errors: Math.max(0, totalStats.attempts - totalStats.completed) }
    : (() => {
        const p = periodStats[tab] || {}
        return { completed: (p.mastered || 0) + (p.review || 0), attempts: p.attempts || 0, mastered: p.mastered || 0, review: p.review || 0, notMastered: 0, errors: Math.max(0, (p.attempts || 0) - (p.mastered || 0) - (p.review || 0)) }
      })()

  const TABS = [{ id: 'total', label: '总计' }, { id: 'today', label: '今天' }, { id: 'yesterday', label: '昨天' }, { id: 'week', label: '本周' }, { id: 'month', label: '本月' }]

  const smallChips = [
    { label: '错题', val: s.errors, cls: 'lg-chip-rose' },
    { label: '不熟', val: tab === 'total' ? s.notMastered : '-', cls: 'lg-chip-peach' },
    { label: '已掌握', val: s.mastered, cls: 'lg-chip-mint' },
    { label: '复习', val: s.review, cls: 'lg-chip-sky' },
    { label: tab === 'total' ? '总数' : '次数', val: tab === 'total' ? sentences.length : s.attempts, cls: 'lg-chip-lavender' },
  ]

  return (
    <div className="lg-home-panel p-4 sm:p-5 flex flex-col gap-4 h-full">
      {/* tab */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
              ${tab === t.id
                ? 'text-white shadow-[0_4px_12px_rgba(167,139,230,0.45)] bg-gradient-to-br from-[#b39ddb] to-[#9575cd]'
                : 'text-[#8a8796] bg-white/40 hover:bg-white/70'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {/* 两个大彩色芯片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="lg-chip lg-chip-sky p-4">
          <div className="lg-chip-label text-xs font-medium mb-1">完成句子</div>
          <div className="lg-chip-val text-3xl font-extrabold">{s.completed}<span className="text-sm font-medium opacity-60 ml-1">个</span></div>
        </div>
        <div className="lg-chip lg-chip-mint p-4">
          <div className="lg-chip-label text-xs font-medium mb-1">练习次数</div>
          <div className="lg-chip-val text-3xl font-extrabold">{s.attempts}<span className="text-sm font-medium opacity-60 ml-1">次</span></div>
        </div>
      </div>
      {/* 5 个小彩色芯片 */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {smallChips.map(item => (
          <div key={item.label} className={`lg-chip ${item.cls} py-2.5 px-1`}>
            <div className="lg-chip-label text-[10px] font-medium mb-0.5 leading-tight">{item.label}</div>
            <div className="lg-chip-val text-lg font-extrabold">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 成就徽章 ────────────────────────────────────────────────────────────────
function AchievementsCard({ xp, isMember, isFounder }) {
  const badges = useMemo(() => evaluateAchievements({ ...xp, isMember, isFounder }), [xp, isMember, isFounder])
  const earnedCount = badges.filter(b => b.earned).length
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
    <div className="lg-home-panel p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🏅</span>
          <span className="text-sm font-bold text-[#1a1a1a]">成就徽章</span>
        </div>
        <span className="text-xs font-semibold text-[#9ca3af]">{earnedCount} / {badges.length}</span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
        {badges.map(b => (
          <div key={b.key} title={`${b.name}：${b.desc}${b.earned ? '' : '（未解锁）'}`}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all
              ${b.earned ? 'bg-gradient-to-b from-white/70 to-white/30 shadow-md hover:scale-105' : 'bg-white/20'}
              ${justEarned.includes(b.key) ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}>
            <BadgeIcon name={b.key} size={42} locked={!b.earned} />
            <span className={`text-[10px] text-center leading-tight font-semibold tracking-wide ${b.earned ? 'text-[#3d2a5d]' : 'text-[#b8b5c4]'}`}>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 班级排行榜 ──────────────────────────────────────────────────────────────
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
  const medal = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `${r}`
  return (
    <div className="lg-home-panel p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-sm font-bold text-[#1a1a1a]">班级排行榜</span>
          <span className="text-xs text-[#9ca3af]">· {studentInfo.className}</span>
        </div>
        {myRow && <span className="text-xs text-[#9575cd] font-semibold">我第 {myRow.rank} 名</span>}
      </div>
      {loading ? <p className="text-[#9ca3af] text-sm text-center py-3">加载中…</p>
        : top.length === 0 ? <p className="text-[#9ca3af] text-sm text-center py-3">本周暂无记录</p>
        : <div className="flex flex-col gap-1.5">
            {top.map(s => {
              const isMe = String(s.id) === myId
              return (
                <div key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors
                  ${isMe ? 'lg-chip lg-chip-lavender' : 'bg-white/40'}`}>
                  <span className={`w-6 text-center font-bold ${s.rank <= 3 ? 'text-base' : 'text-[#9ca3af] text-xs'}`}>{medal(s.rank)}</span>
                  <span className={`flex-1 truncate ${isMe ? 'lg-chip-val font-semibold' : 'text-[#4a4a4a]'}`}>{s.name}{isMe ? '（我）' : ''}</span>
                  <span className="text-amber-600 font-bold tabular-nums">{s.points}</span>
                  <span className="text-[#9ca3af] text-xs">分</span>
                </div>
              )
            })}
          </div>}
      <div className="text-[10px] text-[#c0c0c0] mt-3">积分 = 本周句数 × 2 + 单词数</div>
    </div>
  )
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────
export default function Dashboard({ sentences, progress, xp, isMember, isFounder, studentInfo, onOpenAbout, onOpenMobileLearn }) {
  const today = todayStr()
  const checkins = loadJSON(CHECKIN_KEY, [])
  const daily = loadJSON(DAILY_KEY, {})

  const checkinSet = new Set(checkins)
  const sortedCheckins = [...checkinSet].sort()
  let streakMax = 0, cur = 0
  for (let i = 0; i < sortedCheckins.length; i++) {
    cur = i === 0 ? 1 : (new Date(sortedCheckins[i]) - new Date(sortedCheckins[i - 1])) / 86400000 === 1 ? cur + 1 : 1
    if (cur > streakMax) streakMax = cur
  }
  let streak = 0
  let d = new Date(today)
  while (checkinSet.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1) }

  const hasClass = !!studentInfo?.classId

  return (
    <div className="w-full max-w-2xl lg:max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">

      {/* 纯手机模式 + 了解本站 */}
      {(onOpenMobileLearn || onOpenAbout) && (
        <div className="flex gap-2 sm:gap-3">
          {onOpenMobileLearn && (
            <button onClick={onOpenMobileLearn}
              className="lg-home-panel w-1/4 min-w-0 flex flex-col items-center justify-center gap-1 px-2 py-3 sm:py-3.5 text-center hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-md">
                📱
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-[#1a1a1a] leading-tight">纯手机<br className="sm:hidden" />模式学习</div>
            </button>
          )}
          {onOpenAbout && (
            <button onClick={onOpenAbout}
              className={`lg-home-panel flex items-center gap-3 px-4 py-3 sm:py-3.5 text-left hover:scale-[1.01] transition-transform group ${onOpenMobileLearn ? 'w-3/4 min-w-0' : 'w-full'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl shrink-0 shadow-md">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-[#1a1a1a]">了解本站</div>
                <div className="text-xs text-[#7a7088] truncate">功能介绍 · 快速上手 · 隐私说明</div>
              </div>
              <span className="text-[#9575cd] text-xl shrink-0 group-hover:translate-x-1 transition-transform">›</span>
            </button>
          )}
        </div>
      )}

      {/* ① 连胜火焰条 */}
      <StreakRow checkinSet={checkinSet} streak={streak} streakMax={streakMax} today={today} xp={xp} />

      {/* ② 统计 + 班级排行（有班级时桌面双栏，否则统计独占） */}
      {hasClass ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2">
            <StatsCard progress={progress} sentences={sentences} daily={daily} today={today} />
          </div>
          <div>
            <ClassLeaderboardCard studentInfo={studentInfo} />
          </div>
        </div>
      ) : (
        <StatsCard progress={progress} sentences={sentences} daily={daily} today={today} />
      )}

      {/* ③ 成就徽章 */}
      <AchievementsCard xp={xp} isMember={isMember} isFounder={isFounder} />

    </div>
  )
}
