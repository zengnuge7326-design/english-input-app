import { useMemo } from 'react'
import { GRADE_BOOKS, getLevelLabel, type GradeBook, type GradeLevel } from '../data/gradeBooks'
import GradeBookCard from './GradeBookCard'

interface Props {
  bookProgress?: Record<string, number>
  onSelect: (book: GradeBook) => void
  onClose?: () => void
  title?: string
}

export default function GradeBookPicker({ bookProgress = {}, onSelect, onClose, title = '英语' }: Props) {
  const groupedBooks = useMemo(() => {
    const order: GradeLevel[] = ['primary', 'junior', 'senior']
    return order.map(level => ({
      level,
      label: getLevelLabel(level),
      books: GRADE_BOOKS.filter(b => b.level === level),
    }))
  }, [])

  return (
    <div className="grade-book-picker flex flex-col min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <header className="grade-book-picker__header shrink-0 px-4 pt-3 pb-4 safe-top">
        <div className="grade-book-picker__header-row">
          {onClose ? (
            <button type="button" onClick={onClose} className="grade-book-picker__close" aria-label="关闭">
              ✕
            </button>
          ) : (
            <span className="grade-book-picker__close-placeholder" aria-hidden />
          )}
          <h1 className="grade-book-picker__title">{title}</h1>
          <span className="grade-book-picker__close-placeholder" aria-hidden />
        </div>
      </header>
      <div className="flex-1 px-4 pb-4 flex flex-col gap-4">
        {groupedBooks.map(group => (
          <section key={group.level} className="flex flex-col gap-3">
            <h2 className="grade-book-picker__level-label">{group.label}</h2>
            {group.books.map(book => (
              <GradeBookCard
                key={book.id}
                book={book}
                progress={bookProgress[book.id] ?? (book.available ? 8 : 0)}
                onSelect={b => {
                  if (b.available) onSelect(b)
                }}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
