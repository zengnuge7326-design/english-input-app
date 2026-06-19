/** 青蛙跳 · Frog Jump — 卡通 SVG 精灵（配色对齐参考图：青蛙绿 / 荷叶绿 / 水蓝） */

/** 青蛙：front-view，可眨眼/吐舌/跳跃（squash-stretch 由 CSS class 控制） */
export function CartoonFrog({ className = '', tongue = false, jumping = false }: { className?: string; tongue?: boolean; jumping?: boolean }) {
  return (
    <svg
      className={`fjg-sprite fjg-sprite--frog${jumping ? ' fjg-sprite--frog-jump' : ''} ${className}`}
      viewBox="0 0 120 104"
      width="120"
      height="104"
      aria-hidden
    >
      <defs>
        <radialGradient id="fjg-frog-body" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="55%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#689f38" />
        </radialGradient>
        <linearGradient id="fjg-frog-belly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f8e9" />
          <stop offset="100%" stopColor="#dcedc8" />
        </linearGradient>
      </defs>

      {/* 后脚 */}
      <ellipse cx="26" cy="92" rx="16" ry="8" fill="#689f38" stroke="#33691e" strokeWidth="3" />
      <ellipse cx="94" cy="92" rx="16" ry="8" fill="#689f38" stroke="#33691e" strokeWidth="3" />

      {/* 身体 */}
      <path
        d="M60 26 C30 26 18 48 18 68 C18 88 36 98 60 98 C84 98 102 88 102 68 C102 48 90 26 60 26 Z"
        fill="url(#fjg-frog-body)"
        stroke="#33691e"
        strokeWidth="3.5"
      />
      {/* 肚皮 */}
      <ellipse cx="60" cy="76" rx="26" ry="20" fill="url(#fjg-frog-belly)" />

      {/* 前脚 */}
      <g stroke="#33691e" strokeWidth="3" fill="#7cb342">
        <ellipse cx="42" cy="96" rx="11" ry="6" />
        <ellipse cx="78" cy="96" rx="11" ry="6" />
      </g>

      {/* 眼睛凸起 */}
      <circle cx="42" cy="28" r="18" fill="url(#fjg-frog-body)" stroke="#33691e" strokeWidth="3.5" />
      <circle cx="78" cy="28" r="18" fill="url(#fjg-frog-body)" stroke="#33691e" strokeWidth="3.5" />
      {/* 眼白 + 瞳孔（眨眼用 CSS 缩放 .fjg-sprite__eye） */}
      <g className="fjg-sprite__eyes">
        <circle cx="42" cy="26" r="9" fill="#fff" />
        <circle cx="78" cy="26" r="9" fill="#fff" />
        <circle className="fjg-sprite__pupil" cx="44" cy="27" r="4.5" fill="#1b2417" />
        <circle className="fjg-sprite__pupil" cx="80" cy="27" r="4.5" fill="#1b2417" />
        <circle cx="45.5" cy="25" r="1.6" fill="#fff" />
        <circle cx="81.5" cy="25" r="1.6" fill="#fff" />
      </g>

      {/* 嘴 */}
      <path d="M44 64 Q60 76 76 64" fill="none" stroke="#33691e" strokeWidth="3" strokeLinecap="round" />
      {/* 腮红 */}
      <ellipse cx="33" cy="60" rx="5" ry="3.5" fill="#f48fb1" opacity="0.55" />
      <ellipse cx="87" cy="60" rx="5" ry="3.5" fill="#f48fb1" opacity="0.55" />

      {/* 吐舌 */}
      {tongue && (
        <g className="fjg-sprite__tongue">
          <rect x="55" y="64" width="10" height="30" rx="5" fill="#ef5da8" stroke="#c2185b" strokeWidth="2" />
          <circle cx="60" cy="92" r="6" fill="#f06fb6" stroke="#c2185b" strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}

/** 荷叶：top-down，带缺口；sink 0→100 由外层 translateY/waterline 控制 */
export function LilyPad({ className = '', glow = false }: { className?: string; glow?: boolean }) {
  return (
    <svg
      className={`fjg-sprite fjg-sprite--pad${glow ? ' fjg-sprite--pad-glow' : ''} ${className}`}
      viewBox="0 0 140 92"
      width="140"
      height="92"
      aria-hidden
    >
      <defs>
        <radialGradient id="fjg-pad-fill" cx="42%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="55%" stopColor="#7cb342" />
          <stop offset="100%" stopColor="#558b2f" />
        </radialGradient>
      </defs>
      {/* 叶身（缺口朝右下） */}
      <path
        d="M70 6 C108 6 134 28 134 50 C134 74 104 88 70 88 C40 88 22 78 14 60 L60 50 L18 36 C30 16 48 6 70 6 Z"
        fill="url(#fjg-pad-fill)"
        stroke="#33691e"
        strokeWidth="3"
      />
      {/* 叶脉 */}
      <g stroke="#558b2f" strokeWidth="2" opacity="0.55" fill="none" strokeLinecap="round">
        <path d="M70 48 L118 30" />
        <path d="M70 48 L122 56" />
        <path d="M70 48 L96 80" />
        <path d="M70 48 L60 14" />
      </g>
      {/* 高光 */}
      <ellipse cx="56" cy="28" rx="20" ry="10" fill="rgba(255,255,255,0.28)" />
    </svg>
  )
}

/** 入水水花 */
export function WaterSplash({ className = '' }: { className?: string }) {
  return (
    <div className={`fjg-sprite fjg-sprite--splash ${className}`} aria-hidden>
      <svg viewBox="0 0 100 70" width="100" height="70">
        <ellipse cx="50" cy="54" rx="34" ry="10" fill="rgba(255,255,255,0.5)" className="fjg-sprite__splash-ring" />
      </svg>
      {[
        { x: -42, y: -30 }, { x: -22, y: -46 }, { x: 0, y: -52 },
        { x: 22, y: -46 }, { x: 42, y: -30 }, { x: -12, y: -40 }, { x: 14, y: -42 },
      ].map((p, i) => (
        <span
          key={i}
          className="fjg-sprite__droplet"
          style={{ ['--tx' as string]: `${p.x}px`, ['--ty' as string]: `${p.y}px`, animationDelay: `${i * 0.02}s` }}
        />
      ))}
    </div>
  )
}

export function CartoonHeart({ filled = true, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <svg
      className={`fjg-sprite fjg-sprite--heart${filled ? '' : ' fjg-sprite--heart-empty'} ${className}`}
      viewBox="0 0 32 28"
      width="26"
      height="22"
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

/** 连击：蜻蜓 */
export function CartoonComboBolt({ className = '' }: { className?: string }) {
  return (
    <svg className={`fjg-sprite fjg-sprite--bolt ${className}`} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <ellipse cx="12" cy="13" rx="2" ry="6" fill="#10b981" />
      <ellipse cx="7" cy="9" rx="5" ry="2.4" fill="#67e8f9" opacity="0.85" transform="rotate(-18 7 9)" />
      <ellipse cx="17" cy="9" rx="5" ry="2.4" fill="#67e8f9" opacity="0.85" transform="rotate(18 17 9)" />
      <circle cx="12" cy="6" r="2.4" fill="#0d9488" />
    </svg>
  )
}

/** 终点：莲花 */
export function LotusGoal({ className = '' }: { className?: string }) {
  return (
    <svg className={`fjg-sprite fjg-sprite--lotus ${className}`} viewBox="0 0 80 60" width="64" height="48" aria-hidden>
      <ellipse cx="40" cy="50" rx="30" ry="7" fill="#7cb342" opacity="0.6" />
      {[-40, -20, 0, 20, 40].map((deg, i) => (
        <ellipse key={i} cx="40" cy="32" rx="8" ry="20" fill={i % 2 ? '#f8bbd0' : '#f48fb1'} stroke="#ec407a" strokeWidth="1.5" transform={`rotate(${deg} 40 36)`} />
      ))}
      <ellipse cx="40" cy="30" rx="8" ry="16" fill="#fce4ec" stroke="#ec407a" strokeWidth="1.5" />
      <circle cx="40" cy="28" r="5" fill="#fdd835" />
    </svg>
  )
}

export function IntroScene({ className = '' }: { className?: string }) {
  return (
    <div className={`fjg-intro-scene ${className}`} aria-hidden>
      <div className="fjg-intro-scene__ripple" />
      <LotusGoal className="fjg-intro-scene__lotus" />
      <LilyPad className="fjg-intro-scene__pad" glow />
      <CartoonFrog className="fjg-intro-scene__frog" />
    </div>
  )
}

export function TrophyScene({ className = '' }: { className?: string }) {
  return (
    <svg className={`fjg-sprite fjg-sprite--trophy ${className}`} viewBox="0 0 120 120" width="120" height="120" aria-hidden>
      <defs>
        <radialGradient id="fjg-trophy-pad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="100%" stopColor="#558b2f" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="104" rx="44" ry="9" fill="url(#fjg-trophy-pad)" stroke="#33691e" strokeWidth="2.5" />
      <g transform="translate(0,-6)">
        <LotusGoalInline />
      </g>
      <g className="fjg-sprite__trophy-frog">
        <CartoonFrogInline />
      </g>
    </svg>
  )
}

// 内联简版供 TrophyScene 组合（避免嵌套 svg）
function LotusGoalInline() {
  return (
    <g transform="translate(40,20) scale(0.5)">
      {[-40, -20, 0, 20, 40].map((deg, i) => (
        <ellipse key={i} cx="0" cy="0" rx="8" ry="20" fill={i % 2 ? '#f8bbd0' : '#f48fb1'} stroke="#ec407a" strokeWidth="2" transform={`rotate(${deg})`} />
      ))}
      <circle cx="0" cy="-4" r="6" fill="#fdd835" />
    </g>
  )
}
function CartoonFrogInline() {
  return (
    <g transform="translate(60,70) scale(0.55)">
      <path d="M0 -34 C-30 -34 -42 -12 -42 8 C-42 28 -24 38 0 38 C24 38 42 28 42 8 C42 -12 30 -34 0 -34 Z" fill="#8bc34a" stroke="#33691e" strokeWidth="4" />
      <circle cx="-18" cy="-32" r="16" fill="#8bc34a" stroke="#33691e" strokeWidth="4" />
      <circle cx="18" cy="-32" r="16" fill="#8bc34a" stroke="#33691e" strokeWidth="4" />
      <circle cx="-18" cy="-34" r="7" fill="#fff" /><circle cx="18" cy="-34" r="7" fill="#fff" />
      <circle cx="-16" cy="-33" r="3.5" fill="#1b2417" /><circle cx="20" cy="-33" r="3.5" fill="#1b2417" />
      <path d="M-16 4 Q0 16 16 4" fill="none" stroke="#33691e" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  )
}

export function DefeatScene({ className = '' }: { className?: string }) {
  return (
    <svg className={`fjg-sprite fjg-sprite--defeat ${className}`} viewBox="0 0 120 120" width="120" height="120" aria-hidden>
      <circle cx="60" cy="60" r="44" fill="rgba(37,150,190,0.18)" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 6" />
      {/* 沉入水中的青蛙 */}
      <g opacity="0.85">
        <path d="M60 54 C42 54 34 66 34 78 C34 90 46 96 60 96 C74 96 86 90 86 78 C86 66 78 54 60 54 Z" fill="#8bc34a" stroke="#33691e" strokeWidth="3" />
        <circle cx="48" cy="56" r="10" fill="#8bc34a" stroke="#33691e" strokeWidth="3" />
        <circle cx="72" cy="56" r="10" fill="#8bc34a" stroke="#33691e" strokeWidth="3" />
        <path d="M50 78 Q60 72 70 78" fill="none" stroke="#33691e" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M30 44 Q60 36 90 44" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
