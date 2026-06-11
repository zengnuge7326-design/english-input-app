export type GradeLevel = 'primary' | 'junior' | 'senior'

export interface GradeBook {
  id: string
  /** 全局册次序号，对应「第 N 册」 */
  index: number
  title: string
  level: GradeLevel
  /** 角标范围，仿 Duolingo 阶段标签 */
  rangeLabel: string
  wordCount: number
  /** 是否已开放词汇内容 */
  available: boolean
  /** 关联词库 key，无则仅占位 */
  vocabKey?: 'unit1'
}

/** 三年级上册 → 高三下册，共 20 册 */
export const GRADE_BOOKS: GradeBook[] = [
  { id: 'g3-1', index: 1, title: '三年级上册', level: 'primary', rangeLabel: '1~12', wordCount: 73, available: true, vocabKey: 'unit1' },
  { id: 'g3-2', index: 2, title: '三年级下册', level: 'primary', rangeLabel: '13~24', wordCount: 119, available: true },
  { id: 'g4-1', index: 3, title: '四年级上册', level: 'primary', rangeLabel: '25~36', wordCount: 81, available: true },
  { id: 'g4-2', index: 4, title: '四年级下册', level: 'primary', rangeLabel: '37~48', wordCount: 107, available: true },
  { id: 'g5-1', index: 5, title: '五年级上册', level: 'primary', rangeLabel: '49~60', wordCount: 124, available: true },
  { id: 'g5-2', index: 6, title: '五年级下册', level: 'primary', rangeLabel: '61~72', wordCount: 155, available: true },
  { id: 'g6-1', index: 7, title: '六年级上册', level: 'primary', rangeLabel: '73~84', wordCount: 135, available: true },
  { id: 'g6-2', index: 8, title: '六年级下册', level: 'primary', rangeLabel: '85~96', wordCount: 90, available: true },
  { id: 'g7-1', index: 9, title: '七年级上册', level: 'junior', rangeLabel: '97~108', wordCount: 594, available: true },
  { id: 'g7-2', index: 10, title: '七年级下册', level: 'junior', rangeLabel: '109~120', wordCount: 339, available: true },
  { id: 'g8-1', index: 11, title: '八年级上册', level: 'junior', rangeLabel: '121~132', wordCount: 513, available: true },
  { id: 'g8-2', index: 12, title: '八年级下册', level: 'junior', rangeLabel: '133~144', wordCount: 373, available: true },
  { id: 'g9-1', index: 13, title: '九年级上册', level: 'junior', rangeLabel: '145~156', wordCount: 463, available: true },
  { id: 'g9-2', index: 14, title: '九年级下册', level: 'junior', rangeLabel: '157~168', wordCount: 129, available: true },
  { id: 'bsda-b1', index: 15, title: '必修第一册', level: 'senior', rangeLabel: '北师大 · 必修1', wordCount: 297, available: true },
  { id: 'bsda-b2', index: 16, title: '必修第二册', level: 'senior', rangeLabel: '北师大 · 必修2', wordCount: 277, available: true },
  { id: 'bsda-b3', index: 17, title: '必修第三册', level: 'senior', rangeLabel: '北师大 · 必修3', wordCount: 239, available: true },
  { id: 'bsda-s1', index: 18, title: '选择性必修第一册', level: 'senior', rangeLabel: '北师大 · 选必1', wordCount: 291, available: true },
  { id: 'bsda-s2', index: 19, title: '选择性必修第二册', level: 'senior', rangeLabel: '北师大 · 选必2', wordCount: 325, available: true },
  { id: 'bsda-s3', index: 20, title: '选择性必修第三册', level: 'senior', rangeLabel: '北师大 · 选必3', wordCount: 301, available: true },
  { id: 'bsda-s4', index: 21, title: '选择性必修第四册', level: 'senior', rangeLabel: '北师大 · 选必4', wordCount: 243, available: true },
]

const LEVEL_LABEL: Record<GradeLevel, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
}

export function getLevelLabel(level: GradeLevel) {
  return LEVEL_LABEL[level]
}

export function getGradeBook(id: string) {
  return GRADE_BOOKS.find(b => b.id === id)
}
