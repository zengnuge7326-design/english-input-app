import { useEffect, useState, useCallback, useRef } from 'react'

const API = 'https://okenglish.site/api'
const CACHE_TTL_MS = 60_000

const _cache = { total: null, today: null }

function medalForRank(r) {
  if (r === 1) return '🥇'
  if (r === 2) return '🥈'
  if (r === 3) return '🥉'
  return null
}

export default function Leaderboard({ token, currentUsername, onClose }) {
  const [tab, setTab] = useState('total') // 'total' | 'today'
  const [data, setData] = useState({ total: null, today: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lastFetchRef = useRef({ total: 0, today: 0 })

  const load = useCallback(async (which, force = false) => {
    const now = Date.now()
    if (!force && _cache[which] && now - lastFetchRef.current[which] < CACHE_TTL_MS) {
      setData(d => ({ ...d, [which]: _cache[which] }))
      return
    }
    setLoading(true)
    setError('')
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const r = await fetch(`${API}/leaderboard/${which}?limit=50`, { headers })
      if (!r.ok) throw new Error('http_' + r.status)
      const j = await r.json()
      _cache[which] = j
      lastFetchRef.current[which] = now
      setData(d => ({ ...d, [which]: j }))
    } catch (e) {
      setError('加载失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load(tab) }, [tab, load])

  // Esc 关闭
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const current = data[tab]
  const list = current?.list || []
  const top3 = list.slice(0, 3)
  const rest = list.slice(3)

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="w-full sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h2 className="text-lg font-black text-white">经验值排行榜</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-lg flex items-center justify-center transition-colors"
            aria-label="关闭"
          >✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 mb-3 shrink-0">
          {[{ id: 'total', label: '总榜' }, { id: 'today', label: '今日榜' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors
                ${tab === t.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >{t.label}</button>
          ))}
        </div>

        {/* My rank pill */}
        {current?.myRank ? (
          <div className="mx-5 mb-3 shrink-0 rounded-xl bg-amber-500/15 border border-amber-500/40 px-4 py-2 flex items-center justify-between">
            <span className="text-amber-200 text-sm font-bold">我的名次</span>
            <span className="text-amber-100 text-sm font-bold tabular-nums">
              #{current.myRank} · {current.myXp} XP
            </span>
          </div>
        ) : token ? (
          <div className="mx-5 mb-3 shrink-0 rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-2 text-center text-xs text-slate-400">
            {tab === 'today' ? '今日还没拿到经验，去做几道题吧～' : '还未上榜，开始学习吧～'}
          </div>
        ) : (
          <div className="mx-5 mb-3 shrink-0 rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-2 text-center text-xs text-slate-400">
            登录后参与排名
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {loading && !current && (
            <div className="py-12 text-center text-slate-500 text-sm">加载中…</div>
          )}
          {error && (
            <div className="py-8 text-center text-red-400 text-sm">{error}</div>
          )}
          {!loading && !error && list.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              {tab === 'today' ? '今天还没有人上榜～' : '榜单还没数据～'}
            </div>
          )}

          {/* Top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {top3.map(row => (
                <div
                  key={row.userId}
                  className={`rounded-2xl border p-3 flex flex-col items-center text-center
                    ${row.rank === 1
                      ? 'bg-gradient-to-br from-amber-400/25 to-yellow-600/15 border-amber-400/60'
                      : row.rank === 2
                      ? 'bg-gradient-to-br from-slate-300/15 to-slate-500/10 border-slate-300/40'
                      : 'bg-gradient-to-br from-orange-700/20 to-amber-800/10 border-orange-700/50'}
                  `}
                >
                  <span className="text-2xl mb-1">{medalForRank(row.rank)}</span>
                  <span className="text-xs text-slate-300 truncate max-w-full">{row.username}</span>
                  <span className="text-base font-black text-white tabular-nums mt-1">{row.xp}</span>
                  <span className="text-[10px] text-slate-400">XP</span>
                </div>
              ))}
            </div>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <div className="space-y-1.5">
              {rest.map(row => {
                const isMe = currentUsername && row.username === currentUsername
                return (
                  <div
                    key={row.userId}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl
                      ${isMe ? 'bg-amber-500/15 border border-amber-500/40' : 'bg-slate-800/50'}
                    `}
                  >
                    <span className="w-7 text-center text-sm font-bold text-slate-400 tabular-nums">
                      {row.rank}
                    </span>
                    <span className={`flex-1 text-sm truncate ${isMe ? 'text-amber-200 font-bold' : 'text-slate-200'}`}>
                      {row.username}
                    </span>
                    {row.streak > 0 && (
                      <span className="text-xs text-orange-400 tabular-nums flex items-center gap-0.5">
                        🔥{row.streak}
                      </span>
                    )}
                    <span className="text-sm font-bold text-white tabular-nums">{row.xp}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
