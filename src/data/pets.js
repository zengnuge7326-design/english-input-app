/**
 * 宠物渐变背景色 + CartoonIcon SVG 立绘（按 petId 映射）
 */
export const PET_FALLBACK = {
  pet_duck:        { emoji: '🦆', bg: 'from-yellow-300 to-amber-400' },
  pet_penguin:     { emoji: '🐧', bg: 'from-slate-200 to-slate-400' },
  pet_otter:       { emoji: '🦦', bg: 'from-amber-700 to-amber-900' },
  pet_cat:         { emoji: '🐱', bg: 'from-orange-300 to-orange-500' },
  pet_shiba:       { emoji: '🐕', bg: 'from-amber-400 to-yellow-600' },
  pet_panda:       { emoji: '🐼', bg: 'from-slate-100 to-slate-300' },
  pet_fox:         { emoji: '🦊', bg: 'from-orange-400 to-red-500' },
  pet_capybara:    { emoji: '🦫', bg: 'from-amber-600 to-amber-800' },
  pet_axolotl:     { emoji: '🦎', bg: 'from-pink-300 to-pink-500' },
  pet_alien:       { emoji: '👽', bg: 'from-green-300 to-emerald-500' },
  pet_unicorn:     { emoji: '🦄', bg: 'from-pink-200 via-purple-300 to-indigo-300' },
  pet_dragon_baby: { emoji: '🐉', bg: 'from-emerald-400 to-teal-500' },
  pet_shield_dog:  { emoji: '🐶', bg: 'from-amber-300 to-orange-500' },
  pet_robot:       { emoji: '🤖', bg: 'from-slate-400 to-slate-600' },
  pet_lucky_cat:   { emoji: '😸', bg: 'from-red-300 to-red-500' },
  pet_yellow_chu:  { emoji: '⚡', bg: 'from-yellow-200 to-yellow-500' },
  pet_hero_red:    { emoji: '🦸', bg: 'from-red-400 to-red-600' },
  pet_hero_blue:   { emoji: '🤖', bg: 'from-blue-400 to-indigo-600' },
  pet_dragon_god:  { emoji: '🐲', bg: 'from-orange-400 to-red-600' },
  pet_phoenix:     { emoji: '🔥', bg: 'from-orange-300 via-red-500 to-purple-600' },
  pet_kaiju:       { emoji: '🐙', bg: 'from-purple-500 to-indigo-700' },
  pet_godzilla:    { emoji: '🦖', bg: 'from-green-600 to-teal-700' },
  pet_kirin:       { emoji: '🐉', bg: 'from-amber-300 via-pink-400 to-purple-500' },
}

export const TIER_STYLES = {
  N: {
    label: 'N',
    badge: 'bg-slate-600/80 text-slate-200',
    card: 'border-slate-500/40',
    glow: '',
  },
  R: {
    label: 'R',
    badge: 'bg-blue-600/80 text-blue-100',
    card: 'border-blue-400/60 shadow-[0_0_12px_rgba(96,165,250,0.3)]',
    glow: '',
  },
  SR: {
    label: 'SR',
    badge: 'bg-purple-600/80 text-purple-100',
    card: 'border-purple-400/70 shadow-[0_0_18px_rgba(168,85,247,0.4)]',
    glow: '',
  },
  SSR: {
    label: 'SSR',
    badge: 'bg-amber-600/80 text-amber-100',
    card: 'border-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.5)] pet-tier-ssr',
    glow: 'pet-tier-ssr',
  },
  UR: {
    label: 'UR',
    badge: 'bg-gradient-to-r from-pink-500 to-violet-500 text-white',
    card: 'pet-tier-ur border-2',
    glow: 'pet-tier-ur',
  },
}

export const TIER_LABELS = {
  N: '普通',
  R: '稀有',
  SR: '超稀有',
  SSR: '史诗',
  UR: '传说',
}

/** 图鉴展示用中文名（API name 异常时兜底） */
export const PET_DISPLAY_NAMES = {
  pet_duck: '小黄鸭',
  pet_penguin: '帝企鹅',
  pet_otter: '小水獭',
  pet_cat: '橘猫',
  pet_shiba: '柴犬',
  pet_panda: '国宝熊猫',
  pet_fox: '小狐狸',
  pet_capybara: '水豚',
  pet_axolotl: '六角恐龙',
  pet_alien: '三眼仔',
  pet_unicorn: '独角兽',
  pet_dragon_baby: '小恐龙',
  pet_shield_dog: '刀盾狗',
  pet_robot: '像素机器人',
  pet_lucky_cat: '招财猫',
  pet_dragon_god: '龙神',
  pet_yellow_chu: '电气鼠',
  pet_hero_red: '光之巨人',
  pet_hero_blue: '蓝色英雄',
  pet_phoenix: '朱雀凤凰',
  pet_kaiju: '深海怪兽',
  pet_godzilla: '巨型怪兽',
  pet_kirin: '麒麟',
}

export function getPetDisplayName(petId, apiName) {
  const n = (apiName || '').trim()
  const stripped = n.replace(/^[\p{Extended_Pictographic}\uFE0F]+\s*/u, '').trim()
  if (stripped && !/^pet_/i.test(stripped)) return stripped
  return PET_DISPLAY_NAMES[petId] || stripped || petId
}

export function getPetFallback(petId) {
  return PET_FALLBACK[petId] || { emoji: '📦', bg: 'from-gray-500 to-gray-700' }
}
