import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { avatarRoleFromChatSpeaker } from '../data/quizIconMap'
import type { AIChatQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizAvatar from './QuizAvatar'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: AIChatQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

function isNpcSpeaker(speaker: string) {
  return speaker !== 'You'
}

function collectNpcTexts(lines: AIChatQuestionData['lines']) {
  return lines.filter(l => isNpcSpeaker(l.speaker) && l.text.trim()).map(l => l.text)
}

export default function AIChatMock({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  const { speak, prefetch, stop } = useMobileTTS()
  const [lineIdx, setLineIdx] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [playing, setPlaying] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const line = data.lines[lineIdx]
  const atEnd = lineIdx >= data.lines.length
  const finished = done || atEnd

  useEffect(() => {
    prefetch(collectNpcTexts(data.lines))
  }, [data.lines, prefetch])

  useEffect(() => {
    if (done) return
    const current = data.lines[lineIdx]
    if (!current || !isNpcSpeaker(current.speaker) || !current.text.trim()) {
      setPlaying(false)
      return
    }

    const t = setTimeout(() => {
      setPlaying(true)
      speak(current.text)
      setTimeout(() => setPlaying(false), 1400)
    }, 320)

    return () => {
      clearTimeout(t)
      stop()
      setPlaying(false)
    }
  }, [lineIdx, done, data.lines, speak, stop])

  useEffect(() => {
    const container = chatRef.current
    const active = activeLineRef.current
    if (!container) return

    const anchorActiveTurn = () => {
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'end' })
        return
      }
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    }

    anchorActiveTurn()
    const raf = requestAnimationFrame(anchorActiveTurn)
    const t = window.setTimeout(anchorActiveTurn, 180)
    const t2 = window.setTimeout(anchorActiveTurn, 420)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [lineIdx, history.length, done, playing, finished])

  function replayNpc(text: string) {
    setPlaying(true)
    speak(text)
    setTimeout(() => setPlaying(false), 1400)
  }

  function pickChoice(choice: string) {
    setHistory(h => [...h, choice])
    const next = lineIdx + 1
    if (next >= data.lines.length) {
      setLineIdx(next)
      setDone(true)
    } else {
      setLineIdx(next)
    }
  }

  function finish() {
    onAnswer(true)
  }

  const showSubmit = finished || (line && !line.choices)

  function advance() {
    if (finished) {
      finish()
      return
    }
    const next = lineIdx + 1
    if (next >= data.lines.length) {
      setLineIdx(next)
      setDone(true)
    } else {
      setLineIdx(next)
    }
  }

  return (
    <QuestionShell
      layout="aichat"
      lessonTitle={lessonTitle}
      title="对话练习"
      subtitle={data.scene}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[lineIdx, finished, history.length]}
      prompt={
        <div
          ref={chatRef}
          className="mobile-quiz__card mobile-quiz__chat-scroll w-full flex-1 min-h-0 overflow-y-auto"
        >
          <div className="mobile-quiz__chat-inner flex flex-col gap-2">
          {data.lines.slice(0, lineIdx).map((l, i) => {
            let youIdx = 0
            for (let j = 0; j < i; j++) if (data.lines[j].speaker === 'You') youIdx++
            const youText = l.speaker === 'You' ? (history[youIdx] || l.text) : l.text
            return (
              <div key={i} className={`flex gap-2 items-start ${l.speaker === 'You' ? 'flex-row-reverse' : ''}`}>
                <QuizAvatar
                  role={avatarRoleFromChatSpeaker(l.speaker)}
                  speaker={l.speaker}
                  size={24}
                />
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium
                  ${l.speaker === 'You' ? 'bg-[#4ecdc4] text-white' : 'bg-white/15 text-white'}`}>
                  {youText}
                </div>
              </div>
            )
          })}
          {!finished && line && (
            <motion.div
              ref={activeLineRef}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mobile-quiz__chat-active-turn flex gap-2 items-start ${line.speaker === 'You' ? 'flex-row-reverse' : ''}`}
            >
              <QuizAvatar
                role={avatarRoleFromChatSpeaker(line.speaker)}
                speaker={line.speaker}
                size={24}
              />
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium flex items-center gap-2
                ${line.speaker === 'You' ? 'bg-[#4ecdc4]/30 text-white' : 'bg-white/15 text-white'}
                ${playing && isNpcSpeaker(line.speaker) ? 'ring-2 ring-[#f5b942]/60' : ''}`}>
                <span className="flex-1 min-w-0">{line.text || '请选择回复：'}</span>
                {isNpcSpeaker(line.speaker) && line.text && (
                  <button
                    type="button"
                    onClick={() => replayNpc(line.text)}
                    className={`shrink-0 text-base leading-none p-1 rounded-lg
                      ${playing ? 'opacity-100' : 'opacity-70'}`}
                    aria-label="重播"
                  >
                    <QuizPlayButton size={16} active={playing} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
          </div>
        </div>
      }
      interact={
        !finished && line?.choices ? (
          <div className="flex flex-col gap-3">
            {line.choices.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => pickChoice(c)}
                className="mobile-quiz__option mobile-quiz__option--idle w-full text-left border-2"
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <div className="mobile-quiz__text-muted text-center text-sm py-4">
            {finished ? '对话完成！点下方继续' : playing ? '播放中…' : '听对方说完后点继续'}
          </div>
        )
      }
      onEnterSubmit={showSubmit ? advance : undefined}
      submit={
        showSubmit ? (
          <MobileSubmitButton onClick={advance}>
            {finished ? '完成对话' : '继续'}
          </MobileSubmitButton>
        ) : undefined
      }
    />
  )
}
