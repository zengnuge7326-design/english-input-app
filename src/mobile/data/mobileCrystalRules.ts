export type CrystalColor = 'blue' | 'green' | 'red' | 'purple' | 'gold'

export type GemReward = {
  color: CrystalColor
  amount: number
  reason: string
}

export type LessonRewardContext = {
  correct: number
  total: number
  firstClear: boolean
  isExam: boolean
  setsDone: number
  newSets: number
  maxSets: number
  perfect: boolean
}

export function gemsForLessonComplete(ctx: LessonRewardContext): GemReward[] {
  const { correct, total, firstClear, isExam, setsDone, newSets, maxSets, perfect } = ctx
  const pct = total ? correct / total : 0
  const rewards: GemReward[] = []

  rewards.push({ color: 'blue', amount: 1, reason: 'mobile_lesson_done' })

  if (firstClear) {
    rewards.push({ color: 'blue', amount: 1, reason: 'mobile_island_first' })
  }

  if (perfect && total > 0) {
    rewards.push({ color: 'green', amount: 2, reason: 'mobile_lesson_perfect' })
  } else if (pct >= 0.8) {
    rewards.push({ color: 'red', amount: 1, reason: 'mobile_lesson_recover' })
  }

  if (isExam && firstClear) {
    rewards.push({ color: 'green', amount: 1, reason: 'mobile_exam_first' })
  }

  if (!isExam && newSets >= maxSets && setsDone < maxSets) {
    rewards.push({ color: 'purple', amount: 1, reason: 'mobile_island_master' })
  }

  return rewards
}

export function gemsForVocabComplete(): GemReward[] {
  return [{ color: 'blue', amount: 1, reason: 'mobile_vocab_done' }]
}

export function totalGemAmount(rewards: GemReward[]): number {
  return rewards.reduce((sum, r) => sum + r.amount, 0)
}
