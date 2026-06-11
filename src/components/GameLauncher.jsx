// 游戏中心：弹出菜单选择各种游戏
import { useEffect } from 'react'
import { useHistoryLayer } from '../hooks/useHistoryLayer'

const GAMES = [
  {
    id: 'whack',
    icon: '🐹',
    name: '打地鼠',
    desc: '字母键位反应训练',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'frog',
    icon: '🐸',
    name: '青蛙跳单词',
    desc: '池塘跳跃 · 单词拼写',
    color: 'from-emerald-400 to-emerald-600',
  },
  // 占位：更多游戏即将上线
  {
    id: 'soon-1',
    icon: '🎯',
    name: '更多游戏',
    desc: '敬请期待',
    color: 'from-slate-500 to-slate-700',
    locked: true,
  },
]

export default function GameLauncher({ onClose, onPickGame }) {
  useHistoryLayer(true, onClose)
  // ESC 关闭
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/15 rounded-3xl shadow-2xl w-full max-w-md p-5"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-2xl">🎮</span> 游戏中心
          </h2>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold">×</button>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {GAMES.map(g => (
            <button key={g.id}
              onClick={() => !g.locked && onPickGame?.(g.id)}
              disabled={g.locked}
              className={`group relative overflow-hidden text-left p-4 rounded-2xl border border-white/10 bg-gradient-to-br ${g.color}
                ${g.locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl transition-all'}`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl shrink-0">{g.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-extrabold text-white drop-shadow">{g.name}</div>
                  <div className="text-xs text-white/85">{g.desc}</div>
                </div>
                {!g.locked && (
                  <div className="text-white/70 text-xl shrink-0 group-hover:translate-x-1 transition-transform">▶</div>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/50 text-center mt-3">点 ESC 或外侧关闭</p>
      </div>
    </div>
  )
}
