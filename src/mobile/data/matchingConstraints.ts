import type { MatchingQuestionData } from '../types'

/** 配对题：至少几对（左音频 + 右中文 = 一大题 2×N 个词） */
export const MIN_MATCHING_PAIRS = 5

export function countMatchingPairs(q: Pick<MatchingQuestionData, 'pairs'>): number {
  return q.pairs.length
}

export function assertMatchingQuestion(q: MatchingQuestionData) {
  const n = countMatchingPairs(q)
  if (n < MIN_MATCHING_PAIRS) {
    throw new Error(`[matching] ${q.id}: ${n} pairs, minimum ${MIN_MATCHING_PAIRS}`)
  }
  const ids = new Set(q.pairs.map(p => p.id))
  if (ids.size !== n) {
    throw new Error(`[matching] ${q.id}: duplicate pair ids`)
  }
}

export function validateMatchingQuestions(questions: MatchingQuestionData[]) {
  for (const q of questions) assertMatchingQuestion(q)
}
