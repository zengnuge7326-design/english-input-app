import { useCallback, useMemo, useRef, useState } from 'react'
import type { OrderingQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: OrderingQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

interface BankTile {
  id: string
  text: string
  slotIndex: number
}

interface DragState {
  tile: BankTile
  source: 'bank' | 'answer'
  x: number
  y: number
  pointerId: number
}

const DRAG_THRESHOLD = 8
const DROP_PAD = 28
/** ≤4 个词只占第一行，与图一一致 */
const WORDS_PER_LINE = 4

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildTiles(tokens: string[], distractors: string[] = []): BankTile[] {
  return shuffle([...tokens, ...distractors]).map((text, i) => ({
    id: `${text}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    slotIndex: i,
  }))
}

function normalizeSentence(s: string) {
  return s.trim().replace(/\s+/g, ' ')
}

function pointInRect(x: number, y: number, rect: DOMRect, pad = 0) {
  return (
    x >= rect.left - pad
    && x <= rect.right + pad
    && y >= rect.top - pad
    && y <= rect.bottom + pad
  )
}

function splitAnswerRows(answer: BankTile[]) {
  if (answer.length <= WORDS_PER_LINE) {
    return { row1: answer, row2: [] as BankTile[] }
  }
  const cut = Math.ceil(answer.length / 2)
  return { row1: answer.slice(0, cut), row2: answer.slice(cut) }
}

/**
 * 根据落点计算插入索引（在「移除被拖词块之后」的数组中的位置）
 */
function getInsertIndex(
  answerEl: HTMLElement,
  x: number,
  y: number,
  source: 'bank' | 'answer',
  draggingId?: string,
) {
  const rows = Array.from(
    answerEl.querySelectorAll<HTMLElement>('.mobile-quiz__translate-row'),
  )

  let targetRow = rows[0]
  if (rows.length > 1) {
    const r0 = rows[0].getBoundingClientRect()
    const r1 = rows[1].getBoundingClientRect()
    const mid = (r0.bottom + r1.top) / 2
    if (y >= mid) targetRow = rows[1]
  }

  const tiles = Array.from(
    targetRow.querySelectorAll<HTMLElement>('[data-answer-tile]'),
  ).filter(el => el.dataset.tileId !== draggingId)

  for (let i = 0; i < tiles.length; i++) {
    const rect = tiles[i].getBoundingClientRect()
    if (x < rect.left + rect.width / 2) {
      const rowOffset = targetRow === rows[1]
        ? Array.from(rows[0].querySelectorAll('[data-answer-tile]'))
          .filter(el => (el as HTMLElement).dataset.tileId !== draggingId).length
        : 0
      return rowOffset + i
    }
  }

  const row0Count = Array.from(rows[0].querySelectorAll('[data-answer-tile]'))
    .filter(el => (el as HTMLElement).dataset.tileId !== draggingId).length
  if (targetRow === rows[0]) {
    return row0Count
  }
  const row1Count = Array.from(rows[1].querySelectorAll('[data-answer-tile]'))
    .filter(el => (el as HTMLElement).dataset.tileId !== draggingId).length
  return row0Count + row1Count
}

export default function OrderingQuestion({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  const initialTiles = useMemo(
    () => buildTiles(data.tokens, data.distractors),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.id],
  )
  const [bankSlots, setBankSlots] = useState<(BankTile | null)[]>(initialTiles)
  const [answer, setAnswer] = useState<BankTile[]>([])
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [dragging, setDragging] = useState<DragState | null>(null)
  const [hoverZone, setHoverZone] = useState<'answer' | 'bank' | null>(null)

  const answerRef = useRef<HTMLDivElement>(null)
  const bankRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const speaker = data.speaker ?? '👩‍🦳'
  const canSubmit = answer.length > 0 && feedback === 'idle'
  const expected = normalizeSentence(data.answer)
  const { row1, row2 } = splitAnswerRows(answer)

  const pickFromBank = useCallback((slotIndex: number, insertIdx?: number) => {
    if (feedback !== 'idle') return
    setBankSlots(slots => {
      const tile = slots[slotIndex]
      if (!tile) return slots
      setAnswer(prev => {
        const next = prev.filter(t => t.id !== tile.id)
        const idx = insertIdx === undefined ? next.length : Math.max(0, Math.min(insertIdx, next.length))
        next.splice(idx, 0, tile)
        return next
      })
      return slots.map((s, i) => (i === slotIndex ? null : s))
    })
  }, [feedback])

  const removeFromAnswer = useCallback((tile: BankTile) => {
    if (feedback !== 'idle') return
    setAnswer(a => a.filter(t => t.id !== tile.id))
    setBankSlots(slots => {
      const next = [...slots]
      next[tile.slotIndex] = tile
      return next
    })
  }, [feedback])

  const reorderInAnswer = useCallback((tile: BankTile, insertIdx: number) => {
    if (feedback !== 'idle') return
    setAnswer(prev => {
      const fromIdx = prev.findIndex(t => t.id === tile.id)
      if (fromIdx < 0) return prev
      const next = [...prev]
      const [item] = next.splice(fromIdx, 1)
      const to = Math.max(0, Math.min(insertIdx, next.length))
      if (to === fromIdx) return prev
      next.splice(to, 0, item)
      return next
    })
  }, [feedback])

  const resolveDropZone = useCallback((x: number, y: number) => {
    const answerEl = answerRef.current
    const bankEl = bankRef.current
    const boardEl = boardRef.current
    if (!answerEl || !bankEl) return null

    const answerRect = answerEl.getBoundingClientRect()
    const bankRect = bankEl.getBoundingClientRect()

    if (pointInRect(x, y, answerRect, DROP_PAD)) return 'answer' as const
    if (pointInRect(x, y, bankRect, DROP_PAD)) return 'bank' as const

    // 答题区与词库之间的空隙：按纵向位置归入最近区域
    if (boardEl) {
      const boardRect = boardEl.getBoundingClientRect()
      if (pointInRect(x, y, boardRect, 0)) {
        const mid = (answerRect.bottom + bankRect.top) / 2
        return y < mid ? 'answer' : 'bank'
      }
    }
    return null
  }, [])

  const handleDrop = useCallback((x: number, y: number, tile: BankTile, source: 'bank' | 'answer') => {
    const zone = resolveDropZone(x, y)
    if (!zone) {
      setHoverZone(null)
      return
    }

    if (zone === 'answer') {
      const insertIdx = answerRef.current
        ? getInsertIndex(
          answerRef.current,
          x,
          y,
          source,
          source === 'answer' ? tile.id : undefined,
        )
        : answer.length

      if (source === 'bank') {
        pickFromBank(tile.slotIndex, insertIdx)
      } else {
        reorderInAnswer(tile, insertIdx)
      }
    } else if (zone === 'bank' && source === 'answer') {
      removeFromAnswer(tile)
    }

    setHoverZone(null)
  }, [answer.length, pickFromBank, removeFromAnswer, reorderInAnswer, resolveDropZone])

  const updateHoverZone = useCallback((x: number, y: number) => {
    const zone = resolveDropZone(x, y)
    setHoverZone(zone === 'answer' || zone === 'bank' ? zone : null)
  }, [resolveDropZone])

  function startPointer(e: React.PointerEvent, tile: BankTile, source: 'bank' | 'answer') {
    if (feedback !== 'idle') return
    e.preventDefault()
    const pointerId = e.pointerId
    const origin = { x: e.clientX, y: e.clientY }
    let moved = false

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      const dist = Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y)
      if (!moved && dist > DRAG_THRESHOLD) moved = true
      if (moved) {
        setDragging({ tile, source, x: ev.clientX, y: ev.clientY, pointerId })
        updateHoverZone(ev.clientX, ev.clientY)
      }
    }

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
      if (moved) {
        handleDrop(ev.clientX, ev.clientY, tile, source)
        setDragging(null)
      } else if (source === 'bank') {
        pickFromBank(tile.slotIndex)
      } else {
        removeFromAnswer(tile)
      }
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
  }

  function submit() {
    if (!canSubmit) return
    const built = normalizeSentence(answer.map(t => t.text).join(' '))
    const ok = built === expected
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => onAnswer(ok), ok ? 500 : 800)
  }

  function tileClass(tile: BankTile, isPlaced: boolean) {
    const isGhost = dragging?.tile.id === tile.id
    return `mobile-quiz__word-tile select-none touch-none
      ${isPlaced ? 'mobile-quiz__word-tile--on-line' : ''}
      ${isGhost ? 'opacity-25' : ''}`
  }

  function renderWord(tile: BankTile, source: 'bank' | 'answer') {
    return (
      <span
        key={tile.id}
        role="button"
        tabIndex={0}
        data-answer-tile={source === 'answer' ? '' : undefined}
        data-tile-id={tile.id}
        onPointerDown={e => startPointer(e, tile, source)}
        className={tileClass(tile, source === 'answer')}
      >
        {tile.text}
      </span>
    )
  }

  function renderAnswerRow(words: BankTile[], line: 'top' | 'bottom') {
    if (line === 'bottom' && words.length === 0) {
      return (
        <div className="mobile-quiz__translate-row mobile-quiz__translate-row--bottom">
          <div className="mobile-quiz__translate-row-words" />
          <div className="mobile-quiz__translate-slot" />
        </div>
      )
    }
    return (
      <div className={`mobile-quiz__translate-row mobile-quiz__translate-row--${line}`}>
        <div className="mobile-quiz__translate-row-words">
          {words.map(tile => renderWord(tile, 'answer'))}
        </div>
        <div className="mobile-quiz__translate-slot" />
      </div>
    )
  }

  return (
    <>
      <QuestionShell
        layout="compact"
        adaptiveDeps={[answer.length, bankSlots.filter(Boolean).length, answer.map(t => t.id).join(',')]}
        lessonTitle={lessonTitle}
        title={data.prompt}
        step={step}
        total={total}
        onExit={onExit}
        prompt={
          <div className="flex items-start gap-3 w-full">
            <span className="mobile-quiz__speaker shrink-0" aria-hidden>{speaker}</span>
            <div className="mobile-quiz__bubble flex-1 min-w-0 rounded-2xl font-bold leading-snug">
              {data.promptZh}
            </div>
          </div>
        }
        interact={
          <div ref={boardRef} className="mobile-quiz__translate-board">
            <div
              ref={answerRef}
              className={`mobile-quiz__translate-answer
                ${hoverZone === 'answer' ? 'mobile-quiz__translate-answer--hover' : ''}
                ${feedback === 'right' ? 'mobile-quiz__translate-answer--right' : ''}
                ${feedback === 'wrong' ? 'mobile-quiz__translate-answer--wrong' : ''}`}
            >
              {renderAnswerRow(row1, 'top')}
              {renderAnswerRow(row2, 'bottom')}
            </div>

            <div
              ref={bankRef}
              className={`mobile-quiz__translate-bank
                ${hoverZone === 'bank' ? 'mobile-quiz__translate-bank--hover' : ''}`}
            >
              {bankSlots.map((tile, i) => (
                <div key={i} className="mobile-quiz__bank-slot">
                  {tile ? renderWord(tile, 'bank') : (
                    <div className="mobile-quiz__bank-slot--empty" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        }
        onEnterSubmit={submit}
        enterSubmitDisabled={!canSubmit}
        submit={
          <MobileSubmitButton onClick={submit} disabled={!canSubmit}>
            检查
          </MobileSubmitButton>
        }
      />
      {dragging && (
        <div
          className="mobile-quiz__word-tile mobile-quiz__word-tile--floating fixed z-[300] pointer-events-none"
          style={{ left: dragging.x, top: dragging.y, transform: 'translate(-50%, -50%)' }}
        >
          {dragging.tile.text}
        </div>
      )}
    </>
  )
}
