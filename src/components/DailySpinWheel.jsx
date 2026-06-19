/**
 * 每日免费转盘 — POST /api/shop/daily-spin
 */
import { useState, useCallback, useEffect } from 'react'
import GemSVG from './GemSVG'

const API = 'https://okenglish.site/api'

const SEGMENT_DEG = 360 / 7

/** 与 server-deploy/routes/dailySpin.js 奖池顺序一致，用于落点动画 */
const WHEEL_SEGMENTS = [
  { label: '5',  sub: '金钻', color: '#fde68a', match: p => p.type === 'diamond' && p.amount === 5 },
  { label: '10', sub: '金钻', color: '#fcd34d', match: p => p.type === 'diamond' && p.amount === 10 },
  { label: '20', sub: '金钻', color: '#fbbf24', match: p => p.type === 'diamond' && p.amount === 20 },
  { label: '30', sub: '金钻', color: '#f59e0b', match: p => p.type === 'diamond' && p.amount === 30 },
  { label: '❄️', sub: '冻结卡', color: '#a5b4fc', match: p => p.item_id === 'freeze_card_1' },
  { label: '💡', sub: '提示卡', color: '#86efac', match: p => p.item_id === 'hint_card_5' },
  { label: '50', sub: '金钻', color: '#fb923c', match: p => p.type === 'diamond' && p.amount === 50 },
]

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function storageKey() {
  return `daily_spin_done_${todayKey()}`
}

function findSegmentIndex(prize) {
  const i = WHEEL_SEGMENTS.findIndex(s => s.match(prize))
  return i >= 0 ? i : 0
}

function prizeLabel(prize) {
  if (!prize) return ''
  if (prize.type === 'diamond') return `+${prize.amount} 金钻`
  if (prize.item_id === 'freeze_card_1') return '❄️ 冻结卡 ×1'
  if (prize.item_id === 'hint_card_5') return '💡 提示卡 ×5'
  return '神秘奖品'
}

function formatNextSpin(iso) {
  if (!iso) return '明天 0 点'
  try {
    const d = new Date(iso)
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:00`
  } catch {
    return '明天'
  }
}

const CONIC_BG = `conic-gradient(${WHEEL_SEGMENTS.map((s, i) => {
  const a0 = i * SEGMENT_DEG
  const a1 = (i + 1) * SEGMENT_DEG
  return `${s.color} ${a0}deg ${a1}deg`
}).join(', ')})`

const HISTORY_KEY = 'daily_spin_history'

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
  } catch { return {} }
}

function saveHistory(date, prize) {
  const h = loadHistory()
  h[date] = prize
  // keep only last 30 days
  const sorted = Object.keys(h).sort().slice(-30)
  const trimmed = {}
  sorted.forEach(k => { trimmed[k] = h[k] })
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed)) } catch { /* ignore */ }
}

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function DailySpinWheel({ token, onShowLogin, onPrizeWon }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [doneToday, setDoneToday] = useState(() => {
    try { return localStorage.getItem(storageKey()) === '1' } catch { return false }
  })
  const [nextSpinAt, setNextSpinAt] = useState(null)
  const [showPrize, setShowPrize] = useState(null)
  const [error, setError] = useState('')
  const [spinHistory, setSpinHistory] = useState(() => loadHistory())

  const spinToPrize = useCallback((prize) => {
    const idx = findSegmentIndex(prize)
    const segmentCenter = idx * SEGMENT_DEG + SEGMENT_DEG / 2
    setRotation(prev => prev + 360 * 5 + (360 - segmentCenter))
  }, [])

  const handleSpin = useCallback(async () => {
    if (!token) {
      onShowLogin?.()
      return
    }
    if (doneToday || spinning) return

    setSpinning(true)
    setError('')
    try {
      const res = await fetch(`${API}/shop/daily-spin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.error === 'ALREADY_SPUN_TODAY' || (data.ok === false && data.error === 'ALREADY_SPUN_TODAY')) {
        setDoneToday(true)
        setNextSpinAt(data.next_spin_at || null)
        try { localStorage.setItem(storageKey(), '1') } catch { /* ignore */ }
        setSpinning(false)
        return
      }

      if (!data.ok && data.error) {
        setError(data.message || data.error)
        setSpinning(false)
        return
      }

      const prize = data.prize
      spinToPrize(prize)

      setTimeout(() => {
        setSpinning(false)
        setDoneToday(true)
        setNextSpinAt(data.next_spin_at || null)
        try { localStorage.setItem(storageKey(), '1') } catch { /* ignore */ }
        setShowPrize(prize)
        onPrizeWon?.(prize)
        saveHistory(todayKey(), prize)
        setSpinHistory(loadHistory())
      }, 4200)
    } catch {
      setError('网络错误，请重试')
      setSpinning(false)
    }
  }, [token, doneToday, spinning, onShowLogin, onPrizeWon, spinToPrize])

  return (
    <div className="mb-5 rounded-2xl border border-indigo-700/40 bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-gray-900/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white">🎡 每日免费转盘</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">每天 1 次，100% 中奖</p>
        </div>
        {!doneToday && token && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/80 text-white font-semibold">可抽奖</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative shrink-0">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 text-lg drop-shadow-lg">▼</div>
          <div
            className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full border-4 border-amber-500/60 shadow-[0_0_32px_rgba(251,191,36,0.25)] transition-transform ease-out"
            style={{
              background: CONIC_BG,
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? '4s' : '0.3s',
            }}
          >
            {WHEEL_SEGMENTS.map((seg, i) => {
              const mid = i * SEGMENT_DEG + SEGMENT_DEG / 2
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none"
                  style={{ transform: `rotate(${mid}deg) translateY(-4.5rem)` }}
                >
                  <div className="flex flex-col items-center text-center w-12 -translate-x-1/2">
                    <span className="text-sm font-black text-gray-900 drop-shadow-sm leading-none">{seg.label}</span>
                    <span className="text-[9px] font-semibold text-gray-800/90">{seg.sub}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || doneToday || !token}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-gray-900 border-4 border-amber-400 text-amber-300 font-bold text-sm shadow-xl hover:bg-gray-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {spinning ? '…' : doneToday ? '✓' : '转'}
          </button>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="text-center sm:text-left">
            {doneToday ? (
              <p className="text-sm text-gray-400">
                今日已抽奖，下次可转：<span className="text-indigo-300">{formatNextSpin(nextSpinAt)}</span>
              </p>
            ) : !token ? (
              <p className="text-sm text-gray-400">登录后即可免费转一次</p>
            ) : (
              <p className="text-sm text-gray-300">点击中央按钮抽奖，金钻与道具直接到账</p>
            )}
            {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
            {!token && (
              <button
                type="button"
                onClick={onShowLogin}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
              >
                登录抽奖
              </button>
            )}
          </div>

          {/* 7天签到历史 */}
          <div className="rounded-xl bg-black/30 border border-white/5 p-2.5">
            <p className="text-[10px] text-gray-500 mb-2 font-semibold tracking-wide uppercase">近7天记录</p>
            <div className="flex gap-1.5 flex-wrap">
              {getLast7Days().map(date => {
                const prize = spinHistory[date]
                const isToday = date === todayKey()
                const weekday = ['日','一','二','三','四','五','六'][new Date(date + 'T12:00:00').getDay()]
                return (
                  <div key={date}
                    className={`flex flex-col items-center gap-0.5 flex-1 min-w-[32px] py-1.5 px-0.5 rounded-lg
                      ${isToday ? 'bg-indigo-700/40 ring-1 ring-indigo-500/50' : 'bg-white/5'}`}>
                    <span className="text-[9px] text-gray-500">周{weekday}</span>
                    {prize ? (
                      <>
                        {prize.type === 'diamond'
                          ? <GemSVG color="gold" size={16} />
                          : <span className="text-sm leading-none">{prize.item_id === 'freeze_card_1' ? '❄️' : '💡'}</span>
                        }
                        {prize.type === 'diamond' && (
                          <span className="text-[9px] text-amber-300 font-bold leading-none">+{prize.amount}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-700 text-base leading-none">·</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showPrize && (
        <div className="fixed inset-0 z-[220] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowPrize(null)}>
          <div
            className="bg-gray-900 border border-amber-500/50 rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl animate-[fadeIn_.3s_ease]"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">恭喜获得</h3>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-300 mb-4">
              {showPrize.type === 'diamond' && <GemSVG color="gold" size={32} />}
              {prizeLabel(showPrize)}
            </div>
            <button
              type="button"
              onClick={() => setShowPrize(null)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
            >
              太棒了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
