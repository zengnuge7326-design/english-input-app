import { useEffect, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { PhonicsSameDiffQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: PhonicsSameDiffQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function PhonicsSameDiffQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
}: Props) {
  const { speak, prefetch } = useMobileTTS()
  const [picked, setPicked] = useState<boolean | null>(null)
  const [playing, setPlaying] = useState<'a' | 'b' | null>(null)
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')

  useEffect(() => {
    prefetch([data.wordA, data.wordB])
  }, [data.wordA, data.wordB, prefetch])

  function playWord(word: 'a' | 'b') {
    const text = word === 'a' ? data.wordA : data.wordB
    setPlaying(word)
    speak(text, 0.88)
    setTimeout(() => setPlaying(null), 900)
  }

  useEffect(() => {
    const t1 = setTimeout(() => playWord('a'), 500)
    const t2 = setTimeout(() => playWord('b'), 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [data.wordA, data.wordB]) // eslint-disable-line react-hooks/exhaustive-deps

  function pick(value: boolean) {
    if (feedback !== 'idle') return
    setPicked(value)
  }

  function submit() {
    if (picked === null || feedback !== 'idle') return
    const ok = picked === data.sameWord
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
        <div className="mobile-quiz__phonics-dual-audio w-full">
          <button
            type="button"
            onClick={() => playWord('a')}
            className={`mobile-quiz__phonics-dual-row
              ${playing === 'a' ? 'mobile-quiz__phonics-dual-row--active' : ''}`}
          >
            <QuizPlayButton size={20} active={playing === 'a'} />
            <span className="font-bold">{data.wordA}</span>
          </button>
          <button
            type="button"
            onClick={() => playWord('b')}
            className={`mobile-quiz__phonics-dual-row
              ${playing === 'b' ? 'mobile-quiz__phonics-dual-row--active' : ''}`}
          >
            <QuizPlayButton size={20} active={playing === 'b'} />
            <span className="font-bold">{data.wordB}</span>
          </button>
        </div>
      }
      interact={
        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => pick(true)}
              className={`mobile-quiz__phonics-sd-option
                ${picked === true && feedback === 'idle' ? 'mobile-quiz__phonics-sd-option--picked' : ''}
                ${feedback !== 'idle' && data.sameWord ? 'mobile-quiz__phonics-sd-option--right' : ''}
                ${feedback === 'wrong' && picked === true ? 'mobile-quiz__phonics-sd-option--wrong' : ''}`}
            >
              同一个词
            </button>
            <button
              type="button"
              onClick={() => pick(false)}
              className={`mobile-quiz__phonics-sd-option
                ${picked === false && feedback === 'idle' ? 'mobile-quiz__phonics-sd-option--picked' : ''}
                ${feedback !== 'idle' && !data.sameWord ? 'mobile-quiz__phonics-sd-option--right' : ''}
                ${feedback === 'wrong' && picked === false ? 'mobile-quiz__phonics-sd-option--wrong' : ''}`}
            >
              两个不同的词
            </button>
          </div>
          {feedback !== 'idle' && (
            <p className={`text-center text-sm font-semibold
              ${feedback === 'right' ? 'text-[#6ee7b7]' : 'text-[#ff8a8a]'}`}>
              {data.wordA} {data.ipaA} · {data.wordB} {data.ipaB}
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
