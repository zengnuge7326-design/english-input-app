/** 字母飞船防御战 · 卡通 SVG 精灵 */

export function CartoonUFO({ className = '', wobble = true }: { className?: string; wobble?: boolean }) {
  return (
    <svg
      className={`wdg-sprite wdg-sprite--ufo${wobble ? ' wdg-sprite--ufo-wobble' : ''} ${className}`}
      viewBox="0 0 120 72"
      width="120"
      height="72"
      aria-hidden
    >
      <defs>
        <linearGradient id="wdg-ufo-dome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="wdg-ufo-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <radialGradient id="wdg-ufo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.55)" />
          <stop offset="100%" stopColor="rgba(167,139,250,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="58" rx="46" ry="10" fill="url(#wdg-ufo-glow)" className="wdg-sprite__ufo-beam" />
      <ellipse cx="60" cy="38" rx="52" ry="16" fill="url(#wdg-ufo-body)" stroke="#ddd6fe" strokeWidth="2" />
      <ellipse cx="60" cy="28" rx="22" ry="18" fill="url(#wdg-ufo-dome)" stroke="#ede9fe" strokeWidth="2" />
      {/* 外星人 */}
      <ellipse cx="60" cy="26" rx="10" ry="12" fill="#86efac" />
      <ellipse cx="55" cy="24" rx="4" ry="5" fill="#fff" />
      <ellipse cx="65" cy="24" rx="4" ry="5" fill="#fff" />
      <circle cx="55" cy="25" r="2" fill="#1e1b4b" />
      <circle cx="65" cy="25" r="2" fill="#1e1b4b" />
      <path d="M56 30 Q60 33 64 30" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
      {/* 舷窗灯 */}
      {[28, 44, 60, 76, 92].map((x, i) => (
        <circle key={x} cx={x} cy="42" r="4" fill="#fef08a" className={`wdg-sprite__ufo-light wdg-sprite__ufo-light--${i}`} />
      ))}
    </svg>
  )
}

export function CartoonRocket({ className = '', firing = false }: { className?: string; firing?: boolean }) {
  return (
    <svg
      className={`wdg-sprite wdg-sprite--rocket${firing ? ' wdg-sprite--rocket-fire' : ''} ${className}`}
      viewBox="0 0 80 96"
      width="80"
      height="96"
      aria-hidden
    >
      <defs>
        <linearGradient id="wdg-rocket-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <g className="wdg-sprite__rocket-flame">
        <ellipse cx="40" cy="88" rx="14" ry="18" fill="#fbbf24" opacity="0.9" />
        <ellipse cx="40" cy="92" rx="8" ry="14" fill="#f97316" />
        <ellipse cx="40" cy="95" rx="4" ry="8" fill="#fef3c7" />
      </g>
      <path d="M40 8 L52 36 L48 72 L32 72 L28 36 Z" fill="url(#wdg-rocket-body)" stroke="#fecaca" strokeWidth="2" />
      <circle cx="40" cy="28" r="10" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="2" />
      <circle cx="40" cy="28" r="5" fill="#bae6fd" opacity="0.7" />
      <path d="M28 48 L14 62 L28 58 Z" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M52 48 L66 62 L52 58 Z" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="32" y="68" width="16" height="8" rx="2" fill="#475569" />
    </svg>
  )
}

export function CartoonHeart({ filled = true, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <svg
      className={`wdg-sprite wdg-sprite--heart${filled ? '' : ' wdg-sprite--heart-empty'} ${className}`}
      viewBox="0 0 32 28"
      width="28"
      height="24"
      aria-hidden
    >
      <path
        d="M16 24 C16 24 2 16 2 9 C2 5 5 3 8 3 C11 3 13 5 16 8 C19 5 21 3 24 3 C27 3 30 5 30 9 C30 16 16 24 16 24 Z"
        fill={filled ? '#f87171' : 'none'}
        stroke={filled ? '#fecaca' : '#64748b'}
        strokeWidth="2"
      />
      {filled && <ellipse cx="11" cy="10" rx="3" ry="2" fill="rgba(255,255,255,0.35)" />}
    </svg>
  )
}

export function CartoonExplosion({ className = '' }: { className?: string }) {
  return (
    <div className={`wdg-sprite wdg-sprite--explosion ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="18" fill="#fbbf24" className="wdg-sprite__boom-core" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <rect
            key={deg}
            x="47"
            y="8"
            width="6"
            height="22"
            rx="3"
            fill={i % 2 ? '#f97316' : '#fef08a'}
            transform={`rotate(${deg} 50 50)`}
            className="wdg-sprite__boom-ray"
            style={{ animationDelay: `${i * 0.02}s` }}
          />
        ))}
      </svg>
      {[
        { x: 0, y: -52 },
        { x: 37, y: -37 },
        { x: 52, y: 0 },
        { x: 37, y: 37 },
        { x: 0, y: 52 },
        { x: -37, y: 37 },
        { x: -52, y: 0 },
        { x: -37, y: -37 },
      ].map((p, i) => (
        <span
          key={i}
          className="wdg-sprite__boom-particle"
          style={{ ['--tx' as string]: `${p.x}px`, ['--ty' as string]: `${p.y}px` }}
        />
      ))}
    </div>
  )
}

export function CartoonComboBolt({ className = '' }: { className?: string }) {
  return (
    <svg className={`wdg-sprite wdg-sprite--bolt ${className}`} viewBox="0 0 24 28" width="18" height="22" aria-hidden>
      <path d="M13 0 L4 14 H11 L9 28 L20 12 H13 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
    </svg>
  )
}

export function IntroScene({ className = '' }: { className?: string }) {
  return (
    <div className={`wdg-intro-scene ${className}`} aria-hidden>
      <div className="wdg-intro-scene__stars" />
      <CartoonUFO className="wdg-intro-scene__ufo" wobble />
      <CartoonRocket className="wdg-intro-scene__rocket" />
    </div>
  )
}

export function TrophyScene({ className = '' }: { className?: string }) {
  return (
    <svg className={`wdg-sprite wdg-sprite--trophy ${className}`} viewBox="0 0 120 120" width="120" height="120" aria-hidden>
      <defs>
        <linearGradient id="wdg-trophy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <path d="M44 28 H76 V52 C76 68 68 78 60 78 C52 78 44 68 44 52 Z" fill="url(#wdg-trophy)" stroke="#fef3c7" strokeWidth="2" />
      <rect x="52" y="78" width="16" height="14" fill="#d97706" />
      <rect x="46" y="90" width="28" height="8" rx="2" fill="#b45309" />
      <path d="M44 32 H28 C28 48 34 56 44 56" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      <path d="M76 32 H92 C92 48 86 56 76 56" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      <polygon points="60,8 64,20 76,20 66,28 70,40 60,32 50,40 54,28 44,20 56,20" fill="#fef08a" className="wdg-sprite__trophy-star" />
    </svg>
  )
}

export function DefeatScene({ className = '' }: { className?: string }) {
  return (
    <svg className={`wdg-sprite wdg-sprite--defeat ${className}`} viewBox="0 0 120 120" width="120" height="120" aria-hidden>
      <circle cx="60" cy="60" r="44" fill="rgba(239,68,68,0.15)" stroke="#f87171" strokeWidth="3" strokeDasharray="8 6" />
      <path d="M38 38 L82 82 M82 38 L38 82" stroke="#f87171" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
