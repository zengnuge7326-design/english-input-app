import type { GradeBook } from '../gradeBooks'

export const PEP_ISLANDS_PER_UNIT = 8
export const PEP_PRACTICE_SET_COUNT = 3
export const PEP_EXAM_SET_COUNT = 1

export interface PepIslandDef {
  index: number
  title: string
  subtitle: string
  kind: 'lesson' | 'exam'
  xp: number
}

export const PEP_ISLAND_TEMPLATE: PepIslandDef[] = [
  { index: 1, title: '综合练习 1', subtitle: 'Mixed 1', kind: 'lesson', xp: 10 },
  { index: 2, title: '综合练习 2', subtitle: 'Mixed 2', kind: 'lesson', xp: 10 },
  { index: 3, title: '综合练习 3', subtitle: 'Mixed 3', kind: 'lesson', xp: 10 },
  { index: 4, title: '综合练习 4', subtitle: 'Mixed 4', kind: 'lesson', xp: 12 },
  { index: 5, title: '综合练习 5', subtitle: 'Mixed 5', kind: 'lesson', xp: 10 },
  { index: 6, title: '综合练习 6', subtitle: 'Mixed 6', kind: 'lesson', xp: 10 },
  { index: 7, title: '综合练习 7', subtitle: 'Mixed 7', kind: 'lesson', xp: 12 },
  { index: 8, title: '单元检测', subtitle: 'Unit check', kind: 'exam', xp: 20 },
]

const UNIT_COLORS = ['#7ee8c6', '#8ec8ff', '#c4a8ff', '#ffb3d9', '#ffd166', '#a8e6cf', '#ffab91', '#b39ddb']

/** g3-1 → g31，用于节点 id 前缀 */
export function bookSlug(bookId: string): string {
  return bookId.replace(/-/g, '')
}

export function pepNodeId(bookId: string, unit: number, island: number): string {
  return `${bookSlug(bookId)}-u${unit}-${String(island).padStart(2, '0')}`
}

export function isPepPracticeNode(nodeId: string): boolean {
  return /^[a-z0-9]+-u\d+-\d{2}$/.test(nodeId)
}

export function isPepExamNode(nodeId: string): boolean {
  return isPepPracticeNode(nodeId) && nodeId.endsWith('-08')
}

export function parsePepNodeId(nodeId: string): { bookSlug: string; unit: number; island: number } | null {
  const m = nodeId.match(/^([a-z0-9]+)-u(\d+)-(\d{2})$/)
  if (!m) return null
  return { bookSlug: m[1], unit: Number(m[2]), island: Number(m[3]) }
}

export function bookIdFromSlug(slug: string): string | null {
  // 小学/初中：g3-1 ... g9-2 → slug 'g31' ... 'g92'
  const m = slug.match(/^g(\d)(\d)$/)
  if (m) return `g${m[1]}-${m[2]}`
  // 高中 BSDA：bsda-b1/b2/b3/s1/s2/s3/s4 → slug 'bsdab1' ...
  const m2 = slug.match(/^bsda([bs]\d)$/)
  if (m2) return `bsda-${m2[1]}`
  return null
}

export function maxSetsForPepNode(nodeId: string): number {
  return isPepExamNode(nodeId) ? PEP_EXAM_SET_COUNT : PEP_PRACTICE_SET_COUNT
}

export function unitColor(index: number): string {
  return UNIT_COLORS[(index - 1) % UNIT_COLORS.length]
}

/** 三上 Unit 1 单元名（与 G3U1 路径一致） */
export const G3UP_U1_TITLE = 'Unit 1 Hello!'

export function isPrimaryPracticeBook(book: GradeBook): boolean {
  return book.level === 'primary' && book.available
}
