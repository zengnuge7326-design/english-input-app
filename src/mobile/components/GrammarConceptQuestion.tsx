import { useState } from 'react'
import type { GrammarConceptQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: GrammarConceptQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
  onJudge?: (correct: boolean) => void
}

/**
 * "学"阶段：概念认知题。
 * 选答 → 判定 → 展示解析 → 点「继续」进入下一题（解析需读完，故不自动跳转）。
 */
export default function GrammarConceptQuestion({ data, step, total, lessonTitle, onExit, onAnswer, onJudge }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const ok = picked === data.correctIndex

  function submit() {
    if (picked == null || revealed) return
    onJudge?.(ok)
    setRevealed(true)
  }

  function next() {
    onAnswer(ok)
  }

  return (
    <QuestionShell
      lessonTitle={lessonTitle}
      title={data.prompt}
      subtitle={data.tag}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[picked, revealed]}
      prompt={
        <div className="mobile-quiz__card w-full mobile-quiz__text-lg font-bold text-center leading-relaxed">
          {data.question}
        </div>
      }
      interact={
        <div className="mobile-quiz__interact-inner">
          {data.options.map((opt, i) => {
            const isPicked = picked === i
            const isAnswer = i === data.correctIndex
            let cls = 'mobile-quiz__option--idle'
            if (revealed && isAnswer) cls = 'bg-[#d4f8e8] border-[#3ecf8e]'
            else if (revealed && isPicked && !isAnswer) cls = 'bg-[#ffe0e0] border-[#ff7b7b]'
            else if (isPicked) cls = 'mobile-quiz__option--selected'
            return (
              <button
                key={i}
                type="button"
                onClick={() => !revealed && setPicked(i)}
                className={`mobile-quiz__option w-full border-2 text-left ${cls}`}
              >
                {opt}
              </button>
            )
          })}

          {revealed && (
            <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed border-2
              ${ok ? 'bg-[#eafaf2] border-[#bfe9d4] text-[#2a7d52]' : 'bg-[#fff4f4] border-[#ffd6d6] text-[#b5483f]'}`}>
              <div className="font-black mb-1">{ok ? '✓ 答对了' : '✗ 再记一记'}</div>
              <div className="text-[#3a4656]">{data.explanation}</div>
            </div>
          )}
        </div>
      }
      onEnterSubmit={revealed ? next : submit}
      enterSubmitDisabled={picked == null}
      submit={
        revealed ? (
          <MobileSubmitButton onClick={next}>继续</MobileSubmitButton>
        ) : (
          <MobileSubmitButton onClick={submit} disabled={picked == null}>确认答案</MobileSubmitButton>
        )
      }
    />
  )
}
