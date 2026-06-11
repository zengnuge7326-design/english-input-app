import { useState } from 'react'
import type { SpellingQuestionData } from '../types'
import { useMobileTTS } from '../hooks/useMobileTTS'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPromptVisual from './QuizPromptVisual'
import QuestionShell from './QuestionShell'

interface Props {
  data: SpellingQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function SpellingQuestion({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const { speak } = useMobileTTS()

  function submit() {
    if (!value.trim() || feedback !== 'idle') return
    const ok = value.trim().toLowerCase() === data.answer.toLowerCase()
    setFeedback(ok ? 'right' : 'wrong')
    // 答题后朗读正确单词，强化音形对应
    speak(data.answer)
    setTimeout(() => onAnswer(ok), ok ? 700 : 1100)
  }

  return (
    <QuestionShell
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      prompt={
        <div className="mobile-quiz__card w-full text-center">
          <div className="mb-2">
            <QuizPromptVisual iconKey={data.hintIcon} emoji={data.hintEmoji} zh={data.hintZh} />
          </div>
          <div className="mobile-quiz__text-2xl font-black">{data.hintZh}</div>
        </div>
      }
      interact={
        <div className="flex flex-col gap-3">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="输入英文…"
            autoCapitalize="off"
            autoCorrect="off"
            className={`mobile-quiz__option w-full text-center mobile-quiz__text-2xl font-mono border-2 outline-none
              ${feedback === 'right' ? 'border-[#3ecf8e] bg-[#eafff3]' : ''}
              ${feedback === 'wrong' ? 'border-[#ff7b7b] bg-[#fff0f0]' : 'mobile-quiz__option--idle'}`}
          />
          {feedback === 'wrong' && (
            <p className="text-center text-[#ff6b6b] font-semibold text-sm">提示：{data.answer}</p>
          )}
        </div>
      }
      adaptiveDeps={[value, feedback]}
      onEnterSubmit={submit}
      enterSubmitDisabled={!value.trim() || feedback !== 'idle'}
      submit={
        <MobileSubmitButton onClick={submit} disabled={!value.trim() || feedback !== 'idle'}>
          检查拼写
        </MobileSubmitButton>
      }
    />
  )
}
