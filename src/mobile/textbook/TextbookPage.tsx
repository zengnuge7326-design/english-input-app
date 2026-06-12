import { useState } from 'react'
import UnitReader from './UnitReader'
import { TEXTBOOK_BOOKS, type TextbookUnit } from './data/sections'
import './textbook.css'

export default function TextbookPage() {
  const [activeUnit, setActiveUnit] = useState<TextbookUnit | null>(null)
  // 默认只展开第一册，其余收起。点册名切换。
  const [expandedBook, setExpandedBook] = useState<string>(TEXTBOOK_BOOKS[0]?.id ?? '')

  if (activeUnit) {
    return <UnitReader unit={activeUnit} onBack={() => setActiveUnit(null)} />
  }

  return (
    <div className="tb-page">
      <header className="tb-page__head">
        <h1 className="tb-page__title">课文</h1>
        <p className="tb-page__sub">原版人教 PEP · 点击单元开始阅读</p>
      </header>

      {TEXTBOOK_BOOKS.map(book => {
        const isOpen = expandedBook === book.id
        const unitCount = book.units.length
        const totalSentences = book.units.reduce(
          (n, u) => n + u.sections.reduce((m, s) => m + (s.sentences?.length ?? 0), 0), 0,
        )
        return (
        <section key={book.id} className={`tb-book${isOpen ? ' tb-book--open' : ' tb-book--collapsed'}`}>
          <button
            type="button"
            className="tb-book__head tb-book__head--toggle"
            onClick={() => setExpandedBook(isOpen ? '' : book.id)}
            aria-expanded={isOpen}
          >
            <span className="tb-book__emoji" aria-hidden>{book.emoji}</span>
            <div className="tb-book__head-text">
              <div className="tb-book__title">{book.title}</div>
              <div className="tb-book__sub">{book.subtitle} · {unitCount} 单元 · {totalSentences} 句</div>
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
