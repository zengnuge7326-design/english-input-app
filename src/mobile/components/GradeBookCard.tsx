import type { GradeBook } from '../data/gradeBooks'

interface Props {
  book: GradeBook
  progress: number
  onSelect: (book: GradeBook) => void
}

export default function GradeBookCard({ book, progress, onSelect }: Props) {
  const pct = Math.min(100, Math.max(0, progress))
  const locked = !book.available

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(book)}
      className={`grade-book-card${locked ? ' grade-book-card--locked' : ''}`}
    >
      <div className="grade-book-card__top">
        <h2 className="grade-book-card__title">{book.title}</h2>
        <span className="grade-book-card__badge">
          <span className="grade-book-card__flag" aria-hidden>🇺🇸</span>
          {book.rangeLabel}
        </span>
      </div>
      <div className="grade-book-card__progress" aria-hidden>
        <div className="grade-book-card__progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {locked && <span className="grade-book-card__lock">即将上线</span>}
    </button>
  )
}
