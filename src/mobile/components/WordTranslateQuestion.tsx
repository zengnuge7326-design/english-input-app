import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { matchWord, useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { WordTranslateCard, WordTranslateQuestionData } from '../types'
import QuizPromptVisual from './QuizPromptVisual'
import QuestionShell from './QuestionShell'
import MicHelpLink from './MicHelpLink'
import { showMicGuide } from '../../utils/micGate'

interface Props {
  data: WordTranslateQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

const DECK_PEEK_X = 5
const DECK_PEEK_Y = 11
const AUTO_LISTEN_DELAY_MS = 480

function MicDots({ active }: { active?: boolean }) {
  return (
    <span className={`mobile-quiz__word-mic-dots${active ? ' mobile-quiz__word-mic-dots--active' : ''}`} aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <span
          key={i}
          className="mobile-quiz__word-mic-dot"
          style={active ? { animationDelay: `${i * 0.08}s` } : undefined}
        />
      ))}
    </span>
  )
}

function cardTargets(card: WordTranslateCard) {
  return [card.answer, ...(card.aliases || [])]
}

function checkAnswer(card: WordTranslateCard, text: string, alts?: string[]) {
  const heard = alts?.length ? alts : [text]
  return cardTargets(card).some(t => matchWord(t, heard))
}

export default function WordTranslateQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
}: Props) {
  const cards = data.cards
  const { speak, prefetch } = useMobileTTS()
  const { supported, listening, heard, listen, stop } = useSpeechRecognition()
  const [cardIdx, setCardIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const [exiting, setExiting] = useState(false)
  const failsRef = useRef(0)
  const doneRef = useRef(false)
  const correctCountRef = useRef(0)
  const cardIdxRef = useRef(cardIdx)
  const autoListenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startListenRef = useRef<() => void>(() => {})
  /** 首次须用户点击麦克风（浏览器要求用户手势才能唤起麦克风/语音识别） */
  const [micReady, setMicReady] = useState(false)

  cardIdxRef.current = cardIdx
  const current = cards[cardIdx]
  const remaining = cards.length - cardIdx
  const deckDone = cardIdx >= cards.length

  useEffect(() => {
    const all = cards.flatMap(cardTargets)
    prefetch(all)
    return () => stop()
  }, [cards, prefetch, stop])

  useEffect(() => {
    failsRef.current = 0
    setPhase('idle')
    setMsg('')
    setExiting(false)
  }, [cardIdx])

  function clearAutoListen() {
    if (autoListenTimerRef.current) {
      clearTimeout(autoListenTimerRef.current)
      autoListenTimerRef.current = null
    }
  }

  function scheduleAutoListen(delay = AUTO_LISTEN_DELAY_MS) {
    clearAutoListen()
    autoListenTimerRef.current = setTimeout(() => {
      startListenRef.current()
    }, delay)
  }

  const finishDeck = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    clearAutoListen()
    stop()
    const pass = correctCountRef.current >= Math.ceil(cards.length / 2)
    onAnswer(pass)
  }, [cards.length, onAnswer, stop])

  const advanceCard = useCallback((wasCorrect: boolean) => {
    if (wasCorrect) correctCountRef.current += 1
    clearAutoListen()
    stop()
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      const next = cardIdxRef.current + 1
      if (next >= cards.length) finishDeck()
      else setCardIdx(next)
    }, 380)
  }, [cards.length, finishDeck, stop])

  const startListen = useCallback(() => {
    if (doneRef.current || cardIdxRef.current >= cards.length) return
    const card = cards[cardIdxRef.current]
    if (!card) return

    clearAutoListen()
    setPhase('listening')
    setMsg('')
    listen({
      onResult: (text, alts) => {
        if (doneRef.current) return
        const active = cards[cardIdxRef.current]
        if (!active) return
        const ok = checkAnswer(active, text, alts)
        if (ok) {
          setPhase('success')
          setMsg('✓ 说对了！')
          setTimeout(() => advanceCard(true), 500)
        } else {
          failsRef.current += 1
          if (failsRef.current >= 3) {
            setPhase('fail')
            setMsg(`听到「${text || '…'}」· 下一张`)
            setTimeout(() => advanceCard(false), 700)
          } else {
            setPhase('idle')
            setMsg(`听到「${text || '…'}」再来 (${failsRef.current}/3)`)
            scheduleAutoListen(700)
          }
        }
      },
      onError: (err) => {
        if (doneRef.current) return
        if (err === 'aborted') return
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPhase('idle')
          setMsg('请允许麦克风权限后点一下麦克风')
          return
        }
        if (err === 'unsupported') {
          setPhase('idle')
          setMsg('请用 Chrome 浏览器')
          return
        }
        if (err === 'no-speech') {
          failsRef.current += 1
          if (failsRef.current >= 3) {
            setPhase('fail')
            setMsg('没听到声音，下一张')
            setTimeout(() => advanceCard(false), 700)
          } else {
            setPhase('idle')
            setMsg(`大声点！(${failsRef.current}/3)`)
            scheduleAutoListen(700)
          }
          return
        }
        failsRef.current += 1
        if (failsRef.current >= 3) {
          setPhase('fail')
          setMsg('识别出错，下一张')
          setTimeout(() => advanceCard(false), 700)
        } else {
          setPhase('idle')
          setMsg(`识别出错，再试 (${failsRef.current}/3)`)
          scheduleAutoListen(700)
        }
      },
    })
  }, [advanceCard, cards, listen])

  const handleMicTap = useCallback(() => {
    if (!supported) {
      showMicGuide({ purpose: '跟读练习' })
      return
    }
    setMicReady(true)
    startListen()
  }, [supported, startListen])


  startListenRef.current = handleMicTap

  useEffect(() => {
    if (deckDone || exiting || !current || !supported || !micReady) return
    scheduleAutoListen()
    return clearAutoListen
  }, [cardIdx, deckDone, exiting, current?.wordZh, supported])

  useEffect(() => () => clearAutoListen(), [])

  function replayHint() {
    if (current) speak(current.answer, 0.88)
  }

  function skip() {
    if (!doneRef.current) {
      doneRef.current = true
      clearAutoListen()
      stop()
      onAnswer(false)
    }
  }

  const isListening = listening || phase === 'listening'
  const canManualListen = !deckDone && phase !== 'success' && !isListening && !exiting

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      subtitle={deckDone ? undefined : `卡片 ${cardIdx + 1} / ${cards.length}`}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[cardIdx, phase, msg, listening, exiting, remaining]}
      prompt={
        <div
          className="mobile-quiz__word-deck w-full"
          style={{
            paddingTop: `${Math.max(0, remaining - 1) * DECK_PEEK_Y}px`,
            paddingRight: `${Math.max(0, remaining - 1) * DECK_PEEK_X}px`,
          }}
        >
          <AnimatePresence mode="popLayout">
            {!deckDone && cards.slice(cardIdx).map((card, i) => {
              const isTop = i === 0
              const depth = i
              return (
                <motion.div
                  key={`${cardIdx}-${card.wordZh}`}
                  layout
                  animate={
                    isTop && exiting
                      ? { opacity: 0, x: 80, y: 0, rotate: 8, scale: 0.9 }
                      : {
                          opacity: 1 - depth * 0.06,
                          x: depth * DECK_PEEK_X,
                          y: -depth * DECK_PEEK_Y,
                          rotate: 0,
                          scale: 1,
                        }
                  }
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className={`mobile-quiz__word-card-layer
                    ${isTop ? 'mobile-quiz__word-card-layer--top' : 'mobile-quiz__word-card-layer--back'}`}
                  style={{ zIndex: remaining - depth }}
                  initial={
                    isTop && cardIdx > 0
                      ? { opacity: 0, x: 0, y: 16, rotate: 0, scale: 0.96 }
                      : {
                          opacity: 1 - depth * 0.06,
                          x: depth * DECK_PEEK_X,
                          y: -depth * DECK_PEEK_Y,
                          rotate: 0,
                          scale: 1,
                        }
                  }
                >
                  <div className={`mobile-quiz__word-card
                    ${isTop && phase === 'success' ? 'mobile-quiz__word-card--success' : ''}
                    ${isTop && phase === 'fail' ? 'mobile-quiz__word-card--fail' : ''}
                    ${!isTop ? 'mobile-quiz__word-card--peek' : ''}`}>
                    <QuizPromptVisual
                      iconKey={card.iconKey}
                      emoji={card.emoji}
                      zh={card.wordZh}
                      size={40}
                    />
                    <p className="mobile-quiz__word-card-zh">{card.wordZh}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      }
      interact={
        <div className="flex flex-col gap-4 w-full">
          {(!supported || msg.includes('麦克风')) && (
            <MicHelpLink purpose="跟读练习" className="text-center block" />
          )}
          <div className="flex items-stretch gap-2 w-full">
            <motion.button
              type="button"
              whileTap={canManualListen ? { scale: 0.98 } : undefined}
              onClick={handleMicTap}
              disabled={!canManualListen && !isListening}
              className={`mobile-quiz__word-mic-bar flex-1
                ${isListening ? 'mobile-quiz__word-mic-bar--active' : ''}
                ${phase === 'success' ? 'mobile-quiz__word-mic-bar--success' : ''}
                disabled:opacity-45`}
              aria-label={isListening ? '正在听' : '重新说话'}
            >
              {phase === 'success' ? (
                <span className="mobile-quiz__text-xl font-black">✓</span>
              ) : (
                <MicDots active={isListening} />
              )}
            </motion.button>
            <button
              type="button"
              onClick={replayHint}
              disabled={!current || exiting}
              className="mobile-quiz__word-replay-btn shrink-0 disabled:opacity-40"
              aria-label="听示范发音"
            >
              ↻
            </button>
          </div>
          <p className={`text-center text-sm font-semibold px-2 min-h-[1.25em]
            ${phase === 'success' ? 'text-[#6ee7b7]' : phase === 'fail' ? 'text-[#fbbf24]' : 'mobile-quiz__text-muted'}`}>
            {!supported && '当前设备不支持网页跟读，请用电脑 Chrome'}
            {supported && !msg && isListening && '正在听你说…'}
            {supported && !msg && !isListening && !exiting && (micReady ? '请直接说出英文单词' : '点一下麦克风，允许权限后开始跟读')}
            {msg}
          </p>
          {listening && heard && (
            <p className="mobile-quiz__text-muted text-xs text-center">
              听到：<span className="font-mono font-bold text-white">{heard}</span>
            </p>
          )}
          <button
            type="button"
            onClick={skip}
            className="mobile-quiz__dictation-skip text-center mobile-quiz__text-muted py-1"
            style={{ fontSize: '0.875em' }}
          >
            现在不做口语题
          </button>
        </div>
      }
    />
  )
}
