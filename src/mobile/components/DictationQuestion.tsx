import { useEffect, useRef, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { useAutoFocus } from '../hooks/useAutoFocus'
import type { DictationQuestionData } from '../types'
import MobileIcon from './MobileIcon'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: DictationQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
  onJudge?: (correct: boolean) => void
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/[^\w\s']/g, '').replace(/\s+/g, ' ')
}

export default function DictationQuestion({ data, step, total, lessonTitle, onExit, onAnswer, onJudge }: Props) {
  const { speak, prefetch } = useMobileTTS()
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [playing, setPlaying] = useState<'normal' | 'slow' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useAutoFocus(inputRef, [data.answer])

  const canSubmit = !!value.trim() && feedback === 'idle'

  useEffect(() => {
    prefetch([data.audioText])
  }, [data.audioText, prefetch])

  function playAudio(rate: number, mode: 'normal' | 'slow') {
    setPlaying(mode)
    speak(data.audioText, rate)
    setTimeout(() => setPlaying(null), 1200)
  }

  function submit() {
    if (!canSubmit) return
    const ok = normalize(value) === normalize(data.answer)
    onJudge?.(ok)
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => onAnswer(ok), ok ? 500 : 900)
  }

  function skip() {
    if (feedback !== 'idle') return
    onAnswer(false)
  }

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[value, feedback, playing]}
      prompt={
        <div className="flex items-start gap-3 w-full">
          <span className="mobile-quiz__speaker shrink-0" aria-hidden>
            <MobileIcon name="user-round" size={40} />
          </span>
          <div className="mobile-quiz__dictation-bubble flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => playAudio(0.92, 'normal')}
                className={`mobile-quiz__dictation-audio-btn flex-1
                  ${playing === 'normal' ? 'mobile-quiz__dictation-audio-btn--active' : ''}`}
                aria-label="正常语速播放"
              >
                <MobileIcon name="volume-2" size={28} />
              </button>
              <button
                type="button"
                onClick={() => playAudio(0.62, 'slow')}
                className={`mobile-quiz__dictation-audio-btn flex-1
                  ${playing === 'slow' ? 'mobile-quiz__dictation-audio-btn--active' : ''}`}
                aria-label="慢速播放"
              >
                <MobileIcon name="turtle" size={28} />
              </button>
            </div>
            <span className="text-center mobile-quiz__text-muted font-semibold" style={{ fontSize: '0.75em' }}>
              {playing ? '播放中…' : '点喇叭播放'}
            </span>
          </div>
        </div>
      }
      interact={
        <div className="flex flex-col gap-3 w-full">
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="使用英语键入"
            autoCapitalize="off"
            autoCorrect="off"
            autoFocus
            spellCheck={false}
            className={`mobile-quiz__dictation-input w-full mobile-quiz__text-xl border-2 outline-none
              ${feedback === 'right' ? 'border-[#3ecf8e]' : ''}
              ${feedback === 'wrong' ? 'border-[#ff7b7b]' : 'border-white/20'}`}
          />
          {feedback === 'wrong' && (
            <p className="text-center text-[#ff8a8a] font-semibold mobile-quiz__text-muted" style={{ fontSize: '0.875em' }}>
              正确答案：{data.answer}
            </p>
          )}
          <button
            type="button"
            onClick={skip}
            className="mobile-quiz__dictation-skip text-center mobile-quiz__text-muted py-1"
            style={{ fontSize: '0.875em' }}
          >
            现在不做听力题
          </button>
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
  )
}
