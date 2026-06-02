// 26 个儿童友好卡通 SVG 图标。每个组件接受 size 参数（默认 56px），viewBox 100x100。
// 风格统一：粗描边、圆角、亮色填充、2~3 色主调，孩子一眼能认出。

const W = (size, children, extra = {}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...extra}>
    {children}
  </svg>
)

// ── A · Apple 🍎 ─────────────────────────────────────────────
export const IconApple = ({ size = 56 }) => W(size, <>
  <path d="M30 38 C20 38 16 48 16 60 C16 76 28 88 40 88 C46 88 48 84 50 84 C52 84 54 88 60 88 C72 88 84 76 84 60 C84 48 80 38 70 38 C62 38 56 42 50 42 C44 42 38 38 30 38 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M50 42 C50 32 54 22 64 18" stroke="#854d0e" strokeWidth="4" strokeLinecap="round"/>
  <path d="M62 24 C70 18 80 22 84 30 C76 34 66 30 62 24 Z" fill="#22c55e" stroke="#166534" strokeWidth="2.5" strokeLinejoin="round"/>
  <ellipse cx="34" cy="54" rx="6" ry="4" fill="#fca5a5" opacity="0.7"/>
</>)

// ── B · Ball ⚽ ───────────────────────────────────────────────
export const IconBall = ({ size = 56 }) => W(size, <>
  <circle cx="50" cy="52" r="34" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3"/>
  <path d="M50 18 L60 36 L80 38 M50 86 L42 68 L22 64 M80 38 L70 56 L80 70 M22 64 L34 56 L20 40" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  <circle cx="50" cy="52" r="8" fill="#1e3a8a"/>
  <ellipse cx="38" cy="38" rx="8" ry="5" fill="#93c5fd" opacity="0.6"/>
</>)

// ── C · Cat 🐱 ───────────────────────────────────────────────
export const IconCat = ({ size = 56 }) => W(size, <>
  <path d="M20 36 L26 18 L40 32 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="2.5" strokeLinejoin="round"/>
  <path d="M80 36 L74 18 L60 32 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="2.5" strokeLinejoin="round"/>
  <ellipse cx="50" cy="56" rx="32" ry="28" fill="#fb923c" stroke="#7c2d12" strokeWidth="3"/>
  <circle cx="40" cy="52" r="4" fill="#1f2937"/>
  <circle cx="60" cy="52" r="4" fill="#1f2937"/>
  <circle cx="41" cy="50.5" r="1.5" fill="white"/>
  <circle cx="61" cy="50.5" r="1.5" fill="white"/>
  <path d="M46 64 L50 68 L54 64" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <path d="M50 62 L50 66" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M28 58 L20 56 M28 62 L18 64 M72 58 L80 56 M72 62 L82 64" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round"/>
</>)

// ── D · Dog 🐶 ───────────────────────────────────────────────
export const IconDog = ({ size = 56 }) => W(size, <>
  <ellipse cx="28" cy="40" rx="14" ry="20" fill="#a16207" stroke="#451a03" strokeWidth="2.5" transform="rotate(-15 28 40)"/>
  <ellipse cx="72" cy="40" rx="14" ry="20" fill="#a16207" stroke="#451a03" strokeWidth="2.5" transform="rotate(15 72 40)"/>
  <ellipse cx="50" cy="58" rx="30" ry="26" fill="#d97706" stroke="#451a03" strokeWidth="3"/>
  <circle cx="40" cy="54" r="4" fill="#1f2937"/>
  <circle cx="60" cy="54" r="4" fill="#1f2937"/>
  <circle cx="41" cy="52" r="1.5" fill="white"/>
  <circle cx="61" cy="52" r="1.5" fill="white"/>
  <ellipse cx="50" cy="66" rx="5" ry="4" fill="#1f2937"/>
  <path d="M44 72 Q50 78 56 72" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <path d="M48 74 L48 80" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round"/>
</>)

// ── E · Egg 🥚 ───────────────────────────────────────────────
export const IconEgg = ({ size = 56 }) => W(size, <>
  <path d="M50 14 C32 14 22 42 22 60 C22 76 34 88 50 88 C66 88 78 76 78 60 C78 42 68 14 50 14 Z" fill="#fef9c3" stroke="#854d0e" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M30 56 L36 48 L40 56 L46 46 L52 56 L58 48 L64 56 L70 48" stroke="#a16207" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  <ellipse cx="42" cy="34" rx="6" ry="10" fill="#fef3c7" opacity="0.8"/>
</>)

// ── F · Fish 🐟 ──────────────────────────────────────────────
export const IconFish = ({ size = 56 }) => W(size, <>
  <path d="M64 50 C64 32 50 24 32 24 C18 24 12 36 12 50 C12 64 18 76 32 76 C50 76 64 68 64 50 Z" fill="#06b6d4" stroke="#155e75" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M64 50 L88 30 L88 70 Z" fill="#0891b2" stroke="#155e75" strokeWidth="3" strokeLinejoin="round"/>
  <circle cx="28" cy="46" r="5" fill="white" stroke="#155e75" strokeWidth="2"/>
  <circle cx="28" cy="46" r="2.5" fill="#1f2937"/>
  <path d="M40 38 Q44 50 40 62" stroke="#155e75" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <path d="M50 32 Q54 50 50 68" stroke="#155e75" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <circle cx="18" cy="40" r="1.5" fill="#cffafe" opacity="0.8"/>
</>)

// ── G · Grape 🍇 ─────────────────────────────────────────────
export const IconGrape = ({ size = 56 }) => W(size, <>
  <path d="M40 14 L50 26 L60 14" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" fill="none"/>
  <path d="M50 18 C56 14 64 14 68 22" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none"/>
  <ellipse cx="64" cy="18" rx="8" ry="5" fill="#22c55e" stroke="#166534" strokeWidth="2" transform="rotate(20 64 18)"/>
  {/* grape cluster */}
  <circle cx="50" cy="32" r="9" fill="#a855f7" stroke="#581c87" strokeWidth="2"/>
  <circle cx="36" cy="42" r="9" fill="#9333ea" stroke="#581c87" strokeWidth="2"/>
  <circle cx="64" cy="42" r="9" fill="#9333ea" stroke="#581c87" strokeWidth="2"/>
  <circle cx="44" cy="56" r="9" fill="#a855f7" stroke="#581c87" strokeWidth="2"/>
  <circle cx="56" cy="56" r="9" fill="#a855f7" stroke="#581c87" strokeWidth="2"/>
  <circle cx="50" cy="70" r="9" fill="#9333ea" stroke="#581c87" strokeWidth="2"/>
  <circle cx="38" cy="68" r="7" fill="#a855f7" stroke="#581c87" strokeWidth="2"/>
  <circle cx="62" cy="68" r="7" fill="#a855f7" stroke="#581c87" strokeWidth="2"/>
  <circle cx="50" cy="82" r="6" fill="#9333ea" stroke="#581c87" strokeWidth="2"/>
  {/* highlights */}
  <ellipse cx="47" cy="29" rx="2.5" ry="1.5" fill="#e9d5ff" opacity="0.8"/>
  <ellipse cx="33" cy="39" rx="2.5" ry="1.5" fill="#e9d5ff" opacity="0.8"/>
  <ellipse cx="41" cy="53" rx="2.5" ry="1.5" fill="#e9d5ff" opacity="0.8"/>
</>)

// ── H · Hat 👒 ───────────────────────────────────────────────
export const IconHat = ({ size = 56 }) => W(size, <>
  <ellipse cx="50" cy="74" rx="40" ry="8" fill="#0d9488" stroke="#134e4a" strokeWidth="3"/>
  <path d="M22 70 Q22 30 50 26 Q78 30 78 70 Z" fill="#14b8a6" stroke="#134e4a" strokeWidth="3" strokeLinejoin="round"/>
  <ellipse cx="50" cy="64" rx="28" ry="6" fill="#0f766e" stroke="#134e4a" strokeWidth="2.5"/>
  <circle cx="42" cy="60" r="4" fill="#fde047" stroke="#a16207" strokeWidth="2"/>
  <path d="M38 56 L46 64 M46 56 L38 64" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round"/>
</>)

// ── I · Ice Cream 🍦 ─────────────────────────────────────────
export const IconIceCream = ({ size = 56 }) => W(size, <>
  <path d="M30 60 L50 92 L70 60 Z" fill="#fbbf24" stroke="#854d0e" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M36 60 L44 76 M50 60 L50 86 M64 60 L56 76 M40 68 L60 68" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" fill="none"/>
  <circle cx="50" cy="46" r="20" fill="#fce7f3" stroke="#9d174d" strokeWidth="3"/>
  <circle cx="50" cy="32" r="14" fill="#fbcfe8" stroke="#9d174d" strokeWidth="3"/>
  <circle cx="50" cy="22" r="10" fill="#f9a8d4" stroke="#9d174d" strokeWidth="3"/>
  <circle cx="50" cy="14" r="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5"/>
  <path d="M50 11 L50 6" stroke="#15803d" strokeWidth="2" strokeLinecap="round"/>
  <ellipse cx="45" cy="26" rx="3" ry="2" fill="white" opacity="0.7"/>
</>)

// ── J · Jam 🫙 ───────────────────────────────────────────────
export const IconJam = ({ size = 56 }) => W(size, <>
  <rect x="26" y="32" width="48" height="58" rx="6" fill="#fda4af" stroke="#9f1239" strokeWidth="3"/>
  <rect x="22" y="22" width="56" height="14" rx="4" fill="#be123c" stroke="#881337" strokeWidth="3"/>
  <rect x="30" y="40" width="40" height="20" rx="3" fill="#fef3c7" stroke="#9f1239" strokeWidth="2"/>
  <text x="50" y="55" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#9f1239" textAnchor="middle">JAM</text>
  <path d="M30 70 Q40 64 50 70 Q60 76 70 70" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2"/>
  <circle cx="38" cy="78" r="3" fill="#7f1d1d"/>
  <circle cx="58" cy="80" r="3" fill="#7f1d1d"/>
  <circle cx="48" cy="84" r="2.5" fill="#7f1d1d"/>
</>)

// ── K · Key 🔑 ───────────────────────────────────────────────
export const IconKey = ({ size = 56 }) => W(size, <>
  <circle cx="28" cy="50" r="20" fill="#fbbf24" stroke="#78350f" strokeWidth="3"/>
  <circle cx="28" cy="50" r="8" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5"/>
  <rect x="46" y="44" width="42" height="12" fill="#fbbf24" stroke="#78350f" strokeWidth="3"/>
  <rect x="72" y="56" width="6" height="10" fill="#fbbf24" stroke="#78350f" strokeWidth="2.5"/>
  <rect x="82" y="56" width="6" height="10" fill="#fbbf24" stroke="#78350f" strokeWidth="2.5"/>
  <ellipse cx="22" cy="42" rx="5" ry="3" fill="#fef9c3" opacity="0.8"/>
</>)

// ── L · Lion 🦁 ──────────────────────────────────────────────
export const IconLion = ({ size = 56 }) => W(size, <>
  {/* mane - jagged circle */}
  <path d="M50 8 L56 18 L66 14 L66 26 L78 24 L72 34 L84 38 L74 46 L86 52 L74 56 L82 66 L70 66 L74 78 L62 72 L60 84 L50 78 L40 84 L38 72 L26 78 L30 66 L18 66 L26 56 L14 52 L26 46 L16 38 L28 34 L22 24 L34 26 L34 14 L44 18 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round"/>
  {/* face */}
  <circle cx="50" cy="50" r="22" fill="#fbbf24" stroke="#78350f" strokeWidth="2.5"/>
  <circle cx="42" cy="46" r="3" fill="#1f2937"/>
  <circle cx="58" cy="46" r="3" fill="#1f2937"/>
  <circle cx="43" cy="45" r="1" fill="white"/>
  <circle cx="59" cy="45" r="1" fill="white"/>
  <path d="M46 56 L50 60 L54 56" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <ellipse cx="50" cy="55" rx="3" ry="2" fill="#7c2d12"/>
  <path d="M50 60 L50 64" stroke="#78350f" strokeWidth="2" strokeLinecap="round"/>
</>)

// ── M · Moon 🌙 ──────────────────────────────────────────────
export const IconMoon = ({ size = 56 }) => W(size, <>
  <path d="M70 16 C50 16 32 32 32 52 C32 72 50 88 70 88 C56 88 44 72 44 52 C44 32 56 16 70 16 Z" fill="#a5b4fc" stroke="#3730a3" strokeWidth="3" strokeLinejoin="round"/>
  <circle cx="50" cy="40" r="3" fill="#6366f1" opacity="0.5"/>
  <circle cx="58" cy="58" r="4" fill="#6366f1" opacity="0.5"/>
  <circle cx="48" cy="68" r="2.5" fill="#6366f1" opacity="0.5"/>
  {/* sleeping eyes & smile */}
  <path d="M52 44 Q55 47 58 44" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <path d="M48 56 Q52 60 56 56" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  {/* stars */}
  <path d="M14 20 L16 26 L22 28 L16 30 L14 36 L12 30 L6 28 L12 26 Z" fill="#fef08a" stroke="#a16207" strokeWidth="1"/>
  <circle cx="18" cy="60" r="2" fill="#fef08a"/>
  <circle cx="10" cy="78" r="2" fill="#fef08a"/>
</>)

// ── N · Nest 🪺 ──────────────────────────────────────────────
export const IconNest = ({ size = 56 }) => W(size, <>
  <path d="M14 60 Q20 80 50 84 Q80 80 86 60 Q86 70 80 72 Q78 64 70 66 Q68 58 60 62 Q58 56 50 60 Q42 56 40 62 Q32 58 30 66 Q22 64 20 72 Q14 70 14 60 Z" fill="#84cc16" stroke="#365314" strokeWidth="2.5" strokeLinejoin="round"/>
  <ellipse cx="38" cy="58" rx="9" ry="11" fill="white" stroke="#365314" strokeWidth="2.5"/>
  <ellipse cx="50" cy="56" rx="9" ry="11" fill="#fef3c7" stroke="#365314" strokeWidth="2.5"/>
  <ellipse cx="62" cy="58" rx="9" ry="11" fill="white" stroke="#365314" strokeWidth="2.5"/>
  <ellipse cx="35" cy="55" rx="3" ry="2" fill="#f3f4f6" opacity="0.9"/>
  <ellipse cx="59" cy="55" rx="3" ry="2" fill="#f3f4f6" opacity="0.9"/>
  <path d="M16 64 L24 60 M84 64 L76 60 M28 78 L34 74 M72 78 L66 74" stroke="#365314" strokeWidth="1.5" strokeLinecap="round"/>
</>)

// ── O · Orange 🍊 ────────────────────────────────────────────
export const IconOrange = ({ size = 56 }) => W(size, <>
  <circle cx="50" cy="54" r="34" fill="#f97316" stroke="#7c2d12" strokeWidth="3"/>
  <path d="M50 20 L50 88 M16 54 L84 54 M28 30 L72 78 M72 30 L28 78" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M50 20 L45 12 L55 12 Z" fill="#854d0e" stroke="#451a03" strokeWidth="2"/>
  <path d="M48 16 Q60 8 70 14 Q60 18 48 16 Z" fill="#22c55e" stroke="#166534" strokeWidth="2" strokeLinejoin="round"/>
  <ellipse cx="38" cy="40" rx="7" ry="5" fill="#fed7aa" opacity="0.7"/>
</>)

// ── P · Panda 🐼 ─────────────────────────────────────────────
export const IconPanda = ({ size = 56 }) => W(size, <>
  <ellipse cx="28" cy="32" rx="10" ry="11" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
  <ellipse cx="72" cy="32" rx="10" ry="11" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
  <circle cx="50" cy="54" r="30" fill="white" stroke="#1f2937" strokeWidth="3"/>
  <ellipse cx="38" cy="50" rx="7" ry="9" fill="#1f2937" transform="rotate(-15 38 50)"/>
  <ellipse cx="62" cy="50" rx="7" ry="9" fill="#1f2937" transform="rotate(15 62 50)"/>
  <circle cx="38" cy="50" r="2.5" fill="white"/>
  <circle cx="62" cy="50" r="2.5" fill="white"/>
  <circle cx="39" cy="49" r="1" fill="#1f2937"/>
  <circle cx="63" cy="49" r="1" fill="#1f2937"/>
  <ellipse cx="50" cy="62" rx="4" ry="3" fill="#1f2937"/>
  <path d="M46 68 Q50 72 54 68" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
</>)

// ── Q · Queen 👑 ─────────────────────────────────────────────
export const IconQueen = ({ size = 56 }) => W(size, <>
  <path d="M16 76 L20 36 L34 56 L50 26 L66 56 L80 36 L84 76 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="3" strokeLinejoin="round"/>
  <rect x="14" y="72" width="72" height="14" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="3"/>
  <circle cx="20" cy="36" r="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2"/>
  <circle cx="50" cy="26" r="6" fill="#ec4899" stroke="#831843" strokeWidth="2"/>
  <circle cx="80" cy="36" r="5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"/>
  <circle cx="32" cy="80" r="3" fill="#22c55e" stroke="#166534" strokeWidth="1.5"/>
  <circle cx="50" cy="80" r="3" fill="#a855f7" stroke="#581c87" strokeWidth="1.5"/>
  <circle cx="68" cy="80" r="3" fill="#06b6d4" stroke="#155e75" strokeWidth="1.5"/>
</>)

// ── R · Rabbit 🐰 ────────────────────────────────────────────
export const IconRabbit = ({ size = 56 }) => W(size, <>
  <ellipse cx="36" cy="22" rx="8" ry="18" fill="white" stroke="#1f2937" strokeWidth="2.5"/>
  <ellipse cx="64" cy="22" rx="8" ry="18" fill="white" stroke="#1f2937" strokeWidth="2.5"/>
  <ellipse cx="36" cy="22" rx="4" ry="12" fill="#fbcfe8"/>
  <ellipse cx="64" cy="22" rx="4" ry="12" fill="#fbcfe8"/>
  <circle cx="50" cy="56" r="28" fill="white" stroke="#1f2937" strokeWidth="3"/>
  <ellipse cx="40" cy="52" rx="3.5" ry="4.5" fill="#1f2937"/>
  <ellipse cx="60" cy="52" rx="3.5" ry="4.5" fill="#1f2937"/>
  <circle cx="41" cy="50.5" r="1.5" fill="white"/>
  <circle cx="61" cy="50.5" r="1.5" fill="white"/>
  <ellipse cx="50" cy="62" rx="3.5" ry="2.5" fill="#fb7185"/>
  <path d="M50 64 L50 70 M46 70 Q50 74 54 70" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <path d="M40 72 L46 72 M54 72 L60 72" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M40 72 L46 72 M54 72 L60 72" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round"/>
</>)

// ── S · Sun ☀️ ───────────────────────────────────────────────
export const IconSun = ({ size = 56 }) => W(size, <>
  {/* rays */}
  <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
    <line x1="50" y1="6" x2="50" y2="18"/>
    <line x1="50" y1="82" x2="50" y2="94"/>
    <line x1="6" y1="50" x2="18" y2="50"/>
    <line x1="82" y1="50" x2="94" y2="50"/>
    <line x1="18" y1="18" x2="26" y2="26"/>
    <line x1="74" y1="74" x2="82" y2="82"/>
    <line x1="82" y1="18" x2="74" y2="26"/>
    <line x1="26" y1="74" x2="18" y2="82"/>
  </g>
  <circle cx="50" cy="50" r="22" fill="#fbbf24" stroke="#92400e" strokeWidth="3"/>
  <circle cx="43" cy="46" r="2.5" fill="#1f2937"/>
  <circle cx="57" cy="46" r="2.5" fill="#1f2937"/>
  <path d="M42 56 Q50 64 58 56" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <circle cx="38" cy="53" r="2" fill="#fb923c" opacity="0.7"/>
  <circle cx="62" cy="53" r="2" fill="#fb923c" opacity="0.7"/>
</>)

// ── T · Tree 🌳 ──────────────────────────────────────────────
export const IconTree = ({ size = 56 }) => W(size, <>
  <rect x="42" y="60" width="16" height="30" rx="2" fill="#854d0e" stroke="#451a03" strokeWidth="3"/>
  <path d="M45 76 L40 76 M55 76 L62 76 M45 84 L42 84" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round"/>
  <circle cx="50" cy="36" r="22" fill="#22c55e" stroke="#14532d" strokeWidth="3"/>
  <circle cx="32" cy="46" r="16" fill="#16a34a" stroke="#14532d" strokeWidth="3"/>
  <circle cx="68" cy="46" r="16" fill="#16a34a" stroke="#14532d" strokeWidth="3"/>
  <circle cx="50" cy="20" r="10" fill="#4ade80" stroke="#14532d" strokeWidth="2.5"/>
  {/* apples on tree */}
  <circle cx="40" cy="40" r="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5"/>
  <circle cx="62" cy="44" r="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5"/>
  <circle cx="50" cy="50" r="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5"/>
</>)

// ── U · Umbrella ☂️ ──────────────────────────────────────────
export const IconUmbrella = ({ size = 56 }) => W(size, <>
  <path d="M10 50 Q10 22 50 22 Q90 22 90 50 Z" fill="#a855f7" stroke="#581c87" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M10 50 Q20 44 30 50 Q40 44 50 50 Q60 44 70 50 Q80 44 90 50" stroke="#581c87" strokeWidth="2.5" fill="none"/>
  <path d="M30 50 Q30 30 50 22 Q70 30 70 50" stroke="#581c87" strokeWidth="2.5" fill="none"/>
  <path d="M50 50 L50 80 Q50 88 58 88 Q66 88 66 80" stroke="#581c87" strokeWidth="4" strokeLinecap="round" fill="none"/>
  <circle cx="50" cy="20" r="3" fill="#581c87"/>
  <path d="M22 60 L18 70 M40 64 L36 74 M62 64 L66 74 M80 60 L84 70" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
</>)

// ── V · Van 🚐 ───────────────────────────────────────────────
export const IconVan = ({ size = 56 }) => W(size, <>
  <path d="M10 56 L10 70 L90 70 L90 50 L70 50 L62 36 L20 36 L10 50 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="3" strokeLinejoin="round"/>
  <rect x="22" y="40" width="18" height="10" rx="2" fill="#bae6fd" stroke="#7f1d1d" strokeWidth="2"/>
  <rect x="44" y="40" width="18" height="10" rx="2" fill="#bae6fd" stroke="#7f1d1d" strokeWidth="2"/>
  <circle cx="28" cy="74" r="8" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
  <circle cx="28" cy="74" r="3" fill="#9ca3af"/>
  <circle cx="72" cy="74" r="8" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
  <circle cx="72" cy="74" r="3" fill="#9ca3af"/>
  <rect x="84" y="58" width="4" height="4" fill="#fde047"/>
</>)

// ── W · Watermelon 🍉 ────────────────────────────────────────
export const IconWatermelon = ({ size = 56 }) => W(size, <>
  <path d="M14 78 Q50 96 86 78 L74 50 Q50 56 26 50 Z" fill="#22c55e" stroke="#14532d" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M22 70 Q50 84 78 70 L72 56 Q50 60 28 56 Z" fill="#fef3c7" stroke="#14532d" strokeWidth="2"/>
  <path d="M22 68 Q50 80 78 68 L74 60 Q50 64 26 60 Z" fill="#fb7185" stroke="#9f1239" strokeWidth="2.5"/>
  <ellipse cx="34" cy="68" rx="2" ry="3" fill="#1f2937" transform="rotate(-20 34 68)"/>
  <ellipse cx="46" cy="72" rx="2" ry="3" fill="#1f2937"/>
  <ellipse cx="58" cy="70" rx="2" ry="3" fill="#1f2937" transform="rotate(15 58 70)"/>
  <ellipse cx="68" cy="66" rx="2" ry="3" fill="#1f2937" transform="rotate(-10 68 66)"/>
  <path d="M14 78 L18 84 M30 86 L30 92 M50 90 L50 96 M70 86 L70 92 M86 78 L82 84" stroke="#14532d" strokeWidth="2" strokeLinecap="round"/>
</>)

// ── X · Xylophone 🎵 ─────────────────────────────────────────
export const IconXylophone = ({ size = 56 }) => W(size, <>
  <rect x="14" y="20" width="72" height="9" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2"/>
  <rect x="18" y="33" width="64" height="9" rx="2" fill="#f59e0b" stroke="#92400e" strokeWidth="2"/>
  <rect x="22" y="46" width="56" height="9" rx="2" fill="#facc15" stroke="#854d0e" strokeWidth="2"/>
  <rect x="26" y="59" width="48" height="9" rx="2" fill="#22c55e" stroke="#14532d" strokeWidth="2"/>
  <rect x="30" y="72" width="40" height="9" rx="2" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"/>
  <circle cx="16" cy="24" r="2" fill="#1f2937"/>
  <circle cx="84" cy="24" r="2" fill="#1f2937"/>
  {/* mallets */}
  <line x1="62" y1="6" x2="76" y2="20" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="60" cy="6" r="5" fill="#fef3c7" stroke="#92400e" strokeWidth="2"/>
  <line x1="82" y1="10" x2="94" y2="24" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="80" cy="10" r="5" fill="#fef3c7" stroke="#92400e" strokeWidth="2"/>
</>)

// ── Y · Yo-yo 🪀 ─────────────────────────────────────────────
export const IconYoyo = ({ size = 56 }) => W(size, <>
  <path d="M50 6 L50 56" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/>
  <circle cx="50" cy="62" r="28" fill="#fbbf24" stroke="#78350f" strokeWidth="3"/>
  <circle cx="50" cy="62" r="22" fill="#f59e0b" stroke="#78350f" strokeWidth="2"/>
  <circle cx="50" cy="62" r="14" fill="#fde68a" stroke="#78350f" strokeWidth="2"/>
  <circle cx="50" cy="62" r="6" fill="#fef3c7" stroke="#78350f" strokeWidth="2"/>
  <circle cx="50" cy="62" r="2" fill="#92400e"/>
  {/* swirl lines */}
  <path d="M50 48 Q58 56 50 64" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.6"/>
  <path d="M50 76 Q42 68 50 60" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.6"/>
  <ellipse cx="42" cy="52" rx="4" ry="3" fill="#fef9c3" opacity="0.7"/>
</>)

// ── Z · Zebra 🦓 ─────────────────────────────────────────────
export const IconZebra = ({ size = 56 }) => W(size, <>
  <ellipse cx="20" cy="22" rx="6" ry="9" fill="white" stroke="#1f2937" strokeWidth="2.5"/>
  <ellipse cx="80" cy="22" rx="6" ry="9" fill="white" stroke="#1f2937" strokeWidth="2.5"/>
  <ellipse cx="50" cy="56" rx="30" ry="28" fill="white" stroke="#1f2937" strokeWidth="3"/>
  {/* stripes */}
  <path d="M28 40 L36 36 M26 50 L36 48 M28 60 L36 60 M30 70 L36 72" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none"/>
  <path d="M72 40 L64 36 M74 50 L64 48 M72 60 L64 60 M70 70 L64 72" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none"/>
  <path d="M40 30 L50 26 M50 30 L60 26" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none"/>
  <circle cx="40" cy="52" r="3" fill="#1f2937"/>
  <circle cx="60" cy="52" r="3" fill="#1f2937"/>
  <ellipse cx="50" cy="66" rx="6" ry="4" fill="#fda4af" stroke="#1f2937" strokeWidth="2"/>
  <circle cx="46" cy="65" r="1" fill="#1f2937"/>
  <circle cx="54" cy="65" r="1" fill="#1f2937"/>
  {/* mane */}
  <path d="M50 26 L48 18 M52 26 L54 18 M50 22 L50 14" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
</>)

// ── 索引：通过 icon key 渲染 ──────────────────────────────────
const ICON_MAP = {
  apple: IconApple, ball: IconBall, cat: IconCat, dog: IconDog, egg: IconEgg,
  fish: IconFish, grape: IconGrape, hat: IconHat, icecream: IconIceCream, jam: IconJam,
  key: IconKey, lion: IconLion, moon: IconMoon, nest: IconNest, orange: IconOrange,
  panda: IconPanda, queen: IconQueen, rabbit: IconRabbit, sun: IconSun, tree: IconTree,
  umbrella: IconUmbrella, van: IconVan, watermelon: IconWatermelon, xylophone: IconXylophone,
  yoyo: IconYoyo, zebra: IconZebra,
}

export function AlphabetIcon({ name, size = 56 }) {
  const Comp = ICON_MAP[name]
  if (!Comp) return null
  return <Comp size={size} />
}
