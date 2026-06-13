import { useRef, useState } from 'react'
import type { TranslateClozeQuestionData } from '../types'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { useAutoFocus } from '../hooks/useAutoFocus'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: TranslateClozeQuestionData
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

function renderZh(promptZh: string, hintWord?: string) {
  if (!hintWord || !promptZh.includes(hintWord)) {
    return <span>{promptZh}</span>
  }
  const idx = promptZh.indexOf(hintWord)
  const before = promptZh.slice(0, idx)
  const after = promptZh.slice(idx + hintWord.length)
  return (
    <>
      {before}
      <span className="mobile-quiz__translate-zh-hint">{hintWord}</span>
      {after}
    </>
  )
}

export default function TranslateClozeQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
  onJudge,
}: Props) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const { speak } = useMobileTTS()
  const inputRef = useRef<HTMLInputElement>(null)
  useAutoFocus(inputRef, [data.answer])
  const parts = data.template.split('___')
  const canSubmit = !!value.trim() && feedback === 'idle'

  function submit() {
    if (!canSubmit) return
    const ok = normalize(value) === normalize(data.answer)
    onJudge?.(ok)
    setFeedback(ok ? 'right' : 'wrong')
    // 答题后朗读完整英文句（模板填入正确答案）
    speak(data.template.replace('___', data.answer))
    setTimeout(() => onAnswer(ok), ok ? 800 : 1200)
  }

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[value, feedback]}
      prompt={
        <p className="mobile-quiz__translate-zh mobile-quiz__text-xl font-semibold text-center w-full">
          {renderZh(data.promptZh, data.hintWord)}
        </p>
      }
      interact={
        <div className="flex flex-col gap-3 w-full">
          <div
            className={`mobile-quiz__cloze-card w-full mobile-quiz__text-xl font-bold
              ${feedback === 'right' ? 'mobile-quiz__cloze-card--right' : ''}
              ${feedback === 'wrong' ? 'mobile-quiz__cloze-card--wrong' : ''}`}
          >
            <span>{parts[0]}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={e => feedback === 'idle' && setValue(e.target.value)}
              placeholder=""
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus
              spellCheck={false}
              className="mobile-quiz__cloze-blank"
              aria-label="填写缺失的单词"
            />
            {parts[1] && <span>{parts[1]}</span>}
          </div>
          {feedback === 'wrong' && (
            <p className="text-center text-[#ff8a8a] font-semibold mobile-quiz__text-muted" style={{ fontSize: '0.875em' }}>
              正确答案：{data.answer}
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
