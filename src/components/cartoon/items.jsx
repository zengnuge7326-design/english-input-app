import { CartoonSvg, OUTLINE, OUTLINE_W } from './shared'

function Snowflake({ size }) {
  return (
    <CartoonSvg size={size}>
      <circle cx="32" cy="32" r="22" fill="#dbeafe" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
        <path d="M32 14 v36 M14 32 h36 M18 18 l28 28 M46 18 L18 46" />
      </g>
      <circle cx="32" cy="32" r="5" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
    </CartoonSvg>
  )
}

function Lightning({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M36 10 L22 34 h12 l-6 20 22-28 H38 z" fill="#fde047" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
      <path d="M30 18 L26 30" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    </CartoonSvg>
  )
}

function Bulb({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M24 38 C20 34 18 28 22 20 C26 12 38 12 42 20 C46 28 44 34 40 38" fill="#fef08a" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="26" y="38" width="12" height="10" rx="3" fill="#94a3b8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M28 44 h8 M28 47 h8" stroke={OUTLINE} strokeWidth="1.2" />
      <ellipse cx="32" cy="22" rx="8" ry="9" fill="#fff" opacity="0.35" />
    </CartoonSvg>
  )
}

function Target({ size }) {
  return (
    <CartoonSvg size={size}>
      <circle cx="32" cy="34" r="20" fill="#fecaca" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="34" r="12" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="32" cy="34" r="5" fill="#ef4444" stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M32 8 L36 20 L48 22 L38 30 L40 42 L32 36 L24 42 L26 30 L16 22 L28 20 Z" fill="#f97316" stroke={OUTLINE} strokeWidth="1.5" />
    </CartoonSvg>
  )
}

function Wand({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M12 48 L44 16" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />
      <path d="M12 48 L44 16" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinecap="round" />
      <path d="M44 12 L52 8 L48 16 Z" fill="#fde047" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="14" cy="50" r="4" fill="#f472b6" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="22" cy="42" r="2" fill="#60a5fa" />
      <circle cx="38" cy="22" r="2" fill="#34d399" />
    </CartoonSvg>
  )
}

function GiftPack({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="14" y="24" width="36" height="28" rx="5" fill="#f472b6" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="14" y="18" width="36" height="10" rx="3" fill="#ec4899" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M32 18 V46" stroke={OUTLINE} strokeWidth="2" />
      <path d="M14 28 h36" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="22" cy="14" r="5" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="42" cy="14" r="5" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
      <text x="26" y="40" fontSize="10" fill="#fff" fontWeight="bold">★</text>
    </CartoonSvg>
  )
}

function Ticket({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="10" y="20" width="44" height="24" rx="6" fill="#fbbf24" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="10" cy="32" r="6" fill="#1f2937" />
      <circle cx="54" cy="32" r="6" fill="#1f2937" />
      <text x="20" y="36" fontSize="11" fill={OUTLINE} fontWeight="bold">VIP</text>
    </CartoonSvg>
  )
}

function CrownBadge({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M14 42 L22 24 L32 34 L42 24 L50 42 Z" fill="#fbbf24" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
      <rect x="12" y="40" width="40" height="10" rx="4" fill="#f59e0b" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="28" r="4" fill="#ef4444" stroke={OUTLINE} strokeWidth="1.2" />
    </CartoonSvg>
  )
}

function CrownLarge({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M10 46 L18 20 L28 32 L32 14 L36 32 L46 20 L54 46 Z" fill="#fde047" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
      <rect x="8" y="44" width="48" height="12" rx="5" fill="#f59e0b" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="20" cy="36" r="3" fill="#3b82f6" />
      <circle cx="32" cy="30" r="4" fill="#ef4444" />
      <circle cx="44" cy="36" r="3" fill="#22c55e" />
    </CartoonSvg>
  )
}

function BoxFallback({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="16" y="20" width="32" height="28" rx="6" fill="#94a3b8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M16 26 h32" stroke={OUTLINE} strokeWidth="2" />
    </CartoonSvg>
  )
}

export const ITEM_ICONS = {
  freeze_card_1: Snowflake,
  freeze_card_5pack: Snowflake,
  double_xp_30m: Lightning,
  double_xp_week: Lightning,
  hint_card_5: Bulb,
  retry_voucher_3: Target,
  skip_card_1: Wand,
  scholar_pack: GiftPack,
  mem_trial_3d: Ticket,
  mem_month: CrownBadge,
  mem_year: CrownLarge,
}

export function ItemIcon({ id, size = 48 }) {
  const C = ITEM_ICONS[id] || BoxFallback
  return <C size={size} />
}
