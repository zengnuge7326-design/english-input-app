import { buildVocabPracticeLesson } from '../vocabQuizBuilder'
import { getVocabBookData } from '../vocabBooks'
import type { Lesson } from '../../types'
import { bookIdFromSlug, parsePepNodeId } from './plan'

export function getPepPracticeLesson(nodeId: string, setIndex = 0): Lesson | null {
  const parsed = parsePepNodeId(nodeId)
  if (!parsed) return null

  const bookId = bookIdFromSlug(parsed.bookSlug)
  if (!bookId) return null

  const book = getVocabBookData(bookId)
  if (!book) return null

  const unit = book.units.find(u => u.unit === parsed.unit)
  if (!unit || unit.words.length === 0) return null

  const base = buildVocabPracticeLesson(
    unit.words,
    unit.title,
    bookId,
    setIndex * 17 + parsed.island,
  )

  const setLabel = setIndex === 0 ? '' : ` · 第${setIndex + 1}套`
  const islandLabel = parsed.island === 8 ? '单元检测' : `综合练习 ${parsed.island}`

  return {
    ...base,
    id: `${nodeId}-set${setIndex + 1}`,
    nodeId,
    title: `${unit.title} · ${islandLabel}${setLabel}`,
  }
}
