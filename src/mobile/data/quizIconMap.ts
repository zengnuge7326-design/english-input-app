/** 题目区 Lucide 图标 key（对应 assets/icons/quiz/*.svg） */
export type QuizIconName =
  | 'pencil'
  | 'pen'
  | 'ruler'
  | 'eraser'
  | 'backpack'
  | 'book-open'
  | 'package'
  | 'paintbrush'
  | 'hand'
  | 'id-card'
  | 'eye'
  | 'user'
  | 'message-circle'
  | 'folder-open'
  | 'book-x'
  | 'door-open'
  | 'languages'
  | 'volume-2'
  | 'user-round'
  | 'graduation-cap'

export type QuizAvatarRole = 'teacher' | 'student' | 'boy' | 'girl' | 'shop' | 'visitor' | 'friend'

const ZH_ICON: Record<string, QuizIconName> = {
  你好: 'hand',
  嗨: 'hand',
  钢笔: 'pen',
  铅笔: 'pencil',
  尺子: 'ruler',
  橡皮: 'eraser',
  书包: 'backpack',
  书: 'book-open',
  铅笔盒: 'package',
  蜡笔: 'paintbrush',
  名字: 'id-card',
  再见: 'hand',
  打开: 'folder-open',
  合上: 'book-x',
  展示: 'eye',
  背上: 'backpack',
  我: 'user',
  是: 'message-circle',
  你: 'user',
  你的: 'user',
  早上: 'hand',
  很好: 'id-card',
}

const EN_ICON: Record<string, QuizIconName> = {
  hello: 'hand',
  hi: 'hand',
  pen: 'pen',
  pencil: 'pencil',
  ruler: 'ruler',
  eraser: 'eraser',
  bag: 'backpack',
  book: 'book-open',
  'pencil box': 'package',
  crayon: 'paintbrush',
  name: 'id-card',
  goodbye: 'hand',
  open: 'folder-open',
  close: 'book-x',
  show: 'eye',
  carry: 'backpack',
  i: 'user',
  am: 'message-circle',
  you: 'user',
  your: 'user',
}

const EMOJI_ICON: Record<string, QuizIconName> = {
  '👋': 'hand',
  '✋': 'hand',
  '🖊️': 'pen',
  '✏️': 'pencil',
  '📏': 'ruler',
  '🧽': 'eraser',
  '🎒': 'backpack',
  '📖': 'book-open',
  '📦': 'package',
  '🖍️': 'paintbrush',
  '🪪': 'id-card',
  '📂': 'folder-open',
  '📕': 'book-x',
  '👀': 'eye',
  '🙋': 'user',
  '💬': 'message-circle',
  '👉': 'user',
  '👤': 'user',
  '🔊': 'volume-2',
}

export function iconForZh(zh: string): QuizIconName {
  const key = zh.replace(/[。！？]/g, '').trim()
  return ZH_ICON[key] ?? 'pencil'
}

export function iconForEn(en: string): QuizIconName {
  return EN_ICON[en.toLowerCase().trim()] ?? 'languages'
}

export function iconFromEmoji(emoji?: string): QuizIconName | undefined {
  if (!emoji) return undefined
  return EMOJI_ICON[emoji]
}

export function resolveQuizIcon(opts: {
  iconKey?: QuizIconName
  emoji?: string
  zh?: string
  en?: string
}): QuizIconName {
  if (opts.iconKey) return opts.iconKey
  const fromEmoji = iconFromEmoji(opts.emoji)
  if (fromEmoji) return fromEmoji
  if (opts.zh) return iconForZh(opts.zh)
  if (opts.en) return iconForEn(opts.en)
  return 'languages'
}

const AVATAR_ICON: Record<QuizAvatarRole, QuizIconName> = {
  teacher: 'graduation-cap',
  student: 'user-round',
  boy: 'user',
  girl: 'user-round',
  shop: 'package',
  visitor: 'hand',
  friend: 'user-round',
}

export function iconForAvatarRole(role: QuizAvatarRole): QuizIconName {
  return AVATAR_ICON[role]
}

/** 故事/对话 speaker 名 → 头像角色 */
export function avatarRoleFromChatSpeaker(speaker: string): QuizAvatarRole {
  const map: Record<string, QuizAvatarRole> = {
    Teacher: 'teacher',
    Classmate: 'student',
    'Shop assistant': 'shop',
    'New friend': 'friend',
    Visitor: 'visitor',
    Amy: 'girl',
    John: 'boy',
    Mike: 'boy',
    You: 'student',
  }
  return map[speaker] ?? avatarRoleFromSpeaker(speaker)
}

export function avatarRoleFromSpeaker(speaker: string, name?: string): QuizAvatarRole {
  const s = `${speaker} ${name ?? ''}`.toLowerCase()
  if (s.includes('teacher') || s.includes('老师') || s.includes('miss')) return 'teacher'
  if (s.includes('shop') || s.includes('assistant')) return 'shop'
  if (s.includes('visitor')) return 'visitor'
  if (s.includes('friend') || s.includes('zoom') || s.includes('zip')) return 'friend'
  if (s.includes('amy') || s.includes('sarah') || s.includes('lily') || s.includes('chen')) return 'girl'
  if (s.includes('john') || s.includes('mike') || s.includes('tom') || s.includes('ben')) return 'boy'
  if (s.includes('classmate') || s.includes('同学') || s.includes('学生') || s.includes('student')) return 'student'
  return 'student'
}
