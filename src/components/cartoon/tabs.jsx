import { CartoonSvg, OUTLINE, OUTLINE_W } from './shared'

export function TabRecharge({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="14" y="22" width="36" height="28" rx="6" fill="#f472b6" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="14" y="18" width="36" height="10" rx="4" fill="#ec4899" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M32 18 V10 M24 10 h16" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinecap="round" />
      <path d="M32 10 C28 4 36 4 32 10" fill="#fde047" stroke={OUTLINE} strokeWidth="1.8" />
      <ellipse cx="24" cy="36" rx="4" ry="5" fill="#fce7f3" opacity="0.9" />
      <ellipse cx="40" cy="36" rx="4" ry="5" fill="#fce7f3" opacity="0.9" />
    </CartoonSvg>
  )
}

export function TabItems({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="12" y="16" width="40" height="32" rx="8" fill="#38bdf8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="18" y="22" width="28" height="6" rx="3" fill="#e0f2fe" />
      <rect x="18" y="32" width="20" height="4" rx="2" fill="#bae6fd" />
      <circle cx="48" cy="20" r="6" fill="#fbbf24" stroke={OUTLINE} strokeWidth="1.6" />
      <path d="M48 17 v6 M45 20 h6" stroke={OUTLINE} strokeWidth="1.4" strokeLinecap="round" />
    </CartoonSvg>
  )
}

export function TabPets({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="22" cy="40" rx="9" ry="11" fill="#a78bfa" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="42" cy="40" rx="9" ry="11" fill="#c4b5fd" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="22" cy="28" r="10" fill="#8b5cf6" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="42" cy="28" r="10" fill="#a78bfa" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="19" cy="26" r="2.5" fill="#fff" />
      <circle cx="25" cy="26" r="2.5" fill="#fff" />
      <circle cx="39" cy="26" r="2.5" fill="#fff" />
      <circle cx="45" cy="26" r="2.5" fill="#fff" />
      <circle cx="19.5" cy="26.5" r="1.2" fill={OUTLINE} />
      <circle cx="25.5" cy="26.5" r="1.2" fill={OUTLINE} />
      <circle cx="39.5" cy="26.5" r="1.2" fill={OUTLINE} />
      <circle cx="45.5" cy="26.5" r="1.2" fill={OUTLINE} />
      <ellipse cx="32" cy="34" rx="5" ry="3" fill="#fde68a" stroke={OUTLINE} strokeWidth="1.2" />
    </CartoonSvg>
  )
}

export function TabMembership({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M18 44 L32 18 L46 44 Z" fill="#fbbf24" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
      <rect x="16" y="42" width="32" height="8" rx="3" fill="#f59e0b" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="30" r="5" fill="#ef4444" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="24" cy="38" r="3" fill="#60a5fa" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="40" cy="38" r="3" fill="#34d399" stroke={OUTLINE} strokeWidth="1.2" />
      <path d="M26 22 h12" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
    </CartoonSvg>
  )
}

export const TAB_ICONS = {
  recharge: TabRecharge,
  items: TabItems,
  pets: TabPets,
  membership: TabMembership,
}
