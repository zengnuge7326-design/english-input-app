import type { QuestionType } from '../../types'

/**
 * 三年级上册 Unit 1《Hello!》— 动态混练方案
 *
 * 题型库：11 种核心题型 × 各 20 道 = 220 道（见 bank.ts）
 * 地图：8 岛
 *   - 岛 1–7：综合练习，每岛 3 套，每套 8 题
 *   - 岛 8：单元检测，11 题型各 1 道，仅可完成 1 次
 *
 * ## 抽题策略（覆盖优先，见 drawState.ts）
 *
 * 1. **题型袋**：11 种题型洗牌入袋；每次练习取 8 种，袋空补满再取 → 各题型出现频率均衡。
 * 2. **题目袋**：每种题型 20 道题洗牌入袋；被抽到则从袋顶取出，**20 道全出完前不重复**；袋空重洗。
 * 3. **题序**：当次 8/11 道题再随机打乱。
 * 4. **状态**：`progress.g3u1Draw` 跨岛屿、跨套次共享；清除进度时重置。
 *
 * ## 覆盖效率
 *
 * - 单次练习 8 题 → 全覆盖 220 题最少 **28 次**综合练习（⌈220÷8⌉）。
 * - 首轮通关 7 岛×3 套 = 21 次练习（168 题）+ 检测 11 题 = **179 题**，尚余 41 题需重玩/加练。
 * - 对比纯随机：本策略避免「连刷旧题、新题迟迟不出现」，最快路径接近理论下限。
 */

export const G3U1_UNIT_ID = 'g3u1'
export const G3U1_ISLAND_COUNT = 8
export const G3U1_BANK_SIZE = 20
export const G3U1_TYPE_COUNT = 11
export const G3U1_TOTAL_QUESTIONS = G3U1_BANK_SIZE * G3U1_TYPE_COUNT
export const G3U1_PRACTICE_DRAW = 8
export const G3U1_EXAM_DRAW = 11
export const G3U1_PRACTICE_SET_COUNT = 3
export const G3U1_EXAM_SET_COUNT = 1

export const G3U1_CORE_TYPES: QuestionType[] = [
  'translate',
  'wordTranslate',
  'matching',
  'storyListen',
  'listening',
  'dictation',
  'spelling',
  'ordering',
  'choice',
  'speaking',
  'aichat',
]

export interface G3U1IslandDef {
  id: string
  index: number
  title: string
  subtitle: string
  kind: 'lesson' | 'exam'
  xp: number
}

export const G3U1_ISLANDS: G3U1IslandDef[] = [
  { id: 'g3u1-01', index: 1, title: '综合练习 1', subtitle: 'Mixed 1', kind: 'lesson', xp: 10 },
  { id: 'g3u1-02', index: 2, title: '综合练习 2', subtitle: 'Mixed 2', kind: 'lesson', xp: 10 },
  { id: 'g3u1-03', index: 3, title: '综合练习 3', subtitle: 'Mixed 3', kind: 'lesson', xp: 10 },
  { id: 'g3u1-04', index: 4, title: '综合练习 4', subtitle: 'Mixed 4', kind: 'lesson', xp: 12 },
  { id: 'g3u1-05', index: 5, title: '综合练习 5', subtitle: 'Mixed 5', kind: 'lesson', xp: 10 },
  { id: 'g3u1-06', index: 6, title: '综合练习 6', subtitle: 'Mixed 6', kind: 'lesson', xp: 10 },
  { id: 'g3u1-07', index: 7, title: '综合练习 7', subtitle: 'Mixed 7', kind: 'lesson', xp: 12 },
  { id: 'g3u1-08', index: 8, title: '单元检测', subtitle: 'Unit check', kind: 'exam', xp: 20 },
]

export function isG3U1Node(nodeId: string) {
  return nodeId.startsWith('g3u1-')
}

export function isG3U1ExamNode(nodeId: string) {
  return nodeId === 'g3u1-08'
}

export function maxSetsForG3U1Node(nodeId: string) {
  return isG3U1ExamNode(nodeId) ? G3U1_EXAM_SET_COUNT : G3U1_PRACTICE_SET_COUNT
}
