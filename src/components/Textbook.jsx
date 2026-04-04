import { useState, useEffect } from 'react'
import Unit1Flow from './Unit1Flow'
import grade4DownData from '../data/grade4_down.json'
import grade3UpData from '../data/grade3_up.json'
import grade3DownData from '../data/grade3_down.json'
import grade4UpData from '../data/grade4_up.json'
import grade5UpData from '../data/grade5_up.json'

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
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `tb_slot_${i + 6}`,
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

export default function Textbook({ onImport, onClose, onSetBack, progress = {}, onNavigate, requireSpeak }) {
  const [detail, setDetail] = useState(null)
  const [syncUnit, setSyncUnit] = useState(null) // { bookId, label }

  useEffect(() => {
    if (syncUnit) {
      onSetBack?.(() => () => setSyncUnit(null))
    } else {
      onSetBack?.(detail ? () => () => setDetail(null) : null)
    }
  }, [detail, syncUnit, onSetBack])

  if (syncUnit) {
    return (
      <Unit1Flow
        unitLabel={syncUnit.label}
        bookId={syncUnit.bookId}
        requireSpeak={requireSpeak}
        onClose={() => setSyncUnit(null)}
      />
    )
  }

  if (detail) {
    const book = TEXTBOOK_SLOTS.find(b => b.id === detail)
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-300 text-sm font-medium">{book.name}</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-gray-800">
            <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
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
              <div key={i} className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden flex flex-col transition-colors">
                <button
                  onClick={() => onImport(data, `${book.name} · ${lesson.label}`)}
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
                  onClick={() => setSyncUnit({ bookId: book.id, label: lesson.label })}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {TEXTBOOK_SLOTS.map((book) => (
          <button
            key={book.id}
            onClick={() => book.name ? setDetail(book.id) : null}
            className={`flex flex-col rounded-2xl overflow-hidden border transition-all text-left
              ${book.name
                ? 'border-gray-700 hover:border-gray-500 cursor-pointer'
                : 'border-gray-800 border-dashed cursor-default opacity-40'}
            `}
          >
            <div className="w-full aspect-[3/4] bg-gray-800 flex items-center justify-center overflow-hidden">
              {book.cover
                ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                : <span className="text-3xl text-gray-700">+</span>
              }
            </div>
            <div className="bg-gray-900 p-3 flex flex-col gap-1">
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
        ))}
      </div>
    </div>
  )
}
