import { getVocabBookData } from '../vocabBooks'
import { G3U1_ISLANDS, G3U1_UNIT_ID } from '../g3u1/plan'
import type { MobileProgress, Unit } from '../../types'
import {
  G3UP_U1_TITLE,
  PEP_ISLAND_TEMPLATE,
  bookSlug,
  pepNodeId,
  unitColor,
} from './plan'
import { ISLAND_SET_COUNT } from '../lessonSets'
import { isG3U1ExamNode } from '../g3u1/plan'
import { isPepExamNode } from './plan'

function nodeSetsCompleted(progress: MobileProgress, nodeId: string): number {
  const fromRecord = progress.nodeSetsCompleted?.[nodeId]
  if (isG3U1ExamNode(nodeId)) {
    if ((fromRecord ?? 0) >= 1) return 3
    return 0
  }
  if (isPepExamNode(nodeId)) {
    if ((fromRecord ?? 0) >= 1) return 3
    return 0
  }
  if (fromRecord != null) return Math.min(ISLAND_SET_COUNT, fromRecord)
  return progress.completedNodes.includes(nodeId) ? 1 : 0
}

function deriveStatus(
  nodeId: string,
  progress: MobileProgress,
  index: number,
  allIds: string[],
): 'locked' | 'current' | 'completed' | 'reward' {
  if ((progress.nodeSetsCompleted?.[nodeId] ?? 0) >= 1 && nodeId.endsWith('-08')) {
    return 'completed'
  }
  if (progress.completedNodes.includes(nodeId)) {
    return 'completed'
  }
  if (nodeId === progress.currentNodeId) return 'current'
  const curIdx = allIds.indexOf(progress.currentNodeId)
  if (curIdx >= 0 && index <= curIdx + 1) {
    return index === curIdx + 1 ? 'current' : 'locked'
  }
  if (index === 0) return 'current'
  return 'locked'
}

function buildG3u1Unit(progress: MobileProgress): Unit {
  const nodeDefs = G3U1_ISLANDS.map(island => ({
    id: island.id,
    unitId: G3U1_UNIT_ID,
    title: island.title,
    subtitle: island.subtitle,
    kind: island.kind,
    xp: island.xp,
  }))
  const allIds = nodeDefs.map(n => n.id)
  return {
    id: G3U1_UNIT_ID,
    title: G3UP_U1_TITLE,
    emoji: '👋',
    color: unitColor(1),
    nodes: nodeDefs.map((n, i) => ({
      ...n,
      status: deriveStatus(n.id, progress, allIds.indexOf(n.id), allIds),
      setsCompleted: nodeSetsCompleted(progress, n.id),
    })),
  }
}

function buildPepUnit(
  bookId: string,
  unitNum: number,
  title: string,
  subtitle: string,
  emoji: string,
  progress: MobileProgress,
  allBookNodeIds: string[],
): Unit {
  const unitId = `${bookSlug(bookId)}-u${unitNum}`
  const nodeDefs = PEP_ISLAND_TEMPLATE.map(island => ({
    id: pepNodeId(bookId, unitNum, island.index),
    unitId,
    title: island.title,
    subtitle: island.subtitle,
    kind: island.kind,
    xp: island.xp,
  }))

  return {
    id: unitId,
    title,
    emoji,
    color: unitColor(unitNum),
    nodes: nodeDefs.map(n => ({
      ...n,
      status: deriveStatus(
        n.id,
        progress,
        allBookNodeIds.indexOf(n.id),
        allBookNodeIds,
      ),
      setsCompleted: nodeSetsCompleted(progress, n.id),
    })),
  }
}

/** 按册构建练习地图单元（三上含 G3U1 Unit1 + 词表单元） */
export function buildPepPracticeUnits(bookId: string, progress: MobileProgress): Unit[] {
  const book = getVocabBookData(bookId)
  if (!book || book.units.length === 0) return []

  const allBookNodeIds: string[] = []

  if (bookId === 'g3-1') {
    allBookNodeIds.push(...G3U1_ISLANDS.map(i => i.id))
    for (const u of book.units) {
      if (u.unit === 1) continue
      for (const island of PEP_ISLAND_TEMPLATE) {
        allBookNodeIds.push(pepNodeId(bookId, u.unit, island.index))
      }
    }
  } else {
    for (const u of book.units) {
      for (const island of PEP_ISLAND_TEMPLATE) {
        allBookNodeIds.push(pepNodeId(bookId, u.unit, island.index))
      }
    }
  }

  const units: Unit[] = []

  if (bookId === 'g3-1') {
    units.push(buildG3u1Unit(progress))
  }

  for (const u of book.units) {
    if (bookId === 'g3-1' && u.unit === 1) continue
    const displayTitle = u.subtitle && u.subtitle !== `${u.words.length} 个词`
      ? `Unit ${u.unit} · ${u.subtitle}`
      : u.title
    units.push(buildPepUnit(
      bookId,
      u.unit,
      displayTitle,
      u.subtitle,
      u.emoji,
      progress,
      allBookNodeIds,
    ))
  }

  return units
}

export function defaultNodeIdForBook(bookId: string): string {
  if (bookId === 'g3-1') return 'g3u1-01'
  const book = getVocabBookData(bookId)
  if (!book?.units[0]) return 'g3u1-01'
  return pepNodeId(bookId, book.units[0].unit, 1)
}

export function resolveCurrentNodeForBook(progress: MobileProgress, bookId: string): string {
  const units = buildPepPracticeUnits(bookId, progress)
  const ids = units.flatMap(u => u.nodes.map(n => n.id))
  if (ids.includes(progress.currentNodeId)) return progress.currentNodeId
  const firstCurrent = units.flatMap(u => u.nodes).find(n => n.status === 'current')
  return firstCurrent?.id ?? defaultNodeIdForBook(bookId)
}
