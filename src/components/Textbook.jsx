import { useState, useLayoutEffect } from 'react'
import Unit1Flow from './Unit1Flow'
import LockedOverlay from './LockedOverlay'
import GrammarLesson from './GrammarLesson'
import TextbookParchmentCover from './TextbookParchmentCover'
import { hasGrammar } from '../data/grammar'
import { getGrammarPercent } from '../data/grammar/progress'

// 环形进度组件（仿 Claude Code 小转圈风格）
function RingProgress({ value = 0, size = 56, stroke = 4, accent = '#3b82f6', label, sub }) {
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const off = C * (1 - Math.max(0, Math.min(1, value)))
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={accent} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .55s cubic-bezier(.34,1.56,.64,1), stroke .3s' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {label && <div className="text-white font-bold" style={{ fontSize: size * 0.26 }}>{label}</div>}
        {sub && <div className="text-white/60 font-medium" style={{ fontSize: size * 0.18, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}
import grade4DownData from '../data/grade4_down.json'
import grade3UpData from '../data/grade3_up.json'
import grade3DownData from '../data/grade3_down.json'
import grade4UpData from '../data/grade4_up.json'
import grade5UpData from '../data/grade5_up.json'
import grade5DownData from '../data/grade5_down.json'
import grade6UpData from '../data/grade6_up.json'
import grade6DownData from '../data/grade6_down.json'
import grade7UpData from '../data/grade7_up.json'
import grade7DownData from '../data/grade7_down.json'
import grade8UpData from '../data/grade8_up.json'
import grade8DownData from '../data/grade8_down.json'
import grade9AllData from '../data/grade9_all.json'
import renai7upData from '../data/renai_7up.json'
import renai7downData from '../data/renai_7down.json'
import renai8upData from '../data/renai_8up.json'
import renai8downData from '../data/renai_8down.json'
import renai9upData from '../data/renai_9up.json'
import renai9downData from '../data/renai_9down.json'
import bsdaB1Data from '../data/bsda_b1.json'
import bsdaB2Data from '../data/bsda_b2.json'
import bsdaB3Data from '../data/bsda_b3.json'
import bsdaS1Data from '../data/bsda_s1.json'
import bsdaS2Data from '../data/bsda_s2.json'
import bsdaS3Data from '../data/bsda_s3.json'
import bsdaS4Data from '../data/bsda_s4.json'
import { IconArrowLeft } from './Icons'
import PageBackBar from './PageBackBar'

function lessonsFromUnits(data, descByUnit) {
  if (!Array.isArray(data) || data.length === 0) return []
  const out = []
  let start = 0
  let unit = String(data[0]?.unit ?? '').trim()
  for (let i = 1; i <= data.length; i++) {
    const nextUnit = i < data.length ? String(data[i]?.unit ?? '').trim() : ''
    if (i === data.length || nextUnit !== unit) {
      const label = unit || '全册'
      const len = i - start
      const maxPerChunk = 10
      const needSplit = len > maxPerChunk

      let chunkStart = start
      let chunkIdx = 0
      while (chunkStart < i) {
        let chunkEnd = chunkStart + maxPerChunk
        if (chunkEnd > i) chunkEnd = i
        
        let chunkLabel = label
        if (needSplit) {
          chunkLabel = `${label}${String.fromCharCode(65 + chunkIdx)}`
        }
        
        out.push({
          label: chunkLabel,
          desc: descByUnit[label] || '',
          slice: [chunkStart, chunkEnd],
        })
        
        chunkStart = chunkEnd
        chunkIdx++
      }

      start = i
      if (i < data.length) unit = nextUnit
    }
  }
  return out
}

const TEXTBOOK_SLOTS = [
  {
    id: 'grade3_up',
    name: '三年级上册',
    desc: '人教版三年级上册 Unit 1-6',
    cover: './covers/grade3_up.jpg',
    data: grade3UpData,
    lessons: [
      { label: 'Unit 1', desc: "Hello! I'm Mike Black.", slice: [0, 11] },
      { label: 'Unit 2', desc: 'This is my grandma.', slice: [11, 16] },
      { label: 'Unit 3', desc: 'Good morning, Mike!', slice: [16, 27] },
      { label: 'Unit 4', desc: 'Mike, do you like apples?', slice: [27, 35] },
      { label: 'Unit 5', desc: 'What colour is it?', slice: [35, 43] },
      { label: 'Unit 6', desc: 'How old are you?', slice: [43, 54] },
    ]
  },
  {
    id: 'grade3_down',
    name: '三年级下册',
    desc: '人教版三年级下册 Unit 1-6',
    cover: './covers/grade3_down.jpg',
    data: grade3DownData,
    lessons: [
      { label: 'Unit 1', desc: "What's your name?", slice: [0, 13] },
      { label: 'Unit 2', desc: 'It has a long body and short legs.', slice: [13, 19] },
      { label: 'Unit 3', desc: 'What are these?', slice: [19, 27] },
      { label: 'Unit 4', desc: 'Do you have old things?', slice: [27, 31] },
      { label: 'Unit 5', desc: 'Mum, where is my animal book?', slice: [31, 35] },
      { label: 'Unit 6', desc: 'How many books do we have?', slice: [35, 43] },
    ]
  },
  {
    id: 'grade4_up',
    name: '四年级上册',
    desc: '人教版四年级上册 Unit 1-6',
    cover: './covers/grade4_up.jpg',
    data: grade4UpData,
    lessons: [
      { label: 'Unit 1A', desc: 'How are families different? (1)', slice: [0, 9] },
      { label: 'Unit 1B', desc: 'How are families different? (2)', slice: [9, 18] },
      { label: 'Unit 1C', desc: 'How are families different? (3)', slice: [18, 26] },
      { label: 'Unit 2A', desc: 'My friends (1)', slice: [26, 36] },
      { label: 'Unit 2B', desc: 'My friends (2)', slice: [36, 47] },
      { label: 'Unit 3', desc: 'What can we see in a community?', slice: [47, 56] },
      { label: 'Unit 4', desc: 'Helping in the community', slice: [56, 67] },
      { label: 'Unit 5', desc: 'The weather and us', slice: [67, 80] },
      { label: 'Unit 6A', desc: 'Changing for the seasons (1)', slice: [80, 89] },
      { label: 'Unit 6B', desc: 'Changing for the seasons (2)', slice: [89, 97] },
    ]
  },
  {
    id: 'grade4_down',
    name: '四年级下册',
    desc: '人教版四年级下册 Unit 1-6',
    cover: './covers/grade4_down.jpg',
    data: grade4DownData,
    lessons: [
      { label: 'Unit 1A', desc: 'Class rules (1)', slice: [0, 10] },
      { label: 'Unit 1B', desc: 'Class rules (2)', slice: [10, 20] },
      { label: 'Unit 1C', desc: 'Class rules (3)', slice: [20, 30] },
      { label: 'Unit 2A', desc: 'Family rules (1)', slice: [30, 41] },
      { label: 'Unit 2B', desc: 'Family rules (2)', slice: [41, 51] },
      { label: 'Unit 2C', desc: 'Family rules (3)', slice: [51, 62] },
      { label: 'Unit 3A', desc: 'Time for school (1)', slice: [62, 72] },
      { label: 'Unit 3B', desc: 'Time for school (2)', slice: [72, 81] },
      { label: 'Unit 3C', desc: 'Time for school (3)', slice: [81, 90] },
      { label: 'Unit 4A', desc: 'Going shopping (1)', slice: [90, 99] },
      { label: 'Unit 4B', desc: 'Going shopping (2)', slice: [99, 108] },
      { label: 'Unit 4C', desc: 'Going shopping (3)', slice: [108, 116] },
      { label: 'Unit 5A', desc: 'Farm animals (1)', slice: [116, 123] },
      { label: 'Unit 5B', desc: 'Farm animals (2)', slice: [123, 129] },
      { label: 'Unit 5C', desc: 'Farm animals (3)', slice: [129, 135] },
      { label: 'Unit 6A', desc: 'On the farm (1)', slice: [135, 145] },
      { label: 'Unit 6B', desc: 'On the farm (2)', slice: [145, 155] },
      { label: 'Unit 6C', desc: 'On the farm (3)', slice: [155, 164] },
    ]
  },
  {
    id: 'grade5_up',
    name: '五年级上册',
    desc: '人教版五年级上册 Unit 1-6',
    cover: './covers/grade5_up.jpg',
    data: grade5UpData,
    lessons: [
      { label: 'Unit 1', desc: "What's he like?", slice: [0, 8] },
      { label: 'Unit 2', desc: 'Hi, Mike. You look sad.', slice: [8, 14] },
      { label: 'Unit 3', desc: 'What do you have on Wednesdays?', slice: [14, 20] },
      { label: 'Unit 4', desc: 'How can we all stay healthy?', slice: [20, 24] },
      { label: 'Unit 5', desc: 'What would you like to eat?', slice: [24, 30] },
      { label: 'Unit 6', desc: 'There are also many rivers in the nature park.', slice: [30, 36] },
    ]
  },
  {
    id: 'grade5_down',
    name: '五年级下册',
    desc: '人教版五年级下册 Unit 1-6',
    cover: './covers/grade5_up.jpg',
    data: grade5DownData,
    lessons: [
      { label: 'Unit 1', desc: 'When is your birthday?', slice: [0, 20] },
      { label: 'Unit 2', desc: 'My favourite season', slice: [20, 40] },
      { label: 'Unit 3', desc: 'My school calendar', slice: [40, 60] },
      { label: 'Unit 4', desc: 'When is the art show?', slice: [60, 80] },
      { label: 'Unit 5', desc: "Whose dog is it?", slice: [80, 100] },
      { label: 'Unit 6', desc: 'Work quietly!', slice: [100, 124] },
    ]
  },
  {
    id: 'grade6_up',
    name: '六年级上册',
    desc: '人教版六年级上册 Unit 1-6',
    cover: './covers/grade5_up.jpg',
    data: grade6UpData,
    lessons: [
      { label: 'Unit 1', desc: "How can I get there?", slice: [0, 37] },
      { label: 'Unit 2', desc: 'Ways to go to school', slice: [37, 74] },
      { label: 'Unit 3', desc: 'My weekend plan', slice: [74, 111] },
      { label: 'Unit 4', desc: "I have a pen pal", slice: [111, 148] },
      { label: 'Unit 5', desc: 'What does he do?', slice: [148, 185] },
      { label: 'Unit 6', desc: "How tall are you?", slice: [185, 227] },
    ]
  },
  {
    id: 'grade6_down',
    name: '六年级下册',
    desc: '人教版六年级下册 Unit 1-4',
    cover: './covers/grade5_up.jpg',
    data: grade6DownData,
    lessons: [
      { label: 'Unit 1', desc: 'How tall are you?', slice: [0, 61] },
      { label: 'Unit 2', desc: 'Last weekend', slice: [61, 122] },
      { label: 'Unit 3', desc: 'Where did you go?', slice: [122, 183] },
      { label: 'Unit 4', desc: 'Then and now', slice: [183, 244] },
    ]
  },
  {
    id: 'renai_7up',
    name: '七年级上册',
    desc: '仁爱版七年级上册',
    cover: null,
    gradient: 'from-sky-600 to-sky-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '七上',
    data: renai7upData,
    lessons: lessonsFromUnits(renai7upData, {})
  },
  {
    id: 'renai_7down',
    name: '七年级下册',
    desc: '仁爱版七年级下册',
    cover: null,
    gradient: 'from-blue-600 to-blue-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '七下',
    data: renai7downData,
    lessons: lessonsFromUnits(renai7downData, {})
  },
  {
    id: 'renai_8up',
    name: '八年级上册',
    desc: '仁爱版八年级上册',
    cover: null,
    gradient: 'from-violet-600 to-violet-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '八上',
    data: renai8upData,
    lessons: lessonsFromUnits(renai8upData, {})
  },
  {
    id: 'renai_8down',
    name: '八年级下册',
    desc: '仁爱版八年级下册',
    cover: null,
    gradient: 'from-purple-600 to-purple-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '八下',
    data: renai8downData,
    lessons: lessonsFromUnits(renai8downData, {})
  },
  {
    id: 'renai_9up',
    name: '九年级上册',
    desc: '仁爱版九年级上册',
    cover: null,
    gradient: 'from-rose-600 to-rose-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '九上',
    data: renai9upData,
    lessons: lessonsFromUnits(renai9upData, {})
  },
  {
    id: 'renai_9down',
    name: '九年级下册',
    desc: '仁爱版九年级下册',
    cover: null,
    gradient: 'from-orange-600 to-orange-800',
    label: '仁爱版',
    subject: '初中英语',
    coverText: '九下',
    data: renai9downData,
    lessons: lessonsFromUnits(renai9downData, {})
  },
  {
    id: 'bsda_b1',
    name: '必修 第一册',
    desc: '北师大版高中英语必修第一册',
    gradient: 'from-blue-700 to-blue-900',
    coverText: '必修一',
    data: bsdaB1Data,
    lessons: lessonsFromUnits(bsdaB1Data, {
      'Unit 1': 'Life Choices',
      'Unit 2': 'Sports and Fitness',
      'Unit 3': 'Celebrations',
    }),
  },
  {
    id: 'bsda_b2',
    name: '必修 第二册',
    desc: '北师大版高中英语必修第二册',
    gradient: 'from-indigo-700 to-indigo-900',
    coverText: '必修二',
    data: bsdaB2Data,
    lessons: lessonsFromUnits(bsdaB2Data, {
      'Unit 1': 'Information Technology',
      'Unit 2': 'Humans and Nature',
      'Unit 3': 'The Admirable',
    }),
  },
  {
    id: 'bsda_b3',
    name: '必修 第三册',
    desc: '北师大版高中英语必修第三册',
    gradient: 'from-violet-700 to-violet-900',
    coverText: '必修三',
    data: bsdaB3Data,
    lessons: lessonsFromUnits(bsdaB3Data, {
      'Unit 1': 'Art',
      'Unit 2': 'Green Living',
      'Unit 3': 'Learning',
    }),
  },
  {
    id: 'bsda_s1',
    name: '选择性必修 第一册',
    desc: '北师大版高中英语选择性必修第一册',
    gradient: 'from-emerald-700 to-emerald-900',
    coverText: '选必一',
    data: bsdaS1Data,
    lessons: lessonsFromUnits(bsdaS1Data, {
      'Unit 1': 'Relationships',
      'Unit 2': 'Success',
    }),
  },
  {
    id: 'bsda_s2',
    name: '选择性必修 第二册',
    desc: '北师大版高中英语选择性必修第二册',
    gradient: 'from-teal-700 to-teal-900',
    coverText: '选必二',
    data: bsdaS2Data,
    lessons: lessonsFromUnits(bsdaS2Data, {
      'Unit 1': 'Humor',
      'Unit 2': 'Education',
      'Unit 3': 'The Media',
    }),
  },
  {
    id: 'bsda_s3',
    name: '选择性必修 第三册',
    desc: '北师大版高中英语选择性必修第三册',
    gradient: 'from-cyan-700 to-cyan-900',
    coverText: '选必三',
    data: bsdaS3Data,
    lessons: lessonsFromUnits(bsdaS3Data, {
      'Unit 1': 'Careers',
      'Unit 2': 'Literature',
      'Unit 3': 'Human Biology',
    }),
  },
  {
    id: 'bsda_s4',
    name: '选择性必修 第四册',
    desc: '北师大版高中英语选择性必修第四册',
    gradient: 'from-sky-700 to-sky-900',
    coverText: '选必四',
    data: bsdaS4Data,
    lessons: lessonsFromUnits(bsdaS4Data, {
      'Unit 1': 'Connections',
      'Unit 2': 'Conflict and Compromise',
      'Unit 3': 'Innovation',
    }),
  },
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `tb_slot_${i + 8}`,
    name: null,
    desc: null,
    cover: null,
    data: [],
    lessons: [],
  }))
]

import { getSyncPartCount } from '../utils/syncPartProgress'

function getLessonStats(data, progress) {
  const total = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

// 同步练习分包：A=前10题 B=中10题 C=剩余（约15题）——宝石玻璃风格按钮
const SYNC_PARTS = [
  { key: 'A', count: 10, grad: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-900/40', glow: 'rgba(16,185,129,0.55)' },
  { key: 'B', count: 10, grad: 'from-sky-400 to-blue-600',      shadow: 'shadow-blue-900/40',    glow: 'rgba(59,130,246,0.55)' },
  { key: 'C', count: 15, grad: 'from-fuchsia-400 to-purple-600', shadow: 'shadow-purple-900/40',  glow: 'rgba(192,38,211,0.55)' },
]

export default function Textbook({ onImport, onClose, historyRef, progress = {}, onNavigate, requireSpeak, hideSkipNext, isMember = false, onShowLogin, active = true, settings, onXp, onCrystal, unlocks, crystalBalance = 0, onGoShop }) {
  const [detail, setDetail] = useState(null)
  const [syncUnit, setSyncUnit] = useState(null) // { bookId, label }
  const [grammar, setGrammar] = useState(null)   // { bookId, bookName, label, mode }

  useLayoutEffect(() => {
    if (!historyRef) return
    historyRef.current.applyStudy = (s) => {
      if (!s?.tb) {
        setDetail(null)
        setSyncUnit(null)
        return
      }
      setDetail(s.tb)
      if (s.tu) setSyncUnit({ bookId: s.tb, label: s.tu })
      else setSyncUnit(null)
    }
    return () => {
      if (historyRef) historyRef.current.applyStudy = () => {}
    }
  }, [historyRef])

  if (grammar) {
    return (
      <GrammarLesson
        bookId={grammar.bookId}
        bookName={grammar.bookName}
        unitLabel={grammar.label}
        mode={grammar.mode}
        settings={settings}
        onXp={onXp}
        onCrystal={onCrystal}
        onClose={() => setGrammar(null)}
      />
    )
  }

  if (syncUnit) {
    return (
      <Unit1Flow
        unitLabel={syncUnit.label}
        bookId={syncUnit.bookId}
        part={syncUnit.part}
        requireSpeak={requireSpeak}
        hideSkipNext={hideSkipNext}
        settings={settings}
        onClose={() => setSyncUnit(null)}
        onXp={onXp}
        onCrystal={onCrystal}
        isMember={isMember}
      />
    )
  }

  if (detail) {
    const book = TEXTBOOK_SLOTS.find(b => b.id === detail)
    const backToTextbookList = () => setDetail(null)
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={backToTextbookList}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600/60 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <IconArrowLeft size={16} />
            返回教材列表
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-0 sm:contents">
            <div className="w-16 h-20 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-gray-800">
              {book.gradient ? (
                <TextbookParchmentCover
                  gradient={book.gradient}
                  label={book.label}
                  coverText={book.coverText}
                  subject={book.subject}
                  variant="compact"
                />
              ) : (
                <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0 sm:hidden">
              <div className="text-lg font-bold text-white truncate">{book.name}</div>
              <div className="text-gray-400 text-xs truncate">{book.desc}</div>
            </div>
            <button
              onClick={() => onImport(book.data, `${book.name} · 全册`)}
              className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors shrink-0 sm:order-last"
            >
              ▶ 全册练习
            </button>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="hidden sm:block text-xl font-bold text-white mb-1">{book.name}</div>
            <div className="hidden sm:block text-gray-400 text-sm mb-3">{book.desc}</div>
            {(() => {
              const stats = getLessonStats(book.data, progress)
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
            <div className="mt-2 text-xs text-green-400/70">💡 点击卡片底部绿色按钮，可练习该单元同步习题</div>
          </div>
        </div>

        {/* Half-lock notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {book.lessons.map((lesson, i) => {
            // 册已通过外层宝石锁控制，册内单元全部开放（单层锁标准）
            const lessonLocked = false
            const data = book.data.slice(lesson.slice[0], lesson.slice[1])
            const stats = getLessonStats(data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            const g1Ready = hasGrammar(book.id, lesson.label)
            const g2Ready = g1Ready  // 语法二与语法一同步上线
            const goMain = () => {
              if (lessonLocked) { onShowLogin?.(); return }
              const buildLoader = (idx) => {
                if (idx >= book.lessons.length - 1) return null
                const next = book.lessons[idx + 1]
                return () => {
                  const nextData = book.data.slice(next.slice[0], next.slice[1])
                  onImport(nextData, `${book.name} · ${next.label}`, buildLoader(idx + 1))
                }
              }
              onImport(data, `${book.name} · ${lesson.label}`, buildLoader(i))
            }
            const goGrammar = (mode) => {
              if (lessonLocked) { onShowLogin?.(); return }
              setGrammar({ bookId: book.id, bookName: book.name, label: lesson.label, mode })
            }
            // ABC 字母对应文字色（玻璃底 · 去彩边）
            const abcLetterColor = { A: 'text-emerald-300', B: 'text-sky-300', C: 'text-pink-300' }
            // 主练习进度 / 语法一二 进度
            const mainPct = (percent || 0) / 100
            const g1Pct = getGrammarPercent(book.id, lesson.label, 'lesson')
            const g2Pct = getGrammarPercent(book.id, lesson.label, 'practice')
            const accentMain = done ? '#fbbf24' : '#3b82f6'
            return (
              <div key={i} className="relative bg-slate-900/35 backdrop-blur-xl backdrop-saturate-150 border border-amber-300/40 ring-1 ring-amber-200/20 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:border-amber-300/60 transition-all"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 12px rgba(251,191,36,0.18), 0 4px 16px rgba(0,0,0,0.25)' }}>

                {/* 主区：主练习 + 两个语法按钮（顶部彩条已去掉） */}
                <div className="px-3 pt-3 pb-2 flex gap-2">
                  {/* 左：主练习按钮 — 只留 Unit label + #N + 右侧环形进度 */}
                  <button onClick={goMain}
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.2)' }}
                    className={`flex-1 min-w-0 rounded-2xl flex items-center gap-3 transition-all active:scale-[0.98]
                      bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/15 hover:bg-white/[0.12] hover:border-white/25
                      border-l-4 ${done ? 'border-l-white/50' : lessonLocked ? 'border-l-white/15' : 'border-l-white/30 hover:border-l-white/50'}
                      ${lessonLocked ? 'opacity-60' : ''}
                      p-3 pl-3.5`}>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-lg font-bold text-white truncate">{lesson.label}</span>
                      <span className="text-[10px] font-mono text-white/40 mt-0.5">#{i + 1}</span>
                    </div>
                    <RingProgress value={mainPct} size={56} stroke={4} accent={accentMain}
                      label={`${Math.round(mainPct * 100)}`} sub="%" />
                  </button>

                  {/* 右：两个语法按钮 — 只留 label + 右侧环形进度 */}
                  <div className="flex flex-col gap-2 w-[36%] max-w-[160px] shrink-0">
                    {/* 语法一 */}
                    <button onClick={() => goGrammar('lesson')}
                      disabled={lessonLocked}
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.2)' }}
                      className={`flex-1 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.96]
                        bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/15 hover:bg-white/[0.12] hover:border-white/25
                        border-l-4 ${g1Ready ? 'border-l-white/30 hover:border-l-white/50' : 'border-l-white/12'}
                        ${lessonLocked ? 'opacity-40' : ''}
                        p-2 pl-2.5`}>
                      <span className="text-white text-sm font-bold leading-tight flex-1 text-left">语法一</span>
                      <RingProgress value={g1Pct} size={36} stroke={3} accent="#fbbf24"
                        label={g1Pct > 0 ? `${Math.round(g1Pct * 100)}` : ''} />
                    </button>

                    {/* 语法二 */}
                    <button onClick={() => goGrammar('practice')}
                      disabled={lessonLocked}
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.2)' }}
                      className={`flex-1 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.96]
                        bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/15 hover:bg-white/[0.12] hover:border-white/25
                        border-l-4 ${g2Ready ? 'border-l-white/30 hover:border-l-white/50' : 'border-l-white/12'}
                        ${lessonLocked ? 'opacity-40' : ''}
                        p-2 pl-2.5`}>
                      <span className="text-white text-sm font-bold leading-tight flex-1 text-left">语法二</span>
                      <RingProgress value={g2Pct} size={36} stroke={3} accent="#e879f9"
                        label={g2Pct > 0 ? `${Math.round(g2Pct * 100)}` : ''} />
                    </button>
                  </div>
                </div>

                {/* 底栏：同步练习 + ABC（绿色动作区 #7EB973） */}
                <div className="group/sync w-full px-3 py-2.5 backdrop-blur-xl backdrop-saturate-150
                  border-t border-white/15 flex items-center gap-2 transition-colors"
                  style={{
                    backgroundColor: 'rgba(126, 185, 115, 0.35)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}>
                  <span className="text-sm font-bold text-white/95 shrink-0">同步练习</span>
                  <div className="flex items-end gap-2 ml-auto">
                    {SYNC_PARTS.map(sp => {
                      const practiceCount = getSyncPartCount(book.id, lesson.label, sp.key)
                      return (
                      <div key={sp.key} className="flex flex-col items-center gap-0.5">
                        <button
                        onClick={() => setSyncUnit({ bookId: book.id, label: lesson.label, part: sp.key })}
                        disabled={lessonLocked}
                        title={`${sp.key} 部分 · ${sp.count} 题 · 已练 ${practiceCount} 次`}
                        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 6px rgba(0,0,0,0.25)` }}
                        className={`w-10 h-10 rounded-xl text-base font-black ${abcLetterColor[sp.key]} flex items-center justify-center
                          bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/15
                          hover:scale-110 hover:bg-white/[0.14] hover:border-white/25 active:scale-95 transition-all
                          ${lessonLocked ? 'opacity-30 pointer-events-none' : ''}`}>
                        {sp.key}
                        </button>
                        <span className="text-[10px] font-semibold text-white/75 tabular-nums leading-none min-h-[12px]">
                          {practiceCount}
                        </span>
                      </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">教材同步</h2>
        <span className="text-xs text-gray-500">共 {TEXTBOOK_SLOTS.length} 本教材</span>
      </div>

      {!isMember && (
        <div className="mb-5 bg-gradient-to-r from-amber-900/40 to-orange-900/30 border border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl shrink-0">⭐</span>
          <div className="flex-1 min-w-0">
            <div className="text-amber-300 font-semibold text-sm">开通会员，全部教材免钻石解锁</div>
            <div className="text-amber-500/80 text-xs mt-0.5">学完上一册自动解锁下一册，也可用钻石提前开启</div>
          </div>
          <button onClick={onShowLogin} className="shrink-0 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors">
            登录
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(() => {
          // 计算每册的完成度，用于「上一册 60% 自动解锁」
          const namedSlots = TEXTBOOK_SLOTS.filter(b => b.name)
          const bookPercents = new Map()
          namedSlots.forEach(b => {
            const s = getLessonStats(b.data, progress)
            bookPercents.set(b.id, s.total ? Math.round((s.attempted / s.total) * 100) : 0)
          })
          return TEXTBOOK_SLOTS.map((book) => {
          // 第 0 本（三年级上册）免费，其余看顺序解锁
          let locked = false
          const COST = 80
          if (book.name) {
            const idx = namedSlots.findIndex(b => b.id === book.id)
            if (idx > 0) {
              const prevId = namedSlots[idx - 1].id
              const prevPct = bookPercents.get(prevId) ?? 0
              locked = !isMember &&
                !(unlocks?.isUnlocked?.('book', book.id)) &&
                prevPct < 60
            }
          }
          const card = (
          <button
            onClick={() => {
              if (!book.name) return
              setDetail(book.id)
            }}
            className={`w-full flex flex-col rounded-2xl overflow-hidden border transition-all text-left
              ${book.name
                ? 'border-gray-700 hover:border-gray-500 cursor-pointer'
                : 'border-slate-700 border-dashed cursor-default opacity-40'}
            `}
          >
            <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden relative bg-gray-800">
              {book.gradient ? (
                <TextbookParchmentCover
                  gradient={book.gradient}
                  label={book.label}
                  coverText={book.coverText}
                  subject={book.subject}
                  variant="grid"
                />
              ) : book.cover ? (
                <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-700">+</span>
              )}
            </div>
            <div className="bg-slate-800 p-3 flex flex-col gap-1">
              <div className="text-sm font-medium text-white truncate">
                {book.name || '即将上线'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {book.desc || '敬请期待'}
              </div>
              {book.name && (() => {
                const stats = getLessonStats(book.data, progress)
                const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
                return (
                  <>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-xs text-gray-600">{book.lessons.length} 课 · {percent}%</div>
                  </>
                )
              })()}
            </div>
          </button>
          )
          return (
            <div key={book.id} className="relative">
              <LockedOverlay
                locked={locked}
                cost={COST}
                color="blue"
                crystalBalance={crystalBalance}
                title={book.name}
                reason={`完成上一册 60%，或花费 ${COST} 钻石提前开启`}
                onUnlock={() => unlocks?.unlock?.('book', book.id, COST, 'blue')}
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
