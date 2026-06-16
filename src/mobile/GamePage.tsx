import { useMemo, useState } from 'react'
import { GRADE_BOOKS } from './data/gradeBooks'
import { getVocabBookData, type VocabUnit } from './data/vocabBooks'

interface Props {
  onStartDefender: (bookId: string, unit: VocabUnit) => void
}

interface Level {
  key: string
  bookId: string
  bookTitle: string
  unit: VocabUnit
  index: number // 全局第几关，从 1 开始
}

interface BookGroup {
  bookId: string
  bookTitle: string
  levels: Level[]
}

const PROGRESS_KEY = 'defender_progress'

function loadPassed(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')
    return new Set(Array.isArray(raw) ? raw : [])
  } catch {
    return new Set()
  }
}

function buildLevels(): Level[] {
  const books = GRADE_BOOKS.filter(b => b.level === 'primary' && b.available)
  const levels: Level[] = []
  for (const book of books) {
    const data = getVocabBookData(book.id)
    if (!data) continue
    for (const unit of data.units) {
      levels.push({
        key: `${book.id}|${unit.unit}`,
        bookId: book.id,
        bookTitle: book.title,
        unit,
        index: levels.length + 1,
      })
    }
  }
  return levels
}

/** 三年级上册 → 三上 */
function shortBookLabel(title: string) {
  return title.replace('年级', '').replace('册', '')
}

type PickerStage = 'closed' | 'book' | 'unit'

export default function GamePage({ onStartDefender }: Props) {
  const levels = useMemo(buildLevels, [])
  const [passed] = useState<Set<string>>(loadPassed)
  const [selected, setSelected] = useState<Level>(levels[0])
  const [pickerStage, setPickerStage] = useState<PickerStage>('closed')
  const [pickedBook, setPickedBook] = useState<BookGroup | null>(null)

  const grouped = useMemo(() => {
    const byBook = new Map<string, BookGroup>()
    for (const lv of levels) {
      if (!byBook.has(lv.bookId)) byBook.set(lv.bookId, { bookId: lv.bookId, bookTitle: lv.bookTitle, levels: [] })
      byBook.get(lv.bookId)!.levels.push(lv)
    }
    return Array.from(byBook.values())
  }, [levels])

  function isUnlocked(globalIndex: number, levelKey: string) {
    if (globalIndex === 1) return true
    if (passed.has(levelKey)) return true
    const prev = levels[globalIndex - 2]
    return !!prev && passed.has(prev.key)
  }

  const selUnlocked = isUnlocked(selected.index, selected.key)
  const selDone = passed.has(selected.key)

  function openPicker() {
    setPickerStage(pickerStage === 'closed' ? 'book' : 'closed')
    setPickedBook(null)
  }

  function pickBook(group: BookGroup) {
    setPickedBook(group)
    setPickerStage('unit')
  }

  function pickUnit(lv: Level) {
    if (!isUnlocked(lv.index, lv.key)) return
    setSelected(lv)
    setPickerStage('closed')
    setPickedBook(null)
  }

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-base font-black text-white">游戏中心</h1>
        <p className="text-xs text-white/50 mt-0.5">边玩边学 · 闯关获取经验</p>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-3">
        <div className="game-card game-card--defender">
          <div className="game-card__icon">{selUnlocked ? selected.unit.emoji : '🔒'}</div>
          <div className="game-card__body">
            <div className="game-card__title">字母飞船防御战</div>
            <div className={`game-card__tag${selUnlocked ? '' : ' game-card__tag--lock'}`}>
              第 {selected.index} 关 · {selDone ? '已通关' : selUnlocked ? '已解锁' : '未解锁'}
            </div>
          </div>
          <div className="game-card__actions">
            <button type="button" className="game-card__pick" onClick={openPicker}>
              选择内容 {pickerStage === 'closed' ? '▾' : '▴'}
            </button>
            <button
              type="button"
              className="game-card__play"
              disabled={!selUnlocked}
              onClick={() => selUnlocked && onStartDefender(selected.bookId, selected.unit)}
            >
              {selUnlocked ? '▶' : '🔒'}
            </button>
          </div>
        </div>

        {pickerStage === 'book' && (
          <div className="game-picker">
            <div className="game-picker__title">选择课本</div>
            <div className="game-picker__grid">
              {grouped.map(g => (
                <button
                  key={g.bookId}
                  type="button"
                  className="game-picker__chip"
                  onClick={() => pickBook(g)}
                >
                  {shortBookLabel(g.bookTitle)}
                </button>
              ))}
            </div>
          </div>
        )}

        {pickerStage === 'unit' && pickedBook && (
          <div className="game-picker">
            <div className="game-picker__title-row">
              <button type="button" className="game-picker__back" onClick={() => setPickerStage('book')}>‹</button>
              <span className="game-picker__title">{pickedBook.bookTitle} · 选择单元</span>
            </div>
            <div className="game-picker__grid">
              {pickedBook.levels.map(lv => {
                const unlocked = isUnlocked(lv.index, lv.key)
                const done = passed.has(lv.key)
                const isSelected = lv.key === selected.key
                return (
                  <button
                    key={lv.key}
                    type="button"
                    disabled={!unlocked}
                    className={`game-picker__chip${unlocked ? '' : ' game-picker__chip--locked'}${isSelected ? ' game-picker__chip--selected' : ''}${done ? ' game-picker__chip--done' : ''}`}
                    onClick={() => pickUnit(lv)}
                  >
                    {unlocked ? lv.unit.title : '🔒'}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function markDefenderLevelPassed(bookId: string, unitNum: number) {
  const key = `${bookId}|${unitNum}`
  const set = loadPassed()
  if (set.has(key)) return
  set.add(key)
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(set))) } catch { /* ignore */ }
}
