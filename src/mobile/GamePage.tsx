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

export default function GamePage({ onStartDefender }: Props) {
  const levels = useMemo(buildLevels, [])
  const [passed, setPassed] = useState<Set<string>>(loadPassed)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // 监听通关事件：WordDefenderGame 完成后由 MobileLearnApp 写入 localStorage，
  // 这里在每次进入游戏中心时重新读取一次即可覆盖大多数场景。
  // （切换 tab 会重新挂载该组件，足够触发刷新）

  const grouped = useMemo(() => {
    const byBook = new Map<string, { bookId: string; bookTitle: string; levels: Level[] }>()
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

  function toggleBook(bookId: string) {
    setExpanded(e => ({ ...e, [bookId]: !e[bookId] }))
  }

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-base font-black text-white">游戏中心</h1>
        <p className="text-xs text-white/50 mt-0.5">边玩边学 · 闯关获取经验</p>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-3">
        {grouped.map((group, gi) => {
          const bookDone = group.levels.every(lv => passed.has(lv.key))
          const bookOpen = expanded[group.bookId] ?? gi === 0
          return (
            <div key={group.bookId} className="game-book-group rounded-2xl overflow-hidden">
              <button
                type="button"
                className="game-book-group__head w-full flex items-center gap-3 px-1 py-2 text-left"
                onClick={() => toggleBook(group.bookId)}
              >
                <span className="text-sm font-black text-white flex-1">{group.bookTitle}</span>
                <span className="text-xs text-white/45">
                  {group.levels.filter(lv => passed.has(lv.key)).length}/{group.levels.length} 关
                  {bookDone ? ' · 已通关' : ''}
                </span>
                <span className={`text-white/40 font-bold transition-transform ${bookOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {bookOpen && (
                <div className="flex flex-col gap-2">
                  {group.levels.map(lv => {
                    const unlocked = isUnlocked(lv.index, lv.key)
                    const done = passed.has(lv.key)
                    return (
                      <button
                        key={lv.key}
                        type="button"
                        className={`game-card game-card--defender${unlocked ? '' : ' game-card--locked'}`}
                        disabled={!unlocked}
                        onClick={() => unlocked && onStartDefender(lv.bookId, lv.unit)}
                      >
                        <div className="game-card__icon">{unlocked ? lv.unit.emoji : '🔒'}</div>
                        <div className="game-card__body">
                          <div className="game-card__title">字母飞船防御战</div>
                          <div className="game-card__sub">{lv.bookTitle} · {lv.unit.title} · {lv.unit.words.length} 词</div>
                          <div className={`game-card__tag${unlocked ? '' : ' game-card__tag--lock'}`}>
                            第 {lv.index} 关 · {done ? '已通关' : unlocked ? '已解锁' : '未解锁'}
                          </div>
                        </div>
                        <span className="game-card__arrow">{unlocked ? '▶' : '🔒'}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
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
