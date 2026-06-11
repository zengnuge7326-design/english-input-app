import {
  CartoonSvg, OUTLINE, OUTLINE_W, Eyes, Blush, Gloss, Sparkle,
  LinGrad, RadGrad, PedestalGlow,
} from './shared'

function petDefs(gid, name, body, accent) {
  return (
    <>
      <LinGrad gid={gid} name={`${name}-body`} stops={[['0%', body[0]], ['100%', body[1]]]} />
      <LinGrad gid={gid} name={`${name}-accent`} stops={[['0%', accent[0]], ['100%', accent[1]]]} />
    </>
  )
}

function PetDuck({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'duck', ['#fef08a', '#f59e0b'], ['#fdba74', '#ea580c'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="54" rx="16" ry="5" fill="#000" opacity="0.12" />
          <ellipse cx="32" cy="40" rx="17" ry="13" fill={`url(#${gid('duck-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="14" fill={`url(#${gid('duck-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M38 26 L50 28 L40 33 Z" fill={`url(#${gid('duck-accent')})`} stroke={OUTLINE} strokeWidth="1.8" />
          <path d="M18 18 C20 10 26 8 32 10 C28 6 22 8 20 14" fill="#38bdf8" stroke={OUTLINE} strokeWidth="1.2" />
          <Eyes y={23} />
          <Blush y={30} spread={9} />
          <Gloss cx="26" cy="20" rx="5" ry="4" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetPenguin({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'pen', ['#1e293b', '#0f172a'], ['#f8fafc', '#e2e8f0'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="17" ry="16" fill={`url(#${gid('pen-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="42" rx="11" ry="12" fill={`url(#${gid('pen-accent')})`} />
          <circle cx="32" cy="22" r="13" fill={`url(#${gid('pen-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="24" rx="8" ry="9" fill="#fff" />
          <Eyes y={22} />
          <path d="M28 30 Q32 34 36 30" fill="#fb923c" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M22 38 L18 48 M42 38 L46 48" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <Sparkle x="48" y="14" r="1.5" color="#bae6fd" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetOtter({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'ott', ['#d97706', '#92400e'], ['#fef3c7', '#fde68a'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="16" ry="13" fill={`url(#${gid('ott-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="23" r="13" fill={`url(#${gid('ott-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="40" rx="9" ry="6" fill={`url(#${gid('ott-accent')})`} />
          <Eyes y={23} />
          <Blush />
          <circle cx="44" cy="36" r="5" fill="#94a3b8" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M14 28 Q8 20 16 18" stroke={`url(#${gid('ott-body')})`} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetCat({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'cat', ['#fdba74', '#ea580c'], ['#fb923c', '#c2410c'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="15" ry="13" fill={`url(#${gid('cat-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="13" fill={`url(#${gid('cat-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M20 16 L24 28 L14 22 Z M44 16 L40 28 L50 22 Z" fill={`url(#${gid('cat-accent')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M24 20 L28 26 M40 20 L36 26" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
          <Eyes y={24} mood="happy" />
          <Blush />
          <path d="M32 30 Q32 33 30 33" stroke={OUTLINE} strokeWidth="1.5" fill="none" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetShiba({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'shi', ['#f97316', '#c2410c'], ['#fde68a', '#fbbf24'])}>
      {(gid) => (
        <>
          <path d="M46 42 Q54 30 48 22 Q42 34 40 40" fill={`url(#${gid('shi-body')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <ellipse cx="32" cy="40" rx="15" ry="12" fill={`url(#${gid('shi-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="13" fill={`url(#${gid('shi-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="38" rx="8" ry="5" fill={`url(#${gid('shi-accent')})`} />
          <path d="M18 20 L22 30 M46 20 L42 30" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
          <Eyes y={24} />
          <ellipse cx="32" cy="30" rx="4" ry="3" fill="#fff" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetPanda({ size }) {
  return (
    <CartoonSvg size={size}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="15" ry="12" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="13" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="24" cy="22" rx="6" ry="7" fill="#1e293b" />
          <ellipse cx="40" cy="22" rx="6" ry="7" fill="#1e293b" />
          <ellipse cx="32" cy="28" rx="5" ry="4" fill="#1e293b" />
          <circle cx="26" cy="24" r="2" fill="#fff" />
          <circle cx="38" cy="24" r="2" fill="#fff" />
          <path d="M48 20 L54 12 L52 24" fill="#22c55e" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M50 14 Q52 18 48 20" stroke="#16a34a" strokeWidth="1.5" fill="none" />
          <Gloss cx="26" cy="18" rx="4" ry="3" opacity="0.4" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetFox({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'fox', ['#f97316', '#c2410c'], ['#fdba74', '#fb923c'])}>
      {(gid) => (
        <>
          <path d="M14 38 Q6 28 12 20 Q20 30 22 38" fill={`url(#${gid('fox-body')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M14 36 L10 28 L16 32" fill="#fff" stroke={OUTLINE} strokeWidth="1" />
          <ellipse cx="32" cy="40" rx="14" ry="11" fill={`url(#${gid('fox-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M18 28 L12 10 L26 22 Z M46 28 L52 10 L38 22 Z" fill={`url(#${gid('fox-body')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <circle cx="32" cy="26" r="12" fill={`url(#${gid('fox-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <Eyes y={26} />
          <path d="M32 30 L28 34 h8 Z" fill="#fff" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetCapybara({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'cap', ['#ca8a04', '#a16207'], ['#fde68a', '#fbbf24'])}>
      {(gid) => (
        <>
          <rect x="12" y="30" width="40" height="18" rx="9" fill={`url(#${gid('cap-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="16" y="18" width="32" height="18" rx="9" fill={`url(#${gid('cap-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="22" rx="12" ry="8" fill={`url(#${gid('cap-accent')})`} opacity="0.5" />
          <Eyes y={26} mood="happy" />
          <rect x="24" y="34" width="16" height="6" rx="3" fill="#fef08a" opacity="0.5" />
          <circle cx="46" cy="20" r="5" fill="#f472b6" stroke={OUTLINE} strokeWidth="1" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetAxolotl({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'axo', ['#fbcfe8', '#f472b6'], ['#fda4af', '#ec4899'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="38" rx="14" ry="11" fill={`url(#${gid('axo-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="12" fill={`url(#${gid('axo-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M12 22 Q4 10 16 18 M52 22 Q60 10 48 18 M10 28 Q2 24 12 30 M54 28 Q62 24 52 30" stroke={`url(#${gid('axo-accent')})`} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Eyes y={24} />
          <path d="M26 32 Q32 36 38 32" fill="#fda4af" />
          <Sparkle x="8" y="12" r="1.5" color="#fce7f3" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetAlien({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'aln', ['#86efac', '#22c55e'], ['#4ade80', '#16a34a'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="38" rx="11" ry="13" fill={`url(#${gid('aln-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="32" cy="24" rx="17" ry="19" fill={`url(#${gid('aln-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <ellipse cx="24" cy="26" rx="6" ry="8" fill="#0f172a" />
          <ellipse cx="40" cy="26" rx="6" ry="8" fill="#0f172a" />
          <ellipse cx="32" cy="22" rx="4" ry="6" fill="#0f172a" />
          <circle cx="25" cy="24" r="1.5" fill="#4ade80" />
          <circle cx="41" cy="24" r="1.5" fill="#4ade80" />
          <circle cx="33" cy="20" r="1" fill="#86efac" />
          <path d="M32 8 L32 14" stroke={OUTLINE} strokeWidth="2" />
          <circle cx="32" cy="7" r="3" fill="#a855f7" stroke={OUTLINE} strokeWidth="1.2" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetUnicorn({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => (
      <>
        <LinGrad gid={gid} name="uni-body" stops={[['0%', '#f5f3ff'], ['100%', '#e9d5ff']]} />
        <LinGrad gid={gid} name="uni-accent" stops={[['0%', '#ddd6fe'], ['100%', '#c4b5fd']]} />
        <LinGrad gid={gid} name="mane" stops={[['0%', '#fbcfe8'], ['33%', '#c4b5fd'], ['66%', '#93c5fd'], ['100%', '#fde047']]} />
      </>
    )}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="14" ry="11" fill={`url(#${gid('uni-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="26" r="12" fill={`url(#${gid('uni-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M32 8 L36 22 L28 22 Z" fill="#fde047" stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M44 18 Q52 8 54 20 Q48 14 44 22" fill={`url(#${gid('mane')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <Eyes y={26} />
          <Sparkle x="36" y="10" r="2" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetDragonBaby({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'drb', ['#6ee7b7', '#10b981'], ['#34d399', '#059669'])}>
      {(gid) => (
        <>
          <path d="M10 36 Q4 28 14 30" fill={`url(#${gid('drb-body')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M54 36 Q60 28 50 30" fill={`url(#${gid('drb-body')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <ellipse cx="32" cy="40" rx="15" ry="11" fill={`url(#${gid('drb-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="13" fill={`url(#${gid('drb-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M16 20 L8 8 L22 18 M48 20 L56 8 L42 18" fill={`url(#${gid('drb-body')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <Eyes y={24} />
          <path d="M28 32 Q32 36 36 32" fill="#ef4444" />
          <path d="M48 40 Q56 36 54 44" stroke={`url(#${gid('drb-body')})`} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetShieldDog({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'dog', ['#fbbf24', '#d97706'], ['#94a3b8', '#64748b'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="14" ry="11" fill={`url(#${gid('dog-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="12" fill={`url(#${gid('dog-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M18 30 L14 46 L28 40 Z" fill={`url(#${gid('dog-accent')})`} stroke={OUTLINE} strokeWidth="1.8" />
          <path d="M20 34 L24 38 L20 42" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
          <rect x="22" y="16" width="20" height="10" rx="2" fill="#475569" stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M36 16 L48 10 L44 20" fill="#cbd5e1" stroke={OUTLINE} strokeWidth="1.2" />
          <Eyes y={24} />
        </>
      )}
    </CartoonSvg>
  )
}

function PetRobot({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'bot', ['#cbd5e1', '#94a3b8'], ['#38bdf8', '#0284c7'])}>
      {(gid) => (
        <>
          <rect x="16" y="32" width="32" height="18" rx="6" fill={`url(#${gid('bot-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="14" y="12" width="36" height="24" rx="4" fill={`url(#${gid('bot-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="20" y="18" width="10" height="10" fill={`url(#${gid('bot-accent')})`} stroke={OUTLINE} strokeWidth="1" />
          <rect x="34" y="18" width="10" height="10" fill={`url(#${gid('bot-accent')})`} stroke={OUTLINE} strokeWidth="1" />
          <rect x="18" y="20" width="3" height="3" fill="#fff" opacity="0.8" />
          <rect x="36" y="20" width="3" height="3" fill="#fff" opacity="0.8" />
          <rect x="24" y="38" width="16" height="5" rx="2" fill="#64748b" />
          <path d="M32 6 v6" stroke={OUTLINE} strokeWidth="2" />
          <circle cx="32" cy="5" r="3" fill="#f472b6" stroke={OUTLINE} strokeWidth="1.2" />
          <rect x="10" y="28" width="6" height="10" rx="2" fill="#94a3b8" stroke={OUTLINE} strokeWidth="1" />
          <rect x="48" y="28" width="6" height="10" rx="2" fill="#94a3b8" stroke={OUTLINE} strokeWidth="1" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetLuckyCat({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'luck', ['#fff', '#fecaca'], ['#ef4444', '#dc2626'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="40" rx="14" ry="11" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="12" fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M20 16 L22 6 L28 18 M44 16 L42 6 L36 18" stroke={OUTLINE} strokeWidth="1.5" fill="none" />
          <ellipse cx="26" cy="24" rx="3.5" ry="5" fill="#1e293b" />
          <ellipse cx="38" cy="24" rx="3.5" ry="5" fill="#1e293b" />
          <path d="M42 32 L54 22" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="54" cy="20" r="6" fill="#fbbf24" stroke={OUTLINE} strokeWidth="1.5" />
          <text x="54" y="23" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">福</text>
          <rect x="14" y="44" width="36" height="8" rx="3" fill={`url(#${gid('luck-accent')})`} stroke={OUTLINE} strokeWidth="1" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetDragonGod({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => (
      <>
        <LinGrad gid={gid} name="dgd-body" stops={[['0%', '#fb923c'], ['100%', '#ea580c']]} />
        <LinGrad gid={gid} name="dgd-accent" stops={[['0%', '#fde047'], ['100%', '#f59e0b']]} />
        <RadGrad gid={gid} name="aura" stops={[['0%', '#fef08a'], ['100%', 'transparent']]} />
      </>
    )}>
      {(gid) => (
        <>
          <circle cx="32" cy="30" r="22" fill={`url(#${gid('aura')})`} opacity="0.5" />
          <ellipse cx="32" cy="40" rx="16" ry="12" fill={`url(#${gid('dgd-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="24" r="13" fill={`url(#${gid('dgd-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M10 18 L4 4 L18 16 M54 18 L60 4 L46 16" fill={`url(#${gid('dgd-body')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M28 10 L32 4 L36 10" fill="#fde047" stroke={OUTLINE} strokeWidth="1.2" />
          <Eyes y={24} />
          <path d="M8 14 Q0 4 8 10" stroke="#fde047" strokeWidth="2" fill="none" />
          <Sparkle x="56" y="12" r="2.5" color="#fde047" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetYellowChu({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'pika', ['#fde047', '#eab308'], ['#facc15', '#ca8a04'])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="42" rx="14" ry="9" fill={`url(#${gid('pika-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M16 38 Q10 48 18 50 M48 38 Q54 48 46 50" fill={`url(#${gid('pika-accent')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="32" cy="24" r="14" fill={`url(#${gid('pika-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M12 20 Q4 6 18 16 M52 20 Q60 6 46 16" fill={`url(#${gid('pika-accent')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="26" cy="24" r="3.5" fill="#1e293b" />
          <circle cx="38" cy="24" r="3.5" fill="#1e293b" />
          <circle cx="27" cy="23" r="1.2" fill="#fff" />
          <circle cx="39" cy="23" r="1.2" fill="#fff" />
          <circle cx="20" cy="30" r="5" fill="#ef4444" opacity="0.85" />
          <circle cx="44" cy="30" r="5" fill="#ef4444" opacity="0.85" />
          <path d="M28 30 Q32 34 36 30" fill="#ef4444" />
          <path d="M50 26 L58 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <Sparkle x="58" y="18" r="2" color="#fde047" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetHero({ size, color }) {
  const isRed = color === 'red'
  const body = isRed ? ['#fca5a5', '#dc2626'] : ['#93c5fd', '#2563eb']
  const light = isRed ? '#fef2f2' : '#eff6ff'
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'hero', body, [light, light])}>
      {(gid) => (
        <>
          <ellipse cx="32" cy="42" rx="12" ry="14" fill={`url(#${gid('hero-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="22" r="11" fill={light} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M26 8 h12 l2 8 h-16 Z" fill={`url(#${gid('hero-body')})`} stroke={OUTLINE} strokeWidth="1.5" />
          <ellipse cx="26" cy="22" rx="5" ry="6" fill="#fef08a" stroke={OUTLINE} strokeWidth="1" />
          <ellipse cx="38" cy="22" rx="5" ry="6" fill="#fef08a" stroke={OUTLINE} strokeWidth="1" />
          <circle cx="26" cy="22" r="2" fill={isRed ? '#dc2626' : '#2563eb'} />
          <circle cx="38" cy="22" r="2" fill={isRed ? '#dc2626' : '#2563eb'} />
          {isRed && <circle cx="32" cy="36" r="3" fill="#38bdf8" stroke={OUTLINE} strokeWidth="1" />}
          <path d="M18 36 L10 50 M46 36 L54 50" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetPhoenix({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => (
      <>
        <LinGrad gid={gid} name="flame" stops={[['0%', '#fef08a'], ['40%', '#fb923c'], ['100%', '#dc2626']]} />
        <RadGrad gid={gid} name="halo" stops={[['0%', '#fde047'], ['100%', 'transparent']]} />
      </>
    )}>
      {(gid) => (
        <>
          <circle cx="32" cy="28" r="20" fill={`url(#${gid('halo')})`} opacity="0.6" />
          <path d="M32 52 Q4 38 14 22 Q32 4 50 22 Q60 38 32 52" fill={`url(#${gid('flame')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M32 44 Q20 34 26 24 Q32 14 38 24 Q44 34 32 44" fill="#fde047" opacity="0.8" />
          <circle cx="32" cy="26" r="9" fill="#fef08a" stroke={OUTLINE} strokeWidth="1.5" />
          <Eyes lx={28} rx={36} y={26} />
          <path d="M16 30 Q8 20 14 16 M48 30 Q56 20 50 16" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" />
          <Sparkle x="32" y="8" r="2.5" color="#fde047" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetKaiju({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'kai', ['#a78bfa', '#6d28d9'], ['#c4b5fd', '#7c3aed'])}>
      {(gid) => (
        <>
          <path d="M6 32 Q2 24 10 26 M58 32 Q62 24 54 26 M8 40 Q0 36 10 42 M56 40 Q64 36 54 42" stroke={`url(#${gid('kai-accent')})`} strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="38" rx="18" ry="13" fill={`url(#${gid('kai-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="22" r="12" fill={`url(#${gid('kai-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <Eyes y={22} />
          <path d="M22 14 L18 6 M42 14 L46 6" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="26" y="34" width="4" height="6" rx="1" fill="#1e1b4b" />
          <rect x="34" y="34" width="4" height="6" rx="1" fill="#1e1b4b" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetGodzilla({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => petDefs(gid, 'zilla', ['#22c55e', '#15803d'], ['#4ade80', '#16a34a'])}>
      {(gid) => (
        <>
          <rect x="14" y="34" width="36" height="16" rx="8" fill={`url(#${gid('zilla-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <rect x="18" y="18" width="28" height="20" rx="6" fill={`url(#${gid('zilla-accent')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M12 24 L6 12 L18 22 M52 24 L58 12 L46 22" fill={`url(#${gid('zilla-body')})`} stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M22 16 L24 10 L26 16 M30 14 L32 8 L34 14 M38 16 L40 10 L42 16" fill="#15803d" stroke={OUTLINE} strokeWidth="1" />
          <Eyes y={26} />
          <path d="M54 28 Q60 24 58 20" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetKirin({ size }) {
  return (
    <CartoonSvg size={size} defs={(gid) => (
      <>
        <LinGrad gid={gid} name="kirin-body" stops={[['0%', '#fef08a'], ['100%', '#f59e0b']]} />
        <LinGrad gid={gid} name="kirin-mane" stops={[['0%', '#fbcfe8'], ['50%', '#c4b5fd'], ['100%', '#fde047']]} />
      </>
    )}>
      {(gid) => (
        <>
          <path d="M14 48 Q10 44 18 46 M50 48 Q54 44 46 46" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.6" />
          <ellipse cx="32" cy="40" rx="16" ry="11" fill={`url(#${gid('kirin-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <circle cx="32" cy="26" r="12" fill={`url(#${gid('kirin-body')})`} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
          <path d="M30 8 L34 20 L28 20 Z" fill="#fde047" stroke={OUTLINE} strokeWidth="1.5" />
          <path d="M10 26 Q4 14 16 22 M54 26 Q60 14 48 22" stroke={`url(#${gid('kirin-mane')})`} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Eyes y={26} />
          <path d="M16 14 L12 4 M48 14 L52 4" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <Sparkle x="8" y="10" r="2" color="#fde047" />
          <Sparkle x="56" y="10" r="2" color="#f472b6" />
        </>
      )}
    </CartoonSvg>
  )
}

function PetFallback({ size }) {
  return (
    <CartoonSvg size={size}>
      {(gid) => (
        <circle cx="32" cy="32" r="20" fill="#c4b5fd" stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      )}
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
