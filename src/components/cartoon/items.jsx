import {
  CartoonSvg, OUTLINE, OUTLINE_W, PedestalGlow, Gloss, Sparkle,
  LinGrad, RadGrad,
} from './shared'

function FreezeCard({ size, pack }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <>
          <LinGrad gid={gid} name="ice" stops={[['0%', '#e0f2fe'], ['45%', '#7dd3fc'], ['100%', '#0284c7']]} />
          <LinGrad gid={gid} name="card" stops={[['0%', '#f0f9ff'], ['100%', '#bae6fd']]} />
          <RadGrad gid={gid} name="crystal" stops={[['0%', '#fff'], ['40%', '#a5f3fc'], ['100%', '#06b6d4']]} />
        </>
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#38bdf8" />
          {pack && (
            <>
              <rect x="18" y="22" width="28" height="34" rx="5" fill={`url(#${gid('card')})`} stroke={OUTLINE} strokeWidth="1.5" opacity="0.7" transform="rotate(-8 32 39)" />
              <rect x="16" y="20" width="28" height="34" rx="5" fill={`url(#${gid('card')})`} stroke={OUTLINE} strokeWidth="1.5" opacity="0.85" transform="rotate(4 30 37)" />
            </>
          )}
          <rect x="14" y="16" width="36" height="44" rx="7" fill={`url(#${gid('card')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="18" y="20" width="28" height="36" rx="5" fill={`url(#${gid('ice')})`} opacity="0.35" />
          <path d="M32 24 L36 30 L32 46 L28 30 Z" fill={`url(#${gid('crystal')})`} stroke={OUTLINE} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M32 26 L34 30 L32 40 L30 30 Z" fill="#fff" opacity="0.5" />
          <g stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
            <path d="M20 28 L24 32 M44 28 L40 32 M18 40 L22 44 M46 40 L42 44" />
          </g>
          <Gloss cx="22" cy="22" rx="6" ry="4" opacity="0.4" />
          {pack && (
            <g>
              <circle cx="46" cy="18" r="10" fill="#0ea5e9" stroke={OUTLINE} strokeWidth="1.8" />
              <text x="46" y="22" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">×5</text>
            </g>
          )}
          <Sparkle x="48" y="14" r="2" color="#e0f2fe" />
        </g>
      )}
    </CartoonSvg>
  )
}

function XpPotion({ size, weekly }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <>
          <LinGrad gid={gid} name="glass" stops={[['0%', '#fef9c3'], ['30%', '#fde047'], ['100%', '#ca8a04']]} />
          <LinGrad gid={gid} name="liquid" stops={[['0%', '#fef08a'], ['50%', '#facc15'], ['100%', '#eab308']]} />
          <RadGrad gid={gid} name="glow" stops={[['0%', '#fff'], ['100%', '#fbbf24']]} cx="50%" cy="50%" r="50%" />
        </>
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#fbbf24" />
          <ellipse cx="32" cy="52" rx="14" ry="4" fill="#000" opacity="0.15" />
          <path d="M24 22 C24 14 40 14 40 22 L42 38 C42 46 22 46 22 38 Z" fill={`url(#${gid('glass')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M26 28 C26 24 38 24 38 28 L39 36 C39 40 25 40 25 36 Z" fill={`url(#${gid('liquid')})`} />
          <Gloss cx="28" cy="26" rx="4" ry="8" opacity="0.45" />
          <rect x="26" y="16" width="12" height="8" rx="3" fill="#a16207" stroke={OUTLINE} strokeWidth="1.5" />
          <rect x="28" y="12" width="8" height="6" rx="2" fill="#ca8a04" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M30 32 L34 26 L38 34 L32 38 Z" fill={`url(#${gid('glow')})`} opacity="0.9" />
          <Sparkle x="40" y="20" r="2" />
          {weekly && (
            <g>
              <rect x="10" y="44" width="44" height="12" rx="6" fill="#7c3aed" stroke={OUTLINE} strokeWidth="1.5" />
              <text x="32" y="53" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">7 DAYS</text>
            </g>
          )}
        </g>
      )}
    </CartoonSvg>
  )
}

function HintScroll({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <>
          <LinGrad gid={gid} name="paper" stops={[['0%', '#fffbeb'], ['100%', '#fde68a']]} />
          <LinGrad gid={gid} name="rod" stops={[['0%', '#fcd34d'], ['100%', '#b45309']]} />
        </>
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#fbbf24" />
          <ellipse cx="18" cy="30" rx="6" ry="8" fill={`url(#${gid('rod')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <ellipse cx="46" cy="30" rx="6" ry="8" fill={`url(#${gid('rod')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <rect x="16" y="18" width="32" height="24" rx="3" fill={`url(#${gid('paper')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M22 24 h20 M22 29 h16 M22 34 h12" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <circle cx="38" cy="22" r="10" fill="#fef08a" stroke={OUTLINE} strokeWidth="1.5" opacity="0.95" />
          <path d="M38 16 L40 22 L46 22 L41 26 L43 32 L38 28 L33 32 L35 26 L30 22 L36 22 Z" fill="#f59e0b" stroke={OUTLINE} strokeWidth="1.2" />
          <Gloss cx="24" cy="22" rx="5" ry="3" opacity="0.35" />
          <Sparkle x="48" y="16" r="2" color="#fde047" />
        </g>
      )}
    </CartoonSvg>
  )
}

function RetryTicket({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <LinGrad gid={gid} name="ticket" stops={[['0%', '#fecaca'], ['50%', '#f87171'], ['100%', '#dc2626']]} />
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#f87171" />
          <rect x="8" y="22" width="48" height="26" rx="6" fill={`url(#${gid('ticket')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="8" cy="35" r="7" fill="#111827" />
          <circle cx="56" cy="35" r="7" fill="#111827" />
          <path d="M22 30 C26 26 30 26 32 30 C34 34 38 34 42 30" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M40 30 L44 26 M40 30 L44 34" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="38" r="6" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M28 35 L28 38 L31 40" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <text x="46" y="40" fontSize="8" fill="#fff" fontWeight="bold">×3</text>
          <Gloss cx="18" cy="26" rx="8" ry="3" opacity="0.3" />
        </g>
      )}
    </CartoonSvg>
  )
}

function SkipWand({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <>
          <LinGrad gid={gid} name="feather" stops={[['0%', '#e9d5ff'], ['100%', '#a855f7']]} />
          <RadGrad gid={gid} name="portal" stops={[['0%', '#c4b5fd'], ['60%', '#7c3aed'], ['100%', '#4c1d95']]} />
        </>
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#a855f7" />
          <circle cx="44" cy="20" r="12" fill="none" stroke={`url(#${gid('portal')})`} strokeWidth="3" opacity="0.85" />
          <circle cx="44" cy="20" r="7" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.6" />
          <path d="M10 50 L48 18" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 50 L48 18" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinecap="round" />
          <path d="M44 10 L54 6 L50 16 L58 14 L48 22 L52 12 L44 16 Z" fill={`url(#${gid('feather')})`} stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round" />
          <Gloss cx="48" cy="12" rx="3" ry="5" opacity="0.4" />
          <Sparkle x="14" cy="46" r="2" color="#e9d5ff" />
          <Sparkle x="36" cy="24" r="1.5" color="#ddd6fe" />
        </g>
      )}
    </CartoonSvg>
  )
}

function ScholarPack({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <>
          <LinGrad gid={gid} name="box" stops={[['0%', '#fbcfe8'], ['100%', '#ec4899']]} />
          <LinGrad gid={gid} name="lid" stops={[['0%', '#f9a8d4'], ['100%', '#db2777']]} />
        </>
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#f472b6" />
          <rect x="12" y="28" width="40" height="26" rx="6" fill={`url(#${gid('box')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="12" y="20" width="40" height="12" rx="4" fill={`url(#${gid('lid')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M32 20 V46" stroke={OUTLINE} strokeWidth="2" />
          <path d="M12 34 h40" stroke={OUTLINE} strokeWidth="2" />
          <path d="M20 14 L28 20 L36 14 L44 20" fill="none" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
          <rect x="22" y="8" width="20" height="10" rx="2" fill="#1e293b" stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M24 14 h16" stroke="#fde047" strokeWidth="2" />
          <circle cx="20" cy="16" r="5" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="44" cy="16" r="5" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
          <Gloss cx="20" cy="24" rx="6" ry="3" opacity="0.35" />
          <Sparkle x="50" y="12" r="2" />
        </g>
      )}
    </CartoonSvg>
  )
}

function VipTicket({ size, days }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <LinGrad gid={gid} name="gold" stops={[['0%', '#fef3c7'], ['50%', '#fbbf24'], ['100%', '#d97706']]} />
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#fbbf24" />
          <rect x="8" y="20" width="48" height="28" rx="7" fill={`url(#${gid('gold')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="8" cy="34" r="8" fill="#111827" />
          <circle cx="56" cy="34" r="8" fill="#111827" />
          <text x="32" y="36" textAnchor="middle" fontSize="11" fill={OUTLINE} fontWeight="bold">VIP</text>
          <text x="32" y="44" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">{days}</text>
          <Gloss cx="18" cy="24" rx="10" ry="4" opacity="0.35" />
        </g>
      )}
    </CartoonSvg>
  )
}

function CrownBadge({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <LinGrad gid={gid} name="crown" stops={[['0%', '#fde047'], ['100%', '#f59e0b']]} />
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#fbbf24" />
          <path d="M12 42 L20 22 L30 32 L32 14 L34 32 L44 22 L52 42 Z" fill={`url(#${gid('crown')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
          <rect x="10" y="40" width="44" height="12" rx="5" fill="#d97706" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="28" r="5" fill="#ef4444" stroke={OUTLINE} strokeWidth="1.5" />
          <circle cx="20" cy="36" r="3" fill="#3b82f6" stroke={OUTLINE} strokeWidth="1" />
          <circle cx="44" cy="36" r="3" fill="#22c55e" stroke={OUTLINE} strokeWidth="1" />
          <Gloss cx="24" cy="26" rx="6" ry="3" opacity="0.4" />
        </g>
      )}
    </CartoonSvg>
  )
}

function CrownLarge({ size }) {
  return (
    <CartoonSvg
      size={size}
      defs={(gid) => (
        <LinGrad gid={gid} name="crown" stops={[['0%', '#fef08a'], ['40%', '#fbbf24'], ['100%', '#b45309']]} />
      )}
    >
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <PedestalGlow gid={gid} color="#fbbf24" cy={50} />
          <path d="M8 46 L16 16 L26 30 L32 8 L38 30 L48 16 L56 46 Z" fill={`url(#${gid('crown')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
          <rect x="6" y="44" width="52" height="14" rx="6" fill="#d97706" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="16" cy="34" r="4" fill="#3b82f6" stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="32" cy="26" r="5" fill="#ef4444" stroke={OUTLINE} strokeWidth="1.5" />
          <circle cx="48" cy="34" r="4" fill="#22c55e" stroke={OUTLINE} strokeWidth="1.2" />
          <Sparkle x="32" y="10" r="2.5" />
          <Gloss cx="22" cy="28" rx="8" ry="4" opacity="0.35" />
        </g>
      )}
    </CartoonSvg>
  )
}

function BoxFallback({ size }) {
  return (
    <CartoonSvg size={size}>
      {(gid) => (
        <g filter={`url(#${gid('shadow')})`}>
          <rect x="16" y="20" width="32" height="28" rx="6" fill="#94a3b8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M16 26 h32" stroke={OUTLINE} strokeWidth="2" />
        </g>
      )}
    </CartoonSvg>
  )
}

export const ITEM_ICONS = {
  freeze_card_1: (p) => <FreezeCard {...p} />,
  freeze_card_5pack: (p) => <FreezeCard {...p} pack />,
  double_xp_30m: (p) => <XpPotion {...p} />,
  double_xp_week: (p) => <XpPotion {...p} weekly />,
  hint_card_5: HintScroll,
  retry_voucher_3: RetryTicket,
  skip_card_1: SkipWand,
  scholar_pack: ScholarPack,
  mem_trial_3d: (p) => <VipTicket {...p} days="3天试用" />,
  mem_month: CrownBadge,
  mem_year: CrownLarge,
}

export function ItemIcon({ id, size = 48 }) {
  const C = ITEM_ICONS[id] || BoxFallback
  return <C size={size} />
}
