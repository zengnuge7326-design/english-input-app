/** 26 英文字母：大小写、字母名、儿童具象例词、字母名音标、例词首音、卡通配色、SVG 图标键 */
export const ALPHABET_LETTERS = [
  { upper: 'A', lower: 'a', name: 'A', example: 'apple',      zh: '苹果',   nameIpa: '/eɪ/',  sound: '/æ/',  color: 'rose',    icon: 'apple' },
  { upper: 'B', lower: 'b', name: 'B', example: 'ball',       zh: '球',     nameIpa: '/biː/', sound: '/b/',  color: 'blue',    icon: 'ball' },
  { upper: 'C', lower: 'c', name: 'C', example: 'cat',        zh: '猫',     nameIpa: '/siː/', sound: '/k/',  color: 'orange',  icon: 'cat' },
  { upper: 'D', lower: 'd', name: 'D', example: 'dog',        zh: '狗',     nameIpa: '/diː/', sound: '/d/',  color: 'amber',   icon: 'dog' },
  { upper: 'E', lower: 'e', name: 'E', example: 'egg',        zh: '鸡蛋',   nameIpa: '/iː/',  sound: '/i:/', color: 'yellow',  icon: 'egg' },
  { upper: 'F', lower: 'f', name: 'F', example: 'fish',       zh: '鱼',     nameIpa: '/ef/',  sound: '/f/',  color: 'cyan',    icon: 'fish' },
  { upper: 'G', lower: 'g', name: 'G', example: 'grape',      zh: '葡萄',   nameIpa: '/dʒiː/', sound: '/ɡ/', color: 'purple',  icon: 'grape' },
  { upper: 'H', lower: 'h', name: 'H', example: 'hat',        zh: '帽子',   nameIpa: '/eɪtʃ/', sound: '/h/', color: 'teal',    icon: 'hat' },
  { upper: 'I', lower: 'i', name: 'I', example: 'ice cream',  zh: '冰淇淋', nameIpa: '/aɪ/',  sound: '/aɪ/', color: 'sky',     icon: 'icecream' },
  { upper: 'J', lower: 'j', name: 'J', example: 'jam',        zh: '果酱',   nameIpa: '/dʒeɪ/', sound: '/dʒ/', color: 'pink',    icon: 'jam' },
  { upper: 'K', lower: 'k', name: 'K', example: 'key',        zh: '钥匙',   nameIpa: '/keɪ/', sound: '/k/',  color: 'amber',   icon: 'key' },
  { upper: 'L', lower: 'l', name: 'L', example: 'lion',       zh: '狮子',   nameIpa: '/el/',  sound: '/l/',  color: 'orange',  icon: 'lion' },
  { upper: 'M', lower: 'm', name: 'M', example: 'moon',       zh: '月亮',   nameIpa: '/em/',  sound: '/m/',  color: 'indigo',  icon: 'moon' },
  { upper: 'N', lower: 'n', name: 'N', example: 'nest',       zh: '鸟巢',   nameIpa: '/en/',  sound: '/n/',  color: 'lime',    icon: 'nest' },
  { upper: 'O', lower: 'o', name: 'O', example: 'orange',     zh: '橙子',   nameIpa: '/oʊ/',  sound: '/ɒ/',  color: 'orange',  icon: 'orange' },
  { upper: 'P', lower: 'p', name: 'P', example: 'panda',      zh: '熊猫',   nameIpa: '/piː/', sound: '/p/',  color: 'slate',   icon: 'panda' },
  { upper: 'Q', lower: 'q', name: 'Q', example: 'queen',      zh: '女王',   nameIpa: '/kjuː/', sound: '/kw/', color: 'pink',    icon: 'queen' },
  { upper: 'R', lower: 'r', name: 'R', example: 'rabbit',     zh: '兔子',   nameIpa: '/ɑːr/', sound: '/r/',  color: 'rose',    icon: 'rabbit' },
  { upper: 'S', lower: 's', name: 'S', example: 'sun',        zh: '太阳',   nameIpa: '/es/',  sound: '/s/',  color: 'yellow',  icon: 'sun' },
  { upper: 'T', lower: 't', name: 'T', example: 'tree',       zh: '大树',   nameIpa: '/tiː/', sound: '/t/',  color: 'green',   icon: 'tree' },
  { upper: 'U', lower: 'u', name: 'U', example: 'umbrella',   zh: '雨伞',   nameIpa: '/juː/', sound: '/ʌ/',  color: 'violet',  icon: 'umbrella' },
  { upper: 'V', lower: 'v', name: 'V', example: 'van',        zh: '货车',   nameIpa: '/viː/', sound: '/v/',  color: 'red',     icon: 'van' },
  { upper: 'W', lower: 'w', name: 'W', example: 'watermelon', zh: '西瓜',   nameIpa: '/dʌbəl juː/', sound: '/w/', color: 'emerald', icon: 'watermelon' },
  { upper: 'X', lower: 'x', name: 'X', example: 'xylophone',  zh: '木琴',   nameIpa: '/eks/', sound: '/eks/', color: 'emerald', icon: 'xylophone' },
  { upper: 'Y', lower: 'y', name: 'Y', example: 'yo-yo',      zh: '悠悠球', nameIpa: '/waɪ/', sound: '/j/',  color: 'amber',   icon: 'yoyo' },
  { upper: 'Z', lower: 'z', name: 'Z', example: 'zebra',      zh: '斑马',   nameIpa: '/ziː/', sound: '/z/',  color: 'slate',   icon: 'zebra' },
]

// 卡通主题色 — 玻璃化（半透明 + 微光）
export const COLOR_THEMES = {
  rose:    { from: 'from-rose-500/70',    to: 'to-rose-300/50',    ring: 'ring-rose-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(244,63,94,0.38)]' },
  blue:    { from: 'from-blue-500/70',    to: 'to-sky-300/50',     ring: 'ring-blue-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(59,130,246,0.38)]' },
  orange:  { from: 'from-orange-500/70',  to: 'to-amber-300/50',   ring: 'ring-orange-300/70',  text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(249,115,22,0.38)]' },
  amber:   { from: 'from-amber-600/70',   to: 'to-yellow-300/50',  ring: 'ring-amber-300/70',   text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(245,158,11,0.38)]' },
  yellow:  { from: 'from-yellow-500/70',  to: 'to-yellow-200/50',  ring: 'ring-yellow-300/70',  text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(234,179,8,0.38)]' },
  cyan:    { from: 'from-cyan-500/70',    to: 'to-teal-300/50',    ring: 'ring-cyan-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(6,182,212,0.38)]' },
  purple:  { from: 'from-purple-600/70',  to: 'to-fuchsia-400/50', ring: 'ring-purple-300/70',  text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(147,51,234,0.38)]' },
  teal:    { from: 'from-teal-500/70',    to: 'to-emerald-300/50', ring: 'ring-teal-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(20,184,166,0.38)]' },
  sky:     { from: 'from-sky-400/70',     to: 'to-cyan-200/50',    ring: 'ring-sky-300/70',     text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(14,165,233,0.38)]' },
  pink:    { from: 'from-pink-500/70',    to: 'to-rose-300/50',    ring: 'ring-pink-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(236,72,153,0.38)]' },
  indigo:  { from: 'from-indigo-500/70',  to: 'to-violet-300/50',  ring: 'ring-indigo-300/70',  text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(99,102,241,0.38)]' },
  lime:    { from: 'from-lime-500/70',    to: 'to-green-300/50',   ring: 'ring-lime-300/70',    text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(132,204,22,0.38)]' },
  slate:   { from: 'from-slate-500/70',   to: 'to-slate-300/50',   ring: 'ring-slate-300/70',   text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(100,116,139,0.38)]' },
  green:   { from: 'from-green-600/70',   to: 'to-emerald-300/50', ring: 'ring-green-300/70',   text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(34,197,94,0.38)]' },
  violet:  { from: 'from-violet-600/70',  to: 'to-purple-300/50',  ring: 'ring-violet-300/70',  text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(139,92,246,0.38)]' },
  red:     { from: 'from-red-600/70',     to: 'to-rose-300/50',    ring: 'ring-red-300/70',     text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(239,68,68,0.38)]' },
  emerald: { from: 'from-emerald-500/70', to: 'to-teal-300/50',    ring: 'ring-emerald-300/70', text: 'text-white',  glow: 'shadow-[0_0_18px_rgba(16,185,129,0.38)]' },
}

export function themeOf(letter) {
  return COLOR_THEMES[letter?.color] || COLOR_THEMES.blue
}
