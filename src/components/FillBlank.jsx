import { useState } from 'react'
import { fillblankBank } from '../data/fillblankData'

export default function FillBlank({ onClose }) {
  const [view, setView] = useState('levels')
  const [level, setLevel] = useState(null)
  const [group, setGroup] = useState(null)
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const questions = level && group ? fillblankBank[level][group] : []

  function speak(text) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.9
    speechSynthesis.speak(u)
  }

  function selectLevel(lv) {
    setLevel(lv)
    setView('groups')
  }

  function selectGroup(grp) {
    setGroup(grp)
    setCurrent(0)
    setInput('')
    setResult(null)
    setScore({ correct: 0, total: 0 })
    setView('quiz')
  }

  function submit() {
    const q = questions[current]
    const isCorrect = input.trim().toLowerCase() === q.answer.toLowerCase()
    setResult(isCorrect ? 'correct' : 'wrong')
    setScore(s => ({ ...s, correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setInput('')
      setResult(null)
    } else {
      setView('result')
    }
  }

  function restart() {
    setView('levels')
    setLevel(null)
    setGroup(null)
    setCurrent(0)
    setInput('')
    setResult(null)
    setScore({ correct: 0, total: 0 })
  }

  if (view === 'levels') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">填空题练习</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(fillblankBank).map(lv => (
              <button key={lv} onClick={() => selectLevel(lv)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 text-left transition-colors">
                <div className="text-blue-400 text-lg font-bold mb-2">{fillblankBank[lv].name}</div>
                <div className="text-gray-400 text-sm">10道题目</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'groups') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{fillblankBank[level].name}</h2>
            <button onClick={() => setView('levels')} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => selectGroup('groupA')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 text-left transition-colors">
              <div className="text-green-400 text-lg font-bold mb-2">A组</div>
              <div className="text-gray-400 text-sm">5道题目</div>
            </button>
            <button onClick={() => selectGroup('groupB')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 text-left transition-colors">
              <div className="text-purple-400 text-lg font-bold mb-2">B组</div>
              <div className="text-gray-400 text-sm">5道题目</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">练习完成！</h2>
          <div className="text-6xl font-bold text-blue-400 mb-2">{score.correct}/{score.total}</div>
          <div className="text-gray-400 mb-8">正确率: {Math.round(score.correct / score.total * 100)}%</div>
          <div className="flex gap-4 justify-center">
            <button onClick={restart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  if (!q) return null

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400 text-sm">题目 {current + 1}/{questions.length}</div>
          <button onClick={restart} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-white text-xl" style={{ fontFamily: 'AI Nile, monospace' }}>{q.sentence}</div>
            <button onClick={() => speak(q.sentence)} className="text-blue-400 hover:text-blue-300">🔊</button>
          </div>
          <div className="text-gray-400 text-sm" style={{ fontFamily: 'KaiTi-Simplified', fontSize: '20px' }}>{q.chinese}</div>
        </div>

        {!result && (
          <div className="mb-6">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input && submit()}
              placeholder="请输入答案"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
        )}

        {result && (
          <div className={`mb-6 p-4 rounded-xl ${result === 'correct' ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
            <div className={`font-bold mb-2 ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {result === 'correct' ? '✓ 回答正确！' : '✗ 回答错误'}
            </div>
            {result === 'wrong' && (
              <div className="text-white mb-2">正确答案: <span className="font-bold">{q.answer}</span></div>
            )}
            <div className="text-gray-300 text-sm">{q.explanation}</div>
          </div>
        )}

        <div className="flex gap-3">
          {!result ? (
            <button onClick={submit} disabled={!input}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors">
              提交答案
            </button>
          ) : (
            <button onClick={next}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
              {current < questions.length - 1 ? '下一题' : '查看结果'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
