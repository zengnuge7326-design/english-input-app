import type { QuestionData } from '../types'

/** Fisher-Yates 洗牌 */
export function shuffleArray<T>(arr: readonly T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function shuffleIndexedOptions<T>(options: T[], answerIndex: number): { options: T[]; answerIndex: number } {
  if (options.length <= 1) return { options: [...options], answerIndex }
  const tagged = options.map((opt, i) => ({ opt, i }))
  const shuffled = shuffleArray(tagged)
  return {
    options: shuffled.map(x => x.opt),
    answerIndex: shuffled.findIndex(x => x.i === answerIndex),
  }
}

/** 单次练习内随机选项顺序，正确答案标记随选项一起移动 */
export function randomizeQuestionOptions(q: QuestionData): QuestionData {
  const copy = structuredClone(q)

  switch (copy.type) {
    case 'choice':
      copy.options = shuffleArray(copy.options)
      break
    case 'listening':
      copy.options = shuffleArray(copy.options).map((opt, i) => ({ ...opt, id: String(i) }))
      break
    case 'phonicsPick': {
      const r = shuffleIndexedOptions(copy.options, copy.answerIndex)
      copy.options = r.options
      copy.answerIndex = r.answerIndex
      break
    }
    case 'storyListen':
      copy.steps = copy.steps.map(step => {
        if (step.kind === 'choice') {
          const r = shuffleIndexedOptions(step.options, step.answerIndex)
          return { ...step, options: r.options, answerIndex: r.answerIndex }
        }
        if (step.kind === 'wordPick') {
          return { ...step, options: shuffleArray(step.options) }
        }
        return step
      })
      break
    case 'aichat':
      copy.lines = copy.lines.map(line => {
        if (line.speaker === 'You' && line.choices?.length) {
          return { ...line, choices: shuffleArray(line.choices) }
        }
        return line
      })
      break
    case 'ordering':
      if (copy.tokens.length > 1) copy.tokens = shuffleArray(copy.tokens)
      if (copy.distractors?.length) copy.distractors = shuffleArray(copy.distractors)
      break
    default:
      break
  }

  return copy
}

export function randomizeLessonQuestions(questions: QuestionData[]): QuestionData[] {
  return questions.map(randomizeQuestionOptions)
}
