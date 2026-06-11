// 成就徽章 SVG 图标库
// 每个徽章 64x64，统一圆形背景 + 渐变主图标
// 用 <BadgeIcon name="streak7" size={48} /> 调用

const G = ({ id, c1, c2 }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={c1} />
    <stop offset="100%" stopColor={c2} />
  </linearGradient>
)

const BG = ({ gid, ring }) => (
  <>
    <circle cx="32" cy="32" r="30" fill={`url(#${gid})`} />
    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
    {ring && <circle cx="32" cy="32" r="30" fill="none" stroke={ring} strokeWidth="2" strokeOpacity="0.55" />}
  </>
)

// 火焰路径（连击系列复用）
const Flame = ({ color = '#fff' }) => (
  <path d="M32 14 C36 22 42 24 42 34 C42 42 37 47 32 47 C27 47 22 42 22 34 C22 28 26 26 28 22 C29 24 30 26 32 22 Z"
    fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
)

const ICONS = {
  // ── 连击系列：火焰 + 数字（铜银金）──────────────────────────
  streak7: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-s7" c1="#fbbf24" c2="#f97316" /></defs>
      <BG gid="g-s7" />
      <Flame color="#fff7ed" />
      <text x="32" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7c2d12">7</text>
    </svg>
  ),
  streak30: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-s30" c1="#a78bfa" c2="#7c3aed" /></defs>
      <BG gid="g-s30" />
      <Flame color="#ede9fe" />
      <text x="32" y="41" textAnchor="middle" fontSize="11" fontWeight="900" fill="#4c1d95">30</text>
    </svg>
  ),
  streak100: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <G id="g-s100" c1="#fde047" c2="#f59e0b" />
        <G id="g-s100r" c1="#fbbf24" c2="#dc2626" />
      </defs>
      <BG gid="g-s100" ring="#92400e" />
      <Flame color="url(#g-s100r)" />
      <text x="32" y="41" textAnchor="middle" fontSize="10" fontWeight="900" fill="#7c2d12">100</text>
    </svg>
  ),

  // ── XP 累计：小芽 / 翻开书 / 海浪 ───────────────────────────
  xp100: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-xp1" c1="#86efac" c2="#16a34a" /></defs>
      <BG gid="g-xp1" />
      {/* 嫩芽 */}
      <ellipse cx="22" cy="34" rx="11" ry="5" fill="#15803d" transform="rotate(-30 22 34)" />
      <ellipse cx="42" cy="34" rx="11" ry="5" fill="#22c55e" transform="rotate(30 42 34)" />
      <line x1="32" y1="48" x2="32" y2="34" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 50 Q32 47 36 50" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  xp500: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-xp5" c1="#fde68a" c2="#f59e0b" /></defs>
      <BG gid="g-xp5" />
      {/* 翻开的书 */}
      <path d="M14 24 L32 22 L32 50 L14 48 Z" fill="#fffbeb" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M50 24 L32 22 L32 50 L50 48 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="20" y1="30" x2="29" y2="29" stroke="#a16207" strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="34" x2="29" y2="33" stroke="#a16207" strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="38" x2="29" y2="37" stroke="#a16207" strokeWidth="1" strokeLinecap="round" />
      <line x1="35" y1="29" x2="44" y2="30" stroke="#a16207" strokeWidth="1" strokeLinecap="round" />
      <line x1="35" y1="33" x2="44" y2="34" stroke="#a16207" strokeWidth="1" strokeLinecap="round" />
      {/* 书签 */}
      <path d="M40 22 L40 36 L43 33 L46 36 L46 22 Z" fill="#dc2626" />
    </svg>
  ),
  xp2000: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <G id="g-xp20" c1="#7dd3fc" c2="#0369a1" />
        <G id="g-wave" c1="#bae6fd" c2="#7dd3fc" />
      </defs>
      <BG gid="g-xp20" />
      {/* 浪 */}
      <path d="M10 42 Q18 36 26 42 T42 42 T58 42 L58 54 L10 54 Z" fill="url(#g-wave)" />
      <path d="M10 46 Q18 40 26 46 T42 46 T58 46 L58 54 L10 54 Z" fill="rgba(255,255,255,0.5)" />
      {/* 小船 */}
      <path d="M22 36 L42 36 L38 42 L26 42 Z" fill="#92400e" />
      <line x1="32" y1="36" x2="32" y2="22" stroke="#78350f" strokeWidth="2" />
      <path d="M32 24 L42 30 L32 30 Z" fill="#fff7ed" stroke="#78350f" strokeWidth="0.8" />
    </svg>
  ),

  // ── 活跃天数：日历点 / 满月 ────────────────────────────────
  days7: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-d7" c1="#fbcfe8" c2="#ec4899" /></defs>
      <BG gid="g-d7" />
      {/* 7 个圆点排环形 */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} cx={32 + Math.cos(a) * 16} cy={32 + Math.sin(a) * 16} r="3.5" fill="#fff" stroke="#831843" strokeWidth="1" />
      })}
      <circle cx="32" cy="32" r="5" fill="#fff" stroke="#831843" strokeWidth="1.5" />
      <text x="32" y="35" textAnchor="middle" fontSize="7" fontWeight="900" fill="#831843">7</text>
    </svg>
  ),
  days30: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs><G id="g-d30" c1="#c4b5fd" c2="#6366f1" /></defs>
      <BG gid="g-d30" />
      {/* 满月 */}
      <circle cx="32" cy="32" r="16" fill="#fef3c7" stroke="#a16207" strokeWidth="1.2" />
      <circle cx="26" cy="28" r="2" fill="#d6d3d1" opacity="0.6" />
      <circle cx="36" cy="34" r="3" fill="#d6d3d1" opacity="0.6" />
      <circle cx="29" cy="38" r="1.5" fill="#d6d3d1" opacity="0.6" />
      <text x="32" y="35" textAnchor="middle" fontSize="9" fontWeight="900" fill="#451a03">30</text>
    </svg>
  ),

  // ── 单日爆发：闪电 ────────────────────────────────────────
  perfectDay: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <G id="g-pd" c1="#fef08a" c2="#f59e0b" />
        <G id="g-bolt" c1="#fbbf24" c2="#ea580c" />
      </defs>
      <BG gid="g-pd" />
      <path d="M34 12 L18 36 L28 36 L26 52 L46 26 L34 26 L38 12 Z"
        fill="url(#g-bolt)" stroke="#78350f" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M32 14 L32 16 M40 18 L42 16 M22 32 L20 34" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),

  // ── 身份：钻石 / 王冠 ──────────────────────────────────────
  member: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <G id="g-mem" c1="#a5f3fc" c2="#0ea5e9" />
        <G id="g-gem" c1="#67e8f9" c2="#0284c7" />
      </defs>
      <BG gid="g-mem" />
      {/* 钻石 */}
      <path d="M22 28 L32 18 L42 28 L32 48 Z" fill="url(#g-gem)" stroke="#0c4a6e" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M22 28 L32 32 L42 28" fill="none" stroke="#0c4a6e" strokeWidth="0.9" />
      <path d="M32 32 L32 48 M27 28 L32 18 L37 28" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
      {/* 光点 */}
      <circle cx="26" cy="23" r="1.5" fill="#fff" opacity="0.85" />
    </svg>
  ),
  founder: ({ size }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <G id="g-fdr" c1="#fde047" c2="#a16207" />
        <G id="g-crn" c1="#fef08a" c2="#eab308" />
      </defs>
      <BG gid="g-fdr" ring="#7c2d12" />
      {/* 王冠 */}
      <path d="M16 40 L20 24 L28 32 L32 18 L36 32 L44 24 L48 40 Z"
        fill="url(#g-crn)" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="14" y="40" width="36" height="6" rx="1.5" fill="#facc15" stroke="#78350f" strokeWidth="1.2" />
      {/* 宝石 */}
      <circle cx="32" cy="43" r="2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.6" />
      <circle cx="22" cy="43" r="1.5" fill="#3b82f6" />
      <circle cx="42" cy="43" r="1.5" fill="#22c55e" />
    </svg>
  ),
}

export default function BadgeIcon({ name, size = 48, locked = false }) {
  const Icon = ICONS[name]
  if (!Icon) return null
  return (
    <div style={{
      filter: locked ? 'grayscale(1) brightness(0.85)' : undefined,
      opacity: locked ? 0.35 : 1,
      transition: 'all .3s ease',
      display: 'inline-flex',
    }}>
      <Icon size={size} />
    </div>
  )
}
