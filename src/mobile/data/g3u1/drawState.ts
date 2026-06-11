import type { G3U1DrawState, QuestionData, QuestionType } from '../../types'
import { poolForType } from './bank'
import {
  G3U1_BANK_SIZE,
  G3U1_CORE_TYPES,
  G3U1_EXAM_DRAW,
  G3U1_PRACTICE_DRAW,
  G3U1_TOTAL_QUESTIONS,
} from './plan'

export type { G3U1DrawState } from '../../types'

export function createG3U1DrawState(): G3U1DrawState {
  return { typeBag: [], decks: {} }
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function cloneLive(q: QuestionData, suffix: string): QuestionData {
  const copy = structuredClone(q)
  copy.id = `${copy.id}-${suffix}`
  return copy
}

function refillTypeBag(state: G3U1DrawState) {
  state.typeBag.push(...shuffle([...G3U1_CORE_TYPES]))
}

/** 从题型袋取 n 种题型，保证各题型出现频率均衡 */
export function takePracticeTypes(state: G3U1DrawState, count = G3U1_PRACTICE_DRAW): QuestionType[] {
  while (state.typeBag.length < count) refillTypeBag(state)
  return state.typeBag.splice(0, count)
}

function refillDeck(state: G3U1DrawState, type: QuestionType) {
  const pool = poolForType(type)
  if (pool.length < G3U1_BANK_SIZE) {
    throw new Error(`[g3u1 draw] pool ${type} has ${pool.length} items, need ${G3U1_BANK_SIZE}`)
  }
  state.decks[type] = shuffle(pool.map(q => q.id))
}

function takeQuestionId(state: G3U1DrawState, type: QuestionType): string {
  const pool = poolForType(type)
  const validIds = new Set(pool.map(q => q.id))

  if (!state.decks[type]?.length) refillDeck(state, type)

  while (state.decks[type]!.length) {
    const id = state.decks[type]!.shift()!
    if (validIds.has(id)) return id
  }

  refillDeck(state, type)
  const id = state.decks[type]!.shift()
  if (!id || !validIds.has(id)) {
    throw new Error(`[g3u1 draw] empty deck for ${type}`)
  }
  return id
}

function takeQuestion(state: G3U1DrawState, type: QuestionType, runSuffix: string): QuestionData {
  const pool = poolForType(type)
  const id = takeQuestionId(state, type)
  const base = pool.find(q => q.id === id)
  if (!base) {
    delete state.decks[type]
    const retryId = takeQuestionId(state, type)
    const retry = pool.find(q => q.id === retryId)
    if (!retry) throw new Error(`[g3u1 draw] missing question in ${type}`)
    return cloneLive(retry, runSuffix)
  }
  return cloneLive(base, runSuffix)
}

function shuffleQuestionOrder(questions: QuestionData[]): QuestionData[] {
  return shuffle(questions)
}

/**
 * 练习岛：题型袋取 8 种 + 各题型洗牌袋取 1 道，题内顺序随机。
 * 同一题型 20 道全部出现前不会重复。
 */
export function sampleMixedLessonWithState(state: G3U1DrawState): QuestionData[] {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const types = takePracticeTypes(state)
  const questions = types.map((type, i) => takeQuestion(state, type, `${runId}-${i}`))
  return shuffleQuestionOrder(questions)
}

/**
 * 检测岛：11 题型各 1 道（同样走洗牌袋），顺序随机。
 */
export function sampleExamLessonWithState(state: G3U1DrawState): QuestionData[] {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const types = shuffle([...G3U1_CORE_TYPES]).slice(0, G3U1_EXAM_DRAW)
  const questions = types.map((type, i) => takeQuestion(state, type, `${runId}-exam-${i}`))
  return shuffleQuestionOrder(questions)
}

/** 估算全覆盖预留题库所需最少练习次数（纯练习，不含检测） */
export function minPracticeSessionsForFullCoverage(): number {
  return Math.ceil(G3U1_TOTAL_QUESTIONS / G3U1_PRACTICE_DRAW)
}

/** 各题型累计已出题数量（用于调试/统计） */
export function countDrawnPerType(state: G3U1DrawState): Record<QuestionType, number> {
  const out = Object.fromEntries(G3U1_CORE_TYPES.map(t => [t, 0])) as Record<QuestionType, number>
  for (const type of G3U1_CORE_TYPES) {
    const remaining = state.decks[type]?.length ?? G3U1_BANK_SIZE
    out[type] = G3U1_BANK_SIZE - remaining
  }
  return out
}
