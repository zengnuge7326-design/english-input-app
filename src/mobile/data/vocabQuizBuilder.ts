import type { VocabWord } from './unit1Vocab'
import type {
  Lesson,
  ListeningQuestionData,
  MatchingQuestionData,
  QuestionData,
  SpellingQuestionData,
  WordTranslateQuestionData,
} from '../types'

export const VOCAB_MATCHING_PAIRS = 5
const WORD_TRANSLATE_CARDS = 6
const DRILL_PER_SESSION = 6   // 每次练习的听音/拼写题数

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 可复现洗牌，用于练习岛多套装题 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 动态题组：将 words 按组大小分组，循环取出，保证每轮覆盖不同单词
 * groupSize = DRILL_PER_SESSION，多余的末组也保留
 */
function pickWordGroup(words: VocabWord[], groupSize: number, sessionSeed?: number): VocabWord[] {
  if (words.length === 0) return []
  const shuffled = sessionSeed != null ? seededShuffle(words, sessionSeed) : shuffle(words)
  return shuffled.slice(0, Math.min(groupSize, shuffled.length))
}

function pickWordsForMatching(words: VocabWord[], seed?: number): VocabWord[] {
  const shuffled = seed != null ? seededShuffle(words, seed + 1) : shuffle(words)
  const out: VocabWord[] = []
  for (let i = 0; i < VOCAB_MATCHING_PAIRS; i++) {
    out.push(shuffled[i % shuffled.length])
  }
  return out
}

function pickWordsForTranslate(words: VocabWord[], seed?: number): VocabWord[] {
  const shuffled = seed != null ? seededShuffle(words, seed + 2) : shuffle(words)
  return shuffled.slice(0, Math.min(WORD_TRANSLATE_CARDS, words.length))
}

function buildMatching(words: VocabWord[], unitKey: string, seed?: number): MatchingQuestionData {
  const slice = pickWordsForMatching(words, seed)
  return {
    type: 'matching',
    id: `${unitKey}-match`,
    prompt: '选择配对',
    pairs: slice.map((w, i) => ({
      id: `${unitKey}-mp${i}`,
      audioText: w.en,
      labelZh: w.zh,
    })),
  }
}

function buildWordTranslate(words: VocabWord[], unitKey: string, seed?: number): WordTranslateQuestionData {
  const slice = pickWordsForTranslate(words, seed)
  return {
    type: 'wordTranslate',
    id: `${unitKey}-wt`,
    prompt: '翻译单词',
    cards: slice.map(w => ({
      wordZh: w.zh,
      answer: w.en,
    })),
  }
}

function buildListening(word: VocabWord, words: VocabWord[], unitKey: string, idx: number): ListeningQuestionData {
  const others = shuffle(words.filter(w => w.id !== word.id))
  const distractorZh = others.map(w => w.zh)
  const unique = [...new Set([word.zh, ...distractorZh])]
  const options = shuffle(unique.slice(0, Math.min(4, unique.length)))
  return {
    type: 'listening',
    id: `${unitKey}-listen-${idx}`,
    prompt: '听一听，选听到的单词',
    audioLabel: word.en,
    options: options.map((label, j) => ({
      id: String(j),
      label,
      correct: label === word.zh,
    })),
  }
}

function buildSpelling(word: VocabWord, unitKey: string, idx: number): SpellingQuestionData {
  return {
    type: 'spelling',
    id: `${unitKey}-spell-${idx}`,
    prompt: '拼写单词',
    hintZh: word.zh,
    answer: word.en,
  }
}

export type VocabQuizQuestion =
  | WordTranslateQuestionData
  | MatchingQuestionData
  | SpellingQuestionData
  | ListeningQuestionData

export type VocabPreviewType = VocabQuizQuestion['type']

function unitKeyOf(bookId: string, unitLabel: string) {
  return `${bookId}-${unitLabel.replace(/\s+/g, '-').toLowerCase()}`
}

/**
 * 引导页预览：生成该题型的一组题（听音/拼写最多6题，其余1题）
 * 返回空数组表示无法生成
 */
export function buildVocabPreviewQuestions(
  type: VocabPreviewType,
  words: VocabWord[],
  unitLabel: string,
  bookId = 'g3-1',
): QuestionData[] {
  if (words.length === 0) return []
  const unitKey = unitKeyOf(bookId, unitLabel)
  switch (type) {
    case 'matching':
      return [buildMatching(words, `${unitKey}-preview`)]
    case 'wordTranslate':
      return [buildWordTranslate(words, `${unitKey}-preview`)]
    case 'listening': {
      const group = pickWordGroup(words, DRILL_PER_SESSION)
      return group.map((w, i) => buildListening(w, words, `${unitKey}-preview`, i))
    }
    case 'spelling': {
      const group = pickWordGroup(words, DRILL_PER_SESSION)
      return group.map((w, i) => buildSpelling(w, `${unitKey}-preview`, i))
    }
    default:
      return []
  }
}

/** @deprecated 使用 buildVocabPreviewQuestions */
export function buildVocabPreviewQuestion(
  type: VocabPreviewType,
  words: VocabWord[],
  unitLabel: string,
  bookId = 'g3-1',
): QuestionData | null {
  const qs = buildVocabPreviewQuestions(type, words, unitLabel, bookId)
  return qs[0] ?? null
}

export const VOCAB_PREVIEW_TYPES: { type: VocabPreviewType; label: string; emoji: string }[] = [
  { type: 'matching', label: '选择配对', emoji: '🔗' },
  { type: 'wordTranslate', label: '口语翻译', emoji: '🎤' },
  { type: 'listening', label: '听音选择', emoji: '👂' },
  { type: 'spelling', label: '拼写单词', emoji: '✏️' },
]

export function buildVocabPracticeLesson(
  words: VocabWord[],
  unitLabel: string,
  bookId = 'g3-1',
  sessionSeed?: number,
): Lesson {
  if (words.length === 0) {
    return {
      id: 'vocab-empty',
      nodeId: 'vocab',
      title: unitLabel,
      questions: [],
    }
  }

  const unitKey = unitKeyOf(bookId, unitLabel)
  const seed = sessionSeed ?? Date.now()
  const listenWords = pickWordGroup(words, DRILL_PER_SESSION, seed + 3)
  const spellWords = pickWordGroup(words, DRILL_PER_SESSION, seed + 4)

  const questions: QuestionData[] = [
    buildMatching(words, unitKey, seed),
    buildWordTranslate(words, unitKey, seed),
    ...listenWords.map((w, i) => buildListening(w, words, unitKey, i)),
    ...spellWords.map((w, i) => buildSpelling(w, unitKey, i)),
  ]

  return {
    id: `vocab-${unitKey}`,
    nodeId: 'vocab-practice',
    title: `单词巩固 · ${unitLabel}`,
    questions,
  }
}

export function collectVocabAudioTexts(words: VocabWord[]): string[] {
  return words.map(w => w.en)
}
