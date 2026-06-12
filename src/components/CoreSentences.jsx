import { useState, useEffect } from 'react'
import PageBackBar from './PageBackBar'
import LockedOverlay from './LockedOverlay'
import CourseParchmentBanner from './CourseParchmentBanner'
import TextbookParchmentCover from './TextbookParchmentCover'
import core50Data from '../data/core50.json'
import core100Data from '../data/core100.json'
import core60Data from '../data/core60.json'
import { CORE50_LESSONS, CORE100_LESSONS, CORE60_LESSONS } from '../data/coreSentences/lessons.js'
import { CORE_QUIZ_BANK as CORE50_QUIZ } from '../data/coreSentences/core50_quiz.js'
import { CORE_QUIZ_BANK as CORE100_QUIZ } from '../data/coreSentences/core100_quiz.js'
import { CORE_QUIZ_BANK as CORE60_QUIZ } from '../data/coreSentences/core60_quiz.js'
import { adaptCoreQuizQuestions } from '../data/coreSentences/quizAdapter.js'

// ── id 映射 ─────────────────────────────────────────────
const core50Map  = Object.fromEntries(core50Data.map(s  => [s.id, s]))
const core100Map = Object.fromEntries(core100Data.map(s => [s.id, s]))
const core60Map  = Object.fromEntries(core60Data.map(s  => [s.id, s]))

// ── 进度统计 ────────────────────────────────────────────
function getLessonStats(data, progress) {
  const total     = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered  = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

function StatusBadge({ attempted, mastered, total }) {
  if (mastered === total && total > 0)
    return <span className="text-xs text-green-400 bg-green-900/40 border border-green-700/50 px-1.5 py-0.5 rounded-full">✓</span>
  if (attempted > 0)
    return <span className="text-xs text-blue-400 bg-blue-900/40 border border-blue-700/50 px-1.5 py-0.5 rounded-full">学习中</span>
  return <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">待开始</span>
}

// ── 课程卡网格 ───────────────────────────────────────────
function LessonGrid({ lessons, dataMap, quizBank, accentColor, titlePrefix, onImport, onExerciseQuiz, progress, isMember = true, onShowLogin, returnSection }) {
  const barColor = { emerald: 'bg-emerald-500', violet: 'bg-violet-500', sky: 'bg-sky-500' }[accentColor]
  const border   = { emerald: 'hover:border-emerald-700/60', violet: 'hover:border-violet-700/60', sky: 'hover:border-sky-700/60' }[accentColor]
  const syncBg   = { emerald: 'bg-emerald-700 hover:bg-emerald-600 border-emerald-900', violet: 'bg-violet-700 hover:bg-violet-600 border-violet-900', sky: 'bg-sky-700 hover:bg-sky-600 border-sky-900' }[accentColor]
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(() => {
          const buildLoader = (idx) => {
            if (idx >= lessons.length - 1) return null
            const next = lessons[idx + 1]
            return () => {
              const nextData = next.ids.map(id => dataMap[id]).filter(Boolean)
              onImport(nextData, `${titlePrefix} · ${next.label}`, buildLoader(idx + 1))
            }
          }
          return lessons.map((lesson, i) => {
            // 节已通过外层宝石锁控制，课节全部开放（单层锁标准）
            const locked = false
            const data  = lesson.ids.map(id => dataMap[id]).filter(Boolean)
            const stats = getLessonStats(data, progress)
            const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            return (
              <div key={i} className={`bg-slate-800 border rounded-xl overflow-hidden flex flex-col transition-colors ${locked ? 'border-slate-700/50 opacity-70' : `border-slate-700 ${border}`}`}>
                <button
                  onClick={() => locked ? onShowLogin?.() : onImport(data, `${titlePrefix} · ${lesson.label}`, buildLoader(i))}
                  className="text-left p-3 flex flex-col gap-1.5 flex-1"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-white text-sm font-semibold">{lesson.label}</span>
                    {locked ? <span className="text-gray-500 text-sm">🔒</span> : <StatusBadge {...stats} />}
                  </div>
                  <div className="text-xs text-gray-400 leading-snug line-clamp-2">{lesson.title}</div>
                  <div className="text-xs text-gray-600">{lesson.desc}</div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-auto">
                    <div className={`h-full rounded-full transition-all duration-500 ${stats.mastered === stats.total && stats.total > 0 ? 'bg-green-500' : barColor}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-gray-600">{stats.attempted}/{stats.total} 句</div>
                </button>
                {(() => {
                  const hasQuiz = !locked && quizBank?.[lesson.label]?.length >= 8
                  const openQuiz = () => {
                    const raw = quizBank[lesson.label]
                    const questions = adaptCoreQuizQuestions(raw)
                    if (!questions.length) return
                    const title = `${titlePrefix} · ${lesson.label} · 同步练习`
                    const payload = { questions, title, returnSection, lessonLabel: lesson.label }
                    onExerciseQuiz?.({
                      ...payload,
                      onRetry: () => onExerciseQuiz?.(payload),
                    })
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (locked) onShowLogin?.()
                        else if (hasQuiz) openQuiz()
                      }}
                      disabled={!locked && !hasQuiz}
                      className={`w-full py-1.5 text-xs font-semibold border-t transition-colors text-center
                        ${locked ? 'bg-gray-700 border-gray-800 text-white' : hasQuiz ? `text-white ${syncBg}` : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      {locked ? '🔒 会员专属' : hasQuiz ? '同步练习' : '敬请期待'}
                    </button>
                  )
                })()}
              </div>
            )
          })
        })()}
      </div>
    </>
  )
}

// ── 课程详情头部 ─────────────────────────────────────────
function CourseHeader({ emoji, title, subtitle, percent, attempted, total, accentColor, onStart, parchmentGrad, coverText, parchmentLabel, parchmentSubject }) {
  const bar  = { emerald: 'bg-emerald-500', violet: 'bg-violet-500', sky: 'bg-sky-500' }[accentColor]
  const btn  = { emerald: 'bg-emerald-600 hover:bg-emerald-500', violet: 'bg-violet-600 hover:bg-violet-500', sky: 'bg-sky-600 hover:bg-sky-500' }[accentColor]
  const grad = parchmentGrad || { emerald: 'from-emerald-600 to-teal-800', violet: 'from-violet-600 to-purple-800', sky: 'from-sky-600 to-blue-800' }[accentColor]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 flex items-center gap-6">
      <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-800">
        <TextbookParchmentCover
          gradient={grad}
          label={parchmentLabel || '核心句群'}
          coverText={coverText || ''}
          subject={parchmentSubject || title}
          emoji={emoji}
          variant="compact"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xl font-bold text-white mb-1">{title}</div>
        <div className="text-gray-400 text-sm mb-3">{subtitle}</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-gray-500 tabular-nums shrink-0">{attempted}/{total} 句</span>
        </div>
      </div>
      <button onClick={onStart} className={`px-6 py-2.5 rounded-xl ${btn} text-white font-semibold text-sm transition-colors shrink-0`}>
        ▶ 开始学习
      </button>
    </div>
  )
}

// ── 主组件 ───────────────────────────────────────────────
export default function CoreSentences({
  onImport,
  progress = {},
  active = true,
  onClose,
  isMember = true,
  onShowLogin,
  onExerciseQuiz,
  initialSection = null,
  unlocks,
  crystalBalance = 0,
  onGoShop,
}) {
  const [section, setSection] = useState(initialSection) // null | 'core50' | 'core100' | 'core60'

  useEffect(() => {
    if (initialSection) setSection(initialSection)
  }, [initialSection])

  // ── 50基础句式 ─────────────────────────────────────────
  if (section === 'core50') {
    const stats = getLessonStats(core50Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <PageBackBar onBack={() => setSection(null)} label="返回核心句群" />
        <CourseHeader emoji="✨" title="50 基础句式" accentColor="emerald"
          parchmentGrad="from-emerald-600 to-teal-800" coverText="50" parchmentLabel="Beginner" parchmentSubject="基础句式"
          subtitle="5课 · 50句 · 入门核心句型" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE50_LESSONS[0].ids.map(id => core50Map[id]).filter(Boolean), '基础句式 · L1')} />
        <LessonGrid lessons={CORE50_LESSONS} dataMap={core50Map} quizBank={CORE50_QUIZ} accentColor="emerald"
          titlePrefix="基础句式" onImport={onImport} onExerciseQuiz={onExerciseQuiz} progress={progress}
          isMember={isMember} onShowLogin={onShowLogin} returnSection="core50" />
      </div>
    )
  }

  // ── 100中级句式 ────────────────────────────────────────
  if (section === 'core100') {
    const stats = getLessonStats(core100Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <PageBackBar onBack={() => setSection(null)} label="返回核心句群" />
        <CourseHeader emoji="🎯" title="100 中级句式" accentColor="violet"
          parchmentGrad="from-violet-600 to-purple-800" coverText="100" parchmentLabel="Intermediate" parchmentSubject="中级句式"
          subtitle="10课 · 100句 · 时态 / 从句 / 逻辑表达" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE100_LESSONS[0].ids.map(id => core100Map[id]).filter(Boolean), '中级句式 · L1')} />
        <LessonGrid lessons={CORE100_LESSONS} dataMap={core100Map} quizBank={CORE100_QUIZ} accentColor="violet"
          titlePrefix="中级句式" onImport={onImport} onExerciseQuiz={onExerciseQuiz} progress={progress}
          isMember={isMember} onShowLogin={onShowLogin} returnSection="core100" />
      </div>
    )
  }

  // ── 60综合句式 ─────────────────────────────────────────
  if (section === 'core60') {
    const stats = getLessonStats(core60Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <PageBackBar onBack={() => setSection(null)} label="返回核心句群" />
        <CourseHeader emoji="🔬" title="60 综合句式" accentColor="sky"
          parchmentGrad="from-sky-600 to-blue-800" coverText="60" parchmentLabel="Comprehensive" parchmentSubject="综合句式"
          subtitle="6课 · 60句 · 语法体系全覆盖" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE60_LESSONS[0].ids.map(id => core60Map[id]).filter(Boolean), '综合句式 · L1')} />
        <LessonGrid lessons={CORE60_LESSONS} dataMap={core60Map} quizBank={CORE60_QUIZ} accentColor="sky"
          titlePrefix="综合句式" onImport={onImport} onExerciseQuiz={onExerciseQuiz} progress={progress}
          isMember={isMember} onShowLogin={onShowLogin} returnSection="core60" />
      </div>
    )
  }

  // ── 主页（三张入口卡）─────────────────────────────────
  const cards = [
    {
      key: 'core50', section: 'core50', emoji: '✨', color: 'emerald',
      grad: 'from-emerald-900/80 to-teal-900/80', parchmentGrad: 'from-emerald-600 to-teal-800',
      coverText: '50', parchmentLabel: 'Beginner', parchmentSubject: '基础句式',
      textColor: 'text-emerald-300',
      border: 'hover:border-emerald-600/60',
      title: '50 基础句式', tag: '50 Core Patterns · Beginner',
      desc: 'I am / I have / There is / Let\'s 等入门结构',
      lessons: CORE50_LESSONS, map: core50Map,
      dot: { active: 'bg-emerald-400', done: 'bg-green-500' },
      meta: '5 课 · 50 句',
    },
    {
      key: 'core100', section: 'core100', emoji: '🎯', color: 'violet',
      grad: 'from-violet-900/80 to-purple-900/80', parchmentGrad: 'from-violet-600 to-purple-800',
      coverText: '100', parchmentLabel: 'Intermediate', parchmentSubject: '中级句式',
      textColor: 'text-violet-300',
      border: 'hover:border-violet-600/60',
      title: '100 中级句式', tag: '100 Patterns · Intermediate',
      desc: '时态 / 从句 / 比较级 / 被动语态 / 逻辑连词',
      lessons: CORE100_LESSONS, map: core100Map,
      dot: { active: 'bg-violet-400', done: 'bg-green-500' },
      meta: '10 课 · 100 句',
    },
    {
      key: 'core60', section: 'core60', emoji: '🔬', color: 'sky',
      grad: 'from-sky-900/80 to-blue-900/80', parchmentGrad: 'from-sky-600 to-blue-800',
      coverText: '60', parchmentLabel: 'Comprehensive', parchmentSubject: '综合句式',
      textColor: 'text-sky-300',
      border: 'hover:border-sky-600/60',
      title: '60 综合句式', tag: '60 Patterns · Comprehensive',
      desc: '语法体系全覆盖 · 五大句型到进阶表达',
      lessons: CORE60_LESSONS, map: core60Map,
      dot: { active: 'bg-sky-400', done: 'bg-green-500' },
      meta: '6 课 · 60 句',
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {onClose && <PageBackBar onBack={onClose} label="返回课程广场" />}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">核心句群</h2>
          <p className="text-xs text-slate-400 mt-1">3 个等级 · 210 句精选 · 从入门到综合表达</p>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">3 tiers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(() => {
          // 每节整体进度（用于「上一节 60% 自动解锁」）
          const sectionPcts = cards.map(c => {
            const all = c.lessons.flatMap(l => l.ids.map(id => c.map[id]).filter(Boolean))
            const st = getLessonStats(all, progress)
            return st.total ? Math.round((st.attempted / st.total) * 100) : 0
          })
          return cards.map((c, ci) => {
          const allData = c.lessons.flatMap(l => l.ids.map(id => c.map[id]).filter(Boolean))
          const totalStats = getLessonStats(allData, progress)
          const overallPct = totalStats.total ? Math.round((totalStats.attempted / totalStats.total) * 100) : 0
          const doneLessons = c.lessons.filter(l => {
            const s = getLessonStats(l.ids.map(id => c.map[id]).filter(Boolean), progress)
            return s.mastered === s.total && s.total > 0
          }).length
          // 第一节免费；其余看上一节 60% / 已解锁 / 会员（单层宝石锁标准）
          const prevPct = ci > 0 ? sectionPcts[ci - 1] : 100
          const locked = ci > 0 &&
            !isMember &&
            !(unlocks?.isUnlocked?.('core', c.key)) &&
            prevPct < 60
          const COST = 30
          const card = (
            <button onClick={() => setSection(c.section)}
              className={`group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 ${c.border} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left`}>
              {/* 羊皮卷封面 */}
              <CourseParchmentBanner
                className="h-32"
                gradient={c.parchmentGrad}
                label={c.parchmentLabel}
                coverText={c.coverText}
                subject={c.parchmentSubject}
                emoji={c.emoji}
              />
              {/* 主体 */}
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-white">{c.title}</span>
                  <span className={`text-[10px] ${c.textColor} font-mono font-semibold`}>{overallPct}%</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{c.desc}</p>
                {/* 进度条 */}
                <div className="h-1.5 w-full rounded-full bg-slate-700/60 overflow-hidden mt-1">
                  <div className={`h-full rounded-full bg-gradient-to-r ${c.grad} brightness-150 transition-all duration-700`}
                    style={{ width: `${overallPct}%` }} />
                </div>
                {/* lesson dots */}
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {c.lessons.map((l, i) => {
                    const data  = l.ids.map(id => c.map[id]).filter(Boolean)
                    const stats = getLessonStats(data, progress)
                    const done = stats.mastered === stats.total && stats.total > 0
                    const active = stats.attempted > 0 && !done
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ring-1 ${done ? 'bg-emerald-400 ring-emerald-400/40' : active ? `${c.dot.active} ring-white/30 animate-pulse` : 'bg-slate-700 ring-slate-700/50'}`} />
                        <span className={`text-[9px] tabular-nums ${done ? 'text-emerald-400' : active ? 'text-slate-300' : 'text-slate-600'}`}>{l.label}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-500">{c.meta}</span>
                  <span className="text-[10px] text-slate-500">
                    {doneLessons > 0 && <span className="text-emerald-400">⭐{doneLessons}</span>}
                    <span className={`ml-2 ${c.textColor} opacity-70 group-hover:opacity-100 group-hover:translate-x-1 inline-block transition-all`}>进入 ›</span>
                  </span>
                </div>
              </div>
            </button>
          )
          return (
            <div key={c.key} className="relative">
              <LockedOverlay
                locked={locked}
                cost={COST}
                color="blue"
                crystalBalance={crystalBalance}
                title={c.title}
                reason={`完成上一节 60%，或花费 ${COST} 钻石提前开启`}
                onUnlock={() => unlocks?.unlock?.('core', c.key, COST, 'blue')}
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
