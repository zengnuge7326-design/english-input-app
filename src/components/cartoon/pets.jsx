import { CartoonSvg, OUTLINE, OUTLINE_W } from './shared'

function Eyes({ lx = 26, rx = 38, y = 28 }) {
  return (
    <>
      <circle cx={lx} cy={y} r="4" fill="#fff" />
      <circle cx={rx} cy={y} r="4" fill="#fff" />
      <circle cx={lx + 1} cy={y + 1} r="2" fill={OUTLINE} />
      <circle cx={rx + 1} cy={y + 1} r="2" fill={OUTLINE} />
    </>
  )
}

function Cheeks({ y = 34 }) {
  return (
    <>
      <ellipse cx="22" cy={y} rx="3" ry="2" fill="#fda4af" opacity="0.7" />
      <ellipse cx="42" cy={y} rx="3" ry="2" fill="#fda4af" opacity="0.7" />
    </>
  )
}

function PetDuck({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="#fde047" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="14" fill="#facc15" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M38 26 L48 28 L38 32 Z" fill="#fb923c" stroke={OUTLINE} strokeWidth="1.5" />
      <Eyes y={24} />
      <Cheeks y={30} />
    </CartoonSvg>
  )
}

function PetPenguin({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="36" rx="16" ry="18" fill="#1e293b" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="32" cy="38" rx="10" ry="12" fill="#f8fafc" />
      <circle cx="32" cy="22" r="12" fill="#1e293b" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="32" cy="24" rx="7" ry="8" fill="#fff" />
      <Eyes y={22} />
      <path d="M28 30 Q32 34 36 30" fill="#fb923c" stroke={OUTLINE} strokeWidth="1.2" />
    </CartoonSvg>
  )
}

function PetOtter({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="36" rx="17" ry="15" fill="#92400e" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="22" r="13" fill="#b45309" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="32" cy="40" rx="8" ry="5" fill="#fef3c7" />
      <Eyes y={22} />
      <Cheeks />
    </CartoonSvg>
  )
}

function PetCat({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="14" fill="#fb923c" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="13" fill="#fdba74" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M20 16 L24 26 L16 22 Z M44 16 L40 26 L48 22 Z" fill="#fb923c" stroke={OUTLINE} strokeWidth="1.5" />
      <Eyes y={24} />
      <Cheeks />
    </CartoonSvg>
  )
}

function PetShiba({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="14" fill="#ea580c" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="13" fill="#f97316" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M18 20 L22 30 M46 20 L42 30" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      <Eyes y={24} />
      <ellipse cx="32" cy="30" rx="4" ry="3" fill="#fff" />
    </CartoonSvg>
  )
}

function PetPanda({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="14" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="13" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="24" cy="22" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="40" cy="22" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="32" cy="28" rx="4" ry="3" fill="#1e293b" />
      <circle cx="26" cy="24" r="2" fill="#fff" />
      <circle cx="38" cy="24" r="2" fill="#fff" />
    </CartoonSvg>
  )
}

function PetFox({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="15" ry="13" fill="#f97316" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M18 28 L14 12 L28 22 Z M46 28 L50 12 L36 22 Z" fill="#f97316" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="32" cy="26" r="12" fill="#fdba74" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <Eyes y={26} />
      <path d="M32 30 L28 34 h8 Z" fill="#fff" />
    </CartoonSvg>
  )
}

function PetCapybara({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="14" y="28" width="36" height="18" rx="9" fill="#a16207" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="18" y="18" width="28" height="16" rx="8" fill="#ca8a04" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <Eyes y={26} />
      <rect x="24" y="32" width="16" height="6" rx="3" fill="#fef08a" opacity="0.6" />
    </CartoonSvg>
  )
}

function PetAxolotl({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="36" rx="14" ry="12" fill="#f9a8d4" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="12" fill="#fbcfe8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M14 20 Q8 8 18 16 M50 20 Q56 8 46 16" stroke="#f472b6" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Eyes y={24} />
      <path d="M26 32 Q32 36 38 32" fill="#fda4af" />
    </CartoonSvg>
  )
}

function PetAlien({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="36" rx="12" ry="14" fill="#4ade80" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="32" cy="24" rx="16" ry="18" fill="#86efac" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx="26" cy="26" rx="5" ry="7" fill="#000" />
      <ellipse cx="38" cy="26" rx="5" ry="7" fill="#000" />
      <circle cx="27" cy="24" r="1.5" fill="#fff" />
      <circle cx="39" cy="24" r="1.5" fill="#fff" />
    </CartoonSvg>
  )
}

function PetUnicorn({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#e9d5ff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="26" r="12" fill="#f5f3ff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M32 12 L36 24 L28 24 Z" fill="#fde047" stroke={OUTLINE} strokeWidth="1.5" />
      <Eyes y={26} />
      <path d="M44 20 Q48 12 52 18" stroke="#f472b6" strokeWidth="2" fill="none" />
    </CartoonSvg>
  )
}

function PetDragonBaby({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="15" ry="12" fill="#34d399" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="13" fill="#6ee7b7" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M16 20 L10 8 L22 18 M48 20 L54 8 L42 18" fill="#34d399" stroke={OUTLINE} strokeWidth="1.2" />
      <Eyes y={24} />
      <path d="M28 32 Q32 36 36 32" fill="#ef4444" />
    </CartoonSvg>
  )
}

function PetShieldDog({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#d97706" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="12" fill="#fbbf24" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M20 28 L18 42 L28 38 Z" fill="#94a3b8" stroke={OUTLINE} strokeWidth="1.5" />
      <rect x="22" y="18" width="20" height="8" rx="2" fill="#64748b" stroke={OUTLINE} strokeWidth="1.2" />
      <Eyes y={24} />
    </CartoonSvg>
  )
}

function PetRobot({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="18" y="30" width="28" height="18" rx="6" fill="#94a3b8" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="16" y="14" width="32" height="20" rx="6" fill="#cbd5e1" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="22" y="20" width="8" height="8" rx="2" fill="#38bdf8" />
      <rect x="34" y="20" width="8" height="8" rx="2" fill="#38bdf8" />
      <rect x="26" y="36" width="12" height="4" rx="2" fill="#64748b" />
      <path d="M32 8 v6" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="32" cy="8" r="3" fill="#f472b6" />
    </CartoonSvg>
  )
}

function PetLuckyCat({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="12" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M20 16 L22 8 L28 18 M44 16 L42 8 L36 18" stroke={OUTLINE} strokeWidth="1.5" fill="none" />
      <ellipse cx="26" cy="24" rx="3" ry="4" fill="#1e293b" />
      <ellipse cx="38" cy="24" rx="3" ry="4" fill="#1e293b" />
      <path d="M40 32 L48 24" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    </CartoonSvg>
  )
}

function PetDragonGod({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="13" fill="#fb923c" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="24" r="13" fill="#fdba74" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M12 18 L8 6 L20 16 M52 18 L56 6 L44 16" fill="#f97316" stroke={OUTLINE} strokeWidth="1.2" />
      <Eyes y={24} />
      <path d="M14 14 Q6 4 10 12" stroke="#fde047" strokeWidth="2" fill="none" />
    </CartoonSvg>
  )
}

function PetYellowChu({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="40" rx="14" ry="10" fill="#fde047" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M18 36 Q14 44 20 48 M46 36 Q50 44 44 48" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="32" cy="24" r="14" fill="#facc15" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M14 20 Q8 8 18 16 M50 20 Q56 8 46 16" fill="#facc15" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="26" cy="24" r="3" fill="#1e293b" />
      <circle cx="38" cy="24" r="3" fill="#1e293b" />
      <circle cx="27" cy="23" r="1" fill="#fff" />
      <circle cx="39" cy="23" r="1" fill="#fff" />
      <path d="M28 30 Q32 34 36 30" fill="#ef4444" />
    </CartoonSvg>
  )
}

function PetHero({ size, color }) {
  const body = color === 'red' ? '#ef4444' : '#3b82f6'
  const light = color === 'red' ? '#fca5a5' : '#93c5fd'
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="40" rx="12" ry="14" fill={body} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="22" r="11" fill={light} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="26" y="8" width="12" height="8" rx="2" fill={body} stroke={OUTLINE} strokeWidth="1.2" />
      <Eyes y={22} />
      <path d="M20 36 L14 48 M44 36 L50 48" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    </CartoonSvg>
  )
}

function PetPhoenix({ size }) {
  return (
    <CartoonSvg size={size}>
      <path d="M32 48 Q10 36 18 24 Q32 8 46 24 Q54 36 32 48" fill="#fb923c" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M32 40 Q24 32 28 24 Q32 16 36 24 Q40 32 32 40" fill="#fde047" />
      <circle cx="32" cy="26" r="8" fill="#fef08a" stroke={OUTLINE} strokeWidth="1.5" />
      <Eyes lx={28} rx={36} y={26} />
    </CartoonSvg>
  )
}

function PetKaiju({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="36" rx="18" ry="14" fill="#7c3aed" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx="32" cy="22" r="12" fill="#a78bfa" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M8 28 Q4 20 12 24 M56 28 Q60 20 52 24" stroke="#c4b5fd" strokeWidth="3" fill="none" />
      <Eyes y={22} />
      <path d="M24 14 L20 8 M40 14 L44 8" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    </CartoonSvg>
  )
}

function PetGodzilla({ size }) {
  return (
    <CartoonSvg size={size}>
      <rect x="16" y="32" width="32" height="16" rx="8" fill="#16a34a" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <rect x="20" y="18" width="24" height="18" rx="6" fill="#22c55e" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M14 22 L8 12 L18 20 M50 22 L56 12 L46 20" fill="#22c55e" stroke={OUTLINE} strokeWidth="1.2" />
      <Eyes y={26} />
      <path d="M28 34 h8 v4 h-8" fill="#fff" opacity="0.4" />
    </CartoonSvg>
  )
}

function PetKirin({ size }) {
  return (
    <CartoonSvg size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="12" fill="#fbbf24" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M32 10 L36 22 L28 22 Z" fill="#fde047" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="32" cy="26" r="12" fill="#fef08a" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d="M12 24 Q6 14 14 20 M52 24 Q58 14 50 20" stroke="#f472b6" strokeWidth="2" fill="none" />
      <Eyes y={26} />
      <path d="M18 14 L14 6 M46 14 L50 6" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
    </CartoonSvg>
  )
}

function PetFallback({ size }) {
  return (
    <CartoonSvg size={size}>
      <circle cx="32" cy="32" r="20" fill="#c4b5fd" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <text x="32" y="38" textAnchor="middle" fontSize="18">?</text>
    </CartoonSvg>
  )
}

export const PET_ICONS = {
  pet_duck: PetDuck,
  pet_penguin: PetPenguin,
  pet_otter: PetOtter,
  pet_cat: PetCat,
  pet_shiba: PetShiba,
  pet_panda: PetPanda,
  pet_fox: PetFox,
  pet_capybara: PetCapybara,
  pet_axolotl: PetAxolotl,
  pet_alien: PetAlien,
  pet_unicorn: PetUnicorn,
  pet_dragon_baby: PetDragonBaby,
  pet_shield_dog: PetShieldDog,
  pet_robot: PetRobot,
  pet_lucky_cat: PetLuckyCat,
  pet_dragon_god: PetDragonGod,
  pet_yellow_chu: PetYellowChu,
  pet_hero_red: (p) => <PetHero {...p} color="red" />,
  pet_hero_blue: (p) => <PetHero {...p} color="blue" />,
  pet_phoenix: PetPhoenix,
  pet_kaiju: PetKaiju,
  pet_godzilla: PetGodzilla,
  pet_kirin: PetKirin,
}

export function PetIcon({ id, size = 48 }) {
  const C = PET_ICONS[id] || PetFallback
  return <C size={size} />
}
