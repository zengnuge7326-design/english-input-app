interface Props {
  index: number       // 0-based 序号
  className?: string
  size?: number
}

/**
 * 各册不同的卡通封面图标。
 * 每个序号 = 一种配色 + 一个独特图案（星/叶/心/爪/太阳/月亮/火箭/音符…）。
 */
const THEMES = [
  { c1: '#7dd3fc', c2: '#2563eb', emblem: 'star' },
  { c1: '#86efac', c2: '#16a34a', emblem: 'leaf' },
  { c1: '#fda4af', c2: '#e11d48', emblem: 'heart' },
  { c1: '#fcd34d', c2: '#d97706', emblem: 'sun' },
  { c1: '#c4b5fd', c2: '#7c3aed', emblem: 'moon' },
  { c1: '#5eead4', c2: '#0d9488', emblem: 'paw' },
  { c1: '#f9a8d4', c2: '#db2777', emblem: 'music' },
  { c1: '#fdba74', c2: '#ea580c', emblem: 'rocket' },
  { c1: '#a5b4fc', c2: '#4338ca', emblem: 'star' },
  { c1: '#67e8f9', c2: '#0891b2', emblem: 'leaf' },
  { c1: '#d8b4fe', c2: '#9333ea', emblem: 'heart' },
  { c1: '#bef264', c2: '#65a30d', emblem: 'sun' },
  { c1: '#fca5a5', c2: '#dc2626', emblem: 'rocket' },
  { c1: '#94a3b8', c2: '#475569', emblem: 'moon' },
] as const

function Emblem({ kind }: { kind: string }) {
  const p = { fill: 'rgba(255,255,255,0.92)', stroke: 'none' }
  switch (kind) {
    case 'star':
      return <path d="M24 14 L26.5 20 L33 20.5 L28 25 L29.5 31.5 L24 28 L18.5 31.5 L20 25 L15 20.5 L21.5 20 Z" {...p} />
    case 'leaf':
      return <path d="M16 32 C16 22 24 16 32 16 C32 26 24 32 16 32 Z M19 29 C23 25 27 22 30 20" fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" />
    case 'heart':
      return <path d="M24 32 C16 26 16 19 20.5 18 C23 17.4 24 20 24 20 C24 20 25 17.4 27.5 18 C32 19 32 26 24 32 Z" {...p} />
    case 'sun':
      return <g {...p}><circle cx="24" cy="24" r="5.5" /><g stroke="rgba(255,255,255,0.92)" strokeWidth="2" strokeLinecap="round"><path d="M24 13v3M24 32v3M13 24h3M32 24h3M16 16l2 2M30 30l2 2M32 16l-2 2M16 32l2-2" /></g></g>
    case 'moon':
      return <path d="M28 16 A8 8 0 1 0 28 32 A6.4 6.4 0 1 1 28 16 Z" {...p} />
    case 'paw':
      return <g {...p}><ellipse cx="24" cy="28" rx="6" ry="5" /><circle cx="17" cy="22" r="2.6" /><circle cx="21" cy="18.5" r="2.6" /><circle cx="27" cy="18.5" r="2.6" /><circle cx="31" cy="22" r="2.6" /></g>
    case 'music':
      return <g {...p}><circle cx="19" cy="30" r="3" /><circle cx="30" cy="27" r="3" /><path d="M22 30V17l11-2.5V27" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" /></g>
    case 'rocket':
      return <g {...p}><path d="M24 14 C28 18 28 26 24 30 C20 26 20 18 24 14 Z" /><circle cx="24" cy="21" r="2" fill="rgba(0,0,0,0.18)" /><path d="M20 27 L17 32 L21 30 Z M28 27 L31 32 L27 30 Z" /></g>
    default:
      return <circle cx="24" cy="24" r="6" {...p} />
  }
}

export default function GradeCoverIcon({ index, className = '', size }: Props) {
  const t = THEMES[index % THEMES.length]
  const id = `gc${index}`
  return (
    <svg
      viewBox="9 4 32 40"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-cover`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.c1} />
          <stop offset="100%" stopColor={t.c2} />
        </linearGradient>
      </defs>
      {/* 封面 */}
      <rect x="11" y="6" width="29" height="36" rx="4" fill={`url(#${id}-cover)`} />
      {/* 书脊高光 */}
      <path d="M11 10c0-2.2 1.8-4 4-4h2v36h-2c-2.2 0-4-1.8-4-4V10z" fill="rgba(255,255,255,0.25)" />
      {/* 图案 */}
      <Emblem kind={t.emblem} />
    </svg>
  )
}
