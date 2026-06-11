import type { QuestionData, QuestionType } from '../../types'
import {
  fromFillToSpelling,
  fromFillToTranslate,
  fromListenOrder,
  fromListenResponse,
  fromListenSentence,
  fromListenToDictation,
  fromListenToSpeaking,
  fromListenTranslate,
  fromListenWord,
  fromQuizBank,
} from './legacyConvert'
import { validateAichatQuestions } from '../aichatConstraints'
import {
  EXTRA_CHOICE,
  EXTRA_DICTATION,
  EXTRA_ORDERING,
  EXTRA_SPEAKING,
  EXTRA_SPELLING,
  EXTRA_TRANSLATE,
  STORY_SCENES,
  buildStoryFromScene,
} from './bankExtras'
import { G3U1_AICHAT_BANK } from './aichatDialogs'
import { assertMatchingQuestion } from '../matchingConstraints'
import { G3U1_CORE_TYPES, G3U1_BANK_SIZE } from './plan'
import { G3U1_VOCAB } from './vocab'

import {
  quizBankG3U1a,
  fillblankBankG3U1a,
  listenWordBankG3U1a,
  listenSentenceBankG3U1a,
  listenOrderBankG3U1a,
  listenResponseBankG3U1a,
  listenTranslateBankG3U1a,
} from '../../../data/g3u_unit1aData.js'
import {
  quizBankG3U1b,
  fillblankBankG3U1b,
  listenWordBankG3U1b,
  listenSentenceBankG3U1b,
  listenOrderBankG3U1b,
  listenResponseBankG3U1b,
  listenTranslateBankG3U1b,
} from '../../../data/g3u_unit1bData.js'
import {
  quizBankG3U1c,
  fillblankBankG3U1c,
  listenWordBankG3U1c,
  listenSentenceBankG3U1c,
  listenOrderBankG3U1c,
  listenResponseBankG3U1c,
  listenTranslateBankG3U1c,
} from '../../../data/g3u_unit1cData.js'

function mergePools(...groups: QuestionData[][]) {
  return groups.flat()
}

function takePool(pool: QuestionData[], size: number, type: string): QuestionData[] {
  const unique = pool.filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i)
  if (unique.length < size) {
    console.warn(`[G3U1] ${type} pool has ${unique.length}/${size} questions`)
  }
  return unique.slice(0, size)
}

function buildWordTranslatePool(): QuestionData[] {
  const CARDS_PER_QUESTION = 6
  const vocab = G3U1_VOCAB
  return Array.from({ length: G3U1_BANK_SIZE }, (_, i) => ({
    type: 'wordTranslate' as const,
    id: `g3u1-wt-${i}`,
    prompt: '翻译单词',
    cards: Array.from({ length: CARDS_PER_QUESTION }, (_, j) => {
      const v = vocab[(i + j) % vocab.length]
      return { wordZh: v.zh, answer: v.en, iconKey: v.iconKey }
    }),
  }))
}

function buildMatchingPool(): QuestionData[] {
  const pairs = G3U1_VOCAB.map((v, i) => ({
    id: `p${i}`,
    audioText: v.en,
    labelZh: v.zh,
  }))
  const pairCount = 5
  const pool = Array.from({ length: G3U1_BANK_SIZE }, (_, i) => {
    const slice = Array.from({ length: pairCount }, (_, j) => pairs[(i + j) % pairs.length])
    const question = {
      type: 'matching' as const,
      id: `g3u1-match-${i}`,
      prompt: '选择配对',
      pairs: slice.map((p, j) => ({ ...p, id: `p${i}-${j}` })),
    }
    assertMatchingQuestion(question)
    return question
  })
  return pool
}

function buildListeningPool(): QuestionData[] {
  const all = mergePools(
    fromListenWord(listenWordBankG3U1a, 'a'),
    fromListenWord(listenWordBankG3U1b, 'b'),
    fromListenWord(listenWordBankG3U1c, 'c'),
    fromListenSentence(listenSentenceBankG3U1a, 'a'),
    fromListenSentence(listenSentenceBankG3U1b, 'b'),
    fromListenSentence(listenSentenceBankG3U1c, 'c'),
    fromListenResponse(listenResponseBankG3U1a, 'a'),
    fromListenResponse(listenResponseBankG3U1b, 'b'),
    fromListenResponse(listenResponseBankG3U1c, 'c'),
    fromListenTranslate(listenTranslateBankG3U1a, 'a'),
    fromListenTranslate(listenTranslateBankG3U1b, 'b'),
    fromListenTranslate(listenTranslateBankG3U1c, 'c'),
  )
  return takePool(all, G3U1_BANK_SIZE, 'listening')
}

function buildStoryPool(): QuestionData[] {
  const legacy = STORY_SCENES.slice(0, 0) // extras only below; legacy stories in bankExtras STORY_SCENES
  const fromExtras = STORY_SCENES.map(buildStoryFromScene)
  const handcrafted: QuestionData[] = [
    {
      type: 'storyListen',
      id: 'g3u1-story-1',
      prompt: '听故事',
      sceneTitle: '校门口认识新朋友',
      speakers: [{ emoji: '👦', name: 'Mike' }, { emoji: '👧', name: 'Sarah' }],
      steps: [
        { kind: 'listen', audioText: 'Hello! I am Mike.' },
        { kind: 'wordPick', prompt: '选择听到的 2 个单词', pickCount: 2, options: ['Hello', 'Mike', 'book', 'bag', 'Goodbye'], answers: ['Hello', 'Mike'] },
        { kind: 'trueFalse', prompt: '判断正误', statementZh: '他们在打招呼。', replayText: 'Hello! I am Mike.', answer: true },
      ],
    },
    {
      type: 'storyListen',
      id: 'g3u1-story-2',
      prompt: '听故事',
      sceneTitle: '文具展示',
      speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }],
      steps: [
        { kind: 'listen', audioText: 'Show me your pencil.' },
        { kind: 'choice', prompt: '选择听到的内容', partialZh: '给我看看你的', options: [{ zh: '铅笔。' }, { zh: '书包。' }], answerIndex: 0 },
      ],
    },
    {
      type: 'storyListen',
      id: 'g3u1-story-3',
      prompt: '听故事',
      sceneTitle: '放学告别',
      speakers: [{ emoji: '👧', name: 'Sarah' }, { emoji: '👩‍🏫', name: '老师' }],
      steps: [
        { kind: 'listen', audioText: 'Goodbye, Miss White!' },
        { kind: 'trueFalse', prompt: '判断正误', statementZh: '他们在告别。', replayText: 'Goodbye, Miss White!', answer: true },
      ],
    },
    {
      type: 'storyListen',
      id: 'g3u1-story-4',
      prompt: '听故事',
      sceneTitle: '我也有',
      speakers: [{ emoji: '👦', name: 'John' }, { emoji: '👧', name: 'Amy' }],
      steps: [
        { kind: 'listen', audioText: 'I have a ruler.' },
        { kind: 'wordPick', prompt: '选择听到的单词', pickCount: 2, options: ['ruler', 'eraser', 'I', 'have', 'book'], answers: ['I', 'ruler'] },
      ],
    },
  ]
  return takePool([...handcrafted, ...fromExtras, ...legacy], G3U1_BANK_SIZE, 'storyListen')
}

function buildAichatPool(): QuestionData[] {
  validateAichatQuestions(G3U1_AICHAT_BANK)
  return takePool(G3U1_AICHAT_BANK, G3U1_BANK_SIZE, 'aichat')
}

function buildTranslatePool(): QuestionData[] {
  const pep = mergePools(
    fromFillToTranslate(fillblankBankG3U1a, 'a'),
    fromFillToTranslate(fillblankBankG3U1b, 'b'),
    fromFillToTranslate(fillblankBankG3U1c, 'c'),
  )
  const extra = EXTRA_TRANSLATE.map((item, i) => ({
    type: 'translate' as const,
    id: `g3u1-tr-x${i}`,
    prompt: '完成翻译',
    promptZh: item.chinese,
    hintWord: item.sentence.match(/\(([^)]+)\)/)?.[1] ?? item.chinese,
    template: item.sentence.replace(/\s*\([^)]+\)/, '').trim(),
    answer: item.answer,
  }))
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'translate')
}

function buildChoicePool(): QuestionData[] {
  const pep = mergePools(
    fromQuizBank(quizBankG3U1a, 'a'),
    fromQuizBank(quizBankG3U1b, 'b'),
    fromQuizBank(quizBankG3U1c, 'c'),
  )
  const extra = fromQuizBank(EXTRA_CHOICE as Parameters<typeof fromQuizBank>[0], 'x')
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'choice')
}

function buildSpellingPool(): QuestionData[] {
  const pep = mergePools(
    fromFillToSpelling(fillblankBankG3U1a, 'a'),
    fromFillToSpelling(fillblankBankG3U1b, 'b'),
    fromFillToSpelling(fillblankBankG3U1c, 'c'),
  )
  const extra = fromFillToSpelling(EXTRA_SPELLING, 'x')
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'spelling')
}

function buildDictationPool(): QuestionData[] {
  const pep = mergePools(
    fromListenToDictation(listenSentenceBankG3U1a, 'a'),
    fromListenToDictation(listenSentenceBankG3U1b, 'b'),
    fromListenToDictation(listenSentenceBankG3U1c, 'c'),
  )
  const extra = EXTRA_DICTATION.map((item, i) => ({
    type: 'dictation' as const,
    id: `g3u1-dict-x${i}`,
    prompt: '键入你听到的句子',
    audioText: item.sentence,
    answer: item.sentence,
    speaker: '👩‍🏫',
  }))
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'dictation')
}

function buildOrderingPool(): QuestionData[] {
  const pep = mergePools(
    fromListenOrder(listenOrderBankG3U1a, 'a'),
    fromListenOrder(listenOrderBankG3U1b, 'b'),
    fromListenOrder(listenOrderBankG3U1c, 'c'),
  )
  const extra = fromListenOrder(EXTRA_ORDERING, 'x')
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'ordering')
}

function buildSpeakingPool(): QuestionData[] {
  const pep = mergePools(
    fromListenToSpeaking(listenOrderBankG3U1a, 'a'),
    fromListenToSpeaking(listenOrderBankG3U1b, 'b'),
    fromListenToSpeaking(listenOrderBankG3U1c, 'c'),
  )
  const extra = EXTRA_SPEAKING.map((item, i) => ({
    type: 'speaking' as const,
    id: `g3u1-spk-x${i}`,
    prompt: '跟读这句话',
    sentence: item.sentence,
  }))
  return takePool([...pep, ...extra], G3U1_BANK_SIZE, 'speaking')
}

const BUILDERS: Record<(typeof G3U1_CORE_TYPES)[number], () => QuestionData[]> = {
  translate: buildTranslatePool,
  wordTranslate: buildWordTranslatePool,
  matching: buildMatchingPool,
  storyListen: buildStoryPool,
  listening: buildListeningPool,
  dictation: buildDictationPool,
  spelling: buildSpellingPool,
  ordering: buildOrderingPool,
  choice: buildChoicePool,
  speaking: buildSpeakingPool,
  aichat: buildAichatPool,
}

export function buildG3U1Bank(): Record<QuestionType, QuestionData[]> {
  const bank: Partial<Record<QuestionType, QuestionData[]>> = {}
  for (const type of G3U1_CORE_TYPES) {
    bank[type] = BUILDERS[type]()
  }
  return {
    ...bank,
    phonicsIntro: [],
    phonicsPick: [],
    phonicsSameDiff: [],
    phonicsRepeat: [],
  } as Record<QuestionType, QuestionData[]>
}

export const G3U1_BANK = buildG3U1Bank()

export function poolForType(type: QuestionType): QuestionData[] {
  return G3U1_BANK[type] ?? []
}
