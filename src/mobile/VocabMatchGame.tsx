import { useCallback, useEffect, useMemo, useState } from 'react'
import { VOCAB_VISIBLE_SLOTS, type VocabWord } from './data/unit1Vocab'
import VocabStageProgress from './components/VocabStageProgress'
import QuizPlayButton from './components/QuizPlayButton'
import { useMobileTTS } from './hooks/useMobileTTS'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function WaveBars({ active }: { active?: boolean }) {
  return (
    <span className={`mobile-quiz__match-wave${active ? ' mobile-quiz__match-wave--active' : ''}`} aria-hidden>
      {[0.45, 0.75, 1, 0.6, 0.85].map((h, i) => (
        <span key={i} className="mobile-quiz__match-wave-bar" style={{ height: `${h * 100}%` }} />
      ))}
    </span>
  )
}

interface Slot {
  word: VocabWord
  key: string
}

interface Props {
  words: VocabWord[]
  onComplete: () => void
  onExit: () => void
}

function initBoard(all: VocabWord[]) {
  const shuffled = shuffle(all)
  const active = shuffled.slice(0, VOCAB_VISIBLE_SLOTS)
  const queue = shuffled.slice(VOCAB_VISIBLE_SLOTS)
  return {
    slots: active.map(w => ({ word: w, key: w.id })),
    queue,
    matchedTotal: 0,
  }
}

export default function VocabMatchGame({ words, onComplete, onExit }: Props) {
  const { speak, prefetch } = useMobileTTS()
  const [board, setBoard] = useState(() => initBoard(words))
  const { slots, queue, matchedTotal } = board
  const [pickedEn, setPickedEn] = useState<string | null>(null)
  const [pickedZh, setPickedZh] = useState<string | null>(null)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [removing, setRemoving] = useState<Set<string>>(() => new Set())
  const [playingId, setPlayingId] = useState<string | null>(null)

  const total = words.length
  const enOrder = useMemo(() => shuffle(slots.map(s => s.key)), [slots])
  const zhOrder = useMemo(() => shuffle(slots.map(s => s.key)), [slots])

  useEffect(() => {
    prefetch(words.map(w => w.en))
  }, [words, prefetch])

  const slotMap = useMemo(() => new Map(slots.map(s => [s.key, s.word])), [slots])

  const refillAfterMatch = useCallback((removeKey: string, nextMatched: number) => {
    setRemoving(prev => new Set([...prev, removeKey]))
    setTimeout(() => {
      setBoard(prev => {
        const rest = prev.slots.filter(s => s.key !== removeKey)
        let nextSlots = rest
        let nextQueue = prev.queue
        if (nextQueue.length > 0) {
          const [next, ...tail] = nextQueue
          nextQueue = tail
          nextSlots = [...rest, { word: next, key: `${next.id}-${Date.now()}` }]
        }
        return {
          slots: nextSlots,
          queue: nextQueue,
          matchedTotal: nextMatched,
        }
      })
      setRemoving(prev => {
        const n = new Set(prev)
        n.delete(removeKey)
        return n
      })
      if (nextMatched >= total) {
        setTimeout(onComplete, 500)
      }
    }, 380)
  }, [total, onComplete])

  function playEn(key: string) {
    const w = slotMap.get(key)
    if (!w || removing.has(key)) return
    setPlayingId(key)
    speak(w.en)
    setTimeout(() => setPlayingId(null), 900)
  }

  function tryMatch(enKey: string, zhKey: string) {
    if (removing.size > 0) return
    if (enKey === zhKey) {
      setPickedEn(null)
      setPickedZh(null)
      setWrongFlash(false)
      refillAfterMatch(enKey, matchedTotal + 1)
    } else {
      setWrongFlash(true)
      setTimeout(() => {
        setWrongFlash(false)
        setPickedEn(null)
        setPickedZh(null)
      }, 450)
    }
  }

  function pickEn(key: string) {
    if (removing.has(key)) return
    setPickedEn(key)
    playEn(key)
    if (pickedZh) tryMatch(key, pickedZh)
  }

  function pickZh(key: string) {
    if (removing.has(key)) return
    setPickedZh(key)
    if (pickedEn) tryMatch(pickedEn, key)
  }

  function enClass(key: string) {
    const isPicked = pickedEn === key
    const isRemoving = removing.has(key)
    return [
      'vocab-match__cell vocab-match__cell--en',
      isPicked ? 'vocab-match__cell--picked' : '',
      isRemoving ? 'vocab-match__cell--matched' : '',
      wrongFlash && isPicked ? 'vocab-match__cell--wrong' : '',
    ].filter(Boolean).join(' ')
  }

  function zhClass(key: string) {
    const isPicked = pickedZh === key
    const isRemoving = removing.has(key)
    return [
      'vocab-match__cell vocab-match__cell--zh',
      isPicked ? 'vocab-match__cell--picked' : '',
      isRemoving ? 'vocab-match__cell--matched' : '',
      wrongFlash && isPicked ? 'vocab-match__cell--wrong' : '',
    ].filter(Boolean).join(' ')
  }

  return (
    <div className="vocab-match-game flex flex-col min-h-0 flex-1">
      <header className="vocab-match-game__header shrink-0 px-4 pt-2 pb-3 safe-top">
        <div className="flex items-center gap-3 mb-3">
          <button type="button" onClick={onExit} className="vocab-match-game__close" aria-label="退出">
            ✕
          </button>
          <div className="flex-1">
            <VocabStageProgress matched={matchedTotal} total={total} />
          </div>
        </div>
        <h1 className="text-lg font-black text-white">选择配对</h1>
        <p className="text-xs text-white/50 mt-0.5">
          已完成 {matchedTotal}/{total} · 场上 {slots.length} 组
        </p>
      </header>

      <div className="flex-1 px-4 pb-4 min-h-0 overflow-y-auto">
        <div className="vocab-match__grid">
          <div className="vocab-match__col flex flex-col gap-2">
            {enOrder.map(key => {
              const w = slotMap.get(key)
              if (!w) return null
              return (
                <button
                  key={`en-${key}`}
                  type="button"
                  onClick={() => pickEn(key)}
                  disabled={removing.has(key)}
                  className={enClass(key)}
                >
                  <QuizPlayButton size={18} className="shrink-0" />
                  <WaveBars active={playingId === key} />
                  <span className="sr-only">{w.en}</span>
                </button>
              )
            })}
          </div>
          <div className="vocab-match__col flex flex-col gap-2">
            {zhOrder.map(key => {
              const w = slotMap.get(key)
              if (!w) return null
              return (
                <button
                  key={`zh-${key}`}
                  type="button"
                  onClick={() => pickZh(key)}
                  disabled={removing.has(key)}
                  className={zhClass(key)}
                >
                  {w.zh}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
