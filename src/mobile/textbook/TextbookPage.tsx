import { useMemo, useState } from 'react'
import UnitReader from './UnitReader'
import { TEXTBOOK_BOOKS, type TextbookUnit } from './data/sections'
import { JUNIOR_TEXTBOOK_BOOKS, SENIOR_TEXTBOOK_BOOKS } from './data/secondaryBooks'
import GradeCoverIcon from '../components/GradeCoverIcon'
import './textbook.css'

type Level = 'primary' | 'junior' | 'senior'

const LEVELS: { id: Level; label: string }[] = [
  { id: 'primary', label: '小学' },
  { id: 'junior', label: '初中' },
  { id: 'senior', label: '高中' },
]

export default function TextbookPage() {
  const [activeUnit, setActiveUnit] = useState<TextbookUnit | null>(null)
  const [level, setLevel] = useState<Level>('primary')
  // 默认全部收起，铺满一屏；点册名展开该册单元
  const [expandedBook, setExpandedBook] = useState<string>('')

  const books = useMemo(() => {
    if (level === 'junior') return JUNIOR_TEXTBOOK_BOOKS
    if (level === 'senior') return SENIOR_TEXTBOOK_BOOKS
    return TEXTBOOK_BOOKS
  }, [level])

  if (activeUnit) {
    return <UnitReader unit={activeUnit} onBack={() => setActiveUnit(null)} />
  }

  const anyOpen = expandedBook !== ''

  return (
    <div className={`tb-page${anyOpen ? '' : ' tb-page--fill'}`}>
      <header className="tb-page__head tb-page__head--inline">
        <h1 className="tb-page__title">课文</h1>
        <p className="tb-page__sub">原版教材 · 点击单元开始阅读</p>
      </header>

      <div className="tb-page__levels">
        {LEVELS.map(l => (
          <button
            key={l.id}
            type="button"
            onClick={() => { setLevel(l.id); setExpandedBook('') }}
            className={`tb-page__level${level === l.id ? ' tb-page__level--on' : ''}`}
          >{l.label}</button>
        ))}
      </div>

      {books.map((book, i) => {
        const isOpen = expandedBook === book.id
        return (
        <section key={book.id} className={`tb-book${isOpen ? ' tb-book--open' : ' tb-book--collapsed'}`}>
          <button
            type="button"
            className="tb-book__head tb-book__head--toggle"
            onClick={() => setExpandedBook(isOpen ? '' : book.id)}
            aria-expanded={isOpen}
          >
            <span className="tb-book__cover" aria-hidden>
              <GradeCoverIcon index={i} className="tb-book__cover-svg" />
            </span>
            <div className="tb-book__head-text">
              <div className="tb-book__title">{book.title}</div>
            </div>
            <span className="tb-book__chevron" aria-hidden>{isOpen ? '▾' : '▸'}</span>
          </button>
          {isOpen && (
          <div className="tb-book__units">
            {book.units.map(unit => {
              const empty = unit.sections.length === 0
              const sectionCount = unit.sections.length
              const sentenceCount = unit.sections.reduce(
                (n, s) => n + (s.sentences?.length ?? 0), 0,
              )
              return (
                <button
                  key={unit.id}
                  type="button"
                  className={`tb-unit-card${empty ? ' tb-unit-card--empty' : ''}`}
                  onClick={() => !empty && setActiveUnit(unit)}
                  disabled={empty}
                >
                  <div className="tb-unit-card__emoji" aria-hidden>{unit.emoji}</div>
                  <div className="tb-unit-card__body">
                    <div className="tb-unit-card__title">{unit.title}</div>
                    <div className="tb-unit-card__sub">{unit.subtitle}</div>
                    {!empty && (
                      <div className="tb-unit-card__meta">
                        <span>{sectionCount} 章节</span>
                        <span>·</span>
                        <span>{sentenceCount} 句</span>
                      </div>
                    )}
                  </div>
                  <span className="tb-unit-card__arrow" aria-hidden>{empty ? '· · ·' : '›'}</span>
                </button>
              )
            })}
          </div>
          )}
        </section>
        )
      })}
    </div>
  )
}
