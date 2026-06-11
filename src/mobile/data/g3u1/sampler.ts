import type { QuestionData } from '../../types'
import type { G3U1DrawState } from '../../types'
import {
  createG3U1DrawState,
  sampleExamLessonWithState,
  sampleMixedLessonWithState,
} from './drawState'

export { createG3U1DrawState, minPracticeSessionsForFullCoverage } from './drawState'
export type { G3U1DrawState } from '../../types'

/** 练习岛：覆盖优先抽 8 题 */
export function sampleMixedLesson(state: G3U1DrawState): QuestionData[] {
  return sampleMixedLessonWithState(state)
}

/** 检测岛：覆盖优先抽 11 题 */
export function sampleExamLesson(state: G3U1DrawState): QuestionData[] {
  return sampleExamLessonWithState(state)
}

/** 无状态兜底（测试/工具用） */
export function sampleMixedLessonEphemeral(): QuestionData[] {
  return sampleMixedLessonWithState(createG3U1DrawState())
}

export function sampleExamLessonEphemeral(): QuestionData[] {
  return sampleExamLessonWithState(createG3U1DrawState())
}
