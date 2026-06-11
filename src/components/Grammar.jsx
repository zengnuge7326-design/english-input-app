import { useState } from 'react'
import PageBackBar from './PageBackBar'
import LockedOverlay from './LockedOverlay'
import { GRAMMAR_LEARNING_UI_ENABLED } from '../config/grammarUi'
import { buildGrammarLessonPackMeta, getGrammarTopicMeta } from '../data/grammar_tenses/grammarTopicMeta'
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
    color: 'from-green-600/45 to-green-800/30',
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
    color: 'from-blue-600/45 to-blue-800/30',
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
    color: 'from-purple-600/45 to-purple-800/30',
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

/** 语法首页封面短文案，与教材同步「封面 + 底部信息」风格一致 */
const STAGE_COVER_TAGLINE = {
  elementary: '词法与时态入门',
  junior: '复合句 · 语态 · 从句',
  senior: '虚拟 · 倒装 · 综合',
}

function getLessonStats(data, progress) {
  const total = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

export default function Grammar({ onImport, onClose, onGrammarSyncPractice, progress = {}, active = true, isMember = true, onShowLogin, unlocks, crystalBalance = 0, onGoShop }) {
  const [stage, setStage] = useState(null)
  const [tense, setTense] = useState(null)

  if (tense) {
    const stageObj = STAGES.find(s => s.id === stage)
    const tenseObj = stageObj.tenses.find(t => t.id === tense)
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <PageBackBar onBack={() => setTense(null)} label={`返回${stageObj.label}列表`} />
        <div className="rounded-3xl overflow-hidden border border-white/15 mb-6 mt-2 flex flex-col bg-slate-900/40 backdrop-blur-xl shadow-md"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.25)' }}>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* 顶部一行：图标 + 标题 + 按钮（手机版） */}
            <div className="flex items-center gap-3 sm:gap-0 sm:contents">
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${stageObj.color} backdrop-blur-xl border border-white/10 flex items-center justify-center text-2xl sm:text-3xl shrink-0`}>
                {stageObj.icon}
              </div>
              <div className="flex-1 min-w-0 sm:hidden">
                <div className="text-lg font-bold text-white truncate">{tenseObj.name}</div>
                <div className="text-gray-400 text-xs truncate">{tenseObj.desc}</div>
              </div>
              <button onClick={() => onImport(tenseObj.data, `${stageObj.label} · ${tenseObj.name} · 全部`, null, buildGrammarLessonPackMeta(tenseObj.id))}
                className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-blue-600/85 backdrop-blur border border-blue-400/40 hover:bg-blue-500/90 text-white font-semibold text-xs sm:text-sm transition-colors shrink-0 sm:order-last">
                ▶ 全部练习
              </button>
            </div>
            {/* 中间内容（在 sm+ 占 flex-1，在手机占全宽） */}
            <div className="flex-1 min-w-0 w-full">
              <div className="hidden sm:block text-xl font-bold text-white mb-1">{tenseObj.name}</div>
              <div className="hidden sm:block text-gray-400 text-sm mb-3">{tenseObj.desc}</div>
              {GRAMMAR_LEARNING_UI_ENABLED && (() => {
                const gm = getGrammarTopicMeta(tenseObj.id)
                if (!gm) return null
                return (
                  <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-3 py-2.5 space-y-2">
                    <div className="text-[10px] font-semibold text-blue-400/90 uppercase tracking-wider">学习目标</div>
                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4 leading-relaxed break-words">
                      {gm.grammarPurpose.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    {gm.coreRules?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold text-amber-500/90 uppercase tracking-wider mb-0.5">核心规则</div>
                        <ul className="text-xs text-gray-400 space-y-0.5 list-decimal pl-4 break-words">
                          {gm.coreRules.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })()}
              {(() => {
                const stats = getLessonStats(tenseObj.data, progress)
                const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums shrink-0">{stats.attempted}/{stats.total} 句</span>
                  </div>
                )
              })()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGrammarSyncPractice?.(tenseObj.data, `${stageObj.label} · ${tenseObj.name} · 本专题`, tenseObj.data)}
            className="w-full py-2 text-xs font-semibold text-white bg-green-700/70 backdrop-blur border-t border-white/10 hover:bg-green-600/80 transition-colors text-center"
          >
            {tenseObj.name} 同步练习
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tenseObj.lessons.map((lesson, i) => {
            // 阶段已通过外层宝石锁控制，课节全部开放（单层锁标准）
            const locked = false
            const data = tenseObj.data.slice(lesson.slice[0], lesson.slice[1])
            const stats = getLessonStats(data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            const lessonTitle = `${stageObj.label} · ${tenseObj.name} · ${lesson.label}`
            return (
              <div key={i} className={`text-left rounded-2xl overflow-hidden border flex flex-col transition-all bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 hover:scale-[1.02]
                ${locked ? 'border-white/10 opacity-60' : 'border-white/15 hover:border-white/25'}`}
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.2)' }}>
                <button
                  type="button"
                  onClick={() => locked ? onShowLogin?.() : onImport(data, lessonTitle, null, buildGrammarLessonPackMeta(tenseObj.id))}
                  className="p-4 flex flex-col gap-2 flex-1 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white text-sm font-medium">{lesson.label}</span>
                    {locked
                      ? <span className="text-gray-500 text-sm shrink-0">🔒</span>
                      : done
                        ? <span className="text-xs text-green-300 bg-green-500/15 border border-green-500/30 px-2 py-0.5 rounded-full shrink-0">已完成</span>
                        : stats.attempted > 0
                          ? <span className="text-xs text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full shrink-0">进行中</span>
                          : <span className="text-xs text-gray-400 bg-slate-800/50 border border-white/10 px-2 py-0.5 rounded-full shrink-0">{data.length} 句</span>
                    }
                  </div>
                  <div className="w-full h-1 bg-slate-800/60 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-400' : 'bg-blue-400'}`} style={{ width: `${percent}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 leading-snug line-clamp-2">{lesson.desc}</div>
                </button>
                <button
                  type="button"
                  onClick={() => locked ? onShowLogin?.() : onGrammarSyncPractice?.(data, lessonTitle, tenseObj.data)}
                  className={`w-full py-2 text-xs font-semibold text-white border-t border-white/10 backdrop-blur transition-colors text-center rounded-b-2xl ${locked ? 'bg-gray-700/50' : 'bg-green-700/70 hover:bg-green-600/80'}`}
                >
                  {locked ? '🔒 会员专属' : `${lesson.label} 同步练习`}
                </button>
              </div>
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
        <PageBackBar onBack={() => setStage(null)} label="返回语法首页" />
        <div className="rounded-3xl overflow-hidden border border-white/15 mb-6 mt-2 bg-slate-900/40 backdrop-blur-xl shadow-md"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.25)' }}>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-0 sm:contents">
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${stageObj.color} backdrop-blur-xl border border-white/10 flex items-center justify-center text-2xl sm:text-3xl shrink-0`}>
                {stageObj.icon}
              </div>
              <div className="flex-1 min-w-0 sm:hidden">
                <div className="text-lg font-bold text-white truncate">{stageObj.label}语法专项</div>
                <div className="text-gray-400 text-xs">{stageObj.tenses.length} 个专题 · 共 {allData.length} 句</div>
              </div>
              <button onClick={() => onImport(allData, `${stageObj.label}语法 · 全阶段`)}
                className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-blue-600/85 backdrop-blur border border-blue-400/40 hover:bg-blue-500/90 text-white font-semibold text-xs sm:text-sm transition-colors shrink-0 sm:order-last">
                ▶ 全阶段练习
              </button>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="hidden sm:block text-xl font-bold text-white mb-1">{stageObj.label}语法专项</div>
              <div className="hidden sm:block text-gray-400 text-sm mb-3">{stageObj.tenses.length} 个专题 · 共 {allData.length} 句</div>
              {(() => {
                const stats = getLessonStats(allData, progress)
                const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums shrink-0">{stats.attempted}/{stats.total} 句</span>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stageObj.tenses.map((t, ti) => {
            // 阶段已通过外层宝石锁控制，专题全部开放（单层锁标准）
            const locked = false
            const stats = getLessonStats(t.data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            return (
              <button key={t.id}
                type="button"
                onClick={() => locked ? onShowLogin?.() : setTense(t.id)}
                className={`text-left rounded-2xl overflow-hidden border bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 transition-all hover:scale-[1.02] active:scale-[0.98]
                  ${locked ? 'border-white/10 opacity-60' : 'border-white/15 hover:border-white/25'}
                  p-4 flex flex-col gap-2`}
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.2)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-white text-sm font-medium">{t.name}</span>
                  {locked
                    ? <span className="text-gray-500 text-sm shrink-0">🔒</span>
                    : done
                      ? <span className="text-xs text-green-300 bg-green-500/15 border border-green-500/30 px-2 py-0.5 rounded-full shrink-0">已完成</span>
                      : stats.attempted > 0
                        ? <span className="text-xs text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full shrink-0">进行中</span>
                        : <span className="text-xs text-gray-400 bg-slate-800/50 border border-white/10 px-2 py-0.5 rounded-full shrink-0">{t.data.length} 句</span>
                  }
                </div>
                <div className="w-full h-1 bg-slate-800/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-400' : 'bg-blue-400'}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-0.5">
                  <span>{t.desc}</span>
                  <span className="text-gray-500 shrink-0 ml-1">{t.lessons.length} 课</span>
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
        {(() => {
          // 每阶段的整体进度，用于「上一阶段 60% 自动解锁」
          const stagePercents = STAGES.map(s => {
            const all = s.tenses.flatMap(t => t.data)
            const st = getLessonStats(all, progress)
            return st.total ? Math.round((st.attempted / st.total) * 100) : 0
          })
          return STAGES.map((s, idx) => {
            const allData = s.tenses.flatMap(t => t.data)
            const stats = getLessonStats(allData, progress)
            const percent = stagePercents[idx]
            const previewNames = s.tenses.slice(0, 3).map(t => t.name).join('、')
            const previewLine = `${previewNames} 等 ${s.tenses.length} 个专题`
            const tagline = STAGE_COVER_TAGLINE[s.id] || ''
            const itemId = `stage_${s.id}`
            const prevPct = idx > 0 ? stagePercents[idx - 1] : 100
            const locked = idx > 0 &&
              !isMember &&
              !(unlocks?.isUnlocked?.('grammar', itemId)) &&
              prevPct < 60
            const COST = 30
            const card = (
            <button
              type="button"
              onClick={() => setStage(s.id)}
              className="w-full flex flex-col rounded-3xl overflow-hidden border border-white/15 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-left bg-slate-900/40 backdrop-blur-xl shadow-md"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.25)' }}
            >
              <div className={`w-full aspect-[5/4] max-h-[180px] sm:max-h-[200px] flex items-center justify-center overflow-hidden relative bg-gradient-to-br ${s.color} backdrop-blur-xl backdrop-saturate-150`}>
                <div className="absolute inset-1.5 sm:inset-2 flex flex-col items-center justify-center p-2 sm:p-2.5 text-center border-2 border-white/15 rounded-2xl gap-0.5 sm:gap-1">
                  <span className="text-white/85 text-[10px] font-bold tracking-[0.15em] drop-shadow-sm shrink-0">语法专项</span>
                  <span className="text-white text-xl sm:text-2xl font-black tracking-widest drop-shadow-md leading-tight">
                    {s.label}
                  </span>
                  <span className="text-3xl sm:text-4xl leading-none my-0.5 drop-shadow-md" aria-hidden>{s.icon}</span>
                  <span className="text-white/85 text-[10px] sm:text-[11px] font-semibold tracking-wide mt-0.5 leading-snug px-1 line-clamp-2">
                    {tagline}
                  </span>
                </div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-md p-3 flex flex-col gap-1.5 border-t border-white/10">
                <div className="text-sm font-medium text-white truncate">{s.label}阶段语法</div>
                <div className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{previewLine}</div>
                <div className="w-full h-1 bg-slate-800/60 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <div className="text-xs text-gray-500">
                  {s.tenses.length} 专题 · {allData.length} 句 · {percent}%
                </div>
              </div>
            </button>
            )
            return (
              <div key={s.id} className="relative">
                <LockedOverlay
                  locked={locked}
                  cost={COST}
                  color="blue"
                  crystalBalance={crystalBalance}
                  title={`${s.label}阶段语法`}
                  reason={`完成上一阶段 60%，或花费 ${COST} 钻石提前开启`}
                  onUnlock={() => unlocks?.unlock?.('grammar', itemId, COST, 'blue')}
                  onGoShop={onGoShop}
                >
                  {card}
                </LockedOverlay>
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}
