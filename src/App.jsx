import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import ExerciseView from './components/ExerciseView'
import ImportPanel from './components/ImportPanel'
import SentenceList from './components/SentenceList'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import Courses from './components/Courses'
import Textbook from './components/Textbook'
import Grammar from './components/Grammar'
import Quiz from './components/Quiz'
import FillBlank from './components/FillBlank'
import SyncPractice from './components/SyncPractice'
import { useProgress, getRecentErrors } from './hooks/useProgress'
import sampleData from './data/sample.json'
import changyongData from './data/changyong.json'
import grade4DownData from './data/grade4_down.json'
import grade3UpData from './data/grade3_up.json'
import grade3DownData from './data/grade3_down.json'
import grade4UpData from './data/grade4_up.json'
import grade5UpData from './data/grade5_up.json'
import {
  IconHome, IconPencil, IconList, IconBookOpen, IconBook,
  IconGraduationCap, IconDownload, IconSettings,
  IconArchive, IconCalendar, IconStar, IconRefresh, IconCrown,
  IconChevronLeft, IconUser,
  IconArrowLeft, IconArrowRight, IconRotateCcw,
  IconCheck, IconBookmark, IconVolume2, IconInfo, IconSplit,
  IconCheckSquare, IconEdit,
} from './components/Icons'

// Flat list of all textbook units for "continue" navigation
const ALL_UNITS = [
  ...[ { label: 'Unit 1', slice: [0,11] }, { label: 'Unit 2', slice: [11,16] }, { label: 'Unit 3', slice: [16,27] }, { label: 'Unit 4', slice: [27,35] }, { label: 'Unit 5', slice: [35,43] }, { label: 'Unit 6', slice: [43,54] } ].map(u => ({ bookName: '三年级上册', bookId: 'grade3_up', data: grade3UpData, ...u, label: `三年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,13] }, { label: 'Unit 2', slice: [13,19] }, { label: 'Unit 3', slice: [19,27] }, { label: 'Unit 4', slice: [27,31] }, { label: 'Unit 5', slice: [31,35] }, { label: 'Unit 6', slice: [35,43] } ].map(u => ({ bookName: '三年级下册', bookId: 'grade3_down', data: grade3DownData, ...u, label: `三年级下册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,9] }, { label: 'Unit 1B', slice: [9,18] }, { label: 'Unit 1C', slice: [18,26] }, { label: 'Unit 2A', slice: [26,36] }, { label: 'Unit 2B', slice: [36,47] }, { label: 'Unit 3', slice: [47,56] }, { label: 'Unit 4', slice: [56,67] }, { label: 'Unit 5', slice: [67,80] }, { label: 'Unit 6A', slice: [80,89] }, { label: 'Unit 6B', slice: [89,97] } ].map(u => ({ bookName: '四年级上册', bookId: 'grade4_up', data: grade4UpData, ...u, label: `四年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 2A', slice: [30,41] }, { label: 'Unit 2B', slice: [41,51] }, { label: 'Unit 2C', slice: [51,62] }, { label: 'Unit 3A', slice: [62,72] }, { label: 'Unit 3B', slice: [72,81] }, { label: 'Unit 3C', slice: [81,90] }, { label: 'Unit 4A', slice: [90,99] }, { label: 'Unit 4B', slice: [99,108] }, { label: 'Unit 4C', slice: [108,116] }, { label: 'Unit 5A', slice: [116,126] }, { label: 'Unit 5B', slice: [126,135] }, { label: 'Unit 6A', slice: [135,145] }, { label: 'Unit 6B', slice: [145,155] }, { label: 'Unit 6C', slice: [155,164] } ].map(u => ({ bookName: '四年级下册', bookId: 'grade4_down', data: grade4DownData, ...u, label: `四年级下册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,8] }, { label: 'Unit 2', slice: [8,14] }, { label: 'Unit 3', slice: [14,20] }, { label: 'Unit 4', slice: [20,24] }, { label: 'Unit 5', slice: [24,30] }, { label: 'Unit 6', slice: [30,36] } ].map(u => ({ bookName: '五年级上册', bookId: 'grade5_up', data: grade5UpData, ...u, label: `五年级上册 · ${u.label}` })),
]

const STUDY_TIME_KEY = 'english_study_time'
const LESSON_HISTORY_KEY = 'english_lesson_history'

async function saveStudyTime(seconds, userId) {
  const today = new Date().toISOString().slice(0, 10)
  // 本地
  try {
    const data = JSON.parse(localStorage.getItem(STUDY_TIME_KEY) || '{}')
    data[today] = (data[today] || 0) + seconds
    localStorage.setItem(STUDY_TIME_KEY, JSON.stringify(data))
  } catch {}
  // 云端（upsert：当天已有记录则累加）
  if (userId) {
    const { data: existing } = await supabase
      .from('study_sessions')
      .select('seconds')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    const total = (existing?.seconds || 0) + seconds
    await supabase.from('study_sessions').upsert(
      { user_id: userId, date: today, seconds: total },
      { onConflict: 'user_id,date' }
    )
  }
}

function loadLessonHistory() {
  try { return JSON.parse(localStorage.getItem(LESSON_HISTORY_KEY) || '[]') } catch { return [] }
}

function saveLessonHistory(label, sentences) {
  const history = loadLessonHistory()
  // Remove duplicate label then prepend
  const filtered = history.filter(h => h.label !== label)
  filtered.unshift({ label, count: sentences.length, ts: Date.now() })
  if (filtered.length > 20) filtered.splice(20)
  localStorage.setItem(LESSON_HISTORY_KEY, JSON.stringify(filtered))
}

const SETTINGS_KEY = 'english_input_settings'

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || { lang: 'en-US', rate: 1.0, autoSpeak: true, wordSpeak: true, learningLevel: 2, showHintOnError: true, hintTriggerCount: 1, splitMode: false, soundEnabled: true, keypressSound: 'black-pbt', correctSound: 'chime', victorySound: 'chime', errorSound: 'buzz' }
  } catch {
    return { lang: 'en-US', rate: 1.0, autoSpeak: true, wordSpeak: true, learningLevel: 2, showHintOnError: true, hintTriggerCount: 1, soundEnabled: true, keypressSound: 'black-pbt', correctSound: 'chime', victorySound: 'chime', errorSound: 'buzz' }
  }
}

const NAV_ITEMS = [
  { id: 'home',     Icon: IconHome,           label: '首页' },
  { id: 'exercise', Icon: IconPencil,          label: '练习' },
  { id: 'courses',  Icon: IconBookOpen,        label: '课程广场' },
  { id: 'textbook', Icon: IconBook,            label: '教材同步' },
  { id: 'grammar',  Icon: IconGraduationCap,   label: '语法专项' },
  { id: 'import',   Icon: IconDownload,        label: '导入' },
  { id: 'quiz',     Icon: IconCheckSquare,     label: '选择题' },
  { id: 'fillblank', Icon: IconEdit,           label: '填空题' },
]

const BOTTOM_ITEMS = [
  { id: 'wordbank',  Icon: IconArchive,  label: '单词仓库',  disabled: true },
  { id: 'plan',      Icon: IconCalendar, label: '学习计划',  disabled: true },
  { id: 'favorites', Icon: IconStar,     label: '我的收藏',  disabled: true },
  { id: 'sync',      Icon: IconRefresh,  label: '云端同步',  disabled: true },
  { id: 'member',    Icon: IconCrown,    label: '开通会员',  yellow: true },
]

function LoginModal({ onClose }) {
  // mode: 'login' | 'register' | 'reset'
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function reset() { setError(''); setSuccess('') }

  async function handleSubmit() {
    setLoading(true); reset()
    if (mode === 'reset') {
      if (!email) { setError('请填写邮箱'); setLoading(false); return }
      const { error: e } = await supabase.auth.resetPasswordForEmail(email)
      if (e) setError(e.message)
      else setSuccess('重置邮件已发送，请查收邮箱。')
    } else if (mode === 'register') {
      if (!email || !password) { setError('请填写邮箱和密码'); setLoading(false); return }
      const { error: e } = await supabase.auth.signUp({ email, password })
      if (e) setError(e.message)
      else setSuccess('注册成功！请查收验证邮件后登录。')
    } else {
      if (!email || !password) { setError('请填写邮箱和密码'); setLoading(false); return }
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) setError(e.message === 'Invalid login credentials' ? '邮箱或密码错误' : e.message)
      else onClose()
    }
    setLoading(false)
  }

  const titles = { login: '登录', register: '注册账号', reset: '重置密码' }
  const btnLabels = { login: '登录', register: '注册', reset: '发送重置邮件' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-1">{titles[mode]}</h2>
        <p className="text-gray-500 text-sm mb-6">登录以同步学习进度</p>
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-3 outline-none focus:border-blue-500 transition-colors"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {mode !== 'reset' && (
          <input
            type="password"
            placeholder="密码（至少6位）"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-4 outline-none focus:border-blue-500 transition-colors"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        )}
        {mode === 'login' && (
          <div className="flex justify-end mb-4">
            <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors" onClick={() => { setMode('reset'); reset() }}>
              忘记密码？
            </button>
          </div>
        )}
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        {success && <p className="text-green-400 text-xs mb-3">{success}</p>}
        <button
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '请稍候…' : btnLabels[mode]}
        </button>
        {mode === 'login' && (
          <button className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors mb-2"
            onClick={() => { setMode('register'); reset() }}>
            没有账号？去注册
          </button>
        )}
        {mode === 'register' && (
          <button className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors mb-2"
            onClick={() => { setMode('login'); reset() }}>
            已有账号？去登录
          </button>
        )}
        {mode === 'reset' && (
          <button className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors mb-2"
            onClick={() => { setMode('login'); reset() }}>
            返回登录
          </button>
        )}
        <button className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors" onClick={onClose}>取消</button>
      </div>
    </div>
  )
}

export default function App() {
  const [sentences, setSentences] = useState(sampleData)
  const [settings, setSettings] = useState(loadSettings)
  const [tab, setTab] = useState('home')
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [lessonProgress, setLessonProgress] = useState({ index: 0, total: sampleData.length })
  const [nav, setNav] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [backFn, setBackFn] = useState(null)
  const [tabHistory, setTabHistory] = useState([])
  const [backFnHistory, setBackFnHistory] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [user, setUser] = useState(null)       // supabase User 对象
  const [showLogin, setShowLogin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [showLevelMenu, setShowLevelMenu] = useState(false)
  const [showExerciseHistory, setShowExerciseHistory] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewData, setReviewData] = useState(null)
  const [showCoursesMenu, setShowCoursesMenu] = useState(false)
  const [showQuizMenu, setShowQuizMenu] = useState(false)
  const levelButtonRef = useRef(null)
  const { progress, markMastered, markReview, incrementAttempts, reset, synced } = useProgress(user?.id)

  // Compute prev/next units from ALL_UNITS based on currentLesson

  const allDone = sentences.length > 0 && sentences.every(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0)
  const isTextbookLesson = currentLesson && ALL_UNITS.some(u => u.label === currentLesson)
  const currentUnitIdx = isTextbookLesson ? ALL_UNITS.findIndex(u => u.label === currentLesson) : -1
  const prevUnit = currentUnitIdx > 0 ? ALL_UNITS[currentUnitIdx - 1] : null
  const nextUnit = currentUnitIdx >= 0 ? (currentUnitIdx + 1 < ALL_UNITS.length ? ALL_UNITS[currentUnitIdx + 1] : 'textbook') : null
  const showContinue = allDone && isTextbookLesson && nextUnit !== null

  const handleImport = useCallback((data, label = null) => {
    setSentences(data)
    setExerciseIndex(0)
    setLessonProgress({ index: 0, total: data.length })
    setCurrentLesson(label)
    setTabHistory(h => [...h, tab])
    setBackFnHistory(h => [...h, backFn])
    setTab('exercise')
    setBackFn(null)
    if (label) saveLessonHistory(label, data)
  }, [tab, backFn])

  const handleSettings = useCallback((next) => {
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }, [])

  const handleSelectSentence = useCallback((i) => {
    setExerciseIndex(i)
    setTabHistory(h => [...h, tab])
    setBackFnHistory(h => [...h, backFn])
    setTab('exercise')
    setBackFn(null) // 清空当前 backFn，返回时会从历史恢复
  }, [tab, backFn])

  function navigateTo(id) {
    setTabHistory(h => [...h, tab])
    setBackFnHistory(h => [...h, backFn])
    setTab(id)
    setBackFn(null)
  }

  function handlePageBack() {
    setTabHistory(h => {
      const prev = h[h.length - 1]
      if (prev !== undefined) setTab(prev)
      return h.slice(0, -1)
    })
    setBackFnHistory(h => {
      const prevBackFn = h[h.length - 1]
      setBackFn(prevBackFn ? () => prevBackFn : null)
      return h.slice(0, -1)
    })
  }

  // Track study time while on exercise tab
  const studyStartRef = useRef(null)
  // Supabase Auth 状态监听
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (tab === 'exercise') {
      studyStartRef.current = Date.now()
    } else {
      if (studyStartRef.current) {
        const secs = Math.floor((Date.now() - studyStartRef.current) / 1000)
        if (secs > 0) saveStudyTime(secs, user?.id)
        studyStartRef.current = null
      }
    }
    return () => {
      if (studyStartRef.current) {
        const secs = Math.floor((Date.now() - studyStartRef.current) / 1000)
        if (secs > 0) saveStudyTime(secs, user?.id)
        studyStartRef.current = null
      }
    }
  }, [tab, user?.id])

  // 统一返回逻辑
  const canGoBack = !!(tabHistory.length > 0 || backFn)
  function handleBack() {
    if (tab === 'exercise' && tabHistory.length > 0) {
      handlePageBack()
    }
    else if (backFn) {
      backFn()
      setBackFn(null)
    }
    else if (tabHistory.length > 0) {
      handlePageBack()
    }
  }

  // Enter key triggers next unit when lit up (capture phase)
  useEffect(() => {
    if (tab !== 'exercise' || !showContinue) return
    function handleContinueKey(e) {
      if (e.target.tagName === 'INPUT') return
      if (e.key !== 'Enter') return
      e.preventDefault()
      e.stopPropagation()
      if (nextUnit === 'textbook') {
        navigateTo('textbook')
      } else {
        handleImport(nextUnit.data.slice(nextUnit.slice[0], nextUnit.slice[1]), nextUnit.label)
      }
    }
    window.addEventListener('keydown', handleContinueKey, true)
    return () => window.removeEventListener('keydown', handleContinueKey, true)
  }, [tab, showContinue, nextUnit, handleImport])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur py-0 flex items-center z-30 relative flex-nowrap overflow-x-auto" style={{minHeight:'48px'}}>
        {/* Logo */}
        <div className="shrink-0 cursor-pointer flex items-center gap-1.5 px-3 select-none" onClick={() => navigateTo('home')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
            <span className="text-white font-black text-sm leading-none tracking-tight">OK</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-wide">OK英语</span>
            <span className="text-blue-400/70 text-[9px] tracking-widest font-medium">ENGLISH</span>
          </div>
        </div>
        {/* Left group: 返回 + 首页 + 设置 + 登录 + 练习 */}
        <div className="flex items-center gap-0.5 shrink-0 pl-4">
          <button onClick={() => navigateTo('home')}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${tab === 'home' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'}`}>
            <span className={tab === 'home' ? 'text-blue-400' : ''}><IconHome size={14} /></span>
            <span>首页</span>
          </button>
          <button onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-gray-500 hover:bg-gray-800/60 hover:text-gray-200">
            <IconSettings size={14} /><span>设置</span>
          </button>
          {user ? (
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-gray-500 hover:bg-gray-800/60 hover:text-gray-200" title="点击退出登录">
              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">{user.email[0].toUpperCase()}</div>
              <span className="max-w-[80px] truncate">{user.email.split('@')[0]}</span>
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-gray-500 hover:bg-gray-800/60 hover:text-gray-200">
              <IconUser size={14} /><span>登录</span>
            </button>
          )}
          <button onClick={() => setShowExerciseHistory(v => !v)}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${tab === 'exercise' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'}`}>
            <span className={tab === 'exercise' ? 'text-blue-400' : ''}><IconPencil size={14} /></span>
            <span>练习</span>
          </button>
        </div>

        {/* Center: current lesson info */}
        <div className="flex justify-center px-2 whitespace-nowrap">
          {currentLesson && tab === 'exercise' ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 truncate max-w-[180px]">{currentLesson}</span>
              {lessonProgress.total > 0 && (
                <span className="text-gray-700 font-mono text-xs tabular-nums">{lessonProgress.index + 1}/{lessonProgress.total}</span>
              )}
            </div>
          ) : null}
        </div>

        {/* Right group: 课程 + 教材 + 语法 + 返回 */}
        <div className="flex items-center gap-0.5 shrink-0 whitespace-nowrap ml-auto pr-4">
          <button onClick={() => navigateTo('courses')}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${tab === 'courses' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'}`}>
            <span className={tab === 'courses' ? 'text-blue-400' : ''}><IconBookOpen size={14} /></span>
            <span>课程</span>
          </button>
          <button onClick={() => navigateTo('textbook')}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${tab === 'textbook' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'}`}>
            <span className={tab === 'textbook' ? 'text-blue-400' : ''}><IconBook size={14} /></span>
            <span>教材</span>
          </button>
          <button onClick={() => navigateTo('grammar')}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${tab === 'grammar' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'}`}>
            <span className={tab === 'grammar' ? 'text-blue-400' : ''}><IconGraduationCap size={14} /></span>
            <span>语法</span>
          </button>
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0
              ${canGoBack ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-800 cursor-default'}`}
          >
            <IconChevronLeft size={14} /><span>返回</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">

        {/* Main content */}
        <main
          className={`flex-1 flex flex-col items-center justify-start px-4 pb-4 transition-all duration-200${tab === 'exercise' ? ' ocean-main' : ''}`}
          style={{ paddingTop: (tab === 'home' || tab === 'courses' || tab === 'textbook' || tab === 'grammar' || tab === 'syncpractice') ? '0.75rem' : '8vh' }}
        >
          <div style={{ display: tab === 'home' ? 'contents' : 'none' }}>
            <Dashboard
              sentences={sentences}
              progress={progress}
              onStartExercise={() => setTab('exercise')}
              onImport={handleImport}
              changyongData={changyongData}
              sampleData={sampleData}
            />
          </div>
          <div style={{ display: tab === 'courses' ? 'contents' : 'none' }}>
            <Courses
              onImport={handleImport}
              changyongData={changyongData}
              sampleData={sampleData}
              onClose={() => setTab('exercise')}
              onSetBack={setBackFn}
              progress={progress}
            />
          </div>
          <div style={{ display: tab === 'textbook' ? 'contents' : 'none' }}>
            <Textbook
              onImport={handleImport}
              onClose={() => setTab('exercise')}
              onSetBack={setBackFn}
              progress={progress}
              onNavigate={navigateTo}
              requireSpeak={settings?.requireSpeak}
            />
          </div>
          <div style={{ display: tab === 'grammar' ? 'contents' : 'none' }}>
            <Grammar
              onImport={handleImport}
              onClose={() => setTab('exercise')}
              onSetBack={setBackFn}
              progress={progress}
            />
          </div>
          {tab === 'exercise' && (
            <ExerciseView
              sentences={sentences}
              progress={progress}
              onMarkMastered={markMastered}
              onMarkReview={markReview}
              onIncrementAttempts={incrementAttempts}
              settings={settings}
              initialIndex={exerciseIndex}
              onProgressChange={(i, total) => setLessonProgress({ index: i, total })}
              onNav={setNav}
              userId={user?.id}
            />
          )}
          {tab === 'list' && (
            <div className="w-full max-w-4xl">
              <SentenceList sentences={sentences} progress={progress} onSelect={handleSelectSentence} />
            </div>
          )}
          {tab === 'import' && (
            <div className="w-full max-w-sm">
              <ImportPanel onImport={handleImport} currentCount={sentences.length} />
            </div>
          )}
          {tab === 'quiz' && (
            <Quiz onImport={handleImport} onClose={() => setTab('home')} />
          )}
          {tab === 'fillblank' && (
            <FillBlank onClose={() => setTab('home')} />
          )}
          {tab === 'syncpractice' && (
            <SyncPractice onClose={() => setTab('home')} />
          )}
        </main>
      </div>

      {/* Fixed bottom bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800/60 z-10">
        <div>
          {tab === 'exercise' && nav && (
            <>
              <div className="px-4 pt-2.5 pb-3 flex items-center justify-center gap-1.5 flex-wrap">
                {/* 上一句 / 下一句 */}
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                  <button onClick={nav.prev} disabled={!nav.canPrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-gray-800 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    <IconArrowLeft size={14} /><span>上一句</span>
                  </button>
                  <button onClick={nav.next} disabled={!nav.canNext}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-gray-800 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    <span>下一句</span><IconArrowRight size={14} />
                  </button>
                </div>

                <div className="w-px h-5 bg-gray-800 mx-0.5" />

                {/* 已掌握 / 复习 */}
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                  <button onClick={nav.mastered}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${nav.status === 'mastered' ? 'bg-white/10 text-white border border-white/20' : 'text-white/70 hover:bg-gray-800 hover:text-white'}`}>
                    <IconCheck size={14} /><span>已掌握</span>
                  </button>
                  <button
                    onClick={() => { setReviewData(getRecentErrors(2)); setShowReview(true) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-gray-800 hover:text-white transition-colors">
                    <IconBookmark size={14} /><span>复习</span>
                  </button>
                </div>

                <div className="w-px h-5 bg-gray-800 mx-0.5" />

                {/* 解释 */}
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                  <button onClick={nav.toggleCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-gray-800 hover:text-white transition-colors">
                    <IconInfo size={14} /><span>解释</span>
                  </button>
                </div>

                <div className="w-px h-5 bg-gray-800 mx-0.5" />

                {/* 拆句: 初级 / 中级 / 高级 */}
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                  {[1, 2, 3].map(level => {
                    const labels = { 1: '初级', 2: '中级', 3: '高级' }
                    const isActive = nav.splitLevel === level
                    return (
                      <button key={level} onClick={() => nav.setSplitLevel?.(level)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors
                          ${isActive ? 'bg-white/10 text-white border border-white/20' : 'text-white/70 hover:bg-gray-800 hover:text-white'}`}>
                        {isActive && <IconSplit size={12} />}
                        <span>拆{labels[level]}</span>
                      </button>
                    )
                  })}
                </div>

                {lessonProgress.total > 0 && (
                  <span className="text-white/30 text-xs tabular-nums ml-1 font-mono">{lessonProgress.index + 1}/{lessonProgress.total}</span>
                )}
              </div>
              <div className="px-4 pb-2.5">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: lessonProgress.total ? `${((lessonProgress.index + 1) / lessonProgress.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </footer>

      {/* Exercise history modal */}
      {showExerciseHistory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60" onClick={() => setShowExerciseHistory(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-white text-sm font-semibold">最近学习记录</span>
              <button onClick={() => setShowExerciseHistory(false)} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {(() => {
                const history = loadLessonHistory()
                if (history.length === 0) return <div className="text-gray-500 text-sm text-center py-6">暂无记录</div>
                return history.slice(0, 10).map((h, i) => (
                  <button key={i}
                    onClick={() => {
                      const unit = ALL_UNITS.find(u => u.label === h.label)
                      if (unit) {
                        handleImport(unit.data.slice(unit.slice[0], unit.slice[1]), unit.label)
                      }
                      setShowExerciseHistory(false)
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-800 transition-colors flex items-center justify-between gap-3 border-b border-gray-800/50 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-200 truncate">{h.label}</div>
                      <div className="text-xs text-gray-500">{h.count} 句 · {new Date(h.ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <IconArrowRight size={14} className="text-gray-600 shrink-0" />
                  </button>
                ))
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Review modal: top error sentences & words */}
      {showReview && reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70" onClick={() => setShowReview(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
              <span className="text-white text-sm font-semibold">近2天错误最多（复习）</span>
              <button onClick={() => setShowReview(false)} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 py-2">
              {reviewData.topSentences.length === 0 && reviewData.topWords.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-8">近2天暂无错误记录</div>
              ) : (
                <>
                  {reviewData.topSentences.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 mt-1">错误句子 Top {reviewData.topSentences.length}</div>
                      {reviewData.topSentences.map((item, i) => (
                        <button key={i}
                          onClick={() => {
                            // find the sentence in all data sources
                            const allData = [...grade3UpData, ...grade3DownData, ...grade4UpData, ...grade4DownData, ...grade5UpData, ...sampleData]
                            const s = allData.find(d => d.id === item.sentenceId)
                            if (s) {
                              handleImport([s], `复习 · 错误句子`)
                            }
                            setShowReview(false)
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors mb-1 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{item.sentenceEn}</div>
                          </div>
                          <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full shrink-0">错{item.count}次</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {reviewData.topWords.length > 0 && (
                    <div className="px-4 pb-2 border-t border-gray-800 mt-1 pt-3">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">错误单词 Top {reviewData.topWords.length}</div>
                      <div className="flex flex-wrap gap-2">
                        {reviewData.topWords.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                            <span className="text-sm text-white font-medium">{item.word}</span>
                            <span className="text-xs text-red-400">×{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <Settings settings={settings} onChange={handleSettings} onReset={reset} onClose={() => setShowSettings(false)} />
      )}

      {/* Login modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
