import { motion } from 'framer-motion'
import type { BookGrammarInfo } from '../data/bookGrammar'
import type { GradeBook } from '../data/gradeBooks'
import type { MapNode, Unit } from '../types'

interface Props {
  selectedBook: GradeBook
  activeUnit?: Unit
  currentNode?: MapNode
  grammar: BookGrammarInfo
  onOpenPicker: () => void
}

function cardTheme(unitId?: string) {
  if (unitId === 'u2') return 'pink'
  return 'green'
}

export default function LearningPathCard({
  selectedBook,
  activeUnit,
  currentNode,
  grammar,
  onOpenPicker,
}: Props) {
  const unitLabel = activeUnit?.title ?? '学习路径'
  const lessonLabel = currentNode?.title ?? '继续闯关'
  const partLabel = `${selectedBook.title} · 第 1 部分`
  const theme = cardTheme(activeUnit?.id)

  return (
    <div className="learning-path-card-wrap px-4 mb-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={onOpenPicker}
        className={`learning-path-card learning-path-card--${theme} w-full text-left`}
        aria-label="选择学习册"
      >
        <div className="learning-path-card__main">
          <div className="learning-path-card__info min-w-0">
            <p className="learning-path-card__lesson">{partLabel}</p>
          </div>
        </div>
      </motion.button>
    </div>
  )
}
