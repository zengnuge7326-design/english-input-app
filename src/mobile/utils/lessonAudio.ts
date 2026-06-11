import type { Lesson } from '../types'

export function collectLessonAudioTexts(lesson: Lesson): string[] {
  const texts: string[] = []
  for (const q of lesson.questions) {
    if (q.type === 'storyListen') {
      for (const step of q.steps) {
        if (step.kind === 'listen') texts.push(step.audioText)
        if (step.kind === 'trueFalse' && step.replayText) texts.push(step.replayText)
      }
    }
    if (q.type === 'phonicsPick') texts.push(q.audioWord)
    if (q.type === 'phonicsSameDiff') {
      texts.push(q.wordA, q.wordB)
    }
    if (q.type === 'phonicsRepeat') texts.push(q.word)
    if (q.type === 'matching') {
      for (const pair of q.pairs) texts.push(pair.audioText)
    }
    if (q.type === 'listening') texts.push(q.audioLabel)
    if (q.type === 'dictation') texts.push(q.audioText)
    if (q.type === 'speaking') texts.push(q.sentence)
    if (q.type === 'wordTranslate') {
      for (const card of q.cards) {
        texts.push(card.answer)
        if (card.aliases) texts.push(...card.aliases)
      }
    }
    if (q.type === 'aichat') {
      for (const line of q.lines) {
        if (line.speaker !== 'You' && line.text) texts.push(line.text)
      }
    }
  }
  return [...new Set(texts.filter(Boolean))]
}
