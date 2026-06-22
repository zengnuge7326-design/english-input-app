/**
 * 钻石飘字组件 — 奖励(+) / 惩罚(−) 双向
 * - recent      （{color, amount, ts}）→ 爆发式 +amount 钻石
 * - recentSpend （{color, amount, ts, penalty}）→ 下落式 −amount 钻石（扣除）
 * 颜色随机由上游决定，这里只负责动效。
 */
import { useEffect, useRef, useState } from 'react'
import GemSVG, { GEM_PALETTE } from './GemSVG'

export default function CrystalFloat({ recent, recentSpend, onPlaySound, onPlaySpendSound }) {
  const [floats, setFloats] = useState([])
  const lastTsRef = useRef(0)
  const lastSpendTsRef = useRef(0)

  // 奖励 +
  useEffect(() => {
    if (!recent || recent.ts === lastTsRef.current) return
    lastTsRef.current = recent.ts
    const id = recent.ts + Math.random()
    setFloats(f => [...f, { id, kind: 'earn', ...recent }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1400)
    onPlaySound?.()
  }, [recent, onPlaySound])

  // 惩罚 −
  useEffect(() => {
    if (!recentSpend || recentSpend.ts === lastSpendTsRef.current) return
    lastSpendTsRef.current = recentSpend.ts
    const id = recentSpend.ts + Math.random()
    setFloats(f => [...f, { id, kind: 'spend', ...recentSpend }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1400)
    onPlaySpendSound?.()
  }, [recentSpend, onPlaySpendSound])

  if (!floats.length) return null

  return (
    <div className="fixed left-1/2 top-1/3 -translate-x-1/2 pointer-events-none" style={{ zIndex: 9997 }}>
      {floats.map((f, i) => {
        const palette = GEM_PALETTE[f.color] || GEM_PALETTE.blue
        const isSpend = f.kind === 'spend'
        return (
          <div
            key={f.id}
            className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${isSpend ? 'gem-drop' : 'gem-burst'}`}
            style={{ '--gem-glow': palette.glow, marginTop: i * 6 }}
          >
            <GemSVG
              color={f.color}
              size={isSpend ? 72 : 96}
              style={{
                filter: `drop-shadow(0 0 14px ${palette.glow})`,
                opacity: isSpend ? 0.92 : 1,
              }}
            />
            <span
              className="mt-1 text-2xl font-black tabular-nums"
              style={{
                color: isSpend ? '#fca5a5' : palette.light,
                textShadow: isSpend
                  ? '0 0 8px rgba(239,68,68,0.6), 0 2px 4px rgba(0,0,0,0.5)'
                  : `0 0 8px ${palette.glow}, 0 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              {isSpend ? '−' : '+'}{f.amount}
            </span>
          </div>
        )
      })}
    </div>
  )
}
