import type { PhonicsIntroQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: PhonicsIntroQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function PhonicsIntroQuestion({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      subtitle={data.subtitle}
      step={step}
      total={total}
      onExit={onExit}
      prompt={
        <div className="w-full">
          <p className="mobile-quiz__phonics-section-title text-center font-bold mobile-quiz__text-muted mb-3">
            元音
          </p>
          <div className="mobile-quiz__phonics-vowel-grid">
            {data.vowels.map((v, i) => (
              <div key={`${v.symbol}-${v.word}-${i}`} className="mobile-quiz__phonics-vowel-card">
                <span className="mobile-quiz__phonics-symbol">/{v.symbol}/</span>
                <span className="mobile-quiz__phonics-example">{v.example}</span>
                <span className="mobile-quiz__phonics-word">{v.word}</span>
              </div>
            ))}
          </div>
        </div>
      }
      interact={<div className="mobile-quiz__text-muted text-center text-sm">本课重点：区分 æ 和 aʊ</div>}
      onEnterSubmit={() => onAnswer(true)}
      submit={
        <MobileSubmitButton onClick={() => onAnswer(true)}>
          开始 +10 经验
        </MobileSubmitButton>
      }
    />
  )
}
