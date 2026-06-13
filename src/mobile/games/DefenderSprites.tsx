/**
 * 字母飞船防御战 · 卡通 SVG 角色
 * UfoSprite — 外星飞碟（玻璃罩小外星人 + 跑马灯 + 牵引光束）
 * RocketSprite — 玩家火箭（喷焰动画）
 * ExplosionSprite — 爆炸（星型冲击波 + 碎片粒子）
 */

export function UfoSprite({ size = 96 }: { size?: number }) {
  return (
    <svg
      className="wdg-ufo-svg"
      width={size}
      height={size * 0.82}
      viewBox="0 0 120 98"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ufo-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bdf0ff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#5ad0f0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2aa3d8" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ufo-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8ecf8" />
          <stop offset="45%" stopColor="#aab4d4" />
          <stop offset="100%" stopColor="#5d6890" />
        </linearGradient>
        <linearGradient id="ufo-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d88b0" />
          <stop offset="100%" stopColor="#3c4566" />
        </linearGradient>
        <radialGradient id="ufo-beam" cx="0.5" cy="0" r="1">
          <stop offset="0%" stopColor="#9ef0a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9ef0a8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 牵引光束 */}
      <path className="wdg-ufo-beam" d="M44 58 L28 96 L92 96 L76 58 Z" fill="url(#ufo-beam)" />

      {/* 玻璃罩 */}
      <ellipse cx="60" cy="34" rx="26" ry="22" fill="url(#ufo-dome)" stroke="#d8f6ff" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* 小外星人 */}
      <g className="wdg-ufo-alien">
        <ellipse cx="60" cy="38" rx="11" ry="9.5" fill="#7ddc6e" />
        <ellipse cx="56" cy="37" rx="3.1" ry="3.8" fill="#0d2818" />
        <ellipse cx="64" cy="37" rx="3.1" ry="3.8" fill="#0d2818" />
        <circle cx="57" cy="36" r="1" fill="#fff" />
        <circle cx="65" cy="36" r="1" fill="#fff" />
        <path d="M57 43 Q60 45.5 63 43" stroke="#0d2818" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* 触角 */}
        <path d="M55 30 Q53 25 51 23" stroke="#7ddc6e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <circle cx="50.5" cy="22" r="2" fill="#aef59f" />
        <path d="M65 30 Q67 25 69 23" stroke="#7ddc6e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <circle cx="69.5" cy="22" r="2" fill="#aef59f" />
      </g>

      {/* 碟身 */}
      <ellipse cx="60" cy="52" rx="48" ry="15" fill="url(#ufo-body)" />
      <ellipse cx="60" cy="49" rx="48" ry="12" fill="#ffffff" opacity="0.18" />
      {/* 碟底 */}
      <ellipse cx="60" cy="58" rx="32" ry="9" fill="url(#ufo-belly)" />

      {/* 跑马灯 */}
      <circle className="wdg-ufo-light wdg-ufo-light--1" cx="22" cy="52" r="3.4" fill="#ffd84d" />
      <circle className="wdg-ufo-light wdg-ufo-light--2" cx="41" cy="56" r="3.4" fill="#ff7eb6" />
      <circle className="wdg-ufo-light wdg-ufo-light--3" cx="60" cy="58" r="3.4" fill="#7af0ff" />
      <circle className="wdg-ufo-light wdg-ufo-light--4" cx="79" cy="56" r="3.4" fill="#b18cff" />
      <circle className="wdg-ufo-light wdg-ufo-light--5" cx="98" cy="52" r="3.4" fill="#9ef0a8" />
    </svg>
  )
}

export function RocketSprite({ size = 72 }: { size?: number }) {
  return (
    <svg
      className="wdg-rocket-svg"
      width={size}
      height={size * 1.45}
      viewBox="0 0 72 104"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="rkt-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8ecf4" />
          <stop offset="100%" stopColor="#9fb0c8" />
        </linearGradient>
        <linearGradient id="rkt-nose" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff8a8a" />
          <stop offset="100%" stopColor="#e34b4b" />
        </linearGradient>
        <linearGradient id="rkt-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7ae" />
          <stop offset="45%" stopColor="#ffb84d" />
          <stop offset="100%" stopColor="#ff5e3a" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* 喷焰 */}
      <g className="wdg-rocket-flame">
        <path d="M28 80 Q36 104 44 80 Q40 86 36 86 Q32 86 28 80 Z" fill="url(#rkt-flame)" />
        <path d="M32 80 Q36 94 40 80 Z" fill="#fffceb" opacity="0.9" />
      </g>

      {/* 尾翼 */}
      <path d="M22 62 Q12 70 12 84 Q22 78 26 72 Z" fill="url(#rkt-nose)" />
      <path d="M50 62 Q60 70 60 84 Q50 78 46 72 Z" fill="url(#rkt-nose)" />

      {/* 箭身 */}
      <path d="M36 4 Q54 26 54 56 Q54 74 36 80 Q18 74 18 56 Q18 26 36 4 Z" fill="url(#rkt-body)" stroke="#7e8db0" strokeWidth="1.2" />
      {/* 鼻锥 */}
      <path d="M36 4 Q47 17 50 32 L22 32 Q25 17 36 4 Z" fill="url(#rkt-nose)" />

      {/* 舷窗 */}
      <circle cx="36" cy="46" r="10" fill="#27406b" stroke="#cfe2ff" strokeWidth="3" />
      <circle cx="33" cy="43" r="3.2" fill="#7fc4ff" opacity="0.85" />

      {/* 机身条纹 */}
      <rect x="20" y="66" width="32" height="4" rx="2" fill="#e34b4b" opacity="0.8" />
    </svg>
  )
}

export function ExplosionSprite({ size = 120 }: { size?: number }) {
  return (
    <svg
      className="wdg-boom-svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="boom-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="45%" stopColor="#ffd84d" />
          <stop offset="80%" stopColor="#ff7b2e" />
          <stop offset="100%" stopColor="#ff4d2e" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* 冲击环 */}
      <circle className="wdg-boom-ring" cx="60" cy="60" r="26" stroke="#ffd84d" strokeWidth="4" fill="none" />

      {/* 星型火球 */}
      <path
        className="wdg-boom-core"
        d="M60 14 L69 41 L96 32 L78 54 L104 64 L76 68 L84 96 L62 76 L44 100 L46 71 L18 74 L42 58 L24 32 L52 44 Z"
        fill="url(#boom-core)"
        stroke="#fff3c4"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 碎片粒子 */}
      <g className="wdg-boom-bits">
        <circle cx="60" cy="60" r="3.5" fill="#ffd84d" style={{ ['--bx' as string]: '-44px', ['--by' as string]: '-30px' }} />
        <circle cx="60" cy="60" r="2.6" fill="#ff7eb6" style={{ ['--bx' as string]: '46px', ['--by' as string]: '-24px' }} />
        <circle cx="60" cy="60" r="3" fill="#7af0ff" style={{ ['--bx' as string]: '-30px', ['--by' as string]: '40px' }} />
        <circle cx="60" cy="60" r="2.4" fill="#aef59f" style={{ ['--bx' as string]: '38px', ['--by' as string]: '36px' }} />
        <circle cx="60" cy="60" r="2" fill="#fff" style={{ ['--bx' as string]: '0px', ['--by' as string]: '-50px' }} />
        <circle cx="60" cy="60" r="2" fill="#ffb84d" style={{ ['--bx' as string]: '0px', ['--by' as string]: '48px' }} />
      </g>
    </svg>
  )
}
