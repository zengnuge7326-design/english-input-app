import { useState, useEffect } from 'react'
import core50Data  from '../data/core50.json'
import core100Data from '../data/core100.json'
import core60Data  from '../data/core60.json'

// ── 课程配置 ────────────────────────────────────────────
const CORE50_LESSONS = [
  { label: 'L1', title: 'I am / I have / I like',      desc: '基础陈述',  ids: [50001,50002,50003,50004,50005,50006,50007,50008,50009,50010] },
  { label: 'L2', title: 'I want / I need / Can I',     desc: '表达需求',  ids: [50011,50012,50013,50014,50015,50016,50017,50018,50019,50020] },
  { label: 'L3', title: 'There is / This is / It is',  desc: '描述句型',  ids: [50021,50022,50023,50024,50025,50026,50027,50028,50029,50030] },
  { label: 'L4', title: 'I think / I feel / I hope',   desc: '内心感受',  ids: [50031,50032,50033,50034,50035,50036,50037,50038,50039,50040] },
  { label: 'L5', title: "Let's / I'm going to / I will", desc: '行动计划', ids: [50041,50042,50043,50044,50045,50046,50047,50048,50049,50050] },
]

const CORE100_LESSONS = [
  { label: 'L1',  title: '基础扩展 · 时态入门',         desc: '陈述 / 现在时',      ids: [51001,51002,51003,51004,51005,51006,51007,51008,51009,51010] },
  { label: 'L2',  title: '时态综合',                    desc: '过去 / 将来 / 完成时', ids: [51011,51012,51013,51014,51015,51016,51017,51018,51019,51020] },
  { label: 'L3',  title: '从句 · because / if',         desc: '原因与条件',          ids: [51021,51022,51023,51024,51025,51026,51027,51028,51029,51030] },
  { label: 'L4',  title: '从句 · when / while / before', desc: '时间连词',           ids: [51031,51032,51033,51034,51035,51036,51037,51038,51039,51040] },
  { label: 'L5',  title: '定语从句 · which / who / what', desc: '关系词',            ids: [51041,51042,51043,51044,51045,51046,51047,51048,51049,51050] },
  { label: 'L6',  title: '情态动词 · 比较级',            desc: 'must / may / bigger', ids: [51051,51052,51053,51054,51055,51056,51057,51058,51059,51060] },
  { label: 'L7',  title: '目的 · 结果 · 观点',           desc: 'to do / so that',    ids: [51061,51062,51063,51064,51065,51066,51067,51068,51069,51070] },
  { label: 'L8',  title: '观点 · 经历 · 被动',           desc: 'agree / have done',  ids: [51071,51072,51073,51074,51075,51076,51077,51078,51079,51080] },
  { label: 'L9',  title: '被动 · 疑问 · 连接',           desc: 'passive / wh- / and', ids: [51081,51082,51083,51084,51085,51086,51087,51088,51089,51090] },
  { label: 'L10', title: '逻辑连词 · 日常表达',          desc: 'however / although', ids: [51091,51092,51093,51094,51095,51096,51097,51098,51099,51100] },
]

const CORE60_LESSONS = [
  { label: 'L1', title: '五大句型 · 时态全览',           desc: 'S+V / S+V+O / 时态',   ids: [52001,52002,52003,52004,52005,52006,52007,52008,52009,52010] },
  { label: 'L2', title: '情态动词 · 疑问 · 比较',        desc: 'can/must / wh- / than', ids: [52011,52012,52013,52014,52015,52016,52017,52018,52019,52020] },
  { label: 'L3', title: '目的 · 结果 · 被动 · 条件',     desc: 'to / passive / if',     ids: [52021,52022,52023,52024,52025,52026,52027,52028,52029,52030] },
  { label: 'L4', title: '时间从句 · 名词从句 · 关系从句', desc: 'before / that / who',   ids: [52031,52032,52033,52034,52035,52036,52037,52038,52039,52040] },
  { label: 'L5', title: '逻辑连词 · 观点 · 经历',        desc: 'although / I think',    ids: [52041,52042,52043,52044,52045,52046,52047,52048,52049,52050] },
  { label: 'L6', title: '进阶表达 · 综合语法',           desc: 'wish / gerund / the more', ids: [52051,52052,52053,52054,52055,52056,52057,52058,52059,52060] },
]

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
function LessonGrid({ lessons, dataMap, accentColor, titlePrefix, onImport, onSync, progress }) {
  const barColor = { emerald: 'bg-emerald-500', violet: 'bg-violet-500', sky: 'bg-sky-500' }[accentColor]
  const border   = { emerald: 'hover:border-emerald-700/60', violet: 'hover:border-violet-700/60', sky: 'hover:border-sky-700/60' }[accentColor]
  const syncBg   = { emerald: 'bg-emerald-700 hover:bg-emerald-600 border-emerald-900', violet: 'bg-violet-700 hover:bg-violet-600 border-violet-900', sky: 'bg-sky-700 hover:bg-sky-600 border-sky-900' }[accentColor]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {lessons.map((lesson, i) => {
        const data  = lesson.ids.map(id => dataMap[id]).filter(Boolean)
        const stats = getLessonStats(data, progress)
        const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
        return (
          <div key={i} className={`bg-gray-900 border border-gray-800 ${border} rounded-xl overflow-hidden flex flex-col transition-colors`}>
            <button
              onClick={() => onImport(data, `${titlePrefix} · ${lesson.label}`)}
              className="text-left p-3 flex flex-col gap-1.5 flex-1"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-white text-sm font-semibold">{lesson.label}</span>
                <StatusBadge {...stats} />
              </div>
              <div className="text-xs text-gray-400 leading-snug line-clamp-2">{lesson.title}</div>
              <div className="text-xs text-gray-600">{lesson.desc}</div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-auto">
                <div className={`h-full rounded-full transition-all duration-500 ${stats.mastered === stats.total && stats.total > 0 ? 'bg-green-500' : barColor}`}
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-gray-600">{stats.attempted}/{stats.total} 句</div>
            </button>
            <button
              onClick={() => onSync(`${titlePrefix} · ${lesson.label}`)}
              className={`w-full py-1.5 text-xs font-semibold text-white ${syncBg} border-t transition-colors text-center`}
            >
              同步练习
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── 课程详情头部 ─────────────────────────────────────────
function CourseHeader({ emoji, title, subtitle, percent, attempted, total, accentColor, onStart }) {
  const bar  = { emerald: 'bg-emerald-500', violet: 'bg-violet-500', sky: 'bg-sky-500' }[accentColor]
  const btn  = { emerald: 'bg-emerald-600 hover:bg-emerald-500', violet: 'bg-violet-600 hover:bg-violet-500', sky: 'bg-sky-600 hover:bg-sky-500' }[accentColor]
  const grad = { emerald: 'from-emerald-600 to-teal-800', violet: 'from-violet-600 to-purple-800', sky: 'from-sky-600 to-blue-800' }[accentColor]
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-3xl shrink-0`}>{emoji}</div>
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

// ── 同步练习弹窗 ─────────────────────────────────────────
function SyncPopup({ label, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-3">📝</div>
        <div className="text-white font-semibold mb-1">{label}</div>
        <div className="text-gray-400 text-sm mb-1">同步练习</div>
        <div className="text-gray-500 text-xs mb-5">即将上线，敬请期待</div>
        <button onClick={onClose} className="px-6 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">关闭</button>
      </div>
    </div>
  )
}

// ── 主组件 ───────────────────────────────────────────────
export default function CoreSentences({ onImport, onSetBack, progress = {} }) {
  const [section,   setSection]   = useState(null)   // null | 'core50' | 'core100' | 'core60'
  const [syncPopup, setSyncPopup] = useState(null)   // label string | null

  useEffect(() => {
    onSetBack?.(section ? () => () => setSection(null) : null)
  }, [section, onSetBack])

  // ── 50基础句式 ─────────────────────────────────────────
  if (section === 'core50') {
    const stats = getLessonStats(core50Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        {syncPopup && <SyncPopup label={syncPopup} onClose={() => setSyncPopup(null)} />}
        <CourseHeader emoji="✨" title="50 基础句式" accentColor="emerald"
          subtitle="5课 · 50句 · 入门核心句型" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE50_LESSONS[0].ids.map(id => core50Map[id]).filter(Boolean), '基础句式 · L1')} />
        <LessonGrid lessons={CORE50_LESSONS} dataMap={core50Map} accentColor="emerald"
          titlePrefix="基础句式" onImport={onImport} onSync={setSyncPopup} progress={progress} />
      </div>
    )
  }

  // ── 100中级句式 ────────────────────────────────────────
  if (section === 'core100') {
    const stats = getLessonStats(core100Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        {syncPopup && <SyncPopup label={syncPopup} onClose={() => setSyncPopup(null)} />}
        <CourseHeader emoji="🎯" title="100 中级句式" accentColor="violet"
          subtitle="10课 · 100句 · 时态 / 从句 / 逻辑表达" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE100_LESSONS[0].ids.map(id => core100Map[id]).filter(Boolean), '中级句式 · L1')} />
        <LessonGrid lessons={CORE100_LESSONS} dataMap={core100Map} accentColor="violet"
          titlePrefix="中级句式" onImport={onImport} onSync={setSyncPopup} progress={progress} />
      </div>
    )
  }

  // ── 60综合句式 ─────────────────────────────────────────
  if (section === 'core60') {
    const stats = getLessonStats(core60Data, progress)
    const pct   = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        {syncPopup && <SyncPopup label={syncPopup} onClose={() => setSyncPopup(null)} />}
        <CourseHeader emoji="🔬" title="60 综合句式" accentColor="sky"
          subtitle="6课 · 60句 · 语法体系全覆盖" percent={pct} attempted={stats.attempted} total={stats.total}
          onStart={() => onImport(CORE60_LESSONS[0].ids.map(id => core60Map[id]).filter(Boolean), '综合句式 · L1')} />
        <LessonGrid lessons={CORE60_LESSONS} dataMap={core60Map} accentColor="sky"
          titlePrefix="综合句式" onImport={onImport} onSync={setSyncPopup} progress={progress} />
      </div>
    )
  }

  // ── 主页（三张入口卡）─────────────────────────────────
  const cards = [
    {
      key: 'core50', section: 'core50', emoji: '✨', color: 'emerald',
      grad: 'from-emerald-900/80 to-teal-900/80', textColor: 'text-emerald-300',
      border: 'hover:border-emerald-600/60',
      title: '50 基础句式', tag: '50 Core Patterns · Beginner',
      desc: 'I am / I have / There is / Let\'s 等入门结构',
      lessons: CORE50_LESSONS, map: core50Map,
      dot: { active: 'bg-emerald-400', done: 'bg-green-500' },
      meta: '5 课 · 50 句',
    },
    {
      key: 'core100', section: 'core100', emoji: '🎯', color: 'violet',
      grad: 'from-violet-900/80 to-purple-900/80', textColor: 'text-violet-300',
      border: 'hover:border-violet-600/60',
      title: '100 中级句式', tag: '100 Patterns · Intermediate',
      desc: '时态 / 从句 / 比较级 / 被动语态 / 逻辑连词',
      lessons: CORE100_LESSONS, map: core100Map,
      dot: { active: 'bg-violet-400', done: 'bg-green-500' },
      meta: '10 课 · 100 句',
    },
    {
      key: 'core60', section: 'core60', emoji: '🔬', color: 'sky',
      grad: 'from-sky-900/80 to-blue-900/80', textColor: 'text-sky-300',
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">核心句群</h2>
        <span className="text-xs text-gray-500">入门 · 中级 · 综合</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(c => (
          <button key={c.key} onClick={() => setSection(c.section)}
            className={`flex flex-col rounded-2xl overflow-hidden border border-gray-700 ${c.border} transition-all text-left`}>
            <div className={`w-full h-24 bg-gradient-to-br ${c.grad} flex flex-col items-center justify-center gap-1.5`}>
              <span className="text-3xl">{c.emoji}</span>
              <span className={`${c.textColor} text-xs font-semibold tracking-wider uppercase`}>{c.tag}</span>
            </div>
            <div className="bg-gray-900 p-4 flex flex-col gap-1">
              <div className="text-sm font-bold text-white">{c.title}</div>
              <div className="text-xs text-gray-400">{c.desc}</div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {c.lessons.map((l, i) => {
                  const data  = l.ids.map(id => c.map[id]).filter(Boolean)
                  const stats = getLessonStats(data, progress)
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${stats.mastered === stats.total && stats.total > 0 ? c.dot.done : stats.attempted > 0 ? c.dot.active : 'bg-gray-700'}`} />
                      <span className="text-gray-600 text-xs">{l.label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="text-xs text-gray-600 mt-1">{c.meta}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
