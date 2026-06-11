import { getVocabBookData, type VocabUnit } from './data/vocabBooks'
import { getGradeBook } from './data/gradeBooks'
import { DEFAULT_PRACTICE_BOOK_ID } from './data/courseData'

interface Props {
  practiceBookId?: string
  onStartGame: (bookId: string, unit: VocabUnit) => void
}

export default function GamePage({ practiceBookId = DEFAULT_PRACTICE_BOOK_ID, onStartGame }: Props) {
  const book = getGradeBook(practiceBookId)
  const data = getVocabBookData(practiceBookId)
  const units = data?.units.filter(u => u.words.length > 0) ?? []

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-base font-black text-white">单词配对</h1>
        <p className="text-xs text-white/50 mt-0.5">
          {book?.title ?? '选择单元'} · 听音辨义，快速配对
        </p>
      </header>

      <div className="flex-1 overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-2">
        {units.length === 0 ? (
          <p className="text-sm text-white/45 text-center py-8">该册暂无可用词表</p>
        ) : (
          units.map(unit => (
            <button
              key={unit.unit}
              type="button"
              className="mobile-vocab-card flex-1"
              onClick={() => onStartGame(practiceBookId, unit)}
            >
              <div className="mobile-vocab-card__cover">
                <span className="mobile-vocab-card__cover-placeholder" aria-hidden>{unit.emoji}</span>
              </div>
              <div className="mobile-vocab-card__body">
                <span className="mobile-vocab-card__title">{unit.title}</span>
                <span className="mobile-vocab-card__sub">{unit.subtitle}</span>
                <span className="mobile-vocab-card__meta">{unit.words.length} 个词 · 开始游戏</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
