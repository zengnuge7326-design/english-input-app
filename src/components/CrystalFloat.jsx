/**
 * 钻石飘字组件 — 钻石爆发版
 * - 接收 crystal.recent（{color, amount, reason, ts}）
 * - 每次变化弹出一颗 SVG 钻石，爆发式放大 + 光晕，无卡片背景
 */
import { useEffect, useRef, useState } from 'react'
import GemSVG, { GEM_PALETTE } from './GemSVG'

export default function CrystalFloat({ recent, onPlaySound }) {
  const [floats, setFloats] = useState([])
  const lastTsRef = useRef(0)

  useEffect(() => {
    if (!recent || recent.ts === lastTsRef.current) return
    lastTsRef.current = recent.ts
    const id = recent.ts + Math.random()
    setFloats(f => [...f, { id, ...recent }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1400)
    onPlaySound?.()
  }, [recent, onPlaySound])

  if (!floats.length) return null

  return (
    <div
      className="fixed left-1/2 top-1/3 -translate-x-1/2 pointer-events-none"
      style={{ zIndex: 9997 }}
    >
      {floats.map((f, i) => {
        const palette = GEM_PALETTE[f.color] || GEM_PALETTE.blue
        return (
          <div
            key={f.id}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 gem-burst flex flex-col items-center"
            style={{
              '--gem-glow': palette.glow,
              marginTop: i * 6,
            }}
          >
            <GemSVG
              color={f.color}
              size={96}
              style={{ filter: `drop-shadow(0 0 14px ${palette.glow})` }}
            />
            <span
              className="mt-1 text-2xl font-black tabular-nums"
              style={{
                color: palette.light,
                textShadow: `0 0 8px ${palette.glow}, 0 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              +{f.amount}
            </span>
          </div>
        )
      })}
    </div>
  )
}
