/** 商店卡通图标共用样式 — 2.5D 手游风 */
import { useId } from 'react'

export const OUTLINE = '#1a1208'
export const OUTLINE_W = 2

export function useSvgIds() {
  const raw = useId().replace(/:/g, '')
  return (name) => `${raw}-${name}`
}

export function CartoonSvg({ size = 48, className = '', children, viewBox = '0 0 64 64', defs }) {
  const gid = useSvgIds()
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={`shrink-0 drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)] ${className}`}
      aria-hidden
    >
      <defs>
        <filter id={gid('shadow')} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
        {defs?.(gid)}
      </defs>
      {typeof children === 'function' ? children(gid) : children}
    </svg>
  )
}

/** 径向渐变底光 */
export function PedestalGlow({ gid, cx = 32, cy = 48, rx = 22, color = '#fff' }) {
  const id = gid('pedestal')
  return (
    <>
      <radialGradient id={id} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.45" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.35} fill={`url(#${id})`} />
    </>
  )
}

export function Gloss({ cx, cy, rx, ry, opacity = 0.55 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity={opacity} />
}

export function Sparkle({ x, y, r = 2.5, color = '#fff' }) {
  return (
    <g fill={color}>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x} ${y - r * 2.2} v${r * 1.2} M${x} ${y + r} v${r * 1.2} M${x - r * 2} ${y} h${r * 1.2} M${x + r} ${y} h${r * 1.2}`}
        stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )
}

export function Blush({ y = 34, spread = 10 }) {
  return (
    <>
      <ellipse cx={32 - spread} cy={y} rx="4" ry="2.5" fill="#fb7185" opacity="0.55" />
      <ellipse cx={32 + spread} cy={y} rx="4" ry="2.5" fill="#fb7185" opacity="0.55" />
    </>
  )
}

export function Eyes({ lx = 26, rx = 38, y = 28, mood = 'happy' }) {
  const pupil = mood === 'wink' ? null : (
    <>
      <circle cx={lx + 1.2} cy={y + 1.2} r="2.2" fill={OUTLINE} />
      <circle cx={rx + 1.2} cy={y + 1.2} r="2.2" fill={OUTLINE} />
      <circle cx={lx + 2.2} cy={y} r="0.9" fill="#fff" />
      <circle cx={rx + 2.2} cy={y} r="0.9" fill="#fff" />
    </>
  )
  return (
    <>
      <ellipse cx={lx} cy={y} rx="5" ry="5.5" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" />
      <ellipse cx={rx} cy={y} rx="5" ry="5.5" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" />
      {mood === 'wink' ? (
        <path d={`M${rx - 3} ${y} Q${rx} ${y + 3} ${rx + 3} ${y}`} stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        pupil
      )}
    </>
  )
}

export function LinGrad({ gid, name, stops }) {
  const id = gid(name)
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
      {stops.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </linearGradient>
  )
}

export function RadGrad({ gid, name, stops, cx = '50%', cy = '30%', r = '70%' }) {
  const id = gid(name)
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      {stops.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </radialGradient>
  )
}
