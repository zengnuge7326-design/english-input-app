import { useMemo, useState } from 'react'
import { GRADE_BOOKS, getLevelLabel, type GradeLevel } from './data/gradeBooks'
import { getVocabBookData, type VocabUnit } from './data/vocabBooks'

const UNLOCK_COST = 10

type GameId = 'defender' | 'frog' | 'bee'

function unlockKey(game: GameId) { return `${game}_crystal_unlocks` }
function progressKeyOf(game: GameId) { return game === 'defender' ? 'defender_progress' : `${game}_progress` }
function lastPlayedKeyOf(game: GameId) { return game === 'defender' ? 'defender_last_played' : `${game}_last_played` }

function loadSet(key: string): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(raw) ? raw : [])
  } catch { return new Set() }
}
function saveCrystalUnlock(game: GameId, levelKey: string) {
  const s = loadSet(unlockKey(game))
  s.add(levelKey)
  try { localStorage.setItem(unlockKey(game), JSON.stringify([...s])) } catch { /* ignore */ }
}
function saveLastPlayed(game: GameId, key: string) {
  try { localStorage.setItem(lastPlayedKeyOf(game), key) } catch { /* ignore */ }
}
function loadLastPlayedKey(game: GameId): string | null {
  try { return localStorage.getItem(lastPlayedKeyOf(game)) } catch { return null }
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="13,4 7,10 13,16" />
    </svg>
  )
}

function SpaceshipIcon() {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sg-body" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id="sg-flame" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="28" rx="14" ry="10" fill="url(#sg-glow)" />
      <ellipse cx="24" cy="42" rx="5" ry="7" fill="url(#sg-flame)" />
      <ellipse cx="24" cy="40" rx="2.5" ry="3" fill="#fef9c3" opacity="0.9" />
      <path d="M16 30 L5 42 L16 36 Z" fill="#7c3aed" opacity="0.85" />
      <path d="M32 30 L43 42 L32 36 Z" fill="#7c3aed" opacity="0.85" />
      <ellipse cx="24" cy="22" rx="9" ry="17" fill="url(#sg-body)" />
      <ellipse cx="21.5" cy="15" rx="3" ry="8" fill="rgba(255,255,255,0.2)" />
      <ellipse cx="24" cy="18" rx="5.5" ry="6.5" fill="#0284c7" />
      <ellipse cx="23" cy="16.5" rx="3" ry="4" fill="#7dd3fc" opacity="0.8" />
      <path d="M24 4 L16 12 L32 12 Z" fill="#e879f9" />
      <circle cx="6" cy="10" r="1" fill="white" opacity="0.7" />
      <circle cx="42" cy="8" r="1.2" fill="white" opacity="0.8" />
      <circle cx="38" cy="16" r="0.7" fill="white" opacity="0.5" />
    </svg>
  )
}

function BeeIcon() {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" fill="none" aria-hidden>
      <defs>
        <radialGradient id="bi-wing" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="bi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Wings */}
      <ellipse cx="13" cy="18" rx="11" ry="7" fill="url(#bi-wing)" transform="rotate(-20 13 18)" />
      <ellipse cx="35" cy="18" rx="11" ry="7" fill="url(#bi-wing)" transform="rotate(20 35 18)" />
      {/* Body */}
      <ellipse cx="24" cy="28" rx="11" ry="14" fill="url(#bi-body)" stroke="#92400e" strokeWidth="1.5" />
      {/* Stripes */}
      <rect x="13" y="24" width="22" height="4" fill="#1c0a00" opacity="0.28" rx="1" />
      <rect x="13" y="31" width="22" height="4" fill="#1c0a00" opacity="0.28" rx="1" />
      {/* Eyes */}
      <circle cx="20" cy="17" r="3" fill="#fff" stroke="#92400e" strokeWidth="1" />
      <circle cx="28" cy="17" r="3" fill="#fff" stroke="#92400e" strokeWidth="1" />
      <circle cx="21" cy="17" r="1.4" fill="#000" />
      <circle cx="29" cy="17" r="1.4" fill="#000" />
      {/* Stinger */}
      <path d="M24 42 L22 46 L26 46 Z" fill="#78350f" />
      {/* Letter B on body */}
      <text x="24" y="31" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="900" fontFamily="Courier New, monospace" fill="#000" opacity="0.55">B</text>
    </svg>
  )
}

function FrogIcon() {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" fill="none" aria-hidden>
      <defs>
        <radialGradient id="fg-body" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="60%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#689f38" />
        </radialGradient>
      </defs>
      {/* 荷叶 */}
      <ellipse cx="24" cy="40" rx="20" ry="6" fill="#7cb342" stroke="#33691e" strokeWidth="1.5" />
      {/* 身体 */}
      <path d="M24 14 C12 14 7 24 7 31 C7 39 14 43 24 43 C34 43 41 39 41 31 C41 24 36 14 24 14 Z" fill="url(#fg-body)" stroke="#33691e" strokeWidth="2" />
      <ellipse cx="24" cy="34" rx="11" ry="8" fill="#f1f8e9" />
      {/* 眼睛 */}
      <circle cx="16" cy="14" r="7" fill="url(#fg-body)" stroke="#33691e" strokeWidth="2" />
      <circle cx="32" cy="14" r="7" fill="url(#fg-body)" stroke="#33691e" strokeWidth="2" />
      <circle cx="16" cy="13" r="3.4" fill="#fff" /><circle cx="32" cy="13" r="3.4" fill="#fff" />
      <circle cx="17" cy="13.5" r="1.7" fill="#1b2417" /><circle cx="33" cy="13.5" r="1.7" fill="#1b2417" />
      {/* 嘴 */}
      <path d="M18 28 Q24 33 30 28" fill="none" stroke="#33691e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface Props {
  onStartDefender: (bookId: string, unit: VocabUnit) => void
  onStartFrog: (bookId: string, unit: VocabUnit) => void
  onStartBee: (bookId: string, unit: VocabUnit) => void
  onStartAlphabet: () => void
  crystalBalance?: number
  onCrystalSpend?: (color: string, amount: number, reason: string) => Promise<boolean>
}

interface Level {
  key: string
  bookId: string
  bookTitle: string
  unit: VocabUnit
  index: number
}

interface BookGroup {
  bookId: string
  bookTitle: string
  levels: Level[]
}

export function buildLevels(): Level[] {
  const books = GRADE_BOOKS.filter(b => b.available)
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

function shortBookLabel(title: string) {
  return title
    .replace('选择性必修第', '选必')
    .replace('必修第', '必修')
    .replace('一册', '1').replace('二册', '2').replace('三册', '3').replace('四册', '4')
    .replace('年级', '').replace('册', '')
}

type PickerStage = 'closed' | 'book' | 'unit'

const GAME_META: Record<GameId, { title: string; cardClass: string; iconClass: string; Icon: () => React.ReactElement }> = {
  defender: { title: '字母飞船防御战', cardClass: 'game-card--defender', iconClass: 'game-card__icon--ship', Icon: SpaceshipIcon },
  frog: { title: '青蛙跳', cardClass: 'game-card--frog', iconClass: 'game-card__icon--frog', Icon: FrogIcon },
  bee: { title: '单词小蜜蜂', cardClass: 'game-card--bee', iconClass: 'game-card__icon--bee', Icon: BeeIcon },
}

export default function GamePage({ onStartDefender, onStartFrog, onStartBee, onStartAlphabet, crystalBalance = 0, onCrystalSpend }: Props) {
  const levels = useMemo(buildLevels, [])
  const [passed, setPassed] = useState<Record<GameId, Set<string>>>(() => ({
    defender: loadSet(progressKeyOf('defender')),
    frog: loadSet(progressKeyOf('frog')),
    bee: loadSet(progressKeyOf('bee')),
  }))
  const [crystalUnlocks, setCrystalUnlocks] = useState<Record<GameId, Set<string>>>(() => ({
    defender: loadSet(unlockKey('defender')),
    frog: loadSet(unlockKey('frog')),
    bee: loadSet(unlockKey('bee')),
  }))
  const [selected, setSelected] = useState<Record<GameId, Level>>(() => ({
    defender: (loadLastPlayedKey('defender') && levels.find(l => l.key === loadLastPlayedKey('defender'))) || levels[0],
    frog: (loadLastPlayedKey('frog') && levels.find(l => l.key === loadLastPlayedKey('frog'))) || levels[0],
    bee: (loadLastPlayedKey('bee') && levels.find(l => l.key === loadLastPlayedKey('bee'))) || levels[0],
  }))
  const [pickerGame, setPickerGame] = useState<GameId | null>(null)
  const [pickerStage, setPickerStage] = useState<PickerStage>('closed')
  const [pickedBook, setPickedBook] = useState<BookGroup | null>(null)
  const [pendingUnlock, setPendingUnlock] = useState<Level | null>(null)
  const [unlockMsg, setUnlockMsg] = useState('')

  const grouped = useMemo(() => {
    const byBook = new Map<string, BookGroup>()
    for (const lv of levels) {
      if (!byBook.has(lv.bookId)) byBook.set(lv.bookId, { bookId: lv.bookId, bookTitle: lv.bookTitle, levels: [] })
      byBook.get(lv.bookId)!.levels.push(lv)
    }
    return Array.from(byBook.values())
  }, [levels])

  const groupedByLevel = useMemo(() => {
    const order: GradeLevel[] = ['primary', 'junior', 'senior']
    return order.map(level => ({
      level,
      label: getLevelLabel(level),
      books: grouped.filter(g => {
        const book = GRADE_BOOKS.find(b => b.id === g.bookId)
        return book?.level === level
      }),
    })).filter(g => g.books.length > 0)
  }, [grouped])

  function isUnlocked(game: GameId, globalIndex: number, levelKey: string) {
    if (globalIndex === 1) return true
    if (passed[game].has(levelKey)) return true
    if (crystalUnlocks[game].has(levelKey)) return true
    const prev = levels[globalIndex - 2]
    return !!prev && (passed[game].has(prev.key) || crystalUnlocks[game].has(prev.key))
  }

  async function handleLockedClick(game: GameId, lv: Level) {
    if (pendingUnlock?.key !== lv.key) {
      setPendingUnlock(lv); setUnlockMsg(''); return
    }
    if (crystalBalance < UNLOCK_COST) { setUnlockMsg('💎不足，请先获得更多宝石'); return }
    const ok = await onCrystalSpend?.('blue', UNLOCK_COST, 'game_unit_unlock')
    if (ok) {
      saveCrystalUnlock(game, lv.key)
      setCrystalUnlocks(s => ({ ...s, [game]: new Set([...s[game], lv.key]) }))
      setSelected(s => ({ ...s, [game]: lv }))
      setPickerStage('closed'); setPickerGame(null); setPendingUnlock(null)
    } else {
      setUnlockMsg('解锁失败，请重试')
    }
  }

  function openPicker(game: GameId) {
    if (pickerGame === game && pickerStage !== 'closed') {
      setPickerStage('closed'); setPickerGame(null)
    } else {
      setPickerGame(game); setPickerStage('book')
    }
    setPickedBook(null); setPendingUnlock(null)
  }

  function pickBook(group: BookGroup) {
    setPickedBook(group); setPickerStage('unit')
  }

  function pickUnit(game: GameId, lv: Level) {
    if (!isUnlocked(game, lv.index, lv.key)) return
    setSelected(s => ({ ...s, [game]: lv }))
    setPickerStage('closed'); setPickerGame(null); setPickedBook(null)
  }

  function renderCard(game: GameId) {
    const meta = GAME_META[game]
    const sel = selected[game]
    const unlocked = isUnlocked(game, sel.index, sel.key)
    const done = passed[game].has(sel.key)
    const start = game === 'defender' ? onStartDefender : game === 'frog' ? onStartFrog : onStartBee
    return (
      <div className={`game-card ${meta.cardClass}`} key={game}>
        <div className={`game-card__icon ${meta.iconClass}`}><meta.Icon /></div>
        <div className="game-card__body">
          <div className="game-card__title">{meta.title}</div>
          <div className={`game-card__tag${unlocked ? '' : ' game-card__tag--lock'}`}>
            第 {sel.index} 关 · {done ? '已通关' : unlocked ? '已解锁' : '未解锁'}
          </div>
        </div>
        <div className="game-card__actions">
          <button type="button" className="game-card__pick" onClick={() => openPicker(game)}>
            选择内容 {pickerGame === game && pickerStage !== 'closed' ? '▴' : '▾'}
          </button>
          <button
            type="button"
            className="game-card__play"
            disabled={!unlocked}
            onClick={() => { if (unlocked) { saveLastPlayed(game, sel.key); start(sel.bookId, sel.unit) } }}
          >
            {unlocked ? '▶' : '·'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-base font-black text-white">游戏中心</h1>
        <p className="text-xs text-white/50 mt-0.5">边玩边学 · 闯关获取经验</p>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-3">
        {renderCard('defender')}
        {pickerGame === 'defender' && pickerStage !== 'closed' && renderPicker('defender')}
        {renderCard('frog')}
        {pickerGame === 'frog' && pickerStage !== 'closed' && renderPicker('frog')}
        {renderCard('bee')}
        {pickerGame === 'bee' && pickerStage !== 'closed' && renderPicker('bee')}
        {/* 26字母乐园 — 独立游戏，无需选择课本 */}
        <button type="button" className="game-card game-card--alphabet" onClick={onStartAlphabet}>
          <div className="game-card__icon game-card__icon--alphabet" style={{ fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔤</div>
          <div className="game-card__body">
            <div className="game-card__title">26 字母乐园</div>
            <div className="game-card__tag">泡泡 · 怪兽 · 描红 · 3款小游戏</div>
          </div>
          <div className="game-card__actions" style={{ pointerEvents: 'none' }}>
            <span className="game-card__play" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 }}>▶</span>
          </div>
        </button>
      </div>
    </div>
  )

  function renderPicker(game: GameId) {
    if (pickerStage === 'book') {
      return (
        <div className="game-picker">
          <div className="game-picker__title">选择课本</div>
          {groupedByLevel.map(({ level, label, books }) => (
            <div key={level} className="mb-3">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 px-0.5">{label}</div>
              <div className="game-picker__grid">
                {books.map(g => (
                  <button key={g.bookId} type="button" className="game-picker__chip" onClick={() => pickBook(g)}>
                    {shortBookLabel(g.bookTitle)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
    if (pickerStage === 'unit' && pickedBook) {
      return (
        <div className="game-picker">
          <div className="game-picker__title-row">
            <button type="button" className="game-picker__back" onClick={() => { setPickerStage('book'); setPendingUnlock(null) }}>
              <ChevronLeft />
            </button>
            <span className="game-picker__title">{pickedBook.bookTitle} · 选择单元</span>
          </div>
          {pendingUnlock && (
            <div className="game-picker__unlock-bar">
              <span>花 {UNLOCK_COST}💎 解锁「{pendingUnlock.unit.title}」？</span>
              <button type="button" className="game-picker__unlock-confirm" onClick={() => handleLockedClick(game, pendingUnlock)}>确认</button>
              <button type="button" className="game-picker__unlock-cancel" onClick={() => { setPendingUnlock(null); setUnlockMsg('') }}>取消</button>
            </div>
          )}
          {unlockMsg && <div className="game-picker__unlock-msg">{unlockMsg}</div>}
          <div className="game-picker__grid">
            {pickedBook.levels.map(lv => {
              const unlocked = isUnlocked(game, lv.index, lv.key)
              const done = passed[game].has(lv.key)
              const isSelected = lv.key === selected[game].key
              const isPending = pendingUnlock?.key === lv.key
              return (
                <button
                  key={lv.key}
                  type="button"
                  className={`game-picker__chip${unlocked ? '' : ' game-picker__chip--locked'}${isSelected ? ' game-picker__chip--selected' : ''}${done ? ' game-picker__chip--done' : ''}${isPending ? ' game-picker__chip--pending' : ''}`}
                  onClick={() => unlocked ? pickUnit(game, lv) : handleLockedClick(game, lv)}
                >
                  <span>{lv.unit.title}</span>
                  {!unlocked && <span className="game-picker__chip-cost">{UNLOCK_COST}💎</span>}
                </button>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }
}

export function markDefenderLevelPassed(bookId: string, unitNum: number) {
  markGameLevelPassed('defender', bookId, unitNum)
}

export function markFrogLevelPassed(bookId: string, unitNum: number) {
  markGameLevelPassed('frog', bookId, unitNum)
}

export function markBeeLevelPassed(bookId: string, unitNum: number) {
  markGameLevelPassed('bee', bookId, unitNum)
}

function markGameLevelPassed(game: GameId, bookId: string, unitNum: number) {
  const key = `${bookId}|${unitNum}`
  const storeKey = progressKeyOf(game)
  const set = loadSet(storeKey)
  if (set.has(key)) return
  set.add(key)
  try { localStorage.setItem(storeKey, JSON.stringify(Array.from(set))) } catch { /* ignore */ }
}
