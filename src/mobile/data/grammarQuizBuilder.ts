import type {
  GrammarConceptQuestionData,
  Lesson,
  OrderingQuestionData,
  QuestionData,
  SpeakingQuestionData,
  DictationQuestionData,
} from '../types'
import type { GrammarTopicRef } from './unitGrammarMap'

// ── 句子数据（与 Grammar.jsx 桌面端一致） ──────────────────────────────────────
import presentSimple from '../../data/grammar_tenses/elementary/present_simple.json'
import presentContinuous from '../../data/grammar_tenses/elementary/present_continuous.json'
import pastSimple from '../../data/grammar_tenses/elementary/past_simple.json'
import articles from '../../data/grammar_tenses/elementary/articles.json'
import pluralNouns from '../../data/grammar_tenses/elementary/plural_nouns.json'
import pronouns from '../../data/grammar_tenses/elementary/pronouns.json'
import basicPrepositions from '../../data/grammar_tenses/elementary/basic_prepositions.json'
import thereIsThereAre from '../../data/grammar_tenses/elementary/there_is_there_are.json'
import imperatives from '../../data/grammar_tenses/elementary/imperatives.json'
import questionFormation from '../../data/grammar_tenses/elementary/question_formation.json'
import adjectiveComparison from '../../data/grammar_tenses/elementary/adjective_comparison.json'
import pastContinuous from '../../data/grammar_tenses/junior/past_continuous.json'
import futureSimple from '../../data/grammar_tenses/junior/future_simple.json'
import presentPerfect from '../../data/grammar_tenses/junior/present_perfect.json'
import pastPerfect from '../../data/grammar_tenses/junior/past_perfect.json'
import modalVerbs from '../../data/grammar_tenses/junior/modal_verbs.json'
import passiveVoice from '../../data/grammar_tenses/junior/passive_voice.json'
import relativeClauses from '../../data/grammar_tenses/junior/relative_clauses.json'
import reportedSpeech from '../../data/grammar_tenses/junior/reported_speech.json'
import conditionalSentences from '../../data/grammar_tenses/junior/conditional_sentences.json'
import gerundsInfinitives from '../../data/grammar_tenses/junior/gerunds_infinitives.json'
import countableUncountable from '../../data/grammar_tenses/junior/countable_uncountable.json'
import conjunctions from '../../data/grammar_tenses/junior/conjunctions.json'
import subjunctiveMood from '../../data/grammar_tenses/senior/subjunctive_mood.json'
import inversion from '../../data/grammar_tenses/senior/inversion.json'
import cleftSentences from '../../data/grammar_tenses/senior/cleft_sentences.json'
import nounClauses from '../../data/grammar_tenses/senior/noun_clauses.json'
import nonFiniteVerbs from '../../data/grammar_tenses/senior/non_finite_verbs.json'
import advancedPassive from '../../data/grammar_tenses/senior/advanced_passive.json'
import mixedConditionals from '../../data/grammar_tenses/senior/mixed_conditionals.json'

// ── 概念题数据 ─────────────────────────────────────────────────────────────────
import presentSimpleC from '../../data/grammar_tenses/elementary/present_simple_concept.json'
import presentContinuousC from '../../data/grammar_tenses/elementary/present_continuous_concept.json'
import pastSimpleC from '../../data/grammar_tenses/elementary/past_simple_concept.json'
import articlesC from '../../data/grammar_tenses/elementary/articles_concept.json'
import pluralNounsC from '../../data/grammar_tenses/elementary/plural_nouns_concept.json'
import pronounsC from '../../data/grammar_tenses/elementary/pronouns_concept.json'
import basicPrepositionsC from '../../data/grammar_tenses/elementary/basic_prepositions_concept.json'
import thereIsThereAreC from '../../data/grammar_tenses/elementary/there_is_there_are_concept.json'
import imperativesC from '../../data/grammar_tenses/elementary/imperatives_concept.json'
import questionFormationC from '../../data/grammar_tenses/elementary/question_formation_concept.json'
import adjectiveComparisonC from '../../data/grammar_tenses/elementary/adjective_comparison_concept.json'
import pastContinuousC from '../../data/grammar_tenses/junior/past_continuous_concept.json'
import futureSimpleC from '../../data/grammar_tenses/junior/future_simple_concept.json'
import presentPerfectC from '../../data/grammar_tenses/junior/present_perfect_concept.json'
import pastPerfectC from '../../data/grammar_tenses/junior/past_perfect_concept.json'
import modalVerbsC from '../../data/grammar_tenses/junior/modal_verbs_concept.json'
import passiveVoiceC from '../../data/grammar_tenses/junior/passive_voice_concept.json'
import relativeClausesC from '../../data/grammar_tenses/junior/relative_clauses_concept.json'
import reportedSpeechC from '../../data/grammar_tenses/junior/reported_speech_concept.json'
import conditionalSentencesC from '../../data/grammar_tenses/junior/conditional_sentences_concept.json'
import gerundsInfinitivesC from '../../data/grammar_tenses/junior/gerunds_infinitives_concept.json'
import countableUncountableC from '../../data/grammar_tenses/junior/countable_uncountable_concept.json'
import conjunctionsC from '../../data/grammar_tenses/junior/conjunctions_concept.json'
import subjunctiveMoodC from '../../data/grammar_tenses/senior/subjunctive_mood_concept.json'
import inversionC from '../../data/grammar_tenses/senior/inversion_concept.json'
import cleftSentencesC from '../../data/grammar_tenses/senior/cleft_sentences_concept.json'
import nounClausesC from '../../data/grammar_tenses/senior/noun_clauses_concept.json'
import nonFiniteVerbsC from '../../data/grammar_tenses/senior/non_finite_verbs_concept.json'
import advancedPassiveC from '../../data/grammar_tenses/senior/advanced_passive_concept.json'
import mixedConditionalsC from '../../data/grammar_tenses/senior/mixed_conditionals_concept.json'

export type GrammarStage = 'learn' | 'drill' | 'use' | 'test'

export const GRAMMAR_STAGES: { stage: GrammarStage; label: string; sub: string; glyph: string }[] = [
  { stage: 'learn', label: '学', sub: '规则认知', glyph: '📖' },
  { stage: 'drill', label: '练', sub: '专项强化', glyph: '🧩' },
  { stage: 'use', label: '用', sub: '真实表达', glyph: '🎤' },
  { stage: 'test', label: '测', sub: '综合检测', glyph: '🎯' },
]

interface Sentence { id: number; zh: string; en: string }
interface ConceptMC {
  id: string
  question: string
  chinese?: string
  options: string[]
  /** 正确选项下标：部分文件用 correct，部分用 answer */
  correct?: number
  answer?: number
  tag?: string
  explanation: string
}

/** 兼容两种字段名（present_simple 用 correct，其余用 answer） */
function correctIndexOf(mc: ConceptMC): number {
  return typeof mc.answer === 'number' ? mc.answer : (mc.correct ?? 0)
}

const S = (d: unknown) => d as Sentence[]
const C = (d: unknown) => d as ConceptMC[]

const SENTENCES: Record<string, Sentence[]> = {
  present_simple: S(presentSimple), present_continuous: S(presentContinuous), past_simple: S(pastSimple),
  articles: S(articles), plural_nouns: S(pluralNouns), pronouns: S(pronouns),
  basic_prepositions: S(basicPrepositions), there_is_there_are: S(thereIsThereAre), imperatives: S(imperatives),
  question_formation: S(questionFormation), adjective_comparison: S(adjectiveComparison),
  past_continuous: S(pastContinuous), future_simple: S(futureSimple), present_perfect: S(presentPerfect),
  past_perfect: S(pastPerfect), modal_verbs: S(modalVerbs), passive_voice: S(passiveVoice),
  relative_clauses: S(relativeClauses), reported_speech: S(reportedSpeech), conditional_sentences: S(conditionalSentences),
  gerunds_infinitives: S(gerundsInfinitives), countable_uncountable: S(countableUncountable), conjunctions: S(conjunctions),
  subjunctive_mood: S(subjunctiveMood), inversion: S(inversion), cleft_sentences: S(cleftSentences),
  noun_clauses: S(nounClauses), non_finite_verbs: S(nonFiniteVerbs), advanced_passive: S(advancedPassive),
  mixed_conditionals: S(mixedConditionals),
}

const CONCEPTS: Record<string, ConceptMC[]> = {
  present_simple: C(presentSimpleC), present_continuous: C(presentContinuousC), past_simple: C(pastSimpleC),
  articles: C(articlesC), plural_nouns: C(pluralNounsC), pronouns: C(pronounsC),
  basic_prepositions: C(basicPrepositionsC), there_is_there_are: C(thereIsThereAreC), imperatives: C(imperativesC),
  question_formation: C(questionFormationC), adjective_comparison: C(adjectiveComparisonC),
  past_continuous: C(pastContinuousC), future_simple: C(futureSimpleC), present_perfect: C(presentPerfectC),
  past_perfect: C(pastPerfectC), modal_verbs: C(modalVerbsC), passive_voice: C(passiveVoiceC),
  relative_clauses: C(relativeClausesC), reported_speech: C(reportedSpeechC), conditional_sentences: C(conditionalSentencesC),
  gerunds_infinitives: C(gerundsInfinitivesC), countable_uncountable: C(countableUncountableC), conjunctions: C(conjunctionsC),
  subjunctive_mood: C(subjunctiveMoodC), inversion: C(inversionC), cleft_sentences: C(cleftSentencesC),
  noun_clauses: C(nounClausesC), non_finite_verbs: C(nonFiniteVerbsC), advanced_passive: C(advancedPassiveC),
  mixed_conditionals: C(mixedConditionalsC),
}

// 每个 lesson 默认 15 句；用 lessonIdx 切片对应的句子区间
const LESSON_SIZE = 15

/** 取该话题在指定 lessonIdx 下的句子池；不指定 = 全部 */
function sentencePool(ref: GrammarTopicRef): Sentence[] {
  const all = SENTENCES[ref.topicId] ?? []
  if (!ref.lessonIdx || ref.lessonIdx.length === 0) return all
  const out: Sentence[] = []
  for (const li of ref.lessonIdx) {
    out.push(...all.slice(li * LESSON_SIZE, (li + 1) * LESSON_SIZE))
  }
  return out.length ? out : all
}

// ── 工具 ──────────────────────────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = (seed >>> 0) || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 取前 n 个；不足时按 i%len 循环复用（沿用 vocabQuizBuilder 范式） */
function take<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return []
  return Array.from({ length: n }, (_, i) => arr[i % arr.length])
}

function tokenize(en: string): string[] {
  return en
    .replace(/[“”"']/g, '')
    .split(/\s+/)
    .map(t => t.replace(/[.,!?;:]+$/g, '').replace(/^[¿¡]+/g, ''))
    .filter(Boolean)
}

function wordCount(s: Sentence): number {
  return tokenize(s.en).length
}

// ── 各题型构造 ──────────────────────────────────────────────────────────────────

function buildConcept(mc: ConceptMC, key: string): GrammarConceptQuestionData {
  return {
    type: 'grammarConcept',
    id: `${key}-${mc.id}`,
    prompt: '理解语法规则',
    tag: mc.tag,
    question: mc.question,
    options: mc.options,
    correctIndex: correctIndexOf(mc),
    explanation: mc.explanation,
  }
}

function buildOrdering(s: Sentence, key: string, i: number): OrderingQuestionData {
  const tokens = tokenize(s.en)
  return {
    type: 'ordering',
    id: `${key}-ord-${i}`,
    prompt: '把单词排成正确的句子',
    promptZh: s.zh,
    tokens,
    answer: tokens.join(' '),
  }
}

function buildSpeaking(s: Sentence, key: string, i: number): SpeakingQuestionData {
  return {
    type: 'speaking',
    id: `${key}-spk-${i}`,
    prompt: '看中文，开口说出英语',
    sentence: s.en,
  }
}

function buildDictation(s: Sentence, key: string, i: number): DictationQuestionData {
  return {
    type: 'dictation',
    id: `${key}-dic-${i}`,
    prompt: '听一听，键入你听到的句子',
    audioText: s.en,
    answer: s.en,
  }
}

// ── 主入口 ──────────────────────────────────────────────────────────────────────

const LEARN_N = 6
const DRILL_N = 6
const USE_N = 5

export function topicSentenceCount(ref: GrammarTopicRef): number {
  return sentencePool(ref).length
}

export function hasTopicData(ref: GrammarTopicRef): boolean {
  return (SENTENCES[ref.topicId]?.length ?? 0) > 0 && (CONCEPTS[ref.topicId]?.length ?? 0) > 0
}

/**
 * 为某话题的某阶段构造一关。
 * 学：概念题 · 练：排序 · 用：口语 · 测：概念+排序+听写
 */
export function buildGrammarLesson(ref: GrammarTopicRef, stage: GrammarStage, seed: number): Lesson {
  const key = `${ref.topicId}-${stage}`
  const concepts = CONCEPTS[ref.topicId] ?? []
  const pool = sentencePool(ref)
  // 短句优先用于排序，长句用于口语/听写，形成难度梯度
  const byLen = [...pool].sort((a, b) => wordCount(a) - wordCount(b))
  const shortHalf = byLen.slice(0, Math.max(DRILL_N, Math.ceil(byLen.length / 2)))
  const longHalf = byLen.slice(Math.floor(byLen.length / 2))

  let questions: QuestionData[] = []

  if (stage === 'learn') {
    const picked = take(seededShuffle(concepts.slice(0, Math.min(10, concepts.length)), seed), LEARN_N)
    questions = picked.map(mc => buildConcept(mc, key))
  } else if (stage === 'drill') {
    const picked = take(seededShuffle(shortHalf, seed), DRILL_N)
    questions = picked.map((s, i) => buildOrdering(s, key, i))
  } else if (stage === 'use') {
    const picked = take(seededShuffle(longHalf.length ? longHalf : pool, seed), USE_N)
    questions = picked.map((s, i) => buildSpeaking(s, key, i))
  } else {
    // test：3 概念（取偏后的难题）+ 3 排序 + 2 听写
    const hardConcepts = take(seededShuffle(concepts.slice(Math.floor(concepts.length / 2)), seed), 3)
    const ordSrc = take(seededShuffle(shortHalf, seed + 7), 3)
    const dicSrc = take(seededShuffle(longHalf.length ? longHalf : pool, seed + 13), 2)
    questions = [
      ...hardConcepts.map(mc => buildConcept(mc, key + '-t')),
      ...ordSrc.map((s, i) => buildOrdering(s, key + '-t', i)),
      ...dicSrc.map((s, i) => buildDictation(s, key + '-t', i)),
    ]
  }

  return {
    id: `${key}-${seed}`,
    nodeId: key,
    title: `${ref.name} · ${GRAMMAR_STAGES.find(s => s.stage === stage)?.sub ?? ''}`,
    questions,
  }
}
