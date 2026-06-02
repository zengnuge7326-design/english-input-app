/**
 * 五色立体钻石 SVG 组件
 * - 蓝/绿/红/紫/金五种变体
 * - 各色保留色相，呈现立体切割面感
 * - 可用于飘字、徽章、面板任何场景
 */
import { useId } from 'react'

export const GEM_PALETTE = {
  blue:   { light: '#dbeafe', mid: '#60a5fa', dark: '#1e40af', edge: '#1e3a8a', glow: 'rgba(96,165,250,0.85)' },
  green:  { light: '#d1fae5', mid: '#34d399', dark: '#047857', edge: '#065f46', glow: 'rgba(52,211,153,0.85)' },
  red:    { light: '#fee2e2', mid: '#fb7185', dark: '#be123c', edge: '#881337', glow: 'rgba(244,63,94,0.85)' },
  purple: { light: '#ede9fe', mid: '#a78bfa', dark: '#6d28d9', edge: '#4c1d95', glow: 'rgba(167,139,250,0.85)' },
  gold:   { light: '#fef9c3', mid: '#fbbf24', dark: '#b45309', edge: '#78350f', glow: 'rgba(251,191,36,0.85)' },
}

export default function GemSVG({ color = 'blue', size = 64, className = '', style }) {
  const c = GEM_PALETTE[color] || GEM_PALETTE.blue
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="100%" stopColor={c.mid} />
        </linearGradient>
        <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${uid}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* 顶部冠部 */}
      <polygon points="5,14 13,5 27,5 35,14" fill={`url(#${uid}-l)`} stroke={c.edge} strokeWidth="0.5" strokeLinejoin="round" />
      {/* 底部尖部 */}
      <polygon points="5,14 20,36 35,14" fill={`url(#${uid}-d)`} stroke={c.edge} strokeWidth="0.5" strokeLinejoin="round" />
      {/* 内部切割面（增加立体感） */}
      <polygon points="13,5 20,14 27,5" fill={`url(#${uid}-m)`} opacity="0.55" />
      <polygon points="13,14 20,36 27,14" fill={`url(#${uid}-m)`} opacity="0.4" />
      <polygon points="5,14 13,14 13,5" fill={c.dark} opacity="0.18" />
      <polygon points="35,14 27,14 27,5" fill={c.dark} opacity="0.25" />
      {/* 高光 */}
      <polygon points="15,7 17,7 18,12 16,12" fill="white" opacity="0.7" />
      <polygon points="22,7 24,7 23,11" fill="white" opacity="0.35" />
    </svg>
  )
}
