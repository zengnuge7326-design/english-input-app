import type { Lesson } from '../../types'
import { G3U1_ISLANDS } from './plan'
import type { G3U1DrawState } from './drawState'
import { sampleExamLesson, sampleMixedLesson } from './sampler'

const SET_LABELS = ['', ' · 巩固', ' · 掌握']

export function getG3U1Lesson(nodeId: string, setIndex: number, drawState: G3U1DrawState): Lesson | null {
  const island = G3U1_ISLANDS.find(i => i.id === nodeId)
  if (!island) return null

  const label = island.kind === 'exam' ? '' : (SET_LABELS[setIndex] ?? ` · 第${setIndex + 1}次`)
  const title = `${island.title}${label}`
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  if (island.kind === 'exam') {
    return {
      id: `${nodeId}-exam-${runId}`,
      nodeId,
      title,
      questions: sampleExamLesson(drawState),
    }
  }

  return {
    id: `${nodeId}-run-${runId}`,
    nodeId,
    title,
    questions: sampleMixedLesson(drawState),
  }
}
