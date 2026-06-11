import { useEffect, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { PhonicsPickQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: PhonicsPickQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function PhonicsPickQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
}: Props) {
  const { speak, prefetch } = useMobileTTS()
  const [picked, setPicked] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')

  useEffect(() => {
    prefetch([data.audioWord])
  }, [data.audioWord, prefetch])

  useEffect(() => {
    const t = setTimeout(() => playAudio(), 450)
    return () => clearTimeout(t)
  }, [data.audioWord]) // eslint-disable-line react-hooks/exhaustive-deps

  function playAudio() {
    setPlaying(true)
    speak(data.audioWord, 0.88)
    setTimeout(() => setPlaying(false), 1000)
  }

  function submit() {
    if (picked === null || feedback !== 'idle') return
    const ok = picked === data.answerIndex
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => onAnswer(ok), ok ? 550 : 900)
  }

  const canSubmit = picked !== null && feedback === 'idle'

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[picked, feedback, playing]}
      prompt={
        <button
          type="button"
          onClick={playAudio}
          className={`mobile-quiz__phonics-play-btn w-full mx-auto
            ${playing ? 'mobile-quiz__phonics-play-btn--active' : ''}`}
          aria-label="播放"
        >
          <QuizPlayButton size={36} active={playing} />
        </button>
      }
      interact={
        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-2 gap-3">
            {data.options.map((opt, i) => {
              const isPicked = picked === i
              const showRight = feedback !== 'idle' && i === data.answerIndex
              const showWrong = feedback === 'wrong' && isPicked
              return (
                <button
                  key={opt.word}
                  type="button"
                  onClick={() => feedback === 'idle' && setPicked(i)}
                  className={`mobile-quiz__phonics-option
                    ${showRight ? 'mobile-quiz__phonics-option--right' : ''}
                    ${showWrong ? 'mobile-quiz__phonics-option--wrong' : ''}
                    ${isPicked && feedback === 'idle' ? 'mobile-quiz__phonics-option--picked' : ''}`}
                >
                  {opt.word}
                </button>
              )
            })}
          </div>
          {feedback !== 'idle' && (
            <p className={`text-center text-sm font-semibold
              ${feedback === 'right' ? 'text-[#6ee7b7]' : 'text-[#ff8a8a]'}`}>
              {data.options[data.answerIndex].word} {data.options[data.answerIndex].ipa}
            </p>
          )}
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
