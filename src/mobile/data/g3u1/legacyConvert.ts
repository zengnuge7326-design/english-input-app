import type { QuestionData } from '../../types'
import { iconForZh } from '../quizIconMap'

type QuizItem = {
  question: string
  chinese: string
  options: string[]
  correct: number
}

type FillItem = {
  sentence: string
  answer: string
  chinese: string
}

type ListenWordItem = {
  word: string
  options: string[]
  correct: number
  zh: string
}

type ListenSentenceItem = {
  sentence: string
  zh: string
  options: string[]
  correct: number
}

type ListenOrderItem = {
  sentence: string
  zh: string
  words: string[]
  answer: string[]
}

type ListenResponseItem = {
  question: string
  zh: string
  options: string[]
  correct: number
}

type ListenTranslateItem = {
  sentence: string
  options: string[]
  correct: number
}


export function fromQuizBank(items: QuizItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => {
    const sentence = item.question.includes('___') ? item.question : `${item.question} ___`
    const blankIndex = sentence.split(' ').findIndex(w => w.includes('___'))
    return {
      type: 'choice',
      id: `${prefix}-choice-${i}`,
      prompt: item.chinese,
      sentence,
      blankIndex: Math.max(0, blankIndex),
      options: item.options,
      answer: item.options[item.correct],
    }
  })
}

export function fromFillToTranslate(items: FillItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => {
    const hintMatch = item.sentence.match(/\(([^)]+)\)/)
    const hintWord = hintMatch?.[1] ?? item.chinese.replace(/[。！？]/g, '')
    const template = item.sentence.replace(/\s*\([^)]+\)/, '').trim()
    return {
      type: 'translate',
      id: `${prefix}-tr-${i}`,
      prompt: '完成翻译',
      promptZh: item.chinese,
      hintWord,
      template,
      answer: item.answer,
    }
  })
}

export function fromFillToSpelling(items: FillItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => {
    const hintMatch = item.sentence.match(/\(([^)]+)\)/)
    return {
      type: 'spelling',
      id: `${prefix}-sp-${i}`,
      prompt: '拼写单词',
      hintZh: hintMatch?.[1] ?? item.chinese,
      hintIcon: iconForZh(hintMatch?.[1] ?? item.chinese),
      answer: item.answer,
    }
  })
}

export function fromListenWord(items: ListenWordItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'listening',
    id: `${prefix}-lw-${i}`,
    prompt: '听一听，选听到的单词',
    audioLabel: item.word,
    options: item.options.map((label, j) => ({
      id: String(j),
      label,
      correct: j === item.correct,
    })),
  }))
}

export function fromListenSentence(items: ListenSentenceItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'listening',
    id: `${prefix}-ls-${i}`,
    prompt: '听一听，选正确的句子',
    audioLabel: item.sentence,
    options: item.options.map((label, j) => ({
      id: String(j),
      label,
      correct: j === item.correct,
    })),
  }))
}

export function fromListenOrder(items: ListenOrderItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => {
    const extras = ['book', 'bag', 'pen', 'hello', 'Goodbye', 'too', 'me', 'your']
    const distractors = extras.filter(w => !item.words.includes(w)).slice(0, 2)
    return {
      type: 'ordering',
      id: `${prefix}-ord-${i}`,
      prompt: '翻译这句话',
      promptZh: item.zh,
      tokens: [...item.words],
      distractors,
      answer: item.answer.join(' '),
    }
  })
}

export function fromListenResponse(items: ListenResponseItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'listening',
    id: `${prefix}-lr-${i}`,
    prompt: '听对话，选恰当回应',
    audioLabel: item.question,
    options: item.options.map((label, j) => ({
      id: String(j),
      label,
      correct: j === item.correct,
    })),
  }))
}

export function fromListenTranslate(items: ListenTranslateItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'listening',
    id: `${prefix}-lt-${i}`,
    prompt: '听一听，选正确的中文意思',
    audioLabel: item.sentence,
    options: item.options.map((label, j) => ({
      id: String(j),
      label,
      correct: j === item.correct,
    })),
  }))
}

export function fromListenToDictation(items: ListenSentenceItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'dictation',
    id: `${prefix}-dict-${i}`,
    prompt: '键入你听到的句子',
    audioText: item.sentence,
    answer: item.sentence,
    speaker: '👩‍🏫',
  }))
}

export function fromListenToSpeaking(items: ListenOrderItem[], prefix: string): QuestionData[] {
  return items.map((item, i) => ({
    type: 'speaking',
    id: `${prefix}-spk-${i}`,
    prompt: '跟读这句话',
    sentence: item.answer.join(' ').replace(/\s+([.,!?])/g, '$1'),
  }))
}
