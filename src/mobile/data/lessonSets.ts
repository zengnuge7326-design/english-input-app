import type { QuestionData } from '../types'

export const ISLAND_SET_COUNT = 3

const setCache = new Map<string, QuestionData[][]>()

function rotateArray<T>(arr: T[], shift: number): T[] {
  if (!arr.length) return arr
  const s = ((shift % arr.length) + arr.length) % arr.length
  return [...arr.slice(s), ...arr.slice(0, s)]
}

function varyQuestion(q: QuestionData, setIndex: number): QuestionData {
  const copy = structuredClone(q)
  copy.id = `s${setIndex + 1}-${q.id}`

  if (setIndex === 0) return copy

  switch (copy.type) {
    case 'listening':
      if (copy.options?.length) {
        copy.options = rotateArray(copy.options, setIndex)
      }
      break
    case 'choice':
      if (copy.options?.length) {
        copy.options = rotateArray(copy.options, setIndex)
      }
      break
    case 'ordering':
      if (copy.distractors?.length) {
        copy.distractors = rotateArray(copy.distractors, setIndex)
      }
      if (copy.tokens?.length > 2) {
        copy.tokens = rotateArray(copy.tokens, setIndex % (copy.tokens.length - 1 || 1))
      }
      break
    case 'matching':
      if (copy.pairs?.length) {
        copy.pairs = rotateArray(copy.pairs, setIndex)
      }
      break
    case 'wordTranslate':
      if (copy.cards?.length) {
        copy.cards = rotateArray(copy.cards, setIndex)
      }
      break
    default:
      break
  }

  return copy
}

function selectQuestionsForSet(questions: QuestionData[], setIndex: number): QuestionData[] {
  if (questions.length <= 4 || setIndex === 0) return questions

  const chunk = Math.max(3, Math.floor(questions.length / ISLAND_SET_COUNT))
  const offset = (chunk * setIndex) % questions.length
  const rotated = [...questions.slice(offset), ...questions.slice(0, offset)]
  const size = Math.min(questions.length, Math.max(4, chunk + 1))
  return rotated.slice(0, size)
}

export function buildQuestionSets(nodeId: string, questions: QuestionData[]): QuestionData[][] {
  const cached = setCache.get(nodeId)
  if (cached) return cached

  const sets = Array.from({ length: ISLAND_SET_COUNT }, (_, setIndex) =>
    selectQuestionsForSet(questions, setIndex).map(q => varyQuestion(q, setIndex)),
  )

  setCache.set(nodeId, sets)
  return sets
}
