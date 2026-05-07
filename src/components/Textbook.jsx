import { useState, useEffect, useLayoutEffect } from 'react'
import Unit1Flow from './Unit1Flow'
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
import { pushStudy } from '../studyHistory'
import { IconArrowLeft } from './Icons'

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
      { label: 'Unit 5A', desc: 'Farm animals (1)', slice: [116, 126] },
      { label: 'Unit 5B', desc: 'Farm animals (2)', slice: [126, 135] },
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

function getLessonStats(data, progress) {
  const total = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

export default function Textbook({ onImport, onClose, onSetBack, historyRef, progress = {}, onNavigate, requireSpeak, hideSkipNext, isMember = false, onShowLogin, active = true }) {
  const [detail, setDetail] = useState(null)
  const [syncUnit, setSyncUnit] = useState(null) // { bookId, label }

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

  // 子层级由 studyHistory.pushStudy + App popstate 统一还原，不在此注册全局 backFn
  useEffect(() => {
    if (!active) return
    if (detail === null && !syncUnit) onSetBack?.(null)
  }, [active, detail, syncUnit, onSetBack])

  if (syncUnit) {
    return (
      <Unit1Flow
        unitLabel={syncUnit.label}
        bookId={syncUnit.bookId}
        requireSpeak={requireSpeak}
        hideSkipNext={hideSkipNext}
        onClose={() => window.history.back()}
      />
    )
  }

  if (detail) {
    const book = TEXTBOOK_SLOTS.find(b => b.id === detail)
    const backToTextbookList = () => {
      window.history.back()
    }
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
          <span className="text-gray-300 text-sm font-medium">{book.name}</span>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className={`w-20 h-28 rounded-xl overflow-hidden shrink-0 ${book.gradient ? `bg-gradient-to-br ${book.gradient}` : 'bg-gray-800'}`}>
            {book.gradient ? (
              <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center border-2 border-white/10 mix-blend-overlay shadow-inner" style={{ backdropFilter: 'brightness(1.1)' }}>
                <span className="text-white/80 text-[9px] font-bold tracking-widest mb-1.5 opacity-90 drop-shadow-sm">{book.label || '北师大版'}</span>
                <span className="text-white text-base font-black tracking-widest mb-1.5 drop-shadow-md">{book.coverText}</span>
                <span className="text-white/70 text-[10px] font-semibold tracking-wider mt-auto opacity-80 drop-shadow-sm">{book.subject || '高中英语'}</span>
              </div>
            ) : (
              <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white mb-1">{book.name}</div>
            <div className="text-gray-400 text-sm mb-3">{book.desc}</div>
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
          </div>
          <button
            onClick={() => onImport(book.data, `${book.name} · 全册`)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shrink-0"
          >
            ▶ 全册练习
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {book.lessons.map((lesson, i) => {
            const data = book.data.slice(lesson.slice[0], lesson.slice[1])
            const stats = getLessonStats(data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            const done = stats.mastered === stats.total && stats.total > 0
            return (
              <div key={i} className="text-left bg-slate-800 border border-slate-700 hover:border-gray-600 rounded-xl overflow-hidden flex flex-col transition-colors">
                <button
                  onClick={() => {
                    const buildLoader = (idx) => {
                      if (idx >= book.lessons.length - 1) return null
                      return () => {
                        const next = book.lessons[idx + 1]
                        const nextData = book.data.slice(next.slice[0], next.slice[1])
                        onImport(nextData, `${book.name} · ${next.label}`, buildLoader(idx + 1))
                      }
                    }
                    onImport(data, `${book.name} · ${lesson.label}`, buildLoader(i))
                  }}
                  className="p-4 flex flex-col gap-2 flex-1 text-left"
                >
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
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="leading-snug line-clamp-1 text-gray-500">{lesson.desc}</span>
                    <span className="text-gray-600 font-mono shrink-0 ml-1">#{i + 1}</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    pushStudy({ tab: 'textbook', tb: book.id, tu: lesson.label })
                    setSyncUnit({ bookId: book.id, label: lesson.label })
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-green-700 hover:bg-green-600 border-t border-green-900 transition-colors text-center rounded-b-xl"
                >
                  {lesson.label} 同步练习
                </button>
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
            <div className="text-amber-300 font-semibold text-sm">开通会员，解锁全部教材</div>
            <div className="text-amber-500/80 text-xs mt-0.5">三年级下册起均为会员专属，免费用三年级上册体验</div>
          </div>
          <button onClick={onShowLogin} className="shrink-0 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors">
            登录
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {TEXTBOOK_SLOTS.map((book) => {
          const isPremium = book.name && book.id !== 'grade3_up'
          const locked = isPremium && !isMember
          return (
          <div key={book.id} className="relative">
          <button
            onClick={() => {
              if (!book.name) return
              if (locked) { onShowLogin?.(); return }
              pushStudy({ tab: 'textbook', tb: book.id })
              setDetail(book.id)
            }}
            className={`w-full flex flex-col rounded-2xl overflow-hidden border transition-all text-left
              ${book.name
                ? 'border-gray-700 hover:border-gray-500 cursor-pointer'
                : 'border-slate-700 border-dashed cursor-default opacity-40'}
            `}
          >
            <div className={`w-full aspect-[3/4] flex items-center justify-center overflow-hidden relative ${book.gradient ? `bg-gradient-to-br ${book.gradient}` : 'bg-gray-800'}`}>
              {book.gradient ? (
                <div className="absolute inset-2 flex flex-col items-center justify-center p-3 text-center border-[3px] border-white/20 rounded-xl shadow-inner mix-blend-overlay" style={{ backdropFilter: 'brightness(1.1)' }}>
                  <span className="text-white/90 text-xs font-bold tracking-widest mb-3 opacity-90 drop-shadow-sm">{book.label || '北师大版'}</span>
                  <span className="text-white text-3xl font-black tracking-widest mb-2 drop-shadow-md">{book.coverText}</span>
                  <span className="text-white/80 text-sm font-semibold tracking-wider mt-auto opacity-80 drop-shadow-sm">{book.subject || '高中英语'}</span>
                </div>
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
          {locked && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 z-10 rounded-2xl pointer-events-none">
              <span className="text-xl">🔒</span>
              <span className="text-white text-xs font-semibold">会员专属</span>
            </div>
          )}
          </div>
          )
        })}
      </div>
    </div>
  )
}
