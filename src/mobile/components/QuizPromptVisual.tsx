import { resolveQuizIcon, type QuizIconName } from '../data/quizIconMap'
import QuizIcon from './QuizIcon'

interface Props {
  iconKey?: QuizIconName
  emoji?: string
  zh?: string
  en?: string
  size?: number
}

/** 拼写/单词卡等大号提示图标 */
export default function QuizPromptVisual({ iconKey, emoji, zh, en, size = 48 }: Props) {
  const name = resolveQuizIcon({ iconKey, emoji, zh, en })
  return (
    <div className="quiz-prompt-visual" aria-hidden>
      <QuizIcon name={name} size={size} variant="prompt" />
    </div>
  )
}
