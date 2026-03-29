import { useState, useEffect } from 'react'
import presentSimpleData from '../data/grammar_tenses/elementary/present_simple.json'
import presentContinuousData from '../data/grammar_tenses/elementary/present_continuous.json'
import pastSimpleData from '../data/grammar_tenses/elementary/past_simple.json'
import articlesData from '../data/grammar_tenses/elementary/articles.json'
import pluralNounsData from '../data/grammar_tenses/elementary/plural_nouns.json'
import pronounsData from '../data/grammar_tenses/elementary/pronouns.json'
import basicPrepositionsData from '../data/grammar_tenses/elementary/basic_prepositions.json'
import thereIsThereAreData from '../data/grammar_tenses/elementary/there_is_there_are.json'
import imperativesData from '../data/grammar_tenses/elementary/imperatives.json'
import questionFormationData from '../data/grammar_tenses/elementary/question_formation.json'
import adjectiveComparisonData from '../data/grammar_tenses/elementary/adjective_comparison.json'
import pastContinuousData from '../data/grammar_tenses/junior/past_continuous.json'
import futureSimpleData from '../data/grammar_tenses/junior/future_simple.json'
import presentPerfectData from '../data/grammar_tenses/junior/present_perfect.json'
import pastPerfectData from '../data/grammar_tenses/junior/past_perfect.json'
import futureContinuousData from '../data/grammar_tenses/junior/future_continuous.json'
import presentPerfectContinuousData from '../data/grammar_tenses/junior/present_perfect_continuous.json'
import modalVerbsData from '../data/grammar_tenses/junior/modal_verbs.json'
import passiveVoiceData from '../data/grammar_tenses/junior/passive_voice.json'
import relativeClausesData from '../data/grammar_tenses/junior/relative_clauses.json'
import reportedSpeechData from '../data/grammar_tenses/junior/reported_speech.json'
import conditionalSentencesData from '../data/grammar_tenses/junior/conditional_sentences.json'
import gerundsInfinitivesData from '../data/grammar_tenses/junior/gerunds_infinitives.json'
import countableUncountableData from '../data/grammar_tenses/junior/countable_uncountable.json'
import conjunctionsData from '../data/grammar_tenses/junior/conjunctions.json'
import pastPerfectContinuousData from '../data/grammar_tenses/senior/past_perfect_continuous.json'
import futurePerfectData from '../data/grammar_tenses/senior/future_perfect.json'
import subjunctiveMoodData from '../data/grammar_tenses/senior/subjunctive_mood.json'
import comprehensiveReviewData from '../data/grammar_tenses/senior/comprehensive_review.json'
import inversionData from '../data/grammar_tenses/senior/inversion.json'
import cleftSentencesData from '../data/grammar_tenses/senior/cleft_sentences.json'
import nounClausesData from '../data/grammar_tenses/senior/noun_clauses.json'
import nonFiniteVerbsData from '../data/grammar_tenses/senior/non_finite_verbs.json'
import advancedPassiveData from '../data/grammar_tenses/senior/advanced_passive.json'
import ellipsisSubstitutionData from '../data/grammar_tenses/senior/ellipsis_substitution.json'
import discourseMarkersData from '../data/grammar_tenses/senior/discourse_markers.json'
import mixedConditionalsData from '../data/grammar_tenses/senior/mixed_conditionals.json'

const STAGES = [
  {
    id: 'elementary',
    label: '小学',
    color: 'from-green-600 to-green-800',
    icon: '🌱',
    tenses: [
      { id: 'present_simple', name: '一般现在时', desc: 'Simple Present Tense', data: presentSimpleData,
        lessons: [
          { label: 'Lesson 1', desc: 'be动词：am / is / are', slice: [0, 15] },
          { label: 'Lesson 2', desc: '实义动词的一般现在时', slice: [15, 30] },
          { label: 'Lesson 3', desc: '频率副词：always / usually / often', slice: [30, 45] },
          { label: 'Lesson 4', desc: '客观事实与自然规律', slice: [45, 60] },
        ]
      },
      { id: 'present_continuous', name: '现在进行时', desc: 'Present Continuous Tense', data: presentContinuousData,
        lessons: [
          { label: 'Lesson 1', desc: 'am/is/are + doing 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: '动词变-ing的拼写规则', slice: [15, 28] },
          { label: 'Lesson 3', desc: '现在进行时与一般现在时对比', slice: [28, 40] },
        ]
      },
      { id: 'past_simple', name: '一般过去时', desc: 'Simple Past Tense', data: pastSimpleData,
        lessons: [
          { label: 'Lesson 1', desc: 'was / were 的用法', slice: [0, 15] },
          { label: 'Lesson 2', desc: '规则动词：动词 + -ed', slice: [15, 27] },
          { label: 'Lesson 3', desc: '不规则动词过去式', slice: [27, 40] },
          { label: 'Lesson 4', desc: '综合练习：叙述过去的事件', slice: [40, 50] },
        ]
      },
      { id: 'articles', name: '冠词', desc: 'Articles: a / an / the', data: articlesData,
        lessons: [
          { label: 'Lesson 1', desc: '不定冠词 a / an 的用法', slice: [0, 15] },
          { label: 'Lesson 2', desc: '定冠词 the 与零冠词', slice: [15, 30] },
        ]
      },
      { id: 'plural_nouns', name: '名词复数', desc: 'Plural Nouns', data: pluralNounsData,
        lessons: [
          { label: 'Lesson 1', desc: '规则复数变化：-s / -es / -ies', slice: [0, 15] },
          { label: 'Lesson 2', desc: '不规则复数：man/men, child/children', slice: [15, 30] },
        ]
      },
      { id: 'pronouns', name: '代词', desc: 'Pronouns', data: pronounsData,
        lessons: [
          { label: 'Lesson 1', desc: '人称代词主格与宾格', slice: [0, 15] },
          { label: 'Lesson 2', desc: '物主代词形容词性与名词性', slice: [15, 30] },
        ]
      },
      { id: 'basic_prepositions', name: '基础介词', desc: 'Basic Prepositions', data: basicPrepositionsData,
        lessons: [
          { label: 'Lesson 1', desc: '地点介词：in / on / under / next to', slice: [0, 10] },
          { label: 'Lesson 2', desc: '时间介词：at / on / in', slice: [10, 20] },
          { label: 'Lesson 3', desc: '方向与其他介词', slice: [20, 30] },
        ]
      },
      { id: 'there_is_there_are', name: 'There is / There are', desc: 'Existential Sentences', data: thereIsThereAreData,
        lessons: [
          { label: 'Lesson 1', desc: 'There is / There are 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: '否定句、疑问句与扩展用法', slice: [15, 30] },
        ]
      },
      { id: 'imperatives', name: '祈使句', desc: 'Imperative Sentences', data: imperativesData,
        lessons: [
          { label: 'Lesson 1', desc: '肯定祈使句与否定祈使句', slice: [0, 15] },
          { label: 'Lesson 2', desc: "Let's... 与祈使句 + and/or", slice: [15, 30] },
        ]
      },
      { id: 'question_formation', name: '疑问句构成', desc: 'Question Formation', data: questionFormationData,
        lessons: [
          { label: 'Lesson 1', desc: '一般疑问句：Yes/No Questions', slice: [0, 10] },
          { label: 'Lesson 2', desc: '特殊疑问句：Wh- Questions', slice: [10, 20] },
          { label: 'Lesson 3', desc: 'How 引导的疑问句', slice: [20, 30] },
        ]
      },
      { id: 'adjective_comparison', name: '形容词比较级最高级', desc: 'Adjective Comparison', data: adjectiveComparisonData,
        lessons: [
          { label: 'Lesson 1', desc: '比较级：-er than / more...than', slice: [0, 10] },
          { label: 'Lesson 2', desc: '最高级：the -est / the most...', slice: [10, 20] },
          { label: 'Lesson 3', desc: 'as...as 与其他比较结构', slice: [20, 30] },
        ]
      },
    ]
  },
  {
    id: 'junior',
    label: '初中',
    color: 'from-blue-600 to-blue-800',
    icon: '📘',
    tenses: [
      { id: 'past_continuous', name: '过去进行时', desc: 'Past Continuous Tense', data: pastContinuousData,
        lessons: [
          { label: 'Lesson 1', desc: 'was/were + doing 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'when / while 时间状语从句', slice: [15, 30] },
        ]
      },
      { id: 'future_simple', name: '一般将来时', desc: 'Simple Future Tense', data: futureSimpleData,
        lessons: [
          { label: 'Lesson 1', desc: 'will + 动词原形', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'be going to + 动词原形', slice: [15, 30] },
        ]
      },
      { id: 'present_perfect', name: '现在完成时', desc: 'Present Perfect Tense', data: presentPerfectData,
        lessons: [
          { label: 'Lesson 1', desc: 'have/has + 过去分词 基础', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'for / since 表示持续时间', slice: [15, 30] },
          { label: 'Lesson 3', desc: '现在完成时与一般过去时对比', slice: [30, 45] },
        ]
      },
      { id: 'past_perfect', name: '过去完成时', desc: 'Past Perfect Tense', data: pastPerfectData,
        lessons: [
          { label: 'Lesson 1', desc: 'had + 过去分词 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'before / after / when 时间状语', slice: [15, 30] },
        ]
      },
      { id: 'future_continuous', name: '将来进行时', desc: 'Future Continuous Tense', data: futureContinuousData,
        lessons: [
          { label: 'Lesson 1', desc: 'will be + doing 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: '时间状语：when / by the time', slice: [15, 30] },
        ]
      },
      { id: 'present_perfect_continuous', name: '现在完成进行时', desc: 'Present Perfect Continuous', data: presentPerfectContinuousData,
        lessons: [
          { label: 'Lesson 1', desc: 'have/has been + doing 基础', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'for / since 持续动作', slice: [15, 30] },
        ]
      },
      { id: 'modal_verbs', name: '情态动词', desc: 'Modal Verbs', data: modalVerbsData,
        lessons: [
          { label: 'Lesson 1', desc: 'can / could / may / might', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'must / have to / should / ought to', slice: [15, 30] },
        ]
      },
      { id: 'passive_voice', name: '被动语态', desc: 'Passive Voice', data: passiveVoiceData,
        lessons: [
          { label: 'Lesson 1', desc: '一般现在时与一般过去时被动', slice: [0, 15] },
          { label: 'Lesson 2', desc: '完成时、进行时与情态动词被动', slice: [15, 30] },
        ]
      },
      { id: 'relative_clauses', name: '定语从句', desc: 'Relative Clauses', data: relativeClausesData,
        lessons: [
          { label: 'Lesson 1', desc: '关系代词 who / that 修饰人', slice: [0, 15] },
          { label: 'Lesson 2', desc: '关系代词 which / that 修饰物', slice: [15, 25] },
          { label: 'Lesson 3', desc: 'whose / where / when / why', slice: [25, 30] },
        ]
      },
      { id: 'reported_speech', name: '间接引语', desc: 'Reported Speech', data: reportedSpeechData,
        lessons: [
          { label: 'Lesson 1', desc: '陈述句的间接引语（时态回退）', slice: [0, 15] },
          { label: 'Lesson 2', desc: '疑问句与祈使句的间接引语', slice: [15, 30] },
        ]
      },
      { id: 'conditional_sentences', name: '条件句', desc: 'Conditional Sentences', data: conditionalSentencesData,
        lessons: [
          { label: 'Lesson 1', desc: 'Type 1：真实条件句（if + 现在时）', slice: [0, 10] },
          { label: 'Lesson 2', desc: 'Type 2：非真实条件句（if + 过去时）', slice: [10, 20] },
          { label: 'Lesson 3', desc: 'unless / as long as / in case', slice: [20, 30] },
        ]
      },
      { id: 'gerunds_infinitives', name: '动名词与不定式', desc: 'Gerunds vs Infinitives', data: gerundsInfinitivesData,
        lessons: [
          { label: 'Lesson 1', desc: '动名词作宾语：enjoy/finish/mind doing', slice: [0, 10] },
          { label: 'Lesson 2', desc: '不定式作宾语：want/hope/decide to do', slice: [10, 20] },
          { label: 'Lesson 3', desc: 'stop/remember/try + doing vs to do', slice: [20, 30] },
        ]
      },
      { id: 'countable_uncountable', name: '可数与不可数名词', desc: 'Countable & Uncountable Nouns', data: countableUncountableData,
        lessons: [
          { label: 'Lesson 1', desc: '不可数名词：much / a little / some', slice: [0, 15] },
          { label: 'Lesson 2', desc: '可数名词：many / a few / any', slice: [15, 30] },
        ]
      },
      { id: 'conjunctions', name: '连词与从句衔接', desc: 'Conjunctions & Clause Linking', data: conjunctionsData,
        lessons: [
          { label: 'Lesson 1', desc: '并列连词：and / but / or / so / both...and', slice: [0, 10] },
          { label: 'Lesson 2', desc: '原因与结果：because / since / so / therefore', slice: [10, 20] },
          { label: 'Lesson 3', desc: '让步与目的：although / so that / such...that', slice: [20, 30] },
        ]
      },
    ]
  },
  {
    id: 'senior',
    label: '高中',
    color: 'from-purple-600 to-purple-800',
    icon: '🎓',
    tenses: [
      { id: 'past_perfect_continuous', name: '过去完成进行时', desc: 'Past Perfect Continuous', data: pastPerfectContinuousData,
        lessons: [
          { label: 'Lesson 1', desc: 'had been + doing 基础句型', slice: [0, 15] },
          { label: 'Lesson 2', desc: '结果与原因的综合表达', slice: [15, 30] },
        ]
      },
      { id: 'future_perfect', name: '将来完成时', desc: 'Future Perfect Tense', data: futurePerfectData,
        lessons: [
          { label: 'Lesson 1', desc: 'will have + 过去分词 基础', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'by the time / by + 时间点', slice: [15, 30] },
        ]
      },
      { id: 'subjunctive_mood', name: '虚拟语气', desc: 'Subjunctive Mood', data: subjunctiveMoodData,
        lessons: [
          { label: 'Lesson 1', desc: '与现在/将来事实相反的虚拟', slice: [0, 15] },
          { label: 'Lesson 2', desc: '与过去事实相反的虚拟', slice: [15, 30] },
          { label: 'Lesson 3', desc: 'wish / if only / would rather', slice: [30, 45] },
        ]
      },
      { id: 'inversion', name: '倒装句', desc: 'Inversion', data: inversionData,
        lessons: [
          { label: 'Lesson 1', desc: '否定副词开头的部分倒装', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'Only / So / Such 引导的倒装', slice: [15, 30] },
        ]
      },
      { id: 'cleft_sentences', name: '强调句', desc: 'Cleft Sentences', data: cleftSentencesData,
        lessons: [
          { label: 'Lesson 1', desc: 'It is/was...that/who 强调句', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'What 引导的强调结构', slice: [15, 30] },
        ]
      },
      { id: 'noun_clauses', name: '名词性从句', desc: 'Noun Clauses', data: nounClausesData,
        lessons: [
          { label: 'Lesson 1', desc: '主语从句与表语从句', slice: [0, 15] },
          { label: 'Lesson 2', desc: '同位语从句与宾语从句深化', slice: [15, 30] },
        ]
      },
      { id: 'non_finite_verbs', name: '非谓语动词', desc: 'Non-finite Verbs', data: nonFiniteVerbsData,
        lessons: [
          { label: 'Lesson 1', desc: '现在分词与过去分词作状语', slice: [0, 15] },
          { label: 'Lesson 2', desc: '完成式分词与独立主格结构', slice: [15, 30] },
        ]
      },
      { id: 'advanced_passive', name: '高级被动结构', desc: 'Advanced Passive Constructions', data: advancedPassiveData,
        lessons: [
          { label: 'Lesson 1', desc: 'It is said/reported/believed that...', slice: [0, 15] },
          { label: 'Lesson 2', desc: 'He is said/considered/expected to...', slice: [15, 30] },
        ]
      },
      { id: 'ellipsis_substitution', name: '省略与替代', desc: 'Ellipsis & Substitution', data: ellipsisSubstitutionData,
        lessons: [
          { label: 'Lesson 1', desc: 'So do I / Neither does she 替代结构', slice: [0, 15] },
          { label: 'Lesson 2', desc: '不定式省略与状语从句省略', slice: [15, 30] },
        ]
      },
      { id: 'discourse_markers', name: '语篇衔接词', desc: 'Discourse Markers', data: discourseMarkersData,
        lessons: [
          { label: 'Lesson 1', desc: '递进、转折与因果衔接词', slice: [0, 15] },
          { label: 'Lesson 2', desc: '举例、总结与让步衔接词', slice: [15, 30] },
        ]
      },
      { id: 'mixed_conditionals', name: '混合条件句', desc: 'Mixed Conditionals', data: mixedConditionalsData,
        lessons: [
          { label: 'Lesson 1', desc: '过去条件 → 现在结果', slice: [0, 15] },
          { label: 'Lesson 2', desc: '现在条件 → 过去结果', slice: [15, 30] },
        ]
      },
      { id: 'comprehensive_review', name: '综合复习', desc: 'Comprehensive Review', data: comprehensiveReviewData,
        lessons: [
          { label: 'Lesson 1', desc: '时态综合练习（基础）', slice: [0, 15] },
          { label: 'Lesson 2', desc: '时态综合练习（进阶）', slice: [15, 30] },
          { label: 'Lesson 3', desc: '时态综合练习（高级）', slice: [30, 45] },
        ]
      },
    ]
  },
]

function getLessonStats(data, progress) {
  const total = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

export default function Grammar({ onImport, onClose, onSetBack, progress = {} }) {
  const [stage, setStage] = useState(null)
  const [tense, setTense] = useState(null)

  useEffect(() => {
    if (tense) onSetBack?.(() => () => setTense(null))
    else if (stage) onSetBack?.(() => () => setStage(null))
    else onSetBack?.(null)
  }, [stage, tense, onSetBack])

  if (tense) {
    const stageObj = STAGES.find(s => s.id === stage)
    const tenseObj = stageObj.tenses.find(t => t.id === tense)
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-500 text-sm">{stageObj.label}</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-sm">{tenseObj.name}</span>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${stageObj.color} flex items-center justify-center text-3xl shrink-0`}>
            {stageObj.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white mb-1">{tenseObj.name}</div>
            <div className="text-gray-400 text-sm mb-3">{tenseObj.desc}</div>
            {(() => {
              const stats = getLessonStats(tenseObj.data, progress)
              const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
              return (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums shrink-0">{stats.attempted}/{stats.total} 句</span>
                </div>
              )
            })()}
          </div>
          <button onClick={() => onImport(tenseObj.data, `${stageObj.label} · ${tenseObj.name} · 全部`)} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shrink-0">
            ▶ 全部练习
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tenseObj.lessons.map((lesson, i) => {
            const data = tenseObj.data.slice(lesson.slice[0], lesson.slice[1])
            const stats = getLessonStats(data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            return (
              <button key={i} onClick={() => onImport(data, `${stageObj.label} · ${tenseObj.name} · ${lesson.label}`)}
                className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col gap-2 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-white text-sm font-medium">{lesson.label}</span>
                  {done
                    ? <span className="text-xs text-green-400 bg-green-900/40 border border-green-700/50 px-2 py-0.5 rounded-full shrink-0">已完成</span>
                    : stats.attempted > 0
                      ? <span className="text-xs text-blue-400 bg-blue-900/40 border border-blue-700/50 px-2 py-0.5 rounded-full shrink-0">进行中</span>
                      : <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">{data.length} 句</span>
                  }
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="text-xs text-gray-500 leading-snug line-clamp-2">{lesson.desc}</div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (stage) {
    const stageObj = STAGES.find(s => s.id === stage)
    const allData = stageObj.tenses.flatMap(t => t.data)
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-300 text-sm font-medium">{stageObj.label}阶段</span>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${stageObj.color} flex items-center justify-center text-3xl shrink-0`}>
            {stageObj.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white mb-1">{stageObj.label}语法专项</div>
            <div className="text-gray-400 text-sm mb-3">{stageObj.tenses.length} 个专题 · 共 {allData.length} 句</div>
            {(() => {
              const stats = getLessonStats(allData, progress)
              const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
              return (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums shrink-0">{stats.attempted}/{stats.total} 句</span>
                </div>
              )
            })()}
          </div>
          <button onClick={() => onImport(allData, `${stageObj.label}语法 · 全阶段`)} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shrink-0">
            ▶ 全阶段练习
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stageObj.tenses.map((t) => {
            const stats = getLessonStats(t.data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            return (
              <button key={t.id} onClick={() => setTense(t.id)}
                className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col gap-2 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-white text-sm font-medium">{t.name}</span>
                  {done
                    ? <span className="text-xs text-green-400 bg-green-900/40 border border-green-700/50 px-2 py-0.5 rounded-full shrink-0">已完成</span>
                    : stats.attempted > 0
                      ? <span className="text-xs text-blue-400 bg-blue-900/40 border border-blue-700/50 px-2 py-0.5 rounded-full shrink-0">进行中</span>
                      : <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">{t.data.length} 句</span>
                  }
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
                  <span>{t.desc}</span>
                  <span className="text-gray-600 shrink-0 ml-1">{t.lessons.length} 课</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">语法专项练习</h2>
        <span className="text-xs text-gray-500">共 {STAGES.reduce((a, s) => a + s.tenses.length, 0)} 个专题</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAGES.map((s) => {
          const allData = s.tenses.flatMap(t => t.data)
          const stats = getLessonStats(allData, progress)
          const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
          return (
            <button key={s.id} onClick={() => setStage(s.id)}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all text-left cursor-pointer">
              <div className={`w-full h-28 bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <span className="text-5xl">{s.icon}</span>
              </div>
              <div className="bg-gray-900 p-4 flex flex-col gap-1">
                <div className="text-base font-bold text-white">{s.label}阶段</div>
                <div className="text-xs text-gray-400">{s.tenses.length} 个专题 · {allData.length} 句</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 tabular-nums shrink-0">{percent}%</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.tenses.map(t => (
                    <span key={t.id} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{t.name}</span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
