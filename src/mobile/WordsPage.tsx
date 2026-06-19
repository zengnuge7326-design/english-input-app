import { useCallback, useState } from 'react'
import { useMobileTTS } from './hooks/useMobileTTS'
import GradeCoverIcon from './components/GradeCoverIcon'
import MobileIcon from './components/MobileIcon'
import { countVocabWords, listVocabBooks, type VocabBookData, type VocabUnit } from './data/vocabBooks'
import { getLevelLabel, type GradeLevel } from './data/gradeBooks'

interface Props {
  bookProgress?: Record<string, number>
  unitProgress?: Record<string, number>
  onStartPractice: (bookId: string, unit: VocabUnit) => void
}

type View =
  | { kind: 'books' }
  | { kind: 'units'; book: VocabBookData }
  | { kind: 'words'; book: VocabBookData; unit: VocabUnit }

export default function WordsPage({ bookProgress = {}, unitProgress = {}, onStartPractice }: Props) {
  const [view, setView] = useState<View>({ kind: 'books' })
  const [level, setLevel] = useState<GradeLevel>('primary')
  const { speak } = useMobileTTS()
  const books = listVocabBooks().filter(({ book }) => book.level === level)

  const playWord = useCallback((word: string) => {
    speak(word, 0.9)
  }, [speak])

  if (view.kind === 'words') {
    const { book, unit } = view
    return (
      <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
        <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top flex items-center gap-3">
          <button
            type="button"
            className="mobile-words-page__back"
            onClick={() => setView({ kind: 'units', book })}
            aria-label="返回单元列表"
          >
            <MobileIcon name="chevron-left" size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black text-white truncate">{unit.title}</h1>
            <p className="text-xs text-white/50 truncate">{unit.subtitle}</p>
          </div>
          <span className="text-sm font-bold text-white/45 shrink-0">{unit.words.length} 词</span>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 min-h-0">
          <div className="grid grid-cols-2 gap-2">
            {unit.words.map(w => (
              <button
                key={w.id}
                type="button"
                className="mobile-words-page__row"
                onClick={() => playWord(w.en)}
              >
                <span className="mobile-words-page__row-speaker" aria-hidden>🔊</span>
                <span className="mobile-words-page__row-text">
                  <span className="mobile-words-page__row-en">{w.en}</span>
                  <span className="mobile-words-page__row-zh">{w.zh}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3 safe-bottom">
          <button
            type="button"
            className="mobile-words-page__start-btn w-full"
            onClick={() => onStartPractice(book.id, unit)}
          >
            开始巩固 <span className="mobile-words-page__xp">+5 经验</span>
          </button>
        </div>
      </div>
    )
  }

  if (view.kind === 'units') {
    const { book } = view
    return (
      <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
        <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top flex items-center gap-3">
          <button
            type="button"
            className="mobile-words-page__back"
            onClick={() => setView({ kind: 'books' })}
            aria-label="返回书目"
          >
            <MobileIcon name="chevron-left" size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black text-white">{book.title}</h1>
            <p className="text-xs text-white/50">选择单元查看词表</p>
          </div>
        </header>

        <div className="flex-1 overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-2">
          {book.units.map(unit => {
            const count = unitProgress[`${book.id}|${unit.unit}`] ?? 0
            const pct = Math.min(100, Math.round((count / 3) * 100))
            return (
            <button
              key={unit.unit}
              type="button"
              className={`mobile-vocab-card flex-1${count >= 3 ? ' mobile-vocab-card--done' : ''}`}
              onClick={() => setView({ kind: 'words', book, unit })}
            >
              <div className="mobile-vocab-card__cover">
                <span className="mobile-vocab-card__cover-placeholder" aria-hidden>{unit.emoji}</span>
              </div>
              <div className="mobile-vocab-card__body">
                <span className="mobile-vocab-card__title">{unit.title}</span>
                <span className="mobile-vocab-card__sub">{unit.subtitle}</span>
                <span className="mobile-vocab-card__meta">{unit.words.length} 个词</span>
              </div>
              <div className="mobile-vocab-card__bar" aria-hidden>
                <div className="mobile-vocab-card__bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-2 pb-2 safe-top">
        <div className="flex gap-2">
          {(['primary', 'junior', 'senior'] as GradeLevel[]).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`mobile-theme-pill${level === l ? ' mobile-theme-pill--active' : ''}`}
            >{getLevelLabel(l)}</button>
          ))}
        </div>
      </header>

      <div className="mobile-words-books-list">
        {books.map(({ book, data }) => {
          const locked = !data || data.units.length === 0 || countVocabWords(data) === 0
          const pct = Math.min(100, Math.max(0, bookProgress[book.id] ?? 0))
          return (
            <button
              key={book.id}
              type="button"
              disabled={locked}
              className={`mobile-vocab-card mobile-vocab-card--book${locked ? ' mobile-vocab-card--locked' : ''}${pct >= 100 ? ' mobile-vocab-card--done' : ''}`}
              onClick={() => data && setView({ kind: 'units', book: data })}
            >
              <div className="mobile-vocab-card__cover">
                <GradeCoverIcon index={book.index - 1} className="mobile-vocab-card__cover-svg" />
              </div>
              <div className="mobile-vocab-card__body">
                <span className="mobile-vocab-card__title">{book.title}</span>
                <span className="mobile-vocab-card__sub">
                  {locked ? '即将上线' : `${data!.units.length} 单元 · ${countVocabWords(data!)} 词`}
                </span>
                {!locked && (
                  <div className="mobile-vocab-card__bar mobile-vocab-card__bar--book" aria-hidden>
                    <div className="mobile-vocab-card__bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
