import { useState } from 'react'
import {
  listenWordBank,
  listenSentenceBank,
  listenOrderBank,
  listenResponseBank,
  listenTranslateBank,
} from '../data/listeningData'

const BANK_MAP = {
  listen_word:      listenWordBank,
  listen_sentence:  listenSentenceBank,
  listen_order:     listenOrderBank,
  listen_response:  listenResponseBank,
  listen_translate: listenTranslateBank,
}

const TYPE_LABEL = {
  listen_word:      '听单词',
  listen_sentence:  '听句子',
  listen_order:     '连词成句',
  listen_response:  '听问答',
  listen_translate: '听翻译',
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

// ── 连词成句题 ──────────────────────────────────────────────────────────────
function WordOrderQuestion({ q, onResult }) {
  const [arranged, setArranged] = useState([])
  const [pool, setPool] = useState(() => {
    // shuffle
    const arr = [...q.words]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(null)

  function addWord(idx) {
    if (submitted) return
    const word = pool[idx]
    setPool(p => p.filter((_, i) => i !== idx))
    setArranged(a => [...a, word])
  }

  function removeWord(idx) {
    if (submitted) return
    const word = arranged[idx]
    setArranged(a => a.filter((_, i) => i !== idx))
    setPool(p => [...p, word])
  }

  function submit() {
    const isCorrect = arranged.join(' ') === q.answer.join(' ')
    setCorrect(isCorrect)
    setSubmitted(true)
    onResult(isCorrect)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-300 text-sm">{q.zh}</div>
        <button onClick={() => speak(q.sentence)} className="text-blue-400 hover:text-blue-300 text-lg">🔊</button>
      </div>

      {/* 已排列区 */}
      <div className="min-h-12 bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-wrap gap-2 mb-3">
        {arranged.length === 0 && <span className="text-gray-600 text-sm">点击下方单词排列句子</span>}
        {arranged.map((w, i) => (
          <button key={i} onClick={() => removeWord(i)}
            disabled={submitted}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${submitted
                ? correct ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
                : 'bg-blue-700 hover:bg-blue-600 text-white'}`}>
            {w}
          </button>
        ))}
      </div>

      {/* 词池 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pool.map((w, i) => (
          <button key={i} onClick={() => addWord(i)}
            disabled={submitted}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {w}
          </button>
        ))}
      </div>

      {submitted && !correct && (
        <div className="text-sm text-gray-400 mb-2">正确答案：<span className="text-white">{q.answer.join(' ')}</span></div>
      )}

      {!submitted && (
        <button onClick={submit} disabled={arranged.length === 0}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm">
          提交
        </button>
      )}
    </div>
  )
}

// ── 选择题（听单词/听句子/听问答/听翻译）────────────────────────────────────
function ChoiceQuestion({ q, type, onResult }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // 播放文本
  const textToSpeak = type === 'listen_word' ? q.word
    : type === 'listen_sentence' ? q.sentence
    : type === 'listen_response' ? q.question
    : type === 'listen_translate' ? q.sentence
    : ''

  function submit(idx) {
    if (submitted) return
    setSelected(idx)
    setSubmitted(true)
    onResult(idx === q.correct)
  }

  return (
    <div>
      {/* 播放按钮 */}
      <div className="flex items-center justify-center mb-6">
        <button onClick={() => speak(textToSpeak)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-2xl transition-colors">
          🔊
        </button>
      </div>

      {type === 'listen_response' && (
        <div className="text-center text-gray-400 text-sm mb-1">{q.zh}</div>
      )}
      {type === 'listen_word' && (
        <div className="text-center text-gray-500 text-xs mb-4">听音选词</div>
      )}
      {type === 'listen_sentence' && (
        <div className="text-center text-gray-500 text-xs mb-4">听音选句</div>
      )}
      {type === 'listen_translate' && (
        <div className="text-center text-gray-500 text-xs mb-4">听音选译</div>
      )}

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => submit(i)} disabled={submitted}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors
              ${submitted
                ? i === q.correct
                  ? 'bg-green-800/60 border border-green-600 text-green-200'
                  : i === selected
                  ? 'bg-red-800/60 border border-red-600 text-red-200'
                  : 'bg-gray-800 border border-gray-700 text-gray-500'
                : 'bg-gray-800 border border-gray-700 text-white hover:border-blue-500 hover:bg-blue-900/20'}`}>
            <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function ListeningPractice({ type, onClose }) {
  const bank = BANK_MAP[type] || []
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState([])           // true/false per question
  const [pendingResult, setPendingResult] = useState(null) // true/false after submit
  const [done, setDone] = useState(false)

  const q = bank[current]
  const isOrder = type === 'listen_order'

  function handleResult(isCorrect) {
    setPendingResult(isCorrect)
  }

  function handleNext() {
    const newScores = [...scores, pendingResult]
    if (current < bank.length - 1) {
      setScores(newScores)
      setCurrent(current + 1)
      setPendingResult(null)
    } else {
      setScores(newScores)
      setDone(true)
    }
  }

  // 结果页
  if (done) {
    const correct = scores.filter(Boolean).length
    const total = scores.length
    const pct = Math.round((correct / total) * 100)
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <div className="text-2xl font-bold text-white mb-1">练习完成</div>
          <div className="text-gray-400 text-sm mb-4">{TYPE_LABEL[type]}</div>
          <div className="text-5xl font-bold text-blue-400 mb-1">{correct}/{total}</div>
          <div className="text-gray-500 text-sm mb-6">正确率 {pct}%</div>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors">
              返回
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* 顶栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{TYPE_LABEL[type]}</div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">{current + 1} / {bank.length}</div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-lg transition-colors">✕</button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((current) / bank.length) * 100}%` }} />
      </div>

      {/* 题目 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
        {isOrder
          ? <WordOrderQuestion key={current} q={q} onResult={handleResult} />
          : <ChoiceQuestion key={current} q={q} type={type} onResult={handleResult} />
        }
      </div>

      {/* 结果反馈 + 下一题按钮 */}
      {pendingResult !== null && (
        <div className={`rounded-xl px-4 py-3 mb-3 flex items-center gap-2 text-sm font-medium
          ${pendingResult ? 'bg-green-900/40 border border-green-700 text-green-300' : 'bg-red-900/40 border border-red-700 text-red-300'}`}>
          {pendingResult ? '✓ 正确！' : '✗ 回答错误'}
        </div>
      )}

      {pendingResult !== null && (
        <button onClick={handleNext}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm">
          {current < bank.length - 1 ? '下一题' : '查看结果'}
        </button>
      )}
    </div>
  )
}
