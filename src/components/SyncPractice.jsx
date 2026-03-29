import { useState, useEffect } from 'react'
import grade3UpData from '../data/grade3_up.json'
import grade3DownData from '../data/grade3_down.json'
import grade4UpData from '../data/grade4_up.json'
import grade4DownData from '../data/grade4_down.json'
import grade5UpData from '../data/grade5_up.json'
import ExerciseQuiz, { generateQuiz } from './ExerciseQuiz'
import Unit1Flow from './Unit1Flow'

// 四年级下册单元切片（与 Textbook.jsx 保持一致）
const GRADE4_DOWN_UNITS = [
  { label: 'Unit 1A', slice: [0, 10] },
  { label: 'Unit 1B', slice: [10, 20] },
  { label: 'Unit 1C', slice: [20, 30] },
  { label: 'Unit 2A', slice: [30, 41] },
  { label: 'Unit 2B', slice: [41, 51] },
  { label: 'Unit 2C', slice: [51, 62] },
  { label: 'Unit 3A', slice: [62, 72] },
  { label: 'Unit 3B', slice: [72, 81] },
  { label: 'Unit 3C', slice: [81, 90] },
  { label: 'Unit 4A', slice: [90, 99] },
  { label: 'Unit 4B', slice: [99, 108] },
  { label: 'Unit 4C', slice: [108, 116] },
  { label: 'Unit 5A', slice: [116, 126] },
  { label: 'Unit 5B', slice: [126, 135] },
  { label: 'Unit 6A', slice: [135, 145] },
  { label: 'Unit 6B', slice: [145, 155] },
  { label: 'Unit 6C', slice: [155, 164] },
]

// ── 教材目录（纯结构，不含数据）────────────────────────────────────────────
const TEXTBOOK_CATALOG = [
  {
    id: 'grade3_up', name: '三年级上册', cover: 'covers/grade3_up.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C',
    ]
  },
  {
    id: 'grade3_down',
    name: '三年级 下册 (PEP)',
    icon: '📘',
    cover: 'covers/grade3_down.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C'
    ]
  },
  {
    id: 'grade4_up',
    name: '四年级 上册 (PEP)',
    icon: '📙',
    cover: 'covers/grade4_up.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C'
    ]
  },
  {
    id: 'grade4_down',
    name: '四年级 下册 (PEP)',
    icon: '📕',
    cover: 'covers/grade4_down.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C'
    ]
  },
  {
    id: 'grade5_up',
    name: '五年级 上册 (PEP)',
    icon: '📒',
    cover: 'covers/grade5_up.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C'
    ]
  },
  {
    id: 'grade5_down',
    name: '五年级 下册 (PEP)',
    icon: '📔',
    cover: 'covers/grade5_down.jpg',
    units: [
      'Unit 1A', 'Unit 1B', 'Unit 1C',
      'Unit 2A', 'Unit 2B', 'Unit 2C',
      'Unit 3A', 'Unit 3B', 'Unit 3C',
      'Unit 4A', 'Unit 4B', 'Unit 4C',
      'Unit 5A', 'Unit 5B', 'Unit 5C',
      'Unit 6A', 'Unit 6B', 'Unit 6C'
    ]
  }
]

// ── 多邻国目录（纯结构，不含数据）──────────────────────────────────────────
const DUO_CATALOG = [
  {
    unit: 1, name: 'Unit 1', desc: '入门：喜好、职业、问候', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7'],
  },
  {
    unit: 2, name: 'Unit 2', desc: '基础：日常、购物、天气', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
              'L11','L12','L13','L14','L15','L16','L17','L18','L19','L20',
              'L21','L22','L23','L24','L25','L26','L27','L28'],
  },
  {
    unit: 3, name: 'Unit 3', desc: '进阶：旅行、比较、过去时', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
              'L11','L12','L13','L14','L15','L16','L17','L18','L19','L20',
              'L21','L22','L23','L24','L25'],
  },
  {
    unit: 4, name: 'Unit 4', desc: '提高：购物、方向、职场', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
              'L11','L12','L13','L14','L15','L16','L17','L18','L19','L20',
              'L21','L22','L23','L24','L25','L26','L27','L28','L29','L30',
              'L31','L32','L33','L34','L35','L36','L37','L38','L39','L40',
              'L41','L42','L43','L44','L45','L46','L47','L48','L49','L50',
              'L51','L52','L53','L54','L55'],
  },
  {
    unit: 5, name: 'Unit 5', desc: '高阶：职场、社交、生活', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
              'L11','L12','L13','L14','L15','L16','L17','L18','L19','L20',
              'L21','L22','L23','L24','L25','L26','L27','L28','L29','L30',
              'L31','L32','L33','L34','L35','L36'],
  },
  {
    unit: 6, name: 'Unit 6', desc: '精通：文化、情感、时事', cover: 'duolingo.webp',
    lessons: ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
              'L11','L12','L13','L14','L15','L16','L17','L18','L19','L20',
              'L21','L22','L23','L24','L25','L26','L27','L28','L29','L30',
              'L31','L32','L33','L34','L35','L36','L37','L38','L39','L40',
              'L41','L42','L43','L44','L45','L46','L47','L48','L49','L50',
              'L51','L52'],
  },
]

// ── 即将上线提示 ──────────────────────────────────────────────────────────────
function ComingSoon({ name, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-3">📝</div>
        <div className="text-white font-semibold mb-1">{name}</div>
        <div className="text-gray-400 text-sm mb-1">练习题</div>
        <div className="text-gray-500 text-xs mb-5">即将上线，敬请期待</div>
        <button onClick={onClose} className="px-6 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          关闭
        </button>
      </div>
    </div>
  )
}

// ── 教材详情页（单元列表）────────────────────────────────────────────────────
function TextbookDetail({ book, onBack, onSetBack, requireSpeak }) {
  const [popup, setPopup] = useState(null)
  const [activeUnit, setActiveUnit] = useState(null)  // { label, index }
  const [quiz, setQuiz] = useState(null)              // { title, questions }（ExerciseQuiz用）

  const isGrade4Down = book.id === 'grade4_down'
  const isGrade4Up = book.id === 'grade4_up'
  const isGrade3Up = book.id === 'grade3_up'
  const isGrade3Down = book.id === 'grade3_down'
  const isGrade5Up = book.id === 'grade5_up'
  const isGrade5Down = book.id === 'grade5_down'

  const isFlowUnit = (label) => label.startsWith('Unit ') && (label.endsWith('A') || label.endsWith('B') || label.endsWith('C'))

  useEffect(() => {
    if (quiz || activeUnit) {
      onSetBack?.(() => { setQuiz(null); setActiveUnit(null) })
    } else {
      onSetBack?.(onBack)
    }
  }, [quiz, activeUnit])

  function handleUnitClick(e, unit, i) {
    e?.preventDefault()
    if (isGrade4Down || isGrade4Up || isGrade3Up || isGrade3Down || isGrade5Up || isGrade5Down) {
      // For PEP books, all units are flow units
      setActiveUnit({ label: unit, index: i, bookId: book.id })
      return
    }
    // This part is for older logic, likely to be removed or refactored
    if (!isGrade4Down) { setPopup(`${book.name} · ${unit}`); return }
    const unitDef = GRADE4_DOWN_UNITS[i]
    const unitData = grade4DownData.slice(unitDef.slice[0], unitDef.slice[1])
    const questions = generateQuiz(unitData, grade4DownData)
    setQuiz({ title: `${book.name} · ${unit}`, questions })
  }

  if (quiz) {
    return <ExerciseQuiz questions={quiz.questions} title={quiz.title} onClose={() => setQuiz(null)} />
  }

  if (activeUnit) {
    const currentFlowKey = activeUnit.label;
    const currentBookId = activeUnit.bookId;
    return <Unit1Flow unitLabel={currentFlowKey} bookId={currentBookId} requireSpeak={requireSpeak} onClose={() => {setActiveUnit(null)}} />
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {popup && <ComingSoon name={popup} onClose={() => setPopup(null)} />}

      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all shadow-lg active:scale-95">
          <span>← 返回主界面</span>
        </button>

      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5 flex items-center gap-5">
        <div className="rounded-xl overflow-hidden shrink-0 bg-gray-800" style={{ width: '3.5rem', height: '4.8rem' }}>
          <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-white">{book.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {book.units.length} 个单元 · 练习题
            {isGrade4Down && <span className="ml-2 text-green-500">● 已上线</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {book.units.map((unit, i) => (
          <button
            key={i}
            onClick={(e) => handleUnitClick(e, unit, i)}
            className={`text-left bg-gray-900 border rounded-xl px-4 py-3 flex items-center justify-between gap-2 transition-colors
              ${(isGrade4Down || isGrade4Up || isGrade3Up || isGrade3Down || isGrade5Up || isGrade5Down)
                ? 'border-gray-700 hover:border-blue-500 hover:bg-blue-900/10'
                : 'border-gray-800 hover:border-gray-600'}`}
          >
            <span className="text-white text-sm font-medium">{unit}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 border
              ${(isGrade4Down || isGrade4Up || isGrade3Up || isGrade3Down || isGrade5Up || isGrade5Down)
                ? 'text-blue-400 bg-blue-900/30 border-blue-700/40'
                : isGrade4Down
                ? 'text-green-400 bg-green-900/30 border-green-700/40'
                : 'text-amber-500 bg-amber-900/30 border-amber-700/40'}`}>
              {(isGrade4Down || isGrade4Up || isGrade3Up || isGrade3Down || isGrade5Up || isGrade5Down) ? '35题' : isGrade4Down ? '开始练习' : '练习题'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 多邻国详情页（课列表）────────────────────────────────────────────────────
function DuoDetail({ unit, onBack }) {
  const [popup, setPopup] = useState(null)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {popup && <ComingSoon name={popup} onClose={() => setPopup(null)} />}

      {/* 单元信息栏 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5 flex items-center gap-5">
        <div className="w-20 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-800">
          <img src={unit.cover} alt={unit.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-white">多邻国 · {unit.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{unit.desc} · {unit.lessons.length} 课 · 练习题</div>
        </div>
      </div>

      {/* 课列表 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {unit.lessons.map((lesson, i) => (
          <button
            key={i}
            onClick={() => setPopup(`多邻国 ${unit.name} · ${lesson}`)}
            className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 flex items-center justify-between gap-2 transition-colors"
          >
            <span className="text-white text-sm font-medium">{lesson}</span>
            <span className="text-xs text-amber-500 bg-amber-900/30 border border-amber-700/40 px-2 py-0.5 rounded-full shrink-0">练习题</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 主页面 ────────────────────────────────────────────────────────────────────
export default function SyncPractice({ onSetBack, requireSpeak }) {
  const [detail, setDetail] = useState(null)
  const [expandedCats, setExpandedCats] = useState({ grade3_up: true })

  // 直接在状态变化时调用，不用 useEffect
  const handleSetDetail = (newDetail) => {
    setDetail(newDetail)
    if (!newDetail) onSetBack?.(null)
    if (newDetail?.type === 'duo') onSetBack?.(() => setDetail(null))
  }

  if (detail?.type === 'textbook') {
    const book = TEXTBOOK_CATALOG.find(b => b.id === detail.id)
    return <TextbookDetail book={book} onBack={() => handleSetDetail(null)} onSetBack={onSetBack} requireSpeak={requireSpeak} />
  }

  if (detail?.type === 'duo') {
    const unit = DUO_CATALOG.find(u => u.unit === detail.unit)
    return <DuoDetail unit={unit} onBack={() => handleSetDetail(null)} />
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* ── 教材同步练习 ── */}
      <div className="mb-8">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">教材同步 · 练习题</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {TEXTBOOK_CATALOG.map(book => (
            <button
              key={book.id}
              onClick={() => handleSetDetail({ type: 'textbook', id: book.id })}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all text-left"
            >
              <div className="w-full aspect-[3/4] bg-gray-800 overflow-hidden">
                <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-900 px-2.5 py-2 flex flex-col gap-1">
                <div className="text-xs font-medium text-white truncate">{book.name}</div>
                <div className="text-xs text-amber-600">{book.units.length} 单元 · 练习题</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 多邻国课程练习 ── */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">多邻国课程 · 练习题</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {DUO_CATALOG.map(unit => (
            <button
              key={unit.unit}
              onClick={() => handleSetDetail({ type: 'duo', unit: unit.unit })}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all text-left"
            >
              <div className="w-full h-20 bg-gray-800 overflow-hidden">
                <img src={unit.cover} alt={unit.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-900 px-2.5 py-2 flex flex-col gap-0.5">
                <div className="text-xs font-medium text-white">多邻国 · {unit.name}</div>
                <div className="text-xs text-amber-600">{unit.lessons.length} 课 · 练习题</div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
