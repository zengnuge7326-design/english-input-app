import { useState } from 'react'
import type { ChoiceQuestionData } from '../types'
import { useMobileTTS } from '../hooks/useMobileTTS'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: ChoiceQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
  onJudge?: (correct: boolean) => void
}

const HAS_EN = /[a-zA-Z]/

export default function ChoiceQuestion({ data, step, total, lessonTitle, onExit, onAnswer, onJudge }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const { speak } = useMobileTTS()
  const parts = data.sentence.split('___')

  function submit() {
    if (!picked || feedback !== 'idle') return
    const ok = picked === data.answer
    onJudge?.(ok)
    setFeedback(ok ? 'right' : 'wrong')
    // 句子含英文 → 朗读填入正确答案后的完整句
    const full = data.sentence.replace('___', data.answer)
    if (HAS_EN.test(full)) speak(full)
    setTimeout(() => onAnswer(ok), HAS_EN.test(full) ? 900 : 600)
  }

  return (
    <QuestionShell
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      prompt={
        <div className="mobile-quiz__card w-full mobile-quiz__text-xl font-bold text-center leading-relaxed">
          {parts[0]}
          <span className={`inline-block min-w-[4.5rem] mx-1 px-2 py-0.5 rounded-lg border-b-4 align-middle
            ${feedback === 'right' ? 'border-[#3ecf8e] text-[#2a9d5c]' : ''}
            ${feedback === 'wrong' ? 'border-[#ff7b7b] text-[#ff6b6b]' : 'border-[#4ecdc4] text-[#3bb3ab]'}`}>
            {picked || '___'}
          </span>
          {parts[1]}
        </div>
      }
      interact={
        <div className="mobile-quiz__interact-inner">
          {data.options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => feedback === 'idle' && setPicked(opt)}
              className={`mobile-quiz__option w-full border-2
                ${picked === opt && feedback === 'right' ? 'bg-[#d4f8e8] border-[#3ecf8e]' : ''}
                ${picked === opt && feedback === 'wrong' ? 'bg-[#ffe0e0] border-[#ff7b7b]' : ''}
                ${picked === opt && feedback === 'idle' ? 'mobile-quiz__option--selected' : ''}
                ${picked !== opt ? 'mobile-quiz__option--idle' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      }
      adaptiveDeps={[picked, feedback]}
      onEnterSubmit={submit}
      enterSubmitDisabled={!picked || feedback !== 'idle'}
      submit={
        <MobileSubmitButton onClick={submit} disabled={!picked || feedback !== 'idle'}>
          确认答案
        </MobileSubmitButton>
      }
    />
  )
}
