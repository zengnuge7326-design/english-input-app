import { useState, useEffect, useCallback } from 'react'
import poetryData from '../data/poetry.json'

const POETRY_KEY = 'poetry_progress'

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(POETRY_KEY) || '{}') } catch { return {} }
}
function saveProgress(p) {
  localStorage.setItem(POETRY_KEY, JSON.stringify(p))
}

// Color themes for poems
const POEM_THEMES = [
  { bg: 'from-emerald-600 to-teal-700', light: 'bg-emerald-50', accent: 'text-emerald-400', btn: 'bg-emerald-500 hover:bg-emerald-400', ring: 'ring-emerald-400', emoji: '🌧️' },
  { bg: 'from-orange-600 to-red-700', light: 'bg-orange-50', accent: 'text-orange-400', btn: 'bg-orange-500 hover:bg-orange-400', ring: 'ring-orange-400', emoji: '⚔️' },
  { bg: 'from-pink-500 to-purple-700', light: 'bg-pink-50', accent: 'text-pink-400', btn: 'bg-pink-500 hover:bg-pink-400', ring: 'ring-pink-400', emoji: '🌸' },
]

// Feedback messages
const CORRECT_MSGS = ['太棒了！🎉', '真厉害！⭐', '答对了！👏', '很好！继续加油！💪', '完美！🌟']
const WRONG_MSGS = ['差一点哦 💭', '再想想看 🤔', '没关系，试试别的 😊', '加油，你可以的！💪']

function randomMsg(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// Confetti burst animation
function ConfettiBurst({ show }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => {
        const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']
        const color = colors[i % colors.length]
        const left = 20 + Math.random() * 60
        const delay = Math.random() * 0.3
        const size = 6 + Math.random() * 8
        return (
          <div
            key={i}
            className="absolute rounded-full animate-confetti"
            style={{
              left: `${left}%`, top: '-10px',
              width: size, height: size,
              backgroundColor: color,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti-fall 2s ease-out forwards; }
      `}</style>
    </div>
  )
}

// Feedback toast
function FeedbackToast({ message, isCorrect, show }) {
  if (!show) return null
  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-lg font-bold transition-all duration-300 animate-bounce-in
      ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
      {message}
      <style>{`
        @keyframes bounce-in {
          0% { transform: translate(-50%, -30px) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, 5px) scale(1.05); }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}

// Progress bar component
function ProgressBar({ current, total, color = 'bg-emerald-500' }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ========= STAGE: 读诗 (Read Poem) =========
function ReadStage({ poem, theme, onNext }) {
  const [showPinyin, setShowPinyin] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [activeAnno, setActiveAnno] = useState(null)

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-5 animate-fade-in">
      {/* Poem card */}
      <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-6 shadow-2xl`}>
        <div className="text-center mb-4">
          <span className="text-4xl mb-2 block">{theme.emoji}</span>
          <h2 className="text-2xl font-bold text-white">{poem.title}</h2>
          <p className="text-white/70 text-sm mt-1">[{poem.dynasty}] {poem.author} · {poem.type}</p>
        </div>
        <div className="bg-black/20 rounded-2xl p-5 backdrop-blur">
          {poem.lines.map((line, i) => (
            <div key={i} className="mb-3 text-center">
              {showPinyin && (
                <div className="text-xs text-white/50 mb-0.5 tracking-wider">{poem.pinyin[i]}</div>
              )}
              <div className="text-xl text-white font-serif tracking-widest">{line}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setShowPinyin(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${showPinyin ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'}`}
          >
            {showPinyin ? '隐藏拼音' : '显示拼音'}
          </button>
          <button
            onClick={() => setShowAnnotations(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${showAnnotations ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'}`}
          >
            {showAnnotations ? '收起注释' : '查看注释'}
          </button>
        </div>
      </div>

      {/* Annotations */}
      {showAnnotations && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-fade-in">
          <h3 className={`text-sm font-bold ${theme.accent} mb-3`}>📖 注释</h3>
          <div className="flex flex-wrap gap-2">
            {poem.annotations.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveAnno(activeAnno === i ? null : i)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all
                  ${activeAnno === i ? `${theme.btn} text-white shadow-lg scale-105` : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {a.word}
              </button>
            ))}
          </div>
          {activeAnno !== null && (
            <div className="mt-3 p-3 bg-gray-800 rounded-xl text-sm text-gray-300 animate-fade-in">
              <span className={`font-bold ${theme.accent}`}>{poem.annotations[activeAnno].word}</span>
              ：{poem.annotations[activeAnno].meaning}
            </div>
          )}
        </div>
      )}

      {/* Meaning */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className={`text-sm font-bold ${theme.accent} mb-2`}>💡 诗意</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{poem.meaning}</p>
      </div>

      {/* Theme */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className={`text-sm font-bold ${theme.accent} mb-2`}>🎯 主题</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{poem.theme}</p>
      </div>

      {/* Start practice button */}
      <button
        onClick={onNext}
        className={`w-full py-4 rounded-2xl ${theme.btn} text-white text-lg font-bold shadow-xl transition-all active:scale-95`}
      >
        开始练习 →
      </button>
    </div>
  )
}

// ========= STAGE: 填空 (Fill Blanks) =========
function FillBlankStage({ poem, theme, onNext, onScore }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [shake, setShake] = useState(false)

  const blanks = poem.fillBlanks
  const item = blanks[current]

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt)
    const correct = opt === item.answer
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
      setFeedback(randomMsg(CORRECT_MSGS))
    } else {
      setFeedback(randomMsg(WRONG_MSGS))
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleNext() {
    if (current < blanks.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setIsCorrect(null)
      setFeedback(null)
    } else {
      onScore(score + (isCorrect ? 0 : 0)) // score already updated
      onNext(score)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-5 animate-fade-in">
      <FeedbackToast message={feedback} isCorrect={isCorrect} show={feedback !== null} />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <ProgressBar current={current + (selected !== null ? 1 : 0)} total={blanks.length} color={theme.btn.split(' ')[0]} />
        <span className="text-xs text-gray-500 whitespace-nowrap">{current + 1}/{blanks.length}</span>
      </div>

      {/* Stage label */}
      <div className="text-center">
        <span className="text-2xl">✏️</span>
        <h3 className="text-lg font-bold text-white mt-1">填空练习</h3>
        <p className="text-gray-500 text-sm">选择正确的字填入空白处</p>
      </div>

      {/* Question card */}
      <div className={`bg-gray-900 border-2 rounded-3xl p-6 text-center transition-all ${shake ? 'animate-shake border-red-500' : isCorrect === true ? `border-emerald-500` : 'border-gray-800'}`}>
        <p className="text-2xl font-serif tracking-widest text-white">
          {item.text.replace('___', selected !== null ? (isCorrect ? `【${item.answer}】` : `【${selected}→${item.answer}】`) : '＿＿')}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {item.options.map((opt, i) => {
          let cls = 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-500'
          if (selected !== null) {
            if (opt === item.answer) cls = 'bg-emerald-600 border-emerald-400 text-white scale-105'
            else if (opt === selected && !isCorrect) cls = 'bg-red-600/50 border-red-500 text-white'
            else cls = 'bg-gray-800/50 border-gray-800 text-gray-600'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={`py-4 px-6 rounded-2xl border-2 text-xl font-bold transition-all duration-200 active:scale-95 ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl ${theme.btn} text-white text-lg font-bold shadow-xl transition-all active:scale-95 animate-fade-in`}
        >
          {current < blanks.length - 1 ? '下一题 →' : '进入选择题 →'}
        </button>
      )}

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .animate-shake { animation: shake 0.4s ease-out; }
      `}</style>
    </div>
  )
}

// ========= STAGE: 选择题 (Quiz) =========
function QuizStage({ poem, theme, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shake, setShake] = useState(false)

  const questions = poem.quiz
  const q = questions[current]

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === q.answer
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
      setFeedback(randomMsg(CORRECT_MSGS))
    } else {
      setFeedback(randomMsg(WRONG_MSGS))
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setIsCorrect(null)
      setFeedback(null)
    } else {
      setShowConfetti(true)
      setTimeout(() => {
        onComplete(score + (isCorrect ? 1 : 0))
      }, 1500)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-5 animate-fade-in">
      <ConfettiBurst show={showConfetti} />
      <FeedbackToast message={feedback} isCorrect={isCorrect} show={feedback !== null} />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <ProgressBar current={current + (selected !== null ? 1 : 0)} total={questions.length} color={theme.btn.split(' ')[0]} />
        <span className="text-xs text-gray-500 whitespace-nowrap">{current + 1}/{questions.length}</span>
      </div>

      {/* Stage label */}
      <div className="text-center">
        <span className="text-2xl">🧠</span>
        <h3 className="text-lg font-bold text-white mt-1">理解练习</h3>
        <p className="text-gray-500 text-sm">选择正确的答案</p>
      </div>

      {/* Question card */}
      <div className={`bg-gray-900 border-2 rounded-3xl p-6 transition-all ${shake ? 'animate-shake border-red-500' : 'border-gray-800'}`}>
        <p className="text-lg text-white font-medium leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          const labels = ['A', 'B', 'C', 'D']
          let cls = 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          if (selected !== null) {
            if (i === q.answer) cls = 'bg-emerald-600 border-emerald-400 text-white'
            else if (i === selected && !isCorrect) cls = 'bg-red-600/50 border-red-500 text-white'
            else cls = 'bg-gray-800/50 border-gray-800 text-gray-600'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full py-3.5 px-5 rounded-2xl border-2 text-left text-base font-medium transition-all duration-200 flex items-center gap-3 active:scale-[0.98] ${cls}`}
            >
              <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm font-bold shrink-0">{labels[i]}</span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      {selected !== null && !showConfetti && (
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl ${theme.btn} text-white text-lg font-bold shadow-xl transition-all active:scale-95 animate-fade-in`}
        >
          {current < questions.length - 1 ? '下一题 →' : '完成！🎉'}
        </button>
      )}

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .animate-shake { animation: shake 0.4s ease-out; }
      `}</style>
    </div>
  )
}

// ========= STAGE: 完成 (Complete) =========
function CompleteStage({ poem, theme, fillScore, quizScore, onBack }) {
  const totalQ = poem.fillBlanks.length + poem.quiz.length
  const totalScore = fillScore + quizScore
  const pct = Math.round((totalScore / totalQ) * 100)
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 animate-fade-in text-center">
      <div className="text-6xl mt-4">
        {stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💪'}
      </div>
      <h2 className="text-2xl font-bold text-white">
        {stars === 3 ? '完美通关！' : stars === 2 ? '表现不错！' : '继续加油！'}
      </h2>

      {/* Stars display */}
      <div className="flex gap-2 text-4xl">
        {[1, 2, 3].map(s => (
          <span key={s} className={s <= stars ? 'animate-star-pop' : 'opacity-30'} style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
        ))}
      </div>

      {/* Score card */}
      <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-6 w-full shadow-2xl`}>
        <h3 className="text-white font-bold text-lg mb-4">《{poem.title}》学习报告</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-2xl p-4">
            <div className="text-3xl font-bold text-white">{fillScore}/{poem.fillBlanks.length}</div>
            <div className="text-white/60 text-sm mt-1">填空正确</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4">
            <div className="text-3xl font-bold text-white">{quizScore}/{poem.quiz.length}</div>
            <div className="text-white/60 text-sm mt-1">选择正确</div>
          </div>
        </div>
        <div className="mt-4 bg-black/20 rounded-2xl p-4">
          <div className="text-4xl font-bold text-white">{pct}%</div>
          <div className="text-white/60 text-sm mt-1">总正确率</div>
        </div>
      </div>

      {/* XP reward */}
      <div className="bg-yellow-500/10 border border-yellow-600/30 rounded-2xl px-6 py-3 flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <span className="text-yellow-400 font-bold text-lg">+{totalScore * 10} XP</span>
      </div>

      <button
        onClick={onBack}
        className="w-full py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-lg font-bold transition-all active:scale-95"
      >
        返回古诗列表
      </button>

      <style>{`
        @keyframes star-pop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-star-pop { animation: star-pop 0.5s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  )
}

// ========= MAIN: Poetry Module =========
export default function Poetry({ onClose, onSetBack }) {
  const [progress, setProgress] = useState(loadProgress)
  const [selectedPoem, setSelectedPoem] = useState(null) // poem id
  const [stage, setStage] = useState('read') // read | fill | quiz | complete
  const [fillScore, setFillScore] = useState(0)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    onSetBack?.(selectedPoem ? () => () => { setSelectedPoem(null); setStage('read') } : null)
  }, [selectedPoem, onSetBack])

  const poem = selectedPoem ? poetryData.find(p => p.id === selectedPoem) : null
  const themeIdx = poem ? (poem.id - 1) % POEM_THEMES.length : 0
  const theme = POEM_THEMES[themeIdx]

  function handleComplete(qScore) {
    const p = { ...progress }
    const key = `poem_${selectedPoem}`
    const prev = p[key] || { stars: 0, bestPct: 0, attempts: 0 }
    const totalQ = poem.fillBlanks.length + poem.quiz.length
    const total = fillScore + qScore
    const pct = Math.round((total / totalQ) * 100)
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1
    p[key] = {
      stars: Math.max(prev.stars, stars),
      bestPct: Math.max(prev.bestPct, pct),
      attempts: (prev.attempts || 0) + 1,
    }
    setProgress(p)
    saveProgress(p)
    setQuizScore(qScore)
    setStage('complete')
  }

  // Poem detail view
  if (poem) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        {stage === 'read' && (
          <ReadStage poem={poem} theme={theme} onNext={() => setStage('fill')} />
        )}
        {stage === 'fill' && (
          <FillBlankStage poem={poem} theme={theme} onNext={(score) => { setFillScore(score); setStage('quiz') }} onScore={() => {}} />
        )}
        {stage === 'quiz' && (
          <QuizStage poem={poem} theme={theme} onComplete={handleComplete} />
        )}
        {stage === 'complete' && (
          <CompleteStage
            poem={poem} theme={theme}
            fillScore={fillScore} quizScore={quizScore}
            onBack={() => { setSelectedPoem(null); setStage('read') }}
          />
        )}

        <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.35s ease-out; }
        `}</style>
      </div>
    )
  }

  // ========= Poem list (关卡地图 style) =========
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <span className="text-4xl block mb-2">📜</span>
        <h1 className="text-2xl font-bold text-white">古诗三首</h1>
        <p className="text-gray-500 text-sm mt-1">四年级下册 · 读诗、填空、选择</p>
      </div>

      {/* Map path */}
      <div className="flex flex-col items-center gap-4">
        {poetryData.map((p, i) => {
          const t = POEM_THEMES[i % POEM_THEMES.length]
          const key = `poem_${p.id}`
          const pg = progress[key] || { stars: 0, bestPct: 0, attempts: 0 }
          const isLocked = false // all unlocked for now

          return (
            <div key={p.id} className="w-full flex flex-col items-center">
              {/* Connecting line */}
              {i > 0 && <div className="w-0.5 h-6 bg-gray-800 -mt-4 mb-0" />}

              <button
                onClick={() => { setSelectedPoem(p.id); setStage('read'); setFillScore(0); setQuizScore(0) }}
                disabled={isLocked}
                className={`w-full bg-gray-900 border-2 rounded-3xl p-5 transition-all hover:scale-[1.02] active:scale-[0.98]
                  ${pg.stars > 0 ? `border-emerald-600/50 shadow-lg shadow-emerald-900/20` : 'border-gray-800 hover:border-gray-600'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Level icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.bg} flex items-center justify-center text-3xl shrink-0 shadow-lg`}>
                    {pg.stars >= 3 ? '🏆' : t.emoji}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">第{i + 1}关</span>
                      {pg.stars > 0 && (
                        <span className="text-yellow-400 text-sm">
                          {'⭐'.repeat(pg.stars)}
                        </span>
                      )}
                    </div>
                    <div className="text-white font-medium">《{p.title}》</div>
                    <div className="text-gray-500 text-sm">[{p.dynasty}] {p.author} · {p.type}</div>
                    {pg.attempts > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        最佳 {pg.bestPct}% · 已练{pg.attempts}次
                      </div>
                    )}
                  </div>
                  <div className={`text-2xl ${pg.stars > 0 ? 'text-emerald-400' : 'text-gray-700'}`}>
                    {pg.stars > 0 ? '✓' : '→'}
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Total XP */}
      {Object.keys(progress).length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-600/30 rounded-2xl px-5 py-2.5">
            <span className="text-xl">✨</span>
            <span className="text-yellow-400 font-bold">
              总 XP: {Object.values(progress).reduce((s, p) => s + (p.bestPct || 0), 0) * 10}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
