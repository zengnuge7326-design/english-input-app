import { useState, useEffect, useMemo, useRef } from 'react'
import { IconArrowLeft } from './Icons'
import { getGrammar } from '../data/grammar'
import { saveGrammarScore } from '../data/grammar/progress'
import { useSound } from '../hooks/useSound'
import OceanBg from './OceanBg'
import PandaMascot from './PandaMascot'

// 语法学习页（两种模式）
// mode: 'lesson'（语法一·讲解）/ 'practice'（语法二·练习）
export default function GrammarLesson({ bookId, bookName, unitLabel, mode, onClose, settings, onXp, onCrystal }) {
  const data = useMemo(() => getGrammar(bookId, unitLabel), [bookId, unitLabel])
  const questions = useMemo(() => (mode === 'practice' ? data?.practice : data?.lesson) || [], [data, mode])
  const totalQ = questions.length

  const [idx, setIdx] = useState(0)
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [score, setScore] = useState({ right: 0, wrong: 0 })
  const [done, setDone] = useState(false)
  const [xpFlies, setXpFlies] = useState([])

  const sounds = useSound(settings)
  const comboRef = useRef(0)
  const rewardedRef = useRef(false)

  // 进入新题重置
  useEffect(() => { setPick(null); setPandaMood('idle') }, [idx])

  if (!data) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 relative">
        <OceanBg />
        <div className="relative z-10">
          <button onClick={onClose} className="flex items-center gap-1.5 text-slate-300 hover:text-white mb-6">
            <IconArrowLeft size={18}/> 返回
          </button>
          <div className="rounded-3xl bg-gradient-to-br from-purple-700 to-fuchsia-500 p-8 text-center shadow-xl">
            <div className="text-5xl mb-3">📚</div>
            <div className="text-white text-xl font-bold mb-2">{bookName} · {unitLabel}</div>
            <div className="text-white/80 text-base">本单元语法暂未上线，敬请期待 🛠️</div>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold">
              返回单元
            </button>
          </div>
        </div>
      </div>
    )
  }

  function flyXp(amount, color = '#fde68a') {
    const id = Date.now() + Math.random()
    setXpFlies(f => [...f, { id, amount, color }])
    setTimeout(() => setXpFlies(f => f.filter(x => x.id !== id)), 1100)
  }

  const q = questions[idx]
  const right = pick === q?.answer

  function onPick(i) {
    if (pick !== null) return
    setPick(i)
    if (i === q.answer) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      comboRef.current += 1
      const combo = comboRef.current
      const base = mode === 'practice' ? 2 : 3
      const xp = base + (combo >= 3 ? 1 : 0)
      onXp?.(xp); flyXp(xp, combo >= 3 ? '#c4b5fd' : '#fde68a')
      if (combo === 5) onCrystal?.('purple', 1, 'grammar_combo_5', { book: bookId, unit: unitLabel, mode })
      if (combo === 10) onCrystal?.('purple', 2, 'grammar_combo_10', { book: bookId, unit: unitLabel, mode })
      setScore(s => ({ ...s, right: s.right + 1 }))
    } else {
      setPandaMood('wrong'); sounds.playError?.()
      comboRef.current = 0
      setScore(s => ({ ...s, wrong: s.wrong + 1 }))
    }
  }

  function next() {
    if (idx < totalQ - 1) {
      setIdx(i => i + 1)
    } else {
      // 全部完成 → 发奖励
      if (!rewardedRef.current) {
        rewardedRef.current = true
        const total = totalQ
        const correct = score.right + (right ? 1 : 0)
        const perfect = correct === total
        // 持久化分数（取最高分）
        try { saveGrammarScore(bookId, unitLabel, mode, correct, total) } catch {}
        const passed = correct >= Math.ceil(total * 0.7)
        if (mode === 'lesson') {
          onXp?.(8)
          onCrystal?.('blue', 1, 'grammar_lesson_done', { book: bookId, unit: unitLabel, correct, total })
          if (perfect) onCrystal?.('green', 2, 'grammar_lesson_perfect', { book: bookId, unit: unitLabel })
        } else {
          onXp?.(12)
          onCrystal?.('blue', 1, 'grammar_practice_done', { book: bookId, unit: unitLabel, correct, total })
          if (perfect) onCrystal?.('green', 3, 'grammar_practice_perfect', { book: bookId, unit: unitLabel })
          else if (passed) onCrystal?.('red', 1, 'grammar_practice_pass', { book: bookId, unit: unitLabel })
        }
        sounds.playVictory?.(); sounds.playFireworks?.()
      }
      setDone(true)
    }
  }

  // 结果页
  if (done) {
    const total = totalQ
    const correct = score.right
    const perfect = correct === total
    const passed = correct >= Math.ceil(total * 0.7)
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
        <OceanBg />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <PandaMascot mood={perfect ? 'correct' : passed ? 'idle' : 'wrong'} size={150}/>
          <div className="text-4xl">{perfect ? '🎉' : passed ? '⭐' : '💪'}</div>
          <div className="text-2xl font-bold text-white">{perfect ? '满分！太棒了！' : passed ? '通关！' : '再加把劲'}</div>
          <div className="flex gap-6 text-center mt-2">
            <div>
              <div className="text-3xl font-bold text-green-400">{correct}</div>
              <div className="text-sm text-gray-400 mt-1">答对</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">{score.wrong}</div>
              <div className="text-sm text-gray-400 mt-1">答错</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{Math.round((correct / total) * 100)}%</div>
              <div className="text-sm text-gray-400 mt-1">正确率</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold">
              返回单元
            </button>
            <button onClick={() => { setIdx(0); setPick(null); setScore({ right: 0, wrong: 0 }); setDone(false); comboRef.current = 0; rewardedRef.current = false }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              再来一遍
            </button>
          </div>
        </div>
      </div>
    )
  }

  const frac = ((idx + (pick !== null ? 1 : 0)) / totalQ)
  const modeLabel = mode === 'lesson' ? '语法一·讲解' : '语法二·练习'
  const modeColor = mode === 'lesson' ? 'from-amber-500 to-orange-500' : 'from-purple-600 to-fuchsia-500'

  return (
    <div className="w-full max-w-2xl mx-auto px-3 py-3 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <OceanBg/>

      {/* XP 飞字 */}
      {xpFlies.map(f => (
        <div key={f.id} className="xp-fly pointer-events-none fixed text-2xl font-extrabold select-none z-[200]"
          style={{ color: f.color, textShadow: '0 0 12px rgba(251,191,36,0.9), 0 2px 6px rgba(0,0,0,0.6)', left: '50%', top: '38%' }}>
          +{f.amount} XP
        </div>
      ))}

      {/* 头：返回 + 进度条 + 计数 */}
      <div className="relative z-10 flex items-center gap-3 mb-3">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white shrink-0">
          <IconArrowLeft size={18}/>
        </button>
        <div className="flex-1 min-w-0">
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full rounded-full" style={{
              width: `${frac * 100}%`,
              background: frac >= 0.999 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#3b82f6,#22d3ee)',
              transition: 'width .45s cubic-bezier(.34,1.56,.64,1)',
            }}>
              <div className="h-[3px] mt-[2px] mx-1 rounded-full bg-white/30"/>
            </div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
            <span>{modeLabel} · {bookName} {unitLabel}</span>
            <span>{idx + 1} / {totalQ} · ✅ {score.right}</span>
          </div>
        </div>
      </div>

      {/* 单元主题卡（仅头部小提示） */}
      <div className={`relative z-10 rounded-2xl bg-gradient-to-r ${modeColor} p-3 mb-3 shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{mode === 'lesson' ? '💡' : '✍️'}</div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base">{data.title}</div>
            <div className="text-white/80 text-xs truncate">{data.summary}</div>
          </div>
        </div>
      </div>

      {/* 题目卡 */}
      <div className="relative z-10 bg-slate-800/95 border border-slate-700 rounded-2xl p-5 shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <PandaMascot mood={pandaMood} size={64}/>
          <div className="flex-1 pt-1">
            <div className="text-white text-base sm:text-lg font-bold leading-snug">{q.q}</div>
            <div className="mt-1 text-[11px] text-slate-500">第 {idx + 1} 题 · 共 {totalQ} 题</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            const isPicked = pick === i
            const isCorrect = i === q.answer
            const reveal = pick !== null
            let cls = 'bg-slate-700/70 border-slate-600 text-slate-100 hover:bg-slate-700 hover:border-slate-500'
            if (reveal) {
              if (isCorrect) cls = 'bg-green-700 border-green-400 text-white shadow-[0_0_16px_rgba(34,197,94,0.5)]'
              else if (isPicked) cls = 'bg-red-700 border-red-400 text-white'
              else cls = 'bg-slate-700/40 border-slate-700 text-slate-400'
            }
            const letter = ['A', 'B', 'C', 'D'][i]
            return (
              <button key={i} disabled={pick !== null} onClick={() => onPick(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border-2 text-left text-sm sm:text-base font-medium transition-all active:scale-[0.98] ${cls}`}>
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                  ${reveal && isCorrect ? 'bg-white text-green-700' : reveal && isPicked ? 'bg-white text-red-700' : 'bg-slate-600 text-white'}`}>
                  {letter}
                </span>
                <span className="flex-1">{opt}</span>
                {reveal && isCorrect && <span className="text-xl">✓</span>}
                {reveal && isPicked && !isCorrect && <span className="text-xl">✕</span>}
              </button>
            )
          })}
        </div>

        {/* 解析 */}
        {pick !== null && (
          <div className={`mt-4 rounded-xl p-3 border ${right ? 'bg-green-900/30 border-green-700/50' : 'bg-amber-900/30 border-amber-700/50'}`}>
            <div className={`text-sm font-semibold mb-1 ${right ? 'text-green-300' : 'text-amber-300'}`}>
              {right ? '✓ 答对啦！' : '✗ 不对哦，正确答案是 ' + ['A', 'B', 'C', 'D'][q.answer]}
            </div>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">{q.explain}</div>
          </div>
        )}

        {pick !== null && (
          <button onClick={next}
            className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors active:scale-[0.98]">
            {idx < totalQ - 1 ? '下一题 →' : '查看结果 🎯'}
          </button>
        )}
      </div>

      {/* 知识点提示（语法一才显示） */}
      {mode === 'lesson' && data.keyPoints && (
        <div className="relative z-10 mt-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 p-3">
          <div className="text-xs text-amber-400 font-semibold mb-1.5">📖 本单元核心知识点</div>
          <ul className="text-xs text-slate-300 leading-relaxed list-disc pl-4 space-y-0.5">
            {data.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
