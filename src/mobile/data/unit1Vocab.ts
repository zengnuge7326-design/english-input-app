export interface VocabWord {
  id: string
  en: string
  zh: string
}

import { G3U1_VOCAB } from './g3u1/vocab'

/** PEP 三上 Unit 1 词汇 */
export const UNIT1_VOCAB: VocabWord[] = G3U1_VOCAB.map((v, i) => ({
  id: `w${i + 1}`,
  en: v.en,
  zh: v.zh,
}))

export const VOCAB_STAGE_MILESTONES = [5, 10, UNIT1_VOCAB.length] as const
export const VOCAB_VISIBLE_SLOTS = 5
